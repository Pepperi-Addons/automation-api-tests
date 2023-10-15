import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { RichHtmlTextarea } from '../../pom/Pages/StorybookComponents/RichHtmlTextarea';
import { WebElement } from 'selenium-webdriver';

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
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let richHtmlTextarea: RichHtmlTextarea;
    let richHtmlTextareaInputsTitles;
    let richHtmlTextareaOutputsTitles;
    let allAlignments: WebElement[] = [];

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await richHtmlTextarea.getInputRowSelectorByName(input));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it(`switch to iframe`, async function () {
                    try {
                        await driver.findElement(storyBookPage.StorybookIframe, 5000);
                        await driver.switchTo(storyBookPage.StorybookIframe);
                    } catch (error) {
                        console.error(error);
                        console.info('ALREADY ON IFRAME');
                    }
                });
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(richHtmlTextarea.Inputs_mainTableRow);
                    if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                        await inputsMainTableRowElement.click();
                    }
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
                        it(`get all xAlignments`, async function () {
                            allAlignments = await storyBookPage.inputs.getAllxAlignments();
                            driver.sleep(1 * 1000);
                        });
                        it(`validate current xAlignment is "left"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `[xAlignment = 'left']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // const currentAlign = await richHtmlTextarea.getTxtAlignmentByComponent('richHtmlTextarea');
                            await driver.click(richHtmlTextarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: richHtmlTextarea with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // expect(currentAlign).to.include('left'); // need to find another way of validating this
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await richHtmlTextarea.getTxtAlignmentByComponent(
                                        'rich-html-textarea',
                                    );
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(richHtmlTextarea.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: richHtmlTextarea with x-alignment = '${title}'`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                });
                            }
                        });
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        richHtmlTextareaOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await richHtmlTextarea.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
