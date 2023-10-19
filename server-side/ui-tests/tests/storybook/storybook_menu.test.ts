import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Menu } from '../../pom/Pages/StorybookComponents/Menu';

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
            it(`Enter ** Menu ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('menu');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Menu ** Component - ASSERTIONS + SCREENSHOT`, async function () {
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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await menu.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(menu.Inputs_mainTableRow);
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
                    case 'iconName':
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('iconName')).to.be.true;
                        });
                        it(`Functional test [ control = 'arrow_up' ](+screenshots)`, async function () {
                            const newIconNameToSelect = 'arrow_up';
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.selectIconName(newIconNameToSelect);
                            await driver.scrollToElement(menu.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Icon Name Select Changed to "${newIconNameToSelect}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExampleMenuIcon = await driver.findElement(menu.MainExampleMenu_icon);
                            const mainExampleMenuIconSvgValue = await (
                                await driver.findElement(menu.MainExampleMenu_iconSvgValue)
                            ).getAttribute('d');
                            console.info(
                                'mainExampleMenuIconSvgValue: ',
                                JSON.stringify(mainExampleMenuIconSvgValue, null, 2),
                            );
                            expect(mainExampleMenuIcon).to.not.be.undefined.and.not.be.null;
                            expect(mainExampleMenuIconSvgValue).equals(
                                'M18.2 14.713l-5.454-3.916a1.113 1.113 0 00-1.492 0L5.8 14.713a1.113 1.113 0 01-1.491 0 .93.93 0 010-1.384l6.2-5.756c.823-.764 2.159-.764 2.982 0l6.2 5.756a.93.93 0 010 1.384 1.113 1.113 0 01-1.491 0z',
                            );
                        });
                        it(`Functional test [ control = 'device_mobile' ](+screenshots)`, async function () {
                            const newIconNameToSelect = 'device_mobile';
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.selectIconName(newIconNameToSelect);
                            await driver.scrollToElement(menu.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Icon Name Select Changed to "${newIconNameToSelect}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExampleMenuIcon = await driver.findElement(menu.MainExampleMenu_icon);
                            const mainExampleMenuIconSvgValue = await (
                                await driver.findElement(menu.MainExampleMenu_iconSvgValue)
                            ).getAttribute('d');
                            console.info(
                                'mainExampleMenuIconSvgValue: ',
                                JSON.stringify(mainExampleMenuIconSvgValue, null, 2),
                            );
                            expect(mainExampleMenuIcon).to.not.be.undefined.and.not.be.null;
                            expect(mainExampleMenuIconSvgValue).equals(
                                'M16 3a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2h8zm-1 2H9a1 1 0 00-1 1v12a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1zm-1 11a1 1 0 010 2h-4a1 1 0 010-2h4z',
                            );
                        });
                        break;
                    case 'items':
                        it(`it '${input}'`, async function () {
                            expect(menuInputsTitles.includes('items')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'classNames':
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('classNames')).to.be.true;
                        });
                        it(`[ control = 'rotate3d' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = 'rotate3d';
                            await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(menu.MainExampleMenu)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.contain(newClassNamesToSet);
                        });
                        it(`[ control = '' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = '';
                            await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(menu.MainExampleMenu)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.not.contain('rotate3d');
                        });
                        break;
                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(menu.MainHeader);
                            const mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            const mainExampleMenuDisabled = await mainExampleMenu.getAttribute('disabled');
                            console.info(
                                'mainExampleMenuDisabled (false): ',
                                JSON.stringify(mainExampleMenuDisabled, null, 2),
                            );
                            expect(mainExampleMenuDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(menu.MainHeader);
                            const mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            const mainExampleMenuDisabled = await mainExampleMenu.getAttribute('disabled');
                            console.info(
                                'mainExampleMenuDisabled (true): ',
                                JSON.stringify(mainExampleMenuDisabled, null, 2),
                            );
                            expect(mainExampleMenuDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(menu.MainHeader);
                            const mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            const mainExampleMenuDisabled = await mainExampleMenu.getAttribute('disabled');
                            expect(mainExampleMenuDisabled).to.be.null;
                        });
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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await menu.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
