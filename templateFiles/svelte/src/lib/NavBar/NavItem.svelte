<script lang="ts">
  import { page } from '$app/stores';
  import {
    Notification,
    NotificationType,
    addNotification,
  } from 'opensveltenotif';
  export let avatar =
    'https://source.unsplash.com/random/200x200/?landscape' as string | null;
  export let closeable = false;
  export let to = '/';
  export let active = null as null | boolean;
  export let center = false;
  export let sticky = false;

  const addTrailingSlash = (str: string) =>
    str.endsWith('/') ? str : `${str}/`;
  $: isActive =
    active === null
      ? addTrailingSlash($page.url.pathname) === addTrailingSlash(to)
      : active;

  const closeNav = () => {
    addNotification(
      new Notification(
        'Not Implemented',
        'This demo does not contain this functionality!',
        NotificationType.Error
      )
    );
  };
</script>

<a class="navItem" href={to} class:active={isActive} class:center class:sticky>
  {#if avatar}
    <img src={avatar} alt="avatar" />
  {/if}
  <slot />
  {#if closeable}
    <div
      class="close"
      style="margin-left:auto"
      on:click={closeNav}
      on:keypress={closeNav}
      role="button"
      tabindex="0"
    >
      ×
    </div>
  {/if}
</a>

<style lang="scss">
  .navItem {
    background: var(--overlay-light-1);
    border-radius: 5px;
    padding: 12px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: 5px;
    color: #fff;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.0666666667);
    &.sticky {
      backdrop-filter: blur(16px);
      z-index: 2;
      position: sticky;
      top: 0;
    }
    &.active {
      background: var(--overlay-light-2);
      cursor: default;
      .close {
        display: flex;
        cursor: pointer;
      }
    }
    &.center {
      text-align: center;
      justify-content: center;
    }
    .close {
      display: none;
      height: 15px;
      width: 15px;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 1.1em;
      height: 1.1em;
      border-radius: 5px;
    }
  }
</style>
