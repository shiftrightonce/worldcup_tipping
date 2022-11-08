<template>
  <q-card class="q-mb-md q-mr-md-md" flat bordered :class="{'bg-positive': currentUser }">
    <q-item>
      <q-item-section>
        <q-item-label>{{ (currentUser)? 'Your Score': score.user.username }}</q-item-label>
        <q-item-label caption>
          Position <q-badge :label="score.position" color="red" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section horizontal>
      <q-card-section class="col-3">
        <q-avatar square size="100px" font-size="82px">
          <q-img :src="score.user.avatar" />
        </q-avatar>
      </q-card-section>
      <!-- <q-separator vertical /> -->
      <q-card-section class="col-8">
        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label>Username</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label >{{ score.user.username }}</q-item-label>
              </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Total Points</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label >{{ score.totalPoints }}</q-item-label>
              </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Position</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label >{{ score.position }}</q-item-label>
              </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Score } from 'src/stores/tip-store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ScoreboardCard',
  props: {
    score: {
      type: Object as PropType<Score>,
      required: true
    },
    currentUser: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  setup () {
    return {}
  }
})
</script>
