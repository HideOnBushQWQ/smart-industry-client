<script setup lang="ts">
import { NButton, NInputNumber, NSelect } from 'naive-ui';
import { $t } from '@/locales';

defineProps<{
  modelId: string;
  horizon: number;
  modelOptions: { label: string; value: string }[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelId', v: string): void;
  (e: 'update:horizon', v: number): void;
  (e: 'refresh'): void;
  (e: 'predict'): void;
}>();
</script>

<template>
  <div
    class="flex flex-wrap items-end gap-4 border rounded-2xl from-primary/10 via-primary/5 to-transparent bg-gradient-to-r p-4"
  >
    <!--    <div class="flex flex-col gap-2">-->
    <!--      <div class="text-lg opacity-70">{{ $t('page.dashboard.operation.selectModel') }}</div>-->
    <!--      <NSelect-->
    <!--        :value="modelId"-->
    <!--        :options="modelOptions"-->
    <!--        class="min-w-48"-->
    <!--        @update:value="v => emit('update:modelId', v as string)"-->
    <!--      />-->
    <!--    </div>-->

    <!--    <div class="flex flex-col gap-2">-->
    <!--      <div class="text-lg opacity-70">{{ $t('page.dashboard.operation.horizon') }}</div>-->
    <!--      <NInputNumber-->
    <!--        :value="horizon"-->
    <!--        :min="10"-->
    <!--        :max="240"-->
    <!--        class="min-w-40"-->
    <!--        @update:value="v => emit('update:horizon', Number(v))"-->
    <!--      />-->
    <!--    </div>-->

    <div class="ml-auto flex gap-3">
      <NButton secondary :loading="loading" @click="emit('refresh')">
        {{ $t('page.dashboard.operation.refresh') }}
      </NButton>
      <NButton type="primary" :loading="loading" @click="emit('predict')">
        {{ $t('page.dashboard.operation.start') }}
      </NButton>
    </div>
  </div>
</template>
