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
            describe(`INPUT: '${input === 'readonly' ? input + ' - ***BUG: DI-25776' : input}'`, async function () {
                switch (
                    input // to be removed when the bug is fixed
                ) {
                    case 'readonly':
                        it(`***BUG: https://pepperi.atlassian.net/browse/DI-25776`, async function () {
                            // https://pepperi.atlassian.net/browse/DI-25776
                            expect(selectInputsTitles.includes('readonly')).to.be.true;
                        });
                        break;

                    default:
                        it(`SCREENSHOT`, async function () {
                            await driver.click(await select.getInputRowSelectorByName(input));
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
                        break;
                }
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
                        it(`validate input`, async function () {
                            expect(selectInputsTitles.includes('options')).to.be.true;
                        });
                        it(`making sure current value is 9 options array of objects`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `options Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of options Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainExampleSelect);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Select`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const selectContent = await select.getSelectOptions();
                            const selectContentButtons = await select.getOptionsOutOfSelectContent();
                            await driver.click(select.OverlayContainer);
                            expect(selectContent).to.not.equal('<!---->');
                            expect(selectContentButtons).to.be.an('array').with.lengthOf(9);
                            expect(selectContentButtons).eql([
                                'None',
                                'Tramontana',
                                'Gregale',
                                'Levante',
                                'Scirocco',
                                'Ostro',
                                'Libeccio',
                                'Ponente',
                                'Mistral',
                            ]);
                        });
                        it(`functional test [ control = [] ] (+screenshot)`, async function () {
                            await driver.click(await select.getInputRowSelectorByName('disabled'));
                            const newValueToSet = '[]';
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Before Items RAW Button Click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await select.inputs.toggleOptionsControlRawButton();
                            select.pause(0.5 * 1000);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items RAW Button is Clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await select.inputs.changeOptionsControl(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of Items Control Change`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainExampleSelect);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Select`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const selectContent = await select.getSelectOptions();
                            const selectContentButtons = await select.getOptionsOutOfSelectContent();
                            await driver.click(select.OverlayContainer);
                            expect(selectContent).to.not.equal('<!---->');
                            expect(selectContentButtons).to.be.an('array').with.lengthOf(1);
                            expect(selectContentButtons).eql(['None']);
                        });
                        it(`back to non-functional value [ control = "[{"key": "N", "value": "Tramontana"}, ..]" (array of objects with key-value pairs) ] (+screenshots)`, async function () {
                            await driver.click(await select.getInputRowSelectorByName('disabled'));
                            const newValueToSet = `[
                                {
                                  "key": "N",
                                  "value": "Tramontana"
                                },
                                {
                                  "key": "NE",
                                  "value": "Gregale"
                                },
                                {
                                  "key": "E",
                                  "value": "Levante"
                                },
                                {
                                  "key": "SE",
                                  "value": "Scirocco"
                                },
                                {
                                  "key": "S",
                                  "value": "Ostro"
                                },
                                {
                                  "key": "SW",
                                  "value": "Libeccio"
                                },
                                {
                                  "key": "W",
                                  "value": "Ponente"
                                },
                                {
                                  "key": "NW",
                                  "value": "Mistral"
                                }
                            ]`;
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Before Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.changeOptionsControl(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(select.MainExampleSelect);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Select`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const selectContent = await select.getSelectOptions();
                            const selectContentButtons = await select.getOptionsOutOfSelectContent();
                            await driver.click(select.OverlayContainer);
                            expect(selectContent).to.not.equal('<!---->');
                            expect(selectContentButtons).to.be.an('array').with.lengthOf(9);
                            expect(selectContentButtons).eql([
                                'None',
                                'Tramontana',
                                'Gregale',
                                'Levante',
                                'Scirocco',
                                'Ostro',
                                'Libeccio',
                                'Ponente',
                                'Mistral',
                            ]);
                        });
                        it(`toggle RAW button`, async function () {
                            await select.inputs.toggleOptionsControlRawButton();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of options Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
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
                        it(`validate input`, async function () {
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
                            // relevant assertion needs to be added
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
                            // relevant assertion needs to be added after BUG DI-25776 is fixed
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
                            // relevant assertion needs to be added
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
                        it(`validate input`, async function () {
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
