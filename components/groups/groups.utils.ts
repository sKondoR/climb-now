import { STATUSES } from '@/lib/constants'
import { Group } from '@/types'

export const isGroupOnline = (group: Group) => {
    return group.subgroups.find((subgroup) => subgroup.status === STATUSES.ONLINE)
}