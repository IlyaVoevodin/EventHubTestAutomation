class NavBarComponent {
    constructor(page) {
        this.page = page;
        this.homeLink = page.getByTestId('nav-home');
        this.eventsLink = page.getByTestId('nav-events');
        this.myBookingsLink = page.getByTestId('nav-bookings');
        this.ApiDocsLink = page.getByText('API Docs');
        this.adminBtn= page.getByText('Admin');
        this.manageEventsLink = page.locator('a').filter({ hasText: 'Manage Events' }).first();
        this.manageBookingsLink = page.getByRole('link', { name: 'Manage Bookings' });
        this.userEmailDisplay = page.getByTestId('user-email-display');
        this.logoutBtn = page.getByTestId('logout-btn');
        this.navBarTitle = page.getByText('EventHub', { exact: true });
    }
}
module.exports = { NavBarComponent };