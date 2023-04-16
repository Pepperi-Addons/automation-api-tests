import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../pom/Pages/Components/ColorPicker';

chai.use(promised);

export async function NgxLibPOC(client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    // #endregion Upgrade survey dependencies

    describe('NGX_LIB POC Tests Suit', async function () {

        describe('Configuring Survey', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`Color Picker Testing`, async function () {
                const storyBookPage = new StoryBookPage(driver);
                //1. navigate to story book webstite
                await storyBookPage.navigate();
                //2. choose the latest build 
                await storyBookPage.chooseLatestBuild();
                //2.1. document on which build were running
                const base64ImageBuild = await driver.saveScreenshots();
                addContext(this, {
                    title: `Were Running On This Build Of StoryBook`,
                    value: 'data:image/png;base64,' + base64ImageBuild,
                });
                //3. choose a component by name
                await storyBookPage.chooseComponent("color-picker");
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                //4. test component
                //4.1. is shown
                const colorPicker = new ColorPicker(driver);
                const isComponentFound = await colorPicker.isComponentFound();
                expect(isComponentFound).to.equal(true);
                //4.2. can be opened and present correct modal
                await colorPicker.openComonentModal();
                const base64ImageComponentModal = await driver.saveScreenshots();
                addContext(this, {
                    title: `Presented Component Modal`,
                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                });
                const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                expect(isComponentModalFullyShown).to.equal(true);
                await colorPicker.okModal();
                //4.3. can change label
                //4.4. can disable
                //4.5. can AACompilent on/off
            });
        });
    });
}

