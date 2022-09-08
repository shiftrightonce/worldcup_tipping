import { Request, Response } from "express";
import { pluckUserFromRequest } from "../service/user_service";
import { UserRole } from "../entity/User";
import { getAllCountries, updateCountry } from "../service/country_service";

export class CountryController {

  public async allCountriesAction (req: Request, res: Response) {
    return this.whenUserIsAdmin(req, res, async () => {
      return {
        success: true,
        countries: await getAllCountries()
      }
    })
  }

  public async updateCountryAction (req: Request, res: Response) {
    return this.whenUserIsAdmin(req, res, async () => {
      const countryId = req.params.countryId;
      return await updateCountry(parseInt(countryId, 10), req.body);
    })
  }

  private async whenUserIsAdmin (req: Request, res: Response, callback: Function) {
    const user = pluckUserFromRequest(req)
    if (user.role !== UserRole.ADMIN) {
      return {
        success: false,
        code: 'permission_denied',
        message: 'You do not have the right permission'
      }
    } else {
      return await callback()
    }
  }
}