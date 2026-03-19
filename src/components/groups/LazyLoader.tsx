'use client'

import { useEffect, useRef, useState } from 'react'

interface LazyLoaderProps {
  children: React.ReactNode
  rootMargin?: string
}

export const LazyLoader = ({ children, rootMargin = '0px' }: LazyLoaderProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  const scrollContainer = document.querySelector('#page-scroll');

  useEffect(() => {
    const currentElement = elementRef.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (currentElement) observer.unobserve(currentElement)
          }
        })
      },
      {
        root: scrollContainer,
        rootMargin,
        threshold: 0.01,
      }
    )

    observer.observe(currentElement)

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootMargin])

  return <div ref={elementRef}>{isVisible && children}</div>
}
