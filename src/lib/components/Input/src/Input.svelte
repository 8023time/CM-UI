<script>
  import '../style/index';

  let { value = $bindable(), label = '标签文字', type = 'text', placeholder = '请输入信息', request = false, show_label = true, readonly = false, color = '', disabled = false, clearable = true, round = false, onInput = () => {} } = $props();

  let inputType = $state(type);
  let showPassword = $state(false);

  /**
   * 处理单个输入框的输入事件
   * @param event
   * @type {function}
   */
  function handleInputSingle(event) {
    onInput(event.target.value);
  }

  /**
   * 清除输入框内容
   * @type {function}
   */
  function clearInput() {
    value = '';
    onInput(value);
  }

  /**
   * 切换密码显示
   * @type {function}
   */
  function togglePassword() {
    showPassword = !showPassword;
    inputType = showPassword ? 'text' : 'password';
  }

  /**
   * class类集合
   * @type {string}
   */
  let classes = $state([round && 'is-round', disabled && 'is-disabled'].filter(Boolean).join(' '));
</script>

<div class="input">
  <!-- 标签显示 -->
  {#if show_label}
    <label for="input" class="input__label">
      {#if request}
        <span class="input__label--required">*</span>
      {/if}
      {label}
    </label>
  {/if}
  <!-- 普通只读信息展示框 -->
  {#if readonly}
    {#if type.toLowerCase() === 'password'}
      <div class="input__info-password {classes}">
        {#if showPassword}
          {value || '• • • • • • • •'}
        {:else}
          • • • • • • • •
        {/if}
      </div>
    {:else}
      <div class="input__info-value {classes}" style={color ? `color: ${color};` : ''}>
        {value ? value : placeholder}
      </div>
    {/if}
    <!-- 普通通用输入框 -->
  {:else}
    <div class="input__wrapper">
      <input bind:value id="input" {disabled} {placeholder} type={inputType} class="input__inner {classes}" oninput={handleInputSingle} />
      <!-- 清除输入按钮 -->
      {#if clearable && value && !disabled}
        <button onclick={clearInput} class="button--clear" title="清除输入" aria-label="清除输入"></button>
      {/if}
    </div>
  {/if}
  <!-- 切换显示密码按钮 -->
  <button type="button" onclick={togglePassword} data-state={showPassword ? 'show' : 'hide'} title={showPassword ? '隐藏密码' : '显示密码'} aria-label={showPassword ? '隐藏密码' : '显示密码'} class="button__password--toggle {type == 'password' ? '' : 'is-hide'}"> </button>
</div>
