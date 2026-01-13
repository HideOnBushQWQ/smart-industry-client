<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { NCard, NGi, NGrid } from 'naive-ui';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import type { SensorLatestItem } from '@/types/api/sensor';

defineOptions({ name: 'SensorRealtime' });

const props = defineProps<{
  sensors: SensorLatestItem[];
}>();
const prevValueMap = ref<Record<string, number>>({});
/** 颜色与图标池（循环使用） */
const palettes = [
  { start: '#56cdf3', end: '#719de3', icon: 'mdi:chart-box-outline' },
  { start: '#865ec0', end: '#5144b4', icon: 'mdi:chart-box-outline' },
  { start: '#ec4786', end: '#b955a4', icon: 'mdi:chart-box-outline' },
  { start: '#fcbc25', end: '#f68057', icon: 'mdi:chart-box-outline' },
  { start: '#4cc9f0', end: '#4361ee', icon: 'mdi:chart-box-outline' }
];

type CardData = {
  key: string;
  title: string;
  value: number;
  prevValue: number;
  unit: string;
  decimals: number;
  color: { start: string; end: string };
  icon: string;
};

const cardData = computed<CardData[]>(() =>
  (props.sensors || []).map((s, i) => {
    const p = palettes[i % palettes.length];
    const prev = prevValueMap.value[s.id] ?? s.data;

    return {
      key: s.id,
      title: s.name,
      value: s.data,
      prevValue: prev,
      unit: s.unit,
      decimals: s.unit === '%' ? 2 : 3,
      color: { start: p.start, end: p.end },
      icon: p.icon
    };
  })
);

watch(
  () => props.sensors,
  newSensors => {
    newSensors?.forEach(s => {
      prevValueMap.value[s.id] = s.data;
    });
  },
  {
    deep: true,
    flush: 'post'
  }
);

interface GradientBgProps {
  gradientColor: string;
}
const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();
const themeStore = useThemeStore();

function getGradientColor(c: CardData['color']) {
  return `linear-gradient(to bottom right, ${c.start}, ${c.end})`;
}
</script>

<template>
  <div class="border rounded-2xl bg-primary/3 p-4">
    <div class="mb-3 text-lg font-600">{{ $t('page.dashboard.sensor.title') }}</div>

    <NCard :bordered="false" size="small" class="card-wrapper">
      <DefineGradientBg v-slot="{ $slots, gradientColor }">
        <div
          class="px-16px pb-4px pt-8px text-white"
          :style="{ backgroundImage: gradientColor, borderRadius: themeStore.themeRadius + 'px' }"
        >
          <component :is="$slots.default" />
        </div>
      </DefineGradientBg>
      <NGrid cols="s:1 m:2 l:5" responsive="screen" :x-gap="16" :y-gap="16">
        <NGi v-for="item in cardData" :key="item.key">
          <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
            <h3 class="text-16px">{{ item.title }}</h3>
            <div class="flex items-center justify-between pt-12px">
              <SvgIcon :icon="item.icon" class="text-32px opacity-90" />
              <CountTo
                :prefix="item.unit ? item.unit + ' ' : ''"
                :start-value="item.prevValue"
                :end-value="item.value"
                :decimals="item.decimals"
                :duration="800"
                class="text-30px text-white"
              />
            </div>
          </GradientBg>
        </NGi>
      </NGrid>
    </NCard>
  </div>
</template>

<style scoped></style>
