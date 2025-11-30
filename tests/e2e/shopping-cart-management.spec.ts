import { test, expect } from "../fixtures/custom-test";
import { StorePage } from "../pages/StorePage";
import { CartPage } from "../pages/CartPage";

test.describe("Shopping Cart Management", () => {
    let store: StorePage;
    let cart: CartPage;

    test.beforeEach(async ({ page, loginPage: _loginPage }) => {
        store = new StorePage(page);
        cart = new CartPage(page);
    });

    test("TC006: User can add product to cart", async () => {
        await store.gotoProducts();
        await store.addToCartByIndex(0);

        await cart.expectHeaderCartCount(1);

        await cart.openCart();
        await cart.expectItemCount(1);
    });

    test("TC007: User can update quantity in cart", async () => {
        await store.gotoProducts();
        await store.addToCartByIndex(0);
        await cart.expectHeaderCartCount(1);

        await cart.openCart();

        const before = await cart.getSubtotalText();
        await cart.changeQuantityTo(3);

        await cart.expectHeaderCartCount(3);
        await cart.expectSubtotalVisible();
        const after = await cart.getSubtotalText();

        expect(after).not.toBe(before);
    });

    test("TC008: User can remove product from cart", async () => {
        await store.gotoProducts();
        await store.addToCartByIndex(0);

        await cart.openCart();
        await cart.remove(0);

        await cart.expectHeaderCartCount(0);
        await cart.expectEmpty();
        await cart.expectHeaderCartCount(0);
    });

    test("TC009: User sees empty cart UI correctly", async () => {
        await cart.expectHeaderCartCount(0);
        await cart.openCart();
        await cart.expectEmpty();
    });

    test("TC010: User can add multiple products", async () => {
        await store.gotoProducts();
        await store.addToCartByIndex(0);
        await store.addToCartByIndex(1);

        await cart.expectHeaderCartCount(2);

        await cart.openCart();
        await cart.expectItemCount(2);
    });
});
