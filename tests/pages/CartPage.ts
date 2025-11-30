import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartIcon: Locator;
    readonly itemsContainer: Locator;
    readonly actionsContainer: Locator;
    readonly emptyCartContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.getByTestId("cart").locator("#Layer_1");
        this.itemsContainer = page.getByTestId("cart-items-container");
        this.actionsContainer = page.getByTestId("cart-actions-container");
        this.emptyCartContainer = page.getByTestId("empty-cart-container");
    }

    async openCart() {
        await this.cartIcon.click();

        await this.page.waitForLoadState("networkidle");

        if (await this.itemsContainer.isVisible()) return;
        await expect(this.emptyCartContainer).toBeVisible();
    }

    quantityInput(): Locator {
        return this.page.getByTestId("quantity");
    }

    items() {
        return this.page.getByTestId("cart-item");
    }

    item(index: number) {
        return this.items().nth(index);
    }

    headerCartCount(expected?: string | RegExp) {
        return this.page
            .getByTestId("header-container")
            .locator("div")
            .filter({ hasText: expected ?? /\d+/ });
    }

    async expectHeaderCartCount(count: number) {
        await expect(this.headerCartCount(String(count))).toBeVisible();
    }

    async getSubtotalText(): Promise<string> {
        return (await this.subtotalContainer().innerText()).trim();
    }

    subtotalContainer(): Locator {
        return this.page.getByTestId("subtotal-price-container");
    }

    removeButton(index: number) {
        return this.item(index).getByTestId("remove-from-cart-button");
    }

    async expectSubtotalVisible() {
        await expect(this.subtotalContainer()).toBeVisible();
    }

    async expectItemCount(count: number) {
        await expect(this.items()).toHaveCount(count);
    }

    async changeQuantityTo(value: number) {
        const qty = this.quantityInput();
        await expect(qty).toBeVisible();
        await qty.click();
        await qty.fill(String(value));
        await qty.press("Enter");
    }

    async remove(index: number) {
        await this.removeButton(index).click();
    }

    async expectEmpty() {
        await expect(this.items()).toHaveCount(0);
        await expect(
            this.emptyCartContainer.or(this.page.getByText(/No item in cart/i))
        ).toBeVisible();
    }

    checkoutButton(): Locator {
        return this.page.getByTestId("checkout-button");
    }

    async proceedToCheckout() {
        await this.checkoutButton().click();
        await expect(this.page.getByTestId("check-out-form")).toBeVisible();
    }
}
