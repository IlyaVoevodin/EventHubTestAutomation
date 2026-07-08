import { request } from '@playwright/test';
import { test, expect } from '../fixtures/fixtures';
const { APiUtils } = require('../utils/APiUtils');

const dataset = JSON.parse(JSON.stringify(require("../test_data/userLoginTestData.json")));
const createEventDataset = JSON.parse(JSON.stringify(require("../test_data/createEventTestData.json")));

for (const data of dataset) {
    test.describe.serial("Event management", () => {
        let token;
        test.beforeAll(async () => {
            const apiContext = await request.newContext();
            const loginPayLoad = { email: data.username, password: data.password };
            const apiUtils = new APiUtils(apiContext, loginPayLoad);
            token = await apiUtils.getToken();
        })


        test('@Events_Managment - Create new event', async ({ poManager}) => {

            await poManager.page.addInitScript(value => {
                window.localStorage.setItem('eventhub_token', value);
            }, token);

            const manageEventsPage = poManager.getManageEventsPage();
            await manageEventsPage.gotoManageEvents();

            for (let data of createEventDataset) {
                await manageEventsPage.createEvent(
                    data.eventTitle,
                    data.description,
                    data.category,
                    data.city,
                    data.venue,
                    data.price,
                    data.totalSeats,
                    data.imageUrl,
                    data.eventDateTime
                );

                await expect(manageEventsPage.eventCreatedPopup).toBeVisible();
            }
        });

        test('@Events_Managment - Delete event', async ({ poManager}) => {

            await poManager.page.addInitScript(value => {
                window.localStorage.setItem('eventhub_token', value);
            }, token);

            const manageEventsPage = poManager.getManageEventsPage();
            await manageEventsPage.gotoManageEvents();
            for (let data of createEventDataset) {
                let result = await manageEventsPage.deleteEvent(data.eventTitle);
                if (result !== 0) {
                    await expect(manageEventsPage.evenDeletedPopup).toBeVisible();
                }
            }
        });
    });
}