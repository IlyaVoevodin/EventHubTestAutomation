class APiUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
        this.token = null;
    }

    async getToken() {
        if (this.token) {
            return this.token;
        }

        const loginResponse = await this.apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
            {
                data: this.loginPayLoad
            });
        const loginResponseJson = await loginResponse.json();
        this.token = loginResponseJson.token;
        return this.token;
    }

    async setAuthToken(page) {
        const token = await this.getToken();
        await page.addInitScript(value => {
            window.localStorage.setItem('eventhub_token', value);
        }, token);
        return token;
    }

}
module.exports = { APiUtils };




