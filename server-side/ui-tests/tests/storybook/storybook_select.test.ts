import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Select } from '../../pom/Pages/StorybookComponents/Select';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookSelectTests() {
    const selectInputs = [
        'label',
        'options',
        'disabled',
        'mandatory',
        'readonly',
        'showTitle',
        'type',
        'value',
        'xAlignment',
    ];
    const selectOutputs = ['valueChange'];
    const selectSubFoldersHeaders = [
        'With initial value',
        'Multi-select',
        'Multi-select with initial value',
        'Disabled',
    ];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let select: Select;
    let selectInputsTitles;
    let selectOutputsTitles;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Select" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            select = new Select(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Select Component * Initial Testing', () => {
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
            it(`Enter ** Select ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('select');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Select ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await select.doesSelectComponentFound();
                selectInputsTitles = await select.getInputsTitles();
                console.info('selectInputsTitles:', JSON.stringify(selectInputsTitles, null, 2));
                selectOutputsTitles = await select.getOutputsTitles();
                console.info('selectOutputsTitles:', JSON.stringify(selectOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(selectInputsTitles).to.eql(selectInputs);
                expect(selectOutputsTitles).to.eql(selectOutputs);
                driver.sleep(5 * 1000);
            });
        });
        selectInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await select.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(select.Inputs_mainTableRow);
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
                            expect(selectInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'options':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('options')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'readonly':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('readonly')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('xAlignment')).to.be.true;
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
                            // const currentAlign = await select.getTxtAlignmentByComponent('select');
                            await driver.click(select.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: select with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // expect(currentAlign).to.include('left'); // need to find another way of validating this
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshots)`, async function () {
                                const alignment = allAlignments[index];
                                await alignment.click();
                                const currentAlign = await select.getTxtAlignmentByComponent('select');
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (xAlignment) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(currentAlign).to.include(title);
                                await driver.click(select.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: select with x-alignment = '${title}'`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        selectOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await select.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(selectOutputsTitles.includes('valueChange')).to.be.true;
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
            selectSubFoldersHeaders.forEach(async (header, index) => {
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
