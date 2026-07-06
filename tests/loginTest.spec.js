import { test, expect } from '@playwright/test';
const { PO_Manager } = require("../page_objects/PO_Manager");

const dataset = JSON.parse(JSON.stringify(require("../test_data/userTestData.json")));

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

for (const data of dataset) {
    test.describe("Authentication", () => {

        test('@Login - Happy Path', async ({ page }) => {
            const poManager = new PO_Manager(page);
            const loginPage = poManager.getLoginPage();
            await loginPage.gotoLogin();
            await loginPage.validLogin(data.username, data.password);

            const dashBoardPage = poManager.getDashBoardPage();
            await expect(dashBoardPage.browseEventsBtn).toBeVisible();
            await expect(dashBoardPage.navBar.userEmailDisplay).toBeVisible();
            const localStorageToken = dashBoardPage.getLocalStorageToken();
            await expect(localStorageToken).toBeTruthy();
            await dashBoardPage.navBar.myBookingsLink.click();
            const myBookingsPage = poManager.getBookingsPage();
            await expect(myBookingsPage.myBookingsHeader).toBeVisible();
        });

        test('@Login - Invalid Password', async ({ page }) => {
            const poManager = new PO_Manager(page);
            const loginPage = poManager.getLoginPage();
            await loginPage.gotoLogin();
            await loginPage.validLogin(data.username, data.password + "123");
            await expect(loginPage.invalidPasswordPopUp).toBeVisible();
            const localStorageToken = await loginPage.getLocalStorageToken();
            await expect(localStorageToken).toBeNull();
        });

        test('@Login - Invalid Email', async ({ page }) => {
            const poManager = new PO_Manager(page);
            const loginPage = poManager.getLoginPage();
            await loginPage.gotoLogin();
            await loginPage.validLogin("123", data.password);
            await expect(loginPage.invalidEmailMessage).toBeVisible();
            const localStorageToken = await loginPage.getLocalStorageToken();
            await expect(localStorageToken).toBeNull();
        });
    });
}