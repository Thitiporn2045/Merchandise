import { expect, test } from "../fixtures/custom-test";
import { StorePage } from "../pages/StorePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("Checkout Form Validation", () => {
    let store: StorePage;
    let cart: CartPage;
    let checkout: CheckoutPage;

    test.beforeEach(async ({ page, loginPage: _loginPage }) => {
        store = new StorePage(page);
        cart = new CartPage(page);
        checkout = new CheckoutPage(page);
    });

    test(
        "User completes checkout successfully with valid information",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC011: Checkout with valid information",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.expectOnCheckoutPage();

            await checkout.fillForm({
                firstName: "Geeky",
                lastName: "Base",
                email: "test@mailinator.com",
                zip: "12345",
            });

            await checkout.submit();
            await checkout.expectSuccess();
        }
    );

    test(
        "User receives validation error when using unsupported email domain",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC012: Checkout with invalid email domain",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "Code",
                lastName: "Gift",
                email: "test@gmail.com",
                zip: "54321",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain(
                "We support only email address with domain mailinator.com."
            );
        }
    );

    test(
        "User receives validation error for zip code with incorrect digit length",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC013: Checkout with invalid zip format",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "Code",
                lastName: "Gift",
                email: "test@mailinator.com",
                zip: "543",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain(
                "We support only 5 digits zip code."
            );
        }
    );

    test(
        "User receives validation errors when submitting checkout with empty fields",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC014: Checkout with empty required fields",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain("First name is required.");
        }
    );

    test(
        "User receives validation error when last name is missing during checkout",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC014-1: Checkout with empty required fields",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "firstName",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain("Last name is required.");
        }
    );

    test(
        "User receives validation error when email is missing during checkout",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC014-2: Checkout with empty required fields",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "firstName",
                lastName: "lastName",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain("Email address is required.");
        }
    );

    test(
        "User receives validation error when zip code is missing during checkout",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description: "TC014-4: Checkout with empty required fields",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "firstName",
                lastName: "lastName",
                email: "test@mailinator.com",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain("Zip code is required.");
        }
    );

    test(
        "User receives validation error when zip code contains letters",
        {
            tag: [],
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC015: Checkout with zip code containing letters",
                },
            ],
        },
        async () => {
            await store.gotoProducts();
            await store.addToCartByIndex(0);

            await cart.openCart();
            await cart.proceedToCheckout();

            await checkout.fillForm({
                firstName: "Sarah",
                lastName: "Williams",
                email: "sarah@mailinator.com",
                zip: "12A45",
            });

            await checkout.submit();

            const errorMessage = await checkout.getErrorMessageText();
            expect(errorMessage).toContain(
                "We support only 5 digits zip code."
            );
        }
    );
});
