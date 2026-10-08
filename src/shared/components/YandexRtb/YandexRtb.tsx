'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    yaContextCb?: (() => void)[];
    Ya?: { Context: { AdvManager: { render: (params: Record<string, string>) => void } } };
  }
}

// Блок РСЯ R-A-20201132-1 (тип «лента»). Код из кабинета, переписанный под React:
// очередь yaContextCb заводим сами — эффект может сработать раньше, чем загрузится context.js,
// а context.js при загрузке выполнит всё, что накопилось в очереди
const YandexRtb = ({ blockId }: { blockId: string }) => {
  const containerId = `yandex_rtb_${blockId}`;

  useEffect(() => {
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya?.Context.AdvManager.render({ blockId, renderTo: containerId, type: 'feed' });
    });
  }, [blockId, containerId]);

  return (
    <>
      <Script src="https://yandex.ru/ads/system/context.js" strategy="afterInteractive" />
      <div id={containerId} />
    </>
  );
};

export default YandexRtb;
