import { test, expect } from "@playwright/test";
import fetchLatestOtp from "../utils/email";
import dotenv from "dotenv";
dotenv.config();

const OTP_VALIDITY_MS = 900000;
const APP_URL = process.env.APP_URL;
const EMAIL_USER = process.env.TESTMAIL_DOMAIN;
const TESTMAIL_API_TOKEN = process.env.TESTMAIL_API_TOKEN;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

test.describe("Email OTP E2E Flow", () => {
  test("Happy path: Request, Receive & Verify OTP", async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill("input[type='email']", EMAIL_USER);
    await page.getByText("Login", { exact: true }).click();
    await page.click("//div[text()='OR Login using OTP']");

    await expect(page.getByText("OTP has been sent to you")).toBeVisible();
    await page.waitForTimeout(5000);

    const otp = await fetchLatestOtp(
      EMAIL_USER,
      TESTMAIL_API_TOKEN,
      TESTMAIL_NAMESPACE
    );
    await page.fill("#otp", otp);
    await page.click("[type='submit']");

    await page.getByRole("button", { name: "T Hi Test arrow_down" }).click();
    await expect(page.getByText("Logout")).toBeVisible();
    await page.getByText("Logout").click();
  });

  test("Resend OTP: only latest OTP works", async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill("input[type='email']", EMAIL_USER);
    await page.getByText("Login", { exact: true }).click();
    await page.click("//div[text()='OR Login using OTP']");
    await expect(page.getByText("OTP has been sent to you")).toBeVisible();

    const firstOtp = await fetchLatestOtp(
      EMAIL_USER,
      TESTMAIL_API_TOKEN,
      TESTMAIL_NAMESPACE
    );
    await page.fill("#otp", firstOtp);
    await page.click("[type='submit']");
    await expect(page.locator("form p").first()).toContainText(
      "The OTP is incorrect or has expired"
    );

    await page.locator("//span[text()='Resend OTP']").waitFor();
    await page.click("//span[text()='Resend OTP']");
    await page.waitForTimeout(5000);

    const secondOtp = await fetchLatestOtp(
      EMAIL_USER,
      TESTMAIL_API_TOKEN,
      TESTMAIL_NAMESPACE
    );
    await page.fill("input#otp", secondOtp);
    await page.click("[type='submit']");
    await page.getByRole("button", { name: "T Hi Test arrow_down" }).click();
    await expect(page.getByText("Logout")).toBeVisible();
    await page.getByText("Logout").click();
  });

  test("Wrong OTP: error shown, no login", async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill("input[type='email']", EMAIL_USER);
    await page.getByText("Login", { exact: true }).click();
    await page.click("//div[text()='OR Login using OTP']");
    await page.fill("#otp", "123456");
    await page.click("[type='submit']");
    await expect(page.locator("form p").first()).toContainText(
      /Login failed\. Please try again\.|The OTP is incorrect or has expired/
    );
  });

  test("Expired OTP: rejected after validity window", async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill("input[type='email']", EMAIL_USER);
    await page.getByText("Login", { exact: true }).click();
    await page.click("//div[text()='OR Login using OTP']");

    const otp = await fetchLatestOtp(
      EMAIL_USER,
      TESTMAIL_API_TOKEN,
      TESTMAIL_NAMESPACE
    );
    await new Promise((res) => setTimeout(res, OTP_VALIDITY_MS + 5000));
    await page.fill("#otp", otp);
    await page.click("[type='submit']");
    await expect(page.locator("form p").first()).toContainText(
      "The OTP is incorrect or has expired"
    );
  });

  test("Multiple requests quickly: system response/state", async ({ page }) => {
    await page.goto(APP_URL);
    await page.fill("input[type='email']", EMAIL_USER);
    await page.getByText("Login", { exact: true }).click();
    await page.click("//div[text()='OR Login using OTP']");

    for (let i = 0; i < 3; i++) {
      await page.locator("//span[text()='Resend OTP']").waitFor();
      await page.click("//span[text()='Resend OTP']");
    }
    const otp = await fetchLatestOtp({ searchSubject: EMAIL_SUBJECT });
    await page.fill("#otp", otp);
    await page.click("[type='submit']");
    await expect(page.locator("form p").first()).toContainText(
      "The OTP is incorrect or has expired"
    );
  });
});
