const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

describe('Automation Test for SauceDemo', function () {
    this.timeout(30000); // beri waktu cukup untuk test async

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    it('Sukses Login', async () => {
        await driver.get('https://www.saucedemo.com');

        // Masukkan username & password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');

        // Klik Login
        await driver.findElement(By.id('login-button')).click();

        // Tunggu sampai redirect ke halaman inventory
        await driver.wait(until.urlContains('inventory'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes('inventory'));
    });

    it('Urutkan Produk dari A-Z', async () => {
        // Pilih dropdown urutan produk (Name A to Z)
        const sortSelect = await driver.findElement(By.className('product_sort_container'));
        await sortSelect.sendKeys('Name (A to Z)', Key.RETURN);

        // Ambil nama produk pertama & cek urutan
        const firstProduct = await driver.findElement(By.className('inventory_item_name')).getText();
        assert.strictEqual(firstProduct, 'Sauce Labs Backpack'); // item pertama berdasarkan sort A-Z
    });
});
