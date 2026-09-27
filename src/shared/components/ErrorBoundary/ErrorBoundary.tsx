'use client'

import { Component, ReactNode } from 'react'
import Button from '../Button/Button'

interface ErrorBoundaryProps {
  children: ReactNode
  // Смена ключа (другая подгруппа) сбрасывает ошибку — новый протокол может отрисоваться нормально
  resetKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

// Сбой одной таблицы (например, сайт ФСР поменял разметку протокола) не должен ронять всю страницу
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Results table render error:', error)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mt-2 px-4 py-6 rounded-lg bg-red-50 text-red-800 text-center" role="alert">
        <h3 className="text-lg font-semibold mb-1">Не удалось показать протокол</h3>
        <p className="mb-4">Откройте его на сайте ФСР или попробуйте ещё раз.</p>
        <Button variant="danger" onClick={() => this.setState({ hasError: false })}>
          Повторить
        </Button>
      </div>
    )
  }
}
