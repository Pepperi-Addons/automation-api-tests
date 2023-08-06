import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { GroupButtons } from '../pom/Pages/StorybookComponents/GroupButtons';

chai.use(promised);

export async function StorybookGroupButtonsTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let groupButtons: GroupButtons;

    describe('Storybook "GroupButtons" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            groupButtons = new GroupButtons(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* GroupButtons * Component Testing', () => {
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
            it(`Enter ** GroupButtons ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('group-buttons');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** GroupButtons ** Component`, async function () {
                await groupButtons.doesGroupButtonsComponentFound();
                const groupButtonsInputsTitles = await groupButtons.getInputsTitles();
                console.info('groupButtonsInputsTitles:', JSON.stringify(groupButtonsInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(groupButtonsInputsTitles).to.eql([
                    'rowSpan',
                    'label',
                    'src',
                    'disabled',
                    'mandatory',
                    'showTitle',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
