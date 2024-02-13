import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Textarea } from '../../pom/Pages/StorybookComponents/Textarea';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookTextareaTests() {
    const textareaInputs = [
        'rowSpan',
        'label',
        'value',
        'disabled',
        'mandatory',
        'maxFieldCharacters',
        'showTitle',
        'textColor',
        'visible',
        'xAlignment',
    ];
    const textareaOutputs = ['valueChange'];
    const textareaSubFoldersHeaders = ['Max field characters', 'Disabled'];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let textarea: Textarea;
    let textareaInputsTitles;
    let textareaOutputsTitles;
    let textareaComplexElement;
    let textareaComplexHeight;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Textarea" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            textarea = new Textarea(driver);
        });

        after(async function () {
            await driver.close();
            await driver.quit();
        });

        describe('* Textarea Component * Initial Testing', () => {
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
            it(`Enter ** Textarea ** Component StoryBook - SCREENSHOT`, async function () {
                await driver.scrollToElement(storyBookPage.SidebarExampleHeader); // for the purpose of navigating to the area of 'textarea' at sidebar menu
                await storyBookPage.chooseComponent('textarea');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Textarea ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await textarea.doesTextareaComponentFound();
                textareaInputsTitles = await textarea.getInputsTitles();
                console.info('textareaInputsTitles:', JSON.stringify(textareaInputsTitles, null, 2));
                textareaOutputsTitles = await textarea.getOutputsTitles();
                console.info('textareaOutputsTitles:', JSON.stringify(textareaOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(textareaInputsTitles).to.eql(textareaInputs);
                expect(textareaOutputsTitles).to.eql(textareaOutputs);
                driver.sleep(5 * 1000);
            });
        });
        textareaInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await textarea.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(textarea.Inputs_mainTableRow);
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
                    case 'rowSpan':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 2 ] measurement (+screenshot)`, async function () {
                            textareaComplexElement = await driver.findElement(textarea.MainExampleHeightDiv);
                            textareaComplexHeight = await textareaComplexElement.getCssValue('height');
                            console.info('textareaComplexHeight: ', textareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(textareaComplexHeight.trim()).to.equal('144px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await textarea.changeRowSpanControl(1);
                            textareaComplexElement = await driver.findElement(textarea.MainExampleHeightDiv);
                            textareaComplexHeight = await textareaComplexElement.getCssValue('height');
                            console.info('textareaComplexHeight: ', textareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(textareaComplexHeight.trim()).to.equal('77.5938px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await textarea.changeRowSpanControl(3);
                            textareaComplexElement = await driver.findElement(textarea.MainExampleHeightDiv);
                            textareaComplexHeight = await textareaComplexElement.getCssValue('height');
                            console.info('textareaComplexHeight: ', textareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(textareaComplexHeight.trim()).to.equal('208px');
                        });
                        it(`[ control = 0 ] height measurement (+screenshot)`, async function () {
                            await textarea.changeRowSpanControl(0);
                            textareaComplexElement = await driver.findElement(textarea.MainExampleHeightDiv);
                            textareaComplexHeight = await textareaComplexElement.getCssValue('height');
                            console.info('textareaComplexHeight: ', textareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(textareaComplexHeight.trim()).to.equal('80px');
                        });
                        it(`back to default height [ control = 2 ] measurement (+screenshot)`, async function () {
                            await textarea.changeRowSpanControl(2);
                            textareaComplexElement = await driver.findElement(textarea.MainExampleHeightDiv);
                            textareaComplexHeight = await textareaComplexElement.getCssValue('height');
                            console.info('textareaComplexHeight: ', textareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' back to default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(textareaComplexHeight.trim()).to.equal('144px');
                        });
                        break;

                    case 'label':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('label')).to.be.true;
                            await driver.click(textarea.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await textarea.getMainExampleLabel('textarea');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "A: Would you tell me, please, which way I ought to go from here?..."`, async function () {
                            const expectedValue = `A: Would you tell me, please, which way I ought to go from here?\nCC: That depends a good deal on where you want to get to\nA: I don’t much care where\nCC: Then it doesn’t matter which way you go`;
                            await driver.click(textarea.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "A: Would you tell me, please, which way I ought to go from here?..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textarea.getMainExampleTextareaValue();
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
                            const newValueGotFromUi = await textarea.getMainExampleTextareaValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        it(`back to default [ control = "A: Would you tell me, please, which way I ought to go from here?..." ](+screenshots)`, async function () {
                            await driver.click(textarea.ResetControlsButton);
                            const expectedValue = `A: Would you tell me, please, which way I ought to go from here?\nCC: That depends a good deal on where you want to get to\nA: I don’t much care where\nCC: Then it doesn’t matter which way you go`;
                            await driver.click(textarea.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "A: Would you tell me, please, which way I ought to go from here?..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textarea.getMainExampleTextareaValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            const mainExampleTextarea = await driver.findElement(textarea.MainExampleTextarea);
                            const mainExampleTextareaDisabled = await mainExampleTextarea.getAttribute('disabled');
                            console.info(
                                'mainExampleTextareaDisabled (false): ',
                                JSON.stringify(mainExampleTextareaDisabled, null, 2),
                            );
                            expect(mainExampleTextareaDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            const mainExampleTextarea = await driver.findElement(textarea.MainExampleTextarea);
                            const mainExampleTextareaDisabled = await mainExampleTextarea.getAttribute('disabled');
                            console.info(
                                'mainExampleTextareaDisabled (true): ',
                                JSON.stringify(mainExampleTextareaDisabled, null, 2),
                            );
                            expect(mainExampleTextareaDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            const mainExampleTextarea = await driver.findElement(textarea.MainExampleTextarea);
                            const mainExampleTextareaDisabled = await mainExampleTextarea.getAttribute('disabled');
                            expect(mainExampleTextareaDisabled).to.be.null;
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('mandatory')).to.be.true;
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
                            await storyBookPage.elemntDoNotExist(textarea.MainExample_mandatoryIcon);
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
                            await storyBookPage.untilIsVisible(textarea.MainExample_mandatoryIcon);
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
                            await storyBookPage.elemntDoNotExist(textarea.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'maxFieldCharacters':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        it(`making sure current value is NaN`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(textarea.MainExample_numOfCharacters);
                        });
                        it(`functional test [ control = 3 ] (+screenshot)`, async function () {
                            await driver.click(await textarea.getInputRowSelectorByName('showTitle'));
                            const newValueToSet = 3;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(textarea.MainExample_numOfCharacters);
                            await storyBookPage.inputs.changeInput(
                                textarea.MainExampleTextarea,
                                'https://www.google.com',
                            );
                        });
                        it(`back to non-functional value [ control = 0 ] (+screenshots)`, async function () {
                            await driver.click(await textarea.getInputRowSelectorByName('showTitle'));
                            const newValueToSet = 0;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(textarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(textarea.MainExample_numOfCharacters);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(textarea.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(textarea.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(textarea.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(textarea.MainExample_titleLabel);
                        });
                        break;

                    case 'textColor':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('textColor')).to.be.true;
                        });
                        it(`making sure current value is ""`, async function () {
                            const expectedValue = '';
                            await driver.click(await textarea.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textarea.getMainExampleTextareaTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "#780f97" ] (+screenshot)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('#780f97');
                            await driver.click(await textarea.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentColor = await textarea.getMainExampleTextareaTxtColor();
                            await driver.click(textarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentColor).to.equal('rgb(120, 15, 151)'); // same as "#780f97" in RGB
                        });
                        it(`back to default [ control = "" ] (+screenshots)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('');
                            await driver.click(await textarea.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.ResetControlsButton);
                            const expectedValue = '';
                            await driver.click(textarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await textarea.getMainExampleTextareaTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'visible':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('visible')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            const mainExamplePepTextarea = await driver.findElement(textarea.MainExamplePepTextarea);
                            const mainExamplePepTextareaClasses = await mainExamplePepTextarea.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepTextareaClasses).to.not.include('hidden-element');
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleVisibleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            try {
                                const mainExamplePepTextarea = await driver.findElement(
                                    textarea.MainExamplePepTextarea,
                                );
                                const mainExamplePepTextareaClasses = await mainExamplePepTextarea.getAttribute(
                                    'class',
                                );
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(mainExamplePepTextareaClasses).to.include('hidden-element');
                            } catch (error) {
                                console.error(error);
                                const theError = error as Error;
                                console.info("Can't find Pep-Textarea");
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(theError.message).contains(
                                    `After wait time of: 15000, for selector of '//div[@id="story--components-textarea--story-1"]//pep-textarea', The test must end, The element is not visible`,
                                );
                            }
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleVisibleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textarea.MainHeader);
                            const mainExamplePepTextarea = await driver.findElement(textarea.MainExamplePepTextarea);
                            const mainExamplePepTextareaClasses = await mainExamplePepTextarea.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepTextareaClasses).to.not.include('hidden-element');
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(textareaInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await textarea.getTxtAlignmentByComponent('textarea');
                            await driver.click(textarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: textarea with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await textarea.getTxtAlignmentByComponent('textarea');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(textarea.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: textarea with x-alignment = '${title}'`,
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
        textareaOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await textarea.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(textareaOutputsTitles.includes('valueChange')).to.be.true;
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
            textareaSubFoldersHeaders.forEach(async (header, index) => {
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
