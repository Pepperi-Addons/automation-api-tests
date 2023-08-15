import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../pom/Pages/StorybookComponents/ColorPicker';

chai.use(promised);

export async function StorybookColorPickerTests() {
    const colorPickerInputs = ['label', 'disabled', 'showAAComplient', 'showTitle', 'type', 'value', 'xAlignment'];
    const colorPickerOutputs = ['valueChange'];
    const colorPickerSubFoldersHeaders = [
        'Type is main',
        'Type is success',
        'Type is caution',
        "Isn't AA compliant",
        'Set stating color',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let colorPicker: ColorPicker;
    let colorPickerInputsTitles;
    let colorPickerOutputsTitles;
    let storyHeaderSelector;

    describe('Storybook "ColorPicker" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            colorPicker = new ColorPicker(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* ColorPicker Component * Initial Testing', () => {
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
            it(`Enter ** ColorPicker ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('color-picker');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** ColorPicker ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await colorPicker.doesColorPickerComponentFound();
                colorPickerInputsTitles = await colorPicker.getInputsTitles();
                console.info('colorPickerInputsTitles:', JSON.stringify(colorPickerInputsTitles, null, 2));
                colorPickerOutputsTitles = await colorPicker.getOutputsTitles();
                console.info('colorPickerOutputsTitles:', JSON.stringify(colorPickerOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(colorPickerInputsTitles).to.eql(colorPickerInputs);
                expect(colorPickerOutputsTitles).to.eql(colorPickerOutputs);
                driver.sleep(5 * 1000);
            });
        });
        colorPickerInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showAAComplient':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('showAAComplient')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('type')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(colorPickerInputs.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        colorPickerOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(colorPickerOutputsTitles.includes('valueChange')).to.be.true;
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
            colorPickerSubFoldersHeaders.forEach(async (header, index) => {
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
                        storyHeaderSelector = await storyBookPage.getStorySelectorByText(index + 2, headerText);
                        const storyHeader = await (await driver.findElement(storyHeaderSelector)).getText();
                        expect(storyHeader.trim()).equals(header);
                    });
                    it(`validate color-picker story (+screenshot)`, async function () {
                        const storyEditButtonSelector = await colorPicker.getStoryEditButtonSelector(
                            storyHeaderSelector,
                        );
                        await storyBookPage.click(storyEditButtonSelector);
                        const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                        expect(isComponentModalFullyShown).to.be.true;
                        switch (header) {
                            case 'Type is main':
                                break;
                            case 'Type is success':
                                break;
                            case 'Type is caution':
                                break;
                            case 'Set stating color':
                                break;
                            case "Isn't AA compliant":
                                break;

                            default:
                                throw new Error(`Header: "${header}" is not covered in switch!`);
                            // break;
                        }
                        const story64ImageComponent = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Story Modal As Presented In StoryBook`,
                            value: 'data:image/png;base64,' + story64ImageComponent,
                        });
                        await colorPicker.okModal();
                    });
                });
            });
        });
    });
}
