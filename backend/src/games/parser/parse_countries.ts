import { Country, YearData } from "./types";

export const getParsedCountries = (yearData: YearData) => {
  const countries: { [key: string]: Country } = {};
  Object.values(yearData.groups).forEach((groups) => {
    groups.forEach((entry) => {
      countries[entry.id] = { ...entry };
    })
  })

  return countries;
}