import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Menu } from '../pom/Pages/StorybookComponents/Menu';

chai.use(promised);

export async function StorybookMenuTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let menu: Menu;

    describe('Storybook "Menu" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            menu = new Menu(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Menu * Component Testing', () => {
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
            it(`Enter ** Menu ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('menu');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Menu ** Component`, async function () {
                await menu.doesMenuComponentFound();
                const menuInputsTitles = await menu.getInputsTitles();
                console.info('menuInputsTitles:', JSON.stringify(menuInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(menuInputsTitles).to.eql([
                    'iconName',
                    'items',
                    'classNames',
                    'disabled',
                    'selectedItem',
                    'sizeType',
                    'styleType',
                    'text',
                    'type',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
