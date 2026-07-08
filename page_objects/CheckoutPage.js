class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.bookTicketsHeader = page.getByRole('heading', { name: 'Book Tickets' });
        this.eventHeader = page.locator("h1");
        this.eventInfo = page.locator('.text-sm.text-sm.text-gray-800.font-medium');
        this.userName = page.getByRole('textbox', { name: 'Full Name*' });
        this.userEmail = page.getByRole('textbox', { name: 'Email*' });
        this.userPhone = page.getByRole('textbox', { name: 'Phone Number*' });
        this.confirmBookingBtn = page.getByRole('button', { name: 'Confirm Booking' });
        this.bookingConfirmationHeading = page.getByRole('heading', { name: /Booking Confirmed!/i });
        this.viewBookingsBtn = page.getByRole('button', { name: 'View My Bookings' });
        this.bookingRef = page.locator('.booking-ref');
        
    }

    async fillUserDetailsAndGetRef(name, email, phone) {
        await this.userName.fill(name);
        await this.userEmail.fill(email);
        await this.userPhone.fill(phone);
        await this.confirmBookingBtn.click();
        return await this.bookingRef.innerText();
    }

    
}
module.exports = { CheckoutPage };
