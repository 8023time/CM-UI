<script>
  /**
   * @component InputBox
   * @description 输入框组件
   *
   * @props
   * @property {string} [value=''] - 输入框的值
   * @property {string} [label='标签文字'] - 标签文字
   * @property {string} [type='text'] - 输入框类型
   * @property {string} [placeholder='请输入信息'] - 输入框提示文字
   * @property {boolean} [request=false] - 是否显示必填符号
   * @property {boolean} [show_label=true] - 是否显示标签
   * @property {boolean} [readonly=false] - 是否只读,只读模式下不显示清除按钮
   * @property {string} [color=''] - 输入框字体颜色,只针对readonly=true模式有效
   * @property {boolean} [disabled=false] - 是否禁用
   * @property {boolean} [clearable=true] - 是否显示清除按钮
   * @property {boolean} [round=false] - 是否圆角
   * @property {function} [onInput=()=>{}] - 输入框输入事件
   *
   * @example
   * <InputBox bind:value={valueName} onInput={handleInput} />
   */
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
