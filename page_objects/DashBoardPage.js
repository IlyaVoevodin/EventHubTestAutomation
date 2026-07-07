const {NavBarComponent} = require("./components/NavBarComponent");

class DashBoardPage {
    constructor(page) {
        this.page = page;
        this.navBar = new NavBarComponent(page);
        this.browseEventsBtn = page.getByText('Browse Events →');
        this.myBookingsBtn = page.getByRole('button', { name: 'My Bookings' });
        this.exploreAllEventsBtn = page.getByRole('button', { name: 'Explore All Events' });
        this.featuredEventsHeading = page.getByRole('heading', { name: 'Featured Events' });
        this.eventCards = page.getByTestId('event-card');
    }

    async gotoDashboard() {
        await this.page.goto("/");
    }

    async getLocalStorageToken()
    {
        return await this.page.evaluate(() => {
            return window.localStorage.getItem('eventhub_token');
        });
    }

}
module.exports = { DashBoardPage };
