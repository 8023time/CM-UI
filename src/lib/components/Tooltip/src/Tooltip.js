import Tooltip from './Tooltip.svelte';
import { mount, unmount } from 'svelte';

let container;

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'Tooltip-container';
    document.body.appendChild(container);
  }
}

export function tooltip(node, options) {
  if (!options?.content) return;
  ensureContainer();
  const TooltipInstance = mount(Tooltip, {
    target: container,
    props: {
      target: node,
      ...options,
    },
  });

  // 监听 node 是否从 DOM 移除
  const observer = new MutationObserver(() => {
    if (!document.body.contains(node)) {
      unmount(TooltipInstance);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
  };
}
