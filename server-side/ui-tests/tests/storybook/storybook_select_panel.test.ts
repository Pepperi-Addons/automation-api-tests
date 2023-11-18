import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { SelectPanel } from '../../pom/Pages/StorybookComponents/SelectPanel';
import { WebElement } from 'selenium-webdriver';

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
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let selectPanel: SelectPanel;
    let selectPanelInputsTitles;
    let selectPanelOutputsTitles;
    let allAlignments: WebElement[] = [];

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await selectPanel.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(selectPanel.Inputs_mainTableRow);
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
                    case 'label':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('label')).to.be.true;
                            await driver.click(selectPanel.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await selectPanel.getMainExampleLabel('select-panel');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "Green, Red, Blue"`, async function () {
                            await driver.click(selectPanel.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Green, Red, Blue"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const greenValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Green');
                            const redValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Red');
                            const blueValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Blue');
                            const greyValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Gray');
                            const tealValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Teal');
                            expect(greenValueGotFromUi).to.be.true;
                            expect(redValueGotFromUi).to.be.true;
                            expect(blueValueGotFromUi).to.be.true;
                            expect(greyValueGotFromUi).to.be.false;
                            expect(tealValueGotFromUi).to.be.false;
                        });
                        it(`functional test [ control = "Gray, Teal" ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 'grey;teal;';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> "Gray, Teal"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const greyValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Gray');
                            const tealValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Teal');
                            const greenValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Green');
                            const redValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Red');
                            const blueValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Blue');
                            expect(greyValueGotFromUi).to.be.true;
                            expect(tealValueGotFromUi).to.be.true;
                            expect(greenValueGotFromUi).to.be.false;
                            expect(redValueGotFromUi).to.be.false;
                            expect(blueValueGotFromUi).to.be.false;
                        });
                        it(`back to default [ control = "Green, Red, Blue" ](+screenshots)`, async function () {
                            await driver.click(selectPanel.ResetControlsButton);
                            await driver.click(selectPanel.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "Green, Red, Blue"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const greenValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Green');
                            const redValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Red');
                            const blueValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Blue');
                            const greyValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Gray');
                            const tealValueGotFromUi = await selectPanel.isMainExampleByNameSelected('Teal');
                            expect(greenValueGotFromUi).to.be.true;
                            expect(redValueGotFromUi).to.be.true;
                            expect(blueValueGotFromUi).to.be.true;
                            expect(greyValueGotFromUi).to.be.false;
                            expect(tealValueGotFromUi).to.be.false;
                        });
                        break;

                    case 'options':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('options')).to.be.true;
                        });
                        // it(`making sure current value is 8 options object`, async function () {
                        //     const expectedOptions = `<span class="rejt-not-collapsed-delimiter">[</span><svg viewBox="0 0 1024 1024" class="rejt-plus-selectPanel css-1sq7n9w"><path d="M512-.2a512 512 0 110 1024 512 512 0 010-1024zm0 91.4c-112.3 0-218 43.8-297.4 123.2A417.8 417.8 0 0091.4 511.8c0 112.4 43.8 218 123.2 297.4A417.8 417.8 0 00512 932.4c112.3 0 218-43.8 297.4-123.2a417.8 417.8 0 00123.2-297.4c0-112.3-43.8-218-123.2-297.4A417.8 417.8 0 00512 91.2zm1.1 129.2a45.7 45.7 0 0145.7 45.7v201.1H760a45.7 45.7 0 010 91.5H558.8v201.1a45.7 45.7 0 11-91.4 0V558.7H266.3a45.7 45.7 0 110-91.5h201.1V266.1a45.7 45.7 0 0145.7-45.7z" class="css-kqzqgg"></path></svg><ul class="rejt-not-collapsed-list" style="list-style: none; margin: 0px 0px 0px 1rem; padding: 0px;"><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">0 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">1 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">2 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">3 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">4 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 2 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">5 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">6 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">7 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div><div class="rejt-object-node"><span><span class="rejt-name" style="color: rgb(209, 65, 0);">8 : </span></span><span class="rejt-collapsed"><span class="rejt-collapsed-text" style="color: rgb(102, 102, 102);">{...} 3 keys</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg></span></div></ul><span class="rejt-not-collapsed-delimiter">]</span><svg viewBox="0 0 1024 1024" class="rejt-minus-menu css-1tclqig"><path d="M512 0a512 512 0 110 1024A512 512 0 01512 0zm4 94A418 418 0 0094 515a418 418 0 00422 422 418 418 0 00421-422A418 418 0 00516 94zm244 372a46 46 0 010 92H264a46 46 0 110-92z" class="css-kqzqgg"></path></svg>`;
                        //     let base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `options Control default value`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     const optionsControlContent = await selectPanel.inputs.getOptionsControlContent();
                        //     await driver.click(selectPanel.MainHeader);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `upper view of options Control default value`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     expect(optionsControlContent).equals(expectedOptions);
                        //     await driver.click(selectPanel.MainExampleSelectPanel);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `Open SelectPanel`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     const selectPanelContent = await selectPanel.getSelectPanelOptions();
                        //     const selectPanelContentButtons = await selectPanel.getButtonsOutOfSelectPanelContent();
                        //     expect(selectPanelContent).to.not.equal('<!---->');
                        //     expect(selectPanelContentButtons).to.be.an('array').with.lengthOf(8);
                        //     await driver.click(selectPanel.OverlayContainer);
                        // });
                        // it(`functional test [ control = [] ] (+screenshot)`, async function () {
                        //     await driver.click(await selectPanel.getInputRowSelectorByName('classNames'));
                        //     const newValueToSet = '[]';
                        //     let base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `Before Items RAW Button Click`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await selectPanel.inputs.toggleItemsControlRawButton();
                        //     selectPanel.pause(0.5 * 1000);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `After Items RAW Button is Clicked`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await selectPanel.inputs.changeItemsControl(newValueToSet);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `After Items Control is Changed`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await driver.click(selectPanel.MainHeader);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `upper view of Items Control Change`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await driver.click(selectPanel.MainExampleSelectPanel);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `Open SelectPanel`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     const selectPanelContent = await selectPanel.getSelectPanelOptions();
                        //     expect(selectPanelContent).equals('<!---->');
                        //     await driver.click(selectPanel.OverlayContainer);
                        // });
                        // it(`back to non-functional value [ control = 0 ] (+screenshots)`, async function () {
                        //     await driver.click(await selectPanel.getInputRowSelectorByName('classNames'));
                        //     const newValueToSet = `[
                        //         {
                        //           "key": "N",
                        //           "text": "Tramontana",
                        //           "parent": null,
                        //           "selected": true
                        //         },
                        //         {
                        //           "key": "NE",
                        //           "text": "Gregale",
                        //           "disabled": true,
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "E",
                        //           "text": "Levante",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "SE",
                        //           "text": "Scirocco",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "sep",
                        //           "type": "splitter",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "S",
                        //           "text": "Ostro",
                        //           "iconName": "system_link",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "SW",
                        //           "text": "Libeccio",
                        //           "iconName": "system_lock",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "W",
                        //           "text": "Ponente",
                        //           "iconName": "system_logic",
                        //           "parent": null,
                        //           "selected": false
                        //         },
                        //         {
                        //           "key": "NW",
                        //           "text": "Mistral",
                        //           "iconName": "system_map",
                        //           "parent": null,
                        //           "selected": false
                        //         }
                        //     ]`;
                        //     let base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `Before Items Control is Changed`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await storyBookPage.inputs.changeItemsControl(newValueToSet);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `After Items Control is Changed`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await driver.click(selectPanel.MainHeader);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `upper view of After Items Control is Changed`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     await driver.click(selectPanel.MainExampleSelectPanel);
                        //     base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `Open SelectPanel`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     const selectPanelContent = await selectPanel.getSelectPanelOptions();
                        //     const selectPanelContentButtons = await selectPanel.getButtonsOutOfSelectPanelContent();
                        //     expect(selectPanelContent).to.not.equal('<!---->');
                        //     expect(selectPanelContentButtons).to.be.an('array').with.lengthOf(8);
                        //     await driver.click(selectPanel.OverlayContainer);
                        // });
                        // it(`toggle RAW button`, async function () {
                        //     await selectPanel.inputs.toggleItemsControlRawButton();
                        //     const base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `upper view of options Control default value`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        // });
                        break;

                    case 'isMultiSelect':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('isMultiSelect')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'classNames':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('classNames')).to.be.true;
                        });
                        // it(`[ control = 'rotate3d' ] functional test (+screenshot)`, async function () { // BUG: https://pepperi.atlassian.net/browse/DI-25512
                        //     const newClassNamesToSet = 'rotate3d';
                        //     await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                        //     const base64ImageComponentModal = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `ClassNames Input Change`,
                        //         value: 'data:image/png;base64,' + base64ImageComponentModal,
                        //     });
                        //     const newClassNamesGotFromUi = await (
                        //         await driver.findElement(selectPanel.MainExampleSelectPanel)
                        //     ).getAttribute('class');
                        //     console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                        //     expect(newClassNamesGotFromUi).to.contain(newClassNamesToSet);
                        // });
                        it(`[ control = '' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = '';
                            await storyBookPage.inputs.changeClassNamesControl(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(selectPanel.MainExampleSelectPanel)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.not.contain('rotate3d');
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(selectPanel.MainHeader);
                            const mainExampleSelectPanel = await driver.findElement(selectPanel.MainExampleSelectPanel);
                            const mainExampleSelectPanelDisabled = await mainExampleSelectPanel.getAttribute('class');
                            console.info(
                                'mainExampleSelectPanelDisabled (false): ',
                                JSON.stringify(mainExampleSelectPanelDisabled, null, 2),
                            );
                            expect(mainExampleSelectPanelDisabled).to.not.include('disable');
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(selectPanel.MainHeader);
                            const mainExampleSelectPanel = await driver.findElement(selectPanel.MainExampleSelectPanel);
                            const mainExampleSelectPanelDisabled = await mainExampleSelectPanel.getAttribute('class');
                            console.info(
                                'mainExampleSelectPanelDisabled (true): ',
                                JSON.stringify(mainExampleSelectPanelDisabled, null, 2),
                            );
                            expect(mainExampleSelectPanelDisabled).to.include('disable');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(selectPanel.MainHeader);
                            const mainExampleSelectPanel = await driver.findElement(selectPanel.MainExampleSelectPanel);
                            const mainExampleSelectPanelDisabled = await mainExampleSelectPanel.getAttribute('class');
                            expect(mainExampleSelectPanelDisabled).to.not.include('disable');
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`making sure current value is "False"`, async function () {
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(selectPanel.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(selectPanel.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(selectPanel.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'numOfCol':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('numOfCol')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(selectPanel.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(selectPanel.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(selectPanel.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(selectPanel.MainExample_titleLabel);
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(selectPanelInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        it(`get all xAlignments`, async function () {
                            allAlignments = await storyBookPage.inputs.getAllxAlignments();
                            driver.sleep(1 * 1000);
                        });
                        it(`validate current xAlignment is "left"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `[xAlignment = 'left']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentAlign = await selectPanel.getTxtAlignmentByComponent('select-panel');
                            await driver.click(selectPanel.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: select-panel with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await selectPanel.getTxtAlignmentByComponent('select-panel');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(selectPanel.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: selectPanel with x-alignment = '${title}'`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                });
                            }
                        });
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        selectPanelOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await selectPanel.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
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
