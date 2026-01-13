<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

defineOptions({
  name: 'DashboardGuide'
});

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));
const { routerPushByKey } = useRouterPush();

const steps = computed(() => [
  {
    title: $t('page.home.dashboardGuide.steps.monitorTitle'),
    desc: $t('page.home.dashboardGuide.steps.monitorDesc')
  },
  {
    title: $t('page.home.dashboardGuide.steps.compareTitle'),
    desc: $t('page.home.dashboardGuide.steps.compareDesc')
  }
]);

const tags = computed(() => [
  $t('page.home.dashboardGuide.quickTags.realtime'),
  $t('page.home.dashboardGuide.quickTags.forecast'),
  $t('page.home.dashboardGuide.quickTags.advice')
]);

function goDashboard() {
  routerPushByKey('dashboard');
}
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:16">
        <NList>
          <NListItem v-for="item in steps" :key="item.title">
            <div class="flex flex-col gap-4px">
              <div class="text-16px font-600">{{ item.title }}</div>
              <div class="text-sm text-#999 leading-22px">{{ item.desc }}</div>
            </div>
          </NListItem>
        </NList>
      </NGi>
      <NGi span="24 s:24 m:8">
        <div class="h-full flex flex-col gap-12px">
          <div class="rounded-12px bg-primary/5 p-16px">
            <div class="text-16px font-semibold">{{ $t('page.home.dashboardGuide.quickTitle') }}</div>
            <div class="mt-6px text-#666 leading-22px">{{ $t('page.home.dashboardGuide.quickDesc') }}</div>
            <div class="mt-12px flex flex-wrap gap-8px">
              <NTag v-for="tag in tags" :key="tag" size="small" type="info" round>{{ tag }}</NTag>
            </div>
            <NButton class="mt-16px" type="primary" @click="goDashboard">
              {{ $t('page.home.dashboardGuide.button') }}
            </NButton>
          </div>
          <div class="text-sm text-#999 leading-20px">{{ $t('page.home.dashboardGuide.tip') }}</div>
        </div>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
