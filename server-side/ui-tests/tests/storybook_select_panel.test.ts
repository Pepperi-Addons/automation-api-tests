import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { SelectPanel } from '../pom/Pages/StorybookComponents/SelectPanel';

chai.use(promised);

export async function StorybookSelectPanelTests() {
    const selectPanelInputs = [
        'label',
        'value',
        'options',
        'isMultiSelect',
        'classNames',
        'disabled',
        'mandatory',
        'numOfCol',
        'showTitle',
        'xAlignment',
    ];
    const selectPanelOutputs = ['valueChange'];
    const selectPanelSubFoldersHeaders = ['Multi select', 'Single select', 'RTL'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let selectPanel: SelectPanel;
    let selectPanelInputsTitles;
    let selectPanelOutputsTitles;

    describe('Storybook "SelectPanel" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            selectPanel = new SelectPanel(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* SelectPanel Component * Initial Testing', () => {
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
            it(`Enter ** SelectPanel ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('select-panel');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** SelectPanel ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await selectPanel.doesSelectPanelComponentFound();
                selectPanelInputsTitles = await selectPanel.getInputsTitles();
                console.info('selectPanelInputsTitles:', JSON.stringify(selectPanelInputsTitles, null, 2));
                selectPanelOutputsTitles = await selectPanel.getOutputsTitles();
                console.info('selectPanelOutputsTitles:', JSON.stringify(selectPanelOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(selectPanelInputsTitles).to.eql(selectPanelInputs);
                expect(selectPanelOutputsTitles).to.eql(selectPanelOutputs);
                driver.sleep(5 * 1000);
            });
        });
        selectPanelInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'options':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('options')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'isMultiSelect':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('isMultiSelect')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'classNames':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('classNames')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'numOfCol':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('numOfCol')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(selectPanelInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        selectPanelOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(selectPanelOutputsTitles.includes('valueChange')).to.be.true;
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
            selectPanelSubFoldersHeaders.forEach(async (header, index) => {
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
