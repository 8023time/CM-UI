import Toast from './Toast.svelte';
import { mount } from 'svelte';

let toastContainer;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'success', duration = 3000, showClose = true) {
  ensureContainer();
  const container = document.createElement('div');
  toastContainer.appendChild(container);
  mount(Toast, {
    target: container,
    props: {
      message,
      type,
      duration,
      showClose,
    },
  });
  setTimeout(() => {
    container.remove();
  }, duration + 500);
  if (toastContainer && toastContainer.childElementCount === 0) {
    toastContainer = null;
    toastContainer.remove();
  }
}

/**
 * toast 提示组件
 * @params
 * @param {string} [message='']   - 提示内容
 * @param {'success' | 'error' | 'warning'} [type='success']   - 提示类型
 * @param {number} [duration=3000]   - 自动关闭时间，单位毫秒
 * @param {boolean} [showClose=true]   - 是否显示关闭按钮
 *
 * @example
 * toast.success('操作成功');
 * toast.error('请求失败', 5000);
 * toast.warning('请填写完整信息',3000,false);
 */
export const toast = {
  success: (msg, duration = 3000, showClose = true) => showToast(msg, 'success', duration, showClose),
  error: (msg, duration = 3000, showClose = true) => showToast(msg, 'error', duration, showClose),
  warning: (msg, duration = 3000, showClose = true) => showToast(msg, 'warning', duration, showClose),
};
