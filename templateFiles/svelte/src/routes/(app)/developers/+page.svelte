<script lang="ts">
  import TitleBar from '$lib/TitleBar/TitleBar.svelte';
</script>

<div class="conversation">
  <TitleBar>Developers</TitleBar>
  <div class="inner">
    <a href="/">Back to Safety</a>
    <p>
      If you're a developer: This is a demo.<br />
      The source code to the page you got here from is at
      <code>src/routes/(app)/+page.svelte</code>.<br />
      The source code to this page is at
      <code>src/routes/(app)/developers/+page.svelte</code>.<br />
      The source code to conversations is at
      <code>src/routes/(app)/c/[conversation]/+page.svelte</code>.<br /><br />
      If you're planning on using this, please swap out the fake data with a proper
      database or API. Also, swap out this page with a proper "Start a new Chat"
      page. You'll need to modify all .ts files in routes.<br />
      If you're not planning on using this, remove <code>src/routes/(app)</code>
      and <code>src/lib/*</code>
    </p>
  </div>
</div>

<style lang="scss">
  .conversation {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .inner {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      p {
        font-size: 1rem;
        line-height: 1.5rem;
        opacity: 0.5;
        text-align: center;
        code {
          background: var(--overlay-light-1);
          padding: 1px 3px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
