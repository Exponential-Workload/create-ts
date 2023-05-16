<script lang="ts">
  import Fonts from '$lib/NexusFonts/Fonts.svelte';
  import FontsPreloads from '$lib/NexusFonts/FontsPreloads.svelte';
  import Meta from '../lib/Meta/Meta.svelte';
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
      'Cera Pro',
      // 'Inter',
      // {
      //   family: 'Roboto',
      //   italic: [false, true],
      //   weight: 500,
      // },
    ]}
  />
</svelte:head>

<div id="appRoot">
  <slot />
</div>

<style lang="scss">
  #appRoot {
    // no blinding ppl
    background: #1a1a1a;
    color: #ffffff;
    // remove ugly default fonts
    font-family: 'Cera Pro', Inter, 'Segoe UI', Tahoma, Geneva, Verdana,
      sans-serif; // Inter is imported in app.html
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
    // center everything
    /*
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    */
  }
</style>
