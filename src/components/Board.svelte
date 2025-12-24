<script lang="ts">
  export let rows: number = 10
  export let cols: number = 10
  export let mode: 'solve' | 'build' | 'play' = 'solve'

  const cells = Array(rows * cols).fill(0)
</script>

<div class="p-2">
  <div class="flex items-center justify-between mb-2">
    <div class="text-sm text-muted">{rows} x {cols}</div>
  </div>

  <div class="bg-base-200 p-2 overflow-auto">
    <div class="grid gap-0" style="grid-template-columns: repeat({cols}, 1.75rem);">
      {#each cells as _, i}
        <div class="w-7 h-7 border bg-white"></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid { width: max-content }
</style>
