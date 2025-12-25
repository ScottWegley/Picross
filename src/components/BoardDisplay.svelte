<script lang="ts">
  import { Board } from "../lib/Board";

  export let PicrossBoard: Board;

  $: cells = PicrossBoard.getCells();
  
  // Dynamic cell size: larger cells for small boards, smaller for large boards
  $: maxDim = Math.max(PicrossBoard.rows, PicrossBoard.cols);
  $: cellSize = maxDim <= 10 ? 32 : 
                maxDim <= 20 ? 24 : 
                maxDim <= 30 ? 20 : 16; // pixels
  
  let hoveredCell: number | null = null;
</script>

<div class="p-2">
  <div class="bg-base-200 p-2 overflow-auto flex justify-center">
    <div class="grid gap-0" style="grid-template-columns: repeat({PicrossBoard.cols}, {cellSize}px);">
      {#each cells as _, i}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="border" 
          class:bg-white={hoveredCell !== i}
          class:bg-orange-400={hoveredCell === i}
          style="width: {cellSize}px; height: {cellSize}px;"
          on:mouseenter={() => hoveredCell = i}
          on:mouseleave={() => hoveredCell = null}
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid { width: max-content }
</style>
