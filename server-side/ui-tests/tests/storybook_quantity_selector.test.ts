import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { QuantitySelector } from '../pom/Pages/StorybookComponents/QuantitySelector';

chai.use(promised);

export async function StorybookQuantitySelectorTests() {
    const quantitySelectorInputs = [
        'label',
        'value',
        'allowDecimal',
        'disabled',
        'mandatory',
        'readonly',
        'showTitle',
        'styleType',
        'textColor',
        'visible',
        'xAlignment',
    ];
    const quantitySelectorOutputs = ['elementClick', 'valueChange'];
    const quantitySelectorSubFoldersHeaders = ['Twist and shake', 'Shake and twist'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let quantitySelector: QuantitySelector;
    let quantitySelectorInputsTitles;
    let quantitySelectorOutputsTitles;

    describe('Storybook "QuantitySelector" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            quantitySelector = new QuantitySelector(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* QuantitySelector Component * Initial Testing', () => {
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
            it(`Enter ** QuantitySelector ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('quantity-selector');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** QuantitySelector ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await quantitySelector.doesQuantitySelectorComponentFound();
                quantitySelectorInputsTitles = await quantitySelector.getInputsTitles();
                console.info('quantitySelectorInputsTitles:', JSON.stringify(quantitySelectorInputsTitles, null, 2));
                quantitySelectorOutputsTitles = await quantitySelector.getOutputsTitles();
                console.info('quantitySelectorOutputsTitles:', JSON.stringify(quantitySelectorOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(quantitySelectorInputsTitles).to.eql(quantitySelectorInputs);
                expect(quantitySelectorOutputsTitles).to.eql(quantitySelectorOutputs);
                driver.sleep(5 * 1000);
            });
        });
        quantitySelectorInputs.forEach(async (input) => {
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
                    const inputsMainTableRowElement = await driver.findElement(quantitySelector.Inputs_mainTableRow);
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
                            expect(quantitySelectorInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'allowDecimal':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('allowDecimal')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('styleType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'textColor':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('textColor')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'visible':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('visible')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(quantitySelectorInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        quantitySelectorOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'elementClick':
                        it(`it '${output}'`, async function () {
                            expect(quantitySelectorOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(quantitySelectorOutputsTitles.includes('valueChange')).to.be.true;
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
            quantitySelectorSubFoldersHeaders.forEach(async (header, index) => {
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
