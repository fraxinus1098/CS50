// sidepanel.js
/**
 * Tips data structure for prompting guidelines
 * Each category contains subtips with title and content
 */

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
  
  Data to process:
  {{FEEDBACK_DATA}}`
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
  
  Here's the report:
  {{REPORT}}`
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
        title: "Use XML Tags to Structure your Prompts",
        isCategory: true,
        subtips: [
          {
            title: "Why Use XLM Tags?",
            content: `XML tip: Use tags like <instructions>, <example>, and <formatting> to clearly separate different parts of your prompt. This prevents Claude from mixing up instructions with examples or context.
​
Why use XML tags?

There are no canonical “best” XML tags that Claude has been trained with in particular, although we recommend that your tag names make sense with the information they surround.`
          },
          {
            title: "Tagging Best Practices",
            content: `1. Be consistent: Use the same tag names throughout your prompts, and refer to those tag names when talking about the content (e.g, Using the contract in <contract> tags...).
2. Nest tags: You should nest tags <outer><inner></inner></outer> for hierarchical content.

Power user tip: Combine XML tags with other techniques like multishot prompting (<examples>) or chain of thought (<thinking>, <answer>). This creates super-structured, high-performance prompts.`
          },

          {
            title: "Generating Financial Reports",
            content: `You’re a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors.

AcmeCorp is a B2B SaaS company. Our investors value transparency and actionable insights.

Use this data for your report
<data>
{{SPREADSHEET_DATA}}
</data>

<instructions>
1. Include sections: Revenue Growth, Profit Margins, Cash Flow.
2. Highlight strengths and areas for improvement.
</instructions>

Make your tone concise and professional. Follow this structure:
<formatting_example>
{{Q1_REPORT}}
</formatting_example>`
          },

          {
            title: "Legal Contract Analysis",
            content: `Analyze this software licensing agreement for legal risks and liabilities.

We’re a multinational enterprise considering this agreement for our core data infrastructure.

<agreement>
{{CONTRACT}}
</agreement>

This is our standard contract for reference:
<standard_contract>
{{STANDARD_CONTRACT}}
</standard_contract>

<instructions>
1. Analyze these clauses:
- Indemnification
- Limitation of liability
- IP ownership

2. Note unusual or concerning terms.

3. Compare to our standard contract.

4. Summarize findings in <findings> tags.

5. List actionable recommendations in <recommendations> tags.
</instructions>`
          },
        ]
    },
    {
        title: "Giving Claude a Role With a Syste Prompt",
        isCategory: true,
        subtips: [
          {
            title: "Legal Contract Analysis With Role Prompting",
            content: `You are the General Counsel of a Fortune 500 tech company. We’re considering this software licensing agreement for our core data infrastructure:

<contract>
{{CONTRACT}}
</contract>

Analyze it for potential risks, focusing on indemnification, liability, and IP ownership. Give your professional opinion.`
          },
          {
            title: "Financial Analysis With Role Prompting",
            content: `You are the CFO of a high-growth B2B SaaS company. We’re in a board meeting discussing our Q2 financials:

<data>
{{FINANCIALS}}
</data>

Analyze key trends, flag concerns, and recommend strategic actions. Our investors want aggressive growth but are wary of our burn rate.`
          }
        ]
    },
    {
        title: "Chain Complex Prompts For Stronger Performance",
        isCategory: true,
        subtips: [
          {
            title: "How to chain prompts",
            content: `1. Identify subtasks: Break your task into distinct, sequential steps.
2. Structure with XML for clear handoffs: Use XML tags to pass outputs between prompts.
3. Have a single-task goal: Each subtask should have a single, clear objective.
4. Iterate: Refine subtasks based on Claude’s performance.
​
Example chained workflows:
1. Multi-step analysis: See the legal and business examples below.
2. Content creation pipelines: Research → Outline → Draft → Edit → Format.
3. Data processing: Extract → Transform → Analyze → Visualize.
4. Decision-making: Gather info → List options → Analyze each → Recommend.
5. Verification loops: Generate content → Review → Refine → Re-review.`
          },
          {
            title: "Prompt 1 - Self-Correcting Research Summary",
            content: `Summarize this medical research paper.

<paper>
{{RESEARCH_PAPER}}
</paper>

Focus on methodology, findings, and clinical implications.`
          },

          {
            title: "Prompt 2 - Self-Correcting Research Summary",
            content: `Your task is to provide feedback on a research paper summary. Here is a summary of a medical research paper:

<summary>
{{SUMMARY}}
</summary>

Here is the research paper:
<paper>
{{RESEARCH_PAPER}}
</paper>

Review this summary for accuracy, clarity, and completeness on a graded A-F scale.`
          },

          {
            title: "Prompt 3 - Self-Correcting Research Summary",
            content: `Your task is to improve a paper summary given feedback. Here is the first draft of a medical research paper:

<summary>
{{SUMMARY}}
</summary>

Here is the research paper:
<paper>
{{RESEARCH_PAPER}}
</paper>

Here is the feedback:
<feedback>
{{FEEDBACK}}
</feedback>

Update the summary based on the feedback.`
          },

          {
            title: "Prompt 1 - Analyzing a Legal Contract",
            content: `You’re our Chief Legal Officer. Review this SaaS contract for risks, focusing on data privacy, SLAs, and liability caps.

<contract>
{{CONTRACT}}
</contract>

Output your findings in <risks> tags.`
          },

          {
            title: "Prompt 2 - Analyzing a Legal Contract",
            content: `Draft an email to a SaaS product vendor outlining the following concerns and proposing changes. Here are the concerns:

<concerns>
{{CONCERNS}}
</concerns>`
          },

          {
            title: "Prompt 3 - Analyzing a Legal Contract",
            content: `Your task is to review an email and provide feedback. Here is the email:

<email>
{{EMAIL}}
</email>

Give feedback on tone, clarity, and professionalism.`
          },

          {
            title: "Prompt 1 - Multitenancy Strategy Review",
            content: `As a senior solutions architect, review and analyze this multitenancy strategy for our new enterprise SaaS product.

<strategy>
{{STRATEGY}}
</strategy>

Focus on scalability, security, and cost-effectiveness.`
          },

          {
            title: "Prompt 2 - Multitenancy Strategy Review",
            content: `Draft a strategy review document for engineering leadership based on this analysis of a multitenancy strategy.

<strategy>
{{STRATEGY}}
</strategy>

<analysis>
{{ANALYSIS}}
</analysis>

Include an executive summary, detailed analysis, and recommendations.`
          },

          {
            title: "Prompt 3 - Multitenancy Strategy Review",
            content: `Grade this strategy review document for clarity, actionability, and alignment with enterprise priorities.

<priorities>
{{PRIORITIES}}
</priorities>

<strategy_doc>
{{STRATEGY_DOC}}
</strategy_doc>`
          },
        ]
    },
    {
        title: "Long Context Prompting Tips",
        isCategory: true,
        subtips: [
          {
            title: "Put Longform Data at the Top (Unless it's a long context, then add it at the end instead)",
            content: `Place your long documents and inputs (~20K+ tokens) near the top of your prompt, above your query, instructions, and examples. This can significantly improve Claude’s performance across all models.

(!) Queries at the end can improve response quality by up to 30% in tests, especially with complex, multi-document inputs.`
          },

          {
            title: "Structured Document Content with Metadata with XML Tags",
            content: `When using multiple documents, wrap each document in <document> tags with <document_content> and <source> (and other metadata) subtags for clarity.
            
<documents>

<document index="1">
<source>annual_report_2023.pdf</source>
<document_content>
{{ANNUAL_REPORT}}
</document_content>
</document>
  
<document index="2">
<source>competitor_analysis_q2.xlsx</source>
<document_content>
{{COMPETITOR_ANALYSIS}}
</document_content>
</document>

</documents>

Analyze the annual report and competitor analysis. Identify strategic advantages and recommend Q3 focus areas.`
          },

          {
            title: "Groud Responses in Quotes",
            content: `For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude cut through the “noise” of the rest of the document’s contents.
            
You are an AI physician's assistant. Your task is to help doctors diagnose possible patient illnesses.

<documents>

<document index="1">
<source>patient_symptoms.txt</source>
<document_content>
{{PATIENT_SYMPTOMS}}
</document_content>
</document>

<document index="2">
<source>patient_records.txt</source>
<document_content>
{{PATIENT_RECORDS}}
</document_content>
</document>

<document index="3">
<source>patient01_appt_history.txt</source>
<document_content>
{{PATIENT01_APPOINTMENT_HISTORY}}
</document_content>
</document>

</documents>

Find quotes from the patient records and appointment history that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.`
          }
        ]
    },
  ];
  /**
     * Initializes the side panel UI
     * Creates category containers, buttons, and content areas
     * Sets up event listeners for user interactions
     */
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
  /**
   * Utility functions for text processing
   * Handles HTML entity decoding and content sanitization
   */
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