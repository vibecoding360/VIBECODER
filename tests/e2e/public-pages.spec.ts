import { expect, test } from "@playwright/test";

test("landing page renders the FocusFlow introduction", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FocusFlow/);
  await expect(page.getByRole("heading", { name: /Make time for what matters/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get started/i })).toHaveAttribute("href", "/signup");
});

test("signup page exposes the account creation form", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("login page exposes sign-in and recovery links", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /Sign in to your flow/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: /Forgot password/i })).toHaveAttribute("href", "/forgot-password");
});

test("forgot-password page renders its recovery form", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: /Reset your password/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("dashboard redirects anonymous visitors to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard/);
});
