<script lang="ts">
  import { onMount } from 'svelte';
  import NavItem from './NavItem.svelte';

  export let sidebarWidth = 260;
  let navEl: HTMLElement;
  onMount(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === navEl) {
          sidebarWidth = entry.contentRect.width;
        }
      }
    });
    ro.observe(navEl);
  });
  export let conversations: {
    id: string;
    name: string;
    lastMessageTime: number;
    avatar: string | undefined;
  }[];
  let currentNavCategory = 'Never';
  const processNavCategory = (lastMessageTime: number) => {
    const date = new Date(lastMessageTime);
    const today = new Date();
    // if (date.getDate() === today.getDate()) {
    //   return 'Today';
    // } else if (date.getDate() === today.getDate() - 1) {
    //   return 'Yesterday';
    // } else if (date.getDate() > today.getDate() - 7) {
    //   return 'Last Week';
    // } else if (date.getDate() > today.getDate() - 30) {
    //   return 'Last Month';
    // } else if (date.getDate() > today.getDate() - 365) {
    //   return 'Last Year';
    // } else {
    //   return 'Older';
    // }
    const daysAgo = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo === 0) {
      return 'Today';
    } else if (daysAgo === 1) {
      return 'Yesterday';
    } else if (daysAgo < 7) {
      return 'Last Week';
    } else if (daysAgo < 30) {
      return 'Last Month';
    } else if (daysAgo < 365) {
      return 'Last Year';
    } else {
      return 'Older';
    }
  };
  const handleNavCategory = (lastMessageTime: number) => {
    const cat = processNavCategory(lastMessageTime);
    if (cat !== currentNavCategory) {
      currentNavCategory = cat;
      return true;
    } else return false;
  };
  const getNavCategory = () => currentNavCategory;
</script>

<nav bind:this={navEl}>
  <NavItem avatar={null} center sticky>New Conversation</NavItem>
  {#each conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime) as conversation}
    {#if handleNavCategory(conversation.lastMessageTime)}
      <div class="navCategory">
        <p>{getNavCategory()}</p>
      </div>
    {/if}
    <NavItem
      closeable
      to="/c/{conversation.id}"
      avatar={conversation.avatar ?? null}>{conversation.name}</NavItem
    >
  {/each}
</nav>

<style lang="scss">
  nav {
    height: calc(100vh - 10px);
    width: 260px;
    padding: 5px;
    background: var(--overlay-light-2);
    overflow-y: auto;
    overflow-x: hidden;
    resize: horizontal;
    min-width: 210px;
    max-width: min(500px, 50vw);
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    flex-direction: column;
    gap: 5px;
    > .navCategory {
      padding: 5px 5px;
      text-align: center;
      > p {
        margin: 0;
        opacity: 0.5;
      }
    }
  }
</style>
