import { test, expect } from "../fixtures/custom-test";
import { StorePage } from "../pages/StorePage";
import { CartPage } from "../pages/CartPage";
import { productsMock } from "../data/products.mock";

test.describe("Shopping Cart Management", () => {
    let store: StorePage;
    let cart: CartPage;

    test.beforeEach(async ({ page, loginPage: _loginPage }) => {
        store = new StorePage(page);
        cart = new CartPage(page);
    });

    test(
        "User adds a product to the cart successfully",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC006: User can add product to cart",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.expectHeaderCartCount(1);

            await cart.openCart();
            await cart.expectItemCount(1);
        }
    );

    test(
        "Store displays all available products correctly",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC006.1: Store displays full product list from mock",
                },
            ],
        },
        async () => {
            await store.gotoProducts();

            const count = await store.items().count();
            expect(count).toBeGreaterThan(0);

            await store.expectAllProductsMatchMock(productsMock);
        }
    );

    test(
        "User navigates between product pages",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC006.2: User can navigate between product pages",
                },
            ],
        },
        async () => {
            await store.gotoProducts();

            await store.expectOnPage(1);
            await store.goToNextPageAndWait(2);
            await store.goToPrevPageAndWait(1);
        }
    );

    test(
        "User logs out through the store menu",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC006.3: User can log out using store menu",
                },
            ],
        },
        async () => {
            await store.gotoProducts();

            await store.clickLogout();

            await store.expectAtLoginPage();
        }
    );

    test(
        "User updates product quantity inside the cart",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC007: User can update product quantity in cart",
                },
            ],
        },
        async () => {
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
        }
    );

    test(
        "User removes a product from the cart",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC008: User can remove product from cart",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.remove(0);

            await cart.expectHeaderCartCount(0);
            await cart.expectEmpty();
            await cart.expectHeaderCartCount(0);
        }
    );

    test(
        "User sees proper empty cart UI",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC009: Empty cart UI displays correctly",
                },
            ],
        },
        async () => {
            await cart.expectHeaderCartCount(0);
            await cart.openCart();
            await cart.expectEmpty();
        }
    );

    test(
        "User adds multiple products to the cart",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC010: User can add multiple products to cart",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);
            await store.addToCartByIndex(1);

            await cart.expectHeaderCartCount(2);

            await cart.openCart();
            await cart.expectItemCount(2);
        }
    );
});
