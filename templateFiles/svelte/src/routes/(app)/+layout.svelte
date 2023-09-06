<script lang="ts">
  import type { LayoutData } from './$types';
  import NavBar from '../../lib/NavBar/NavBar.svelte';
  let sidebarWidth = 260;

  export let data: LayoutData;
</script>

<div class="app">
  <NavBar bind:sidebarWidth conversations={data.conversations} />
  <main style="width: calc(100vw - {sidebarWidth}px);">
    <slot />
  </main>
</div>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: stretch;
    main {
      height: 100vh;
    }
  }
</style>
