<script lang="ts">
  import type { PageData } from './$types';
  import Meta from '../../../../util/Meta/Meta.svelte';
  import ParentPage from '../../+page.svelte';
  import TitleBar from '$lib/TitleBar/TitleBar.svelte';
  import defaultAvatar from './defaultAvatar.png';
  import type { Message } from '$lib/NavBar/Conversation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type {
    KeyboardEventHandler,
    MouseEventHandler,
    TouchEventHandler,
  } from 'svelte/elements';
  import {
    Notification,
    NotificationType,
    addNotification,
  } from 'opensveltenotif';

  export let data: PageData;

  const accountUsername = 'You';

  const groupMessages = (messages: Message[]) => {
    const grouped: Message[][] = [];
    let lastAuthor = '';
    for (const message of messages) {
      if (message.author.name !== lastAuthor) {
        grouped.push([]);
      }
      grouped[grouped.length - 1].push(message);
      lastAuthor = message.author.name;
    }
    return grouped;
  };

  let conversationDiv: HTMLDivElement;
  onMount(() => {
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
  });

  // also scroll on navigate
  let uri = $page.url.pathname;
  $: if (uri !== $page.url.pathname) {
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
    uri = $page.url.pathname;
  }

  let input: HTMLInputElement;
  const onSend = (async (e: KeyboardEvent | TouchEvent | MouseEvent) => {
    if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
    e.preventDefault();
    const content = input.value;
    if (!content) return;
    input.value = '';
    const msg = {
      content,
      author: data.you,
      id: data.conversation!.messages.length.toString(36),
      time: Date.now(),
      sending: true,
    };
    data.conversation!.messages = [...data.conversation!.messages, msg];
    const rs = await fetch(`/api/send/${data.conversation!.id}`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        author: data.you,
      }),
    });
    if (rs.ok) {
      const res = await rs.json();
      data.conversation!.messages = [
        ...data.conversation!.messages.filter((v) => v.id !== msg.id),
        res,
      ];
      conversationDiv.scrollTop = conversationDiv.scrollHeight;
    } else {
      data.conversation!.messages = data.conversation!.messages.filter(
        (v) => v.id !== msg.id
      );
      addNotification(
        new Notification(
          'Error',
          'Failed to send message',
          NotificationType.Error
        )
      );
    }
  }) satisfies
    | KeyboardEventHandler<HTMLInputElement>
    | TouchEventHandler<HTMLButtonElement>
    | MouseEventHandler<HTMLButtonElement>;
  $: grouped = groupMessages(data.conversation?.messages ?? []);
</script>

<svelte:head>
  <Meta
    tags={{
      title: 'FakeGPT',
      description: 'A simple fake ChatGPT interface',
    }}
  />
</svelte:head>

{#if data.conversation}
  <div class="conversation" bind:this={conversationDiv}>
    <TitleBar>
      Conversation with {data.conversation.users
        .filter((v) => v.name !== accountUsername)
        .map((v) => v.name)
        .join(', ')}
    </TitleBar>
    <div class="messages">
      {#each grouped as cG}
        <div class="message">
          <div class="innerCentered">
            <div class="messageInner">
              <div
                class="profilePicture"
                style="background-image:url({cG[0]?.author?.avatar ??
                  defaultAvatar});"
              />
              <div class="messageContents">
                <div class="messageAuthor">
                  {cG[0]?.author?.name}
                </div>
                {#each cG as c}
                  <div class="messageContent" class:sending={c.sending}>
                    {c.content}
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    <div class="chatBox">
      <div class="input innerCentered">
        <input
          type="text"
          placeholder="Type a message..."
          bind:this={input}
          on:keypress={onSend}
        />
        <button on:click={onSend}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            class="h-4 w-4 m-1 md:m-0"
            stroke-width="2"
            ><path
              d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
              fill="currentColor"
            /></svg
          >
        </button>
      </div>
    </div>
  </div>
{:else}
  <ParentPage />
{/if}

<style lang="scss">
  .conversation {
    display: flex;
    flex-direction: column;
    // justify-content: stretch;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .innerCentered {
      width: 768px;
      max-width: 90vw;
    }
    .messages {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      gap: 10px;
      .message {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        &:nth-child(odd) {
          background: var(--overlay-light-1);
        }
        .messageInner {
          display: flex;
          .profilePicture {
            $gap: 8px;
            margin-left: #{-36px - $gap};
            width: 36px;
            min-width: 36px;
            height: 36px;
            margin-right: #{$gap};
            background-size: cover;
            background-position: center;
            border-radius: 6px;
          }
          .messageAuthor {
            font-weight: 600;
          }
          .messageContent {
            color: #fffd;
            &:not(:last-child) {
              margin-bottom: 5px;
            }
            &.sending {
              opacity: 0.5;
            }
          }
        }
      }
    }
    .chatBox {
      position: sticky;
      bottom: 0;
      width: 100%;
      height: max-content;
      min-height: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      .input {
        // height: 48px;
        margin: 10px;
        margin-bottom: 20px;
        background: #2a2a2aaa;
        backdrop-filter: blur(8px);
        color: #fff;
        border: 1px solid #fff1;
        padding: 0px 10px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: stretch;
        > input[type='text'] {
          outline: none;
          border: 0px none #0000;
          background: #0000;
          color: #fff;
          padding: 15px 0;
          width: calc(100% - 24px);
        }
        > button {
          background: #0000;
          border: 0px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          > svg {
            color: #777;
            margin-top: 1px;
            transition: color 0.3s;
          }
          &:hover,
          &:active {
            > svg {
              color: #ddd;
            }
          }
        }
      }
    }
  }
</style>
