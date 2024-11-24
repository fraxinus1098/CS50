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
            const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-xl', {
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

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const result = await response.json();
            const enhancedPrompt = result[0].generated_text;
            
            document.getElementById('enhanced-prompt').textContent = enhancedPrompt;
            enhancedContainer.style.display = 'block';
            this.updateApiStatus('Prompt enhanced successfully', 'success');
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            this.updateApiStatus('Error enhancing prompt', 'error');
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
}

// Initialize the prompt enhancer when the document loads
document.addEventListener('DOMContentLoaded', () => {
    new PromptEnhancer();
});