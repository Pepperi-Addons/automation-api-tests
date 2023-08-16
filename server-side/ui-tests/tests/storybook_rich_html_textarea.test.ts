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
    const richHtmlTextareaInputs = [
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
    ];
    const richHtmlTextareaOutputs = ['valueChange'];
    const richHtmlTextareaSubFoldersHeaders = [
        'Read only',
        'Editable',
        'Empty',
        'Inline, no content',
        'Inline, with content',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let richHtmlTextarea: RichHtmlTextarea;
    let richHtmlTextareaInputsTitles;
    let richHtmlTextareaOutputsTitles;

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

        describe('* RichHtmlTextarea Component * Initial Testing', () => {
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
            it(`Enter ** RichHtmlTextarea ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('rich-html-textarea');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** RichHtmlTextarea ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await richHtmlTextarea.doesRichHtmlTextareaComponentFound();
                richHtmlTextareaInputsTitles = await richHtmlTextarea.getInputsTitles();
                console.info('richHtmlTextareaInputsTitles:', JSON.stringify(richHtmlTextareaInputsTitles, null, 2));
                richHtmlTextareaOutputsTitles = await richHtmlTextarea.getOutputsTitles();
                console.info('richHtmlTextareaOutputsTitles:', JSON.stringify(richHtmlTextareaOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(richHtmlTextareaInputsTitles).to.eql(richHtmlTextareaInputs);
                expect(richHtmlTextareaOutputsTitles).to.eql(richHtmlTextareaOutputs);
                driver.sleep(5 * 1000);
            });
        });
        richHtmlTextareaInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'rowSpan':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'inlineMode':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('inlineMode')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'maxFieldCharacters':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'visible':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('visible')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        richHtmlTextareaOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(richHtmlTextareaOutputsTitles.includes('valueChange')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            richHtmlTextareaSubFoldersHeaders.forEach(async (header, index) => {
                describe(`"${header}"`, async function () {
                    it(`Navigate to story (Screenshot)`, async function () {
                        await driver.switchToDefaultContent();
                        await storyBookPage.chooseSubFolder(`--story-${index + 2}`);
                        driver.sleep(0.1 * 1000);
                        const base64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Story: '${header}'`,
                            value: 'data:image/png;base64,' + base64ImageComponent,
                        });
                    });
                    it(`validate story header`, async function () {
                        await driver.switchTo(storyBookPage.StorybookIframe);
                        const headerText = header
                            .toLowerCase()
                            .replace(/\s/g, '-')
                            .replace(/[^a-z0-9]/gi, '-'); // replacing white spaces and non-alfabetic characters with '-'
                        console.info('at validate story header -> headerText: ', headerText);
                        const storyHeaderSelector = await storyBookPage.getStorySelectorByText(index + 2, headerText);
                        const storyHeader = await (await driver.findElement(storyHeaderSelector)).getText();
                        expect(storyHeader.trim()).equals(header);
                    });
                    // TODO: add tests
                    // it(`it '${header}'`, async function () { });
                });
            });
        });
    });
}
