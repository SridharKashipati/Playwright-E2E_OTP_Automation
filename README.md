# Email OTP E2E Automation

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
npm run test:ci
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
- **Local:** `npm run test:ci`
- **View Report:** `npm run test:report`
- **Cleanup:** `npm run cleanup`
- **CI:** See `.github/workflows/ci.yml`

## Assumptions
- The email inbox is accessible via IMAP/POP and delivers OTPs promptly.
- OTP validity and resend logic are enforced by the backend.
- All credentials are provided via environment variables.

## Artifacts
- Test report: `playwright-report/` (HTML)
- Screenshots/logs: Included in report on failure

## Notes
- No secrets are committed.
- Tests are re-runnable and flake-resistant with sensible waits/polling.
# Playwright Email OTP E2E Automation

## Setup

1. Clone the repo.
2. Copy `.env.example` to `.env` and fill in your app and email credentials.
3. Install dependencies:
   ```
   npm install
   ```

## Running Tests

- Run all tests:
  ```
  npm test
  ```
- View HTML report:
  ```
  npm run test:report
  ```

## Environment Variables

See `.env` for environment variables.

## CI

Tests run on every push via GitHub Actions. The Playwright HTML report is published as an artifact.

## Assumptions

- OTP email subject and format are known and stable.
- Email inbox is dedicated for test runs.
- OTP validity and resend logic are as described.

## One-line commands

- Local: `npm run test`
- CI: See `.github/workflows/ci.yml`
