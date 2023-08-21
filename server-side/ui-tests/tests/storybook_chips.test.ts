import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Chips } from '../pom/Pages/StorybookComponents/Chips';

chai.use(promised);

export async function StorybookChipsTests() {
    const chipsInputs = [
        'label',
        'chips',
        'classNames',
        'disabled',
        'inline',
        'mandatory',
        'orientation',
        'placeholder',
        'renderTitle',
        'showTitle',
        'styleType',
        'type',
        'xAlignment',
    ];
    const chipsOutputs = ['fieldClick', 'selectionChange'];
    const chipsMethods = ['addChipsToList'];
    const chipsSubFoldersHeaders = [
        'Without content',
        'With content',
        'Inline is true',
        'Type is select',
        'Orientation is vertical',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let chips: Chips;
    let chipsInputsTitles;
    let chipsOutputsTitles;
    let chipsMethodsTitles;

    describe('Storybook "Chips" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            chips = new Chips(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Chips Component * Initial Testing', () => {
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
            it(`Enter ** Chips ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('chips');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Chips ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await chips.doesChipsComponentFound();
                chipsInputsTitles = await chips.getInputsTitles();
                console.info('chipsInputsTitles:', JSON.stringify(chipsInputsTitles, null, 2));
                chipsOutputsTitles = await chips.getOutputsTitles();
                console.info('chipsOutputsTitles:', JSON.stringify(chipsOutputsTitles, null, 2));
                chipsMethodsTitles = await chips.getMethodsTitles();
                console.info('chipsMethodsTitles:', JSON.stringify(chipsMethodsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(chipsInputsTitles).to.eql(chipsInputs);
                expect(chipsOutputsTitles).to.eql(chipsOutputs);
                expect(chipsMethodsTitles).to.eql(chipsMethods);
                driver.sleep(5 * 1000);
            });
        });
        chipsInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
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
                    const inputsMainTableRowElement = await driver.findElement(chips.Inputs_mainTableRow);
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
                            expect(chipsInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'chips':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('chips')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'classNames':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('classNames')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'inline':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('inline')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'orientation':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('orientation')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'placeholder':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('placeholder')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('styleType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        chipsOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'fieldClick':
                        it(`it '${output}'`, async function () {
                            expect(chipsOutputsTitles.includes('fieldClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'selectionChange':
                        it(`it '${output}'`, async function () {
                            expect(chipsOutputsTitles.includes('selectionChange')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
        chipsMethods.forEach(async (method) => {
            describe(`METHOD: '${method}'`, async function () {
                switch (method) {
                    case 'addChipsToList':
                        it(`it '${method}'`, async function () {
                            expect(chipsMethodsTitles.includes('addChipsToList')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Method: "${method}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            chipsSubFoldersHeaders.forEach(async (header, index) => {
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
                    // it(`it '${header}'`, async function () {
                    // let headerText = '';
                    // switch (header) {
                    //     case 'Without content':
                    //     case 'With content':
                    //         headerText = header.toLowerCase().replace(' ', '-');
                    //         break;
                    //     case 'Inline is true':
                    //     case 'Type is select':
                    //     case 'Orientation is vertical':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                    //         break;

                    //     default:
                    //         throw new Error(`Header: "${header}" is not covered in switch!`);
                    //         // break;
                    // }

                    // });
                });
            });
        });
    });
}
