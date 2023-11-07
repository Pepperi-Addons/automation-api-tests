import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Checkbox } from '../../pom/Pages/StorybookComponents/Checkbox';

chai.use(promised);

export async function StorybookCheckboxTests() {
    const checkboxInputs = [
        'label',
        'value',
        'additionalValue',
        'disabled',
        'mandatory',
        'renderTitle',
        'showTitle',
        'type',
        'visible',
        'xAlignment',
    ];
    const checkboxOutputs = ['valueChange'];
    const checkboxStoriesHeaders = [
        'No label',
        'Disabled & checked',
        'Disabled & unchecked',
        'Flipped & mandatory',
        'Type is booleanText',
    ];
    const typeExpectedValues = ['checkbox', 'booleanText'];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let checkbox: Checkbox;
    let checkboxInputsTitles;
    let checkboxOutputsTitles;
    let allTypes;
    let allAlignments;

    describe('Storybook "Checkbox" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            checkbox = new Checkbox(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Checkbox Component * Initial Testing', () => {
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
            it(`Enter ** Checkbox ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('checkbox');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Checkbox ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await checkbox.doesCheckboxComponentFound();
                checkboxInputsTitles = await checkbox.getInputsTitles();
                console.info('checkboxInputsTitles:', JSON.stringify(checkboxInputsTitles, null, 2));
                checkboxOutputsTitles = await checkbox.getOutputsTitles();
                console.info('checkboxOutputsTitles:', JSON.stringify(checkboxOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(checkboxInputsTitles).to.eql(checkboxInputs);
                expect(checkboxOutputsTitles).to.eql(checkboxOutputs);
                driver.sleep(5 * 1000);
            });
        });
        checkboxInputs.forEach(async (input) => {
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
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(checkbox.Inputs_mainTableRow);
                    if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                        await inputsMainTableRowElement.click();
                    }
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it(`SCREENSHOT`, async function () {
                    await driver.click(await checkbox.getInputRowSelectorByName(input));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (input) {
                    case 'label':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('label')).to.be.true;
                            await driver.click(checkbox.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await checkbox.getMainExampleLabel('checkbox');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxAriaChecked = await mainExampleCheckbox.getAttribute(
                                'aria-checked',
                            );
                            expect(mainExampleCheckboxAriaChecked).equals('true');
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleValueControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxAriaChecked = await mainExampleCheckbox.getAttribute(
                                'aria-checked',
                            );
                            expect(mainExampleCheckboxAriaChecked).equals('false');
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleValueControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxAriaChecked = await mainExampleCheckbox.getAttribute(
                                'aria-checked',
                            );
                            expect(mainExampleCheckboxAriaChecked).equals('true');
                        });
                        break;

                    case 'additionalValue':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('additionalValue')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxDisabled = await mainExampleCheckbox.getAttribute('disabled');
                            console.info(
                                'mainExampleCheckboxDisabled (false): ',
                                JSON.stringify(mainExampleCheckboxDisabled, null, 2),
                            );
                            expect(mainExampleCheckboxDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxDisabled = await mainExampleCheckbox.getAttribute('disabled');
                            console.info(
                                'mainExampleCheckboxDisabled (true): ',
                                JSON.stringify(mainExampleCheckboxDisabled, null, 2),
                            );
                            expect(mainExampleCheckboxDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxDisabled = await mainExampleCheckbox.getAttribute('disabled');
                            expect(mainExampleCheckboxDisabled).to.be.null;
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('mandatory')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(checkbox.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(checkbox.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(checkbox.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(checkbox.MainExample_pepTitle);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(checkbox.MainExample_pepTitle);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(checkbox.MainExample_pepTitle);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of ShowTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // await storyBookPage.untilIsVisible(checkbox.MainExample_pepTitle); // need to find the right indication
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of ShowTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // await storyBookPage.elemntDoNotExist(checkbox.MainExample_pepTitle); // need to find the right indication
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of ShowTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // await storyBookPage.untilIsVisible(checkbox.MainExample_pepTitle); // need to find the right indication
                        });
                        break;

                    case 'type':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('type')).to.be.true;
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
                        it(`validate current type is "checkbox"`, async function () {
                            const checkboxElement = await driver.findElement(checkbox.MainExampleCheckbox);
                            const checkboxElementType = await checkboxElement.getAttribute('type');
                            console.info('checkboxElement: ', checkboxElement);
                            expect(checkboxElementType).to.equal('checkbox');
                        });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                let mainExampleSelector;
                                switch (title) {
                                    case 'booleanText':
                                        mainExampleSelector = checkbox.MainExampleBooleanText;
                                        break;

                                    default:
                                        mainExampleSelector = checkbox.MainExampleCheckbox;
                                        break;
                                }
                                await driver.findElement(mainExampleSelector);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(checkbox.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        break;

                    case 'visible':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('visible')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExamplePepCheckbox = await driver.findElement(checkbox.MainExamplePepCheckbox);
                            const mainExamplePepCheckboxClasses = await mainExamplePepCheckbox.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepCheckboxClasses).to.not.include('hidden-element');
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleVisibleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            try {
                                const mainExamplePepCheckbox = await driver.findElement(
                                    checkbox.MainExamplePepCheckbox,
                                );
                                const mainExamplePepCheckboxClasses = await mainExamplePepCheckbox.getAttribute(
                                    'class',
                                );
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(mainExamplePepCheckboxClasses).to.include('hidden-element');
                            } catch (error) {
                                console.error(error);
                                const theError = error as Error;
                                console.info("Can't find Pep-Checkbox");
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(theError.message).contains(
                                    `After wait time of: 15000, for selector of '//div[@id="story--components-checkbox--story-1"]//pep-checkbox', The test must end, The element is not visible`,
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
                            await driver.click(checkbox.MainHeader);
                            const mainExamplePepCheckbox = await driver.findElement(checkbox.MainExamplePepCheckbox);
                            const mainExamplePepCheckboxClasses = await mainExamplePepCheckbox.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepCheckboxClasses).to.not.include('hidden-element');
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('xAlignment')).to.be.true;
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
                            // const currentAlign = await checkbox.getTxtAlignmentByComponent('checkbox');
                            await driver.click(checkbox.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: checkbox with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await checkbox.getTxtAlignmentByComponent('checkbox');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(checkbox.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: checkbox with x-alignment = '${title}'`,
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
        checkboxOutputs.forEach(async (output, index) => {
            describe(`OUTPUT: '${output}'`, async function () {
                if (index === 0) {
                    it(`close Inputs`, async function () {
                        const inputsMainTableRowElement = await driver.findElement(checkbox.Inputs_mainTableRow);
                        if ((await inputsMainTableRowElement.getAttribute('title')).includes('Hide')) {
                            await inputsMainTableRowElement.click();
                        }
                    });
                }
                it(`SCREENSHOT`, async function () {
                    await driver.click(await checkbox.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`validate output`, async function () {
                            expect(checkboxOutputsTitles.includes('valueChange')).to.be.true;
                        });
                        it(`validate '${output}' output control value [ "new EventEmitter<boolean>()" ]`, async function () {
                            const selectorOfOutputControl = await checkbox.getSelectorOfOutputControlByName(output);
                            const outputControlValue = await (
                                await driver.findElement(selectorOfOutputControl)
                            ).getText();
                            expect(outputControlValue.trim()).equals(`"new EventEmitter<boolean>()"`);
                        });
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            checkboxStoriesHeaders.forEach(async (header, index) => {
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
                    // it(`it '${header}'`, async function () {
                    // let headerText = '';
                    // switch (header) {
                    //     case 'No label':
                    //         headerText = header.toLowerCase().replace(' ', '-');
                    //         break;
                    //     case 'Disabled & checked':
                    //     case 'Disabled & unchecked':
                    //     case 'Flipped & mandatory':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace('&', '-').replace(' ', '-');
                    //         break;
                    //     case 'Type is booleanText':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                    //         break;

                    //     default:
                    //         throw new Error(`Header: "${header}" is not covered in switch!`);
                    //         // break;
                    // }

                    // });
                });
            });
        });
    });
}
