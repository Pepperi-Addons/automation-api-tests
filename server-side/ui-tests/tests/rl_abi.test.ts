import promised from 'chai-as-promised';
// import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import { WebAppLoginPage, WebAppHomePage, WebAppHeader } from '../pom';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import { ResourceListABI } from '../pom/addons/ResourceListABI';

chai.use(promised);

export async function ResourceListAbiTests(email: string, password: string) {
    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let resourceListABI: ResourceListABI;

    describe('Resource List ABI UI tests', async () => {
        before(async function () {
            driver = await Browser.initiateChrome();
            webAppLoginPage = new WebAppLoginPage(driver);
            webAppHomePage = new WebAppHomePage(driver);
            webAppHeader = new WebAppHeader(driver);
            resourceListABI = new ResourceListABI(driver);
        });

        after(async function () {
            await driver.quit();
        });

        it('Login', async () => {
            await webAppLoginPage.login(email, password);
        });

        it('Entering Resource List ABI tests Addon', async () => {
            await webAppHeader.goHome();
            await webAppHomePage.isSpinnerDone();
            driver.sleep(2 * 1000);
            await webAppHomePage.clickOnBtn('Resource List ABI');
            await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_container, 15000);
            await resourceListABI.waitTillVisible(resourceListABI.TestsAddon_dropdownElement, 15000);
            resourceListABI.pause(2 * 1000);
            const dropdownTitle = await (
                await driver.findElement(resourceListABI.TestsAddon_dropdownTitle)
            ).getAttribute('title');
            expect(dropdownTitle).to.contain('Select List Data');
        });

        describe('List Content Tests', async () => {
            afterEach(async function () {
                driver.sleep(0.5 * 1000);
                await webAppHomePage.collectEndTestData(this);
                driver.refresh();
            });

            it('Entering Default Selected List', async () => {
                await resourceListABI.clickElement('TestsAddon_openABI_button');
                await resourceListABI.isSpinnerDone();
                await resourceListABI.waitTillVisible(resourceListABI.ListAbi_container, 15000);
                const listAbiTitle = await (
                    await driver.findElement(resourceListABI.ListAbi_title)
                ).getAttribute('title');
                expect(listAbiTitle.trim()).to.equal('Items Basic');
                const listAbiResultsNumber = await (
                    await driver.findElement(resourceListABI.ListAbi_results_number)
                ).getText();
                expect(Number(listAbiResultsNumber.trim())).to.equal(78);
                resourceListABI.pause(10 * 1000);
            });

            it('Choosing List Data and Opening the Dialog', async () => {
                const listToSelect = 'Accounts View - Basic';
                await resourceListABI.selectDropBoxByString(resourceListABI.TestsAddon_dropdownElement, listToSelect);
                await resourceListABI.isSpinnerDone();
                await resourceListABI.clickElement('TestsAddon_openABI_button');
                await resourceListABI.isSpinnerDone();
                const listAbiTitle = await (
                    await driver.findElement(resourceListABI.ListAbi_title)
                ).getAttribute('title');
                expect(listAbiTitle.trim()).to.equal('Accounts Basic');
                const listAbiResultsNumber = await (
                    await driver.findElement(resourceListABI.ListAbi_results_number)
                ).getText();
                expect(Number(listAbiResultsNumber.trim())).to.equal(4);
                resourceListABI.pause(10 * 1000);
            });
        });
    });
}
