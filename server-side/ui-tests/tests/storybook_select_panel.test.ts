import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { SelectPanel } from '../pom/Pages/StorybookComponents/SelectPanel';

chai.use(promised);

export async function StorybookSelectPanelTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let selectPanel: SelectPanel;

    describe('Storybook "SelectPanel" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            selectPanel = new SelectPanel(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* SelectPanel * Component Testing', () => {
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
            it(`Enter ** SelectPanel ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('select-panel');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** SelectPanel ** Component`, async function () {
                await selectPanel.doesSelectPanelComponentFound();
                const selectPanelInputsTitles = await selectPanel.getInputsTitles();
                console.info('selectPanelInputsTitles:', JSON.stringify(selectPanelInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(selectPanelInputsTitles).to.eql([
                    'label',
                    'value',
                    'options',
                    'isMultiSelect',
                    'classNames',
                    'disabled',
                    'mandatory',
                    'numOfCol',
                    'showTitle',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
