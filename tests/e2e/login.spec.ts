import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Functionality", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test("TC001: customer1 can login successfully", async () => {
        await loginPage.login("customer1", "password");

        await loginPage.expectLoginSuccess();
    });

    test("TC002: customer2 can login successfully", async () => {
        await loginPage.login("customer2", "password");
        await loginPage.expectLoginSuccess();
    });

    test("TC003: login fails with invalid username", async () => {
        await loginPage.goto(); 
        await loginPage.fillUsername("invaliduser");
        await loginPage.fillPassword("password");

        await loginPage.submit();

        await loginPage.expectInvalidCredentialError();
    });

    test("TC004: login fails with invalid password", async () => {
        await loginPage.goto();
        await loginPage.fillUsername("customer1");
        await loginPage.fillPassword("wrongpassword");

        await loginPage.submit();

        await loginPage.expectInvalidCredentialError();
    });

    test("TC005: login fails with empty credentials", async () => {
        await loginPage.goto();
        await loginPage.submit();

        await loginPage.expectValidationError();
    });
});
