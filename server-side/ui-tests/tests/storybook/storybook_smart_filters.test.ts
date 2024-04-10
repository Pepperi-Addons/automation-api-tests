import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { SmartFilters } from '../../pom/Pages/StorybookComponents/SmartFilters';

chai.use(promised);

export async function StorybookSmartFiltersTests() {
    const smartFiltersInputs = ['fields', 'filters', 'title'];
    const smartFiltersOutputs = ['fieldToggleChange', 'filtersChange'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let smartFilters: SmartFilters;
    let smartFiltersInputsTitles;
    let smartFiltersOutputsTitles;

    describe('Storybook "Smart Filters" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            smartFilters = new SmartFilters(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* SmartFilters Component * Initial Testing', () => {
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
            it(`Enter ** SmartFilters ** Component StoryBook - SCREENSHOT`, async function () {
                await driver.scrollToElement(storyBookPage.SidebarExampleHeader); // for the purpose of navigating to the area of 'Smart filters' at sidebar menu
                await storyBookPage.chooseComponent('smart-filters');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** SmartFilters ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await smartFilters.doesSmartFiltersComponentFound();
                smartFiltersInputsTitles = await smartFilters.getInputsTitles();
                console.info('smartFiltersInputsTitles:', JSON.stringify(smartFiltersInputsTitles, null, 2));
                smartFiltersOutputsTitles = await smartFilters.getOutputsTitles();
                console.info('smartFiltersOutputsTitles:', JSON.stringify(smartFiltersOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(smartFiltersInputsTitles).to.eql(smartFiltersInputs);
                expect(smartFiltersOutputsTitles).to.eql(smartFiltersOutputs);
                driver.sleep(5 * 1000);
            });
        });
        smartFiltersInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await smartFilters.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(smartFilters.Inputs_mainTableRow);
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
                    case 'fields':
                        it(`it '${input}'`, async function () {
                            expect(smartFiltersInputsTitles.includes('fields')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'filters':
                        it(`it '${input}'`, async function () {
                            expect(smartFiltersInputsTitles.includes('filters')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'title':
                        it(`it '${input}'`, async function () {
                            expect(smartFiltersInputsTitles.includes('title')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        smartFiltersOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await smartFilters.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'fieldToggleChange':
                        it(`it '${output}'`, async function () {
                            expect(smartFiltersOutputsTitles.includes('fieldToggleChange')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'filtersChange':
                        it(`it '${output}'`, async function () {
                            expect(smartFiltersOutputsTitles.includes('filtersChange')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Output: "${output}" is not covered in switch!`);
                    // break;
                }
            });
        });
    });
}
