import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { RichHtmlTextarea } from '../pom/Pages/StorybookComponents/RichHtmlTextarea';

chai.use(promised);

export async function StorybookRichHtmlTextareaTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let richHtmlTextarea: RichHtmlTextarea;

    describe('Storybook "RichHtmlTextarea" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            richHtmlTextarea = new RichHtmlTextarea(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* RichHtmlTextarea * Component Testing', () => {
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
            it(`Enter ** RichHtmlTextarea ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('rich-html-textarea');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** RichHtmlTextarea ** Component`, async function () {
                await richHtmlTextarea.doesRichHtmlTextareaComponentFound();
                const richHtmlTextareaInputsTitles = await richHtmlTextarea.getInputsTitles();
                console.info('richHtmlTextareaInputsTitles:', JSON.stringify(richHtmlTextareaInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(richHtmlTextareaInputsTitles).to.eql([
                    'label',
                    'rowSpan',
                    'value',
                    'disabled',
                    'inlineMode',
                    'mandatory',
                    'maxFieldCharacters',
                    'showTitle',
                    'visible',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
