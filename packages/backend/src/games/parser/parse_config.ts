import { config } from 'dotenv'
import { YearData } from './types';

config();

export const year = parseInt(process.env.WORLD_CUP_YEAR, 10)

export const getData = async () => {
  return (await import(`../${year}`)).default as YearData
}