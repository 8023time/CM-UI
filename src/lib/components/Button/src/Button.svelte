<script>
  import { getType } from '$lib/utils/index.js';
  import '../style/index';

  let { plain = false, type = 'primary', disabled = false, round = false, icon = '', size = 'medium', alt = 'icon', width = '', height = '', onclick = () => {}, children } = $props();

  /**
   * 立即执行：校验 Button 组件的参数合法性。
   * 包括 type、size、plain、round、disabled、icon、alt、width、height、onclick 的类型与取值检查。
   * 若参数非法，将输出警告并设置默认值。
   */
  (() => {
    //参数常量
    const BUTTON_TYPES = ['primary', 'success', 'danger', 'warning', 'info'];
    const BUTTON_SIZES = ['small', 'medium', 'large'];
    const VALID_UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh'];

    // type 校验
    if (getType(type) !== 'string' || !BUTTON_TYPES.includes(type.trim())) {
      console.warn(`[Button] 类型无效: '${type}'，应为 ${BUTTON_TYPES.join(', ')}`);
      type = 'primary';
    }

    // size 校验
    if (getType(size) !== 'string' || !BUTTON_SIZES.includes(size.trim())) {
      console.warn(`[Button] 尺寸无效: '${size}'，应为 ${BUTTON_SIZES.join(', ')}`);
      size = 'medium';
    }

    // plain 校验
    if (getType(plain) !== 'boolean') {
      console.warn(`[Button] plain 必须为布尔值，当前为 ${getType(plain)}`);
      plain = false;
    }

    // round 校验
    if (getType(round) !== 'boolean') {
      console.warn(`[Button] round 必须为布尔值，当前为 ${getType(round)}`);
      round = false;
    }

    // disabled 校验
    if (getType(disabled) !== 'boolean') {
      console.warn(`[Button] disabled 必须为布尔值，当前为 ${getType(disabled)}`);
      disabled = false;
    }

    // icon 校验
    if (icon !== '') {
      if (getType(icon) !== 'string') {
        console.warn(`[Button] icon 类型应为字符串类型（图片路径），当前为 ${getType(icon)}`);
        icon = '';
      } else if (!/^(https?:\/\/|\/|\.\/)/.test(icon)) {
        console.warn(`[Button] icon 路径无效，应为网络路径（http/https）或本地路径（/、./）`);
        icon = '';
      }
    }

    // alt 校验
    if (alt === '' || getType(alt) !== 'string') {
      console.warn(`[Button] alt 应为有效字符串,当前为 ${alt}:${getType(alt)}`);
      alt = 'icon';
    }

    // width 校验
    if (width !== '') {
      // 1. 检测是否为负数（数字或字符串）
      let isNegative = false;
      if (getType(width) === 'number') {
        isNegative = width < 0;
      } else if (getType(width) === 'string') {
        isNegative = /^-/.test(width.trim());
      }

      if (isNegative) {
        width = '0';
      } else {
        if (getType(width) === 'number') {
          width = `${width}px`;
        } else if (getType(width) !== 'string') {
          console.warn(`[Button] width 应为字符串或数字（例如 '100px', '2em'），当前为 ${getType(width)}`);
          width = '';
        } else if (/^\d+(\.\d+)?$/.test(width)) {
          width = `${width}px`;
        } else if (!/^(\d+(\.\d+)?)([a-z%]+)$/i.test(width)) {
          console.warn(`[Button] width 格式无效，应为正数加单位（例如 '100px', '2em'）`);
          width = '';
        } else {
          const unit = width.match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)[2].toLowerCase();
          if (!VALID_UNITS.includes(unit)) {
            console.warn(`[Button] 不支持的单位: '${unit}'，应为 ${VALID_UNITS.join(', ')}`);
            width = '';
          }
        }
      }
    }

    // height 校验
    if (height !== '') {
      let isNegative = false;
      if (getType(height) === 'number') {
        isNegative = height < 0;
      } else if (getType(height) === 'string') {
        isNegative = /^-/.test(height.trim());
      }
      if (isNegative) {
        height = '0';
      } else {
        if (getType(height) === 'number') {
          height = `${height}px`;
        } else if (getType(height) !== 'string') {
          console.warn(`[Button] height 应为字符串或数字（例如 '40px', '3rem'），当前为 ${getType(height)}`);
          height = '';
        } else if (/^\d+(\.\d+)?$/.test(height)) {
          height = `${height}px`;
        } else if (!/^-?(\d+(\.\d+)?)([a-z%]+)$/i.test(height)) {
          console.warn(`[Button] height 格式无效，应为数字加单位（例如 '40px', '3rem'）`);
          height = '';
        } else {
          const unit = height.match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)[2].toLowerCase();
          if (!VALID_UNITS.includes(unit)) {
            console.warn(`[Button] 不支持的单位: '${unit}'，应为 ${VALID_UNITS.join(', ')}`);
            height = '';
          }
        }
      }
    }

    // onclick 校验
    if (!['function', 'asyncfunction'].includes(getType(onclick))) {
      console.warn(`[Button] onclick 必须为function/asyncfunction，当前为 ${getType(onclick)}`);
      onclick = () => {};
    }
  })();

  /**
   * 组合按钮的类名-采用bem架构模式
   *  @type {string}
   */
  let classes = $state(['button', `button--${type}`, plain && `is-plain`, `button--${size}`, disabled && `is-disabled`, round && `is-round`].filter(Boolean).join(' '));

  /**
   * 组合按钮的大小
   *  @type {string}
   */
  let styleButton = $state([width ? `width: ${width};` : '', height ? `height: ${height};` : ''].filter(Boolean).join(' '));

  /**
   * 点击事件处理函数
   * @param {Event} Event - 点击事件对象
   * @type {Function}
   */
  function handleClick(Event) {
    Event.stopPropagation(); // 阻止事件冒泡
    if (disabled) return; // 如果按钮被禁用，不执行点击事件
    onclick();
  }
</script>

<button type="button" class={classes} {disabled} onclick={handleClick} style={styleButton} data-testid="button">
  <!-- 图标部分 -->
  {#if icon}
    <img class="button__icon" src={icon} loading="lazy" {alt} data-testid="icon" />
  {/if}
  <!-- 文本部分 -->
  <span class="button__text">{@render children()}</span>
</button>
