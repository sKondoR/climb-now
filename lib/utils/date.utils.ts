export const isDateInRange = (startDate: string, endDate: string): boolean => {
  const now = new Date();
  const start = new Date(startDate)
  const end = new Date(endDate)

  return now >= start && now <= end
}

export const isDateBefore = (endDate: string): boolean => {
  const now = new Date()
  const end = new Date(endDate)
  return now >= end
}

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0]
}