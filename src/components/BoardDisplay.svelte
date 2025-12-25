<script lang="ts">
  import { Board } from "../lib/Board";

  export let PicrossBoard: Board;
  export let mode: 'solve' | 'build' | 'play' = 'solve'

  $: cells = Array(PicrossBoard.rows * PicrossBoard.cols).fill(0)
</script>

<div class="p-2">
  <div class="bg-base-200 p-2 overflow-auto flex justify-center">
    <div class="grid gap-0" style="grid-template-columns: repeat({PicrossBoard.cols}, 1rem);">
      {#each cells as _, i}
        <div class="w-4 h-4 border bg-white"></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grid { width: max-content }
</style>
