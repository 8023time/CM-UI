<!--/**
 * @Author: wusaber33
 * @Date: 2025-04-23 20:22:44
 * @LastEditors: wusaber33
 * @LastEditTime: 2025-04-26 22:05:58
 * @FilePath: \tutorial-platform-fe\src\routes\teacher\paperManagement\UneditableTag.svelte
 * @Description: 
 * @Copyright (c) 2025 by wusaber33, All Rights Reserved. 
 */ -->
<script>
  const COLOR_LIST = [
    // 保留原颜色列表不变
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
    '#72deff',
    '#4fd4d9',
    '#83def5',
    '#ffa040',
    '#ffb359',
    '#ffc26d',
    '#ffcf85',
    '#ff9eac',
    '#ffb3c0',
    '#ffc6d1',
    '#ffd9e0',
    '#c6ff8c',
    '#d9ff99',
    '#e0ffb3',
    '#e6ffcc',
  ];

  export let content = '';
  export let colors = COLOR_LIST;
</script>

<div class="tag-container">
  <!-- 颜色块保持不变 -->
  <div class="tag-color" style="background-color: {COLOR_LIST[content.charAt(0).charCodeAt(0) % colors.length]}"></div>

  <!-- 文本内容改为纯展示 -->
  <div class="tag-content">
    <span class="tag-text">{content}</span>
  </div>
</div>

<style lang="scss" scoped>
  .tag-container {
    display: flex;
    align-items: center;
    width: max-content;
    max-width: 150px;

    .tag-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-right: 6px;
    }

    .tag-content {
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .tag-text {
        display: block;
        padding: 2px 4px;
        border-radius: 3px;
      }
    }
  }
</style>
