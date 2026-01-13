<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { fetchLatestSensors } from '@/service/api/sensorApi';
import { $t } from '@/locales';
// import TopOperations from './modules/top-operations.vue';
import type { SensorLatestData, SensorLatestItem } from '@/types/api/sensor';
import ActualPanel from './modules/actual-panel.vue';
import SensorRealtime from './modules/sensor-realtime.vue';
import ChartPanel from './modules/chart-panel.vue';
import type { ActualHistory, AdviceItem, PredictResp, SensorReading } from './modules/types';

const actualHistory = ref<ActualHistory>({ ts: [], conc: [], trans: [] });

const sensors = ref<SensorLatestData>();

const form = reactive({
  modelId: 'model1',
  horizon: 60
});

// const modelOptions = ref([
//   { label: 'model1', value: 'model1' },
//   { label: 'model2', value: 'model2' },
//   { label: 'model3', value: 'model3' },
//   { label: 'model4', value: 'model4' }
// ]);

const lastActual = ref<{ time: string; conc: number; trans: number } | null>(null);
const predict = ref<PredictResp>({ ts: [], conc: [], trans: [] });
// const baselineConc = computed(() => predict.value.conc.at(0) ?? 0);
// const baselineTrans = computed(() => predict.value.trans.at(0) ?? 0);
const advice = ref<AdviceItem[]>([]);
const loading = ref(false);

/** ========== 假接口 ========== */

/**
 * 生成最近 N 次检测的 mock 数据
 * 以当前为 t，过去为 t-1、t-2 ... 依次标记
 */
function mockActualHistory(opts?: {
  count?: number;
  concBase?: number;
  concNoise?: number;
  transBase?: number;
  transNoise?: number;
}): ActualHistory {
  const { count = 10, concBase = 0.92, concNoise = 0.02, transBase = 72, transNoise = 3 } = opts || {};

  // 最近十次：t-9 ~ t
  const ts = Array.from({ length: count }, (_, i) => (i === count - 1 ? 't' : `t-${count - 1 - i}`));

  // 模拟浓度和透光率波动
  const conc = ts.map((_, i) =>
    Number((concBase + 0.01 * Math.sin(i / 2) + (Math.random() - 0.5) * concNoise).toFixed(3))
  );
  const trans = ts.map((_, i) =>
    Number((transBase + 1.2 * Math.cos(i / 3) + (Math.random() - 0.5) * (2 * transNoise)).toFixed(2))
  );

  return { ts, conc, trans };
}

/** 异步加载 mock 数据 */
async function loadMockActualHistory() {
  await new Promise<void>(resolve => {
    setTimeout(resolve, 300);
  });
  actualHistory.value = mockActualHistory();
}

/** 追加最新一次检测（替换最旧的） */
// function appendMockActualPoint() {
//   const ts = [...actualHistory.value.ts.slice(1), 't'];
//   const conc = [...actualHistory.value.conc.slice(1), Number((0.9 + Math.random() * 0.06).toFixed(3))];
//   const trans = [...actualHistory.value.trans.slice(1), Number((68 + Math.random() * 8).toFixed(2))];
//   actualHistory.value = { ts, conc, trans };
// }

function mockPredictApi(payload: { modelId: string; horizon: number }): Promise<PredictResp> {
  return new Promise(resolve => {
    setTimeout(() => {
      const len = Math.max(10, payload.horizon);
      const ts = Array.from({ length: len }, (_, i) => `t+${i + 1}`);
      const baseConc = 0.9;
      const baseTrans = 70;
      const conc = ts.map((_, i) => Number((baseConc + 0.05 * Math.sin(i / 4) + Math.random() * 0.01).toFixed(3)));
      const trans = ts.map((_, i) => Number((baseTrans + 5 * Math.cos(i / 5) + Math.random()).toFixed(2)));
      resolve({ ts, conc, trans });
    }, 300);
  });
}

function mockAdviceApi(): Promise<AdviceItem[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const controllableIds = ['S1', 'S2', 'S3'];
      const k = 3 + Math.floor(Math.random() * 3); // 3~5
      const picked = shuffle(controllableIds).slice(0, k);
      const items: AdviceItem[] = picked.map(id => {
        const s = sensors.value.find(x => x.id === id)!;
        const suggest = Number((s.value + (Math.random() - 0.5) * 10).toFixed(2));
        const predictedConc = Number((0.92 + Math.random() * 0.06).toFixed(3));
        const predictedTrans = Number((68 + Math.random() * 8).toFixed(2));
        return { sensorId: s.id, sensorName: s.name, suggestValue: suggest, predictedConc, predictedTrans };
      });
      resolve(items);
    }, 200);
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function refreshSensors() {}

async function runPredict() {
  loading.value = true;
  try {
    predict.value = await mockPredictApi({ modelId: form.modelId, horizon: form.horizon });
    advice.value = await mockAdviceApi();
    if (!lastActual.value) {
      const now = new Date();
      now.setHours(now.getHours() - 2);
      lastActual.value = {
        time: now.toISOString(),
        conc: Number((0.9 + Math.random() * 0.05).toFixed(3)),
        trans: Number((70 + Math.random() * 5).toFixed(2))
      };
    }
  } finally {
    loading.value = false;
  }
}

// function handleModelChange(v: string) {
//   form.modelId = v;
// }
// function handleHorizonChange(v: number) {
//   form.horizon = v;
// }

onMounted(async () => {
  sensors.value = await fetchLatestSensors();
  await runPredict();
  await loadMockActualHistory();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 顶部操作条 -->
    <!--    <TopOperations-->
    <!--      :model-id="form.modelId"-->
    <!--      :horizon="form.horizon"-->
    <!--      :model-options="modelOptions"-->
    <!--      :loading="loading"-->
    <!--      @update:model-id="handleModelChange"-->
    <!--      @update:horizon="handleHorizonChange"-->
    <!--      @refresh="refreshSensors"-->
    <!--      @predict="runPredict"-->
    <!--    />-->

    <ActualPanel :last-actual="lastActual" :actual-history="actualHistory" />

    <SensorRealtime :sensors="sensors" />

    <!--    <ChartPanel-->
    <!--      :title="$t('page.dashboard.chart.conc')"-->
    <!--      block-class="bg-success/5"-->
    <!--      :time="predict.ts"-->
    <!--      :data="predict.conc"-->
    <!--      label="conc"-->
    <!--      :height="20"-->
    <!--    />-->

    <ChartPanel
      :title="$t('page.dashboard.chart.trans')"
      block-class="bg-success/5"
      :time="predict.ts"
      :data="predict.trans"
      label="trans"
      :height="20"
    />

    <!--    <AdviceTable :data="advice" :baseline-conc="baselineConc" :baseline-trans="baselineTrans" />-->
  </div>
</template>
