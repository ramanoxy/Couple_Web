<template>
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#FFFDF9]">
    <!-- Animated Pastel Blob 1: Rose Quartz (Top-Right / Romance) -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-rose-soft/45 via-rose-quartz/35 to-rose-200/20 blur-3xl animate-blob-1"
    />

    <!-- Animated Pastel Blob 2: Serene Sky Blue (Bottom-Left / Calmness) -->
    <div
      class="absolute top-1/3 -left-28 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-sky-soft/40 via-sky-serene/30 to-sky-100/15 blur-3xl animate-blob-2"
    />

    <!-- Animated Pastel Blob 3: Cotton Candy Blend (Bottom-Center) -->
    <div
      class="absolute -bottom-28 right-0 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tl from-rose-soft/30 via-sky-serene/25 to-pink-100/20 blur-3xl animate-blob-3"
    />

    <!-- Subtle warm noise / fine shimmer grid overlay -->
    <div
      class="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"
    />
  </div>
</template>

<script setup lang="ts">
// Ambient Cotton Candy Liquid Glass background mesh
</script>
