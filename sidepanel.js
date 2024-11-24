// sidepanel.js
const tips = [
    {
      title: "Be Clear, direct, and detailed",
      isCategory: true,
      subtips: [
        {
            title: "Overall Guidelines",
            content: `Give Claude contextual information: Just like you might be able to better perform on a task if you knew more context, Claude will perform better if it has more contextual information. Some examples of contextual information:

1. What the task results will be used for
2. What audience the output is meant for
3. What workflow the task is a part of, and where this task belongs in that workflow
4. The end goal of the task, or what a successful task completion looks like
5. Be specific about what you want Claude to do: For example, if you want Claude to output only code and nothing else, say so.
6. Provide instructions as sequential steps: Use numbered lists or bullet points to better ensure that Claude carries out the task the exact way you want it to.`
          },
        {
          title: "Anonymizing Customer Feedback",
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
          title: "Crafting a Marketing Email Campaign",
          content: `Your task is to craft a targeted marketing email for our Q3 AcmeCloud feature release.
  
  Instructions:
  1. Write for this target audience: Mid-size tech companies (100-500 employees) upgrading from on-prem to cloud.
  2. Highlight 3 key new features: advanced data encryption, cross-platform sync, and real-time collaboration.
  3. Tone: Professional yet approachable. Emphasize security, efficiency, and teamwork.
  4. Include a clear CTA: Free 30-day trial with priority onboarding.
  5. Subject line: Under 50 chars, mention "security" and "collaboration".
  6. Personalization: Use {{COMPANY_NAME}} and {{CONTACT_NAME}} variables.`
        },
        {
          title: "Incident Response",
          content: `Analyze this AcmeCloud outage report. Skip the preamble. Keep your response terse and write only the bare bones necessary information. List only:
  
  1) Cause
  2) Duration
  3) Impacted services
  4) Number of affected users
  5) Estimated revenue loss.
  
  Here's the report: {{REPORT}}`
        }
      ]
    },
    {
        title: "Use examples (multishot prompting) to guide Claude's Behavior",
        isCategory: true,
        subtips: [
          {
            title: "Analyzing Customer Feedback",
            content: `Our CS team is overwhelmed with unstructured feedback. Your task is to analyze feedback and categorize issues for our product and engineering teams. Use these categories: UI/UX, Performance, Feature Request, Integration, Pricing, and Other. Also rate the sentiment (Positive/Neutral/Negative) and priority (High/Medium/Low). Here is an example:

<example>
Input: The new dashboard is a mess! It takes forever to load, and I can’t find the export button. Fix this ASAP!
Category: UI/UX, Performance
Sentiment: Negative
Priority: High
</example>

Now, analyze this feedback: {{FEEDBACK}}`
          },
        ]
    },
    {
        title: "Let Claude Think (Chain of Thought)",
        isCategory: true,
        subtips: [
          {
            title: "Overall Guidance",
            content: `When faced with complex tasks like research, analysis, or problem-solving, giving Claude space to think can dramatically improve its performance. This technique, known as chain of thought (CoT) prompting, encourages Claude to break down problems step-by-step, leading to more accurate and nuanced outputs.

​
Before implementing CoT
Why let Claude think?
1. Accuracy: Stepping through problems reduces errors, especially in math, logic, analysis, or generally complex tasks.
2. Coherence: Structured thinking leads to more cohesive, well-organized responses.
3. Debugging: Seeing Claude’s thought process helps you pinpoint where prompts may be unclear.
​
Why not let Claude think?
1. Increased output length may impact latency.
2. Not all tasks require in-depth thinking. Use CoT judiciously to ensure the right balance of performance and latency.`
          },
          {
            title: "Writing Donor Emails (Structured Guided CoT)",
            content: `	Draft personalized emails to donors asking for contributions to this year’s Care for Kids program.

Program information:
<program>
{{PROGRAM_DETAILS}}
</program>

Donor information:
<donor>
{{DONOR_DETAILS}}
</donor>

Think before you write the email in <thinking> tags.
First, think through what messaging might appeal to this donor given their donation history and which campaigns they’ve supported in the past.
Then, think through what aspects of the Care for Kids program would appeal to them, given their history.
Finally, write the personalized donor email in <email> tags, using your analysis.`
          },
          {
            title: "Financial Analysis With Thinking",
            content: `You’re a financial advisor. A client wants to invest $10,000. They can choose between two options:
            
            A) A stock that historically returns 12% annually but is volatile, or
            B) A bond that guarantees 6% annually.
            The client needs the money in 5 years for a down payment on a house. Which option do you recommend?
            Think step-by-step.`
          },
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    },
    {
        title: "Your Category Name",
        isCategory: true,
        subtips: [
          {
            title: "Your Subtip 1",
            content: `Your content here`
          },
          {
            title: "Your Subtip 2",
            content: `Your content here`
          }
        ]
    }
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    document.head.appendChild(meta);
  
    const container = document.getElementById('tips-container');
    
    tips.forEach((category) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category-container';
      
      const categoryButton = document.createElement('button');
      categoryButton.className = 'category-button';
      categoryButton.textContent = decodeEntities(category.title);
      
      const subtipsContainer = document.createElement('div');
      subtipsContainer.className = 'subtips-container';
  
      categoryButton.addEventListener('click', () => {
        const wasActive = subtipsContainer.classList.contains('active');
        // Close all other categories
        document.querySelectorAll('.subtips-container').forEach(el => {
          el.classList.remove('active');
        });
        if (!wasActive) {
          subtipsContainer.classList.add('active');
        }
      });
  
      if (category.isCategory) {
        category.subtips.forEach((tip) => {
          const tipDiv = document.createElement('div');
          tipDiv.className = 'tip-container';
          
          const tipButton = document.createElement('button');
          tipButton.className = 'tip-button';
          tipButton.textContent = decodeEntities(tip.title);
          
          const content = document.createElement('div');
          content.className = 'tip-content';
          content.innerHTML = sanitizeHTML(decodeEntities(tip.content));
          
          const copyButton = document.createElement('button');
          copyButton.className = 'copy-button';
          copyButton.textContent = 'Copy to Clipboard';
          
          tipButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent category from collapsing
            const wasActive = content.classList.contains('active');
            document.querySelectorAll('.tip-content').forEach(el => {
              el.classList.remove('active');
            });
            if (!wasActive) {
              content.classList.add('active');
            }
          });
          
          copyButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent bubbling
            try {
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
          tipDiv.appendChild(tipButton);
          tipDiv.appendChild(content);
          subtipsContainer.appendChild(tipDiv);
        });
      }
      
      categoryDiv.appendChild(categoryButton);
      categoryDiv.appendChild(subtipsContainer);
      container.appendChild(categoryDiv);
    });
  });
  
  function decodeEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  
  function sanitizeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/→/g, '\u2192')
      .replace(/\n/g, '<br>');
  }