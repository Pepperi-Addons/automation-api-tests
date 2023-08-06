import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { QuantitySelector } from '../pom/Pages/StorybookComponents/QuantitySelector';

chai.use(promised);

export async function StorybookQuantitySelectorTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let quantitySelector: QuantitySelector;

    describe('Storybook "QuantitySelector" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            quantitySelector = new QuantitySelector(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* QuantitySelector * Component Testing', () => {
            afterEach(async function () {
                await webAppHomePage.collectEndTestData(this);
            });

            it(`Enter Story Book Site & Choose Latest Master Build`, async function () {
                await storyBookPage.navigate();
                await storyBookPage.chooseLatestBuild();
                const base64ImageBuild = await driver.saveScreenshots();
                addContext(this, {
                    title: `Were Running On This Build Of StoryBook`,
                    value: 'data:image/png;base64,' + base64ImageBuild,
                });
            });
            it(`Enter Table Of Contents of Storybook`, async function () {
                await storyBookPage.enterTableOfContents();
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Enter ** QuantitySelector ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('quantity-selec');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** QuantitySelector ** Component`, async function () {
                await quantitySelector.doesQuantitySelectorComponentFound();
                const quantitySelectorInputsTitles = await quantitySelector.getInputsTitles();
                console.info('quantitySelectorInputsTitles:', JSON.stringify(quantitySelectorInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(quantitySelectorInputsTitles).to.eql([
                    'label',
                    'value',
                    'allowDecimal',
                    'disabled',
                    'mandatory',
                    'readonly',
                    'showTitle',
                    'styleType',
                    'textColor',
                    'visible',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
