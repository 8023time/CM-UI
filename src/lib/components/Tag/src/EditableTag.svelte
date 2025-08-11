<!--
 * @Author: Zpekii 3156752796@qq.com
 * @Date: 2025-04-07 15:25:05
 * @LastEditors: Zpekii 3156752796@qq.com
 * @LastEditTime: 2025-04-08 21:57:22
 * @FilePath: \exam-fe\src\lib\component\EditableTag.svelte
 * @Description: 可编辑tag
 * @Copyright (c) 2025 by Zpekii, All Rights Reserved. 
-->

<!--                         o8o                 .   
                             `"'               .o8   
 .oooo.o  .ooooo.  oooo d8b oooo  oo.ooooo.  .o888oo 
d88(  "8 d88' `"Y8 `888""8P `888   888' `88b   888   
`"Y88b.  888        888      888   888   888   888   
o.  )88b 888   .o8  888      888   888   888   888 . 
8""888P' `Y8bod8P' d888b    o888o  888bod8P'   "888" 
                                   888               
                                  o888o              
                                                      -->
<script>
  /**
   * @type {Array<string>} 颜色列表
   */
  const COLOR_LIST = [
    // 浅蓝色系列
    '#40d5ff', // 浅蓝色
    '#59dcff', // 稍亮的浅蓝色
    '#33c1e8', // 稍深的浅蓝色
    '#6adbff', // 更浅的蓝色
    '#26caef', // 青蓝色
    '#4dd6eb', // 浅青色
    '#6dcaf2', // 天蓝色
    '#52c2ff', // 亮蓝色
    '#7fd3f3', // 淡蓝色
    '#47d0db', // 绿松石色
    '#5bc8f2', // 粉蓝色
    '#40c4e0', // 中等浅蓝色
    '#72deff', // 亮天蓝色
    '#4fd4d9', // 浅绿蓝色
    '#83def5', // 非常浅的天蓝色

    // 浅橙色系列
    '#ffa040', // 浅橙色
    '#ffb359', // 杏橙色
    '#ffc26d', // 淡杏色
    '#ffcf85', // 米黄橙色

    // 浅粉色系列
    '#ff9eac', // 浅粉红
    '#ffb3c0', // 淡粉色
    '#ffc6d1', // 少女粉
    '#ffd9e0', // 浅蜜桃色

    // 浅紫色系列
    '#d5a6ff', // 浅紫色
    '#e0bfff', // 淡薰衣草色
    '#eed2ff', // 浅丁香色
    '#f2dcff', // 极淡紫色

    // 浅黄绿色系列
    '#c6ff8c', // 浅黄绿
    '#d9ff99', // 淡黄绿
    '#e0ffb3', // 浅草绿色
    '#e6ffcc', // 浅黄绿色
  ];

  /**
   * @type {{
   *      content: string;                    // tag内容
   *      handle_funcs?: {
   *          delete?: function;                          // 删除tag的处理函数
   *          input_blur?: (content: string) => void ;    // 输入框失去焦点的处理函数
   *          input_focus?: function;                     // 输入框获得焦点的处理函数
   *          input_change?: (content: string) => void;   // 输入框内容改变的处理函数, 输入时调用
   *          onchange?: (old_content: string, new_content: string) => void;       // 输入框内容改变的处理函数, 失去焦点时或按下回车时调用
   *      };                                  // 处理函数
   *      colors?: string[];                  // 颜色列表
   *      constraints?: {
   *          min_length?: number;    // 最小长度, 默认0
   *          max_length?: number;    // 最大长度, 默认30
   *          pattern?: string;       // 正则表达式, 默认不限制
   *      };                                  // 约束
   * }}
   */
  let { content = $bindable(''), handle_funcs, colors = COLOR_LIST, constraints } = $props();

  let focused = $state(false);

  let show_clear_btn = $state(false);

  /**
   * @type {string} 原始内容
   */
  let old_content = $state(content);
</script>

<!-- 
    .                                          oooo                .             
  .o8                                          `888              .o8             
.o888oo  .ooooo.  ooo. .oo.  .oo.   oo.ooooo.   888   .oooo.   .o888oo  .ooooo.  
  888   d88' `88b `888P"Y88bP"Y88b   888' `88b  888  `P  )88b    888   d88' `88b 
  888   888ooo888  888   888   888   888   888  888   .oP"888    888   888ooo888 
  888 . 888    .o  888   888   888   888   888  888  d8(  888    888 . 888    .o 
  "888" `Y8bod8P' o888o o888o o888o  888bod8P' o888o `Y888""8o   "888" `Y8bod8P' 
                                     888                                         
                                    o888o                                        
                                                                                 
-->
<div class="tag-container">
  <div class="tag-color" style="background-color: {COLOR_LIST[content.charAt(0).charCodeAt(0) % colors.length]}"></div>

  <div
    class="tag-content"
    role="textbox"
    tabindex="0"
    onfocus={() => {}}
    onblur={() => {
      focused = false;
    }}
    onfocusin={() => {
      focused = true;
    }}
    onfocusout={() => {
      focused = false;
    }}
    onmouseover={() => {
      show_clear_btn = true;
    }}
    onmouseleave={() => {
      show_clear_btn = false;
    }}
  >
    <input
      class="tag-text-input"
      bind:value={content}
      placeholder="+标签"
      title={content}
      onfocus={() => {
        handle_funcs?.input_focus?.();
      }}
      onblur={() => {
        handle_funcs?.input_blur?.(content);
      }}
      onchange={() => {
        handle_funcs?.onchange?.(old_content, content);
      }}
      oninput={() => {
        handle_funcs?.input_change?.(content);
      }}
      minlength={constraints?.min_length ? constraints?.min_length : 0}
      maxlength={constraints?.max_length ? constraints?.max_length : 30}
      pattern={constraints?.pattern ? constraints?.pattern : ''}
    />

    {#if show_clear_btn}
      <button
        class="tag-text-input-clear-btn"
        onmousedown={(e) => {
          e.preventDefault();
        }}
        onclick={() => {
          handle_funcs?.delete?.();
        }}
      >
        <span>⨉</span>
      </button>
    {/if}
  </div>
</div>

<!-- 
             .               oooo            
           .o8               `888            
 .oooo.o .o888oo oooo    ooo  888   .ooooo.  
d88(  "8   888    `88.  .8'   888  d88' `88b 
`"Y88b.    888     `88..8'    888  888ooo888 
o.  )88b   888 .    `888'     888  888    .o 
8""888P'   "888"     .8'     o888o `Y8bod8P' 
                 .o..P'                      
                 `Y8P'                       
                                             
-->
<style lang="scss" scoped>
  .tag-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: max-content;
    max-width: 150px;
    height: 15px;

    .tag-content {
      position: relative;
      display: flex;
      width: max-content;
      height: max-content;
      justify-content: center;
      align-items: center;

      .tag-text-input-clear-btn {
        position: absolute;
        right: 2%;
        border: none;
        background-color: transparent;
        color: #3f3f3f;
        font-size: 12px;
        font-weight: 650;
        width: 20px;
        height: 20px;
        cursor: pointer;

        &:hover {
          color: #0336ff;
        }
      }

      .tag-text-input {
        display: block;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f000;
        color: #999999;
        font-size: 12px;
        font-weight: 500;
        width: 50px;
        max-width: 96px;
        height: 100%;
        border: none;
        text-overflow: ellipsis;
        &:focus {
          color: #333333;
          outline: none;
          border-bottom: 1px solid #7792ff;
        }

        &:hover {
          border-bottom: 1px solid #7792ff;
        }
      }
    }

    .tag-color {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 12px;
      height: 12px;
      border-radius: 1px;
      background-color: #40d5ff;
      margin: 2px;
    }
  }
</style>
