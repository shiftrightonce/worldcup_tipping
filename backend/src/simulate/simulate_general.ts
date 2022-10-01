import { Match, MatchRound, MatchStatus } from "../entity/Match";
import { Tip } from "../entity/Tip";
import { User } from "../entity/User";
import { getUserRepo } from "../service/user_service";
import { year as configYear } from "../games/parser"
import { placeUserTip } from "../service/tip_service";
import { updateMatch } from "../service/match_service";
import * as cliProgress from 'cli-progress';

const run = {
  tip: false,
  match: false
};


if (process.argv.length >= 3) {
  const toRun = process.argv[2].toString().trim();
  run.tip = toRun === '-t';
  run.match = toRun === '-m';
} else {
  run.tip = true;
  run.match = true;
}

export const getAllUsers = async () => {
  return await getUserRepo().find();
}

export const simulateUserTip = async (match: Match, user: User, round: MatchRound, year = configYear) => {
  const countryAScore = Math.random() * 12 + 1;
  const countryBScore = Math.random() * 12 + 1;
  const tip = new Tip();
  tip.year = year;
  tip.user = user;
  tip.match = match;
  tip.countryAToScore = countryAScore;
  tip.countryBToScore = countryBScore;

  if (match.countryA && match.countryB) {
    if (countryAScore !== countryBScore) {
      tip.toWin = (countryAScore > countryBScore) ? match.countryA : match.countryB;
    } else if (round === MatchRound.GROUP) {
      tip.isLevel = true;
    } else {
      tip.toPenalty = true;

      let countryAPernaltyScore = Math.random() * 12 + 1;
      let countryBPernaltyScore = Math.random() * 12 + 1;

      while (countryAPernaltyScore === countryBPernaltyScore) {
        countryAPernaltyScore = Math.random() * 12 + 1;
        countryBPernaltyScore = Math.random() * 12 + 1;
      }

      tip.countryAPenaltyToScore = countryAPernaltyScore;
      tip.countryBPenaltyToScore = countryBPernaltyScore;
      tip.toWin = (countryAPernaltyScore > countryBPernaltyScore) ? match.countryA : match.countryB;
    }

    return await placeUserTip(tip, user.id);
  }
}

export const simulateMatchPlay = async (match: Match, round: MatchRound) => {

  const countryAScore = Math.floor(Math.random() * 12 + 1);
  const countryBScore = Math.floor(Math.random() * 12 + 1);
  const data: Record<string, unknown> = {};

  data.countryAGoals = countryAScore;
  data.countryBGoals = countryBScore;

  if (match.countryA && match.countryB) {
    if (countryAScore !== countryBScore) {
      data.winner = (countryAScore > countryBScore) ? match.countryA : match.countryB;
    } else if (round !== MatchRound.GROUP) {
      data.penalty = true;
      data.countryAPenaltyGoals = Math.floor(Math.random() * 12 + 1);
      data.countryBPenaltyGoals = Math.floor(Math.random() * 12 + 1);

      while (data.countryAPenaltyGoals === data.countryBPenaltyGoals) {
        data.countryAPenaltyGoals = Math.floor(Math.random() * 12 + 1);
        data.countryBPenaltyGoals = Math.floor(Math.random() * 12 + 1);
      }

      data.winner = (data.countryAPenaltyGoals > data.countryBPenaltyGoals) ? match.countryA : match.countryB;

    }

    data.status = MatchStatus.SCORE_ENTERED;

    return await updateMatch(match.id, data);
  }

}

export const runTippingSimulation = async (matches: Match[], users: User[], round: MatchRound) => {
  const bar1 = new cliProgress.SingleBar({
    clearOnComplete: false,
  }, cliProgress.Presets.shades_classic);

  console.log('Placing users\' tips:\r');
  bar1.start(matches.length * users.length, 0);

  for (const match of matches) {
    for (const user of users) {
      await simulateUserTip(match, user, round);
      bar1.increment();
    }
  }

  bar1.stop();

}

export const runMatchPlaySimulation = async (matches: Match[], round: MatchRound) => {
  const bar2 = new cliProgress.SingleBar({
    clearOnComplete: false,
  }, cliProgress.Presets.shades_classic);

  console.log('Playling matches:\r');
  bar2.start(matches.length, 0);

  for (const match of matches) {
    await simulateMatchPlay(match, round);
    bar2.increment();
  }
  bar2.stop();

}

export {
  run
}