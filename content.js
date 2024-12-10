/**
 * Content script that monitors URL changes
 * Triggers side panel opening when on claude.ai/new
 */
if (window.location.href.includes('claude.ai/new')) {
    chrome.runtime.sendMessage({ action: 'openSidePanel' });
  }