chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
  });