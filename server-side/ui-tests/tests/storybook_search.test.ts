import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Search } from '../pom/Pages/StorybookComponents/Search';

chai.use(promised);

export async function StorybookSearchTests() {
    const searchInputs = ['value', 'shrink', 'sizeType', 'triggerOn'];
    const searchProperties = ['fadeState'];
    const searchOutputs = ['search'];
    const searchSubFoldersHeaders = ['Shrink', 'Shrink on small screens', 'Keydown'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let search: Search;
    let searchInputsTitles;
    let searchPropertiesTitles;
    let searchOutputsTitles;

    describe('Storybook "Search" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            search = new Search(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Search Component * Initial Testing', () => {
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
            it(`Enter ** Search ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('search');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Search ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await search.doesSearchComponentFound();
                searchInputsTitles = await search.getInputsTitles();
                console.info('searchInputsTitles:', JSON.stringify(searchInputsTitles, null, 2));
                searchPropertiesTitles = await search.getPropertiesTitles();
                console.info('searchPropertiesTitles:', JSON.stringify(searchPropertiesTitles, null, 2));
                searchOutputsTitles = await search.getOutputsTitles();
                console.info('searchOutputsTitles:', JSON.stringify(searchOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(searchInputsTitles).to.eql(searchInputs);
                expect(searchOutputsTitles).to.eql(searchOutputs);
                driver.sleep(5 * 1000);
            });
        });
        searchInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(searchInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'shrink':
                        it(`it '${input}'`, async function () {
                            expect(searchInputsTitles.includes('shrink')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'sizeType':
                        it(`it '${input}'`, async function () {
                            expect(searchInputsTitles.includes('sizeType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'triggerOn':
                        it(`it '${input}'`, async function () {
                            expect(searchInputsTitles.includes('triggerOn')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        searchProperties.forEach(async (property) => {
            describe(`PROPERTY: '${property}'`, async function () {
                switch (property) {
                    case 'fadeState':
                        it(`it '${property}'`, async function () {
                            expect(searchPropertiesTitles.includes('fadeState')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Property: "${property}" is not covered in switch!`);
                    // break;
                }
            });
        });
        searchOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'search':
                        it(`it '${output}'`, async function () {
                            expect(searchOutputsTitles.includes('search')).to.be.true;
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
            searchSubFoldersHeaders.forEach(async (header, index) => {
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
