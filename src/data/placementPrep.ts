import { PlacementPrepSection, CompanyQuestion } from '../types';

export const placementPrepSections: PlacementPrepSection[] = [
  {
    id: 'resume-checker', title: 'Resume / ATS Checker', icon: '📄',
    description: 'Paste your resume text and get AI feedback on ATS optimization, keywords, and impact.',
    type: 'ai-review',
    content: 'Paste your resume bullet points or summary below. The AI will evaluate ATS-friendliness, keyword coverage, quantification, and formatting.',
    rubric: 'Evaluate this resume for a Data Analyst role in the Indian job market. Check for: ATS keyword coverage (SQL, Excel, Python, Tableau, Power BI, pandas, dashboards), quantified achievements, action verbs, clarity, and formatting issues. Score out of 10 and list missing keywords.',
  },
  {
    id: 'mock-interview', title: 'Mock Interview Simulator', icon: '🎤',
    description: 'Have a live mock interview conversation with the AI mentor. It will ask questions and evaluate your answers.',
    type: 'ai-chat',
    content: 'The AI will conduct a mock data analyst interview. It will ask behavioral and technical questions one at a time, evaluate your answers using STAR, and provide feedback. Start by saying "Begin the interview."',
  },
  {
    id: 'star-practice', title: 'HR / Behavioral STAR Practice', icon: '🎭',
    description: 'Write your STAR answers to common behavioral questions and get instant AI feedback.',
    type: 'ai-review',
    content: 'Write your STAR answer below. Include Situation, Task, Action, and Result clearly. The AI will evaluate structure, specificity, quantification, and relevance to data analyst roles.',
    rubric: 'Evaluate this STAR answer for a data analyst behavioral interview. Check for: clear Situation-Task-Action-Result structure, specific details (not generic), quantified results, use of "I" not "we", conciseness (2-3 min spoken), and relevance to data analytics. Score out of 10.',
  },
  {
    id: 'company-bank', title: 'Company-wise Question Bank', icon: '🏢',
    description: 'Browse real interview questions asked at top Indian and global companies for analyst roles.',
    type: 'static',
    content: '',
  },
  {
    id: 'ctc-primer', title: 'CTC & Offer Negotiation Primer', icon: '💰',
    description: 'Understand Indian CTC structures and learn negotiation strategies.',
    type: 'static',
    content: `## Understanding CTC in India\n\nCTC (Cost to Company) is NOT your in-hand salary. It includes:\n\n### CTC Components\n- **Basic Salary**: 40-50% of CTC (taxable)\n- **HRA**: 40-50% of Basic (partly tax-exempt)\n- **Special Allowance**: Balance amount (fully taxable)\n- **PF**: 12% of Basic (employer contribution, from CTC)\n- **Variable Pay / Performance Bonus**: 10-30% of CTC\n- **LTA**: Leave Travel Allowance (tax-exempt with conditions)\n- **Gratuity**: 4.81% of Basic (vesting after 5 years)\n- **ESOPs / Stock Options**: In startups and some tech companies\n\n### In-Hand Salary Calculation\n\n\`\`\`\nIn-hand = CTC - PF (employee) - PF (employer) - Tax - Variable (if not paid monthly)\n\`\`\`\n\nRule of thumb: In-hand ≈ 70-80% of CTC\n\n### Negotiation Tips\n\n1. **Research**: Check Glassdoor, AmbitionBox for salary ranges\n2. **Total CTC**: Negotiate on total CTC, not just basic\n3. **Variable Pay**: Clarify payout history — some companies rarely pay full variable\n4. **ESOPs**: In startups, evaluate vesting schedule and strike price\n5. **Notice Period**: Use it as leverage — companies pay more for shorter notice\n6. **Counter Offers**: Get everything in writing before countering\n7. **Benefits**: Negotiate joining bonus, relocation, equipment allowance\n\n### Fresher Salary Ranges (Indian Market, 2024)\n\n- **Data Analyst (Service companies)**: ₹4-8 LPA\n- **Data Analyst (Product companies)**: ₹8-15 LPA\n- **Business Analyst (Consulting)**: ₹6-12 LPA\n- **BI Analyst (MNCs)**: ₹6-14 LPA\n- **Decision Scientist (Mu Sigma et al.)**: ₹6-11 LPA\n\n### Common Mistakes\n\n- Accepting the first offer without negotiation\n- Not clarifying variable pay terms\n- Ignoring ESOP vesting cliff\n- Not getting the offer letter before resigning\n- Comparing CTC without considering in-hand and benefits`,
  },
];

export const companyQuestions: CompanyQuestion[] = [
  {
    company: 'ZS Associates', role: 'Decision Analyst',
    questions: [
      'Walk me through your resume and why analytics.',
      'A pharma client wants to optimize sales force allocation. How would you approach this?',
      'Write SQL to find the top 5 products by revenue in each region.',
      'Explain a time you used data to influence a business decision.',
      'What metrics would you track for a new drug launch?',
    ],
  },
  {
    company: 'Mu Sigma', role: 'Decision Scientist',
    questions: [
      'Explain the difference between correlation and causation with an example.',
      'A retail client sees a 20% drop in footfall. What analysis would you do?',
      'Write a Python function to calculate moving average of sales.',
      'How would you segment customers for a credit card company?',
      'Explain A/B testing and when it might give wrong results.',
    ],
  },
  {
    company: 'Flipkart', role: 'Business Analyst',
    questions: [
      'How would you measure the success of a new feature on the app?',
      'Write SQL to find users who placed orders in 3 consecutive months.',
      'A/B test shows 2% lift but p-value is 0.08. What do you do?',
      'How would you forecast demand for a product category?',
      'Explain how you would detect fraudulent sellers.',
    ],
  },
  {
    company: 'Amazon', role: 'Business Analyst',
    questions: [
      'Tell me about a time you used data to solve a complex problem (STAR).',
      'How would you measure customer satisfaction for a new product?',
      'Write SQL to find the second highest order value per customer.',
      'Explain cohort analysis and its business application.',
      'A metric drops 10% overnight. Walk me through your investigation.',
    ],
  },
  {
    company: 'TCS / Infosys', role: 'Data Analyst',
    questions: [
      'Explain the difference between WHERE and HAVING in SQL.',
      'What is normalization? Explain 1NF, 2NF, 3NF.',
      'How do you handle missing values in a dataset?',
      'Explain different types of joins with examples.',
      'What is the use of pivot tables? When would you use one?',
    ],
  },
];
