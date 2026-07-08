class BookingsPage {
    constructor(page) {
        this.page = page;
        this.myBookingsHeader = page.getByRole('heading', { name: 'My Bookings' });
        this.bookedEventCards = page.getByTestId('booking-card');
        this.checkEligibilityForRefundBtn = page.getByTestId('check-refund-btn');
        this.refundSpinner = page.locator("#refund-spinner");
        this.refundResult = page.getByTestId('refund-result');
    }

    async checkEligibilityForRefund(bookingRef) {
        await this.bookedEventCards.filter({ hasText: bookingRef }).getByRole('button', { name: 'View Details' }).click();
        await this.checkEligibilityForRefundBtn.click();
    }
}
module.exports = { BookingsPage };
