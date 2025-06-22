const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Automation Test for SauceDemo', function () {
    this.timeout(30000); // untuk test async

    let driver;

    async function login() {
        await driver.get('https://www.saucedemo.com');
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();
        await driver.wait(until.urlContains('inventory'), 5000);
    }

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    afterEach(async () => {
        try {
            await driver.findElement(By.id('react-burger-menu-btn')).click();
            await driver.wait(until.elementLocated(By.id('logout_sidebar_link')), 3000);
            await driver.findElement(By.id('logout_sidebar_link')).click();
        } catch (error) {}
    });

    it('Sukses Login', async () => {
        await login();
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes('inventory'));
    });

    it('Urutkan Produk dari A-Z', async () => {
        await login();

        // Temukan select dan klik langsung value="az"
        const sortSelect = await driver.findElement(By.className('product_sort_container'));
        const optionAZ = await sortSelect.findElement(By.css('option[value="az"]'));
        await optionAZ.click();

        // Tunggu agar sorting selesai
        await driver.sleep(1000);

        // Ambil nama produk pertama
        const firstProduct = await driver.findElement(By.className('inventory_item_name')).getText();
        console.log('Produk pertama:', firstProduct);
        assert.strictEqual(firstProduct, 'Sauce Labs Backpack');
    });
});