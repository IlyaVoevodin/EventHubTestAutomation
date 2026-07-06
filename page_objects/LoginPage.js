class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.userName = page.getByPlaceholder('you@email.com');
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.invalidPasswordPopUp = page.getByText('Invalid email or password');
        this.invalidEmailMessage = page.getByText('Enter a valid email');
    }

    async validLogin(email, password) {
        await this.userName.fill(email);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    async gotoLogin()
    {
        await this.page.goto("/login");
    }

    async getLocalStorageToken()
    {
        return await this.page.evaluate(() => {
            return window.localStorage.getItem('eventhub_token');
        });
    }
}
module.exports =  {LoginPage};
   