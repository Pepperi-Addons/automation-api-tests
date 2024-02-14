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
    const sizeTypesExpectedValues = ['xs', 'sm', 'md', 'lg', 'xl'];
    const styleTypeExpectedValues = ['weak', 'weak-invert', 'regular', 'strong'];
    const typeExpectedValues = ['action', 'action-select', 'select'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let menu: Menu;
    let menuInputsTitles;
    let menuOutputsTitles;
    let allSizeTypes;
    let mainExampleMenu;
    let mainExampleMenuHeight;
    let mainExampleMenuStyle;
    let allStyleTypes;
    let allTypes;

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
                        it(`reset controls`, async function () {
                            await driver.click(menu.ResetControlsButton);
                            const expectedValue = '01/01/2020';
                            await driver.click(menu.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "${expectedValue}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExampleMenuIconSvgValue = await (
                                await driver.findElement(menu.MainExampleMenu_iconSvgValue)
                            ).getAttribute('d');
                            console.info(
                                'mainExampleMenuIconSvgValue: ',
                                JSON.stringify(mainExampleMenuIconSvgValue, null, 2),
                            );
                            expect(mainExampleMenuIconSvgValue).equals(
                                `M19 16a1 1 0 010 2H5a1 1 0 010-2h14zm0-5a1 1 0 010 2H5a1 1 0 010-2h14zm0-5a1 1 0 010 2H5a1 1 0 110-2h14z`,
                            );
                        });
                        break;

                    case 'items':
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('items')).to.be.true;
                        });
                        it(`making sure current value is 8 items object`, async function () {
                            const expectedItemsContent = `<span class="rejt-not-collapsed-delimiter">[</span><svg viewBox="0 0 1024 1024" class="rejt-plus-menu css-1sq7n9w"><path d="M512-.2a512 512 0 110 1024 512 512 0 010-1024zm0 91.4c-112.3 0-218 43.8-297.4 123.2A417.8 417.8 0 0091.4 511.8c0 112.4 43.8 218 123.2 297.4A417.8 417.8 0 00512 932.4c112.3 0 218-43.8 297.4-123.2a417.8 417.8 0 00123.2-297.4c0-112.3-43.8-218-123.2-297.4A417.8 417.8 0 00512 91.2zm1.1 129.2a45.7 45.7 0 0145.7 45.7v201.1H760a45.7 45.7 0 010 91.5H558.8v201.1a45.7 45.7 0 11-91.4 0V558.7H266.3a45.7 45.7 0 110-91.5h201.1V266.1a45.7 45.7 0 0145.7-45.7z" class="css-kqzqgg"></path></svg><ul class="rejt-not-collapsed-list" style="list-style: none; margin: 0px 0px 0px 1rem; padding: 0px;"><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">0 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">1 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">2 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">3 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">4 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">5 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">6 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">7 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">8 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div></ul><span class="rejt-not-collapsed-delimiter">]</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg>`;
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `items Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const itemsControlContent = await menu.inputs.getItemsControlContent();
                            await driver.click(menu.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of items Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(itemsControlContent).equals(expectedItemsContent);
                            await driver.click(menu.MainExampleMenu);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Menu`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const menuContent = await menu.getMenuContent();
                            const menuContentButtons = await menu.getButtonsOutOfMenuContent();
                            expect(menuContent).to.not.equal('<!---->');
                            expect(menuContentButtons).to.be.an('array').with.lengthOf(8);
                            await driver.click(menu.OverlayContainer);
                        });
                        it(`functional test [ control = [] ] (+screenshot)`, async function () {
                            await driver.click(await menu.getInputRowSelectorByName('classNames'));
                            const newValueToSet = '[]';
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Before Items RAW Button Click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await menu.inputs.toggleItemsControlRawButton();
                            menu.pause(0.5 * 1000);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items RAW Button is Clicked`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await menu.inputs.changeItemsControl(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(menu.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of Items Control Change`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(menu.MainExampleMenu);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Menu`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const menuContent = await menu.getMenuContent();
                            expect(menuContent).equals('<!---->');
                            await driver.click(menu.OverlayContainer);
                        });
                        it(`back to non-functional value [ control = 0 ] (+screenshots)`, async function () {
                            await driver.click(await menu.getInputRowSelectorByName('classNames'));
                            const newValueToSet = `[
                                {
                                  "key": "N",
                                  "text": "Tramontana",
                                  "parent": null,
                                  "selected": true
                                },
                                {
                                  "key": "NE",
                                  "text": "Gregale",
                                  "disabled": true,
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "E",
                                  "text": "Levante",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "SE",
                                  "text": "Scirocco",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "sep",
                                  "type": "splitter",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "S",
                                  "text": "Ostro",
                                  "iconName": "system_link",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "SW",
                                  "text": "Libeccio",
                                  "iconName": "system_lock",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "W",
                                  "text": "Ponente",
                                  "iconName": "system_logic",
                                  "parent": null,
                                  "selected": false
                                },
                                {
                                  "key": "NW",
                                  "text": "Mistral",
                                  "iconName": "system_map",
                                  "parent": null,
                                  "selected": false
                                }
                            ]`;
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Before Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.changeItemsControl(newValueToSet);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(menu.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of After Items Control is Changed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(menu.MainExampleMenu);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Open Menu`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const menuContent = await menu.getMenuContent();
                            const menuContentButtons = await menu.getButtonsOutOfMenuContent();
                            expect(menuContent).to.not.equal('<!---->');
                            expect(menuContentButtons).to.be.an('array').with.lengthOf(8);
                            await driver.click(menu.OverlayContainer);
                        });
                        it(`toggle RAW button`, async function () {
                            await menu.inputs.toggleItemsControlRawButton();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of items Control default value`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                        });
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
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('sizeType')).to.be.true;
                            await driver.click(await menu.getInputRowSelectorByName('styleType'));
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
                            mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            mainExampleMenuHeight = await mainExampleMenu.getCssValue('height');
                            console.info('mainExampleMenuHeight: ', mainExampleMenuHeight);
                            expect(mainExampleMenuHeight).to.equal('40px');
                        });
                        sizeTypesExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const sizeType = allSizeTypes[index];
                                await sizeType.click();
                                mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                                mainExampleMenuHeight = await mainExampleMenu.getCssValue('height');
                                console.info('mainExampleMenuHeight: ', mainExampleMenuHeight);
                                await driver.click(await menu.getInputRowSelectorByName('styleType'));
                                let base64ImageComponentModal = await driver.saveScreenshots();
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
                                expect(mainExampleMenuHeight).to.equal(expectedHeight);
                                await driver.click(menu.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: menu with [size type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [size type = "md"]`, async function () {
                            await allSizeTypes[2].click();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `size type changed to 'md'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            mainExampleMenuHeight = await mainExampleMenu.getCssValue('height');
                            console.info('mainExampleMenuHeight: ', mainExampleMenuHeight);
                            await driver.click(menu.MainHeader);
                            driver.sleep(0.1 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: menu with [size type = 'md']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExampleMenuHeight).to.equal('40px');
                        });
                        break;

                    case 'styleType':
                        it(`validate input`, async function () {
                            expect(menuInputsTitles.includes('styleType')).to.be.true;
                            await driver.click(await menu.getInputRowSelectorByName('type'));
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
                            mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            mainExampleMenuStyle = await mainExampleMenu.getCssValue('background');
                            console.info('mainExampleMenu: ', mainExampleMenu);
                            console.info('mainExampleMenuStyle: ', mainExampleMenuStyle);
                            const backgroundColor = mainExampleMenuStyle.split('rgba(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            expect(backgroundColor).to.equal('26, 26, 26, 0.12');
                        });
                        styleTypeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const styleType = allStyleTypes[index];
                                await styleType.click();
                                mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                                mainExampleMenuStyle = await mainExampleMenu.getCssValue('background');
                                console.info('mainExampleMenuStyle: ', mainExampleMenuStyle);
                                await driver.click(await menu.getInputRowSelectorByName('type'));
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (styleType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                const backgroundHue = mainExampleMenuStyle.split('rgb')[1].split(')')[0];
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
                                await driver.click(menu.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: menu with [style type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [style type = "weak"]`, async function () {
                            await driver.click(menu.ResetControlsButton);
                            await driver.click(await menu.getInputRowSelectorByName('type'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `style type changed to 'weak'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleMenu = await driver.findElement(menu.MainExampleMenu);
                            mainExampleMenuStyle = await mainExampleMenu.getCssValue('background');
                            console.info('mainExampleMenu: ', mainExampleMenu);
                            console.info('mainExampleMenuStyle: ', mainExampleMenuStyle);
                            await driver.click(menu.MainHeader);
                            driver.sleep(0.1 * 1000);
                            const backgroundColor = mainExampleMenuStyle.split('rgba(')[1].split(')')[0];
                            console.info('backgroundColor: ', backgroundColor);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: menu with [style type = 'weak']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(backgroundColor).to.equal('26, 26, 26, 0.12');
                            await driver.click(menu.MainHeader);
                        });
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
                        it(`get all types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allTypes = await storyBookPage.inputs.getAllTypeInputValues();
                            driver.sleep(1 * 1000);
                            console.info('allTypes length: ', allTypes.length);
                            expect(allTypes.length).equals(typeExpectedValues.length);
                        });
                        it(`validate current type is "action"`, async function () {
                            const menuElement = await driver.findElement(menu.MainExampleMenu);
                            const menuElementType = await menuElement.getAttribute('type');
                            console.info('menuElement: ', menuElement);
                            console.info('menuElementType: ', menuElementType);
                            // expect(menuElementType).to.equal('action');
                        });
                        typeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const type = allTypes[index];
                                await type.click();
                                // let mainExampleSelector;
                                // switch (title) {
                                //     case 'action':
                                //         // mainExampleSelector = menu.MainExampleBooleanText;
                                //         break;
                                //     case 'action-select':
                                //         // mainExampleSelector = menu.MainExampleBooleanText;
                                //         break;
                                //     case 'select':
                                //         // mainExampleSelector = menu.MainExampleBooleanText;
                                //         break;

                                //     default:
                                //         mainExampleSelector = menu.MainExampleMenu;
                                //         break;
                                // }
                                // await driver.findElement(mainExampleSelector);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (type) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                await driver.click(menu.MainHeader);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of '${title}' (Type Input)`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
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
