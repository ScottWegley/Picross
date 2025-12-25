<script lang="ts">
  import Toolbar from './components/Toolbar.svelte';
  import BoardDisplay from './components/BoardDisplay.svelte';
  import { Board } from "./lib/Board";

  type Mode = 'solve' | 'build' | 'play';
  let mode: Mode = 'build';

  let rows: number = 10;
  let cols: number = 10;

  let PicrossBoard: Board = new Board(rows, cols);

  function handleModeChange(e: CustomEvent) {
    mode = e.detail
  }

  function handleSizeChange() {
    PicrossBoard = new Board(rows, cols);
  }
</script>

<main class="p-4">
  <div class="mb-4">
    <Toolbar {mode} on:changeMode={handleModeChange} />
  </div>

  <section class="container mx-auto flex justify-center">
    <div class="card bg-base-100 shadow p-4">
      <div class="flex gap-4 mb-4 items-center justify-center">
        <label class="flex items-center gap-2">
          <span class="text-sm font-medium">Rows:</span>
          <input type="number" bind:value={rows} on:change={handleSizeChange} min="1" max="50" class="input input-bordered input-sm w-20" />
        </label>
        <label class="flex items-center gap-2">
          <span class="text-sm font-medium">Cols:</span>
          <input type="number" bind:value={cols} on:change={handleSizeChange} min="1" max="50" class="input input-bordered input-sm w-20" />
        </label>
      </div>
      <BoardDisplay {PicrossBoard} {mode} />
    </div>
  </section>
</main>

<style>
  main { min-height: 100vh }
</style>
