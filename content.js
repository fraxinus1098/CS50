if (window.location.href.includes('claude.ai/new')) {
    chrome.runtime.sendMessage({ action: 'openSidePanel' });
  }