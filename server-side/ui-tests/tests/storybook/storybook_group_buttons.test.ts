import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { GroupButtons } from '../../pom/Pages/StorybookComponents/GroupButtons';

chai.use(promised);

export async function StorybookGroupButtonsTests() {
    const groupButtonsInputs = [
        'buttons',
        'buttonsDisabled',
        'selectedButtonKey',
        'sizeType',
        'stretch',
        'styleType',
        'supportUnselect',
        'viewType',
    ];
    const groupButtonsOutputs = ['buttonClick'];
    const groupButtonsSubFoldersHeaders = [
        'Regular view type',
        'Dropdown view type',
        'Split view type',
        'Toggle view type w/ initial selection',
        'Toggle view type wo/ initial selection',
    ];
    const sizeTypesExpectedValues = ['xs', 'sm', 'md', 'lg', 'xl'];
    const styleTypeExpectedValues = ['weak', 'weak-invert', 'regular', 'strong'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let groupButtons: GroupButtons;
    let groupButtonsInputsTitles;
    let groupButtonsOutputsTitles;
    let allSizeTypes;
    let mainExampleGroupButtons;
    let mainExampleGroupButtonsHeight;
    let mainExampleGroupButtonsStyle;
    let allStyleTypes;

    describe('Storybook "GroupButtons" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            groupButtons = new GroupButtons(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* GroupButtons Component * Initial Testing', () => {
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
            it(`Enter ** GroupButtons ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('group-buttons');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** GroupButtons ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await groupButtons.doesGroupButtonsComponentFound();
                groupButtonsInputsTitles = await groupButtons.getInputsTitles();
                console.info('groupButtonsInputsTitles:', JSON.stringify(groupButtonsInputsTitles, null, 2));
                groupButtonsOutputsTitles = await groupButtons.getOutputsTitles();
                console.info('groupButtonsOutputsTitles:', JSON.stringify(groupButtonsOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(groupButtonsInputsTitles).to.eql(groupButtonsInputs);
                expect(groupButtonsOutputsTitles).to.eql(groupButtonsOutputs);
                driver.sleep(1 * 1000);
            });
        });
        groupButtonsInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await groupButtons.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(groupButtons.Inputs_mainTableRow);
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
                    case 'buttons':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('buttons')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'buttonsDisabled':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('buttonsDisabled')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'selectedButtonKey':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('selectedButtonKey')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'sizeType':
                        it(`validate input`, async function () {
                            expect(groupButtonsInputsTitles.includes('sizeType')).to.be.true;
                        });
                        it(`get all size types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allSizeTypes = await storyBookPage.inputs.getAllSizeTypes();
                            driver.sleep(1 * 1000);
                            console.info('allSizeTypes: ', JSON.stringify(allSizeTypes, null, 2));
                            console.info('allSizeTypes length: ', allSizeTypes.length);
                            expect(allSizeTypes.length).equals(sizeTypesExpectedValues.length);
                        });
                        it(`validate current size type is "md"`, async function () {
                            mainExampleGroupButtons = await driver.findElement(
                                groupButtons.MainExampleGroupButtons_singleButton,
                            );
                            mainExampleGroupButtonsHeight = await mainExampleGroupButtons.getCssValue('height');
                            console.info('mainExampleGroupButtonsHeight: ', mainExampleGroupButtonsHeight);
                            expect(mainExampleGroupButtonsHeight).to.equal('40px');
                        });
                        sizeTypesExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const sizeType = allSizeTypes[index];
                                await sizeType.click();
                                mainExampleGroupButtons = await driver.findElement(
                                    groupButtons.MainExampleGroupButtons_singleButton,
                                );
                                mainExampleGroupButtonsHeight = await mainExampleGroupButtons.getCssValue('height');
                                console.info('mainExampleGroupButtonsHeight: ', mainExampleGroupButtonsHeight);
                                const base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (sizeType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                let expectedHeight;
                                switch (title) {
                                    case 'xs':
                                        expectedHeight = '24px';
                                        break;
                                    case 'sm':
                                        expectedHeight = '32px';
                                        break;
                                    case 'md':
                                        expectedHeight = '40px';
                                        break;
                                    case 'lg':
                                        expectedHeight = '48px';
                                        break;
                                    case 'xl':
                                        expectedHeight = '64px';
                                        break;

                                    default:
                                        expectedHeight = '';
                                        break;
                                }
                                expect(mainExampleGroupButtonsHeight).to.equal(expectedHeight);
                                await driver.click(groupButtons.MainHeader);
                                driver.sleep(0.1 * 1000);
                            });
                        });
                        it(`back to default [size type = "md"]`, async function () {
                            await allSizeTypes[2].click();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `size type changed to 'md'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleGroupButtons = await driver.findElement(
                                groupButtons.MainExampleGroupButtons_singleButton,
                            );
                            mainExampleGroupButtonsHeight = await mainExampleGroupButtons.getCssValue('height');
                            console.info('mainExampleGroupButtonsHeight: ', mainExampleGroupButtonsHeight);
                            await driver.click(groupButtons.MainHeader);
                            driver.sleep(0.1 * 1000);
                            expect(mainExampleGroupButtonsHeight).to.equal('40px');
                        });
                        break;

                    case 'stretch':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('stretch')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'styleType':
                        it(`validate input`, async function () {
                            expect(groupButtonsInputsTitles.includes('styleType')).to.be.true;
                            await driver.click(await groupButtons.getInputRowSelectorByName('viewType'));
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
                        it(`validate current style type is "weak"`, async function () {
                            mainExampleGroupButtons = await driver.findElement(
                                groupButtons.MainExampleGroupButtons_singleButton,
                            );
                            mainExampleGroupButtonsStyle = await mainExampleGroupButtons.getCssValue('background');
                            console.info('mainExampleGroupButtons: ', mainExampleGroupButtons);
                            console.info('mainExampleGroupButtonsStyle: ', mainExampleGroupButtonsStyle);
                            const backgroundColor = mainExampleGroupButtonsStyle.split('rgba(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            expect(backgroundColor).to.equal('26, 26, 26, 0.12');
                        });
                        styleTypeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const styleType = allStyleTypes[index];
                                await styleType.click();
                                mainExampleGroupButtons = await driver.findElement(
                                    groupButtons.MainExampleGroupButtons_singleButton,
                                );
                                mainExampleGroupButtonsStyle = await mainExampleGroupButtons.getCssValue('background');
                                console.info('mainExampleGroupButtonsStyle: ', mainExampleGroupButtonsStyle);
                                await driver.click(await groupButtons.getInputRowSelectorByName('viewType'));
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (styleType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                const backgroundHue = mainExampleGroupButtonsStyle.split('rgb')[1].split(')')[0];
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
                                await driver.click(groupButtons.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: groupButtons with [style type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [style type = "weak"]`, async function () {
                            await driver.click(groupButtons.ResetControlsButton);
                            await driver.click(await groupButtons.getInputRowSelectorByName('viewType'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `style type changed to 'weak'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleGroupButtons = await driver.findElement(
                                groupButtons.MainExampleGroupButtons_singleButton,
                            );
                            mainExampleGroupButtonsStyle = await mainExampleGroupButtons.getCssValue('background');
                            console.info('mainExampleGroupButtons: ', mainExampleGroupButtons);
                            console.info('mainExampleGroupButtonsStyle: ', mainExampleGroupButtonsStyle);
                            await driver.click(groupButtons.MainHeader);
                            driver.sleep(0.1 * 1000);
                            const backgroundColor = mainExampleGroupButtonsStyle.split('rgba(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: groupButtons with [style type = 'weak']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(backgroundColor).to.equal('26, 26, 26, 0.12');
                            await driver.click(groupButtons.MainHeader);
                        });
                        break;

                    case 'supportUnselect':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('supportUnselect')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'viewType':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('viewType')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        groupButtonsOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await groupButtons.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'buttonClick':
                        it(`it '${output}'`, async function () {
                            expect(groupButtonsOutputsTitles.includes('buttonClick')).to.be.true;
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
            groupButtonsSubFoldersHeaders.forEach(async (header, index) => {
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
