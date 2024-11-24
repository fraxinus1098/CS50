// sidepanel.js
const tips = [
    {
      title: "Be Clear, direct, and detailed - Anonymizing Customer Feedback",
      content: `Your task is to anonymize customer feedback for our quarterly review.

Instructions:
1. Replace all customer names with "CUSTOMER_[ID]" (e.g., "Jane Doe" → "CUSTOMER_001").
2. Replace email addresses with "EMAIL_[ID]@example.com".
3. Redact phone numbers as "PHONE_[ID]".
4. If a message mentions a specific product (e.g., "AcmeCloud"), leave it intact.
5. If no PII is found, copy the message verbatim.
6. Output only the processed messages, separated by "---".

Data to process: {{FEEDBACK_DATA}}`
    },

    {
        title: "Be Clear, direct, and detailed - Crafting a Marketing Email Campaign",
        content: `Your task is to craft a targeted marketing email for our Q3 AcmeCloud feature release.

Instructions:
1. Write for this target audience: Mid-size tech companies (100-500 employees) upgrading from on-prem to cloud.
2. Highlight 3 key new features: advanced data encryption, cross-platform sync, and real-time collaboration.
3. Tone: Professional yet approachable. Emphasize security, efficiency, and teamwork.
4. Include a clear CTA: Free 30-day trial with priority onboarding.
5. Subject line: Under 50 chars, mention “security” and “collaboration”.
6. Personalization: Use {{COMPANY_NAME}} and {{CONTACT_NAME}} variables.

Structure:
1. Subject line
2. Email body (150-200 words)
3. CTA button text`
    },

    {
        title: "Be Clear, direct, and detailed - Incident Response",
        content: `Analyze this AcmeCloud outage report. Skip the preamble. Keep your response terse and write only the bare bones necessary information. List only:
1) Cause
2) Duration
3) Impacted services
4) Number of affected users
5) Estimated revenue loss.

Here’s the report: {{REPORT}}`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

    {
        title: "a",
        content: `a`
    },

  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure proper character encoding in the HTML file
    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    document.head.appendChild(meta);

    const container = document.getElementById('tips-container');
    
    tips.forEach((tip) => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'tip-container';
        
        const button = document.createElement('button');
        button.className = 'tip-button';
        // Use textContent for proper encoding of special characters
        button.textContent = decodeEntities(tip.title);
        
        const content = document.createElement('div');
        content.className = 'tip-content';
        // Use innerHTML with sanitization for formatted text
        content.innerHTML = sanitizeHTML(decodeEntities(tip.content));
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy to Clipboard';
        
        button.addEventListener('click', () => {
            const wasActive = content.classList.contains('active');
            document.querySelectorAll('.tip-content').forEach(el => {
                el.classList.remove('active');
            });
            if (!wasActive) {
                content.classList.add('active');
            }
        });
        
        copyButton.addEventListener('click', async () => {
            try {
                // Ensure proper encoding when copying to clipboard
                await navigator.clipboard.writeText(decodeEntities(tip.content));
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy to Clipboard';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
        
        content.appendChild(copyButton);
        tipDiv.appendChild(button);
        tipDiv.appendChild(content);
        container.appendChild(tipDiv);
    });
});

// Helper function to decode HTML entities
function decodeEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// Helper function to sanitize HTML content
function sanitizeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
}