<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchLatestSensors } from '@/service/api/sensorApi';
import { fetchLatestTrans, fetchPredTrans } from '@/service/api/trans';
import { $t } from '@/locales';
import type { SensorLatestItem } from '@/types/api/sensor';
import type { ActualHistory, PredictResp } from '@/types/api/trans';
import ActualPanel from './modules/actual-panel.vue';
import SensorRealtime from './modules/sensor-realtime.vue';
import ChartPanel from './modules/chart-panel.vue';

const actualHistory = ref<ActualHistory>({ ts: [], conc: [], trans: [] });

const sensors = ref<SensorLatestItem[]>([]);

const lastActual = ref<{ time: string; conc: number; trans: number } | null>(null);
const predict = ref<PredictResp>({ ts: [], conc: [], trans: [] });

async function loadTransData() {
  try {
    const transData = await fetchLatestTrans();

    if (transData?.latestTrans && Array.isArray(transData.latestTrans) && transData.latestTrans.length > 0) {
      // 按时间排序，确保最新的在最后
      const sortedData = [...transData.latestTrans].sort(
        (a, b) => new Date(a.detectTime).getTime() - new Date(b.detectTime).getTime()
      );

      // 提取时间和透光率数据，使用实际时间
      const ts = sortedData.map(item => item.detectTime);
      const transValues = sortedData.map(item => item.trans);

      // 更新历史数据
      actualHistory.value.ts = ts;
      actualHistory.value.trans = transValues;

      // 更新最新数据
      const latest = sortedData[sortedData.length - 1];
      if (lastActual.value) {
        lastActual.value.time = latest.detectTime;
        lastActual.value.trans = latest.trans;
      } else {
        lastActual.value = {
          time: latest.detectTime,
          conc: 0,
          trans: latest.trans
        };
      }
    }
  } catch {
    window.$message?.error('获取透光率数据失败');
  }
}

async function loadPredTransData() {
  try {
    const predData = await fetchPredTrans();

    if (
      predData?.predTransData?.after &&
      Array.isArray(predData.predTransData.after) &&
      predData.predTransData.after.length > 0
    ) {
      const afterData = predData.predTransData.after;

      // 转换为 ChartPanel 需要的格式，只保留时分秒
      const ts = afterData.map(item => {
        const date = new Date(item.predTime);
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      });
      const transValues = afterData.map(item => item.predTrans);

      // 更新预测数据
      predict.value.ts = ts;
      predict.value.trans = transValues;
    }
  } catch {
    window.$message?.error('获取透光率预测数据失败');
  }
}

onMounted(async () => {
  // 获取传感器数据
  try {
    const sensorData = await fetchLatestSensors();

    if (sensorData?.sensorList && Array.isArray(sensorData.sensorList) && sensorData.sensorList.length > 0) {
      sensors.value = sensorData.sensorList;
    }
  } catch {
    window.$message?.error('获取传感器数据失败');
  }

  // 获取透光率数据
  await loadTransData();

  // 获取透光率预测数据
  await loadPredTransData();
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
