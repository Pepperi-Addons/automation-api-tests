import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Chips } from '../../pom/Pages/StorybookComponents/Chips';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookChipsTests() {
    const chipsInputs = [
        'label',
        'chips',
        'classNames',
        'disabled',
        'inline',
        'mandatory',
        'orientation',
        'placeholder',
        'renderTitle',
        'showTitle',
        'styleType',
        'type',
        'xAlignment',
    ];
    const chipsOutputs = ['fieldClick', 'selectionChange'];
    const chipsMethods = ['addChipsToList'];
    const chipsSubFoldersHeaders = [
        'Without content',
        'With content',
        'Inline is true',
        'Type is select',
        'Orientation is vertical',
    ];
    const alignExpectedValues = ['left', 'center', 'right'];
    const styleTypeExpectedValues = ['weak', 'weak-invert', 'regular', 'strong'];
    const typeExpectedValues = ['input', 'select'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let chips: Chips;
    let chipsInputsTitles;
    let chipsOutputsTitles;
    let chipsMethodsTitles;
    let mainExampleChips;
    let mainExampleChipsStyle;
    let allStyleTypes;
    let allTypes;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Chips" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            chips = new Chips(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Chips Component * Initial Testing', () => {
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
            it(`Enter ** Chips ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('chips');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Chips ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await chips.doesChipsComponentFound();
                chipsInputsTitles = await chips.getInputsTitles();
                console.info('chipsInputsTitles:', JSON.stringify(chipsInputsTitles, null, 2));
                chipsOutputsTitles = await chips.getOutputsTitles();
                console.info('chipsOutputsTitles:', JSON.stringify(chipsOutputsTitles, null, 2));
                chipsMethodsTitles = await chips.getMethodsTitles();
                console.info('chipsMethodsTitles:', JSON.stringify(chipsMethodsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(chipsInputsTitles).to.eql(chipsInputs);
                expect(chipsOutputsTitles).to.eql(chipsOutputs);
                expect(chipsMethodsTitles).to.eql(chipsMethods);
                driver.sleep(5 * 1000);
            });
        });
        chipsInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await chips.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(chips.Inputs_mainTableRow);
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
                            expect(chipsInputsTitles.includes('label')).to.be.true;
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await chips.getMainExampleLabel('chips');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'chips':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('chips')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'classNames':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('classNames')).to.be.true;
                        });
                        it(`[ control = 'rotate3d' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = 'rotate3d';
                            await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(chips.MainExampleChips_singleChip)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.contain(newClassNamesToSet);
                        });
                        it(`[ control = '' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = '';
                            await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(chips.MainExampleChips_singleChip)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.not.contain('rotate3d');
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            const mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                            const mainExampleChipsDisabled = await mainExampleChips.getAttribute('disabled');
                            console.info(
                                'mainExampleChipsDisabled (false): ',
                                JSON.stringify(mainExampleChipsDisabled, null, 2),
                            );
                            expect(mainExampleChipsDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            const mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                            const mainExampleChipsDisabled = await mainExampleChips.getAttribute('disabled');
                            console.info(
                                'mainExampleChipsDisabled (true): ',
                                JSON.stringify(mainExampleChipsDisabled, null, 2),
                            );
                            expect(mainExampleChipsDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            const mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                            const mainExampleChipsDisabled = await mainExampleChips.getAttribute('disabled');
                            expect(mainExampleChipsDisabled).to.be.null;
                        });
                        break;

                    case 'inline':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('inline')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('mandatory')).to.be.true;
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
                            await storyBookPage.elemntDoNotExist(chips.MainExample_mandatoryIcon);
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
                            await storyBookPage.untilIsVisible(chips.MainExample_mandatoryIcon);
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
                            await storyBookPage.elemntDoNotExist(chips.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'orientation':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('orientation')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'placeholder':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('placeholder')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(chips.MainExample_pepTitle);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(chips.MainExample_pepTitle);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(chips.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(chips.MainExample_pepTitle);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(chips.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(chips.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(chips.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(chips.MainExample_titleLabel);
                        });
                        break;

                    case 'styleType':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('styleType')).to.be.true;
                            await driver.click(await chips.getInputRowSelectorByName('xAlignment'));
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
                            mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                            mainExampleChipsStyle = await mainExampleChips.getCssValue('background');
                            console.info('mainExampleChips: ', mainExampleChips);
                            console.info('mainExampleChipsStyle: ', mainExampleChipsStyle);
                            const backgroundColor = mainExampleChipsStyle.split('rgb(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            expect(backgroundColor).to.equal('250, 250, 250');
                        });
                        styleTypeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const styleType = allStyleTypes[index];
                                await styleType.click();
                                mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                                mainExampleChipsStyle = await mainExampleChips.getCssValue('background');
                                console.info('mainExampleChipsStyle: ', mainExampleChipsStyle);
                                await driver.click(await chips.getInputRowSelectorByName('xAlignment'));
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (styleType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                const backgroundHue = mainExampleChipsStyle.split('rgb')[1].split(')')[0];
                                console.info('backgroundHue: ', backgroundHue);
                                let expectedHue;
                                switch (title) {
                                    case 'weak':
                                        console.info(`At WEAK style type`);
                                        expectedHue = 'rgba(26, 26, 26, 0.12)';
                                        break;
                                    case 'weak-invert':
                                        console.info(`At WEAK-INVERT style type`);
                                        expectedHue = 'rgba(255, 255, 255, 0.5)';
                                        break;
                                    case 'regular':
                                        console.info(`At REGULAR style type`);
                                        expectedHue = 'rgb(250, 250, 250)';
                                        break;
                                    case 'strong':
                                        console.info(`At STRONG style type`);
                                        expectedHue = 'rgb(93, 129, 9)';
                                        break;

                                    default:
                                        console.info(`At DEFAULT style type`);
                                        expectedHue = '';
                                        break;
                                }
                                expect('rgb' + backgroundHue + ')').to.equal(expectedHue);
                                await driver.click(chips.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: chips with [style type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [style type = "regular"]`, async function () {
                            await driver.click(chips.ResetControlsButton);
                            await driver.click(await chips.getInputRowSelectorByName('xAlignment'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `style type changed to 'regular'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleChips = await driver.findElement(chips.MainExampleChips_singleChip);
                            mainExampleChipsStyle = await mainExampleChips.getCssValue('background');
                            console.info('mainExampleChips: ', mainExampleChips);
                            console.info('mainExampleChipsStyle: ', mainExampleChipsStyle);
                            await driver.click(chips.MainHeader);
                            driver.sleep(0.1 * 1000);
                            const backgroundColor = mainExampleChipsStyle.split('rgb(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: chips with [style type = 'regular']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(backgroundColor).to.equal('250, 250, 250');
                            await driver.click(chips.MainHeader);
                        });
                        break;

                    case 'type':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('type')).to.be.true;
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
                        // it(`validate current type is "input"`, async function () {
                        //     try {
                        //         const chipsElement = await driver.findElement(chips.MainExampleChips_input);
                        //         const chipsElementType = await chipsElement.getAttribute('outerHTML');
                        //         console.info('chipsElement: ', chipsElement);
                        //         expect(chipsElementType).to.equal('input');
                        //     } catch (error) {
                        //         console.error(error);
                        //         throw new Error('Default type is not INPUT!')
                        //     }
                        // });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                let mainExampleSelector;
                                switch (title) {
                                    case 'input':
                                        mainExampleSelector = chips.MainExampleChips_input;
                                        break;
                                    case 'select':
                                        mainExampleSelector = chips.MainExampleChips_select;
                                        break;

                                    default:
                                        mainExampleSelector = chips.MainExampleChips;
                                        break;
                                }
                                await driver.findElement(mainExampleSelector);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(chips.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(chipsInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        it(`get all xAlignments`, async function () {
                            allAlignments = await storyBookPage.inputs.getAllxAlignments();
                            driver.sleep(1 * 1000);
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await chips.getTxtAlignmentByComponent('chips');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(chips.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: chips with x-alignment = '${title}'`,
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
        chipsOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await chips.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'fieldClick':
                        it(`it '${output}'`, async function () {
                            expect(chipsOutputsTitles.includes('fieldClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'selectionChange':
                        it(`it '${output}'`, async function () {
                            expect(chipsOutputsTitles.includes('selectionChange')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
        chipsMethods.forEach(async (method) => {
            describe(`METHOD: '${method}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await chips.getMethodRowSelectorByName(method));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${method}' method`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (method) {
                    case 'addChipsToList':
                        it(`it '${method}'`, async function () {
                            expect(chipsMethodsTitles.includes('addChipsToList')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Method: "${method}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            chipsSubFoldersHeaders.forEach(async (header, index) => {
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
                });
            });
        });
    });
}
