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
  import '../style';
  let { value = $bindable(), label = '标签文字', type = 'text', placeholder = '请输入信息', request = false, show_label = true, readonly = false, color = '', disabled = false, clearable = true, round = false, onInput = () => {} } = $props();

  let inputType = $state(type);
  let showPassword = $state(false);

  /**
   * 处理单个输入框的输入事件
   * @param event
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
</script>

<div class="InputBox-container">
  <!-- 标签显示 -->
  {#if show_label}
    <div class="InputBox-label">
      <!-- request符号显示 -->
      {#if request}
        <span class="required">*</span>
      {/if}
      {label}
    </div>
  {/if}
  <!-- 通过readonly属性控制是否可编辑,切换为只读状态用来展示的样式 -->
  {#if readonly}
    {#if type.toLowerCase() == 'password'}
      <div class="InforInput-password {round ? 'round' : ''} {disabled ? 'disabled' : ''}">
        {#if showPassword}
          {value || '• • • • • • • •'}
        {:else}
          • • • • • • • •
        {/if}
      </div>
      <button onclick={togglePassword} title={showPassword ? '隐藏密码' : '显示密码'}>
        <img src="/teacher_mgt/{showPassword ? 'hide.svg' : 'show.svg'}" alt="{showPassword ? '隐藏' : '显示'}密码" />
      </button>
    {:else}
      <div class="InforInput-value {round ? 'round' : ''} {disabled ? 'disabled' : ''}" style={color ? `color: ${color};` : ''}>
        {value ? value : placeholder}
      </div>
    {/if}
    <!-- 普通通用输入框 -->
  {:else}
    <div class="InputBox-box">
      <input class="InputBox-input {round ? 'round' : ''} {disabled ? 'disabled' : ''}" type={inputType} bind:value {placeholder} {disabled} oninput={handleInputSingle} />
      <!-- 清除输入按钮 -->
      {#if clearable && value && !disabled}
        <button class="clear-icon" onclick={clearInput} aria-label="清除输入"></button>
      {/if}
      <button onclick={togglePassword} title={showPassword ? '隐藏密码' : '显示密码'} class="password-icon {type == 'password' ? '' : 'hide'}">
        <img src="/teacher_mgt/{showPassword ? 'hide.svg' : 'show.svg'}" alt="{showPassword ? '隐藏' : '显示'}密码" />
      </button>
    </div>
  {/if}
</div>
