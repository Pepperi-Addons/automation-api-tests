import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Menu } from '../pom/Pages/StorybookComponents/Menu';

chai.use(promised);

export async function StorybookMenuTests() {
    const menuInputs = [
        'iconName',
        'items',
        'classNames',
        'disabled',
        'selectedItem',
        'sizeType',
        'styleType',
        'text',
        'type',
    ];
    const menuOutputs = ['menuClick', 'menuItemClick'];
    const menuSubFoldersHeaders = ['Action (default)', 'Action select', 'Select'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let menu: Menu;
    let menuInputsTitles;
    let menuOutputsTitles;

    describe('Storybook "Menu" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            menu = new Menu(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Menu Component * Initial Testing', () => {
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
            it(`Enter ** Menu ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('menu');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Menu ** Component`, async function () {
                await menu.doesMenuComponentFound();
                menuInputsTitles = await menu.getInputsTitles();
                console.info('menuInputsTitles:', JSON.stringify(menuInputsTitles, null, 2));
                menuOutputsTitles = await menu.getOutputsTitles();
                console.info('menuOutputsTitles:', JSON.stringify(menuOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(menuInputsTitles).to.eql(menuInputs);
                expect(menuOutputsTitles).to.eql(menuOutputs);
                driver.sleep(5 * 1000);
            });
        });
        menuInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'iconName':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('iconName')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'items':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('items')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'classNames':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('classNames')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'selectedItem':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('selectedItem')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'sizeType':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('sizeType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('styleType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'text':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('text')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('type')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        menuOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'menuClick':
                        it(`it '${output}'`, async function () {
                            expect(menuOutputsTitles.includes('menuClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'menuItemClick':
                        it(`it '${output}'`, async function () {
                            expect(menuOutputsTitles.includes('menuItemClick')).to.be.true;
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
            menuSubFoldersHeaders.forEach(async (header, index) => {
                describe(`"${header}"`, async function () {
                    it(`Navigate to story`, async function () {
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
