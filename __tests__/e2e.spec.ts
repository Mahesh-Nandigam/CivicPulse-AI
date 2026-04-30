import { test, expect } from "@playwright/test";

test.describe("CivicPulse AI Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the command center hero section", async ({ page }) => {
    const heroTitle = page.locator("h1");
    await expect(heroTitle).toContainText("EMPOWERING EVERY");
  });

  test("should toggle chaos mode and update UI", async ({ page }) => {
    const chaosToggle = page.getByLabel("Activate Crisis Mode");
    await chaosToggle.click();
    
    const chaosBanner = page.getByText("ELECTION DAY CHAOS MODE ACTIVE");
    await expect(chaosBanner).toBeVisible();
    
    const body = page.locator("h1");
    await expect(body).toContainText("NAVIGATE THE CHAOS");
  });

  test("should generate a strategy and show results", async ({ page }) => {
    await page.fill('input[placeholder="e.g. New York, NY"]', "Brooklyn");
    await page.selectOption("select", "25-34");
    await page.click("text=Jobs & Economy");
    
    await page.click("text=Generate My Voting Strategy");
    
    await expect(page.getByText("Strategic Overview")).toBeVisible();
  });
});
