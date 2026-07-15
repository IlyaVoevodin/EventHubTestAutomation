import { request } from '@playwright/test';
import { test, expect } from '../fixtures/fixtures';
const { APiUtils } = require('../utils/APiUtils');

const userDataset = JSON.parse(JSON.stringify(require("../test_data/userLoginTestData.json")));
const createEventDataset = JSON.parse(JSON.stringify(require("../test_data/createEventApiTestData.json")));
const createBookingDataset = JSON.parse(JSON.stringify(require("../test_data/createBookingApiTestData.json")));
const apiUrl = "https://api.eventhub.rahulshettyacademy.com/api";

const getAuthHeaders = (token) => ({
    Authorization: `Bearer ${token}`
});

const expectStatus = async (response, expectedStatus) => {
    expect(response.status()).toBe(expectedStatus);
    return response;
};

const expectJsonResponse = async (requestContext, method, url, expectedStatus, options = {}) => {
    const response = await requestContext[method](url, options);
    expect(response.status()).toBe(expectedStatus);
    return response.json();
};

for (const data of userDataset) {
    test.describe("API Tests", () => {
        let token;

        test.beforeAll(async () => {
            const apiContext = await request.newContext();
            const loginPayLoad = { email: data.username, password: data.password };
            const apiUtils = new APiUtils(apiContext, loginPayLoad);
            token = await apiUtils.getToken();
        });

        test('@API - Health and configuration endpoints', async ({ request }) => {
            const healthResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/health`, 200);
            expect(healthResponseBody.status).toBe('ok');

            const configResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/config`, 200);
            expect(configResponseBody.showExploreLinks).toBe(false);
        });

        test('@API - Authentication flow', async ({ request }) => {
            const authResponseBody = await expectJsonResponse(request, 'post', `${apiUrl}/auth/register`, 400, {
                data: {
                    email: data.username,
                    password: data.password
                }
            });
            expect(authResponseBody.error).toBe('Email already registered');

            const loginResponseBody = await expectJsonResponse(request, 'post', `${apiUrl}/auth/login`, 200, {
                data: {
                    email: data.username,
                    password: data.password
                }
            });
            expect(loginResponseBody.token).toBeTruthy();

            await expectStatus(await request.get(`${apiUrl}/auth/me`, {
                headers: getAuthHeaders(token)
            }), 200);

            await expectStatus(await request.get(`${apiUrl}/auth/me`), 401);
        });

        test('@API - Event API GET test', async ({ request }) => {
            const eventsListBody = await expectJsonResponse(request, 'get', `${apiUrl}/events`, 200, {
                headers: getAuthHeaders(token)
            });
            expect(eventsListBody.pagination.total).toBeGreaterThan(0);

            const validEventIdResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/events/${eventsListBody.data[0].id}`, 200, {
                headers: getAuthHeaders(token)
            });
            expect(validEventIdResponseBody.data.title).toBeDefined();

            const invalidEventIdResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/events/999`, 404, {
                headers: getAuthHeaders(token)
            });
            expect(invalidEventIdResponseBody.error).toBe("Event with id 999 not found");
        });

        test('@API - API Create/update/delete event', async ({ request }) => {
            const futureEventDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

            for (let eventData of createEventDataset) {
                const payload = {
                    ...eventData,
                    eventDate: futureEventDate
                };
                const createEventResponseBody = await expectJsonResponse(request, 'post', `${apiUrl}/events`, 201, {
                    headers: getAuthHeaders(token),
                    data: payload
                });
                const eventId = createEventResponseBody.data.id;
                expect(eventId).toBeDefined();

                const newPayload = {
                    ...eventData,
                    price: 1000,
                    eventDate: futureEventDate
                };
                await expectJsonResponse(request, 'put', `${apiUrl}/events/${eventId}`, 200, {
                    headers: getAuthHeaders(token),
                    data: newPayload
                });

                const checkChangedEventResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/events/${eventId}`, 200, {
                    headers: getAuthHeaders(token)
                });
                expect(parseInt(checkChangedEventResponseBody.data.price)).toBe(1000);

                await expectStatus(await request.delete(`${apiUrl}/events/${eventId}`, {
                    headers: getAuthHeaders(token)
                }), 200);

                await expectStatus(await request.get(`${apiUrl}/events/${eventId}`, {
                    headers: getAuthHeaders(token)
                }), 404);
            }
        });

        test('@API - API Bookings lifecycle', async ({ request }) => {
            const bookingsListBody = await expectJsonResponse(request, 'get', `${apiUrl}/bookings`, 200, {
                headers: getAuthHeaders(token)
            });

            if (bookingsListBody.data.length > 0) {
                expect(bookingsListBody.data).toBeDefined();
            } else {
                expect(bookingsListBody.pagination.total).toBe(0);
            }

            for (let bookingData of createBookingDataset) {
                const createBookingResponseBody = await expectJsonResponse(request, 'post', `${apiUrl}/bookings`, 201, {
                    headers: getAuthHeaders(token),
                    data: bookingData
                });
                const bookingId = createBookingResponseBody.data.id;
                const bookingRef = createBookingResponseBody.data.bookingRef;
                expect(bookingRef).toBeDefined();

                const getBookingsByRefResponseBody = await expectJsonResponse(request, 'get', `${apiUrl}/bookings/ref/${bookingRef}`, 200, {
                    headers: getAuthHeaders(token)
                });
                expect(createBookingResponseBody.data).toStrictEqual(getBookingsByRefResponseBody.data);

                await expectStatus(await request.delete(`${apiUrl}/bookings/${bookingId}`, {
                    headers: getAuthHeaders(token)
                }), 200);

                await expectStatus(await request.get(`${apiUrl}/bookings/${bookingId}`, {
                    headers: getAuthHeaders(token)
                }), 404);
            }
        });
    });
}
