<script>
  /**
   * @component MessageBox
   * @description 弹出窗提示组件
   *
   * @props
   * @property {Object} options 配置项
   * @property {string} [options.content=""] 弹窗内容
   * @property {string} [options.title="温馨提示"] 弹窗标题
   * @property {boolean} [options.visible=false] 是否显示弹窗
   * @property {boolean} [options.center=false] 是否居中显示内容
   * @property {string} [options.cancel_text="取消"] 取消按钮文本
   * @property {string} [options.confirm_text="确定"] 确认按钮文本
   * @property {boolean} [options.show_cancel_button=true] 是否显示取消按钮
   * @property {boolean} [options.show_confirm_button=true] 是否显示确认按钮
   * @property {boolean} [options.show_cancel_icon=true] 是否显示右上角取消图标
   * @property {boolean} [options.on_close_by_click_outside=true] 点击空白区域是否关闭弹窗
   * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.type="primary"] 弹窗类型
   * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.cancel_button_type="info"] 取消按钮类型
   * @property {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.confirm_button_type="primary"] 确认按钮类型
   * @property {Function} [options.onCancel] 点击取消的回调函数
   * @property {Function} [options.onConfirm] 点击确认的回调函数
   */
  import '$lib/components/Button/index.scss';
  import { getType } from '$lib/utils/index.js';
  import '../style/index';

  let {
    content = '',
    center = false,
    visible = false,
    type = 'primary',
    title = '温馨提示',
    cancel_text = '取消',
    confirm_text = '确定',
    show_cancel_icon = true,
    show_cancel_button = true,
    show_confirm_button = true,
    cancel_button_type = 'info',
    confirm_button_type = 'primary',
    on_close_by_click_outside = true,
    onCancel = () => {},
    onConfirm = () => {},
  } = $props();

  /**
   * 基础类型
   * @type {Array}
   */
  const BASE_TYPES = ['primary', 'success', 'danger', 'warning', 'info'];

  /**
   * @description 配置项验证数据正确性
   * @type {Object}
   */
  const propsRules = {
    visible: { type: ['boolean'], default: false },
    title: { type: ['string'], default: '温馨提示', check: (v) => v.trim() !== '', message: 'title 不能为空' },
    content: { type: ['string'], default: '' },
    center: { type: ['boolean'], default: false },
    cancel_text: { type: ['string'], default: '取消', check: (v) => v.trim() !== '', message: 'cancel_text 不能为空' },
    confirm_text: { type: ['string'], default: '确定', check: (v) => v.trim() !== '', message: 'confirm_text 不能为空' },
    show_cancel_icon: { type: ['boolean'], default: true },
    show_cancel_button: { type: ['boolean'], default: true },
    show_confirm_button: { type: ['boolean'], default: true },
    on_close_by_click_outside: { type: ['boolean'], default: true },
    type: { type: ['string'], default: 'primary', check: (v) => BASE_TYPES.includes(v), message: `type 只能是 ${BASE_TYPES.join('、')} 中的一个` },
    cancel_button_type: { type: ['string'], default: 'info', check: (v) => BASE_TYPES.includes(v), message: `cancel_button_type 只能是 ${BASE_TYPES.join('、')} 中的一个` },
    confirm_button_type: { type: ['string'], default: 'primary', check: (v) => BASE_TYPES.includes(v), message: `confirm_button_type 只能是 ${BASE_TYPES.join('、')} 中的一个` },
    onCancel: { type: ['function', 'asyncfunction'], default: () => {} },
    onConfirm: { type: ['function', 'asyncfunction'], default: () => {} },
  };

  /**
   * 校验props属性是否合法，以及进行容错处理
   * @type {function}
   */
  function validateAndAssign(data, key) {
    const rule = propsRules[key];
    const value = data.value;
    let reason = '';
    if (!rule.type.includes(getType(value))) {
      reason = `类型错误,期望类型为${rule.type.join('、')},实际类型为${getType(value)}`;
    } else if (rule.check && !rule.check(value)) {
      reason = rule.message ? rule.message : `不符合校验规则`;
    }
    if (reason) {
      console.warn(`[MessageBox] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  }

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: visible, set: (v) => (visible = v) }, 'visible');
  validateAndAssign({ value: title, set: (v) => (title = v) }, 'title');
  validateAndAssign({ value: content, set: (v) => (content = v) }, 'content');
  validateAndAssign({ value: center, set: (v) => (center = v) }, 'center');
  validateAndAssign({ value: cancel_text, set: (v) => (cancel_text = v) }, 'cancel_text');
  validateAndAssign({ value: confirm_text, set: (v) => (confirm_text = v) }, 'confirm_text');
  validateAndAssign({ value: show_cancel_icon, set: (v) => (show_cancel_icon = v) }, 'show_cancel_icon');
  validateAndAssign({ value: show_cancel_button, set: (v) => (show_cancel_button = v) }, 'show_cancel_button');
  validateAndAssign({ value: show_confirm_button, set: (v) => (show_confirm_button = v) }, 'show_confirm_button');
  validateAndAssign({ value: on_close_by_click_outside, set: (v) => (on_close_by_click_outside = v) }, 'on_close_by_click_outside');
  validateAndAssign({ value: type, set: (v) => (type = v) }, 'type');
  validateAndAssign({ value: cancel_button_type, set: (v) => (cancel_button_type = v) }, 'cancel_button_type');
  validateAndAssign({ value: confirm_button_type, set: (v) => (confirm_button_type = v) }, 'confirm_button_type');
  validateAndAssign({ value: onCancel, set: (v) => (onCancel = v) }, 'onCancel');
  validateAndAssign({ value: onConfirm, set: (v) => (onConfirm = v) }, 'onConfirm');

  /**
   * 图标集合
   * @type {Object}
   */
  const ICON_URL = {
    primary: '/dialog/tip.svg',
    success: '/paper/action_success.svg',
    danger: '/paper/action_fail.svg',
    warning: '/student_answer_exam/preview-tip.svg',
    info: '/student_practice_list/tip.svg',
  };

  /***
   * 关闭弹窗
   * @type {Function}
   */
  function close() {
    visible = false;
  }

  /**
   * 执行回调
   * @param callback
   */
  async function handleAction(callback) {
    await callback();
    close();
  }

  /**
   * 处理键盘事件
   * @param e
   */
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (on_close_by_click_outside) close();
    }
  }

  /**
   * 阻止事件冒泡
   * @param {ClickEvent} e
   * @type {Function}
   */
  const stopPropagation = (e) => e.stopPropagation();
</script>

{#if visible}
  <div role="dialog" tabindex="-1" aria-label="关闭弹窗" class="MessageBox__shadow" onkeydown={handleKeyDown} onclick={on_close_by_click_outside ? close : null} data-testid="messagebox_shadow">
    <div tabindex="0" role="button" aria-label="弹窗内容" class:is-center={center} onclick={stopPropagation} class="MessageBox__container" onkeydown={handleKeyDown}>
      {#if show_cancel_icon}
        <button onclick={() => handleAction(onCancel)} class="MessageBox__cancel" aria-label="关闭弹窗" title="点击关闭" data-testid="messagebox_closeBtn"></button>
      {/if}
      <div class="MessageBox__content">
        <div class="MessageBox__title" class:is-center={center}>
          <img class="MessageBox__title-icon" src={ICON_URL[type]} alt="icon" loading="lazy" data-testid="messagebox_typeIcon" />
          {title}
        </div>
        <div class="MessageBox__text">
          {content}
        </div>
        <div class="MessageBox__buttons" class:MessageBox__buttons--center={center} data-testid="messagebox_buttons">
          {#if show_cancel_button && cancel_text}
            <button class="btn btn--medium btn--{cancel_button_type}" onclick={() => handleAction(onCancel)}>{cancel_text}</button>
          {/if}
          {#if confirm_text && show_confirm_button}
            <button class="btn btn--medium btn--{confirm_button_type}" onclick={() => handleAction(onConfirm)}>{confirm_text}</button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
