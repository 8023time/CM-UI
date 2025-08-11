<script>
  /**
   * @component Select + (Option)
   * @description 选择输入搜索框组件
   *
   * @props
   * @property {string|string[]} value - 当前选中的值（单选为 string，多选为 string[]）。
   * @property {string} [placeholder="请选择"] - 输入框占位符。
   * @property {'top' | 'bottom'} [direction="bottom"] - 选择器弹出方向.
   * @property {boolean} [disabled=false] - 是否禁用选择器。
   * @property {boolean} [multiple=false] - 是否启用多选模式。
   * @property {boolean} [filterable=false] - 是否允许输入搜索。
   * @property {functino} [changeValue] - 选中值变化的回调函数。
   *
   * @slot - <Option> 子组件
   *
   * @example
   * <Select value="1" placeholder="请选择" multiple filterable >
   *   <Option value="1" label="选项1"></Option>
   *   <Option value="2" label="选项2"></Option>
   *   <Option value="3" label="选项3"></Option>
   * </Select>
   *
   * @tips
   *  选项的value值不能重复，否则会导致选项显示异常
   */
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import '../style/Select';

  // props
  let { value = $bindable(), placeholder = '请选择', direction = 'bottom', disabled = false, multiple = false, filterable = false, changeValue = () => {}, children } = $props();

  // 处理 value,如果是多选就会返回arr[]
  if (multiple) value = Array.isArray(value) ? value : [];

  // 状态管理
  let isShow = $state(false);
  let selectedLabel = $state([]);
  let OptionCounts = $state(0);
  let OptionData = $state([]);
  let filterText = writable('');

  // 上下文通信
  setContext('SELECT-OPTIONS', {
    filterable,
    filterText,
    getSelectShow: () => isShow,
    add: () => (OptionCounts = OptionCounts + 1),
    sub: () => (OptionCounts = OptionCounts - 1),
    reset: () => (OptionCounts = 0),
    getOptionData: ({ value, label }) => {
      OptionData.push({ selectValue: value, selectLabel: label });
      initLabelvalue();
    },
    setActive: (optionValue) => {
      if (multiple) {
        if (value.includes(optionValue)) return true;
        return false;
      }
      if (value === optionValue) return true;
      return false;
    },
    handerSelectValue: ({ selectValue, selectLabel }) => {
      if (multiple) {
        if (value.includes(selectValue)) {
          // 创建新数组进行修改
          const newValue = value.filter((v) => v !== selectValue);
          const newSelectedLabel = selectedLabel.filter((l) => l !== selectLabel);
          value = newValue;
          selectedLabel = newSelectedLabel;
          changeValue(newValue);
          return false;
        } else {
          // 创建新数组进行修改
          value = [...value, selectValue];
          selectedLabel = [...selectedLabel, selectLabel];
          changeValue(value);
          return true;
        }
      } else {
        value = selectValue;
        selectedLabel = [selectLabel];
        changeValue(value);
        closeSelect();
        return true;
      }
    },
  });

  // 处理外部传入value
  $effect(() => {
    initLabelvalue();
    if (value === '') changeValue(value);
    if (value === undefined || value === null) changeValue(value);
  });

  /** 处理初始化value @type {function} */
  function initLabelvalue() {
    if (Array.isArray(value)) {
      const labels = value
        .map((item) => {
          const option = OptionData.find((child) => child.selectValue == item);
          return option ? option.selectLabel : '';
        })
        .filter(Boolean);

      if (labels.length > 0) selectedLabel = labels;
    } else {
      const option = OptionData.find((child) => child.selectValue == value);
      if (option) selectedLabel = [option.selectLabel];
    }
  }

  /** 取消选择选项
   *  @type {function}
   *  @param {number} index 取消选择的选项的索引
   * */
  function handleConcelOption(index) {
    const concelData = OptionData.find((child) => child.selectLabel == selectedLabel[index]);
    value = value.filter((v) => v !== concelData.selectValue);
    selectedLabel = selectedLabel.filter((l) => l !== selectedLabel[index]);
    changeValue(value);
    closeSelect();
  }

  /**
   * 处理键盘事件
   * @type {function}
   * @param {KeyboardEvent} event
   */
  function handleKeyInput(event) {
    if (event.key === 'Enter') toggleSelect;
  }

  let dropdownContainer;
  /** 点击外部关闭选择器 @type {function} */
  function handleClickOutside(event) {
    if (!dropdownContainer.contains(event.target)) closeSelect();
  }

  /** 处理输入框的事件 @type {function} */
  function onInputChange(e) {
    filterText.set(e.target.value || '');
    openSelect();
  }

  /** 关闭选择器 @type {function} */
  function closeSelect() {
    if (isShow) isShow = false;
  }

  /** 打开选择器 @type {function} */
  function openSelect() {
    if (disabled) return;
    if (!isShow) isShow = true;
  }

  /** 切换选择器 @type {function} */
  function toggleSelect() {
    if (disabled) return;
    isShow = !isShow;
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="dropdown-container" bind:this={dropdownContainer}>
  {#if multiple}
    <div class="input" onclick={toggleSelect} tabindex="-1" role="button" onkeydown={handleKeyInput}>
      {#if selectedLabel.length > 0}
        <div class="tags">
          {#each selectedLabel as label, index (index)}
            <span class="tag-item">
              <button onclick={() => handleConcelOption(index)} aria-label="取消选择"></button>
              <span class="tag-label">{label}</span>
            </span>
          {/each}
        </div>
      {:else}
        <span class="placeholder">{placeholder}</span>
      {/if}
    </div>
  {:else}
    <input class="input" value={selectedLabel.join(',')} readonly={!filterable} {placeholder} {disabled} oninput={onInputChange} onclick={toggleSelect} />
  {/if}
  <button class="icon" onclick={toggleSelect} aria-label="Toggle dropdown" tabindex="-1">
    <img src="/dropdown/arrow_black.png" alt="Dropdown icon" style={isShow ? 'transform: rotate(180deg);' : ''} />
  </button>
  <ul class="options {direction} {isShow ? '' : 'hidle'}" role="listbox">
    <section>
      {@render children()}
      {#if OptionCounts <= 0}<div class="no-options"><li class="no-data">暂无数据</li></div>{/if}
    </section>
  </ul>
</div>
