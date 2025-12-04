<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full text-center transition-all hover:shadow-md hover:-translate-y-1"
  >
    <div class="flex justify-center mb-4">
      <slot name="logo" />
    </div>

    <h1 class="text-xl font-semibold mb-2 text-[#1C5E27]">
      <slot name="title" />
    </h1>

    <p class="text-gray-600 text-sm">
      <slot name="description" />
    </p>
  </div>
</template>
