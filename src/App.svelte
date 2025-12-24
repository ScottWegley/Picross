<script lang="ts">
  import Toolbar from './components/Toolbar.svelte'
  import Board from './components/Board.svelte'

  type Mode = 'solve' | 'build' | 'play'
  let mode: Mode = 'solve'
  let rows = 10
  let cols = 10

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
      <Board {rows} {cols} {mode} />
    </div>
  </section>
</main>

<style>
  main { min-height: 100vh }
</style>
