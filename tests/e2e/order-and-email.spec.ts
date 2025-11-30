import { test } from "../fixtures/custom-test";
import { StorePage } from "../pages/StorePage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { MailpitPage } from "../pages/MailpitPage";

test.describe("End-to-End: Order + Email confirmation", () => {
    let store: StorePage;
    let cart: CartPage;
    let checkout: CheckoutPage;
    let mailpit: MailpitPage;

    test.beforeEach(async ({ page, loginPage: _loginPage }) => {
        store = new StorePage(page);
        cart = new CartPage(page);
        checkout = new CheckoutPage(page);
        mailpit = new MailpitPage(page);
    });

    test("User places an order and receives confirmation email", async ({
        page,
    }) => {
        await store.gotoProducts();
        await store.addToCartByIndex(0);
        await store.addToCartByIndex(1);
        await store.addToCartByIndex(3);

        await cart.openCart();
        await cart.proceedToCheckout();

        await checkout.expectOnCheckoutPage();

        await checkout.fillForm({
            firstName: "Geeky",
            lastName: "Base",
            email: "testOfGift@mailinator.com",
            zip: "12345",
        });

        await checkout.submit();
        await checkout.expectSuccess();

        await mailpit.goto();
        await mailpit.expectLoaded();

        await mailpit.expectOrderEmailVisible("testOfGift@mailinator.com");

        await mailpit.openOrderEmail("testOfGift@mailinator.com");
    });
});
