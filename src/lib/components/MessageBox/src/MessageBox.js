import MessageBox from './MessageBox.svelte';
import { mount, unmount } from 'svelte';
import { getType } from '$lib/utils/index.js';

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

export  function MessageBox (options = {}) {
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
