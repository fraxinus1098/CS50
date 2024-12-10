/**
 * Background service worker
 * Handles message passing and side panel management
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
  });