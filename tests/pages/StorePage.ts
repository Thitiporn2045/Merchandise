import { expect, Locator, Page } from "@playwright/test";

export class StorePage {
    readonly page: Page;
    readonly header: Locator;
    readonly menu: Locator;
    readonly shopTitle: Locator;
    readonly topController: Locator;
    readonly storeContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.getByTestId("header-container");
        this.menu = page.getByTestId("menu");
        this.shopTitle = page.getByTestId("shop-title");
        this.topController = page.getByTestId("top-controller-container");
        this.storeContainer = page.getByTestId("store-container");
    }

    async gotoProducts() {
        await expect(this.header).toBeVisible();
        await expect(this.storeContainer).toBeVisible();
    }

    items() {
        return this.storeContainer.getByTestId("product-item");
    }

    itemByIndex(index: number) {
        return this.items().nth(index);
    }

    addToCartButtonOf(card: Locator) {
        return card.getByTestId("add-to-cart-button");
    }

    async addToCartByIndex(index: number) {
        const card = this.itemByIndex(index);
        await expect(card).toBeVisible();
        await expect(this.addToCartButtonOf(card)).toBeVisible();
        await this.addToCartButtonOf(card).click();
    }

    async expectHeaderVisibleWithZeroCart() {
        await expect(this.header).toBeVisible();
        await expect(this.menu).toBeVisible();
        await expect(this.shopTitle).toBeVisible();
        await expect(this.topController).toBeVisible();
        await expect(
            this.header.locator("div").filter({ hasText: "0" })
        ).toBeVisible();
    }

    async expectHasAtLeastOneItem() {
        await expect(this.storeContainer).toBeVisible();
        await expect(this.items().first()).toBeVisible();
    }
}

