<script setup lang="ts">
import { h } from 'vue';
import { type DataTableColumns, NDataTable } from 'naive-ui';
import { $t } from '@/locales';
import type { AdviceItem } from '@/types/api/trans';

const props = defineProps<{
  data: AdviceItem[];
  baselineConc: number;
  baselineTrans: number;
}>();

function fmtDelta(v: number, digits = 3) {
  let arrow = '—';
  if (v > 0) arrow = '▲';
  else if (v < 0) arrow = '▼';

  let cls = 'text-warning';
  if (v > 0) cls = 'text-success';
  else if (v < 0) cls = 'text-error';

  return { arrow, text: Math.abs(v).toFixed(digits), cls };
}

const HIGHLIGHT_TH = { conc: 0.005, trans: 0.2 };

function rowClassName(row: AdviceItem) {
  const dC = row.predictedConc - props.baselineConc;
  const dT = row.predictedTrans - props.baselineTrans;
  if (Math.abs(dC) > HIGHLIGHT_TH.conc || Math.abs(dT) > HIGHLIGHT_TH.trans) {
    return dC > 0 || dT > 0 ? 'bg-success/6' : 'bg-error/6';
  }
  return '';
}

const columns: DataTableColumns<AdviceItem> = [
  { title: $t('page.dashboard.advice.sensor'), key: 'sensorName' },
  { title: $t('page.dashboard.advice.suggest'), key: 'suggestValue' },
  {
    title: $t('page.dashboard.advice.conc'),
    key: 'predictedConc',
    render: row => {
      const d = row.predictedConc - props.baselineConc;
      const { arrow, text, cls } = fmtDelta(d, 3);
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', null, row.predictedConc.toFixed(3)),
        h('span', { class: `text-xs ${cls}` }, `${arrow} ${text}`)
      ]);
    }
  },
  {
    title: $t('page.dashboard.advice.trans'),
    key: 'predictedTrans',
    render: row => {
      const d = row.predictedTrans - props.baselineTrans;
      const { arrow, text, cls } = fmtDelta(d, 2);
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', null, row.predictedTrans.toFixed(2)),
        h('span', { class: `text-xs ${cls}` }, `${arrow} ${text}`)
      ]);
    }
  }
];
</script>

<template>
  <!-- 保持原布局与类名 -->
  <div class="bg-foreground/2 border rounded-2xl p-4">
    <div class="mb-2 flex items-center justify-between">
      <div class="text-lg font-600">{{ $t('page.dashboard.advice.title') }}</div>
      <div class="flex items-center gap-3 text-xs opacity-70">
        <span class="inline-flex items-center gap-1">
          <span class="i-carbon-caret-up text-success"></span>
        </span>
        <span class="inline-flex items-center gap-1">
          <span class="i-carbon-caret-down text-error"></span>
        </span>
      </div>
    </div>
    <NDataTable :columns="columns" :data="data" size="medium" :bordered="false" :row-class-name="rowClassName" />
  </div>
</template>
