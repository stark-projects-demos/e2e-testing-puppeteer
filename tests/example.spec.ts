import "expect-puppeteer";
import { beforeAll, describe, it } from "@jest/globals";
import { Page } from "puppeteer";
import { StarkScan } from "@stark-ci/puppeteer";

declare global {
  const page: Page;
}

describe("TeamSync Application", () => {
  beforeAll(async () => {
    await page.goto("https://teamsync-stark.webflow.io/");
  });

  it("should have page title", async () => {
    expect(await page.title()).toBe("TeamSync");
  });

  it('should have a "Try TeamSync" button', async () => {
    expect(await page.$("::-p-text(Try TeamSync)")).not.toBeNull();
  });

  it("should meet accessibility requirements", async () => {
    const results = await StarkScan(page.mainFrame(), {
      wcagVersion: "2.2",
      conformanceLevel: "AA",
      sendResults: true,
      name: "TeamSync Site",
      token: process.env.STARK_PROJECT_TOKEN!,
    });

    // Less than 50 overall accessibilty issues at WCAG 2.2 AA.
    expect(results.failed).toBeLessThan(50);

    // Less than 15 failures for contrast issues.
    expect(results.resultsByCriteria["1.4"]?.failed || 0).toBeLessThan(15);
  });
});
