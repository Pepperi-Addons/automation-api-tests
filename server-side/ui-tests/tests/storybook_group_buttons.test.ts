import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { GroupButtons } from '../pom/Pages/StorybookComponents/GroupButtons';

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
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let groupButtons: GroupButtons;
    let groupButtonsInputsTitles;
    let groupButtonsOutputsTitles;

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
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('sizeType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'stretch':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('stretch')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(groupButtonsInputsTitles.includes('styleType')).to.be.true;
                        });
                        // TODO
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
