'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'

const HeaderFormValues = dynamic(
  () => import('./HeaderFormValues'),
  { ssr: false }
)

const ResultsForm = dynamic(
  () => import('../forms/ResultsForm'),
  { ssr: false }
)

const CollapsibleHeader = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // На телефоне (в том числе в альбомной ориентации) по ссылке с кодом сразу показываем результаты: форма занимает почти весь первый экран
  useEffect(() => {
    const hasCode = new URL(window.location.href).searchParams.has('code')
    if (hasCode && window.matchMedia('(max-width: 767px), (max-height: 500px)').matches) {
      // URL и ширина экрана есть только в браузере: при начальном состоянии разошлась бы гидратация
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsExpanded(false)
    }
  }, [])

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <header className="bg-white border-b border-b-gray-300 relative z-30">
        <div
          inert={!isExpanded}
          className={`transition-all duration-300 ease-in-out  ${
            isExpanded ? 'max-h-[48rem] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="md:w-auto mx-auto md:mx-0">
                <Link href="/" className="text-5xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent text-center">
                    ClimbNow
                </Link>
                <div className="text-gray-500 text-center">
                    Соревнования ФСР онлайн
                </div>
              </div>
              <ResultsForm />
              <div className="w-[100px] hidden md:block"></div>
            </div>
          </div>
        </div>
        
        {!isExpanded && (
          <div className="py-1 pl-6 pr-14 flex items-center min-w-0">
            <div className="my-2 text-xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              ClimbNow
            </div>
            <div className="flex-grow min-w-0 md:text-center">
              <HeaderFormValues />
            </div>
          </div>
        )}
        <button
            onClick={toggleHeader}
            className="absolute bottom-3 right-3 transform -translate-x-1/2 before:absolute before:content-[''] before:-inset-1.5 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200 focus-ring"
            aria-label={isExpanded ? "Свернуть шапку" : "Развернуть шапку"}
            aria-expanded={isExpanded}
        >
            <FontAwesomeIcon 
              icon={isExpanded ? faChevronUp : faChevronDown} 
              className="text-gray-600 w-3 h-3"
            />
        </button>
      </header>
    </>
  );
};

export default CollapsibleHeader;