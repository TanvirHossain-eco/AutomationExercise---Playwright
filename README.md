AutomationExercise - Playwright Automation Project
==================================================
Prerequisites:
==============
IDE (VS Code)
Git Bash Installation
Node Js Installation
After installation of Node JS open the command prompt 
check node & npm version
To check Node version = node -v
To check NPM version = npm -v

Setup Instructions (Local):
===========================
1. Clone the repository
- Open a terminal from IDE (or Git Bash)
- Navigate to the folder where you want to clone the project: cd /path/to/your/folder
- git clone https://github.com/TanvirHossain-eco/AutomationExercise---Playwright.git
- cd <REPO_NAME> like: cd AutomationExercise---Playwright (You can also rename the folder later)

2. Install dependencies
- npm install

3. Install Playwright browsers
- npx playwright install --with-deps

4. Run all tests
- npx playwright test

5. Run a specific task:
# Task-1: UI E2E tests
- npx playwright test tests/task-1.spec.js

# Task-2: API tests (Chromium only)
- npx playwright test tests/task-2.spec.js

6. View HTML report
- npx playwright show-report

7. Test Data and Notes
- Test accounts are created dynamically via API. Emails are unique per run.
- Credentials are saved in fixtures/user_credentials.json for reuse.
- Retry logic is configured in playwright.config.js (optional).
- Downloaded invoices are saved to downloads/.
- Known limitation: Invoice content assertion depends on total price being correctly calculated in the cart.

8. CI/CD Integration
Workflow file: .github/workflows/playwright.yml
CI/CD status badge is included at the top.
Artifacts (reports, invoices) are uploaded and available in each successful run.

9. Invoice Verification
- After a successful purchase, the invoice file is downloaded.
- Invoice assertions check:
- - File exists
- - File size > 0
- - Limitation: Contains correct user name and total price - The verification of total price and user name code section is commented out because invoice.txt occasionally contains an incorrect total price due to system calculation issues. It is observed in all browsers.

10. Flaky Test Observations During Parallel Testing

- Occasionally, only one product is added to the cart instead of two, causing the test to get stuck in the cart view and fail.
- At times, more than two products are added to the cart, leading to failures when navigating to the cart view.
- Sometimes, multiple quantities of a single product are added unexpectedly, which causes the test to hang in the cart view and fail.
- In some cases, the test gets stuck during login or other steps, resulting in failure.
- During local parallel testing with 2 workers, tests sometimes interfere with each other across browsers, causing overlapping issues.

This README ensures anyone cloning the repo can run tests locally, understand parallel & cross-browser execution, and view CI/CD results.