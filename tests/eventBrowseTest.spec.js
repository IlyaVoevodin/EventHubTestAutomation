import { request } from '@playwright/test';
import { test, expect } from '../fixtures/fixtures';
const { APiUtils } = require('../utils/APiUtils');

const dataset = JSON.parse(JSON.stringify(require("../test_data/userLoginTestData.json")));
const searchDataset = JSON.parse(JSON.stringify(require("../test_data/eventSearchTestData.json")));

for (const data of dataset) {
    test.describe("Event Browsing", () => {
        let token;
        let apiUtils;

        test.beforeAll(async () => {
            const apiContext = await request.newContext();
            const loginPayLoad = { email: data.username, password: data.password };
            apiUtils = new APiUtils(apiContext, loginPayLoad);
            token = await apiUtils.getToken();
        });

        test.beforeEach(async ({ poManager }) => {
            await apiUtils.setAuthToken(poManager.page);
        });

        test('@Events_Browse - View Upcoming Events', async ({ poManager }) => {
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

        test('@Events_Browse - Search and Filter Events', async ({ poManager }) => {
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