<template>
  <div class="col-12 bg-blue-grey-10" style="min-height: 100vh;">
    <div class="row itemss-center" style="height:100%">
      <div class="col-8 col-xs-12 q-mt-xl">
        <div class="row justify-center">
          <div class="col-md-2 col-xs-11 q-mb-md q-mr-md-md">
            <q-card flat bordered class="my-card">
              <q-card-section>
                <div class="text-h6">Contact Me</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="q-mb-sm">
                  <span class="text-bold text-deep-orange-8">Email</span> <br />
                  jibaomansaray at gmail dot com
                </div>
                <div class="q-mb-sm">
                  <span class="text-bold text-deep-orange-8">Twitter</span> <br />
                  @JibaoMansaray
                </div>
                <div class="q-mb-sm">
                  <span class="text-bold text-deep-orange-8">Github</span> <br />
                  <a href="https://github.com/jibaomansaray" target="_blank">jibaomansaray</a>
                </div>
              </q-card-section>

              <q-separator inset />

              <q-card-section>
                <div class="q-mb-sm">
                  <span class="text-bold text-deep-orange-8">Full Source Code</span> <br />
                  <a href="https://github.com/jibaomansaray/worldcup_tipping"
                    target="_blank">worldcup_tipping</a>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContactPage'
})
</script>
