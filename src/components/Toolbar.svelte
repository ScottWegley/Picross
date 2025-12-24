<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  export let mode: 'solve' | 'build' | 'play' = 'solve'
  const dispatch = createEventDispatcher()

  function setMode(m: typeof mode) {
    dispatch('changeMode', m)
  }
</script>

<div class="btn-group">
  <button class="btn {mode==='solve' ? 'btn-active' : ''}" on:click={()=>setMode('solve')}>Solve</button>
  <button class="btn {mode==='build' ? 'btn-active' : ''}" on:click={()=>setMode('build')}>Build</button>
  <button class="btn {mode==='play' ? 'btn-active' : ''}" on:click={()=>setMode('play')}>Play</button>
</div>
