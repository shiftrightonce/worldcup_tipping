import { getTodayOpenMatches } from "../service/match_service";

export class MatchController {

  public async todayMatchesAction () {
    return await getTodayOpenMatches()
  }
}