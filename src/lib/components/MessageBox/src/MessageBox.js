import MessageBox from './MessageBox.svelte';
import { mount, unmount } from 'svelte';

/**
 * @description 动态挂载一个消息弹窗组件
 * @param {Object} options 配置项
 * @param {string} options.title 弹窗标题，默认“温馨提示”
 * @param {string} options.content 弹窗内容
 * @param {boolean} options.center 是否居中显示内容
 * @param {string} options.cancel_text 取消按钮文本，默认“取消”
 * @param {string} options.confirm_text 确认按钮文本，默认“确定”
 * @param {boolean} options.show_cancel_icon 是否显示右上角取消图标
 * @param {boolean} options.show_cancel_button 是否显示取消按钮
 * @param {boolean} options.show_confirm_button 是否显示确认按钮
 * @param {string} options.cancel_button_type 取消按钮类型，默认“info”
 * @param {string} options.confirm_button_type 确认按钮类型，默认“primary”
 * @param {Function} options.onConfirm 点击确认回调（支持 async）
 * @param {Function} options.onCancel 点击取消回调（支持 async）
 */
export default function ({
  title = '温馨提示',
  content = '',
  center = false,
  cancel_text = '取消',
  confirm_text = '确定',
  show_cancel_icon = true,
  show_cancel_button = true,
  show_confirm_button = true,
  cancel_button_type = 'info',
  confirm_button_type = 'primary',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  let app = mount(MessageBox, {
    target: container,
    props: {
      visible: true,
      title,
      center,
      content,
      confirm_text,
      cancel_text,
      show_cancel_icon,
      cancel_button_type,
      show_cancel_button,
      show_confirm_button,
      confirm_button_type,
      onConfirm: async () => {
        await onConfirm();
        unmount(app, { outro: true });
        container.remove();
      },
      onCancel: async () => {
        await onCancel();
        unmount(app, { outro: true });
        container.remove();
      },
    },
  });
}
