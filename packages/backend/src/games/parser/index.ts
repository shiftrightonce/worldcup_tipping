import { getParsedRound8Matches } from './parsed_round_8'
import { year, getData } from './parse_config'
import { getParsedCountries } from './parse_countries'
import { getParsedFinalMatches } from './parse_final'
import { getParsedGroupMatches } from './parse_group_matches'
import { getParsedRound16Matches } from './parse_round_16'
import { getParsedRound4Matches } from './parse_round_4'
import { getParsedThirdPlaceMatches } from './parse_third_place'

export * from './types'



export {
  year,
  getData,
  getParsedCountries,
  getParsedFinalMatches,
  getParsedGroupMatches,
  getParsedRound4Matches,
  getParsedRound16Matches,
  getParsedThirdPlaceMatches,
  getParsedRound8Matches
}