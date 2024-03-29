import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Search } from '../../pom/Pages/StorybookComponents/Search';

chai.use(promised);

export async function StorybookSearchTests() {
    const searchInputs = ['value', 'shrink', 'sizeType', 'triggerOn'];
    const searchProperties = ['fadeState'];
    const searchOutputs = ['search'];
    const searchSubFoldersHeaders = ['Shrink', 'Shrink on small screens', 'Keydown'];
    const sizeTypesExpectedValues = ['xs', 'sm', 'md', 'lg', 'xl'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let search: Search;
    let searchInputsTitles;
    let searchPropertiesTitles;
    let searchOutputsTitles;
    let allSizeTypes;
    let mainExampleSearch;
    let mainExampleSearchHeight;

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await search.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(search.Inputs_mainTableRow);
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
                    case 'value':
                        it(`validate input`, async function () {
                            expect(searchInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "Type your search here..."`, async function () {
                            const expectedValue = 'Type your search here...';
                            await driver.click(search.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Type your search here..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await search.getMainExampleSearchValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "Auto test" ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 'Auto test';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await search.getMainExampleSearchValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        it(`back to default [ control = "Type your search here..." ](+screenshots)`, async function () {
                            await driver.click(search.ResetControlsButton);
                            const expectedValue = 'Type your search here...';
                            await driver.click(search.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Type your search here..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await search.getMainExampleSearchValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'shrink':
                        it(`it '${input}'`, async function () {
                            expect(searchInputsTitles.includes('shrink')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'sizeType':
                        it(`validate input`, async function () {
                            expect(searchInputsTitles.includes('sizeType')).to.be.true;
                        });
                        it(`get all size types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allSizeTypes = await storyBookPage.inputs.getAllSizeTypes();
                            driver.sleep(1 * 1000);
                            console.info('allSizeTypes length: ', allSizeTypes.length);
                            expect(allSizeTypes.length).equals(sizeTypesExpectedValues.length);
                        });
                        it(`validate current size type is "md"`, async function () {
                            mainExampleSearch = await driver.findElement(search.MainExampleSearch);
                            mainExampleSearchHeight = await mainExampleSearch.getCssValue('height');
                            console.info('mainExampleSearchHeight: ', mainExampleSearchHeight);
                            expect(mainExampleSearchHeight).to.equal('40px');
                        });
                        sizeTypesExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const sizeType = allSizeTypes[index];
                                await sizeType.click();
                                mainExampleSearch = await driver.findElement(search.MainExampleSearch);
                                mainExampleSearchHeight = await mainExampleSearch.getCssValue('height');
                                console.info('mainExampleSearchHeight: ', mainExampleSearchHeight);
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
                                        expectedHeight = '56px';
                                        break;

                                    default:
                                        expectedHeight = '';
                                        break;
                                }
                                expect(mainExampleSearchHeight).to.equal(expectedHeight);
                                await driver.click(search.MainHeader);
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
                            mainExampleSearch = await driver.findElement(search.MainExampleSearch);
                            mainExampleSearchHeight = await mainExampleSearch.getCssValue('height');
                            console.info('mainExampleSearchHeight: ', mainExampleSearchHeight);
                            await driver.click(search.MainHeader);
                            driver.sleep(0.1 * 1000);
                            expect(mainExampleSearchHeight).to.equal('40px');
                        });
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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await search.getPropertyRowSelectorByName(property));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${property}' property`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await search.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
