class BookingsPage {
    constructor(page) {
        this.page = page;
        this.myBookingsHeader = page.getByRole('heading', { name: 'My Bookings' });
    }
}
module.exports = { BookingsPage };
