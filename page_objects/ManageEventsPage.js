class ManageEventsPage {
    constructor(page) {
        this.page = page;
        this.eventTitle = page.getByPlaceholder("Event title");
        this.eventDescription = page.getByRole('textbox', { name: 'Describe the event…' });
        this.category = page.getByLabel('Category*');
        this.city = page.getByRole('textbox', { name: 'City*' });
        this.venue = page.getByRole('textbox', { name: 'Venue*' });
        this.price = page.getByRole('spinbutton', { name: 'Price ($)*' });
        this.totalSeats = page.getByRole('spinbutton', { name: 'Total Seats*' });
        this.imageUrl = page.getByRole('textbox', { name: 'Image URL (optional)' });
        this.eventDateTime = page.getByLabel('Event Date & Time');
        this.addEventButton = page.getByTestId('add-event-btn');
        this.eventTableRows = page.getByTestId('event-table-row');
        this.deleteConfirmButton = page.getByRole('button', { name: 'Delete event' });
        this.eventCreatedPopup = page.getByText("Event created!");
        this.evenDeletedPopup = page.getByText('Event deleted');
    }

    async gotoManageEvents() {
        await this.page.goto('/admin/events');
    }

    async createEvent(eventTitle, description, category, city, venue, price, totalSeats, imageUrl, eventDateTime) {
        await this.eventTitle.fill(eventTitle);
        await this.eventDescription.fill(description);
        await this.category.selectOption(category);
        await this.city.fill(city);
        await this.venue.fill(venue);
        await this.price.fill(price);
        await this.totalSeats.fill(totalSeats);
        await this.imageUrl.fill(imageUrl);
        await this.eventDateTime.fill(eventDateTime);
        await this.addEventButton.click();
    }

    async deleteEvent(eventTitle) {
        const eventRow = this.eventTableRows.filter({ hasText: eventTitle });
        if (await eventRow.count() !== 0) {
            await eventRow.getByRole('button', { name: 'Delete' }).click();
            await this.deleteConfirmButton.click();
        }
        else {
            return 0;
        }
    }
}
module.exports = { ManageEventsPage };