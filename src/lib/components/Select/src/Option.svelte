<script>
  import { getContext, setContext } from 'svelte';
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import '../style/Option';

  // props
  let { value, label, disabled = false } = $props();

  /** 上下文通信 */
  const { add, sub, reset, getSelectShow, getOptionData, filterText, filterable, handerSelectValue, setActive } = getContext('SELECT-OPTIONS');

  // 状态管理
  let isSelectShow = $state(getSelectShow());
  let isSelected = $state(false);
  let isShow = $state(false);

  /** 订阅store @type {function} */
  const filterTextStore = filterText.subscribe((text) => {
    isShow = label.toLowerCase().includes(text.toLowerCase());
  });

  // 监听 isShow 变化
  $effect(() => {
    if (isSelectShow === true || isSelectShow === false) keepActive();
  });

  /**
   * 保持选中状态,存储选中状态不变
   * @type {function}
   */
  function keepActive() {
    if (setActive(value)) isSelected = true;
    else isSelected = false;
  }

  /**
   * 点击option,若之前选中,则取消选中,否则选中
   * @type {function}
   */
  function handerSelected() {
    if (disabled) return;
    if (handerSelectValue({ selectValue: value, selectLabel: label })) isSelected = true;
    else isSelected = false;
  }

  onMount(() => {
    keepActive();
    add();
    getOptionData({ value, label });
  });

  onDestroy(() => {
    filterTextStore();
    reset();
  });
</script>

<button class="dropdown-container {disabled ? 'disabled' : ''}  {isShow ? '' : 'hiddle'}" onclick={handerSelected} class:active={isSelected}>
  <li class="item">{label}</li>
</button>
