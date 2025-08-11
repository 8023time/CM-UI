<script>
  /**
   * @component MessageBox
   * @description 弹出窗提示组件
   *
   * @props
   * @property {Object} options 配置项
   * @property {string} [options.title="温馨提示"] 弹窗标题
   * @property {string} [options.content=""] 弹窗内容
   * @property {boolean} [options.center=false] 是否居中显示内容
   * @property {string} [options.cancel_text="取消"] 取消按钮文本
   * @property {string} [options.confirm_text="确定"] 确认按钮文本
   * @property {boolean} [options.show_cancel_icon=true] 是否显示右上角取消图标
   * @property {boolean} [options.show_cancel_button=true] 是否显示取消按钮
   * @property {boolean} [options.show_confirm_button=true] 是否显示确认按钮
   * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.cancel_button_type="info"] 取消按钮类型
   * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.confirm_button_type="primary"] 确认按钮类型
   * @property {Function} [options.onCancel] 点击取消的回调函数
   * @property {Function} [options.onConfirm] 点击确认的回调函数
   */
  import '../style';
  import { Button } from '$lib/components';

  let {
    visible = false,
    show_cancel_icon = true,
    title = '温馨提示',
    content = '',
    cancel_text = 'cancel',
    confirm_text = 'confirm',
    center = false,
    show_cancel_button = true,
    show_confirm_button = true,
    confirm_button_type = 'primary',
    cancel_button_type = 'info',
    onCancel = () => {},
    onConfirm = () => {},
  } = $props();

  /** 取消按钮回调函数 @type {Function} */
  async function handlecancel() {
    await onCancel();
    close();
  }

  /** 确认按钮回调函数 @type {Function} */
  async function handleconfirm() {
    await onConfirm();
    close();
  }

  /*** 关闭弹窗 @type {Function} */
  function close() {
    visible = false;
  }

  /**
   * 阻止事件冒泡
   * @param {ClickEvent} event 事件对象
   * @type {Function}
   */
  function stopPropagation(event) {
    event.stopPropagation();
  }

  /**
   * 键盘按下事件关闭弹窗
   * @param {KeyboardEvent} event 事件对象
   * @type {Function}
   */
  function handleKeyDownClose(event) {
    if (event.key === 'Escape') close();
  }

  /**
   * 键盘按下事件停止事件冒泡
   * @param {KeyboardEvent} event 事件对象
   * @type {Function}
   */
  function handleKeyDownStop(event) {
    if (event.key === 'Escape') stopPropagation(event);
  }
</script>

{#if visible}
  <div class="overlay" onclick={close} role="dialog" tabindex="-1" aria-label="关闭弹窗" onkeydown={handleKeyDownClose}>
    <div class="MessageBox {center ? 'center' : ''}" onclick={stopPropagation} tabindex="0" role="button" aria-label="弹窗内容" onkeydown={handleKeyDownStop}>
      {#if show_cancel_icon}
        <button onclick={handlecancel} class="cancel">
          <img src="/theory_question_bank/icons/Xacross_grey.svg" alt="关闭" />
        </button>
      {/if}
      <div class="content">
        <div class="title {center ? 'center' : ''}">
          <img class="title-icon" src="/dialog/tip.svg" alt="" />
          {title}
        </div>
        <div class="text">
          {content}
        </div>
        <div class="buttons {center ? 'button-center' : ''}">
          {#if show_cancel_button && cancel_text}
            <Button type={cancel_button_type} size="small" onclick={handlecancel}>{cancel_text}</Button>
          {/if}
          {#if confirm_text && show_confirm_button}
            <Button type={confirm_button_type} size="small" onclick={handleconfirm}>{confirm_text}</Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
