import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;

    readonly form: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly emailField: Locator;
    readonly zipField: Locator;
    readonly confirmButton: Locator;

    readonly thankYouContainer: Locator;
    readonly backToStoreButton: Locator;

    readonly errorMassage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.getByTestId("check-out-form");
        this.firstNameField = page.getByTestId("firstname-field");
        this.lastNameField = page.getByTestId("lastname-field");
        this.emailField = page.getByTestId("email-field");
        this.zipField = page.getByTestId("zipcode-field");
        this.confirmButton = page.getByTestId("confirm-payment-button");

        this.thankYouContainer = page.getByTestId("thank-you-container");
        this.backToStoreButton = page.getByTestId("back-to-store-button");

        this.errorMassage = page.getByTestId("error-message-label");
    }

    async expectOnCheckoutPage() {
        await expect(this.form).toBeVisible();
        await expect(this.firstNameField).toBeVisible();
        await expect(this.lastNameField).toBeVisible();
        await expect(this.emailField).toBeVisible();
        await expect(this.zipField).toBeVisible();
        await expect(this.confirmButton).toBeVisible();
    }

    async fillForm(options: {
        firstName?: string;
        lastName?: string;
        email?: string;
        zip?: string;
    }) {
        const { firstName, lastName, email, zip } = options;

        if (firstName !== undefined) {
            await this.firstNameField.fill(firstName);
        }
        if (lastName !== undefined) {
            await this.lastNameField.fill(lastName);
        }
        if (email !== undefined) {
            await this.emailField.fill(email);
        }
        if (zip !== undefined) {
            await this.zipField.fill(zip);
        }
    }

    async submit() {
        await this.confirmButton.click();
    }

    async expectSuccess() {
        await expect(this.thankYouContainer).toBeVisible();
        await expect(
            this.page.getByText("Thank you for your order.")
        ).toBeVisible();
        await expect(
            this.page.getByText("Your order will be shipped")
        ).toBeVisible();
    }

    async expectNoFieldErrors() {
        await expect(this.errorMassage).toBeHidden();
    }

    async expectAllRequiredErrors() {
        await expect(this.errorMassage).toBeVisible();
        await expect(this.errorMassage).toContainText(
            "First name is required."
        );
    }

    async expectEmailDomainError() {
        await expect(this.errorMassage).toBeVisible();
        await expect(this.errorMassage).toContainText(
            "We support only email address with domain mailinator.com"
        );
    }

    async expectZipFormatError() {
        await expect(this.errorMassage).toBeVisible();
        await expect(this.errorMassage).toContainText(
            "We support only 5 digits zip code"
        );
    }
}
