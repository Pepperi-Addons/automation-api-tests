import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function NgxLibPOC() {
    // const storybook_homeURL = 'https://www.chromatic.com/library?appId=60ae3e9eff8e4c003b2f90d4&branch=master';
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;

    describe('NGX_LIB POC Tests Suit', function () {
        describe('Border Radius Component Testing', async () => {
            // const driver: Browser = await Browser.initiateChrome();
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
                webAppHomePage = new WebAppHomePage(driver);
                storyBookPage = new StoryBookPage(driver);
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Enter Story Book Site & Choose Latest Master Build`, async function () {
                //1. navigate to story book webstite
                await storyBookPage.navigate();
                //1.1. choose the latest build
                await storyBookPage.chooseLatestBuild();
                //1.2. document on which build were running
                const base64ImageBuild = await driver.saveScreenshots();
                addContext(this, {
                    title: `Were Running On This Build Of StoryBook`,
                    value: 'data:image/png;base64,' + base64ImageBuild,
                });
            });
            it(`2. Enter Table Of Contents of Storybook`, async function () {
                //2. enter table of contents through "View Storybook" button
                await storyBookPage.enterTableOfContents();
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`5. Enter Border-Radius Abstract StoryBook`, async function () {
                // Navigate to Storybook Home Page
                // await driver.navigate(storybook_homeURL);
                // await driver.switchToDefaultContent
                // await storyBookPage.isSpinnerDone();
                //5. choose a component by name
                await storyBookPage.chooseAbstract('border-radius');
                let base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                await driver.click(storyBookPage.CanvasTab);
                driver.sleep(1 * 1000);
                await driver.switchTo(storyBookPage.StorybookIframe);
                await driver.untilIsVisible(storyBookPage.BorderRadiusContainer);
                await driver.untilIsVisible(storyBookPage.BorderRadiusInnerContainer);
                const borderRadiusSM_element = await driver.findElement(storyBookPage.BorderRadiusSM);
                const borderRadiusMD_element = await driver.findElement(storyBookPage.BorderRadiusMD);
                const borderRadiusL_element = await driver.findElement(storyBookPage.BorderRadiusL);
                const borderRadiusXL_element = await driver.findElement(storyBookPage.BorderRadiusXL);
                const borderRadiusXL_color = await borderRadiusXL_element.getCssValue('color');
                const borderRadiusSM_border_radius = await borderRadiusSM_element.getCssValue('border-radius');
                const borderRadiusMD_border_radius = await borderRadiusMD_element.getCssValue('border-radius');
                const borderRadiusL_border_radius = await borderRadiusL_element.getCssValue('border-radius');
                const borderRadiusXL_border_radius = await borderRadiusXL_element.getCssValue('border-radius');
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                console.info('borderRadiusXL_color: ', JSON.stringify(borderRadiusXL_color, null, 2));
                console.info('borderRadiusSM_border_radius: ', JSON.stringify(borderRadiusSM_border_radius, null, 2));
                console.info('borderRadiusMD_border_radius: ', JSON.stringify(borderRadiusMD_border_radius, null, 2));
                console.info('borderRadiusL_border_radius: ', JSON.stringify(borderRadiusL_border_radius, null, 2));
                console.info('borderRadiusXL_border_radius: ', JSON.stringify(borderRadiusXL_border_radius, null, 2));
                // debugger
            });
        });
    });
}
