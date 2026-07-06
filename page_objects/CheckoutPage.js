class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.bookTicketsHeader = page.getByRole('heading', { name: 'Book Tickets' });
        this.eventHeader = page.locator("h1");
        this.eventInfo = page.locator('.text-sm.text-sm.text-gray-800.font-medium');
        
    }
}
module.exports = { CheckoutPage };
