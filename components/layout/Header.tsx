'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ResultsForm from '../forms/ResultsForm'
import HeaderFormValues from './HeaderFormValues'

const CollapsibleHeader = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleHeader = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <header className="bg-white border-b border-b-gray-300 relative">
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out  ${
            isExpanded ? 'max-h-96 opacommand-100' : 'max-h-0 opacommand-0'
          }`}
        >
          <div className="py-5 mx-auto px-4">
            <div className="flex flex-wrap justify-around items-center gap-4">
                <div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
                      ClimbNow
                  </div>
                  <div className="text text-gray-500">
                      Соревнования ФСР онлайн
                  </div>
                </div>
                <ResultsForm />
                <div className="w-[140px] hidden md:block"></div>
            </div>
          </div>
        </div>
        
        {!isExpanded && (
          <div className="py-1 px-6 flex items-center">
            <div className="my-2 text-xl font-bold bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              ClimbNow
            </div>
            <div className="flex-grow md:text-center">
              <HeaderFormValues />
            </div>
          </div>
        )}
        <button
            onClick={toggleHeader}
            className="absolute bottom-3 right-3 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
            aria-label={isExpanded ? "Свернуть шапку" : "Развернуть шапку"}
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