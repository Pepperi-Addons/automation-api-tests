import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../../pom/Pages/StorybookComponents/ColorPicker';
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

        describe('* ColorPicker Component * Initial Testing - ***BUG: DI-25772 at "showAAComplient" input', () => {
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
            switch (input) {
                case 'showAAComplient': // to be removed when the bug is fixed
                    describe(`INPUT: '${input} - ***BUG: DI-25772'`, async function () {
                        it(`https://pepperi.atlassian.net/browse/DI-25772`, async function () {
                            // https://pepperi.atlassian.net/browse/DI-25772
                            expect(colorPickerInputs.includes('showAAComplient')).to.be.true;
                        });
                    });
                    break;

                default:
                    describe(`INPUT: '${input}'`, async function () {
                        it(`SCREENSHOT`, async function () {
                            await driver.click(await colorPicker.getInputRowSelectorByName(input));
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
                            const inputsMainTableRowElement = await driver.findElement(colorPicker.Inputs_mainTableRow);
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
                                it(`validate input`, async function () {
                                    expect(colorPickerInputs.includes('label')).to.be.true;
                                });
                                it(`Functional test (+screenshot)`, async function () {
                                    const newLabelToSet = 'Auto test';
                                    await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Label Input Change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const newLabelGotFromUi = await colorPicker.getMainExampleLabel('color-picker');
                                    expect(newLabelGotFromUi).to.equal(newLabelToSet);
                                });
                                break;

                            case 'disabled':
                                it(`validate input`, async function () {
                                    expect(colorPickerInputs.includes('disabled')).to.be.true;
                                });
                                it(`making sure current value is "False"`, async function () {
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disabled Input default value = "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(colorPicker.MainHeader);
                                    const mainExampleColorPicker = await driver.findElement(
                                        colorPicker.MainExampleColorPicker,
                                    );
                                    const mainExampleColorPickerDisabled = await mainExampleColorPicker.getAttribute(
                                        'class',
                                    );
                                    console.info(
                                        'mainExampleColorPickerDisabled (false): ',
                                        JSON.stringify(mainExampleColorPickerDisabled, null, 2),
                                    );
                                    expect(mainExampleColorPickerDisabled).to.not.include('disable');
                                });
                                it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleDisableControl();
                                    const isPenIconFound = await colorPicker.isPenIconFound();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disabled Input Changed to "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(colorPicker.MainHeader);
                                    const mainExampleColorPicker = await driver.findElement(
                                        colorPicker.MainExampleColorPicker,
                                    );
                                    const mainExampleColorPickerDisabled = await mainExampleColorPicker.getAttribute(
                                        'class',
                                    );
                                    console.info(
                                        'mainExampleColorPickerDisabled (true): ',
                                        JSON.stringify(mainExampleColorPickerDisabled, null, 2),
                                    );
                                    expect(mainExampleColorPickerDisabled).to.include('disable');
                                    expect(isPenIconFound).to.equal(false);
                                    await storyBookPage.elemntDoNotExist(colorPicker.MainExampleColorEditButton);
                                });
                                it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleDisableControl();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disable Input changed back to default value = "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(colorPicker.MainHeader);
                                    // const isPenIconFound = await colorPicker.isPenIconFound();
                                    const mainExampleColorPicker = await driver.findElement(
                                        colorPicker.MainExampleColorPicker,
                                    );
                                    const mainExampleColorPickerDisabled = await mainExampleColorPicker.getAttribute(
                                        'class',
                                    );
                                    expect(mainExampleColorPickerDisabled).to.not.include('disable');
                                    // expect(isPenIconFound).to.eventually.be.true;
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
                                    await storyBookPage.inputs.toggleShowTitleControl();
                                    const labelAfterDisabelingTitle = await colorPicker.getLabel();
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Show Title Input Change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(labelAfterDisabelingTitle).to.equal('Type is main'); // once there is no title - the next title is the one 'taken'
                                    await storyBookPage.inputs.toggleShowTitleControl();
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
                                    const base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `'${input}' input`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    allTypes = await storyBookPage.inputs.getAllTypeInputValues();
                                    driver.sleep(1 * 1000);
                                    console.info('allTypes length: ', allTypes.length);
                                    expect(allTypes.length).equals(typeExpectedValues.length);
                                });
                                it(`validate current type is "any"`, async function () {
                                    const colorPickerElement = await driver.findElement(
                                        colorPicker.MainExampleColorPicker,
                                    );
                                    const colorPickerElementType_style = await colorPickerElement.getAttribute('style');
                                    const colorPickerElementType_color = colorPickerElementType_style
                                        .split('background: ')[1]
                                        .split(';')[0];
                                    console.info('colorPickerElement: ', colorPickerElement);
                                    console.info('colorPickerElementType_style: ', colorPickerElementType_style);
                                    console.info('colorPickerElementType_color: ', colorPickerElementType_color);
                                    const base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `validating default`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    expect(colorPickerElementType_color).to.equal('transparent');
                                });
                                typeExpectedValues.forEach(async (title, index) => {
                                    it(`'${title}' -- functional test (+screenshot)`, async function () {
                                        const type = allTypes[index];
                                        await type.click();
                                        await colorPicker.openComonentModal();
                                        let base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Presented Component Modal`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                        const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                                        expect(isComponentModalFullyShown).to.be.true;
                                        await colorPicker.okModal();
                                        colorPicker.pause(1 * 1000);
                                        const mainExampleStyleValueGotFromUi =
                                            await colorPicker.getMainExampleColorPickerValue();
                                        let expectedColorPickerElementType_color;
                                        switch (title) {
                                            case 'any':
                                                expectedColorPickerElementType_color = 'rgb(118, 118, 118) !important';
                                                break;
                                            case 'main':
                                                expectedColorPickerElementType_color = 'rgb(13, 13, 13) !important';
                                                break;
                                            case 'success':
                                                expectedColorPickerElementType_color = 'rgb(73, 132, 44) !important';
                                                break;
                                            case 'caution':
                                                expectedColorPickerElementType_color = 'rgb(223, 32, 32) !important';
                                                break;

                                            default:
                                                throw new Error(`"${title}" is not covered in switch`);
                                            // break;
                                        }
                                        expect(mainExampleStyleValueGotFromUi).to.equal(
                                            expectedColorPickerElementType_color,
                                        );
                                        await driver.click(colorPicker.MainHeader);
                                        base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Upper View of '${title}' (Type Input)`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                    });
                                });
                                it(`back to default - validate type is "any"`, async function () {
                                    await driver.click(colorPicker.ResetControlsButton);
                                    const colorPickerElement = await driver.findElement(
                                        colorPicker.MainExampleColorPicker,
                                    );
                                    const colorPickerElementType_style = await colorPickerElement.getAttribute('style');
                                    const colorPickerElementType_color = colorPickerElementType_style
                                        .split('background: ')[1]
                                        .split(';')[0];
                                    console.info('colorPickerElement: ', colorPickerElement);
                                    console.info('colorPickerElementType_style: ', colorPickerElementType_style);
                                    console.info('colorPickerElementType_color: ', colorPickerElementType_color);
                                    const base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `back to default`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    expect(colorPickerElementType_color).to.equal('transparent');
                                });
                                break;

                            case 'value':
                                it(`validate input`, async function () {
                                    expect(colorPickerInputs.includes('value')).to.be.true;
                                });
                                it(`making sure current value is "transparent"`, async function () {
                                    const expectedValue = 'transparent';
                                    await driver.click(colorPicker.MainHeader);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Value Input default value = ""`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi = await colorPicker.getMainExampleColorPickerValue();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                it(`functional test [ control = "#1fbeb9" ] (+screenshot)`, async function () {
                                    await storyBookPage.inputs.setColorValue('#1fbeb9');
                                    const currentColor = await colorPicker.getMainExampleColorPickerValue();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Label Input Change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentColor).to.equal('rgb(31, 190, 185) !important'); // same as "#1fbeb9" in RGB
                                });
                                it(`back to default [ control = "" ] (+screenshots)`, async function () {
                                    await storyBookPage.inputs.setColorValue('');
                                    await driver.click(colorPicker.ResetControlsButton);
                                    const expectedValue = 'transparent';
                                    await driver.click(colorPicker.MainHeader);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Value Input default value = ""`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi = await colorPicker.getMainExampleColorPickerValue();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                break;

                            case 'xAlignment':
                                it(`validate input`, async function () {
                                    expect(colorPickerInputs.includes('xAlignment')).to.be.true;
                                });
                                it(`get all xAlignments & validate current alignment is 'left'`, async function () {
                                    const currentAlign = await colorPicker.getTxtAlignmentByComponent('color-picker');
                                    expect(currentAlign).to.include('left');
                                    allAlignments = await storyBookPage.inputs.getAllxAlignments();
                                });
                                alignExpectedValues.forEach(async (title, index) => {
                                    if (title) {
                                        it(`'${title}' -- functional test (+screenshot)`, async function () {
                                            const alignment = allAlignments[index + 1];
                                            await alignment.click();
                                            const currentAlign = await colorPicker.getTxtAlignmentByComponent(
                                                'color-picker',
                                            );
                                            const base64ImageComponentModal = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `${title} (xAlignment) input change`,
                                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                                            });
                                            expect(currentAlign).to.include(title);
                                        });
                                    }
                                });
                                break;

                            default:
                                throw new Error(`Input: "${input}" is not covered in switch!`);
                            // break;
                        }
                    });
                    break;
            }
        });
        colorPickerOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await colorPicker.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
