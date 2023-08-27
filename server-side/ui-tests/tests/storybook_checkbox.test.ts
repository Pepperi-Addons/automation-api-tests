import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Checkbox } from '../pom/Pages/StorybookComponents/Checkbox';

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
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let checkbox: Checkbox;
    let checkboxInputsTitles;
    let checkboxOutputsTitles;

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await checkbox.getInputRowSelectorByName(input));
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
                switch (input) {
                    case 'label':
                        it(`validate input`, async function () {
                            expect(checkboxInputsTitles.includes('label')).to.be.true;
                            await driver.click(checkbox.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabel(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await checkbox.getMainExampleLabel();
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxAriaChecked = await mainExampleCheckbox.getAttribute(
                                'aria-checked',
                            );
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Value Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExampleCheckboxAriaChecked).equals('true');
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
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
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(checkbox.MainHeader);
                            const mainExampleCheckbox = await driver.findElement(checkbox.MainExampleCheckbox);
                            const mainExampleCheckboxAriaChecked = await mainExampleCheckbox.getAttribute(
                                'aria-checked',
                            );
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Value Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExampleCheckboxAriaChecked).equals('true');
                        });
                        break;
                    case 'additionalValue':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('additionalValue')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'visible':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('visible')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        checkboxOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(checkboxOutputsTitles.includes('valueChange')).to.be.true;
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
