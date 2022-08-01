export type Country = {
  id: string,
  name: string, 
  short: string,
  image: string
}

export type Match = {
  number: number,
  date: string,
  time: string,
  match: string,
  penalty: boolean
}

export type YearData = {
  groups: { [key: string]: Country[] },
  groupMatches: Match[],
  round16: Match[],
  round8: Match[],
  round4: Match[],
  thirdPlace: Match[],
  final: Match[]
}

export type GroupWinnerAndRunnerUp = {
  [group: string]: {
    winner: string,
    runnerUp: string
  }
}