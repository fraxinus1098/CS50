// tips from https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct#example-anonymizing-customer-feedback

const tips = [
    {
        title: "Be clear, direct, and detailed",
        content: `Your task is to anonymize customer feedback for our quarterly review.
        
        Instructions:
        1. Replace all customer names with “CUSTOMER_[ID]” (e.g., “Jane Doe” → “CUSTOMER_001”).
        2. Replace email addresses with “EMAIL_[ID]@example.com”.
        3. Redact phone numbers as “PHONE_[ID]“.
        4. If a message mentions a specific product (e.g., “AcmeCloud”), leave it intact.
        5. If no PII is found, copy the message verbatim.
        6. Output only the processed messages, separated by ”---“.
        
        Data to process: {{FEEDBACK_DATA}}`
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },

    {
        title: "X",
        content: 'X'
    },
];

document.addEventListener('DOMContentLoaded', () => {
    const container=document.getElementById('tips-container');

    tips.forEach((tip) => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'tip-container';

        const button = document.createElement('button');
        button.className = 'tip-button';
        button.textContent = tip.title;

        const content = document.createElement('div');
        content.className = 'tip-content';
        content.textContent = tip.content;

        button.addEventListener('click', () => {
            const wasActive = content.classList.contains('active');
            document.querySelectorAll('.tip-content').forEach(el => {
                el.classList.remove('active');
            });
            if (!wasActive) {
                content.classList.add('active');
            }
        });
        tipDiv.appendChild(button);
        tipDiv.appendChild(content);
        container.appendChild(tipDiv);
    });
});