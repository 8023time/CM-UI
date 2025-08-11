<!-- 
 /*
 * @Author: git config Mayux && dbs45412@163.com
 * @Date: 2025-04-04 17:35:50
 * @LastEditors: Mayux dbs45412@163.com
 * @LastEditTime: 2025-04-07 17:31:20
 * @FilePath: \tutorial-platform-fe\src\lib\component\UneditableTags.svelte
 * @Description: 不可进行编辑的标签组件，用于显示一系列标签
 * @Props:
 * - tags (Array): 要显示的标签数组
 * - colors (Array): 颜色数组
 * @Copyright: Copyright (c) 2025 by Mayux, All Rights Reserved. 
 */ 
 -->

<script>
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

{#snippet courseTag(/** @type {string} */ tag, /** @type {number} */ i)}
  <courseTag>
    <div class="tag">
      <span class="tag-square" style="background-color: {tag_colors[i]};"></span>
      <span class="tag-text">{tag}</span>
    </div>
  </courseTag>
{/snippet}

<div class="tags">
  {#each tags as tag, i}
    {@render courseTag(tag, i)}
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
  }

  .tag {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .tag-text {
    padding: 0 0 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: $max-tag-width;
    color: #797979;
  }

  .tag-square {
    width: 15px;
    height: 15px;
    border-radius: 3px;
  }
</style>
