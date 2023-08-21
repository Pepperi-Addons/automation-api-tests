import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../pom/Pages/StorybookComponents/ColorPicker';
import { WebElement } from 'selenium-webdriver';

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
    const typeExpectedValues = ['any', 'main', 'success', 'caution'];
    const alignExpectedValues = ['center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let colorPicker: ColorPicker;
    let colorPickerInputsTitles;
    let colorPickerOutputsTitles;
    let storyHeaderSelector;
    let allTypes: WebElement[] = [];
    let allAlignments: WebElement[] = [];

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
            it(`Overview Test of ** ColorPicker ** Component - ASSERTIONS`, async function () {
                await colorPicker.doesColorPickerComponentFound();
                colorPickerInputsTitles = await colorPicker.getInputsTitles();
                console.info('colorPickerInputsTitles:', JSON.stringify(colorPickerInputsTitles, null, 2));
                colorPickerOutputsTitles = await colorPicker.getOutputsTitles();
                console.info('colorPickerOutputsTitles:', JSON.stringify(colorPickerOutputsTitles, null, 2));
                expect(colorPickerInputsTitles).to.eql(colorPickerInputs);
                expect(colorPickerOutputsTitles).to.eql(colorPickerOutputs);
                driver.sleep(5 * 1000);
            });
            it('* ColorPicker Component * Initial Functional Test - SCREENSHOT', async function () {
                await colorPicker.openComonentModal();
                const base64ImageComponentModal = await driver.saveScreenshots();
                addContext(this, {
                    title: `Presented Component Modal`,
                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                });
                const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                expect(isComponentModalFullyShown).to.be.true;
                await colorPicker.okModal();
            });
        });
        colorPickerInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'label':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('label')).to.be.true;
                        });
                        it(`Functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabel(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await colorPicker.getLabel();
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('disabled')).to.be.true;
                        });
                        it(`Functional test (+screenshot)`, async function () {
                            await storyBookPage.inputs.toggleDissableComponent();
                            const isPenIconFound = await colorPicker.isPenIconFound();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(isPenIconFound).to.equal(false);
                            await storyBookPage.elemntDoNotExist(colorPicker.MainExampleColorEditButton);
                            await storyBookPage.inputs.toggleDissableComponent();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        break;

                    case 'showAAComplient':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('showAAComplient')).to.be.true;
                        });
                        // it(`Functional test (+screenshot)`, async function () {});
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('showTitle')).to.be.true;
                        });
                        it(`Functional test (+screenshot)`, async function () {
                            await storyBookPage.inputs.toggleShowTitle();
                            const labelAfterDisabelingTitle = await colorPicker.getLabel();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Show Title Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(labelAfterDisabelingTitle).to.equal('Type is main'); // once there is no title - the next title is the one 'taken'
                            await storyBookPage.inputs.toggleShowTitle();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Show Title Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        break;

                    case 'type':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('type')).to.be.true;
                        });
                        it(`get all types`, async function () {
                            allTypes = await storyBookPage.inputs.getAllTypes();
                        });
                        typeExpectedValues.forEach((title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                const isComponentModalFullyShown = await colorPicker.testComponentModal();
                                driver.sleep(1 * 1000);
                                const base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(isComponentModalFullyShown).to.be.true;
                            });
                        });
                        it(`close`, async function () {
                            await allTypes[0].click();
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('value')).to.be.true;
                        });
                        it(`Functional test (+screenshot)`, async function () {
                            await storyBookPage.inputs.setColorValue('#1fbeb9');
                            const currentColor = await colorPicker.getComponentColor();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentColor).to.equal('(31, 190, 185)'); // same as "#1fbeb9" in RGB
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(colorPickerInputs.includes('xAlignment')).to.be.true;
                        });
                        it(`get all xAlignments`, async function () {
                            const currentAlign = await colorPicker.getTxtAlignmentByComponent('color-picker');
                            expect(currentAlign).to.include('left');
                            allAlignments = (await storyBookPage.inputs.getAllAlignments()).slice(5);
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const alignment = allAlignments[index];
                                await alignment.click();
                                const currentAlign = await colorPicker.getTxtAlignmentByComponent('color-picker');
                                const base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (xAlignment) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(currentAlign).to.include(title);
                            });
                        });
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
