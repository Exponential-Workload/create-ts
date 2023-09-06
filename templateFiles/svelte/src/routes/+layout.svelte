<script lang="ts">
  import './global.scss';
  import { NotifHost } from 'opensveltenotif';
  import Fonts from '../util/NexusFonts/Fonts.svelte';
  import FontsPreloads from '../util/NexusFonts/FontsPreloads.svelte';
  import Meta from '../util/Meta/Meta.svelte';
</script>

<svelte:head>
  <Meta
    tags={{
      'theme-color': '#cc3200',
    }}
  />
  <FontsPreloads />
  <Fonts
    fonts={[
      // Put all fonts loaded in the app here:
      'Inter',
      {
        family: 'Roboto',
        // italic: [false, true],
        italic: false,
        weight: 500,
      },
    ]}
  />
</svelte:head>

<NotifHost />

<div id="appRoot">
  <slot />
</div>

<style lang="scss">
  #appRoot {
    // no blinding ppl
    background: var(--background-primary);
    color: #ffffff;
    // remove ugly default fonts
    font-family: var(--font-default, Inter), system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
    // positioning
    position: fixed;
    top: 0;
    left: 0;
    // display control
    width: 100vw;
    height: 100vh;
    // overflow control
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
