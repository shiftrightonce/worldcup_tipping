<template>
  <q-card class="q-mb-md q-mr-md-md" flat bordered :class="{ 'bg-positive': currentUser }">
    <q-item>
      <q-item-section>
        <q-item-label>{{ (currentUser) ? 'Your Score' : score.user.username }}</q-item-label>
        <q-item-label caption>
          Position
          <q-badge :label="score.position" color="red" />
        </q-item-label>
      </q-item-section>
      <q-space />
      <q-btn flat round icon="visibility" @click="viewClosedPlacedTips"></q-btn>
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
              <q-item-label>{{ score.user.username }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Total Points</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ score.totalPoints }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Total Tips</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>{{ score.totalTips }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showPastTips" transition-show="rotate" transition-hide="rotate">
    <q-card>
      <q-card-section>
        <div class="text-h6">Past tips</div>
        <q-item-label caption lines="2" class="text-white">
          {{ score.user.username }}
        </q-item-label>
      </q-card-section>
      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-list>
          <q-item v-for="tip in pastTips.tips" :key="tip.internalId">
            <q-item-section>
              <q-item-label>Match {{ tip.match.number }}
              </q-item-label>
              <q-item-label caption lines="2" class="text-white">
                {{ tip.match.countryA.name }} v. {{ tip.match.countryB.name }}
              </q-item-label>
            </q-item-section>
            <q-item-section side tip>{{ tip.points }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { Tip } from 'src/stores/match-store'
import { Score, useTipStore } from 'src/stores/tip-store'
import { defineComponent, PropType, ref, reactive } from 'vue'
// import VersesImage from '../match/VersesImage.vue'

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
  setup (props) {
    const showPastTips = ref(false)
    const q = useQuasar()
    const tipStore = useTipStore()
    const pastTips: {
      tips: Tip[]
    } = reactive({ tips: [] })
    function viewClosedPlacedTips () {
      q.loading.show()
      tipStore.fetchUserClosedTips(props.score.user.internalId)
        .then((tips) => {
          pastTips.tips = tips
          showPastTips.value = !showPastTips.value
          q.loading.hide()
        }).catch(() => {
          q.loading.hide()
        })
    }
    return {
      showPastTips,
      pastTips,
      viewClosedPlacedTips
    }
  }
})
</script>
