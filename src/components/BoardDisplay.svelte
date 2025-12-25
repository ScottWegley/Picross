<script lang="ts">
  import { Board } from "../lib/Board";

  export let PicrossBoard: Board;
  export let mode: 'solve' | 'build' | 'play' = 'solve'

  const cells = Array(PicrossBoard.rows * PicrossBoard.cols).fill(0)
</script>

<div class="p-2">
  <div class="flex items-center justify-between mb-2">
    <div class="text-sm text-muted">{PicrossBoard.rows} x {PicrossBoard.cols}</div>
  </div>

  <div class="bg-base-200 p-2 overflow-auto">
    <div class="grid gap-0" style="grid-template-columns: repeat({PicrossBoard.cols}, 1.75rem);">
      {#each cells as _, i}
        <div class="w-7 h-7 border bg-white"></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid { width: max-content }
</style>
