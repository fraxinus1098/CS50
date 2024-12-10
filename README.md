# Claude Prompting Tips Chrome Extension

A Chrome extension that provides a helpful side panel with prompting tips and an AI-powered prompt enhancement feature when using Claude.ai.

## Features

### 1. Prompting Tips Side Panel
- Automatically opens when visiting claude.ai/new
- Organized categories of prompting tips including:
  - Clear and detailed prompting strategies
  - Example-based prompting (multishot)
  - Chain of thought prompting
  - XML tag structuring
  - Role-based prompting
  - Complex prompt chaining
  - Long context handling

### 2. AI-Powered Prompt Enhancement
- Uses Hugging Face's FLAN-T5 model to improve your prompts
- Focuses on adding context, specifications, and structure
- Maintains original intent while adding helpful details

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the directory containing the extension files

## Configuration

### Setting up Hugging Face API Access
1. Create a Hugging Face account at https://huggingface.co/
2. Generate an API key from your account settings
3. In the extension's side panel, enter your API key (it should start with 'hf_')
4. Click "Save Key" to store it securely

## Usage

### Accessing Prompting Tips
1. Visit https://claude.ai/new
2. The side panel will automatically open. If not, you can manually pin it.
3. Browse through categories by clicking on them
4. Click individual tips to expand and view details
5. Use the "Copy to Clipboard" button to copy tip content

### Using the Prompt Enhancer
1. Enter your prompt in the text area
2. Click "Enhance Prompt"
3. Wait for the enhanced version to appear
4. Use "Copy Enhanced Prompt" to copy the result

## API Usage Limits

The free Hugging Face API has certain limitations:
- Input sequence length: 2056 tokens (~1,600 words)
- Output sequence length: 512 tokens (~400 words)
- Rate limits apply based on your API key type

## Troubleshooting

Common issues and solutions:

1. Side panel doesn't open automatically (Known bug which has not been fixed yet): 
   - Ensure the extension has the required permissions
   - Check if you're on the correct URL (claude.ai/new)

2. Prompt enhancement fails (WIP. Not Perfect):
   - Verify your API key is correctly saved
   - Check if you've exceeded API rate limits
   - Ensure your prompt isn't too long (stay under 1,250 words)

3. API key issues:
   - Confirm the key starts with 'hf_'
   - Try re-saving the key
   - Check your Hugging Face account status

## Privacy Notice

This extension:
- Only activates on claude.ai
- Stores your Hugging Face API key locally
- Sends prompts to Hugging Face's API for enhancement
- Does not collect or store any user data

## Misc Design Thoughts as I was implementing these features
Why was using Huggingface's free API call not ideal?

The Flan-T5 models have different token limits for input and output:
- Input sequence length: 2056 tokens
- Output sequence length: 512 tokens

When using the HuggingFace API, I need to set a lower max_length parameter (around 64 tokens) to avoid timeout errors. 

For reference, 512 tokens is approximately equivalent to 400 words and 2056 is 1,600 words

Sources:
1. https://huggingface.co/google/flan-t5-xxl/discussions/41
2. https://huggingface.co/google/flan-t5-large/discussions/14
3. https://huggingface.co/google/flan-t5-large

Claude's official metaprompt:
The official metaprompt was about 3.9K words which far suprasses the input sequence length that Huggingface's free API call could provide. Therefore, I had to trim down a few things, namely removing the math and function part of the metaprompt to reach 1,250 words. This leaves approximately 350 words for the input and other considerations.

Sources:
1. https://colab.research.google.com/drive/1SoAajN8CBYTl79VyTwxtxncfCWlHlyy9#scrollTo=NTOiFKNxqoq2
2. https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator