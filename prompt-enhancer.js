/**
 * Manages prompt enhancement functionality using Hugging Face's API
 * Handles API key storage, validation, and prompt processing
 */

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
  
    /**
      * Constructs a template for prompt enhancement
      * @param {string} originalPrompt - The user's input prompt
      * @returns {string} - Formatted template for the model
      */

    constructPromptTemplate(originalPrompt) {
      // Simplified template that focuses on direct enhancement
      return `Please enhance this prompt to make it more effective and detailed:
  
  Original prompt: "${originalPrompt}"
  
  Requirements for the enhanced prompt:
  1. Add specific context and requirements
  2. Include format specifications
  3. Add relevant constraints or parameters
  4. Break down complex tasks into steps
  5. Specify desired output structure
  
  Return only the enhanced prompt with no additional text or explanations.
  
  Enhanced prompt:`;

  /**
     * Processes the prompt through Hugging Face's API
     * Handles loading states, API calls, and response processing
     * @returns {Promise<void>}
     */
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
              temperature: 0, // Set to 0 for deterministic output
              top_p: 1,      // Set to 1 to disable top-p sampling
              do_sample: false, // Disable sampling for deterministic output
              num_return_sequences: 1 // Only return one sequence
            }
          })
        });
  
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
  
        this.updateApiUsageDisplay(response);
  
        const result = await response.json();
        let enhancedPrompt = result[0].generated_text;
  
        // Clean up the response to get only the enhanced prompt
        enhancedPrompt = this.cleanEnhancedPrompt(enhancedPrompt);
        
        // Display the enhanced prompt
        enhancedTextarea.value = enhancedPrompt;
        enhancedContainer.style.display = 'block';
  
      } catch (error) {
        console.error('Error:', error);
        this.updateApiStatus(`Error: ${error.message}`, 'error');
      } finally {
        loadingSpinner.style.display = 'none';
      }
    }
  
    cleanEnhancedPrompt(text) {
      // Remove any potential prefixes or metadata
      let cleaned = text.replace(/^(Enhanced prompt:|\s*)/i, '');
      
      // Remove any trailing instructions or metadata
      cleaned = cleaned.split(/(\n\n|\r\n\r\n)/)[0];
      
      // Trim whitespace
      cleaned = cleaned.trim();
      
      return cleaned;
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
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${keyToTest}`
          }
        });
        
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
  
      if (!apiKeyInput.startsWith('hf_')) {
        this.updateApiStatus('Invalid API key format. Key should start with "hf_"', 'error');
        return;
      }
  
      try {
        await this.testApiKey(apiKeyInput);
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