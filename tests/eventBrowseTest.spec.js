import { test, expect, request } from '@playwright/test';
const { PO_Manager } = require("../page_objects/PO_Manager");
const { APiUtils } = require('../utils/APiUtils');

const dataset = JSON.parse(JSON.stringify(require("../test_data/userTestData.json")));
const searchDataset = JSON.parse(JSON.stringify(require("../test_data/eventSearchTestData.json")));

for (const data of dataset) {
    test.describe("Event Browsing", () => {
        let token;
        test.beforeAll(async () => {
            const apiContext = await request.newContext();
            const loginPayLoad = { email: data.username, password: data.password };
            const apiUtils = new APiUtils(apiContext, loginPayLoad);
            token = await apiUtils.getToken();
        })


        test('@Events_Browse - View Upcoming Events', async ({ page }) => {

            await page.addInitScript(value => {
                window.localStorage.setItem('eventhub_token', value);
            }, token);

            const poManager = new PO_Manager(page);
            const dashBoardPage = poManager.getDashBoardPage();
            await dashBoardPage.gotoDashboard();

            await expect(dashBoardPage.featuredEventsHeading).toBeVisible();
            await expect(dashBoardPage.eventCards.first()).toBeVisible();
            await dashBoardPage.eventCards.first().getByRole('link', { name: 'Book Now' }).click();
            const checkoutPage = poManager.getCheckoutPage();
            await expect(checkoutPage.bookTicketsHeader).toBeVisible();
            await expect(checkoutPage.eventHeader).toBeVisible();

            let content = await checkoutPage.eventInfo.allTextContents();

            await Promise.all(content.map((text) => {
                expect(text != null && text != undefined).toBeTruthy();
                console.log("Event Info: " + text);
            }));

        });

        test('@Events_Browse - Search and Filter Events', async ({ page }) => {

            await page.addInitScript(value => {
                window.localStorage.setItem('eventhub_token', value);
            }, token);

            const poManager = new PO_Manager(page);
            const eventsPage = poManager.getEventsPage();
            await eventsPage.gotoEventsPage();
            for (let searchData of searchDataset) {
                let eventsCount = await eventsPage.searchAndFilterEvents(searchData.eventTypedName, searchData.eventFullName, searchData.eventType, searchData.eventLocation);
                if (eventsCount > 0) {

                    await expect(eventsPage.eventCards.filter({ hasText: searchData.eventTypedName })).toBeVisible();
                    await expect(eventsPage.eventCards.filter({ hasText: searchData.eventType })).toBeVisible();
                }
                else {
                    await expect(eventsPage.noEventsFoundHeading).toBeVisible();
                }

            }
        });
    });
}