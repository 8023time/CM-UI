<script>
  /**
   * @component Tooltip
   * @description 气泡提示组件
   *
   * @props
   * @property {Element} [target='']   - 触发气泡提示的元素，必填
   * @property {'top' | 'left' | 'right' | 'bottom'} [placement='bottom']   - 气泡框位置
   * @property {String} [content='']   - 气泡提示的内容
   * @property {String} [color='#ffffff']   - 组件背景颜色
   * @property {'click' | 'hover'} [hide_method='hover']   - 隐藏方式
   * @property {Boolean} [show_actions=false]   - 使用对话框
   * @property {Boolean} [show_title=false]   - 使用标题
   * @property {Boolean} [show_cancel=true]   - 显示取消按钮
   * @property {Boolean} [title='']   - 标题内容
   * @property {Function} onConfirm   - 确认按钮回调函数
   * @property {Function} onCancel   - 取消按钮回调函数
   * @property {String} [confirm_text='确认']  - 确认按钮文本
   * @property {String} [cancel_text='取消']  - 取消按钮文本
   */
  import { tick, onMount } from 'svelte';
  import { getType } from '$lib/utils/index.js';
  import '../style/index';

  let { target, placement = 'bottom', content = '', color = '#ffffff', hide_method = 'hover', show_actions = false, show_cancel = true, show_title = false, title = '', onConfirm = () => {}, onCancel = () => {}, confirm_text = '确认', cancel_text = '取消' } = $props();

  /**
   * 常量
   */
  const PLACEMENTS = ['top', 'left', 'right', 'bottom'];
  const HIDE_METHODS = ['click', 'hover'];

  /**
   * 属性校验规则
   * @type {Object}
   */
  const propRules = {
    content: { type: ['string', 'number'], default: '' },
    placement: { type: ['string'], default: 'bottom', check: (v) => PLACEMENTS.includes(v), message: `placement 只能是 ${PLACEMENTS.join('、')} 中的一个` },
    color: { type: ['string'], default: '#ffffff' },
    hide_method: { type: ['string'], default: 'hover', check: (v) => HIDE_METHODS.includes(v), message: `hide_method 只能是 ${HIDE_METHODS.join('、')} 中的一个` },
    show_actions: { type: ['boolean'], default: false },
    show_cancel: { type: ['boolean'], default: true },
    show_title: { type: ['boolean'], default: false },
    title: { type: ['string'], default: '' },
    onConfirm: { type: ['function', 'asyncfunction'], default: () => {} },
    onCancel: { type: ['function', 'asyncfunction'], default: () => {} },
    confirm_text: { type: ['string'], default: '确认', check: (v) => v.trim() !== '', message: 'confirm_text 不能为空' },
    cancel_text: { type: ['string'], default: '取消', check: (v) => v.trim() !== '', message: 'cancel_text 不能为空' },
  };

  /**
   * 校验props属性是否合法，以及进行容错处理
   * @param data {Object} - 属性对象
   * @param key {String} - 属性名称
   */
  const validateAndAssign = (data, key) => {
    const rule = propRules[key];
    const value = data.value;
    let reason = '';
    if (!rule.type.includes(getType(value))) {
      reason = `类型错误,期望类型为${rule.type.join('、')},实际类型为${getType(value)}`;
    } else if (rule.check && !rule.check(value)) {
      reason = rule.message ? rule.message : `不符合校验规则`;
    }
    if (reason) {
      console.warn(`[Tooltip] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  };

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: placement, set: (v) => (placement = v) }, 'placement');
  validateAndAssign({ value: content, set: (v) => (content = v) }, 'content');
  validateAndAssign({ value: color, set: (v) => (color = v) }, 'color');
  validateAndAssign({ value: hide_method, set: (v) => (hide_method = v) }, 'hide_method');
  validateAndAssign({ value: show_actions, set: (v) => (show_actions = v) }, 'show_actions');
  validateAndAssign({ value: show_cancel, set: (v) => (show_cancel = v) }, 'show_cancel');
  validateAndAssign({ value: show_title, set: (v) => (show_title = v) }, 'show_title');
  validateAndAssign({ value: title, set: (v) => (title = v) }, 'title');
  validateAndAssign({ value: onConfirm, set: (v) => (onConfirm = v) }, 'onConfirm');
  validateAndAssign({ value: onCancel, set: (v) => (onCancel = v) }, 'onCancel');
  validateAndAssign({ value: confirm_text, set: (v) => (confirm_text = v) }, 'confirm_text');
  validateAndAssign({ value: cancel_text, set: (v) => (cancel_text = v) }, 'cancel_text');

  /**
   * 变量初始化
   */
  let hideTimer;
  let isShow = $state(false);
  let Tooltip_Element = $state(null);
  let isAnimatingHide = $state(false);
  let isMouseOverTarget = $state(false);
  let isMouseOverTooltip = $state(false);
  let finalPlacement = $state('');

  /**
   *  防抖函数
   *  @type {funcrion}
   *  @param {Function} fn - 需要防抖的函数
   *  @param {Number} delay - 延迟时间
   */
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /**
   * 节流函数
   *  @type {function}
   *  @param {Function} fn - 需要节流的函数
   *  @param {Number} wait - 延迟时间
   */
  function throttle(fn, wait = 100) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  }

  /**
   *  动画效果
   *  @type {function}
   */
  function AnimatingHide() {
    if (AnimatingHide.rafId) {
      cancelAnimationFrame(AnimatingHide.rafId);
    }

    isShow = false;
    isAnimatingHide = true;
    AnimatingHide.rafId = requestAnimationFrame(() => {
      setTimeout(() => {
        isAnimatingHide = false;
        AnimatingHide.rafId = null;
      }, 300);
    });
  }

  /**
   * 处理滚轮事件
   * @type {function}
   */
  function handlescroll() {
    if (isShow && target && Tooltip_Element) requestAnimationFrame(setPosition);
  }

  /**
   * 处理点击事件
   * @type {function}
   * @param {Event} event
   */
  function handleClick(event) {
    if (!target || !Tooltip_Element) return;
    if (target.contains(event.target) && isShow === true) isShow = false;
    else if (isShow !== (target.contains(event.target) || Tooltip_Element.contains(event.target))) isShow = target.contains(event.target) || Tooltip_Element.contains(event.target);
  }

  /**
   * 鼠标移动事件处理
   * @type {function}
   * @param {Event} event
   */
  function handleMouseMove(event) {
    if (!target || !Tooltip_Element) return;
    if (isShow === (target.contains(event.target) || Tooltip_Element.contains(event.target))) return;
    if (target.contains(event.target) || Tooltip_Element.contains(event.target)) {
      clearTimeout(hideTimer);
      if (!isShow) {
        isShow = true;
        isAnimatingHide = false;
        setPosition();
      }
    } else {
      hideTimer = setTimeout(() => {
        AnimatingHide();
      }, 300);
    }
  }

  /**
   * 处理气泡框位置
   * @type {function}
   */
  function setPosition() {
    if (!Tooltip_Element || !target) return;
    // 使用 requestAnimationFrame 优化性能
    if (setPosition.rafId) {
      cancelAnimationFrame(setPosition.rafId);
    }
    setPosition.rafId = requestAnimationFrame(() => {
      const { width: targetWidth, height: targetHeight, x, y } = target.getBoundingClientRect();
      const { width: tooltipWidth, height: tooltipHeight } = Tooltip_Element.getBoundingClientRect();
      // === 设置气泡框位置 ===
      const setSite = (left, top) => (Tooltip_Element.style.transform = `translate3d(${left}px, ${top}px, 0)`);
      const position = {
        top: () => setSite(x + (targetWidth - tooltipWidth) / 2, y - (tooltipHeight + 5)),
        left: () => setSite(x - tooltipWidth - 5, y + (targetHeight - tooltipHeight) / 2),
        right: () => setSite(x + targetWidth + 5, y + (targetHeight - tooltipHeight) / 2),
        bottom: () => setSite(x + (targetWidth - tooltipWidth) / 2, y + targetHeight + 5),
      };
      // === 判断是否溢出视口并自动翻转 ===
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      finalPlacement = placement;
      const overflows = {
        top: y - tooltipHeight - 5 < 0,
        bottom: y + targetHeight + tooltipHeight + 5 > viewportHeight,
        left: x - tooltipWidth - 5 < 0,
        right: x + targetWidth + tooltipWidth + 5 > viewportWidth,
      };
      const flipMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
      if (overflows[placement]) finalPlacement = flipMap[placement];

      return position[finalPlacement] ? position[finalPlacement]() : position.top();
    });
  }

  /**
   * 经过防抖处理过的气泡框位置设置函数
   * @type {function}
   */
  const debouncedSetPosition = debounce(setPosition, 20);

  /**
   * 经过防抖处理过的鼠标移动事件
   * @type {function}
   */
  const throttledHandleMouseMove = throttle(handleMouseMove, 100);

  /**
   * 执行回调,并隐藏气泡框
   * @param callback
   */
  async function onCallback(callback) {
    await callback?.();
    AnimatingHide();
  }

  onMount(async () => {
    await tick();
    if (!target) return;
    setPosition();

    const cleanUp = () => {
      if (setPosition.rafId) {
        cancelAnimationFrame(setPosition.rafId);
        setPosition.rafId = null;
      }
      if (AnimatingHide.rafId) {
        cancelAnimationFrame(AnimatingHide.rafId);
        AnimatingHide.rafId = null;
      }

      document.removeEventListener('scroll', handlescroll, { passive: true, capture: true });
      window.removeEventListener('resize', debouncedSetPosition);
      if (hide_method === 'hover') window.removeEventListener('mousemove', throttledHandleMouseMove);
      else window.removeEventListener('click', handleClick);
    };

    document.addEventListener('scroll', handlescroll, { passive: true, capture: true });
    window.addEventListener('resize', debouncedSetPosition, { passive: true });
    if (hide_method === 'hover') window.addEventListener('mousemove', throttledHandleMouseMove, { passive: true });
    else window.addEventListener('click', handleClick);
    return cleanUp;
  });
</script>

<div class="tooltip" class:is-show={isShow} class:is-fadeout={!isShow && isAnimatingHide} class:is-hiddle={!isShow && !isAnimatingHide} data-placement={finalPlacement} bind:this={Tooltip_Element} aria-hidden={!isShow} role="tooltip" data-testid="tooltip">
  <div class="tooltip__arrow"></div>
  <div class="tooltip__content" class:have-title={show_title} style="background-color: {color};">
    {#if show_title}
      <div class="tooltip__content-title">{title}</div>
    {/if}
    {@html content}
    {#if show_actions}
      <div class="tooltip__content-actions">
        {#if show_cancel}
          <button class="Cancel" type="button" onclick={() => onCallback(onCancel)}>{cancel_text}</button>
        {/if}
        <button class="Confirm" type="button" onclick={() => onCallback(onConfirm)}>{confirm_text}</button>
      </div>
    {/if}
  </div>
</div>
