import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Select } from '../pom/Pages/StorybookComponents/Select';

chai.use(promised);

export async function StorybookSelectTests() {
    const selectInputs = [
        'label',
        'options',
        'disabled',
        'mandatory',
        'readonly',
        'showTitle',
        'type',
        'value',
        'xAlignment',
    ];
    const selectOutputs = ['valueChange'];
    const selectSubFoldersHeaders = [
        'With initial value',
        'Multi-select',
        'Multi-select with initial value',
        'Disabled',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let select: Select;
    let selectInputsTitles;
    let selectOutputsTitles;

    describe('Storybook "Select" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            select = new Select(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Select Component * Initial Testing', () => {
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
            it(`Enter ** Select ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('select');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Select ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await select.doesSelectComponentFound();
                selectInputsTitles = await select.getInputsTitles();
                console.info('selectInputsTitles:', JSON.stringify(selectInputsTitles, null, 2));
                selectOutputsTitles = await select.getOutputsTitles();
                console.info('selectOutputsTitles:', JSON.stringify(selectOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(selectInputsTitles).to.eql(selectInputs);
                expect(selectOutputsTitles).to.eql(selectOutputs);
                driver.sleep(5 * 1000);
            });
        });
        selectInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'options':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('options')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'readonly':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('readonly')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(selectInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        selectOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(selectOutputsTitles.includes('valueChange')).to.be.true;
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
            selectSubFoldersHeaders.forEach(async (header, index) => {
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
