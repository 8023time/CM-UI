<script>
  /**
   * @component Toast
   * @description 提示组件
   *
   * @props
   * @property {'success' | 'error' | 'warning'} [type='success']   - 提示类型
   * @property {string} [message='']   - 提示文本内容
   * @property {number} [duration=3000]   - 自动关闭时间，单位毫秒
   * @property {boolean} [showClose=true]  - 是否显示关闭按钮
   */
  import { onMount } from 'svelte';
  import '../style';

  let { type = 'success', message = '', duration = 3000, showClose = true } = $props();

  /** 是否可见 @type {boolean}*/
  let visible = $state(true);

  /** 是否正在关闭 @type {boolean} */
  let isClosing = $state(false);

  /**
   * 定义图标
   * @type {{success: string, error: string, warning: string}}
   */
  const icons = {
    success: '/paper/action_success.svg',
    error: '/paper/action_fail.svg',
    warning: '/student_answer_exam/preview-tip.svg',
  };

  /**
   * 关闭提示
   * @param {ClickEvent}
   */
  function close() {
    isClosing = true;
    setTimeout(() => {
      visible = false;
    }, 500);
  }

  onMount(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="toast-box {isClosing ? 'fade-out' : ''}">
    <img src={icons[type]} class="icon" alt="icon" />
    <span class="message">{message}</span>
    {#if showClose}
      <button onclick={close}>
        <img src="/theory_question_bank/icons/Xacross_grey.svg" class="close" alt="close" />
      </button>
    {/if}
  </div>
{/if}
