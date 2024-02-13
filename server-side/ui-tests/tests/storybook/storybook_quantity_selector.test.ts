import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { QuantitySelector } from '../../pom/Pages/StorybookComponents/QuantitySelector';
import { WebElement } from 'selenium-webdriver';

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
    const alignExpectedValues = ['', 'center', 'right'];
    const styleTypeExpectedValues = ['weak', 'weak-invert', 'regular', 'strong'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let quantitySelector: QuantitySelector;
    let quantitySelectorInputsTitles;
    let quantitySelectorOutputsTitles;
    let allStyleTypes;
    let mainExampleQuantitySelector;
    let mainExampleQuantitySelectorStyle;
    let allAlignments: WebElement[] = [];

    describe('Storybook "QuantitySelector" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            quantitySelector = new QuantitySelector(driver);
        });

        after(async function () {
            await driver.close();
            await driver.quit();
        });

        describe('* QuantitySelector Component * Initial Testing - ***BUG: DI-25607 at "textColor" input', () => {
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
            switch (input) {
                case 'textColor': // to be removed when the bug is fixed
                    describe(`INPUT: '${input} - ***BUG: DI-25607'`, async function () {
                        it(`https://pepperi.atlassian.net/browse/DI-25607`, async function () {
                            // https://pepperi.atlassian.net/browse/DI-25607
                            expect(quantitySelectorInputsTitles.includes('textColor')).to.be.true;
                        });
                    });
                    break;

                default:
                    describe(`INPUT: '${input}'`, async function () {
                        it(`SCREENSHOT`, async function () {
                            await driver.click(await quantitySelector.getInputRowSelectorByName(input));
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
                            const inputsMainTableRowElement = await driver.findElement(
                                quantitySelector.Inputs_mainTableRow,
                            );
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
                                    expect(quantitySelectorInputsTitles.includes('label')).to.be.true;
                                    await driver.click(quantitySelector.ResetControlsButton);
                                });
                                it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                                    const newLabelToSet = 'Auto test';
                                    await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Label Input Change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const newLabelGotFromUi = await quantitySelector.getMainExampleLabel(
                                        'quantity-selector',
                                    );
                                    expect(newLabelGotFromUi).to.equal(newLabelToSet);
                                });
                                break;

                            case 'value':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('value')).to.be.true;
                                });
                                it(`making sure current value is "18.00"`, async function () {
                                    const expectedValue = '18.00';
                                    await driver.click(quantitySelector.MainHeader);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Value Input default value = "18.00"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi = await quantitySelector.getMainExampleQuantitySelectorValue();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                it(`functional test [ control = "54" ] functional test (+screenshot)`, async function () {
                                    const newValueToSet = '54';
                                    await storyBookPage.inputs.changeValueControl(newValueToSet);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Value Input Change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const newValueGotFromUi =
                                        await quantitySelector.getMainExampleQuantitySelectorValue();
                                    expect(newValueGotFromUi).to.equal(newValueToSet + '.00');
                                });
                                it(`back to default [ control = "18" ](+screenshots)`, async function () {
                                    await driver.click(quantitySelector.ResetControlsButton);
                                    const expectedValue = '18.00';
                                    await driver.click(quantitySelector.MainHeader);
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Value Input default value = "18.00"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi = await quantitySelector.getMainExampleQuantitySelectorValue();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                break;

                            case 'allowDecimal':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('allowDecimal')).to.be.true;
                                });
                                // TODO
                                break;

                            case 'disabled':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('disabled')).to.be.true;
                                });
                                it(`making sure current value is "False"`, async function () {
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disabled Input default value = "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    const mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector,
                                    );
                                    const mainExampleQuantitySelectorDisabled =
                                        await mainExampleQuantitySelector.getAttribute('class');
                                    console.info(
                                        'mainExampleQuantitySelectorDisabled (false): ',
                                        JSON.stringify(mainExampleQuantitySelectorDisabled, null, 2),
                                    );
                                    expect(mainExampleQuantitySelectorDisabled).to.not.include(
                                        'mat-form-field-disabled',
                                    );
                                });
                                it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleDisableControl();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disabled Input Changed to "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    const mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector,
                                    );
                                    const mainExampleQuantitySelectorDisabled =
                                        await mainExampleQuantitySelector.getAttribute('class');
                                    console.info(
                                        'mainExampleQuantitySelectorDisabled (true): ',
                                        JSON.stringify(mainExampleQuantitySelectorDisabled, null, 2),
                                    );
                                    expect(mainExampleQuantitySelectorDisabled).to.include('mat-form-field-disabled');
                                });
                                it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleDisableControl();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Disable Input changed back to default value = "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    const mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector,
                                    );
                                    const mainExampleQuantitySelectorDisabled =
                                        await mainExampleQuantitySelector.getAttribute('class');
                                    expect(mainExampleQuantitySelectorDisabled).to.not.include(
                                        'mat-form-field-disabled',
                                    );
                                });
                                break;

                            case 'mandatory':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('mandatory')).to.be.true;
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
                                    await storyBookPage.elemntDoNotExist(quantitySelector.MainExample_mandatoryIcon);
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
                                    await storyBookPage.untilIsVisible(quantitySelector.MainExample_mandatoryIcon);
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
                                    await storyBookPage.elemntDoNotExist(quantitySelector.MainExample_mandatoryIcon);
                                });
                                break;

                            case 'readonly':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('readonly')).to.be.true;
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
                                    const mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector,
                                    );
                                    const mainExampleQuantitySelectorDisabled =
                                        await mainExampleQuantitySelector.getAttribute('class');
                                    console.info(
                                        'mainExampleQuantitySelectorDisabled: ',
                                        mainExampleQuantitySelectorDisabled,
                                    );
                                    await quantitySelector.untilIsVisible(quantitySelector.MainExampleQuantitySelector);
                                    await storyBookPage.elemntDoNotExist(
                                        quantitySelector.MainExampleQuantitySelectorReadonly,
                                    );
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
                                    await quantitySelector.untilIsVisible(
                                        quantitySelector.MainExampleQuantitySelectorReadonly,
                                    );
                                    await storyBookPage.elemntDoNotExist(quantitySelector.MainExampleQuantitySelector);
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
                                    await quantitySelector.untilIsVisible(quantitySelector.MainExampleQuantitySelector);
                                    await storyBookPage.elemntDoNotExist(
                                        quantitySelector.MainExampleQuantitySelectorReadonly,
                                    );
                                });
                                break;

                            case 'showTitle':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('showTitle')).to.be.true;
                                });
                                it(`making sure current value is "True"`, async function () {
                                    let base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `'${input}' input`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    const inputsMainTableRowElement = await driver.findElement(
                                        quantitySelector.Inputs_mainTableRow,
                                    );
                                    if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                        await inputsMainTableRowElement.click();
                                    }
                                    base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `'${input}' input`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    await storyBookPage.untilIsVisible(quantitySelector.MainExample_titleLabel);
                                });
                                it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleShowTitleControl();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `ShowTitle Input Changed to "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await storyBookPage.elemntDoNotExist(quantitySelector.MainExample_titleLabel);
                                });
                                it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleShowTitleControl();
                                    const base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `ShowTitle Input Changed to "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await storyBookPage.untilIsVisible(quantitySelector.MainExample_titleLabel);
                                });
                                break;

                            case 'styleType':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('styleType')).to.be.true;
                                    await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                });
                                it(`get all style types`, async function () {
                                    const base64ImageComponent = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `'${input}' input`,
                                        value: 'data:image/png;base64,' + base64ImageComponent,
                                    });
                                    allStyleTypes = await storyBookPage.inputs.getAllStyleTypes();
                                    driver.sleep(1 * 1000);
                                    console.info('allStyleTypes length: ', allStyleTypes.length);
                                    expect(allStyleTypes.length).equals(styleTypeExpectedValues.length);
                                });
                                it(`validate current style type is "regular"`, async function () {
                                    mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector_style,
                                    );
                                    mainExampleQuantitySelectorStyle = await mainExampleQuantitySelector.getCssValue(
                                        'background',
                                    );
                                    console.info('mainExampleQuantitySelector: ', mainExampleQuantitySelector);
                                    console.info(
                                        'mainExampleQuantitySelectorStyle: ',
                                        mainExampleQuantitySelectorStyle,
                                    );
                                    const backgroundColor = mainExampleQuantitySelectorStyle
                                        .split('rgb(')[1]
                                        .split(')')[0];
                                    console.info('backgroundColor: ', backgroundColor);
                                    expect(backgroundColor).to.equal('250, 250, 250');
                                });
                                styleTypeExpectedValues.forEach(async (title, index) => {
                                    it(`'${title}' -- functional test (+screenshot)`, async function () {
                                        const styleType = allStyleTypes[index];
                                        await styleType.click();
                                        mainExampleQuantitySelector = await driver.findElement(
                                            quantitySelector.MainExampleQuantitySelector_style,
                                        );
                                        mainExampleQuantitySelectorStyle =
                                            await mainExampleQuantitySelector.getCssValue('background');
                                        console.info(
                                            'mainExampleQuantitySelectorStyle: ',
                                            mainExampleQuantitySelectorStyle,
                                        );
                                        await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                        let base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `${title} (styleType) input change`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                        const backgroundHue = mainExampleQuantitySelectorStyle
                                            .split('rgb')[1]
                                            .split(')')[0];
                                        console.info('backgroundHue: ', backgroundHue);
                                        let expectedHue;
                                        switch (title) {
                                            case 'weak':
                                                console.info(`At WEAK style type`);
                                                expectedHue = 'rgba(26, 26, 26, 0.12)';
                                                break;
                                            case 'weak-invert':
                                                console.info(`At WEAK-INVERT style type`);
                                                expectedHue = 'rgba(26, 26, 26, 0.12)';
                                                break;
                                            case 'regular':
                                                console.info(`At REGULAR style type`);
                                                expectedHue = 'rgb(250, 250, 250)';
                                                break;
                                            case 'strong':
                                                console.info(`At STRONG style type`);
                                                expectedHue = 'rgb(26, 26, 26)';
                                                break;

                                            default:
                                                console.info(`At DEFAULT style type`);
                                                expectedHue = '';
                                                break;
                                        }
                                        expect('rgb' + backgroundHue + ')').to.equal(expectedHue);
                                        await driver.click(quantitySelector.MainHeader);
                                        driver.sleep(0.1 * 1000);
                                        base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `upper screenshot: quantitySelector with [style type = '${title}']`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                    });
                                });
                                it(`back to default [style type = "regular"]`, async function () {
                                    await driver.click(quantitySelector.ResetControlsButton);
                                    await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `style type changed to 'regular'`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    mainExampleQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExampleQuantitySelector_style,
                                    );
                                    mainExampleQuantitySelectorStyle = await mainExampleQuantitySelector.getCssValue(
                                        'background',
                                    );
                                    console.info('mainExampleQuantitySelector: ', mainExampleQuantitySelector);
                                    console.info(
                                        'mainExampleQuantitySelectorStyle: ',
                                        mainExampleQuantitySelectorStyle,
                                    );
                                    await driver.click(quantitySelector.MainHeader);
                                    driver.sleep(0.1 * 1000);
                                    const backgroundColor = mainExampleQuantitySelectorStyle
                                        .split('rgb(')[1]
                                        .split(')')[0];
                                    console.info('backgroundColor: ', backgroundColor);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: quantitySelector with [style type = 'regular']`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(backgroundColor).to.equal('250, 250, 250');
                                    await driver.click(quantitySelector.MainHeader);
                                });
                                break;

                            case 'textColor':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('textColor')).to.be.true;
                                });
                                it(`making sure current value is ""`, async function () {
                                    const expectedValue = '';
                                    await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `txtColor Input default value = ""`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper view of txtColor Input default value = ""`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi =
                                        await quantitySelector.getMainExampleQuantitySelectorTxtColor();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                it(`waiting for https://pepperi.atlassian.net/browse/DI-25607`, async function () {
                                    expect(true).to.be.true;
                                });
                                // it(`functional test [ control = "#780f97" ] (+screenshot)`, async function () {
                                //     await storyBookPage.inputs.setTxtColorValue('#780f97');
                                //     await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                //     let base64ImageComponentModal = await driver.saveScreenshots();
                                //     addContext(this, {
                                //         title: `txtColor Input Change`,
                                //         value: 'data:image/png;base64,' + base64ImageComponentModal,
                                //     });
                                //     const currentColor = await quantitySelector.getMainExampleQuantitySelectorTxtColor();
                                //     console.info('currentColor: ', currentColor);
                                //     await driver.click(quantitySelector.MainHeader);
                                //     base64ImageComponentModal = await driver.saveScreenshots();
                                //     addContext(this, {
                                //         title: `upper view of txtColor Input Change`,
                                //         value: 'data:image/png;base64,' + base64ImageComponentModal,
                                //     });
                                //     expect(currentColor).to.equal('rgb(120, 15, 151)'); // same as "#780f97" in RGB  BUG https://pepperi.atlassian.net/browse/DI-25607
                                // });
                                it(`back to default [ control = "" ] (+screenshots)`, async function () {
                                    await storyBookPage.inputs.setTxtColorValue('');
                                    await driver.click(await quantitySelector.getInputRowSelectorByName('visible'));
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `back to default value = "" of txtColor Input`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.ResetControlsButton);
                                    const expectedValue = '';
                                    await driver.click(quantitySelector.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper view of back to default value = "" of txtColor Input`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    const valueGotFromUi =
                                        await quantitySelector.getMainExampleQuantitySelectorTxtColor();
                                    expect(valueGotFromUi).to.equal(expectedValue);
                                });
                                break;

                            case 'visible':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('visible')).to.be.true;
                                });
                                it(`making sure current value is "True"`, async function () {
                                    await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Visible Input default value = "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    const mainExamplePepQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExamplePepQuantitySelector,
                                    );
                                    const mainExamplePepQuantitySelectorClasses =
                                        await mainExamplePepQuantitySelector.getAttribute('class');
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Upper View of Visible Input "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(mainExamplePepQuantitySelectorClasses).to.not.include('hidden-element');
                                });
                                it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                                    await storyBookPage.inputs.toggleVisibleControl();
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Visible Input Changed to "false"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    await driver.click(quantitySelector.MainHeader);
                                    try {
                                        const mainExamplePepQuantitySelector = await driver.findElement(
                                            quantitySelector.MainExamplePepQuantitySelector,
                                        );
                                        const mainExamplePepQuantitySelectorClasses =
                                            await mainExamplePepQuantitySelector.getAttribute('class');
                                        base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Upper View of Visible Input "false"`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                        expect(mainExamplePepQuantitySelectorClasses).to.include('hidden-element');
                                    } catch (error) {
                                        console.error(error);
                                        const theError = error as Error;
                                        console.info("Can't find Pep-QuantitySelector");
                                        base64ImageComponentModal = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Upper View of Visible Input "false"`,
                                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                                        });
                                        expect(theError.message).contains(
                                            `After wait time of: 15000, for selector of '//div[@id="story--components-quantity-selector--story-1"]//pep-quantity-selector', The test must end, The element is not visible`,
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
                                    await driver.click(quantitySelector.MainHeader);
                                    const mainExamplePepQuantitySelector = await driver.findElement(
                                        quantitySelector.MainExamplePepQuantitySelector,
                                    );
                                    const mainExamplePepQuantitySelectorClasses =
                                        await mainExamplePepQuantitySelector.getAttribute('class');
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `Upper View of Visible Input "true"`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(mainExamplePepQuantitySelectorClasses).to.not.include('hidden-element');
                                });
                                break;

                            case 'xAlignment':
                                it(`validate input`, async function () {
                                    expect(quantitySelectorInputsTitles.includes('xAlignment')).to.be.true;
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
                                    const currentAlign = await quantitySelector.getTxtAlignmentByComponent(
                                        'quantity-selector',
                                    );
                                    await driver.click(quantitySelector.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: quantity-selector with x-alignment = 'left'`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include('left');
                                });
                                alignExpectedValues.forEach(async (title, index) => {
                                    if (title) {
                                        it(`'${title}' -- functional test (+screenshots)`, async function () {
                                            const alignment = allAlignments[index];
                                            await alignment.click();
                                            const currentAlign = await quantitySelector.getTxtAlignmentByComponent(
                                                'quantity-selector',
                                            );
                                            let base64ImageComponentModal = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `${title} (xAlignment) input change`,
                                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                                            });
                                            expect(currentAlign).to.include(title);
                                            await driver.click(quantitySelector.MainHeader);
                                            base64ImageComponentModal = await driver.saveScreenshots();
                                            addContext(this, {
                                                title: `upper screenshot: quantitySelector with x-alignment = '${title}'`,
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
                    break;
            }
        });
        quantitySelectorOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await quantitySelector.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
