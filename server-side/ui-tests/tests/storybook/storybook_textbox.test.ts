import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Textbox } from '../../pom/Pages/StorybookComponents/Textbox';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookTextboxTests() {
    const textboxInputs = [
        'label',
        'value',
        'disabled',
        'mandatory',
        'maxFieldCharacters',
        'regex',
        'regexError',
        'renderError',
        'renderSymbol',
        'renderTitle',
        'showTitle',
        'textColor',
        'type',
        'xAlignment',
    ];
    const textboxOutputs = ['valueChange'];
    const textboxSubFoldersHeaders = [
        'Currency',
        'Email',
        'Max field characters',
        'Number Decimal',
        'Number Integer',
        'Percentage',
        'Phone',
    ];
    const alignExpectedValues = ['', 'center', 'right'];
    const typeExpectedValues = ['text', 'email', 'phone', 'int', 'percentage', 'currency', 'real'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let textbox: Textbox;
    let textboxInputsTitles;
    let textboxOutputsTitles;
    let allTypes;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Textbox" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            textbox = new Textbox(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Textbox Component * Initial Testing', () => {
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
            it(`Enter ** Textbox ** Component StoryBook - SCREENSHOT`, async function () {
                await driver.scrollToElement(storyBookPage.SidebarServicesHeader); // for the purpose of navigating to the area of 'textbox' at sidebar menu
                await storyBookPage.chooseComponent('textbox');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Textbox ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await textbox.doesTextboxComponentFound();
                textboxInputsTitles = await textbox.getInputsTitles();
                console.info('textboxInputsTitles:', JSON.stringify(textboxInputsTitles, null, 2));
                textboxOutputsTitles = await textbox.getOutputsTitles();
                console.info('textboxOutputsTitles:', JSON.stringify(textboxOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(textboxInputsTitles).to.eql(textboxInputs);
                expect(textboxOutputsTitles).to.eql(textboxOutputs);
                driver.sleep(5 * 1000);
            });
        });
        textboxInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await textbox.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(textbox.Inputs_mainTableRow);
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
                            expect(textboxInputsTitles.includes('label')).to.be.true;
                            await driver.click(textbox.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await textbox.getMainExampleLabel('textbox');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "Not all who wander are lost"`, async function () {
                            const expectedValue = 'Not all who wander are lost';
                            await driver.click(textbox.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Not all who wander are lost"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 'Auto test';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        it(`back to default [ control = "Not all who wander are lost" ](+screenshots)`, async function () {
                            await driver.click(textbox.ResetControlsButton);
                            const expectedValue = 'Not all who wander are lost';
                            await driver.click(textbox.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Not all who wander are lost"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxDisabled = await mainExampleTextbox.getAttribute('disabled');
                            console.info(
                                'mainExampleTextboxDisabled (false): ',
                                JSON.stringify(mainExampleTextboxDisabled, null, 2),
                            );
                            expect(mainExampleTextboxDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxDisabled = await mainExampleTextbox.getAttribute('disabled');
                            console.info(
                                'mainExampleTextboxDisabled (true): ',
                                JSON.stringify(mainExampleTextboxDisabled, null, 2),
                            );
                            expect(mainExampleTextboxDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxDisabled = await mainExampleTextbox.getAttribute('disabled');
                            expect(mainExampleTextboxDisabled).to.be.null;
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('mandatory')).to.be.true;
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
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_mandatoryIcon);
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
                            await storyBookPage.untilIsVisible(textbox.MainExample_mandatoryIcon);
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
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'maxFieldCharacters':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        it(`making sure current value is NaN`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textbox.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_numOfCharacters);
                        });
                        it(`functional test [ control = 3 ] (+screenshot)`, async function () {
                            await driver.click(await textbox.getInputRowSelectorByName('regex'));
                            const newValueToSet = 3;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textbox.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(textbox.MainExample_numOfCharacters);
                            await storyBookPage.inputs.changeInput(
                                textbox.MainExampleTextbox,
                                'https://www.google.com',
                            );
                        });
                        it(`back to non-functional value [ control = 0 ] (+screenshots)`, async function () {
                            await driver.click(await textbox.getInputRowSelectorByName('regex'));
                            const newValueToSet = 0;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textbox.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_numOfCharacters);
                        });
                        break;

                    case 'regex':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('regex')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'regexError':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('regexError')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'renderError':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('renderError')).to.be.true;
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainExampleDiv);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`creating an error and making sure the error message is displayed`, async function () {
                            // changing mandatory to true:
                            await storyBookPage.inputs.toggleMandatoryControl();
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            // changing value to be empty:
                            await storyBookPage.inputs.changeValueControl('');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '' - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // click textbox:
                            await textbox.click(textbox.MainExampleTextbox);
                            await textbox.click(textbox.MainExampleDiv);
                            textbox.pause(1 * 1000);
                            const errorMessageSpan = await driver.findElement(textbox.MainExample_ErrorMessageSpan);
                            const mainExample_matLabel = await driver.findElement(textbox.MainExample_titleLabel);
                            const mainExample_matLabel_text = await mainExample_matLabel.getText();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(await errorMessageSpan.getText()).equals(
                                `${mainExample_matLabel_text} is mandatory`,
                            );
                            expect(await errorMessageSpan.getCssValue('color')).equals('rgba(255, 255, 255, 1)');
                        });
                        it(`changing value control to VALID input and making sure no error is displayed`, async function () {
                            const newValueToSet = 'Auto Test';
                            await driver.click(textbox.MainHeader);
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> '${newValueToSet}'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newValueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of ${newValueToSet} - at new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const errorMessageSpan = await driver.isElementVisible(
                                textbox.MainExample_ErrorMessageSpan,
                            );
                            textbox.pause(1 * 1000);
                            expect(errorMessageSpan).to.be.false;
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`changing value control to INVALID input and expacting error message NOT to be displayed`, async function () {
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            // changing value to be empty:
                            await storyBookPage.inputs.changeValueControl('');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '' - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainExampleTextbox);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // click textbox:
                            await textbox.click(textbox.MainExampleTextbox);
                            textbox.pause(0.2 * 1000);
                            await textbox.click(textbox.MainExampleDiv);
                            const errorMessageSpan = await driver.isElementVisible(
                                textbox.MainExample_ErrorMessageSpan,
                            );
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(errorMessageSpan).to.be.false;
                        });
                        it(`changing value control to VALID input and making sure no error indication is displayed`, async function () {
                            // changing mandatory to false:
                            await storyBookPage.inputs.toggleMandatoryControl();
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.false;
                            // changing value to valid input:
                            const newValueToSet = 'Auto Test';
                            await driver.click(textbox.MainHeader);
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> '${newValueToSet}'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newValueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `No Error should be shown`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const errorMessageSpan = await driver.isElementVisible(
                                textbox.MainExample_ErrorMessageSpan,
                            );
                            expect(errorMessageSpan).to.be.false;
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
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderErrorControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
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
                            await driver.click(textbox.ResetControlsButton);
                            const expectedValue = 'Not all who wander are lost';
                            await driver.click(textbox.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "${expectedValue}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textbox.getMainExampleTextboxValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'renderSymbol':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('renderSymbol')).to.be.true;
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.true;
                            // await storyBookPage.untilIsVisible(textbox.MainExample_pepSymbol); // https://pepperi.atlassian.net/browse/DI-25637
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.false;
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_pepSymbol);
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderSymbol Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderSymbolTogglerState).to.be.true;
                            // await storyBookPage.untilIsVisible(textbox.MainExample_pepSymbol); // https://pepperi.atlassian.net/browse/DI-25637
                        });
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('renderTitle')).to.be.true;
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(textbox.MainExample_pepTitle);
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.false;
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_pepTitle);
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
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderTitleTogglerState).to.be.true;
                            await storyBookPage.untilIsVisible(textbox.MainExample_pepTitle);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(textbox.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(textbox.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(textbox.MainExample_titleLabel);
                        });
                        break;

                    case 'textColor':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('textColor')).to.be.true;
                        });
                        it(`making sure current value is ""`, async function () {
                            const expectedValue = '';
                            await driver.click(await textbox.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textbox.getMainExampleTextboxTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "#780f97" ] (+screenshot)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('#780f97');
                            await driver.click(await textbox.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentColor = await textbox.getMainExampleTextboxTxtColor();
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentColor).to.equal('rgb(120, 15, 151)'); // same as "#780f97" in RGB
                        });
                        it(`back to default [ control = "" ] (+screenshots)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('');
                            await driver.click(await textbox.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.ResetControlsButton);
                            const expectedValue = '';
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textbox.getMainExampleTextboxTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'type':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('type')).to.be.true;
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
                        it(`validate current type is "text"`, async function () {
                            const textboxElement = await driver.findElement(textbox.MainExampleTextbox);
                            const textboxElementType = await textboxElement.getAttribute('type');
                            console.info('textboxElement: ', textboxElement);
                            console.info('textboxElementType: ', textboxElementType);
                            // expect(textboxElementType).to.equal('text');
                        });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                // let mainExampleSelector;
                                // switch (title) {
                                //     case 'text':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'email':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'phone':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'int':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'percentage':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'currency':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;
                                //     case 'real':
                                //         // mainExampleSelector = textbox.MainExampleBooleanText;
                                //         break;

                                //     default:
                                //         mainExampleSelector = textbox.MainExampleTextbox;
                                //         break;
                                // }
                                // await driver.findElement(mainExampleSelector);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(textbox.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default - validate type is "text"`, async function () {
                            await driver.click(textbox.ResetControlsButton);
                            const textboxElement = await driver.findElement(textbox.MainExampleTextbox);
                            const textboxElementType_style = await textboxElement.getAttribute('style');
                            // const textboxElementType_color = textboxElementType_style.split('background: ')[1].split(';')[0];
                            console.info('textboxElement: ', textboxElement);
                            console.info('textboxElementType_style: ', textboxElementType_style);
                            // console.info('textboxElementType_color: ', textboxElementType_color);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            // expect(textboxElementType_color).to.equal('transparent');
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(textboxInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await textbox.getTxtAlignmentByComponent('textbox');
                            await driver.click(textbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: textbox with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await textbox.getTxtAlignmentByComponent('textbox');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(textbox.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: textbox with x-alignment = '${title}'`,
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
        textboxOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await textbox.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(textboxOutputsTitles.includes('valueChange')).to.be.true;
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
            it(`Navigate to place on sidebar menu`, async function () {
                await driver.switchToDefaultContent();
                await driver.scrollToElement(storyBookPage.SidebarServicesHeader); // for the purpose of navigating to the area of 'textbox' at sidebar menu
            });
            textboxSubFoldersHeaders.forEach(async (header) => {
                describe(`"${header}"`, async function () {
                    it(`Navigate to story (Screenshot)`, async function () {
                        await driver.switchToDefaultContent();
                        const headerText = header
                            .toLowerCase()
                            .replace(/\s/g, '-')
                            .replace(/[^a-z0-9]/gi, '-'); // replacing white spaces and non-alfabetic characters with '-'
                        await storyBookPage.chooseSubFolder(headerText);
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
                        const storyHeaderSelector = await storyBookPage.getStorySelectorByText(-1, headerText);
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
