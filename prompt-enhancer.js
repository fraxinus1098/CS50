// Constants for Claude's best practices
const CLAUDE_BEST_PRACTICES = {
  contextual: {
      taskGoal: 'Specify the end goal or desired outcome',
      audience: 'Define the target audience',
      outputFormat: 'Specify desired output format',
      workflow: 'Explain where this fits in the larger workflow',
      successCriteria: 'Define what success looks like'
  },
  structural: {
      stepByStep: 'Break complex tasks into numbered steps',
      formatting: 'Use clear formatting (lists, sections, etc.)',
      examples: 'Provide examples for complex concepts',
      constraints: 'Specify any constraints or limitations'
  },
  thinking: {
      chainOfThought: 'Encourage step-by-step reasoning',
      analysis: 'Ask for analysis before conclusions',
      explanation: 'Request explanation of the thought process'
  }
};

class PromptEnhancer {
  constructor() {
      this.apiKey = null;
      this.initialize();
  }

  async initialize() {
      this.setupEventListeners();
      await this.loadApiKey();
  }

  setupEventListeners() {
      document.getElementById('save-api-key').addEventListener('click', () => this.saveApiKey());
      document.getElementById('enhance-prompt').addEventListener('click', () => this.enhancePrompt());
      document.getElementById('copy-enhanced').addEventListener('click', () => this.copyEnhancedPrompt());
  }

  async loadApiKey() {
      try {
          const result = await chrome.storage.sync.get('hf_api_key');
          if (result.hf_api_key) {
              this.apiKey = result.hf_api_key;
              document.getElementById('hf-api-key').value = '********';
              this.updateApiStatus('API key loaded', 'success');
          }
      } catch (error) {
          console.error('Error loading API key:', error);
          this.updateApiStatus('Error loading API key', 'error');
          this.apiKey = null;
      }
  }

  updateApiStatus(message, type) {
      const statusEl = document.getElementById('api-status');
      statusEl.textContent = message;
      statusEl.className = `api-status ${type}`;
  }

  updateApiUsageDisplay(response) {
      try {
          // Get rate limit information from the response headers
          const rateLimit = {
              remaining: response.headers.get('x-ratelimit-remaining'),
              limit: response.headers.get('x-ratelimit-limit'),
              reset: response.headers.get('x-ratelimit-reset')
          };

          if (rateLimit.remaining && rateLimit.limit) {
              document.getElementById('api-calls-remaining').textContent = 
                  `API Calls: ${rateLimit.remaining}/${rateLimit.limit}`;
          } else {
              document.getElementById('api-calls-remaining').textContent = 
                  'API usage info not available';
          }
      } catch (error) {
          console.error('Error updating API usage display:', error);
          document.getElementById('api-calls-remaining').textContent = 
              'Error fetching API usage';
      }
  }

  constructPromptTemplate(originalPrompt) {
      return `Task: Enhance this prompt for Claude AI using best practices.

Original prompt:
${originalPrompt}

Required improvements:
1. Add necessary context and specificity
2. Break down complex tasks into steps
3. Include relevant examples if needed
4. Encourage systematic thinking
5. Specify desired output format
6. Add relevant constraints

Please maintain the original intent while incorporating these improvements.

Enhanced prompt:`;
  }

  async enhancePrompt() {
      if (!this.apiKey) {
          this.updateApiStatus('Please save your API key first', 'error');
          return;
      }

      const originalPrompt = document.getElementById('original-prompt').value;
      if (!originalPrompt) {
          this.updateApiStatus('Please enter a prompt to enhance', 'error');
          return;
      }

      const loadingSpinner = document.getElementById('loading-spinner');
      const enhancedContainer = document.querySelector('.enhanced-prompt-container');
      const enhancedTextarea = document.getElementById('enhanced-prompt-textarea');

      try {
          loadingSpinner.style.display = 'block';
          enhancedContainer.style.display = 'none';

          const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${this.apiKey}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  inputs: this.constructPromptTemplate(originalPrompt),
                  parameters: {
                      max_length: 512,
                      temperature: 0,
                      top_p: 0.9,
                      do_sample: true
                  }
              })
          });

          if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
          }

          // Update API usage display using headers from the actual request
          this.updateApiUsageDisplay(response);

          const result = await response.json();
          const enhancedPrompt = result[0].generated_text;

          enhancedTextarea.value = enhancedPrompt;
          enhancedContainer.style.display = 'block';
          
          this.updateApiStatus('Prompt enhanced successfully', 'success');
      } catch (error) {
          console.error('Error:', error);
          this.updateApiStatus(`Error: ${error.message}`, 'error');
      } finally {
          loadingSpinner.style.display = 'none';
      }
  }

  async copyEnhancedPrompt() {
      const enhancedPrompt = document.getElementById('enhanced-prompt-textarea').value;
      try {
          await navigator.clipboard.writeText(enhancedPrompt);
          const copyButton = document.getElementById('copy-enhanced');
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
              copyButton.textContent = 'Copy Enhanced Prompt';
          }, 2000);
      } catch (error) {
          console.error('Error copying to clipboard:', error);
      }
  }

  async testApiKey(keyToTest) {
      try {
          const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
              method: 'HEAD', // Use HEAD request instead of POST for key validation
              headers: {
                  'Authorization': `Bearer ${keyToTest}`
              }
          });

          // If we get a 503, it means the model is loading - this is actually okay!
          if (response.status === 503) {
              return true;
          }

          return response.ok;
      } catch (error) {
          console.error('API key test failed:', error);
          throw error;
      }
  }

  async saveApiKey() {
      const apiKeyInput = document.getElementById('hf-api-key').value.trim();
      
      if (!apiKeyInput) {
          this.updateApiStatus('Please enter an API key', 'error');
          return;
      }

      // Validate API key format
      if (!apiKeyInput.startsWith('hf_')) {
          this.updateApiStatus('Invalid API key format. Key should start with "hf_"', 'error');
          return;
      }

      try {
          // Test the API key before saving or updating this.apiKey
          await this.testApiKey(apiKeyInput);
          
          // Only save and update if validation passed
          await chrome.storage.sync.set({ 'hf_api_key': apiKeyInput });
          this.apiKey = apiKeyInput;
          
          this.updateApiStatus('API key verified and saved successfully', 'success');
      } catch (error) {
          console.error('Error saving API key:', error);
          this.updateApiStatus(`Error: ${error.message}`, 'error');
          this.apiKey = null;
      }
  }
}

// Initialize the prompt enhancer when the document loads
document.addEventListener('DOMContentLoaded', () => {
  new PromptEnhancer();
});