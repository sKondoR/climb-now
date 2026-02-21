import { STATUSES } from "@/lib/constants";

export type Status = typeof STATUSES[keyof typeof STATUSES] | null