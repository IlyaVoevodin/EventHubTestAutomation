import { test as base, expect } from '@playwright/test';

const { PO_Manager } = require("../page_objects/PO_Manager");

export const test = base.extend({
    poManager: async ({ page }, use) => {
        await use(new PO_Manager(page));
    },
});

export { expect };
