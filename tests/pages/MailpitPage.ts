import { expect, Locator, Page } from "@playwright/test";

export class MailpitPage {
    readonly page: Page;
    readonly brandLink: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly messagePage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.brandLink = page.getByRole("link", { name: "MailpitMailpit" });
        this.searchBox = page.getByRole("textbox", { name: "Search" });
        this.searchButton = page.locator("form").getByRole("button");
        this.messagePage = page.locator("#message-page");
    }

    async goto() {
        await this.page.goto("https://mailpit.odds.team/");
    }

    async expectLoaded() {
        await expect(this.brandLink).toBeVisible();
        await expect(this.searchBox).toBeVisible();
        await expect(this.searchButton).toBeVisible();
        await expect(this.messagePage).toBeVisible();
    }

    orderEmailRow(toEmail: string): Locator {
        return this.page
            .getByRole("link", {
                name: new RegExp(
                    `ODT x merchandise store\\s+To:\\s+${toEmail}\\s+ODT x merchandise: Order`,
                    "i"
                ),
            })
            .first();
    }

    async expectOrderEmailVisible(toEmail: string) {
        const row = this.orderEmailRow(toEmail);
        await expect(row).toBeVisible({ timeout: 30_000 });
    }

    async openOrderEmail(toEmail: string) {
        const row = this.orderEmailRow(toEmail);

        await row.click();

        await expect(this.messagePage).toBeVisible();

        await expect(
            this.page.getByRole("rowheader", { name: "To" })
        ).toBeVisible();
        await expect(
            this.page.getByRole("cell", {
                name: /Geeky Base <testOfGift@mailinator\.com>/,
            })
        ).toBeVisible();
    }
}
