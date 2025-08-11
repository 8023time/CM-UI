<!-- 
 /*
 * @Author: Mayux dbs45412@163.com
 * @Date: 2025-04-04 19:25:22
 * @LastEditors: myx dbs45412@163.com
 * @LastEditTime: 2025-04-08 17:30:52
 * @FilePath: \tutorial-platform-fe\src\lib\EditableTags.svelte
 * @Description: 可编辑的标签组件，用于对标签进行添加/删减
 * @Exported Methods: 
 *   - getTags(): 返回当前的标签数组。
 * @Props: 
 *   - original_tags (Array<string>): 初始标签数组，默认值为 ["默认标签"]。
 *   - max_tags_num (number): 最大允许的标签数量，默认值为 6。
 *   - max_tags_text_num (number): 每个标签的最大字符数，默认值为 20。
 *   - input_type (string): 输入框的类型，默认值为 "text"。
 *   - colors (Array<string>): 标签颜色数组，默认值为 DEFAULT_COLORS。
 *   - onInputChange (function): 在标签输入时被调用的函数，该函数需要接收一个string类型的数组（标签数组）作为参数
 *   - 其余关于样式的参数参见CSS部分
 * @Copyright: Copyright (c) 2025 by Mayux, All Rights Reserved. 
 */ 
 -->
<script>
  const DEFAULT_TAGS = ['默认标签'];

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

  let {
    original_tags = DEFAULT_TAGS,
    max_tags_num = 6,
    max_tags_text_num = 20,
    input_type = 'text',
    colors = DEFAULT_COLORS,
    onInputChange = (/** @type {string[]} */ tags) => {
      console.log(tags);
    },
  } = $props();

  //实际的标签数组
  let tags = $state(original_tags);

  /**
   * @type {string[]}
   */
  let value_tags = $state([]);

  //用于对标签数组进行处理后再显示
  $effect(() => {
    handleOriginalTagsArray(tags);
  });

  let temp_tags = $derived(handleTagsArray(value_tags));

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

  /**
   * 用于避免直接修改父组件传入的参数，将original_tags的副本作为将要显示的标签数组
   * @param {string[]} tags_arr
   */
  function handleOriginalTagsArray(tags_arr) {
    //拿到tags的值并清掉里面的空元素
    let arr = tags_arr;
    arr = arr.filter((item) => item !== '' && item !== null && item !== undefined);
    let temporary_tags = arr;

    if (temporary_tags.length === 0) {
      // 如果原始数组为空，直接添加一个空元素
      temporary_tags = [''];
    } else if (temporary_tags[temporary_tags.length - 1] !== '') {
      // 原始数组不为空，就在最后一位添加一个空元素
      if (temporary_tags.length < max_tags_num) {
        temporary_tags = [...temporary_tags, ''];
      }
    }
    value_tags = temporary_tags;
  }

  /**
   * @param {string[]} tags_arr
   */
  function handleTagsArray(tags_arr) {
    //拿到tags的值并清掉里面的空元素
    if (tags_arr === null) {
      return;
    }
    let arr = tags_arr;
    arr = arr.filter((item) => item !== '' && item !== null && item !== undefined);
    let temporary_tags = arr;

    if (temporary_tags.length === 0) {
      // 如果原始数组为空，直接添加一个空元素
      temporary_tags = [''];
    } else if (temporary_tags[temporary_tags.length - 1] !== '') {
      // 原始数组不为空，就在最后一位添加一个空元素
      if (temporary_tags.length < max_tags_num) {
        temporary_tags = [...temporary_tags, ''];
      }
    }
    return temporary_tags;
  }

  export function getTags() {
    //拍摄快照，清除掉数组中的空元素后导出
    let export_tags = $state.snapshot(temp_tags);
    let arr = export_tags;
    arr = arr.filter((item) => item !== '' && item !== null && item !== undefined);
    return arr;
  }

  // 处理输入变化
  /**
   * @param {number} index
   * @param {Event & { currentTarget: EventTarget & HTMLInputElement; }} event
   */
  function handleInput(event, index) {
    if (event && event.target && 'value' in event.target && typeof event.target.value === 'string') {
      value_tags[index] = event.target.value;

      // 如果最后一个标签有内容，自动新增一个空标签
      if (index === value_tags.length - 1 && event.target.value.trim() !== '' && value_tags.length < max_tags_num) {
        value_tags = [...value_tags, ''];
      }

      let export_tags = getTags();

      onInputChange(export_tags);
    }
  }

  /**
   * 删除标签
   * @param {number} index
   */
  function removeTag(index) {
    value_tags.splice(index, 1);
    value_tags = [...value_tags];
  }
</script>

{#snippet tagItem(/** @type {string} */ tag, /** @type {number} */ index)}
  <div class="tag">
    <span class="tag-square" style="background-color: {shuffled_colors[index % shuffled_colors.length]}"></span>
    <input type={input_type} class="tag-input" placeholder="+标签" maxlength={max_tags_text_num} bind:value={value_tags[index]} oninput={(event) => handleInput(event, index)} />
    {#if tag.trim() !== ''}
      <button class="delete-button" onclick={() => removeTag(index)}>×</button>
    {/if}
  </div>
{/snippet}

<div class="tags">
  {#if temp_tags}
    {#each temp_tags as tag, index}
      {@render tagItem(tag, index)}
    {/each}
  {/if}
</div>

<style lang="scss" scoped>
  /* 标签是否换行 */
  $tags-flex-wrap: var(--tags_flex_wrap, wrap);

  /* 标签行间距 */
  $tags-gap: var(--tags_gap, 10px);

  /* 标签前颜色方块icon的宽高设置 */
  $tag-icon-width: var(--tag_icon_width, 14px);
  $tag-icon-height: var(--tag_icon_height, 14px);

  /* 标签宽高设置 */
  $tag-width: var(--tag_width, 100px);
  $tag-height: var(--tag_height, 17px);

  /* 标签内输入框宽高设置 */
  $tag-input-width: var(--tag_input_width, 64px);
  $tag-input-height: var(--tag_input_height, 17px);

  .tags {
    display: flex;
    gap: $tags-gap;
    flex-wrap: $tags-flex-wrap;
  }

  .tag {
    display: flex;
    align-items: center;
    background: white;
    width: $tag-width;
    height: $tag-height;
  }

  .tag-square {
    width: $tag-icon-width;
    height: $tag-icon-height;
    background-color: #38bdf8;
    margin-right: 5px;
  }

  .tag-input {
    border: none;
    outline: none;
    font-size: 14px;
    width: $tag-input-width;
    background: transparent;
    color: #797979;
    transition:
      color 0.3s,
      border-bottom 0.3s; /* 添加过渡效果 */
    border-bottom: 1px solid transparent; /* 默认状态下底部没有线 */
    padding: 0 2px 0 2px;
  }

  .tag-input:hover {
    color: #000000;
    border-bottom: 1px solid #0336ff;
  }

  .tag-input::placeholder {
    color: #aaa;
  }

  .delete-button {
    display: flex;
    justify-content: center;
    background: none;
    border: none;
    color: rgba($color: #797979, $alpha: 0.9);
    font-size: 18px;
    padding: 2px 0 0 0;
    cursor: pointer;
  }
</style>
