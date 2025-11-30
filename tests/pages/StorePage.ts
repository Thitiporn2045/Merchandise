import { expect, Locator, Page } from "@playwright/test";
import { ProductMock } from "../data/products.mock";

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

    itemBySku(sku: string) {
        return this.storeContainer.locator(
            `[data-testid="product-item"][data-sku="${sku}"]`
        );
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

    async expectProductCardMatchesMock(product: ProductMock) {
        const card = this.itemBySku(product.sku);

        await expect(card).toBeVisible();

        await expect(card.getByText(product.title)).toBeVisible();

        await expect(card.getByText(product.sku)).toBeVisible();

        await expect(card.getByText(product.description)).toBeVisible();

        await expect(
            card.getByText(new RegExp(`${product.price}\\s*THB`))
        ).toBeVisible();

        await expect(this.addToCartButtonOf(card)).toBeVisible();
    }

    async expectAllProductsMatchMock(list: ProductMock[]) {
        for (const p of list) {
            await this.expectProductCardMatchesMock(p);
        }
    }

    pageIndicator(pageNo: number): Locator {
        return this.page
            .locator("div")
            .filter({ hasText: new RegExp(`Page\\s+${pageNo}\\s+of`, "i") })
            .nth(1);
    }

    nextPageButton(): Locator {
        return this.topController.getByTestId("next-page-button");
    }

    prevPageButton(): Locator {
        return this.topController.getByTestId("prev-page-button");
    }

    async expectOnPage(pageNo: number) {
        await expect(this.pageIndicator(pageNo)).toBeVisible();
    }

    async goToNextPageAndWait(targetPageNo: number) {
        await this.nextPageButton().click();
        await this.page.waitForLoadState("networkidle");
        await this.expectOnPage(targetPageNo);
    }

    async goToPrevPageAndWait(targetPageNo: number) {
        await this.prevPageButton().click();
        await this.page.waitForLoadState("networkidle");
        await this.expectOnPage(targetPageNo);
    }

    async openMenu() {
        await expect(this.menu).toBeVisible();
        await this.menu.click();
    }

    async clickLogout() {
        await this.openMenu();
        await expect(
            this.page.getByRole("link", { name: "Log Out" })
        ).toBeVisible();
        await this.page.getByRole("link", { name: "Log Out" }).click();
    }

    async expectAtLoginPage() {
        await expect(
            this.page.getByText("ODT x merchandise Login")
        ).toBeVisible();
        await expect(this.page.getByTestId("login-form")).toBeVisible();
    }
}
