const { Builder, until } = require('selenium-webdriver');
const assert = require('assert');
const PageLogin = require('../../pages/page_login');

describe('Automation Test for SauceDemo', function () {
    this.timeout(30000);

    let driver;

    async function login() {
        await driver.get('https://www.saucedemo.com');
        await PageLogin.login(driver, 'standard_user', 'secret_sauce');
        await driver.wait(until.urlContains('inventory'), 5000);
    }

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    it('1. Sukses Login', async () => {
        await login();
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes('inventory'));
    });

    it('2. Urutkan Produk berdasarkan Nama (A-Z)', async () => {
        // Sudah login dari test sebelumnya, tidak perlu login ulang
        const dropdown = await driver.findElement({ className: 'product_sort_container' });
        const optionAZ = await dropdown.findElement({ css: 'option[value="az"]' });
        await optionAZ.click();

        await driver.sleep(1000); // tunggu sorting selesai

        const firstProduct = await driver.findElement({ className: 'inventory_item_name' }).getText();
        console.log('Produk pertama (A-Z):', firstProduct);

        assert.strictEqual(firstProduct, 'Sauce Labs Backpack');
    });

    it('3. Urutkan Produk berdasarkan Harga (low to high)', async () => {
        const dropdown = await driver.findElement({ className: 'product_sort_container' });
        const optionLowToHigh = await dropdown.findElement({ css: 'option[value="lohi"]' });
        await optionLowToHigh.click();

        await driver.sleep(1000); // beri waktu sorting selesai

        const priceElements = await driver.findElements({ className: 'inventory_item_price' });
        const prices = [];

        for (let el of priceElements) {
            const text = await el.getText(); // "$7.99"
            const value = parseFloat(text.replace('$', ''));
            prices.push(value);
        }

        console.log('Harga produk:', prices);

        const sorted = [...prices].sort((a, b) => a - b);
        assert.deepStrictEqual(prices, sorted, 'Produk tidak terurut dari harga termurah');
    });
});
