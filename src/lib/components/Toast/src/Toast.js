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
    if (toastContainer && toastContainer.childElementCount === 0) {
      toastContainer.remove();
      toastContainer = null;
    }
  }, duration + 500);
}


export const toast = {
  success: (msg, duration = 3000, showClose = true) => showToast(msg, 'success', duration, showClose),
  error: (msg, duration = 3000, showClose = true) => showToast(msg, 'error', duration, showClose),
  warning: (msg, duration = 3000, showClose = true) => showToast(msg, 'warning', duration, showClose),
};
