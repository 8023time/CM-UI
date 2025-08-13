<script>
  import { getType } from '$lib/utils/index.js';
  const DEFAULT_TAGS = ['frontend', 'backend', 'svelte', '前端', 'JavaScript', 'CSS', 'HTML', 'Node.js'];

  let { tags = DEFAULT_TAGS } = $props();

  /**
   * 校验规则
   * @type {Object}
   */
  const propsRules = {
    tags: { type: ['array'], default: DEFAULT_TAGS, check: (v) => v.length > 0, message: 'tags 不能为空' },
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
      console.warn(`[UneditableHashTags] 属性 '${key}' 无效: ${reason}, 已使用默认值 '${rule.default}', 传入值为: '${value}'`);
      data.set(rule.default);
    }
  }

  /**
   * 校验props属性是否合法，以及进行容错处理
   */
  validateAndAssign({ value: tags, set: (v) => (tags = v) }, 'tags');

  /**
   * 字符串哈希函数
   * @param {string} str
   * @returns {number}
   */
  function stringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // 32位整数
    }
    return Math.abs(hash);
  }

  /**
   * 根据标签名称获取颜色,使用HSL颜色模型
   * * @param {string} tagName
   */
  function getTagColor(tagName) {
    const hash = stringHash(tagName);
    const hue = hash % 360; // 色相范围 0-360
    return `hsl(${hue}, 70%, 50%)`;
  }

  // 预先生成颜色映射
  let tagColorMap = new Map();
  tags.forEach((tag) => {
    if (!tagColorMap.has(tag)) {
      tagColorMap.set(tag, getTagColor(tag));
    }
  });
</script>

<div class="tags">
  {#each tags as tag, i (i)}
    <div class="tag">
      <span class="tag-square" style="background-color: {tagColorMap.get(tag)};"></span>
      <span class="tag-text">{tag}</span>
    </div>
  {/each}
</div>

<style lang="scss" scoped>
  $max-container-height: var(--max_container_height, 50px);
  $max-tag-width: var(--max_tag_width, 100px);

  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
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
