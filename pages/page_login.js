const { By } = require('selenium-webdriver');

class PageLogin {
     static inputUsername = By.id('user-name');
    static inputPassword = By.id('password');
    static buttonLogin = By.id('login-button');

    static async login(driver, username, password) {
        await driver.findElement(this.inputUsername).sendKeys(username);
        await driver.findElement(this.inputPassword).sendKeys(password);
        await driver.findElement(this.buttonLogin).click();
    }
}

module.exports = PageLogin;
