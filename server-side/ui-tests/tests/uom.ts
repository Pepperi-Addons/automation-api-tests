import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom/index';

export async function UomTests(email: string, password: string) {
    let driver: Browser;

    describe('Basic UI Tests Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.quit();
        });

        it('Login', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);
        });
    });
}

//to-do first phase
//uom + cpi node are installed 
//item creation using API
//UOM types creation using API
//ATD creation -> field seteup (allowed values + item config)
//ATD attachment to homescreen