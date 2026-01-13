<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { NCard, NGi, NGrid, NStatistic } from 'naive-ui';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import ChartPanel from '@/views/dashboard/modules/chart-panel.vue';
import type { ActualHistory } from '@/views/dashboard/modules/types';

const props = defineProps<{
  lastActual: { time: string; conc: number; trans: number } | null;
  actualHistory: ActualHistory;
}>();

// const nextActualTime = computed(() => {
//   if (!props.lastActual) return '-';
//   const t = new Date(props.lastActual.time);
//   t.setHours(t.getHours() + 8);
//   return t.toLocaleString();
// });

/** 复用 home 风格：卡片头部渐变 + 主题圆角 */
const [DefineGradientBg, GradientBg] = createReusableTemplate<{ gradientColor: string }>();
const themeStore = useThemeStore();
function getGradientColor() {
  // 也可以改成从主题 token 拿颜色
  return 'linear-gradient(to bottom right, #56cdf3, #719de3)';
}
</script>

<template>
  <!-- 外层保持“原布局容器”的类：不改变页面整体排版 -->
  <div class="grid grid-cols-1 gap-4 border rounded-2xl bg-info/5 p-4 md:grid-cols-3">
    <!-- 用 NCard 承载，每格一个指标，保持对齐 -->
    <NCard :bordered="false" size="small" class="md:col-span-3">
      <!-- 渐变头（与 home 同样做法） -->
      <DefineGradientBg v-slot="{ $slots, gradientColor }">
        <div
          class="px-16px pb-8px pt-10px text-white"
          :style="{ backgroundImage: gradientColor, borderRadius: themeStore.themeRadius + 'px' }"
        >
          <component :is="$slots.default" />
        </div>
      </DefineGradientBg>

      <GradientBg :gradient-color="getGradientColor()">
        <div class="flex items-center gap-2">
          <SvgIcon icon="mdi:calendar-clock" class="text-20px opacity-90" />
          <h3 class="text-lg font-600">{{ $t('page.dashboard.actual.lastTime') }}</h3>
        </div>
        <div class="mt-6 text-20px font-600">
          {{ props.lastActual?.time ? new Date(props.lastActual.time).toLocaleString() : '-' }}
        </div>
      </GradientBg>

      <!-- 指标网格 -->
      <NGrid :x-gap="16" :y-gap="16" cols="s:1 m:3" responsive="screen" class="mt-12px">
        <!--        <NGi>-->
        <!--          <NPopover trigger="hover" raw :show-arrow="false" placement="top-end" :delay="300" :duration="300">-->
        <!--            <template #trigger>-->
        <!--              <div-->
        <!--                class="h-full cursor-pointer border rounded-xl bg-white/60 p-16px transition-all duration-300 hover:scale-[101%] dark:bg-white/5 hover:shadow-lg"-->
        <!--              >-->
        <!--                <div class="mb-8px flex items-center gap-2">-->
        <!--                  <SvgIcon icon="mdi:beaker" class="text-18px text-primary" />-->
        <!--                  <span class="text-sm opacity-70">{{ $t('page.dashboard.actual.lastConc') }}</span>-->
        <!--                </div>-->
        <!--                <NStatistic tabular-nums>-->
        <!--                  <CountTo-->
        <!--                    :start-value="0"-->
        <!--                    :end-value="Number(props.lastActual?.conc ?? 0)"-->
        <!--                    :decimals="3"-->
        <!--                    class="text-20px font-700"-->
        <!--                  />-->
        <!--                </NStatistic>-->
        <!--              </div>-->
        <!--            </template>-->

        <!--            <template #default>-->
        <!--              <div class="w-[clamp(340px,60vw,560px)]">-->
        <!--                <ChartPanel-->
        <!--                  :title="$t('page.dashboard.actual.lastConc')"-->
        <!--                  block-class="bg-success/5"-->
        <!--                  :time="actualHistory.ts"-->
        <!--                  :data="actualHistory.conc"-->
        <!--                  label="conc_hist"-->
        <!--                  :height="20"-->
        <!--                />-->
        <!--              </div>-->
        <!--            </template>-->
        <!--          </NPopover>-->
        <!--        </NGi>-->
        <NGi>
          <NPopover trigger="hover" raw :show-arrow="false" placement="top-end" :delay="300" :duration="300">
            <template #trigger>
              <div
                class="h-full cursor-pointer border rounded-xl bg-white/60 p-16px transition-all duration-300 hover:scale-[101%] dark:bg-white/5 hover:shadow-lg"
              >
                <div class="mb-8px flex items-center gap-2">
                  <SvgIcon icon="mdi:weather-sunny" class="text-18px text-warning" />
                  <span class="text-sm opacity-70">{{ $t('page.dashboard.actual.lastTrans') }}</span>
                </div>
                <NStatistic tabular-nums>
                  <template #default>
                    <CountTo
                      :start-value="0"
                      :end-value="Number(props.lastActual?.trans ?? 0)"
                      :decimals="2"
                      class="text-20px font-700"
                    />
                  </template>
                </NStatistic>
              </div>
            </template>
            <template #default>
              <div class="w-[clamp(340px,60vw,560px)]">
                <ChartPanel
                  :title="$t('page.dashboard.actual.lastTrans')"
                  block-class="bg-success/5"
                  :time="actualHistory.ts"
                  :data="actualHistory.trans"
                  label="trans_hist"
                  :height="20"
                />
              </div>
            </template>
          </NPopover>
        </NGi>
        <NGi>
          <!--          <div class="h-full border rounded-xl bg-white/60 p-16px dark:bg-white/5">-->
          <!--            <div class="mb-8px flex items-center gap-2">-->
          <!--              <SvgIcon icon="mdi:timer-sand" class="text-18px text-info" />-->
          <!--              <span class="text-sm opacity-70">{{ $t('page.dashboard.actual.nextTime') }}</span>-->
          <!--            </div>-->
          <!--            <div class="text-20px font-600">{{ nextActualTime }}</div>-->
          <!--          </div>-->
        </NGi>
      </NGrid>
    </NCard>
  </div>
</template>

<style scoped></style>
