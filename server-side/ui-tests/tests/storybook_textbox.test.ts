import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Textbox } from '../pom/Pages/StorybookComponents/Textbox';

chai.use(promised);

export async function StorybookTextboxTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let textbox: Textbox;

    describe('Storybook "Textbox" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            textbox = new Textbox(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Textbox * Component Testing', () => {
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
            it(`Enter ** Textbox ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('textbox');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Textbox ** Component`, async function () {
                await textbox.doesTextboxComponentFound();
                const textboxInputsTitles = await textbox.getInputsTitles();
                console.info('textboxInputsTitles:', JSON.stringify(textboxInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(textboxInputsTitles).to.eql([
                    'label',
                    'value',
                    'disabled',
                    'mandatory',
                    'maxFieldCharacters',
                    'regex',
                    'regexError',
                    'renderError',
                    'renderSymbol',
                    'renderTitle',
                    'showTitle',
                    'textColor',
                    'type',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
