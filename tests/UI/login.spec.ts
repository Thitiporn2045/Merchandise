import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Functionality", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test(
        "User logs in successfully with customer1 credentials",
        {
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC001: Login successfully with valid customer1 credentials",
                },
            ],
        },
        async () => {
            await loginPage.login("customer1", "password");
            await loginPage.expectLoginSuccess();
        }
    );

    test(
        "User logs in successfully with customer2 credentials",
        {
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC002: Login successfully with valid customer2 credentials",
                },
            ],
        },
        async () => {
            await loginPage.login("customer2", "password");
            await loginPage.expectLoginSuccess();
        }
    );

    test(
        "User cannot log in using an invalid username",
        {
            annotation: [
                {
                    type: "test-id",
                    description: "TC003: Login fails with invalid username",
                },
            ],
        },
        async () => {
            await loginPage.goto();
            await loginPage.fillUsername("invaliduser");
            await loginPage.fillPassword("password");
            await loginPage.submit();
            await loginPage.expectInvalidCredentialError();
        }
    );

    test(
        "User cannot log in using an incorrect password",
        {
            annotation: [
                {
                    type: "test-id",
                    description: "TC004: Login fails with wrong password",
                },
            ],
        },
        async () => {
            await loginPage.goto();
            await loginPage.fillUsername("customer1");
            await loginPage.fillPassword("wrongpassword");
            await loginPage.submit();
            await loginPage.expectInvalidCredentialError();
        }
    );

    test(
        "User cannot log in when submitting empty credentials",
        {
            annotation: [
                {
                    type: "test-id",
                    description:
                        "TC005: Login fails with empty username and password",
                },
            ],
        },
        async () => {
            await loginPage.goto();
            await loginPage.submit();
            await loginPage.expectValidationError();
        }
    );
});
