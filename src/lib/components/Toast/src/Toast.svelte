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
  import { getType } from '$lib/utils/index.js';
  import '../style/index';

  let { type = 'success', message = '', duration = 3000, showClose = true } = $props();

  const TOAST_TYPES = ['success', 'error', 'warning'];

  /**
   * 校验规则
   * @type {Object}
   */
  const propsRules = {
    type: { type: ['string'], default: 'success', check: (v) => TOAST_TYPES.includes(v), message: `期望的数据格式为 '${TOAST_TYPES.join(', ')}` },
    message: { type: ['string'], default: 'success', check: (v) => v.trim() !== '', message: '提示文本内容不能为空' },
    duration: { type: ['number'], default: 3000, check: (v) => v > 0, message: '自动关闭时间必须大于0' },
    showClose: { type: ['boolean'], default: true },
  };

  /**
   * 校验props属性是否合法，以及进行容错处理
   * @param data
   * @param key
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
      console.warn(`[Toast] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  }

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: type, set: (v) => (type = v) }, 'type');
  validateAndAssign({ value: message, set: (v) => (message = v) }, 'message');
  validateAndAssign({ value: duration, set: (v) => (duration = v) }, 'duration');
  validateAndAssign({ value: showClose, set: (v) => (showClose = v) }, 'showClose');

  /**
   * 是否可见
   * @type {boolean}
   */
  let visible = $state(true);

  /**
   * 是否正在关闭
   * @type {boolean}
   */
  let isClosing = $state(false);

  /**
   * 定义图标
   * @type {{success: string, error: string, warning: string}}
   */
  const ICON_URL = {
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
  <div class="toast" class:is-fadeOut={isClosing}>
    <img src={ICON_URL[type]} class="toast__icon" alt="icon" loading="lazy" data-testid="typeIcon" />
    <span class="toast__message">{message}</span>
    {#if showClose}
      <button onclick={close} class="toast__close" aria-label="关闭" title="点击关闭" data-testid="closeBtn"></button>
    {/if}
  </div>
{/if}
