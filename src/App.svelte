<script lang="ts">
  import Toolbar from './components/Toolbar.svelte';
  import BoardDisplay from './components/BoardDisplay.svelte';
  import { Board } from "./lib/Board";

  type Mode = 'solve' | 'build' | 'play';
  let mode: Mode = 'solve';

  let rows: number = 3;
  let cols: number = 3;

  let PicrossBoard: Board = new Board(rows, cols);

  function handleModeChange(e: CustomEvent) {
    mode = e.detail
  }
</script>

<main class="p-4">
  <div class="mb-4">
    <Toolbar {mode} on:changeMode={handleModeChange} />
  </div>

  <section class="container mx-auto">
    <div class="card bg-base-100 shadow p-4">
      <BoardDisplay {PicrossBoard} {mode} />
    </div>
  </section>
</main>

<style>
  main { min-height: 100vh }
</style>
