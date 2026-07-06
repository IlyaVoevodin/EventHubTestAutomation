const { NavBarComponent } = require('./components/NavBarComponent');

class EventsPage {
    constructor(page) {
        this.page = page;
        this.navBar = new NavBarComponent(page);
        this.eventCards = page.getByTestId('event-card');
        this.eventTypeDropdown = page.getByRole('combobox').nth(0);
        this.eventLocationDropdown = page.getByRole('combobox').nth(1);
        this.eventSearchBox = page.getByRole('textbox');
        this.noEventsFoundHeading = page.getByRole('heading', { name: 'No events found' });
    }

    async gotoEventsPage() {
        await this.page.goto('/events');
    }

     async searchAndFilterEvents(eventTypedName, eventFullName, eventType, eventLocation) {
        await this.eventTypeDropdown.selectOption(eventType);
        await this.eventLocationDropdown.selectOption(eventLocation);
        await this.eventSearchBox.fill(eventTypedName);
        await this.page.waitForTimeout(2000); // Wait for 2 seconds to allow the page to update
        return await this.eventCards.filter({ hasText: eventFullName }).count();
    }
}
module.exports = { EventsPage };
