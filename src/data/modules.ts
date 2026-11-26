import { Module } from '../types';

export const modules: Module[] = [
  {
    id: 1, title: 'SQL for Analysts', icon: '🔍',
    description: 'Master the querying skills every data analyst needs',
    topics: [
      {
        id: 'sql-1', moduleId: 1, title: 'SELECT, WHERE & ORDER BY',
        explanation: `## SELECT Basics\n\nThe \`SELECT\` statement retrieves rows from a table. Specify columns or use \`*\` for all.\n\n\`\`\`sql\nSELECT product, total FROM orders;\nSELECT * FROM orders;\n\`\`\`\n\n## Filtering with WHERE\n\nUse \`WHERE\` to filter rows based on conditions:\n\n\`\`\`sql\nSELECT * FROM orders WHERE total > 500;\nSELECT * FROM orders WHERE status = 'shipped' AND total > 1000;\n\`\`\`\n\n## Sorting & Limiting\n\n\`ORDER BY\` sorts results ascending (\`ASC\`) or descending (\`DESC\`). \`LIMIT\` restricts row count.\n\n\`\`\`sql\nSELECT * FROM orders ORDER BY total DESC LIMIT 10;\n\`\`\``,
        examples: [{ title: 'Top 5 orders by value', content: 'SELECT product, total FROM orders ORDER BY total DESC LIMIT 5;' }],
        externalResource: { label: 'Mode SQL Tutorial', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'sql-1-q1', question: 'Which clause filters rows in SQL?', options: ['FILTER', 'WHERE', 'SELECT', 'SORT'], correctIndex: 1, explanation: 'WHERE filters rows based on conditions.' },
          { id: 'sql-1-q2', question: 'What does ORDER BY total DESC do?', options: ['Ascending sort', 'Descending sort', 'Remove duplicates', 'Limit rows'], correctIndex: 1, explanation: 'DESC sorts from highest to lowest.' },
          { id: 'sql-1-q3', question: 'How do you select all columns?', options: ['SELECT ALL', 'SELECT EVERY', 'SELECT *', 'SELECT COLUMNS'], correctIndex: 2, explanation: 'Asterisk (*) selects all columns.' },
        ],
        projectId: 'proj-sql-1',
      },
      {
        id: 'sql-2', moduleId: 1, title: 'Aggregations & GROUP BY',
        explanation: `## Aggregate Functions\n\nSQL provides functions to summarize data: \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MIN()\`, \`MAX()\`.\n\n\`\`\`sql\nSELECT COUNT(*) FROM orders;\nSELECT SUM(total) FROM orders;\nSELECT AVG(total) FROM orders WHERE status = 'shipped';\n\`\`\`\n\n## GROUP BY\n\n\`GROUP BY\` groups rows sharing a column value, letting you aggregate per group.\n\n\`\`\`sql\nSELECT category, SUM(total) FROM orders GROUP BY category;\nSELECT status, COUNT(*) FROM orders GROUP BY status;\n\`\`\`\n\n## HAVING\n\n\`HAVING\` filters groups (like WHERE but for aggregated results).\n\n\`\`\`sql\nSELECT category, SUM(total) FROM orders GROUP BY category HAVING SUM(total) > 5000;\n\`\`\``,
        examples: [{ title: 'Revenue by category', content: "SELECT category, SUM(total) as revenue FROM orders GROUP BY category ORDER BY revenue DESC;" }],
        externalResource: { label: 'Khan Academy SQL', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'sql-2-q1', question: 'What does GROUP BY do?', options: ['Filters rows', 'Groups rows for aggregation', 'Joins tables', 'Sorts results'], correctIndex: 1, explanation: 'GROUP BY groups rows to apply aggregate functions per group.' },
          { id: 'sql-2-q2', question: 'Which clause filters aggregated groups?', options: ['WHERE', 'HAVING', 'FILTER', 'GROUP'], correctIndex: 1, explanation: 'HAVING filters after GROUP BY aggregation.' },
          { id: 'sql-2-q3', question: 'What does COUNT(*) return?', options: ['Column count', 'Total row count', 'Unique values', 'Null count'], correctIndex: 1, explanation: 'COUNT(*) counts all rows including nulls.' },
        ],
        projectId: 'proj-sql-2',
      },
      {
        id: 'sql-3', moduleId: 1, title: 'JOINs',
        explanation: `## Why JOINs?\n\nReal databases store data across multiple tables. \`JOIN\` combines rows from two tables based on a related column.\n\n## INNER JOIN\n\nReturns only matching rows from both tables:\n\n\`\`\`sql\nSELECT o.product, c.name\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id;\n\`\`\`\n\n## LEFT JOIN\n\nReturns all rows from the left table, with matches from the right (NULL if no match):\n\n\`\`\`sql\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id;\n\`\`\`\n\n## Table Aliases\n\nUse short aliases (\`o\`, \`c\`) to keep queries readable when joining multiple tables.`,
        examples: [{ title: 'Customer spend with names', content: 'SELECT c.name, SUM(o.total) as spend FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.name;' }],
        externalResource: { label: 'SQLBolt JOINs Lesson', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'sql-3-q1', question: 'Which JOIN returns only matching rows?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correctIndex: 2, explanation: 'INNER JOIN returns only rows that match in both tables.' },
          { id: 'sql-3-q2', question: 'What does a LEFT JOIN return for unmatched left rows?', options: ['Error', 'NULL for right columns', 'Skips the row', 'Empty string'], correctIndex: 1, explanation: 'LEFT JOIN returns NULL for right table columns when no match.' },
          { id: 'sql-3-q3', question: 'What is the ON clause for?', options: ['Sorting', 'Specifying join condition', 'Filtering results', 'Grouping'], correctIndex: 1, explanation: 'ON specifies the column relationship for the join.' },
        ],
        projectId: 'proj-sql-3',
      },
    ],
  },
  {
    id: 2, title: 'Excel for Business Analysis', icon: '📈',
    description: 'Excel functions, pivots, and dashboards for real-world analysis',
    topics: [
      {
        id: 'excel-1', moduleId: 2, title: 'Core Functions',
        explanation: `## Essential Functions\n\n- \`VLOOKUP(value, range, col_index, exact)\` — look up a value in a table\n- \`INDEX(range, row, col)\` + \`MATCH(value, range, type)\` — flexible lookup combo\n- \`IF(condition, true_val, false_val)\` — conditional logic\n- \`SUMIF(range, criteria, sum_range)\` — conditional sum\n- \`COUNTIF(range, criteria)\` — conditional count\n\n## VLOOKUP Example\n\n\`\`\`\n=VLOOKUP(A2, ProductTable, 2, FALSE)\n\`\`\`\n\nThis finds A2 in the first column of ProductTable and returns the value from column 2.\n\n## INDEX/MATCH (Better than VLOOKUP)\n\n\`\`\`\n=INDEX(PriceColumn, MATCH(ProductName, NameColumn, 0))\n\`\`\`\n\nMore flexible — doesn't break when columns are inserted.`,
        examples: [{ title: 'Conditional sum', content: '=SUMIF(RegionColumn, "North", SalesColumn)' }],
        externalResource: { label: 'Excel Easy Functions', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'excel-1-q1', question: 'What does VLOOKUP do?', options: ['Adds numbers', 'Searches a value in the first column', 'Creates pivots', 'Formats cells'], correctIndex: 1, explanation: 'VLOOKUP searches for a value in the first column of a range.' },
          { id: 'excel-1-q2', question: 'Which function counts cells meeting a condition?', options: ['COUNT', 'COUNTA', 'COUNTIF', 'SUMIF'], correctIndex: 2, explanation: 'COUNTIF counts cells that meet a specified condition.' },
          { id: 'excel-1-q3', question: 'Why is INDEX/MATCH preferred over VLOOKUP?', options: ['Faster calculation', 'More flexible, doesn\'t break on column insert', 'Shorter formula', 'Built-in error handling'], correctIndex: 1, explanation: 'INDEX/MATCH is more flexible and robust to structural changes.' },
        ],
        projectId: 'proj-excel-1',
      },
      {
        id: 'excel-2', moduleId: 2, title: 'Pivot Tables',
        explanation: `## What is a Pivot Table?\n\nA Pivot Table summarizes large datasets by grouping and aggregating. You drag fields to rows, columns, and values areas.\n\n## Creating a Pivot Table\n\n1. Select your data range\n2. Insert → Pivot Table\n3. Drag fields to Rows, Columns, Values, Filters\n\n## Common Aggregations\n\n- Sum of Sales by Region\n- Count of Orders by Month\n- Average Revenue by Product Category\n\n## Calculated Fields\n\nCreate custom formulas inside a pivot table:\n\n\`\`\`\nProfit = Sales - Cost\n\`\`\`\n\n## Grouping\n\nGroup dates by month/quarter/year. Group numeric fields into bins.`,
        examples: [{ title: 'Sales by region pivot', content: 'Rows: Region | Values: Sum of Sales, Count of Orders' }],
        externalResource: { label: 'Excel Jet Pivot Tables', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'excel-2-q1', question: 'What is a pivot table used for?', options: ['Formatting cells', 'Summarizing and aggregating data', 'Creating charts', 'Data validation'], correctIndex: 1, explanation: 'Pivot tables summarize large datasets by grouping and aggregating.' },
          { id: 'excel-2-q2', question: 'Where do you drag a field to see sums by category?', options: ['Filters area', 'Rows area + Values area', 'Columns only', 'Anywhere'], correctIndex: 1, explanation: 'Drag category to Rows and the metric to Values.' },
          { id: 'excel-2-q3', question: 'What is a calculated field in a pivot table?', options: ['A pre-existing column', 'A custom formula inside the pivot', 'A chart type', 'A filter'], correctIndex: 1, explanation: 'Calculated fields are custom formulas within the pivot table.' },
        ],
        projectId: 'proj-excel-2',
      },
      {
        id: 'excel-3', moduleId: 2, title: 'Dashboards & Formatting',
        explanation: `## Conditional Formatting\n\nAutomatically format cells based on rules:\n\n- Color scales (heat maps)\n- Data bars (in-cell bars)\n- Icon sets (arrows, traffic lights)\n- Custom rules (e.g., highlight values > threshold)\n\n## Dashboard Components\n\n- **KPI Cards**: Large numbers showing key metrics\n- **Charts**: Column, line, pie, combo\n- **Slicers**: Interactive filters\n- **Pivot Tables**: Underlying data summaries\n\n## Data Validation\n\nRestrict input to prevent errors:\n\n\`\`\`\nData → Data Validation → List → "High,Medium,Low"\n\`\`\`\n\n## Best Practices\n\n- One metric per chart\n- Consistent color scheme\n- Left-to-right, top-to-bottom flow\n- Mobile-readable font sizes`,
        examples: [{ title: 'Heat map with color scale', content: 'Select range → Conditional Formatting → Color Scale → Green-Yellow-Red' }],
        externalResource: { label: 'Excel Campus Dashboards', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'excel-3-q1', question: 'What does conditional formatting do?', options: ['Fixes data errors', 'Formats cells based on rules', 'Creates formulas', 'Protects sheets'], correctIndex: 1, explanation: 'Conditional formatting applies visual formatting based on cell values or rules.' },
          { id: 'excel-3-q2', question: 'What is a slicer?', options: ['A chart type', 'An interactive filter', 'A formula', 'A data type'], correctIndex: 1, explanation: 'Slicers are interactive filter buttons for pivot tables and charts.' },
          { id: 'excel-3-q3', question: 'What is data validation used for?', options: ['Chart creation', 'Restricting input', 'Sorting data', 'Printing'], correctIndex: 1, explanation: 'Data validation restricts what can be entered in a cell to prevent errors.' },
        ],
        projectId: 'proj-excel-3',
      },
    ],
  },
  {
    id: 3, title: 'Power BI & DAX', icon: '⚡',
    description: 'Build interactive dashboards and master DAX formulas',
    topics: [
      {
        id: 'powerbi-1', moduleId: 3, title: 'Power BI Basics',
        explanation: `## What is Power BI?\n\nPower BI is Microsoft's business analytics tool for creating interactive dashboards and reports.\n\n## Key Components\n\n- **Power BI Desktop**: Build reports (free)\n- **Power BI Service**: Share and view online\n- **Power Query**: Data transformation editor\n\n## Data Import & Modeling\n\n1. Connect to data sources (Excel, SQL, CSV, APIs)\n2. Transform data in Power Query\n3. Build a data model with relationships\n4. Create visuals\n\n## Star Schema\n\nA data modeling pattern with:\n- **Fact tables**: Transactional data (sales, orders)\n- **Dimension tables**: Descriptive data (products, customers, dates)\n\nThis structure is optimized for BI queries and DAX.`,
        examples: [{ title: 'Import Excel data', content: 'Home → Get Data → Excel → select file → Transform Data' }],
        externalResource: { label: 'Microsoft Power BI Learning', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'powerbi-1-q1', question: 'What is DAX?', options: ['A chart type', 'A formula language', 'A data source', 'A visualization'], correctIndex: 1, explanation: 'DAX (Data Analysis Expressions) is the formula language in Power BI.' },
          { id: 'powerbi-1-q2', question: 'What is a star schema?', options: ['A chart layout', 'A data model design with fact and dimension tables', 'A DAX function', 'A Power BI license tier'], correctIndex: 1, explanation: 'Star schema has central fact tables surrounded by dimension tables.' },
          { id: 'powerbi-1-q3', question: 'What does Power Query do?', options: ['Creates charts', 'Transforms and cleans data', 'Publishes reports', 'Manages licenses'], correctIndex: 1, explanation: 'Power Query is the data transformation and cleaning editor.' },
        ],
        projectId: 'proj-powerbi-1',
      },
      {
        id: 'powerbi-2', moduleId: 3, title: 'DAX Fundamentals',
        explanation: `## Measures vs Calculated Columns\n\n- **Calculated Column**: Computed row-by-row, stored in the model\n- **Measure**: Computed at query time, context-dependent\n\n## Basic DAX Functions\n\n\`\`\`dax\nTotal Sales = SUM(Sales[Amount])\nAvg Price = AVERAGE(Products[Price])\nSales Count = COUNTROWS(Sales)\n\`\`\`\n\n## Time Intelligence\n\n\`\`\`dax\nSales LY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))\nYoY Growth = DIVIDE([Total Sales] - [Sales LY], [Sales LY])\n\`\`\`\n\n## FILTER & CALCULATE\n\n\`CALCULATE\` modifies filter context:\n\n\`\`\`dax\nWest Sales = CALCULATE([Total Sales], Region[Region] = "West")\n\`\`\``,
        examples: [{ title: 'YoY revenue growth', content: 'YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY]) * 100' }],
        externalResource: { label: 'DAX Guide (dax.guide)', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'powerbi-2-q1', question: 'What is the difference between a measure and a calculated column?', options: ['Same thing', 'Measures compute at query time, columns compute row-by-row', 'Columns are faster', 'Measures are stored'], correctIndex: 1, explanation: 'Measures are dynamic and context-dependent; calculated columns are static and stored.' },
          { id: 'powerbi-2-q2', question: 'What does CALCULATE do?', options: ['Counts rows', 'Modifies filter context', 'Sorts data', 'Creates relationships'], correctIndex: 1, explanation: 'CALCULATE evaluates an expression in a modified filter context.' },
          { id: 'powerbi-2-q3', question: 'Which function calculates year-over-year growth?', options: ['YOY()', 'SAMEPERIODLASTYEAR()', 'GROWTH()', 'PREVIOUSYEAR()'], correctIndex: 1, explanation: 'SAMEPERIODLASTYEAR shifts the date filter to the prior year.' },
        ],
        projectId: 'proj-powerbi-2',
      },
      {
        id: 'powerbi-3', moduleId: 3, title: 'Visualizations & Reports',
        explanation: `## Choosing the Right Visual\n\n- **Bar/Column Chart**: Compare categories\n- **Line Chart**: Show trends over time\n- **Scatter Plot**: Show relationship between two metrics\n- **Pie/Donut**: Show composition (use sparingly)\n- **Table/Matrix**: Detailed data with sorting\n- **KPI Card**: Single key metric\n\n## Interactive Features\n\n- **Slicers**: Filter all visuals on a page\n- **Drill-through**: Navigate to detail page\n- **Tooltips**: Hover for additional context\n- **Bookmarks**: Save filter states\n\n## Row-Level Security (RLS)\n\nRestrict data access per user:\n\n\`\`\`dax\n[Email] = USERPRINCIPALNAME()\n\`\`\`\n\n## Dashboard Design Principles\n\n- Most important metrics top-left\n- Consistent color scheme\n- White space between visuals\n- Mobile layout consideration`,
        examples: [{ title: 'Sales dashboard layout', content: 'KPI cards (top) → Trend line (left) → Category bars (right) → Details table (bottom)' }],
        externalResource: { label: 'Power BI Visualization Guide', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'powerbi-3-q1', question: 'When should you use a line chart?', options: ['Comparing categories', 'Showing trends over time', 'Showing composition', 'Showing distribution'], correctIndex: 1, explanation: 'Line charts show trends over continuous data like time.' },
          { id: 'powerbi-3-q2', question: 'What does a slicer do?', options: ['Creates a chart', 'Filters all visuals on a page', 'Calculates totals', 'Exports data'], correctIndex: 1, explanation: 'Slicers provide interactive filtering across all visuals on a report page.' },
          { id: 'powerbi-3-q3', question: 'What is row-level security?', options: ['A visual type', 'Restricting data access per user', 'A DAX function', 'A report layout'], correctIndex: 1, explanation: 'RLS restricts data access at the row level based on user identity.' },
        ],
        projectId: 'proj-powerbi-3',
      },
    ],
  },
  {
    id: 4, title: 'Python for Data Analysis', icon: '🐍',
    description: 'pandas and NumPy for real data manipulation',
    topics: [
      {
        id: 'python-1', moduleId: 4, title: 'pandas Fundamentals',
        explanation: `## What is pandas?\n\npandas is Python's primary data analysis library. The core object is the **DataFrame** — a 2D table with labeled rows and columns.\n\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\n\n# View data\ndf.head()        # first 5 rows\ndf.shape         # (rows, cols)\ndf.columns       # column names\ndf.dtypes        # data types\n\`\`\`\n\n## Selecting Data\n\n\`\`\`python\ndf['salary']              # one column\ndf[['name', 'salary']]    # multiple columns\ndf.iloc[0]                # first row (by position)\ndf.loc[0, 'name']         # by label\ndf[df['salary'] > 80000]  # filter rows\n\`\`\`\n\n## Useful Methods\n\n\`\`\`python\ndf.sort_values('salary', ascending=False)\ndf['salary'].max()\ndf['salary'].mean()\ndf['department'].unique()\n\`\`\``,
        examples: [{ title: 'Find highest paid employee', content: "df.loc[df['salary'].idxmax(), 'name']" }],
        externalResource: { label: 'Kaggle Learn Pandas', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'python-1-q1', question: 'What does df.loc do?', options: ['Accesses by integer position', 'Accesses by label', 'Finds missing values', 'Sorts data'], correctIndex: 1, explanation: 'loc accesses rows/columns by label.' },
          { id: 'python-1-q2', question: 'How do you filter rows where salary > 50000?', options: ["df.filter('salary')", "df[df['salary'] > 50000]", 'df.where(salary)', "df.salary(>50000)"], correctIndex: 1, explanation: 'Boolean indexing: df[df[col] > value] filters rows.' },
          { id: 'python-1-q3', question: 'What does df.head() return?', options: ['Last 5 rows', 'First 5 rows', 'All rows', 'Column names'], correctIndex: 1, explanation: 'head() returns the first 5 rows by default.' },
        ],
        projectId: 'proj-python-1',
      },
      {
        id: 'python-2', moduleId: 4, title: 'Data Cleaning',
        explanation: `## Handling Missing Values\n\n\`\`\`python\ndf.isnull().sum()           # count missing per column\ndf.dropna()                  # drop rows with nulls\ndf['col'].fillna(0)          # fill with value\ndf['col'].fillna(df['col'].mean())  # fill with mean\n\`\`\`\n\n## Type Conversion\n\n\`\`\`python\ndf['date'] = pd.to_datetime(df['date'])\ndf['price'] = df['price'].astype(float)\n\`\`\`\n\n## Removing Duplicates\n\n\`\`\`python\ndf.duplicated().sum()    # count duplicates\ndf.drop_duplicates()     # remove them\n\`\`\`\n\n## String Operations\n\n\`\`\`python\ndf['name'] = df['name'].str.strip()\ndf['name'] = df['name'].str.title()\n\`\`\``,
        examples: [{ title: 'Clean a messy column', content: "df['price'] = df['price'].str.replace('₹','').astype(float)" }],
        externalResource: { label: 'Real Python Data Cleaning', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'python-2-q1', question: 'How do you count missing values per column?', options: ['df.count()', 'df.isnull().sum()', 'df.missing()', 'df.na()'], correctIndex: 1, explanation: 'isnull().sum() counts nulls per column.' },
          { id: 'python-2-q2', question: 'What does fillna() do?', options: ['Drops nulls', 'Fills nulls with a value', 'Counts nulls', 'Sorts nulls'], correctIndex: 1, explanation: 'fillna replaces null values with a specified value.' },
          { id: 'python-2-q3', question: 'How to remove duplicate rows?', options: ['df.unique()', 'df.drop_duplicates()', 'df.remove_dups()', 'df.distinct()'], correctIndex: 1, explanation: 'drop_duplicates() removes duplicate rows.' },
        ],
        projectId: 'proj-python-2',
      },
      {
        id: 'python-3', moduleId: 4, title: 'Aggregation & Grouping',
        explanation: `## groupby()\n\n\`\`\`python\ndf.groupby('department')['salary'].mean()\ndf.groupby('department')['salary'].agg(['mean', 'min', 'max'])\ndf.groupby(['department', 'city'])['salary'].sum()\n\`\`\`\n\n## Aggregation Methods\n\n\`\`\`python\ndf.groupby('dept').agg({\n    'salary': 'mean',\n    'name': 'count',\n    'performance_rating': 'max'\n})\n\`\`\`\n\n## Pivot Tables\n\n\`\`\`python\ndf.pivot_table(values='salary', index='department', columns='city', aggfunc='mean')\n\`\`\`\n\n## value_counts()\n\n\`\`\`python\ndf['department'].value_counts()\ndf['department'].value_counts(normalize=True) * 100  # percentages\n\`\`\``,
        examples: [{ title: 'Salary stats by department', content: "df.groupby('department')['salary'].agg(['mean','min','max'])" }],
        externalResource: { label: 'pandas Groupby Docs', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'python-3-q1', question: 'What does groupby() do?', options: ['Sorts data', 'Groups rows for aggregation', 'Filters data', 'Merges tables'], correctIndex: 1, explanation: 'groupby splits data into groups for aggregation.' },
          { id: 'python-3-q2', question: 'How to get average salary by department?', options: ["df.mean('salary')", "df.groupby('department')['salary'].mean()", "df.avg('dept')", "df.pivot('salary')"], correctIndex: 1, explanation: 'groupby then select column and apply mean.' },
          { id: 'python-3-q3', question: 'What does value_counts() return?', options: ['Unique values', 'Count of each unique value', 'Total count', 'Null count'], correctIndex: 1, explanation: 'value_counts() returns frequency of each unique value.' },
        ],
        projectId: 'proj-python-3',
      },
    ],
  },
  {
    id: 5, title: 'Statistics & A/B Testing', icon: '📊',
    description: 'Statistical thinking for data-driven decisions',
    topics: [
      {
        id: 'stats-1', moduleId: 5, title: 'Descriptive Statistics',
        explanation: `## Measures of Central Tendency\n\n- **Mean**: Average value — sensitive to outliers\n- **Median**: Middle value — robust to outliers\n- **Mode**: Most frequent value\n\n## Measures of Spread\n\n- **Range**: Max - Min\n- **Variance**: Average squared deviation from mean\n- **Standard Deviation**: Square root of variance\n- **IQR**: Q3 - Q1 (interquartile range)\n\n## In Python\n\n\`\`\`python\ndf['salary'].mean()\ndf['salary'].median()\ndf['salary'].std()\ndf['salary'].quantile([0.25, 0.5, 0.75])\n\`\`\`\n\n## When to use Median vs Mean\n\nUse **median** for skewed distributions (income, house prices).\nUse **mean** for symmetric distributions (height, test scores).`,
        examples: [{ title: 'Salary distribution analysis', content: 'df["salary"].describe()  # count, mean, std, min, quartiles, max' }],
        externalResource: { label: 'Khan Academy Statistics', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'stats-1-q1', question: 'Which measure is robust to outliers?', options: ['Mean', 'Median', 'Range', 'Variance'], correctIndex: 1, explanation: 'Median is not affected by extreme values.' },
          { id: 'stats-1-q2', question: 'What does standard deviation measure?', options: ['Central tendency', 'Spread of data', 'Frequency', 'Correlation'], correctIndex: 1, explanation: 'Standard deviation measures how spread out values are from the mean.' },
          { id: 'stats-1-q3', question: 'What is the median of [3, 1, 4, 1, 5, 9, 2]?', options: ['1', '3', '4', '5'], correctIndex: 1, explanation: 'Sorted: [1,1,2,3,4,5,9] → median = 3.' },
        ],
        projectId: 'proj-stats-1',
      },
      {
        id: 'stats-2', moduleId: 5, title: 'Hypothesis Testing',
        explanation: `## The Framework\n\n1. **Null Hypothesis (H₀)**: No effect / no difference\n2. **Alternative Hypothesis (H₁)**: There IS an effect\n3. **Choose significance level (α)**: Usually 0.05\n4. **Calculate test statistic & p-value**\n5. **Decision**: If p < α, reject H₀\n\n## p-value Interpretation\n\n- p < 0.05: Statistically significant (reject H₀)\n- p ≥ 0.05: Not enough evidence (fail to reject H₀)\n\n## Common Tests\n\n- **t-test**: Compare means of two groups\n- **Chi-square**: Test independence of categories\n- **ANOVA**: Compare means of 3+ groups\n\n## Type I and Type II Errors\n\n- **Type I**: False positive (reject true H₀)\n- **Type II**: False negative (fail to reject false H₀)`,
        examples: [{ title: 'A/B test with t-test', content: 'from scipy import stats\nstats.ttest_ind(group_a, group_b)' }],
        externalResource: { label: 'Khan Academy Hypothesis Testing', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'stats-2-q1', question: 'What does a p-value < 0.05 indicate?', options: ['Result is wrong', 'Statistically significant', 'Sample too small', 'H₀ is true'], correctIndex: 1, explanation: 'p < 0.05 suggests sufficient evidence to reject the null hypothesis.' },
          { id: 'stats-2-q2', question: 'What is a Type I error?', options: ['False negative', 'False positive', 'Correct rejection', 'Correct acceptance'], correctIndex: 1, explanation: 'Type I error is rejecting a true null hypothesis (false positive).' },
          { id: 'stats-2-q3', question: 'Which test compares means of two groups?', options: ['Chi-square', 't-test', 'ANOVA', 'Correlation'], correctIndex: 1, explanation: 't-test compares means of two groups.' },
        ],
        projectId: 'proj-stats-2',
      },
      {
        id: 'stats-3', moduleId: 5, title: 'A/B Testing in Practice',
        explanation: `## A/B Test Steps\n\n1. **Define hypothesis**: Variant B improves conversion vs A\n2. **Determine sample size**: Based on power and effect size\n3. **Run experiment**: Randomly assign users\n4. **Analyze**: Calculate lift, p-value, confidence interval\n5. **Decide**: Ship, iterate, or kill\n\n## Key Metrics\n\n- **Conversion Rate**: Conversions / Visitors\n- **Absolute Lift**: B_rate - A_rate\n- **Relative Lift**: (B_rate - A_rate) / A_rate × 100\n- **CTR**: Clicks / Impressions\n\n## Practical Significance\n\nStatistical significance ≠ practical significance. A 0.1% lift may be statistically significant with enough data but not worth shipping.\n\n## Common Pitfalls\n\n- Peeking at results before the test ends\n- Not accounting for novelty effect\n- Multiple comparisons without correction\n- Improper randomization`,
        examples: [{ title: 'Calculate relative lift', content: 'lift = (variant_b_rate - variant_a_rate) / variant_a_rate * 100' }],
        externalResource: { label: 'Kaggle Learn A/B Testing', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'stats-3-q1', question: 'What is relative lift?', options: ['B_rate - A_rate', '(B_rate - A_rate) / A_rate', 'B_rate / A_rate', 'A_rate - B_rate'], correctIndex: 1, explanation: 'Relative lift = (B - A) / A, expressed as a percentage.' },
          { id: 'stats-3-q2', question: 'What is a novelty effect?', options: ['A new feature', 'Temporary boost from change itself', 'A type of error', 'A test variant'], correctIndex: 1, explanation: 'Novelty effect is a temporary performance change due to users noticing something new.' },
          { id: 'stats-3-q3', question: 'Why is practical significance important?', options: ['It replaces statistical significance', 'Small effects may not be worth shipping', 'It reduces sample size', 'It increases p-value'], correctIndex: 1, explanation: 'Even statistically significant results may be too small to matter practically.' },
        ],
        projectId: 'proj-stats-3',
      },
    ],
  },
  {
    id: 6, title: 'Business/Analyst Case Studies', icon: '💼',
    description: 'Solve real business problems with structured analysis',
    topics: [
      {
        id: 'case-1', moduleId: 6, title: 'Revenue Analysis',
        explanation: `## Framework for Revenue Analysis\n\nRevenue = Volume × Price × Mix\n\n1. **Trend Analysis**: Is revenue growing, flat, or declining?\n2. **Decomposition**: Break down by product, region, channel\n3. **Cohort Analysis**: Track revenue by customer acquisition cohort\n4. **Driver Analysis**: What changed — volume, price, or mix?\n\n## Common Scenarios\n\n- Revenue declined 15% in Q3 — investigate causes\n- Revenue growing but profit declining — cost analysis\n- New product launch impact on existing revenue\n\n## Analysis Steps\n\n1. Pull revenue data by time period\n2. Segment by product/region/channel\n3. Compare to historical trends and targets\n4. Formulate hypotheses for changes\n5. Test hypotheses with data\n6. Present findings with recommendations`,
        examples: [{ title: 'Revenue decomposition', content: 'Analyze: (1) Total revenue trend (2) By product line (3) Volume vs Price vs Mix changes' }],
        externalResource: { label: 'Case Interview Prep (PrepLounge)', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'case-1-q1', question: 'What is revenue decomposition?', options: ['Removing revenue', 'Breaking revenue into drivers like volume and price', 'Forecasting revenue', 'Auditing revenue'], correctIndex: 1, explanation: 'Decomposition breaks revenue into its component drivers.' },
          { id: 'case-1-q2', question: 'What does cohort analysis track?', options: ['Individual users', 'Groups over time from a common starting point', 'Revenue only', 'Costs'], correctIndex: 1, explanation: 'Cohort analysis tracks groups who share a common characteristic over time.' },
          { id: 'case-1-q3', question: 'Revenue = ?', options: ['Cost × Profit', 'Volume × Price', 'Price × Cost', 'Volume × Cost'], correctIndex: 1, explanation: 'Revenue = Volume (units sold) × Price per unit.' },
        ],
        projectId: 'proj-case-1',
      },
      {
        id: 'case-2', moduleId: 6, title: 'Customer Segmentation',
        explanation: `## Why Segment Customers?\n\n- Targeted marketing\n- Personalized experiences\n- Resource allocation\n- Churn prevention\n\n## RFM Analysis\n\n- **Recency**: Days since last purchase\n- **Frequency**: Number of purchases\n- **Monetary**: Total spend\n\nScore each dimension (1-5) and create segments:\n- **Champions**: High R, F, M\n- **At Risk**: Low R, High F, M\n- **New Customers**: High R, Low F, M\n\n## Other Methods\n\n- Demographic segmentation (age, location, income)\n- Behavioral segmentation (usage patterns)\n- K-means clustering (algorithmic)`,
        examples: [{ title: 'RFM segmentation', content: 'Score customers on Recency (1-5), Frequency (1-5), Monetary (1-5) → create segments' }],
        externalResource: { label: 'Customer Segmentation Guide', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'case-2-q1', question: 'What does RFM stand for?', options: ['Revenue-Frequency-Margin', 'Recency-Frequency-Monetary', 'Rate-Flow-Money', 'Region-Firm-Model'], correctIndex: 1, explanation: 'RFM = Recency, Frequency, Monetary value.' },
          { id: 'case-2-q2', question: 'What is customer segmentation used for?', options: ['Data cleaning', 'Targeted marketing and personalization', 'Revenue forecasting', 'Cost reduction'], correctIndex: 1, explanation: 'Segmentation enables targeted marketing and personalized experiences.' },
          { id: 'case-2-q3', question: 'Which RFM segment represents loyal high-value customers?', options: ['At Risk', 'Champions', 'New', 'Lost'], correctIndex: 1, explanation: 'Champions have high scores across all three RFM dimensions.' },
        ],
        projectId: 'proj-case-2',
      },
      {
        id: 'case-3', moduleId: 6, title: 'Growth Metrics & Funnels',
        explanation: `## Conversion Funnel\n\nA funnel tracks user journey stages:\n\n\`\`\`\nVisitors → Signups → Activated → Purchased → Retained\n\`\`\`\n\nAnalyze drop-off rates between stages to find bottlenecks.\n\n## Key Growth Metrics\n\n- **CAC**: Customer Acquisition Cost (spend / new customers)\n- **LTV**: Customer Lifetime Value\n- **LTV:CAC Ratio**: Healthy ratio ≥ 3:1\n- **Payback Period**: Months to recover CAC\n- **Retention Rate**: % of users still active after N days\n- **NRR**: Net Revenue Retention (SaaS)\n\n## Funnel Analysis Example\n\n\`\`\`\n100K visitors → 5K signups (5%) → 500 purchases (10% of signups)\n\nBiggest drop-off: Visitors → Signups (95% loss)\n\`\`\`\n\nFocus optimization on the stage with the biggest drop-off.`,
        examples: [{ title: 'Funnel analysis', content: 'Track each stage conversion rate and identify the biggest drop-off point.' }],
        externalResource: { label: 'Reforge Growth Series', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'case-3-q1', question: 'What does CAC stand for?', options: ['Customer Annual Cost', 'Customer Acquisition Cost', 'Company Average Cost', 'Channel Acquisition Cost'], correctIndex: 1, explanation: 'CAC = total acquisition spend / number of new customers.' },
          { id: 'case-3-q2', question: 'What is a healthy LTV:CAC ratio?', options: ['1:1', '3:1 or higher', '1:3', '10:1'], correctIndex: 1, explanation: 'A ratio of 3:1 or higher indicates sustainable growth.' },
          { id: 'case-3-q3', question: 'In a funnel, where should you focus optimization?', options: ['First stage', 'Stage with biggest drop-off', 'Last stage', 'All equally'], correctIndex: 1, explanation: 'Optimize the stage with the highest drop-off rate first.' },
        ],
        projectId: 'proj-case-3',
      },
    ],
  },
  {
    id: 7, title: 'Resume & ATS Optimization', icon: '📄',
    description: 'Build ATS-friendly resumes that get shortlisted',
    topics: [
      {
        id: 'resume-1', moduleId: 7, title: 'Resume Structure',
        explanation: `## Essential Sections (in order)\n\n1. **Professional Summary**: 2-3 lines tailored to the role\n2. **Skills**: Technical skills grouped by category\n3. **Experience**: Reverse chronological, quantified bullets\n4. **Projects**: 2-3 relevant projects with impact\n5. **Education**: Degree, institution, year\n6. **Certifications**: Relevant certs (Google Analytics, Power BI)\n\n## Bullet Point Formula\n\n\`\`\`\n[Action verb] + [What you did] + [Tool/Method] + [Quantified result]\n\`\`\`\n\nExample:\n\`\`\`\nBuilt automated SQL dashboards tracking 15 KPIs, reducing reporting time by 40%\n\`\`\`\n\n## Resume Length\n\n- 1 page for < 5 years experience\n- 2 pages maximum for senior roles\n- Indian market: 1-2 pages acceptable`,
        examples: [{ title: 'Weak vs Strong bullet', content: 'Weak: "Worked on Excel reports"\nStrong: "Automated monthly sales reports in Excel using VBA, saving 10 hours/month"' }],
        externalResource: { label: 'Harvard Resume Guide', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'resume-1-q1', question: 'What should every bullet point include?', options: ['Job title', 'Quantified result', 'Company name', 'Date'], correctIndex: 1, explanation: 'Quantified results demonstrate impact and differentiate you.' },
          { id: 'resume-1-q2', question: 'How long should a resume be for a fresher?', options: ['3+ pages', '1-2 pages', 'Half page', 'No limit'], correctIndex: 1, explanation: '1-2 pages is standard for early-career professionals.' },
          { id: 'resume-1-q3', question: 'What goes first in a data analyst resume?', options: ['Education', 'Professional summary', 'Hobbies', 'References'], correctIndex: 1, explanation: 'Professional summary immediately shows your value proposition.' },
        ],
        projectId: 'proj-resume-1',
      },
      {
        id: 'resume-2', moduleId: 7, title: 'ATS Keywords & Formatting',
        explanation: `## What is ATS?\n\nApplicant Tracking System — software that scans resumes before a human sees them. ~75% of resumes are rejected by ATS.\n\n## ATS-Friendly Formatting\n\n- Use standard fonts (Arial, Calibri, Times New Roman)\n- Avoid tables, text boxes, graphics, columns\n- Use standard section headings\n- Save as .docx or text-based PDF\n- No images or icons\n\n## Keyword Optimization\n\n1. Read the job description carefully\n2. Identify key skills and tools mentioned\n3. Include those exact keywords naturally\n4. Use both acronyms and full forms (SQL / Structured Query Language)\n\n## Common ATS Keywords for Data Analysts\n\nSQL, Excel, Python, Tableau, Power BI, pandas, data visualization,\nstatistical analysis, A/B testing, ETL, data cleaning, dashboards,\nreporting, KPIs, metrics, data mining`,
        examples: [{ title: 'Keyword match', content: 'Job says "Power BI, DAX, data modeling" → your resume should include these exact terms.' }],
        externalResource: { label: 'Jobscan ATS Guide', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'resume-2-q1', question: 'What is ATS?', options: ['Applicant Tracking System', 'Automated Testing Service', 'Application Transfer Software', 'Advanced Talent Screening'], correctIndex: 0, explanation: 'ATS scans and filters resumes before human review.' },
          { id: 'resume-2-q2', question: 'Which format is most ATS-friendly?', options: ['Graphics-heavy PDF', 'Simple text-based format', 'Image-based PDF', 'Infographic resume'], correctIndex: 1, explanation: 'ATS parsers read simple, text-based formats best.' },
          { id: 'resume-2-q3', question: 'How should you include keywords?', options: ['Stuff them anywhere', 'Naturally in context', 'Only in skills section', 'In white text'], correctIndex: 1, explanation: 'Keywords should appear naturally in relevant context throughout the resume.' },
        ],
        projectId: 'proj-resume-2',
      },
      {
        id: 'resume-3', moduleId: 7, title: 'Portfolio & GitHub',
        explanation: `## Why a Portfolio?\n\nA portfolio proves you can do the work. It's especially important for:\n- Career switchers with no direct experience\n- Freshers competing with experienced candidates\n- Standout applications in competitive markets\n\n## Portfolio Projects to Include\n\n1. **SQL Analysis Project**: Write complex queries on a real dataset, present insights\n2. **Dashboard Project**: Build a Power BI / Tableau dashboard end-to-end\n3. **Python Analysis**: Clean, analyze, and visualize data with pandas\n\n## GitHub for Analysts\n\n- Create repositories for each project\n- Write clear README files (problem, approach, findings, code)\n- Use Jupyter notebooks for Python projects\n- Include screenshots of dashboards\n- Pin your best 3-4 repositories\n\n## README Structure\n\n\`\`\`\n# Project Title\n## Problem Statement\n## Dataset\n## Approach\n## Key Findings (with visualizations)\n## Tools Used\n\`\`\``,
        examples: [{ title: 'GitHub README', content: '# E-commerce SQL Analysis\n## Problem: Identify top products and customer segments\n## Findings: 20% of products drive 80% of revenue' }],
        externalResource: { label: 'GitHub Portfolio Guide', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'resume-3-q1', question: 'Why is a portfolio important for analysts?', options: ['It replaces a resume', 'It proves practical skills', 'It\'s mandatory', 'It shows creativity'], correctIndex: 1, explanation: 'A portfolio demonstrates hands-on ability with real projects.' },
          { id: 'resume-3-q2', question: 'What should a GitHub README include?', options: ['Only code', 'Problem, approach, findings, tools', 'Only screenshots', 'Personal info'], correctIndex: 1, explanation: 'A good README explains the problem, your approach, findings, and tools.' },
          { id: 'resume-3-q3', question: 'How many projects should you showcase?', options: ['1', '2-4 quality projects', '10+', 'As many as possible'], correctIndex: 1, explanation: 'Quality over quantity — 2-4 well-documented projects are ideal.' },
        ],
        projectId: 'proj-resume-3',
      },
    ],
  },
  {
    id: 8, title: 'HR & Behavioral Interviews (STAR)', icon: '🎭',
    description: 'Master behavioral interviews with the STAR method',
    topics: [
      {
        id: 'hr-1', moduleId: 8, title: 'STAR Method Fundamentals',
        explanation: `## What is STAR?\n\nA structured framework for answering behavioral interview questions:\n\n- **Situation**: Set the context (where, when, who)\n- **Task**: What was your specific responsibility?\n- **Action**: What did YOU do? (most important part)\n- **Result**: What was the outcome? (quantify if possible)\n\n## Example Answer\n\n**Q**: Tell me about a time you solved a complex problem.\n\n**S**: At my internship, the sales team was manually compiling weekly reports taking 8 hours.\n**T**: I was asked to find a way to automate the process.\n**A**: I wrote SQL queries to pull data from the database, built an Excel dashboard with pivot tables, and set up automatic refresh.\n**R**: Reduced reporting time from 8 hours to 15 minutes, a 97% reduction. The dashboard is still used by the team.\n\n## Tips\n\n- Use \"I\" not \"we\" — they're hiring you\n- Spend 70% of your answer on Action\n- Always quantify results\n- Prepare 5-6 versatile stories\n- Keep answers to 2-3 minutes`,
        examples: [{ title: 'STAR answer structure', content: 'Situation (20%) → Task (10%) → Action (50%) → Result (20%) with quantified outcome' }],
        externalResource: { label: 'Big Interview STAR Method', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'hr-1-q1', question: 'What does STAR stand for?', options: ['Strategy-Tactics-Analysis-Review', 'Situation-Task-Action-Result', 'Standard-Testing-Assessment-Report', 'System-Team-Action-Response'], correctIndex: 1, explanation: 'STAR = Situation, Task, Action, Result.' },
          { id: 'hr-1-q2', question: 'Which part of STAR should you spend the most time on?', options: ['Situation', 'Task', 'Action', 'Result'], correctIndex: 2, explanation: 'Action is where you demonstrate your skills — spend ~50% of your answer here.' },
          { id: 'hr-1-q3', question: 'What should you always include in the Result?', options: ['Feelings', 'Quantified outcome', 'Future plans', 'Team praise'], correctIndex: 1, explanation: 'Quantified results prove impact (e.g., "reduced time by 40%").' },
        ],
        projectId: 'proj-hr-1',
      },
      {
        id: 'hr-2', moduleId: 8, title: 'Common Behavioral Questions',
        explanation: `## Most Common Questions\n\n1. **Tell me about yourself** → Professional summary, not life story\n2. **Why data analytics?** → Genuine motivation, career trajectory\n3. **A time you disagreed with a colleague** → Conflict resolution\n4. **A time you failed** → Learning and growth\n5. **A time you worked under pressure** → Prioritization and composure\n6. **Describe a complex analysis you did** → Technical depth\n\n## Indian Market Specifics\n\n- HR round often comes first (cultural fit, communication)\n- Managerial round (problem-solving, domain knowledge)\n- Case study round (structured thinking)\n- Be prepared for questions about long-term commitment\n- Salary expectations discussion is common in early rounds\n\n## Preparation Strategy\n\n1. List 6-8 experiences covering different themes\n2. Map each to multiple questions\n3. Practice out loud — 2-3 minutes per answer\n4. Get feedback on clarity and conciseness\n5. Prepare for follow-up questions`,
        examples: [{ title: 'Answering "Why data analytics?"', content: 'Connect your background to data work. Show genuine curiosity about finding insights from data.' }],
        externalResource: { label: 'AmbitionBox Interview Tips', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'hr-2-q1', question: 'What should "Tell me about yourself" focus on?', options: ['Personal life', 'Professional journey and skills', 'Hobbies', 'Education only'], correctIndex: 1, explanation: 'Keep it professional — summarize your background and why you\'re here.' },
          { id: 'hr-2-q2', question: 'When asked about a failure, what should you emphasize?', options: ['Blaming others', 'What you learned', 'Minimizing it', 'Avoiding the question'], correctIndex: 1, explanation: 'Show self-awareness and growth from the experience.' },
          { id: 'hr-2-q3', question: 'How many STAR stories should you prepare?', options: ['1', '5-8 versatile stories', '20+', 'None needed'], correctIndex: 1, explanation: '5-8 versatile stories can cover most common behavioral questions.' },
        ],
        projectId: 'proj-hr-2',
      },
      {
        id: 'hr-3', moduleId: 8, title: 'Handling Tough Questions',
        explanation: `## "Why should we hire you?"\n\nConnect your skills to their needs:\n\n\`\`\`\n"Your job posting emphasizes SQL and dashboard automation.\nIn my recent project, I built automated SQL reports that saved\n10 hours/week. I can bring that same efficiency here."\n\`\`\`\n\n## "What is your biggest weakness?"\n\n- Choose a real but non-disqualifying weakness\n- Show what you\'re doing to improve\n- Example: "I sometimes over-analyze data. I\'m learning to set time limits and present preliminary findings sooner."\n\n## Salary Expectations (Indian Market)\n\n- Research industry standards (Glassdoor, AmbitionBox)\n- Give a range, not a single number\n- Consider total CTC (base + variable + benefits)\n- Be ready to justify with your skills and market data\n- Common CTC components: Basic, HRA, LTA, Variable, PF, Bonus\n\n## "Where do you see yourself in 5 years?"\n\nShow growth aligned with the role and company:\n\n\`\`\`\n"I want to grow from a junior analyst to leading analytics projects,\ndeeper into predictive analytics and mentoring new team members."\n\`\`\``,
        examples: [{ title: 'Salary negotiation', content: 'Research market rate → ask for 10-20% above → justify with skills/projects → be open to non-cash benefits' }],
        externalResource: { label: 'Glassdoor Interview Questions', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'hr-3-q1', question: 'How should you answer "biggest weakness"?', options: ['"I work too hard"', 'A real weakness with improvement steps', 'Refuse to answer', 'List multiple weaknesses'], correctIndex: 1, explanation: 'Be honest but strategic — show a real weakness and how you\'re improving.' },
          { id: 'hr-3-q2', question: 'What should you research before discussing salary?', options: ['Nothing', 'Industry standards and company pay scales', 'CEO salary', 'Competitor revenue'], correctIndex: 1, explanation: 'Research market rates on Glassdoor/AmbitionBox to negotiate effectively.' },
          { id: 'hr-3-q3', question: 'What\'s a good approach for "Where do you see yourself in 5 years?"', options: ['"In your job"', 'Growth aligned with role and company', '"Starting my own business"', '"Not sure"'], correctIndex: 1, explanation: 'Show ambition aligned with the company\'s trajectory and the role.' },
        ],
        projectId: 'proj-hr-3',
      },
    ],
  },
  {
    id: 9, title: 'Mock Technical Rounds', icon: '🎯',
    description: 'Practice real interview patterns from top companies',
    topics: [
      {
        id: 'mock-1', moduleId: 9, title: 'SQL Interview Patterns',
        explanation: `## Common SQL Interview Question Types\n\n1. **Aggregation**: Find top N by category\n2. **Filtering**: Find records matching complex conditions\n3. **Joins**: Combine data from multiple tables\n4. **Window Functions**: Running totals, rankings, lag/lead\n5. **Date manipulation**: Month-over-month, YoY comparisons\n\n## Example: Top 3 Customers by Spend\n\n\`\`\`sql\nSELECT customer_id, SUM(total) as spend\nFROM orders\nGROUP BY customer_id\nORDER BY spend DESC\nLIMIT 3;\n\`\`\`\n\n## Example: Running Total\n\n\`\`\`sql\nSELECT order_date, total,\n  SUM(total) OVER (ORDER BY order_date) as running_total\nFROM orders;\n\`\`\`\n\n## Interview Tips\n\n- Clarify the question before coding\n- Think aloud as you write queries\n- Start simple, then optimize\n- Check edge cases (NULLs, duplicates)\n- Verify your output manually`,
        examples: [{ title: 'Rank products by revenue', content: 'SELECT product, SUM(total) as rev FROM orders GROUP BY product ORDER BY rev DESC;' }],
        externalResource: { label: 'StrataScratch SQL Questions', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'mock-1-q1', question: 'What is a window function?', options: ['A GUI element', 'A function performing calculations across related rows', 'A debugging tool', 'A join type'], correctIndex: 1, explanation: 'Window functions perform calculations across sets of rows related to the current row.' },
          { id: 'mock-1-q2', question: 'How to find top 3 by a metric?', options: ['TOP 3', 'ORDER BY ... LIMIT 3', 'FIRST(3)', 'MAX(3)'], correctIndex: 1, explanation: 'ORDER BY metric DESC LIMIT 3 returns the top 3 rows.' },
          { id: 'mock-1-q3', question: 'What should you do before writing a SQL query in an interview?', options: ['Start typing immediately', 'Clarify the question and requirements', 'Ask for the answer', 'Draw a diagram'], correctIndex: 1, explanation: 'Always clarify requirements before coding to avoid solving the wrong problem.' },
        ],
        projectId: 'proj-mock-1',
      },
      {
        id: 'mock-2', moduleId: 9, title: 'Python Interview Patterns',
        explanation: `## Common Python Interview Tasks\n\n1. **Data manipulation**: Filter, sort, transform DataFrames\n2. **Aggregation**: Group by and summarize\n3. **Merging**: Join DataFrames\n4. **Cleaning**: Handle missing values, type conversion\n5. **Analysis**: Calculate metrics, find patterns\n\n## Example: Highest paid per department\n\n\`\`\`python\ndf.loc[df.groupby('department')['salary'].idxmax()]\n\`\`\`\n\n## Example: Employees joined before 2022\n\n\`\`\`python\ndf[pd.to_datetime(df['join_date']) < '2022-01-01']\n\`\`\`\n\n## Interview Tips\n\n- Explain your approach first\n- Use pandas idioms (vectorized operations)\n- Avoid loops when possible\n- Comment your code\n- Handle edge cases explicitly\n- Know the difference between loc and iloc`,
        examples: [{ title: 'Department stats', content: "df.groupby('department').agg({'salary': ['mean', 'max'], 'name': 'count'})" }],
        externalResource: { label: 'Interview Query Python', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'mock-2-q1', question: 'What does iloc do?', options: ['Access by label', 'Access by integer position', 'Import data', 'Log data'], correctIndex: 1, explanation: 'iloc accesses rows/columns by integer position.' },
          { id: 'mock-2-q2', question: 'How to find the max value per group in pandas?', options: ['df.max()', "df.groupby('group')['col'].max()", 'df.sort().max()', 'df.filter(max)'], correctIndex: 1, explanation: 'groupby + max returns the maximum value per group.' },
          { id: 'mock-2-q3', question: 'What should you avoid in pandas interviews?', options: ['Using pandas', 'Loops when vectorized ops work', 'Using loc', 'Comments'], correctIndex: 1, explanation: 'Vectorized operations are faster and more idiomatic than loops.' },
        ],
        projectId: 'proj-mock-2',
      },
      {
        id: 'mock-3', moduleId: 9, title: 'Live Data Analysis Scenarios',
        explanation: `## What to Expect\n\nIn a live analysis round, you may get:\n- A dataset and a business question to answer\n- A case study to solve end-to-end\n- An SQL/Python problem to code live\n\n## Structured Approach\n\n1. **Understand**: Restate the problem in your own words\n2. **Explore**: Look at the data — columns, types, sample rows\n3. **Plan**: Outline your analysis steps\n4. **Execute**: Write queries/code step by step\n5. **Validate**: Check results for reasonableness\n6. **Communicate**: Present findings clearly with insights\n\n## Presentation Framework\n\n\`\`\`\n1. What was the question?\n2. What did the data look like?\n3. What did you do?\n4. What did you find?\n5. What do you recommend?\n\`\`\`\n\n## Common Mistakes\n\n- Diving into code without understanding the problem\n- Not checking data quality\n- Presenting numbers without context\n- No actionable recommendations\n- Getting stuck on one approach`,
        examples: [{ title: 'End-to-end analysis', content: 'Understand → Explore data → Plan analysis → Execute SQL/Python → Validate → Present insights with recommendations' }],
        externalResource: { label: 'Interview Query Case Studies', url: 'TODO: paste verified URL' },
        quiz: [
          { id: 'mock-3-q1', question: 'What should you do first in a live analysis?', options: ['Start coding', 'Understand and restate the problem', 'Ask for the solution', 'Draw charts'], correctIndex: 1, explanation: 'Understanding the problem prevents solving the wrong question.' },
          { id: 'mock-3-q2', question: 'What should your analysis presentation end with?', options: ['Just numbers', 'Actionable recommendations', 'Raw data', 'Code snippets'], correctIndex: 1, explanation: 'Stakeholders want recommendations, not just numbers.' },
          { id: 'mock-3-q3', question: 'What is a common mistake in live analysis?', options: ['Taking notes', 'Diving into code without understanding', 'Asking questions', 'Checking results'], correctIndex: 1, explanation: 'Starting to code without understanding the problem wastes time.' },
        ],
        projectId: 'proj-mock-3',
      },
    ],
  },
];

export const allTopics = modules.flatMap(m => m.topics.map(t => ({ id: t.id, title: t.title, moduleId: m.id, projectId: t.projectId })));
