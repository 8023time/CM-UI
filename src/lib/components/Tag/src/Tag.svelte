<script>
  /**
   * @description 标签组件
   * type: 标签类型，可选值 primary, success, danger, warning, info
   * size: 标签尺寸，可选值 small, middle, large
   * them ： 标签主题，可选值 light, dark, plain
   * plain: 是否为朴素标签
   * round: 是否为圆角标签
   */
  let { type = 'primary', size = 'middle', them = 'dark', round = false, children } = $props();

  let themsClass = {
    light: 'Tag-light',
    dark: 'Tag-dark',
    plain: 'Tag-plain',
  };
  let classes = $state(['Tag', `Tag-${type}`, `Tag-${size}`, them && themsClass[them], round && 'Tag-round'].filter(Boolean).join(' '));
</script>

<span class={classes}>
  {@render children()}
</span>

<style lang="scss" scoped>
  :root {
    // 基础颜色
    --primary: var(--blue);
    --success: var(--green);
    --danger: var(--red);
    --warning: var(--orange);
    --info: var(--gray);
  }
  .Tag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25em 0.6em;
    font-size: 0.875rem;
    border-radius: 4px;
    user-select: none;
    white-space: nowrap;
    line-height: 1;
  }
  .Tag-small {
    font-size: 12px;
    padding: 0.2em 0.5em;
  }
  .Tag-middle {
    font-size: 14px;
    padding: 0.3em 0.6em;
  }
  .Tag-large {
    font-size: 16px;
    padding: 0.4em 0.8em;
  }
  // 类型颜色
  .Tag-primary {
    background-color: var(--primary);
    color: white;
  }
  .Tag-success {
    background-color: var(--success);
    color: white;
  }
  .Tag-danger {
    background-color: var(--danger);
    color: white;
  }
  .Tag-warning {
    background-color: var(--warning);
    color: black;
  }
  .Tag-info {
    background-color: var(--info);
    color: black;
  }
  // 主题颜色
  .Tag-light.Tag-primary {
    background-color: color-mix(in srgb, var(--blue) 10%, white 90%);
    border: 1px solid var(--primary);
    color: var(--primary);
  }
  .Tag-light.Tag-success {
    background-color: color-mix(in srgb, var(--green) 10%, white 90%);
    border: 1px solid var(--success);
    color: var(--success);
  }
  .Tag-light.Tag-danger {
    background-color: color-mix(in srgb, var(--red) 10%, white 90%);
    border: 1px solid var(--danger);
    color: var(--danger);
  }
  .Tag-light.Tag-warning {
    background-color: color-mix(in srgb, var(--orange) 10%, white 90%);
    border: 1px solid var(--orange);
    color: var(--warning);
  }
  .Tag-light.Tag-info {
    background-color: color-mix(in srgb, var(--gray) 10%, white 90%);
    border: 1px solid var(--gray);
    color: var(--info);
  }
  .Tag-dark.Tag-primary {
    background-color: var(--primary);
    color: white;
  }
  .Tag-dark.Tag-success {
    background-color: var(--success);
    color: white;
  }
  .Tag-dark.Tag-danger {
    background-color: var(--danger);
    color: white;
  }
  .Tag-dark.Tag-warning {
    background-color: var(--warning);
    color: white;
  }
  .Tag-dark.Tag-info {
    background-color: var(--info);
    color: white;
  }
  .Tag-plain.Tag-primary {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
  }
  .Tag-plain.Tag-success {
    background-color: transparent;
    border: 1px solid var(--success);
    color: var(--success);
  }
  .Tag-plain.Tag-danger {
    background-color: transparent;
    border: 1px solid var(--danger);
    color: var(--danger);
  }
  .Tag-plain.Tag-warning {
    background-color: transparent;
    border: 1px solid var(--warning);
    color: var(--warning);
  }
  .Tag-plain.Tag-info {
    background-color: transparent;
    border: 1px solid var(--info);
    color: var(--info);
  }
  .Tag-round.Tag-primary {
    border-radius: 999px;
    border: 1px solid var(--primary);
  }
  .Tag-round.Tag-success {
    border-radius: 999px;
    border: 1px solid var(--success);
  }
  .Tag-round.Tag-danger {
    border-radius: 999px;
    border: 1px solid var(--danger);
  }
  .Tag-round.Tag-warning {
    border-radius: 999px;
    border: 1px solid var(--orange);
  }
  .Tag-round.Tag-info {
    border-radius: 999px;
    border: 1px solid var(--info);
  }
</style>
