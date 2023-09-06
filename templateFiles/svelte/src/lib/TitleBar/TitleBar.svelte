<div class="title">
  <slot />
</div>

<style lang="scss">
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 61px;
    min-height: 61px;
    background: var(--overlay-light-1);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.3px;
    position: sticky;
    top: 0;
    z-index: 5;
    backdrop-filter: blur(16px);
  }
</style>
