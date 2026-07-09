import { test, expect } from '../fixtures/fixtures';

const userDataset = JSON.parse(JSON.stringify(require("../test_data/userLoginTestData.json")));
const checkoutDataset = JSON.parse(JSON.stringify(require("../test_data/userCheckoutData.json")));
const searchDataset = JSON.parse(JSON.stringify(require("../test_data/eventSearchTestData.json")));

for (const user of userDataset) {
    test.describe("E2E tests", () => {
        test('@E2E - User books event and checks refund eligibility', async ({ poManager }) => {
            const loginPage = poManager.getLoginPage();
            await loginPage.gotoLogin();
            await loginPage.validLogin(user.username, user.password);

            const dashBoardPage = poManager.getDashBoardPage();
            await expect(dashBoardPage.browseEventsBtn).toBeVisible();
            await dashBoardPage.browseEventsBtn.click();

            const eventsPage = poManager.getEventsPage();
            await expect(eventsPage.eventCards.first()).toBeVisible();
            for (const checkoutData of checkoutDataset) {
                await expect(eventsPage.eventCards.filter({ hasText: checkoutData.eventName }).first()).toBeVisible();
                await eventsPage.eventCards.filter({ hasText: checkoutData.eventName }).first().getByRole('link', { name: 'Book Now' }).click();

                const checkoutPage = poManager.getCheckoutPage();
                await expect(checkoutPage.bookTicketsHeader).toBeVisible();
                await expect(checkoutPage.eventHeader).toBeVisible();
                const bookingRef = await checkoutPage.fillUserDetailsAndGetRef(checkoutData.userName, checkoutData.userEmail, checkoutData.userPhone);
                await expect(checkoutPage.bookingConfirmationHeading).toBeVisible();
                await checkoutPage.viewBookingsBtn.click();

                const myBookingsPage = poManager.getBookingsPage();
                await expect(myBookingsPage.myBookingsHeader).toBeVisible();
                await expect(myBookingsPage.bookedEventCards.filter({ hasText: bookingRef }).first()).toBeVisible();
                await myBookingsPage.checkEligibilityForRefund(bookingRef);
                await expect(myBookingsPage.refundSpinner).toBeVisible();
                await expect(myBookingsPage.refundSpinner).toBeHidden({ timeout: 6000 });
                await expect(myBookingsPage.refundResult).toBeVisible();
                await expect(myBookingsPage.refundResult).toContainText('Eligible for refund');
                await expect(myBookingsPage.refundResult).toContainText('Single-ticket bookings qualify for a full refund');
            }

        });

        test('@E2E - User searches for event, books and cancels booking', async ({ poManager }) => {
            const loginPage = poManager.getLoginPage();
            await loginPage.gotoLogin();
            await loginPage.validLogin(user.username, user.password);

            const dashBoardPage = poManager.getDashBoardPage();
            await expect(dashBoardPage.browseEventsBtn).toBeVisible();
            await dashBoardPage.browseEventsBtn.click();

            const eventsPage = poManager.getEventsPage();
            await expect(eventsPage.eventCards.first()).toBeVisible();
            for (const searchData of searchDataset) {
                const resultsCount = await eventsPage.searchAndFilterEvents(searchData.eventTypedName, searchData.eventFullName, searchData.eventType, searchData.eventLocation);
                if (resultsCount > 0) {
                    for (const checkoutData of checkoutDataset) {
                        await expect(eventsPage.eventCards.filter({ hasText: searchData.eventFullName }).first()).toBeVisible();
                        await eventsPage.eventCards.filter({ hasText: searchData.eventFullName }).first().getByRole('link', { name: 'Book Now' }).click();

                        const checkoutPage = poManager.getCheckoutPage();
                        await expect(checkoutPage.bookTicketsHeader).toBeVisible();
                        await expect(checkoutPage.eventHeader).toBeVisible();
                        const bookingRef = await checkoutPage.fillUserDetailsAndGetRef(checkoutData.userName, checkoutData.userEmail, checkoutData.userPhone);
                        await expect(checkoutPage.bookingConfirmationHeading).toBeVisible();
                        await checkoutPage.viewBookingsBtn.click();

                        const myBookingsPage = poManager.getBookingsPage();
                        await expect(myBookingsPage.myBookingsHeader).toBeVisible();
                        await expect(myBookingsPage.bookedEventCards.filter({ hasText: bookingRef }).first()).toBeVisible();
                        await myBookingsPage.cancelBookingByBookingRef(bookingRef);
                        await expect(myBookingsPage.bookedEventCards.filter({ hasText: bookingRef }).first()).toBeHidden();
                        await expect(myBookingsPage.cancelSuccessPopup).toBeVisible();
                        await eventsPage.gotoEventsPage(); // Navigate back to the events page for the next iteration
                    }
                }
                else {
                    await expect(eventsPage.noEventsFoundHeading).toBeVisible();
                }
            }

        });
    });
}