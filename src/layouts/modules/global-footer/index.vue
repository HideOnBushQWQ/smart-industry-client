<script setup lang="ts">
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <div>
      <span>© 2025-2026 BUPT Powered By HongyanAI | Based on</span>
      <a
        href="https://github.com/soybeanjs/soybean-admin/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
        class="transition-all duration-200 hover:text-blue"
      >
        Soybean Admin
      </a>
      <span>(MIT License)</span>
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
