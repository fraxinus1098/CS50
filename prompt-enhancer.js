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
        // Initialize UI elements
        this.setupEventListeners();
        // Load saved API key
        await this.loadApiKey();
    }

    setupEventListeners() {
        document.getElementById('save-api-key').addEventListener('click', () => this.saveApiKey());
        document.getElementById('enhance-prompt').addEventListener('click', () => this.enhancePrompt());
        document.getElementById('copy-enhanced').addEventListener('click', () => this.copyEnhancedPrompt());
    }

    async loadApiKey() {
        try {
            const result = await chrome.storage.local.get('hf_api_key');
            if (result.hf_api_key) {
                this.apiKey = result.hf_api_key;
                document.getElementById('hf-api-key').value = '********';
                this.updateApiStatus('API key loaded', 'success');
            }
        } catch (error) {
            console.error('Error loading API key:', error);
            this.updateApiStatus('Error loading API key', 'error');
        }
    }

    async saveApiKey() {
        const apiKey = document.getElementById('hf-api-key').value;
        if (!apiKey) {
            this.updateApiStatus('Please enter an API key', 'error');
            return;
        }

        try {
            await chrome.storage.local.set({ 'hf_api_key': apiKey });
            this.apiKey = apiKey;
            this.updateApiStatus('API key saved successfully', 'success');
        } catch (error) {
            console.error('Error saving API key:', error);
            this.updateApiStatus('Error saving API key', 'error');
        }
    }

    updateApiStatus(message, type) {
        const statusEl = document.getElementById('api-status');
        statusEl.textContent = message;
        statusEl.className = `api-status ${type}`;
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
        
        try {
            loadingSpinner.style.display = 'block';
            enhancedContainer.style.display = 'none';
            
            const instruction = this.constructPromptTemplate(originalPrompt);
            
            const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: instruction,
                    parameters: {
                        max_length: 1000,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true
                    }
                })
            });
    
            // New logging for response status
            console.log('Enhance Prompt Response:', {
                status: response.status,
                statusText: response.statusText
            });
    
            const responseText = await response.text();
            console.log('Raw API Response:', responseText);
    
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}: ${responseText}`);
            }
    
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Failed to parse API response: ${responseText}`);
            }
    
            if (!Array.isArray(result) || !result[0]?.generated_text) {
                throw new Error(`Invalid response format: ${JSON.stringify(result)}`);
            }
    
            const enhancedPrompt = result[0].generated_text;
            document.getElementById('enhanced-prompt').textContent = enhancedPrompt;
            enhancedContainer.style.display = 'block';
            this.updateApiStatus('Prompt enhanced successfully', 'success');
            
        } catch (error) {
            console.error('Detailed error:', error);
            
            if (error.message.includes('Failed to fetch')) {
                this.updateApiStatus('Network error: Please check your internet connection', 'error');
            } else if (error.message.includes('401')) {
                this.updateApiStatus('Invalid API key or unauthorized access', 'error');
            } else if (error.message.includes('429')) {
                this.updateApiStatus('Rate limit exceeded. Please try again later', 'error');
            } else if (error.message.includes('503')) {
                this.updateApiStatus('Model is currently loading. Please try again in a moment', 'error');
            } else {
                this.updateApiStatus(`Error: ${error.message}`, 'error');
            }
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    async copyEnhancedPrompt() {
        const enhancedPrompt = document.getElementById('enhanced-prompt').textContent;
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

    async testApiKey() {
        try {
          const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: 'Test prompt',
              parameters: {
                max_length: 10
              }
            })
          });
    
          // Log the response for debugging
          console.log('API Test Response:', {
            status: response.status,
            statusText: response.statusText
          });
    
          const responseText = await response.text();
          console.log('API Test Response Text:', responseText);
    
          if (!response.ok) {
            throw new Error(`API key test failed with status ${response.status}: ${responseText}`);
          }
    
          return true;
        } catch (error) {
          console.error('API key test failed:', error);
          return false;
        }
      }
    
    // Update the saveApiKey method to test the key immediately
    async saveApiKey() {
        const apiKey = document.getElementById('hf-api-key').value;
        
        if (!apiKey) {
          this.updateApiStatus('Please enter an API key', 'error');
          return;
        }
    
        // Validate API key format
        if (!apiKey.startsWith('hf_')) {
          this.updateApiStatus('Invalid API key format. Key should start with "hf_"', 'error');
          return;
        }
    
        try {
          this.apiKey = apiKey;
          const isValid = await this.testApiKey();
          
          if (!isValid) {
            throw new Error('Invalid API key');
          }
    
          await chrome.storage.local.set({ 'hf_api_key': apiKey });
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