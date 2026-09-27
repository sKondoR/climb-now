'use client'

import { observer } from 'mobx-react-lite'

import { rootStore } from '@/src/store/root.store'

export default observer(
function HeaderFormValues() {

  const { isCommandFilterEnabled, command, code, isOnlyOnline } = rootStore.formStore;

  // На широких, но низких экранах (телефон боком) пункты переносятся, а не уезжают под кнопку
  return (<span className="text-xs md:text-sm md:flex md:flex-wrap md:justify-center md:gap-x-6">
      <span className="truncate ml-6 md:ml-0 block">код соревнований: <span className="font-bold text-gray-900">{code || '-'}</span></span>
      <span className="truncate ml-6 md:ml-0 block">команда: <span className="font-bold text-gray-900">{command || '-'}</span></span>
      <span className="truncate ml-6 md:ml-0 block">только команда: <span className="font-bold text-gray-900">{isCommandFilterEnabled ? 'да' : 'нет'}</span></span>
      <span className="truncate ml-6 md:ml-0 block">только онлайн: <span className="font-bold text-gray-900">{isOnlyOnline ? 'да' : 'нет'}</span></span>
    </span>
  )
})