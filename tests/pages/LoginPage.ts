import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly loginForm: Locator;
    readonly shopTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginForm = page.getByTestId("login-form");
        this.usernameField = page.getByTestId("login-field");
        this.passwordField = page.getByTestId("password-field");
        this.submitButton = page.getByTestId("submit-button");
        this.errorMessage = page.getByTestId("error-message-label");
        this.shopTitle = page.getByTestId("shop-title");
    }

    async goto() {
        await this.page.goto("https://merchandise-dev.odds.team/");
        await expect(this.loginForm).toBeVisible();
    }

    async fillUsername(username: string) {
        await this.usernameField.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async submit() {
        await this.submitButton.click();
    }

    async login(username: string, password: string) {
        await this.goto();
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }

    async expectLoginSuccess() {
        await expect(this.shopTitle).toBeVisible();
    }

    async expectInvalidCredentialError() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(
            /Invalid username or password/i
        );
        await expect(this.loginForm).toBeVisible();
    }

    async expectValidationError() {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(/invalid/i);
        await expect(this.loginForm).toBeVisible();
    }
}
