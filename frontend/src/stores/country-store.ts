import { useAsyncState } from '@vueuse/core'
import { defineStore } from 'pinia'
import { Country } from './match-store'
import { UserRole, useUserStore } from './user-store'

export const countryEndpoint = '/api/v1/country'

export const useCountryStore = defineStore('countryStore', {
  state: () => ({
    countries: [] as Country[]
  }),
  actions: {
    fetchCountries () {
      return useAsyncState(new Promise<Country[]>((resolve, reject) => {
        const userStore = useUserStore()
        userStore.api.get(`${countryEndpoint}/all`)
          .then((response) => {
            console.log(response)
            this.countries = response.data.countries as Country[]
            resolve(this.countries)
          })
          .catch(reject)
      }), [])
    },
    async updateCountry (countryId: number, data: Record<string, unknown>) {
      const userStore = useUserStore()
      if (userStore.user?.role === UserRole.ADMIN) {
        const response = await userStore.api.put(`${countryEndpoint}/${countryId}`, data)
        return response.data
      }
    }
  }
})
