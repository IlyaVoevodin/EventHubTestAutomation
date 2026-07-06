class APiUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
            {
                data: this.loginPayLoad
            })
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;

    }

}
module.exports = { APiUtils };




