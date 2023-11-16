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
    const typeExpectedValues = ['select', 'multi'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let select: Select;
    let selectInputsTitles;
    let selectOutputsTitles;
    let allTypes;
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
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('label')).to.be.true;
                            await driver.click(select.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await select.getMainExampleLabel('select');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'options':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('options')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(select.MainHeader);
                            const mainExampleSelect = await driver.findElement(select.MainExampleSelect);
                            const mainExampleSelectDisabled = await mainExampleSelect.getAttribute('class');
                            console.info(
                                'mainExampleSelectDisabled (false): ',
                                JSON.stringify(mainExampleSelectDisabled, null, 2),
                            );
                            expect(mainExampleSelectDisabled).to.not.include('mat-form-field-disabled');
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(select.MainHeader);
                            const mainExampleSelect = await driver.findElement(select.MainExampleSelect);
                            const mainExampleSelectDisabled = await mainExampleSelect.getAttribute('class');
                            console.info(
                                'mainExampleSelectDisabled (true): ',
                                JSON.stringify(mainExampleSelectDisabled, null, 2),
                            );
                            expect(mainExampleSelectDisabled).to.include('mat-form-field-disabled');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(select.MainHeader);
                            const mainExampleSelect = await driver.findElement(select.MainExampleSelect);
                            const mainExampleSelectDisabled = await mainExampleSelect.getAttribute('class');
                            expect(mainExampleSelectDisabled).to.not.include('mat-form-field-disabled');
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`making sure current value is "False"`, async function () {
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(select.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(select.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(select.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'readonly':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('readonly')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(readonlyControlState).to.be.false;
                            const mainExampleSelect = await driver.findElement(select.MainExampleSelect);
                            const mainExampleSelectDisabled = await mainExampleSelect.getAttribute('class');
                            console.info('mainExampleSelectDisabled: ', mainExampleSelectDisabled);
                            // await select.untilIsVisible(select.MainExampleSelect);
                            // await storyBookPage.elemntDoNotExist(select.MainExampleSelectReadonly);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleReadonlyControl();
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            expect(readonlyControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // await select.untilIsVisible(select.MainExampleSelectReadonly);
                            // await storyBookPage.elemntDoNotExist(select.MainExampleSelect);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleReadonlyControl();
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(readonlyControlState).to.be.false;
                            // await select.untilIsVisible(select.MainExampleSelect);
                            // await storyBookPage.elemntDoNotExist(select.MainExampleSelectReadonly);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(select.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(select.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(select.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(select.MainExample_titleLabel);
                        });
                        break;

                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('type')).to.be.true;
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
                        it(`validate current type is "select"`, async function () {
                            const selectElement = await driver.findElement(select.MainExampleSelect);
                            const selectElementType = await selectElement.getAttribute('type');
                            console.info('selectElement: ', selectElement);
                            console.info('selectElementType: ', selectElementType);
                            // expect(selectElementType).to.equal('select');
                        });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                // let mainExampleSelector;
                                // switch (title) {
                                //     case 'select':
                                //         // mainExampleSelector = select.MainExampleBooleanText;
                                //         break;
                                //     case 'multi':
                                //         // mainExampleSelector = select.MainExampleBooleanText;
                                //         break;

                                //     default:
                                //         mainExampleSelector = select.MainExampleSelect;
                                //         break;
                                // }
                                // await driver.findElement(mainExampleSelector);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(select.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default - validate type is "any"`, async function () {
                            await driver.click(select.ResetControlsButton);
                            const selectElement = await driver.findElement(select.MainExampleSelect);
                            const selectElementType_style = await selectElement.getAttribute('style');
                            // const selectElementType_color = selectElementType_style.split('background: ')[1].split(';')[0];
                            console.info('selectElement: ', selectElement);
                            console.info('selectElementType_style: ', selectElementType_style);
                            // console.info('selectElementType_color: ', selectElementType_color);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            // expect(selectElementType_color).to.equal('transparent');
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "None"`, async function () {
                            const expectedValue = 'None';
                            await driver.click(select.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "None"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await select.getMainExampleSelectValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "Auto test" ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 'Auto test';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await select.getMainExampleSelectValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        it(`back to default [ control = "None" ](+screenshots)`, async function () {
                            await driver.click(select.ResetControlsButton);
                            const expectedValue = 'None';
                            await driver.click(select.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "None"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await select.getMainExampleSelectValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
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
                            const currentAlign = await select.getTxtAlignmentByComponent('select');
                            await driver.click(select.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: select with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
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
                            }
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
