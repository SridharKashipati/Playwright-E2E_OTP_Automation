# Playwright Email OTP E2E Automation

## Overview
Automated end-to-end tests for an Email OTP (One-Time Password) verification flow using Playwright.

## Features
- Triggers OTP from UI, fetches OTP from email inbox, submits OTP, and verifies authentication.
- Handles positive, negative, and edge cases.
- Screenshots and logs on failure.
- All secrets via environment variables.

## Setup
1. **Clone the repo:**
  ```sh
  git clone <your-repo-url>
  cd Playwright-Practice
  ```
2. **Install dependencies:**
  ```sh
  npm ci
  ```
3. **Set environment variables:**
  Create a `.env` file or export variables in your shell:
  - `APP_URL` – Base URL of the app under test
  - `TESTMAIL_API_TOKEN` – Testmail API token
  - `TESTMAIL_DOMAIN` – Testmail inbox email address
  - `TESTMAIL_NAMESPACE` – Testmail namespace

  Example `.env`:
  ```env
  APP_URL=https://www.yatra.com/
  TESTMAIL_API_TOKEN=your-testmail-api-token
  TESTMAIL_DOMAIN=your-inbox@inbox.testmail.app
  TESTMAIL_NAMESPACE=your-namespace
  ```

## Running Tests Locally
```sh
npm run local
```

## Viewing the Report
After running tests, open the HTML report:
```sh
npm run test:report
```

## CI/CD
- GitHub Actions workflow runs tests on every push/PR to `main` and uploads the HTML report as an artifact.
- Set the required secrets (`APP_URL`, `TESTMAIL_API_TOKEN`, `TESTMAIL_DOMAIN`, `TESTMAIL_NAMESPACE`) in your repo settings.

## One-line Commands
- **Local:** `npm run local`
- **View Report:** `npm run test:report`
- **Cleanup:** `npm run cleanup`
- **CI:** See `.github/workflows/ci.yml`

## Assumptions
- The email inbox is accessible via API and delivers OTPs promptly.
- OTP validity and resend logic are as described.
- All credentials are provided via environment variables.

## Artifacts
- Test report: `/playwright-report/` (HTML)
- Screenshots/logs: Included in report on failure

## Notes
- No secrets are committed.
