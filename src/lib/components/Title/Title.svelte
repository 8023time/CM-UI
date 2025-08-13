<script>
  /**
   * @component Title
   * @description 页面标题
   *
   * @props
   * @property {String} [title='Title'] - 标题文本
   * @property {Boolean} [line=true] - 是否显示横向分割线
   *
   * @example
   * <Title title="基本信息" line />
   */
  import { getType } from '$lib/utils/index.js';

  let { title = 'Title', line = true } = $props();

  /**
   * 校验规则
   * @type {function}
   */
  const propsRules = {
    title: { type: ['string'], default: 'Title', check: (v) => v.trim() !== '', message: '标题title不能为空' },
    line: { type: ['boolean'], default: true },
  };

  /**
   * 校验props属性是否合法，以及进行容错处理
   * @type {function}
   */
  const validateAndAssign = (data, key) => {
    const rule = propsRules[key];
    const value = data.value;
    let reason = '';
    if (!rule.type.includes(getType(value))) {
      reason = `类型错误,期望类型为${rule.type.join('、')},实际类型为${getType(value)}`;
    } else if (rule.check && !rule.check(value)) {
      reason = rule.message ? rule.message : `不符合校验规则`;
    }
    if (reason) {
      console.warn(`[Title] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  };

  validateAndAssign({ value: title, set: (v) => (title = v) }, 'title');
  validateAndAssign({ value: line, set: (v) => (line = v) }, 'line');
</script>

<section class="title">
  <header class="title__header">
    <span class="title__bar"></span>
    <h2 class="title__text">{title}</h2>
  </header>
  <hr class="title__line" class:is-hidden={!line} />
</section>

<style lang="scss" scoped>
  .title {
    width: 100%;
    display: flex;
    gap: 12px;
    align-items: center;

    &__header {
      display: flex;
      align-items: center;

      .title__bar {
        width: 10px;
        height: 25px;
        border-radius: 6px;
        background-color: #0336ff;
      }

      .title__text {
        font-size: 20px;
        font-weight: bold;
        margin-left: 13px;
      }
    }

    &__line {
      flex: 1;
      height: 2px;
      background-color: #e0e0e0;
      border: none;

      &.is-hidden {
        display: none;
      }
    }
  }
</style>
