<script>
  /**
   * @component Empty
   * @description 无数据提示组件
   *
   * @props
   * @property {String} [text='暂无数据'] - 无数据提示文本
   * @property {Boolean} [show_icon=true] - 是否显示无数据图标
   * @property {Boolean} [show_text=true] - 是否显示无数据文本
   *
   * @example
   * <Empty text="暂无数据"/>
   */
  import { getType } from '$lib/utils/index.js';

  let { text = '暂无数据', show_icon = true, show_text = true } = $props();

  /**
   * 校验规则
   * @type {Object}
   */
  const propsRules = {
    text: { type: ['string'], default: '暂无数据', check: (v) => v.trim() !== '' },
    show_icon: { type: ['boolean'], default: true },
    show_text: { type: ['boolean'], default: true },
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
      console.warn(`[Empty] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  }

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: text, set: (v) => (text = v) }, 'text');
  validateAndAssign({ value: show_icon, set: (v) => (show_icon = v) }, 'show_icon');
  validateAndAssign({ value: show_text, set: (v) => (show_text = v) }, 'show_text');
</script>

<div class="empty">
  {#if show_icon}
    <img src="/table/table-no-data.svg" alt="No Data" loading="lazy" />
  {/if}
  {#if show_text}
    <p>{text}</p>
  {/if}
</div>
