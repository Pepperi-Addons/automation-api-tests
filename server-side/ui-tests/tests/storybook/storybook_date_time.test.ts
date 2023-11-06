import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { DateTime } from '../../pom/Pages/StorybookComponents/DateTime';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookDateTimeTests() {
    const dateTimeInputs = [
        'label',
        'value',
        'disabled',
        'mandatory',
        'renderError',
        'renderSymbol',
        'renderTitle',
        'showTitle',
        'textColor',
        'type',
        'xAlignment',
    ];
    const dateTimeOutputs = ['valueChange'];
    const dateTimeSubFoldersHeaders = ['Empty date-time'];
    const alignExpectedValues = ['', 'center', 'right'];
    const typeExpectedValues = ['date', 'datetime'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let dateTime: DateTime;
    let dateTimeInputsTitles;
    let dateTimeOutputsTitles;
    let allTypes;
    let allAlignments: WebElement[] = [];

    describe('Storybook "DateTime" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            dateTime = new DateTime(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* DateTime Component * Initial Testing', () => {
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
            it(`Enter ** DateTime ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('date-date-time');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** DateTime ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await dateTime.doesDateTimeComponentFound();
                dateTimeInputsTitles = await dateTime.getInputsTitles();
                console.info('dateTimeInputsTitles:', JSON.stringify(dateTimeInputsTitles, null, 2));
                dateTimeOutputsTitles = await dateTime.getOutputsTitles();
                console.info('dateTimeOutputsTitles:', JSON.stringify(dateTimeOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(dateTimeInputsTitles).to.eql(dateTimeInputs);
                expect(dateTimeOutputsTitles).to.eql(dateTimeOutputs);
                driver.sleep(5 * 1000);
            });
        });
        dateTimeInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`switch to iframe`, async function () {
                    try {
                        await driver.findElement(storyBookPage.StorybookIframe, 5000);
                        await driver.switchTo(storyBookPage.StorybookIframe);
                    } catch (error) {
                        console.error(error);
                        console.info('ALREADY ON IFRAME');
                    }
                });
                it(`SCREENSHOT`, async function () {
                    await driver.click(await dateTime.getInputRowSelectorByName(input));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(dateTime.Inputs_mainTableRow);
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
                            expect(dateTimeInputsTitles.includes('label')).to.be.true;
                            await driver.click(dateTime.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await dateTime.getMainExampleLabel('date-time');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "01/01/2020"`, async function () {
                            const expectedValue = '01/01/2020';
                            await driver.click(dateTime.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "01/01/2020"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await dateTime.getMainExampleDateTimeValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "03/17/1999" ] (+screenshot)`, async function () {
                            const newValueToSet = '1999-3-17';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> '1999-3-17'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await dateTime.getMainExampleDateTimeValue();
                            expect(newValueGotFromUi).to.equal('03/17/1999');
                        });
                        it(`back to default [ control = "01/01/2020" ] (+screenshots)`, async function () {
                            await driver.click(dateTime.ResetControlsButton);
                            const expectedValue = '01/01/2020';
                            await driver.click(dateTime.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "01/01/2020"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await dateTime.getMainExampleDateTimeValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainHeader);
                            const mainExampleDateTime = await driver.findElement(dateTime.MainExampleDateTime);
                            const mainExampleDateTimeDisabled = await mainExampleDateTime.getAttribute('disabled');
                            console.info(
                                'mainExampleDateTimeDisabled (false): ',
                                JSON.stringify(mainExampleDateTimeDisabled, null, 2),
                            );
                            expect(mainExampleDateTimeDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainHeader);
                            const mainExampleDateTime = await driver.findElement(dateTime.MainExampleDateTime);
                            const mainExampleDateTimeDisabled = await mainExampleDateTime.getAttribute('disabled');
                            console.info(
                                'mainExampleDateTimeDisabled (true): ',
                                JSON.stringify(mainExampleDateTimeDisabled, null, 2),
                            );
                            expect(mainExampleDateTimeDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainHeader);
                            const mainExampleDateTime = await driver.findElement(dateTime.MainExampleDateTime);
                            const mainExampleDateTimeDisabled = await mainExampleDateTime.getAttribute('disabled');
                            expect(mainExampleDateTimeDisabled).to.be.null;
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(dateTimeInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(dateTime.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(dateTime.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(dateTime.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'renderError':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('renderError')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            expect(renderErrorControlState).to.be.true;
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainExampleDiv);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`creating an error and making sure the error message is displayed`, async function () {
                            await storyBookPage.inputs.changeValueControl('2020-1-0');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '2020-1-0' - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainExampleDateTime);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            driver.sleep(0.5 * 1000);
                            const mainExamplePopup = await driver.findElement(dateTime.DateTimePicker_Popup);
                            expect(mainExamplePopup).to.not.be.null.and.not.be.undefined;
                            // closing dialog:
                            await driver.click(dateTime.MainExample_PopupDialog_wrapperContainer_innerDiv);
                            driver.sleep(2 * 1000);
                            await storyBookPage.inputs.changeInput(dateTime.MainExampleDateTime, '0');
                            const errorMessageSpan = await driver.findElement(dateTime.MainExample_ErrorMessageSpan);
                            console.info('errorMessageSpan style: ', await errorMessageSpan.getCssValue('color'));
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(await errorMessageSpan.getText()).equals('date is not valid');
                            expect(await errorMessageSpan.getCssValue('color')).equals('rgba(255, 255, 255, 1)');
                        });
                        it(`changing value control to valid input and making sure no error indication is displayed`, async function () {
                            await storyBookPage.inputs.changeValueControl('2020-1-1');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '2020-1-1'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainExampleDateTime);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            driver.sleep(0.5 * 1000);
                            const mainExamplePopup = await driver.isElementVisible(dateTime.DateTimePicker_Popup);
                            expect(mainExamplePopup).to.be.true;
                            // closing dialog:
                            await driver.click(dateTime.MainExample_PopupDialog_wrapperContainer_innerDiv);
                            driver.sleep(2 * 1000);
                            await storyBookPage.inputs.changeInput(dateTime.MainExampleDateTime, '01/01/2020');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `No Error should be shown`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const errorMessageSpan = await driver.isElementVisible(
                                dateTime.MainExample_ErrorMessageSpan,
                            );
                            expect(errorMessageSpan).to.be.false;
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderErrorControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            expect(renderErrorControlState).to.be.false;
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`changing value control to invalid input and expacting error message not to be displayed - but border line red`, async function () {
                            await storyBookPage.inputs.changeValueControl('2020-1-0');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '2020-1-0' - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainExampleDateTime);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            driver.sleep(0.5 * 1000);
                            const mainExamplePopup = await driver.findElement(dateTime.DateTimePicker_Popup);
                            expect(mainExamplePopup).to.not.be.null.and.not.be.undefined;
                            // closing dialog:
                            await driver.click(dateTime.MainExample_PopupDialog_wrapperContainer_innerDiv);
                            driver.sleep(2 * 1000);
                            await storyBookPage.inputs.changeInput(dateTime.MainExampleDateTime, '0');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const errorMessageSpan = await driver.isElementVisible(
                                dateTime.MainExample_ErrorMessageSpan,
                            );
                            expect(errorMessageSpan).to.be.false;
                            const borderLineElement = await driver.findElement(dateTime.MainExample_BorderLineElement);
                            const borderLineColor = await borderLineElement.getCssValue('border');
                            console.info('borderLineColor: ', borderLineColor);
                            expect(borderLineColor.trim()).equals('1px solid rgb(204, 0, 0)');
                        });
                        it(`changing value control to valid input and making sure no error indication is displayed`, async function () {
                            await storyBookPage.inputs.changeValueControl('2020-1-1');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '2020-1-1'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainExampleDateTime);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            driver.sleep(0.5 * 1000);
                            const mainExamplePopup = await driver.isElementVisible(dateTime.DateTimePicker_Popup);
                            expect(mainExamplePopup).to.be.true;
                            // closing dialog:
                            await driver.click(dateTime.MainExample_PopupDialog_wrapperContainer_innerDiv);
                            driver.sleep(2 * 1000);
                            await storyBookPage.inputs.changeInput(dateTime.MainExampleDateTime, '01/01/2020');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `No Error should be shown`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const errorMessageSpan = await driver.isElementVisible(
                                dateTime.MainExample_ErrorMessageSpan,
                            );
                            expect(errorMessageSpan).to.be.false;
                            const borderLineElement = await driver.findElement(dateTime.MainExample_BorderLineElement);
                            const borderLineColor = await borderLineElement.getCssValue('border');
                            console.info('borderLineColor: ', borderLineColor);
                            expect(borderLineColor.trim()).equals('0px none rgb(0, 0, 0)');
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderErrorControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainHeader);
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderErrorControlState).to.be.true;
                        });
                        it(`reset controls`, async function () {
                            await driver.click(dateTime.ResetControlsButton);
                            const expectedValue = '01/01/2020';
                            await driver.click(dateTime.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "${expectedValue}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await dateTime.getMainExampleDateTimeValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'renderSymbol':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('renderSymbol')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderSymbol Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderSymbolTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderSymbol',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(dateTime.MainExample_pepSymbol);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderSymbolControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderSymbol Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderSymbolTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderSymbol',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.false;
                            await storyBookPage.elemntDoNotExist(dateTime.MainExample_pepSymbol);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderSymbolControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderSymbol Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderSymbolTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderSymbol',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(dateTime.MainExample_pepSymbol);
                        });
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('renderTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderTitleTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderTitle',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(dateTime.MainExample_pepTitle);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderTitleTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderTitle',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.false;
                            await storyBookPage.elemntDoNotExist(dateTime.MainExample_pepTitle);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderTitleTogglerState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderTitle',
                            );
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(dateTime.MainExample_pepTitle);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(dateTime.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(dateTime.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(dateTime.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(dateTime.MainExample_titleLabel);
                        });
                        break;

                    case 'textColor':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('textColor')).to.be.true;
                        });
                        it(`making sure current value is ""`, async function () {
                            const expectedValue = '';
                            await driver.click(await dateTime.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await dateTime.getMainExampleDateTimeTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "#780f97" ] (+screenshot)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('#780f97');
                            await driver.click(await dateTime.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentColor = await dateTime.getMainExampleDateTimeTxtColor();
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentColor).to.equal('rgb(120, 15, 151)'); // same as "#780f97" in RGB
                        });
                        it(`back to default [ control = "" ] (+screenshots)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('');
                            await driver.click(await dateTime.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(dateTime.ResetControlsButton);
                            const expectedValue = '';
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await dateTime.getMainExampleDateTimeTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'type':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('type')).to.be.true;
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
                        it(`validate current type is "date"`, async function () {
                            const dateTimeElement = await driver.findElement(dateTime.MainExampleDateTime);
                            const dateTimeElementType = await dateTimeElement.getAttribute('title');
                            console.info('dateTimeElement: ', dateTimeElement);
                            expect(dateTimeElementType).to.equal('01/01/2020');
                        });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                const pepDate = await driver.findElement(dateTime.MainExampleDateTime);
                                const dateContent = await pepDate.getAttribute('title');
                                let expectedDateContent;
                                switch (title) {
                                    case 'date':
                                        expectedDateContent = '01/01/2020';
                                        break;
                                    case 'datetime':
                                        expectedDateContent = '01/01/2020 12:00 AM';
                                        break;

                                    default:
                                        expectedDateContent = '';
                                        break;
                                }
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(dateTime.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(dateContent).to.equal(expectedDateContent);
                            });
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(dateTimeInputs.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await dateTime.getTxtAlignmentByComponent('date-time');
                            await driver.click(dateTime.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: date-time with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await dateTime.getTxtAlignmentByComponent('date-time');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(dateTime.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: date-time with x-alignment = '${title}'`,
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
        dateTimeOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await dateTime.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(dateTimeOutputsTitles.includes('valueChange')).to.be.true;
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
            dateTimeSubFoldersHeaders.forEach(async (header, index) => {
                describe(`'${header}'`, async function () {
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
                });
            });
        });
    });
}
