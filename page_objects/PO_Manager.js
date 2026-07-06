const {LoginPage} = require("./LoginPage");
const {DashBoardPage} = require("./DashBoardPage");
const {EventsPage} = require("./EventsPage");
const {BookingsPage} = require("./BookingsPage");
const {CheckoutPage} = require("./CheckoutPage");
const {ManageEventsPage} = require("./ManageEventsPage");

class PO_Manager
{
    constructor(page)
    {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashBoardPage = new DashBoardPage(this.page);
        this.eventsPage = new EventsPage(this.page);
        this.bookingsPage = new BookingsPage(this.page);
        this.checkoutPage = new CheckoutPage(this.page);
        this.manageEventsPage = new ManageEventsPage(this.page);
    }

    getLoginPage()
    {
        return this.loginPage;
    }   

    getDashBoardPage()
    {
        return this.dashBoardPage;
    }

    getEventsPage()
    {
        return this.eventsPage;
    }

    getBookingsPage()
    {
        return this.bookingsPage;
    }

    getCheckoutPage()
    {
        return this.checkoutPage;
    }

    getManageEventsPage()
    {
        return this.manageEventsPage;
    }
}
module.exports = {PO_Manager};