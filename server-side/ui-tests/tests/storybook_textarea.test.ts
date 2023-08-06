import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Textarea } from '../pom/Pages/StorybookComponents/Textarea';

chai.use(promised);

export async function StorybookTextareaTests() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let textarea: Textarea;

    describe('Storybook "Textarea" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            textarea = new Textarea(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Textarea * Component Testing', () => {
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
            it(`Enter ** Textarea ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('textarea');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Textarea ** Component`, async function () {
                await textarea.doesTextareaComponentFound();
                const textareaInputsTitles = await textarea.getInputsTitles();
                console.info('textareaInputsTitles:', JSON.stringify(textareaInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(textareaInputsTitles).to.eql([
                    'rowSpan',
                    'label',
                    'value',
                    'disabled',
                    'mandatory',
                    'maxFieldCharacters',
                    'showTitle',
                    'textColor',
                    'visible',
                    'xAlignment',
                ]);
                driver.sleep(5 * 1000);
            });
        });
    });
}
