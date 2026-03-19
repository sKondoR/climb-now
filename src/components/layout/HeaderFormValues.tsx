'use client'

import { observer } from 'mobx-react-lite'

import { rootStore } from '@/src/store/root.store'

export default observer(
function HeaderFormValues() {

  const { isCommandFilterEnabled, command, code, isOnlyOnline } = rootStore.formStore;

  return (<span className="text-xs md:text-sm">
      <span className="text-nowrap ml-6 block md:inline">код соревнований: <span className="font-bold text-gray-900">{code || '-'}</span></span>
      <span className="text-nowrap ml-6 block md:inline">команда: <span className="font-bold text-gray-900">{command || '-'}</span></span>
      <span className="text-nowrap ml-6 block md:inline">только из региона: <span className="font-bold text-gray-900">{isCommandFilterEnabled ? 'true' : 'false'}</span></span>
      <span className="text-nowrap ml-6 block md:inline">только онлайн: <span className="font-bold text-gray-900">{isOnlyOnline ? 'true' : 'false'}</span></span>
    </span>
  )
})