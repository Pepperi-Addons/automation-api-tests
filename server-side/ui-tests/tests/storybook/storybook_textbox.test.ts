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
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let textbox: Textbox;
    let textboxInputsTitles;
    let textboxOutputsTitles;
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
                        it(`making sure current value is "True"`, async function () {
                            // await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxAriaChecked = await mainExampleTextbox.getAttribute('aria-checked');
                            expect(mainExampleTextboxAriaChecked).equals('true');
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleValueControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxAriaChecked = await mainExampleTextbox.getAttribute('aria-checked');
                            expect(mainExampleTextboxAriaChecked).equals('false');
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleValueControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(textbox.MainHeader);
                            const mainExampleTextbox = await driver.findElement(textbox.MainExampleTextbox);
                            const mainExampleTextboxAriaChecked = await mainExampleTextbox.getAttribute('aria-checked');
                            expect(mainExampleTextboxAriaChecked).equals('true');
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
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(textbox.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(textbox.MainExample_mandatoryIcon);
                        });
                        break;
                    case 'maxFieldCharacters':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'regex':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('regex')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'regexError':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('regexError')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderError':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('renderError')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderSymbol':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('renderSymbol')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        // TODO
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
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('textColor')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(textboxInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
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
