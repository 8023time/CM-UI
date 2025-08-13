import MessageBox from './MessageBox.svelte';
import { mount, unmount } from 'svelte';
import { getType } from '$lib/utils/index.js';

/**
 * 默认配置
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  content: '',
  center: false,
  visible: false,
  type: 'primary',
  title: '温馨提示',
  cancel_text: '取消',
  confirm_text: '确定',
  show_cancel_icon: true,
  show_cancel_button: true,
  show_confirm_button: true,
  cancel_button_type: 'info',
  confirm_button_type: 'primary',
  on_close_by_click_outside: true,
  onCancel: () => {},
  onConfirm: () => {},
};

/**
 * @component MessageBox
 * @description 动态挂载一个消息弹窗组件
 *
 * @param {Object} options 配置项
 * @param {string} [options.title="温馨提示"] 弹窗标题
 * @param {string} [options.content=""] 弹窗内容
 * @param {boolean} [options.center=false] 是否居中显示内容
 * @param {string} [options.cancel_text="取消"] 取消按钮文本
 * @param {string} [options.confirm_text="确定"] 确认按钮文本
 * @param {boolean} [options.show_cancel_icon=true] 是否显示右上角取消图标
 * @param {boolean} [options.show_cancel_button=true] 是否显示取消按钮
 * @param {boolean} [options.show_confirm_button=true] 是否显示确认按钮
 * @param {boolean} [options.on_close_by_click_outside=true] 点击空白区域是否关闭弹窗
 * @param {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.type="primary"] 弹窗类型
 * @param {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.cancel_button_type="info"] 取消按钮类型
 * @param {'primary' | 'success' | 'danger' | 'warning' | 'info'} [options.confirm_button_type="primary"] 确认按钮类型
 * @param {Function} [options.onCancel] 点击取消的回调函数
 * @param {Function} [options.onConfirm] 点击确认的回调函数
 */
export default function (options = {}) {
  const props = { ...DEFAULT_OPTIONS, ...options };
  const container = document.createElement('div');
  document.body.appendChild(container);

  /**
   * 关闭弹窗
   * @param {*} callback
   * @returns
   */
  const close = (callback, key) => async () => {
    if (!['function', 'asyncfunction'].includes(getType(callback))) {
      console.warn(`[MessageBox] 属性 '${key}' 无效: 类型错误, 期望类型为${['function', 'asyncfunction'].join('、')}, 实际类型为${getType(callback)}, 已使用默认值 '() => {}', 传入值为: '${callback}'`);
      callback = () => {};
    }
    await callback?.();
    unmount(app, { outro: true });
    container.remove();
  };

  const app = mount(MessageBox, {
    target: container,
    props: {
      ...props,
      visible: true,
      onCancel: close(props.onCancel, 'onCancel'),
      onConfirm: close(props.onConfirm, 'onConfirm'),
    },
  });
}
