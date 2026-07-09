class BookingsPage {
    constructor(page) {
        this.page = page;
        this.myBookingsHeader = page.getByRole('heading', { name: 'My Bookings' });
        this.bookedEventCards = page.getByTestId('booking-card');
        this.checkEligibilityForRefundBtn = page.getByTestId('check-refund-btn');
        this.refundSpinner = page.locator("#refund-spinner");
        this.refundResult = page.getByTestId('refund-result');
        this.confirmCancelBooking = page.getByTestId('confirm-dialog-yes');
        this.cancelSuccessPopup = page.getByText('Booking cancelled successfully');
    }

    async checkEligibilityForRefund(bookingRef) {
        await this.bookedEventCards.filter({ hasText: bookingRef }).getByRole('button', { name: 'View Details' }).click();
        await this.checkEligibilityForRefundBtn.click();
    }

    async cancelBookingByBookingRef(bookingRef) {
        await this.bookedEventCards.filter({ hasText: bookingRef }).getByRole('button', { name: 'Cancel Booking' }).click();
        await this.confirmCancelBooking.click();
    }
}
module.exports = { BookingsPage };
