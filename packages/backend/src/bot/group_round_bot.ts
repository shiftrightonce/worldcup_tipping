import { Country, YearData } from '../games/parser/types';

export const generateRandomGroupPoints = (yearData: YearData) => {
  const groups: { [key: string]: Country[] } = JSON.parse(JSON.stringify(yearData.groups));

  for (const groupIndex in groups) {
    let maxPoints = 10;
    const generatedPoints = {};
    groups[groupIndex].forEach((team) => {
      let points = Math.floor(Math.random() * maxPoints);
      while (generatedPoints[points] !== undefined) {
        points = Math.floor(Math.random() * maxPoints);
      }
      generatedPoints[points] = true;

      (team as Country & { groupPoints: number }).groupPoints = points
    })
  }


  // console.log(groups);

  return groups;
}

