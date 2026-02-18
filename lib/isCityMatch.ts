  export const isCityMatch = (city: string, selectedCity: string) => {
    return selectedCity && city.toLowerCase() === selectedCity.toLowerCase()
  }