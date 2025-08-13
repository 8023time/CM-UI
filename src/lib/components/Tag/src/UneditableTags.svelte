<script>
  import { getType } from '$lib/utils/index.js';
  /**
   * 默认标签，默认颜色常量
   * @type {Array}
   */
  const DEFAULT_TAGS = ['frontend', 'backend', 'svelte', '前端', 'JavaScript', 'CSS', 'HTML', 'Node.js'];
  const DEFAULT_COLORS = [
    '#40d5ff',
    '#59dcff',
    '#33c1e8',
    '#6adbff',
    '#26caef',
    '#4dd6eb',
    '#6dcaf2',
    '#52c2ff',
    '#7fd3f3',
    '#47d0db',
    '#5bc8f2',
    '#40c4e0',
    '#ffa040',
    '#ffb359',
    '#ffc26d',
    '#ffcf85',
    '#ff9eac',
    '#ffb3c0',
    '#ffc6d1',
    '#ffd9e0',
    '#d5a6ff',
    '#e0bfff',
    '#eed2ff',
    '#f2dcff',
    '#c6ff8c',
    '#d9ff99',
    '#e0ffb3',
    '#e6ffcc',
    '#72deff',
    '#4fd4d9',
    '#83def5',
  ];

  let { tags = DEFAULT_TAGS, colors = DEFAULT_COLORS } = $props();

  /**
   * 属性校验规则
   * @type {Object}
   */
  const propsRules = {
    tags: { type: ['array'], default: DEFAULT_TAGS, check: (v) => v.length > 0 },
    colors: { type: ['array'], default: DEFAULT_COLORS, check: (v) => v.length > 0 },
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
      console.warn(`[UneditableTags] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  }

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: tags, set: (v) => (tags = v) }, 'tags');
  validateAndAssign({ value: colors, set: (v) => (colors = v) }, 'colors');

  /**
   * Fisher-Yates 洗牌算法，打乱颜色数组
   * @param {string[]} array
   */
  function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  let shuffled_colors = shuffleArray(colors);

  let tag_colors = tags.map((_, i) => shuffled_colors[i % shuffled_colors.length]);
</script>

<div class="tags">
  {#each tags as tag, i (i)}
    <courseTag>
      <div class="tag">
        <span class="tag-square" style="background-color: {tag_colors[i]};"></span>
        <span class="tag-text">{tag}</span>
      </div>
    </courseTag>
  {/each}
</div>

<style lang="scss" scoped>
  $max-container-height: var(--max_container_height, 75px);
  $max-tag-width: var(--max_tag_width, 100px);

  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    overflow-y: auto;
    max-height: $max-container-height;

    .tag {
      display: flex;
      align-items: center;
      font-size: 14px;

      &-text {
        padding: 0 0 0 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: $max-tag-width;
        color: #797979;
      }

      &-square {
        width: 15px;
        height: 15px;
        border-radius: 3px;
      }
    }
  }
</style>
