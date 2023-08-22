import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { DraggableItems } from '../pom/Pages/StorybookComponents/DraggableItems';

chai.use(promised);

export async function StorybookDraggableItemsTests() {
    const draggableItemsInputs = [
        'containerId',
        'dropAreaIds',
        'items',
        'showSearch',
        'title',
        'titleSizeType',
        'titleType',
    ];
    const draggableItemsOutputs = ['itemDragEnded', 'itemDragStarted'];
    const draggableItemsSubFoldersHeaders = ['Drag into area', 'Show search box'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let draggableItems: DraggableItems;
    let draggableItemsInputsTitles;
    let draggableItemsOutputsTitles;

    describe('Storybook "DraggableItems" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            draggableItems = new DraggableItems(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* DraggableItems Component * Initial Testing', () => {
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
            it(`Enter ** DraggableItems ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('draggable-items');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** DraggableItems ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await draggableItems.doesDraggableItemsComponentFound();
                draggableItemsInputsTitles = await draggableItems.getInputsTitles();
                console.info('draggableItemsInputsTitles:', JSON.stringify(draggableItemsInputsTitles, null, 2));
                draggableItemsOutputsTitles = await draggableItems.getOutputsTitles();
                console.info('draggableItemsOutputsTitles:', JSON.stringify(draggableItemsOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(draggableItemsInputsTitles).to.eql(draggableItemsInputs);
                expect(draggableItemsOutputsTitles).to.eql(draggableItemsOutputs);
                driver.sleep(5 * 1000);
            });
        });
        draggableItemsInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
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
                    const inputsMainTableRowElement = await driver.findElement(draggableItems.Inputs_mainTableRow);
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
                    case 'containerId':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('containerId')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'dropAreaIds':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('dropAreaIds')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'items':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('items')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showSearch':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('showSearch')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'title':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('title')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'titleSizeType':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('titleSizeType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'titleType':
                        it(`it '${input}'`, async function () {
                            expect(draggableItemsInputsTitles.includes('titleType')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        draggableItemsOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'itemDragEnded':
                        it(`it '${output}'`, async function () {
                            expect(draggableItemsOutputsTitles.includes('itemDragEnded')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'itemDragStarted':
                        it(`it '${output}'`, async function () {
                            expect(draggableItemsOutputsTitles.includes('itemDragStarted')).to.be.true;
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
            draggableItemsSubFoldersHeaders.forEach(async (header, index) => {
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
                    //     case 'Empty date-time':
                    //         headerText = header.toLowerCase().replace(' ', '-');
                    //         break;

                    //     default:
                    //         throw new Error(`Header: "${header}" is not covered in switch!`);
                    //     // break;
                    // }

                    // });
                });
            });
        });
    });
}
