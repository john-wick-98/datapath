import { PracticeProject } from '../types';

const ECOM = `order_id,customer_id,product,category,quantity,unit_price,total,status,order_date
1,101,Laptop Backpack,Accessories,2,1500,3000,shipped,2024-01-15
2,102,Wireless Mouse,Accessories,1,800,800,pending,2024-01-16
3,103,Mechanical Keyboard,Accessories,1,2500,2500,shipped,2024-01-17
4,101,USB-C Hub,Accessories,3,1200,3600,shipped,2024-01-18
5,104,Laptop Stand,Furniture,1,1800,1800,delivered,2024-01-19
6,105,Monitor 27inch,Electronics,1,15000,15000,pending,2024-01-20
7,102,Webcam,Electronics,2,2200,4400,shipped,2024-01-21
8,106,Desk Lamp,Furniture,2,900,1800,delivered,2024-01-22
9,103,Headphones,Electronics,1,3500,3500,shipped,2024-01-23
10,107,Mouse Pad,Accessories,5,300,1500,delivered,2024-01-24
11,104,Laptop Sleeve,Accessories,2,700,1400,pending,2024-01-25
12,108,External SSD 1TB,Electronics,1,6500,6500,shipped,2024-01-26`;

const EMP = `emp_id,name,department,salary,join_date,city,performance_rating
1,Aarav Sharma,Engineering,85000,2022-03-01,Mumbai,4.5
2,Priya Patel,Sales,65000,2021-07-15,Delhi,4.2
3,Rohan Verma,Engineering,92000,2020-01-10,Bangalore,4.8
4,Ananya Singh,Marketing,58000,2023-02-20,Mumbai,3.9
5,Vikram Reddy,Engineering,78000,2022-11-05,Hyderabad,4.1
6,Kavya Nair,Sales,62000,2021-09-12,Delhi,4.5
7,Arjun Gupta,Marketing,60000,2023-05-18,Bangalore,3.7
8,Diya Mehta,HR,55000,2020-08-22,Mumbai,4.3
9,Karan Joshi,Engineering,88000,2019-04-01,Hyderabad,4.6
10,Sneha Rao,Sales,70000,2022-06-30,Bangalore,4.4`;

const EMP_DIRTY = `emp_id,name,department,salary,join_date,city
1,Aarav Sharma,Engineering,85000,2022-03-01,Mumbai
2,Priya Patel,Sales,,2021-07-15,Delhi
3,Rohan Verma,Engineering,92000,2020-01-10,Bangalore
4,Ananya Singh,Marketing,58000,2023-02-20,
5,Vikram Reddy,Engineering,78000,2022-11-05,Hyderabad`;

const MKT = `campaign_id,channel,budget,impressions,clicks,conversions,revenue
1,Google Ads,50000,1200000,15000,450,180000
2,Facebook,30000,800000,8000,200,85000
3,Instagram,25000,600000,6000,180,72000
4,Email,5000,50000,3000,150,45000
5,Google Ads,40000,900000,12000,380,152000
6,LinkedIn,20000,300000,2500,90,36000
7,Facebook,35000,750000,7500,210,90000
8,Instagram,30000,700000,7000,220,88000`;

const JOIN_DS = JSON.stringify({
  orders: 'order_id,customer_id,total\n1,101,500\n2,102,300\n3,101,700\n4,103,200\n5,102,400',
  customers: 'customer_id,name,city\n101,Aarav,Mumbai\n102,Priya,Delhi\n103,Rohan,Bangalore',
});

const AI_CTX = `Context,Details\nRole,Data Analyst\nMarket,Indian Job Market\nExperience,0-2 years`;

export const projects: Record<string, PracticeProject> = {
  'proj-sql-1': {
    id: 'proj-sql-1', title: 'Filtering E-commerce Orders',
    scenario: 'You are an analyst at an e-commerce company. The operations team needs specific order lists for a monthly review. Write SQL queries to extract the required data.',
    dataset: { name: 'orders', type: 'csv', content: ECOM },
    checkerType: 'sql',
    checkpoints: [
      { id: 'cp1', prompt: "Select product names where status = 'pending'", hint: 'Use WHERE clause', expected: { columns: ['product'], values: [['Wireless Mouse'], ['Monitor 27inch'], ['Laptop Sleeve']] } },
      { id: 'cp2', prompt: 'Select product and total where total > 2000', hint: 'Combine WHERE with column selection', expected: { columns: ['product', 'total'], values: [['Laptop Backpack', '3000'], ['Mechanical Keyboard', '2500'], ['USB-C Hub', '3600'], ['Monitor 27inch', '15000'], ['Webcam', '4400'], ['Headphones', '3500'], ['External SSD 1TB', '6500']] } },
      { id: 'cp3', prompt: 'Select distinct categories from the orders table', hint: 'Use DISTINCT keyword', expected: { columns: ['category'], values: [['Accessories'], ['Electronics'], ['Furniture']] } },
    ],
  },
  'proj-sql-2': {
    id: 'proj-sql-2', title: 'Revenue Aggregation Report',
    scenario: 'The finance team needs a revenue summary. Use aggregations and GROUP BY to generate the required metrics from the orders dataset.',
    dataset: { name: 'orders', type: 'csv', content: ECOM },
    checkerType: 'sql',
    checkpoints: [
      { id: 'cp1', prompt: 'Count the total number of orders', hint: 'Use COUNT(*)', expected: { columns: ['count'], values: [['12']] } },
      { id: 'cp2', prompt: 'Sum total revenue by category', hint: 'Use GROUP BY with SUM', expected: { columns: ['category', 'total'], values: [['Accessories', '12800'], ['Electronics', '29400'], ['Furniture', '3600']] } },
      { id: 'cp3', prompt: 'Find the maximum order total', hint: 'Use MAX()', expected: { columns: ['max'], values: [['15000']] } },
    ],
  },
  'proj-sql-3': {
    id: 'proj-sql-3', title: 'Customer Order Analysis with JOINs',
    scenario: 'You have two tables: orders and customers. The sales team wants to see customer names alongside their order totals. Use JOINs to combine the data.',
    dataset: { name: 'orders + customers', type: 'json', content: JOIN_DS },
    checkerType: 'sql',
    checkpoints: [
      { id: 'cp1', prompt: 'Join orders and customers to get customer names with their order totals', hint: 'Use INNER JOIN ON customer_id', expected: { columns: ['name', 'total'], values: [['Aarav', '500'], ['Priya', '300'], ['Aarav', '700'], ['Rohan', '200'], ['Priya', '400']] } },
      { id: 'cp2', prompt: 'Find total spend per customer (return name and total spend)', hint: 'GROUP BY name with SUM', expected: { columns: ['name', 'spend'], values: [['Aarav', '1200'], ['Priya', '700'], ['Rohan', '200']] } },
      { id: 'cp3', prompt: 'Find customers who spent more than 500 total', hint: 'Use HAVING clause', expected: { columns: ['name', 'spend'], values: [['Aarav', '1200'], ['Priya', '700']] } },
    ],
  },
  'proj-excel-1': {
    id: 'proj-excel-1', title: 'Sales Formula Practice',
    scenario: 'You have a product sales spreadsheet. Use Excel formulas to calculate the required metrics. Enter formulas like =SUM(B2:B5).',
    dataset: { name: 'products', type: 'csv', content: `Product,Qty,Price,Total\nWidget,10,5,50\nGadget,20,3,60\nGizmo,15,8,120\nDoohickey,5,12,60` },
    checkerType: 'formula',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate the sum of all quantities using SUM(B2:B5)', hint: 'Formula starts with =SUM', expected: 50 },
      { id: 'cp2', prompt: 'Calculate the average price using AVERAGE(C2:C5)', hint: 'Formula starts with =AVERAGE', expected: 7 },
      { id: 'cp3', prompt: 'Find the maximum total using MAX(D2:D5)', hint: 'Formula starts with =MAX', expected: 120 },
    ],
  },
  'proj-excel-2': {
    id: 'proj-excel-2', title: 'Regional Sales with SUMIF',
    scenario: 'You have regional sales data. Use conditional formulas (SUMIF, COUNTIF) to analyze sales by region.',
    dataset: { name: 'regional_sales', type: 'csv', content: `Region,Sales,Cost\nNorth,500,300\nSouth,700,400\nNorth,600,350\nEast,400,200\nSouth,800,500` },
    checkerType: 'formula',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate total sales for North region: SUMIF(A2:A6,"North",B2:B6)', hint: 'SUMIF(range, criteria, sum_range)', expected: 1100 },
      { id: 'cp2', prompt: 'Calculate total profit: SUM(B2:B6)-SUM(C2:C6)', hint: 'Revenue minus cost', expected: 1250 },
      { id: 'cp3', prompt: 'Count regions with sales > 500: COUNTIF(B2:B6,">500")', hint: 'COUNTIF with > operator', expected: 3 },
    ],
  },
  'proj-excel-3': {
    id: 'proj-excel-3', title: 'Revenue Dashboard Calculations',
    scenario: 'You have monthly revenue data with targets. Calculate key dashboard metrics using Excel formulas.',
    dataset: { name: 'monthly_revenue', type: 'csv', content: `Month,Revenue,Target\nJan,45000,50000\nFeb,52000,50000\nMar,48000,50000\nApr,55000,50000\nMay,60000,50000` },
    checkerType: 'formula',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate total revenue: SUM(B2:B6)', hint: 'Sum the Revenue column', expected: 260000 },
      { id: 'cp2', prompt: 'Calculate average revenue: AVERAGE(B2:B6)', hint: 'Average of Revenue column', expected: 52000 },
      { id: 'cp3', prompt: 'Count months exceeding target: COUNTIF(B2:B6,">50000")', hint: 'Count where Revenue > Target', expected: 3 },
    ],
  },
  'proj-powerbi-1': {
    id: 'proj-powerbi-1', title: 'Power BI Data Modeling Plan',
    scenario: 'You are tasked with building a Power BI report for a retail company with orders, products, and customers data. Describe your approach.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate understanding of Power BI data import, star schema modeling, and relationship creation. Check for: correct import steps, fact vs dimension tables, relationship cardinality, and star schema benefits.',
    checkpoints: [
      { id: 'cp1', prompt: 'Describe how you would import and model a retail dataset (orders, products, customers) in Power BI. Explain your star schema design.' },
      { id: 'cp2', prompt: 'Explain what a star schema is and why it is preferred over a flat table in Power BI.' },
      { id: 'cp3', prompt: 'List the relationships you would create between the three tables and their cardinality types.' },
    ],
  },
  'proj-powerbi-2': {
    id: 'proj-powerbi-2', title: 'DAX Measure Design',
    scenario: 'You need to create DAX measures for a sales analytics report. Write the DAX formulas and explain your approach.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate DAX knowledge. Check for: correct distinction between measures and calculated columns, proper use of CALCULATE and time intelligence, and understanding of filter context.',
    checkpoints: [
      { id: 'cp1', prompt: 'Write a DAX measure to calculate year-over-year revenue growth percentage.' },
      { id: 'cp2', prompt: 'Explain the difference between a calculated column and a measure in DAX. When would you use each?' },
      { id: 'cp3', prompt: 'Write a DAX formula for a rolling 3-month average of sales.' },
    ],
  },
  'proj-powerbi-3': {
    id: 'proj-powerbi-3', title: 'Dashboard Design Plan',
    scenario: 'Design a sales analytics dashboard for executives. Describe your visual choices, layout, and interactivity features.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate dashboard design knowledge. Check for: appropriate visual selection, understanding of interactivity (slicers, drill-through), RLS knowledge, and design best practices.',
    checkpoints: [
      { id: 'cp1', prompt: 'Design a dashboard layout for a sales analytics report. List the visuals you would use and why.' },
      { id: 'cp2', prompt: 'Explain when to use a bar chart vs a line chart vs a scatter plot with examples.' },
      { id: 'cp3', prompt: 'Describe how you would implement row-level security (RLS) for regional managers in a Power BI report.' },
    ],
  },
  'proj-python-1': {
    id: 'proj-python-1', title: 'Employee Data Exploration',
    scenario: 'You have an employee dataset loaded as a pandas DataFrame called df. Write pandas expressions to answer the following questions.',
    dataset: { name: 'employees', type: 'csv', content: EMP },
    checkerType: 'python',
    checkpoints: [
      { id: 'cp1', prompt: 'Return the name of the employee with the highest salary', hint: 'Use idxmax() and loc', expected: 'Rohan Verma' },
      { id: 'cp2', prompt: 'Return the salary of the first employee (index 0)', hint: 'Use iloc or loc', expected: 85000 },
      { id: 'cp3', prompt: 'Return the number of employees in the Engineering department', hint: 'Use boolean filtering with len()', expected: 4 },
    ],
  },
  'proj-python-2': {
    id: 'proj-python-2', title: 'Cleaning Dirty Employee Data',
    scenario: 'The employee dataset has missing values. Write pandas expressions to identify and handle the data quality issues.',
    dataset: { name: 'employees_dirty', type: 'csv', content: EMP_DIRTY },
    checkerType: 'python',
    checkpoints: [
      { id: 'cp1', prompt: 'Return the number of missing values in the salary column', hint: 'Use isnull().sum()', expected: 1 },
      { id: 'cp2', prompt: 'Return the name of the employee with a missing city value', hint: 'Filter where city is null, get name', expected: 'Ananya Singh' },
      { id: 'cp3', prompt: 'Fill missing salary with 0 and return the salary value for the second employee (index 1)', hint: 'Use fillna(0) then iloc[1]', expected: 0 },
    ],
  },
  'proj-python-3': {
    id: 'proj-python-3', title: 'Employee Aggregation Analysis',
    scenario: 'Analyze the employee dataset using pandas groupby and aggregation. Write expressions to calculate the required metrics.',
    dataset: { name: 'employees', type: 'csv', content: EMP },
    checkerType: 'python',
    checkpoints: [
      { id: 'cp1', prompt: 'Return the total salary sum across all employees', hint: 'Use sum()', expected: 713000 },
      { id: 'cp2', prompt: 'Return the name of the highest-paid employee', hint: 'Use idxmax() with loc', expected: 'Rohan Verma' },
      { id: 'cp3', prompt: 'Return the number of employees who joined before 2022 (join_date < 2022-01-01)', hint: 'Convert to datetime and filter', expected: 5 },
    ],
  },
  'proj-stats-1': {
    id: 'proj-stats-1', title: 'Campaign Budget Statistics',
    scenario: 'You have marketing campaign data. Calculate descriptive statistics by hand (or with a calculator) and enter the numeric answers.',
    dataset: { name: 'campaigns', type: 'csv', content: MKT },
    checkerType: 'numeric',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate the mean budget across all campaigns', hint: 'Sum all budgets and divide by count', expected: 29375, tolerance: 1 },
      { id: 'cp2', prompt: 'Calculate the median budget', hint: 'Sort budgets and find the middle value', expected: 30000, tolerance: 1 },
      { id: 'cp3', prompt: 'Calculate the range of revenue (max revenue - min revenue)', hint: 'Find highest and lowest revenue values', expected: 144000, tolerance: 1 },
    ],
  },
  'proj-stats-2': {
    id: 'proj-stats-2', title: 'Campaign Performance Metrics',
    scenario: 'Calculate key performance metrics for campaign 1 from the marketing dataset. Show your work and enter the final numeric answers.',
    dataset: { name: 'campaigns', type: 'csv', content: MKT },
    checkerType: 'numeric',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate the CTR for campaign 1 (clicks/impressions * 100)', hint: '15000/1200000*100', expected: 1.25, tolerance: 0.01 },
      { id: 'cp2', prompt: 'Calculate the conversion rate for campaign 1 (conversions/clicks * 100)', hint: '450/15000*100', expected: 3.0, tolerance: 0.01 },
      { id: 'cp3', prompt: 'Calculate the ROI for campaign 1 ((revenue-budget)/budget * 100)', hint: '(180000-50000)/50000*100', expected: 260, tolerance: 1 },
    ],
  },
  'proj-stats-3': {
    id: 'proj-stats-3', title: 'A/B Test Analysis',
    scenario: 'An A/B test was run with two variants. Calculate the key metrics to determine if variant B performed better than variant A.',
    dataset: { name: 'ab_test', type: 'csv', content: `variant,visitors,conversions\nA,1000,120\nB,1000,150` },
    checkerType: 'numeric',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate conversion rate for variant A (conversions/visitors * 100)', hint: '120/1000*100', expected: 12.0, tolerance: 0.01 },
      { id: 'cp2', prompt: 'Calculate the absolute lift (variant B rate - variant A rate)', hint: '(150/1000*100) - (120/1000*100)', expected: 3.0, tolerance: 0.01 },
      { id: 'cp3', prompt: 'Calculate the relative lift ((B_rate - A_rate) / A_rate * 100)', hint: '(15-12)/12*100', expected: 25.0, tolerance: 0.1 },
    ],
  },
  'proj-case-1': {
    id: 'proj-case-1', title: 'Revenue Decline Investigation',
    scenario: 'An e-commerce company revenue dropped 15% in Q3. You are the analyst tasked with investigating. Write your analysis approach.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate revenue analysis thinking. Check for: structured approach, multiple hypotheses, data-driven testing plan, clear communication, and actionable recommendations.',
    checkpoints: [
      { id: 'cp1', prompt: 'List 3 hypotheses for why revenue dropped 15% in Q3 and how you would test each with data.' },
      { id: 'cp2', prompt: 'Design a cohort analysis framework for this e-commerce business. What cohorts and metrics would you track?' },
      { id: 'cp3', prompt: 'The CEO asks for a one-page summary of your findings. Write the key sections and what each would contain.' },
    ],
  },
  'proj-case-2': {
    id: 'proj-case-2', title: 'Customer Segmentation Strategy',
    scenario: 'You need to design a customer segmentation model for an e-commerce company. Describe your approach and segment definitions.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate customer segmentation knowledge. Check for: understanding of RFM or other methods, practical segment definitions, actionable recommendations per segment, and implementation approach.',
    checkpoints: [
      { id: 'cp1', prompt: 'Design an RFM segmentation model for an e-commerce business. Define each segment and its characteristics.' },
      { id: 'cp2', prompt: 'How would you identify at-risk customers? What data would you need and what actions would you recommend?' },
      { id: 'cp3', prompt: 'Propose a customer lifetime value (CLV) calculation approach for a subscription business.' },
    ],
  },
  'proj-case-3': {
    id: 'proj-case-3', title: 'Growth Funnel Optimization',
    scenario: 'An e-commerce site has: 100K visitors, 5K signups, 500 purchases per month. Analyze the funnel and propose growth strategies.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate growth metrics understanding. Check for: correct metric definitions (CAC, LTV, retention), funnel analysis, experiment design thinking, and prioritization framework.',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate and interpret the conversion funnel. Where is the biggest drop-off and what would you optimize first?' },
      { id: 'cp2', prompt: 'Define CAC, LTV, and payback period. How would you optimize the LTV:CAC ratio for this business?' },
      { id: 'cp3', prompt: 'Design an experiment to test whether a new checkout flow improves purchase conversion rate.' },
    ],
  },
  'proj-resume-1': {
    id: 'proj-resume-1', title: 'Resume Bullet Point Workshop',
    scenario: 'Practice writing impactful resume bullet points for a data analyst role. Use the quantification formula: Action + What + Tool + Result.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate resume writing skills. Check for: quantified results, action verbs, specificity, relevance to data analyst roles, and ATS-friendly language.',
    checkpoints: [
      { id: 'cp1', prompt: 'Write a professional summary (2-3 lines) for a data analyst with 2 years of experience transitioning from a non-tech background.' },
      { id: 'cp2', prompt: 'Rewrite this weak bullet point with quantification: "Worked on Excel reports for the sales team"' },
      { id: 'cp3', prompt: 'Write 3 bullet points for a SQL data analysis project you completed (invent realistic details and metrics).' },
    ],
  },
  'proj-resume-2': {
    id: 'proj-resume-2', title: 'ATS Optimization Exercise',
    scenario: 'Practice optimizing resume content for ATS systems. Identify keywords and rewrite content to be ATS-friendly.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate ATS optimization knowledge. Check for: correct keyword identification, formatting best practices, understanding of ATS parsing, and natural keyword integration.',
    checkpoints: [
      { id: 'cp1', prompt: 'List 10 ATS keywords for a Data Analyst role in the Indian job market based on typical job descriptions.' },
      { id: 'cp2', prompt: 'Rewrite this experience bullet to be ATS-friendly: "Did data analysis and made dashboards"' },
      { id: 'cp3', prompt: 'List 3 common ATS formatting mistakes that can get a resume rejected, and how to avoid each.' },
    ],
  },
  'proj-resume-3': {
    id: 'proj-resume-3', title: 'Portfolio Project Design',
    scenario: 'Design your data analyst portfolio. Choose projects, write documentation, and plan your presentation strategy.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate portfolio building knowledge. Check for: relevant project selection, clear documentation, presentation strategy, and understanding of what employers look for.',
    checkpoints: [
      { id: 'cp1', prompt: 'Describe 3 projects you would include in a data analyst portfolio and what skills each demonstrates.' },
      { id: 'cp2', prompt: 'Write a GitHub README structure for a SQL data analysis project that showcases your skills.' },
      { id: 'cp3', prompt: 'How would you present a Power BI dashboard project in your portfolio for maximum impact?' },
    ],
  },
  'proj-hr-1': {
    id: 'proj-hr-1', title: 'STAR Method Practice',
    scenario: 'Practice answering behavioral interview questions using the STAR method. Write complete answers with Situation, Task, Action, and Result.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate STAR method usage. Check for: clear Situation-Task-Action-Result structure, quantified results, personal contribution (I not we), and conciseness (2-3 min when spoken).',
    checkpoints: [
      { id: 'cp1', prompt: 'Using STAR, answer: "Tell me about a time you solved a complex problem with data."' },
      { id: 'cp2', prompt: 'Explain each component of STAR with an example relevant to a data analyst role.' },
      { id: 'cp3', prompt: 'Rewrite this weak answer using STAR: "I am good at SQL and use it every day."' },
    ],
  },
  'proj-hr-2': {
    id: 'proj-hr-2', title: 'Behavioral Interview Scenarios',
    scenario: 'Practice answering common behavioral interview questions for data analyst roles in the Indian market using STAR.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate behavioral interview answers. Check for: STAR structure, specific examples (not hypothetical), learning/growth shown, relevance to data analyst role, and Indian market context.',
    checkpoints: [
      { id: 'cp1', prompt: 'Answer using STAR: "Describe a time you disagreed with a stakeholder\'s data interpretation. How did you handle it?"' },
      { id: 'cp2', prompt: 'Answer using STAR: "Tell me about a time you failed to meet a deadline. What did you learn?"' },
      { id: 'cp3', prompt: 'Answer using STAR: "Describe a situation where you explained technical findings to a non-technical audience."' },
    ],
  },
  'proj-hr-3': {
    id: 'proj-hr-3', title: 'Tough Questions & Negotiation',
    scenario: 'Practice handling tough interview questions and salary negotiation specific to the Indian job market.',
    dataset: { name: 'context', type: 'csv', content: AI_CTX },
    checkerType: 'ai-review',
    aiRubric: 'Evaluate handling of tough questions. Check for: honest but strategic answers, Indian market awareness (CTC norms), professional tone, and alignment with the role.',
    checkpoints: [
      { id: 'cp1', prompt: 'How would you answer "Why should we hire you for a data analyst role?" Be specific to the Indian job market.' },
      { id: 'cp2', prompt: 'How would you answer "What is your biggest weakness?" in a way that is honest but does not disqualify you?' },
      { id: 'cp3', prompt: 'Outline your salary negotiation approach for an Indian context (CTC structure, in-hand expectations, negotiation tactics).' },
    ],
  },
  'proj-mock-1': {
    id: 'proj-mock-1', title: 'SQL Interview Simulation',
    scenario: 'Practice real SQL interview questions. These are the types of questions asked in data analyst interviews at companies like Flipkart, Amazon, and ZS Associates.',
    dataset: { name: 'orders', type: 'csv', content: ECOM },
    checkerType: 'sql',
    checkpoints: [
      { id: 'cp1', prompt: 'Find the customer_id with the highest total spend (return customer_id and total spend)', hint: 'GROUP BY customer_id, SUM(total), ORDER BY DESC, LIMIT 1', expected: { columns: ['customer_id', 'spend'], values: [['105', '15000']] } },
      { id: 'cp2', prompt: "Find all products with status = 'pending'", hint: 'Simple WHERE filter', expected: { columns: ['product'], values: [['Wireless Mouse'], ['Monitor 27inch'], ['Laptop Sleeve']] } },
      { id: 'cp3', prompt: "Find the total revenue from shipped orders", hint: 'WHERE status = shipped, SUM(total)', expected: { columns: ['total'], values: [['23500']] } },
    ],
  },
  'proj-mock-2': {
    id: 'proj-mock-2', title: 'Python Interview Simulation',
    scenario: 'Practice pandas interview questions commonly asked in data analyst technical rounds.',
    dataset: { name: 'employees', type: 'csv', content: EMP },
    checkerType: 'python',
    checkpoints: [
      { id: 'cp1', prompt: 'Return the name of the highest-paid employee', hint: 'idxmax() with loc', expected: 'Rohan Verma' },
      { id: 'cp2', prompt: 'Return the total salary sum across all employees', hint: 'sum() on salary column', expected: 713000 },
      { id: 'cp3', prompt: 'Return the number of employees who joined before 2022', hint: 'Convert join_date to datetime, filter < 2022-01-01', expected: 5 },
    ],
  },
  'proj-mock-3': {
    id: 'proj-mock-3', title: 'Live Data Analysis Scenario',
    scenario: 'You are given marketing campaign data in an interview. Calculate the required metrics and enter numeric answers.',
    dataset: { name: 'campaigns', type: 'csv', content: MKT },
    checkerType: 'numeric',
    checkpoints: [
      { id: 'cp1', prompt: 'Calculate the total budget across all campaigns', hint: 'Sum the budget column', expected: 235000, tolerance: 1 },
      { id: 'cp2', prompt: 'Calculate the total number of clicks across all campaigns', hint: 'Sum the clicks column', expected: 58000, tolerance: 0 },
      { id: 'cp3', prompt: 'Calculate the total conversions across all campaigns', hint: 'Sum the conversions column', expected: 1880, tolerance: 0 },
    ],
  },
};
