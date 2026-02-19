import { NextResponse } from 'next/server';
import net from 'net';
import dns from 'dns';
import { promisify } from 'util';
import https from 'https';
import http from 'http';

const lookup = promisify(dns.lookup);
const resolve = promisify(dns.resolve);

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 секунд на диагностику

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target') || '90.156.201.41';
  const port = parseInt(searchParams.get('port') || '443');
  
  const results: any = {
    timestamp: new Date().toISOString(),
    target,
    port,
    checks: {}
  };

  // 1. Базовая проверка - резолвится ли имя (если это домен)
  if (!net.isIP(target)) {
    try {
      const addresses = await resolve(target);
      results.checks.dnsResolve = addresses;
    } catch (e: any) {
      results.checks.dnsResolve = { error: e.message };
    }
  }

  // 2. TCP соединение с таймаутами
  results.checks.tcpConnection = await new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve({
          success: false,
          error: 'CONNECTION_TIMEOUT',
          duration: Date.now() - start,
          message: `TCP connection timeout after ${Date.now() - start}ms`
        });
      }
    }, 10000); // 10 секунд таймаут

    socket.on('connect', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        const duration = Date.now() - start;
        socket.destroy();
        resolve({
          success: true,
          duration,
          localAddress: socket.localAddress,
          localPort: socket.localPort
        });
      }
    });

    socket.on('error', (error: any) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          success: false,
          error: error.code || error.message,
          message: error.message,
          duration: Date.now() - start
        });
      }
    });

    socket.connect(port, target);
  });

  // 3. Проверка всех IP адресов (если есть несколько)
  if (!net.isIP(target)) {
    try {
      const addresses = await lookup(target, { all: true });
      results.checks.allIps = addresses;
      
      // Проверяем каждый IP отдельно
      results.checks.ipChecks = {};
      for (const addr of addresses) {
        const ip = addr.address;
        results.checks.ipChecks[ip] = await new Promise((resolve) => {
          const start = Date.now();
          const socket = new net.Socket();
          let resolved = false;
          
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              socket.destroy();
              resolve({
                success: false,
                error: 'TIMEOUT',
                duration: Date.now() - start
              });
            }
          }, 5000);
          
          socket.on('connect', () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              socket.destroy();
              resolve({
                success: true,
                duration: Date.now() - start
              });
            }
          });
          
          socket.on('error', (error) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve({
                success: false,
                error: error.message,
                duration: Date.now() - start
              });
            }
          });
          
          socket.connect(port, ip);
        });
      }
    } catch (e: any) {
      results.checks.allIps = { error: e.message };
    }
  }

  // 4. Проверка с разными family (IPv4/IPv6)
  try {
    results.checks.family4 = await new Promise((resolve) => {
      const start = Date.now();
      const socket = new net.Socket();
      let resolved = false;
      
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          socket.destroy();
          resolve({
            success: false,
            error: 'TIMEOUT',
            duration: Date.now() - start
          });
        }
      }, 5000);
      
      socket.on('connect', () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          socket.destroy();
          resolve({
            success: true,
            duration: Date.now() - start
          });
        }
      });
      
      socket.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({
            success: false,
            error: error.message,
            duration: Date.now() - start
          });
        }
      });
      
      // Пытаемся подключиться с принудительным IPv4
      (socket as any).connect({
        host: target,
        port,
        family: 4
      });
    });
  } catch (e: any) {
    results.checks.family4 = { error: e.message };
  }

  // 5. Проверка HTTP (не HTTPS) соединения
  if (port === 443) {
    try {
      results.checks.httpTest = await new Promise((resolve) => {
        const req = http.get(`http://${target}:80`, {
          timeout: 5000
        }, (res) => {
          resolve({
            success: true,
            statusCode: res.statusCode,
            headers: res.headers
          });
          res.destroy();
        });
        
        req.on('error', (error) => {
          resolve({
            success: false,
            error: error.message
          });
        });
        
        req.on('timeout', () => {
          req.destroy();
          resolve({
            success: false,
            error: 'HTTP TIMEOUT'
          });
        });
      });
    } catch (e: any) {
      results.checks.httpTest = { error: e.message };
    }
  }

  // 6. Информация о сети Vercel
  results.vercelNetwork = {
    region: process.env.VERCEL_REGION || 'unknown',
    environment: process.env.VERCEL_ENV || 'unknown',
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent')
  };

  // 7. Попытка полного HTTPS запроса с расшифровкой ошибки
  try {
    results.checks.httpsRequest = await new Promise((resolve) => {
      const start = Date.now();
      const req = https.get(`https://${target}:${port}`, {
        timeout: 10000,
        rejectUnauthorized: false, // Для диагностики игнорируем SSL ошибки
        family: 4
      }, (res) => {
        let data = '';
        res.on('data', () => {}); // Игнорируем данные
        res.on('end', () => {
          resolve({
            success: true,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            duration: Date.now() - start
          });
        });
      });
      
      req.on('error', (error: any) => {
        resolve({
          success: false,
          error: error.code || error.message,
          message: error.message,
          duration: Date.now() - start
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'HTTPS_TIMEOUT',
          duration: Date.now() - start
        });
      });
    });
  } catch (e: any) {
    results.checks.httpsRequest = { error: e.message };
  }

  // 8. Проверка маршрутизации (traceroute симуляция)
  results.checks.routing = {
    note: "Full traceroute not available, but here's connection path info",
    attempts: results.checks.tcpConnection,
    ipChecks: results.checks.ipChecks
  };

  return NextResponse.json(results);
}