import * as cron from 'node-cron'
import { AppDataSource } from "../data-source";
import { getMatchByNumber } from "../service/match_service";

const matches = [];


cron.schedule('* * * * *', () => {
  console.log("cron job running: ", Date.now());
})