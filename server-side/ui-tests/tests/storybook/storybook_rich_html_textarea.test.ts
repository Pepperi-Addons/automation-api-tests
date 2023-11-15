import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { RichHtmlTextarea } from '../../pom/Pages/StorybookComponents/RichHtmlTextarea';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookRichHtmlTextareaTests() {
    const richHtmlTextareaInputs = [
        'label',
        'rowSpan',
        'value',
        'disabled',
        'inlineMode',
        'mandatory',
        'maxFieldCharacters',
        'showTitle',
        'visible',
        'xAlignment',
    ];
    const richHtmlTextareaOutputs = ['valueChange'];
    const richHtmlTextareaSubFoldersHeaders = [
        'Read only',
        'Editable',
        'Empty',
        'Inline, no content',
        'Inline, with content',
    ];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let richHtmlTextarea: RichHtmlTextarea;
    let richHtmlTextareaInputsTitles;
    let richHtmlTextareaOutputsTitles;
    let richHtmlTextareaComplexElement;
    let richHtmlTextareaComplexHeight;
    let allAlignments: WebElement[] = [];

    describe('Storybook "RichHtmlTextarea" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            richHtmlTextarea = new RichHtmlTextarea(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* RichHtmlTextarea Component * Initial Testing', () => {
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
            it(`Enter ** RichHtmlTextarea ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('rich-html-textarea');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** RichHtmlTextarea ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await richHtmlTextarea.doesRichHtmlTextareaComponentFound();
                richHtmlTextareaInputsTitles = await richHtmlTextarea.getInputsTitles();
                console.info('richHtmlTextareaInputsTitles:', JSON.stringify(richHtmlTextareaInputsTitles, null, 2));
                richHtmlTextareaOutputsTitles = await richHtmlTextarea.getOutputsTitles();
                console.info('richHtmlTextareaOutputsTitles:', JSON.stringify(richHtmlTextareaOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(richHtmlTextareaInputsTitles).to.eql(richHtmlTextareaInputs);
                expect(richHtmlTextareaOutputsTitles).to.eql(richHtmlTextareaOutputs);
                driver.sleep(5 * 1000);
            });
        });
        richHtmlTextareaInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await richHtmlTextarea.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(richHtmlTextarea.Inputs_mainTableRow);
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
                            expect(richHtmlTextareaInputsTitles.includes('label')).to.be.true;
                            await driver.click(richHtmlTextarea.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await richHtmlTextarea.getMainExampleLabel('rich-html-textarea');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'rowSpan':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 6 ] measurement (+screenshot)`, async function () {
                            richHtmlTextareaComplexElement = await driver.findElement(
                                richHtmlTextarea.MainExampleHeightDiv,
                            );
                            richHtmlTextareaComplexHeight = await richHtmlTextareaComplexElement.getCssValue('height');
                            console.info('richHtmlTextareaComplexHeight: ', richHtmlTextareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(richHtmlTextareaComplexHeight.trim()).to.equal('384px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await richHtmlTextarea.changeRowSpanControl(1);
                            richHtmlTextareaComplexElement = await driver.findElement(
                                richHtmlTextarea.MainExampleHeightDiv,
                            );
                            richHtmlTextareaComplexHeight = await richHtmlTextareaComplexElement.getCssValue('height');
                            console.info('richHtmlTextareaComplexHeight: ', richHtmlTextareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(richHtmlTextareaComplexHeight.trim()).to.equal('64px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await richHtmlTextarea.changeRowSpanControl(3);
                            richHtmlTextareaComplexElement = await driver.findElement(
                                richHtmlTextarea.MainExampleHeightDiv,
                            );
                            richHtmlTextareaComplexHeight = await richHtmlTextareaComplexElement.getCssValue('height');
                            console.info('richHtmlTextareaComplexHeight: ', richHtmlTextareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(richHtmlTextareaComplexHeight.trim()).to.equal('192px');
                        });
                        // it(`[ control = 0 ] height measurement (+screenshot)`, async function () {  // https://pepperi.atlassian.net/browse/DI-25456
                        //     await richHtmlTextarea.changeRowSpanControl(0);
                        //     richHtmlTextareaComplexElement = await driver.findElement(
                        //         richHtmlTextarea.MainExampleHeightDiv,
                        //     );
                        //     richHtmlTextareaComplexHeight = await richHtmlTextareaComplexElement.getCssValue('height');
                        //     console.info('richHtmlTextareaComplexHeight: ', richHtmlTextareaComplexHeight);
                        //     const base64ImageComponent = await driver.saveScreenshots();
                        //     addContext(this, {
                        //         title: `'${input}' default height`,
                        //         value: 'data:image/png;base64,' + base64ImageComponent,
                        //     });
                        //     expect(richHtmlTextareaComplexHeight.trim()).to.equal('46px');
                        // });
                        it(`back to default height [ control = 6 ] measurement (+screenshot)`, async function () {
                            await richHtmlTextarea.changeRowSpanControl(6);
                            richHtmlTextareaComplexElement = await driver.findElement(
                                richHtmlTextarea.MainExampleHeightDiv,
                            );
                            richHtmlTextareaComplexHeight = await richHtmlTextareaComplexElement.getCssValue('height');
                            console.info('richHtmlTextareaComplexHeight: ', richHtmlTextareaComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' back to default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(richHtmlTextareaComplexHeight.trim()).to.equal('384px');
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "<style>main{font-family:sans-serif}strong{color:#b68300}..."`, async function () {
                            const expectedValue =
                                '<style>main{font-family:sans-serif}strong{color:#b68300}ul{list-style:none;padding:0 .5rem;margin:0}li{display:flex;flex-direction:row;align-items:center;gap:1rem}img{height:auto;width:2rem}p{font-size:1rem;margin-block:1rem}h2{margin:0}</style><main><h1>B07MZ3</h1><p>Brand: <strong>SojoS</strong></p><p>Product Code: <strong>She Young</strong></p><p>List Price: <strong>12.9</strong></p><h2>Product Details</h2><ul><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/frame-width.svg"><p>Frame Width: <strong>132mm</strong></p></li><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/lens-width.svg"><p>Lens Width: <strong>52mm</strong></p></li><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/bridge.svg"><p>Bridge: <strong>16mm</strong></p></li></ul></main>';
                            await driver.click(richHtmlTextarea.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "<style>main{font-family:sans-serif}strong{color:#b68300}..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await richHtmlTextarea.getMainExampleRichHtmlTextareaValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "<h6>Auto test</h6>" ] functional test (+screenshot)`, async function () {
                            const newValueToSet = '<h6>Auto test</h6>';
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await richHtmlTextarea.getMainExampleRichHtmlTextareaValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        it(`back to default [ control = "<style>main{font-family:sans-serif}strong{color:#b68300}..." ](+screenshots)`, async function () {
                            await driver.click(richHtmlTextarea.ResetControlsButton);
                            const expectedValue =
                                '<style>main{font-family:sans-serif}strong{color:#b68300}ul{list-style:none;padding:0 .5rem;margin:0}li{display:flex;flex-direction:row;align-items:center;gap:1rem}img{height:auto;width:2rem}p{font-size:1rem;margin-block:1rem}h2{margin:0}</style><main><h1>B07MZ3</h1><p>Brand: <strong>SojoS</strong></p><p>Product Code: <strong>She Young</strong></p><p>List Price: <strong>12.9</strong></p><h2>Product Details</h2><ul><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/frame-width.svg"><p>Frame Width: <strong>132mm</strong></p></li><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/lens-width.svg"><p>Lens Width: <strong>52mm</strong></p></li><li><img src="https://static.zennioptical.com/dev/image/site/frame-size-icons/bridge.svg"><p>Bridge: <strong>16mm</strong></p></li></ul></main>';
                            await driver.click(richHtmlTextarea.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "<style>main{font-family:sans-serif}strong{color:#b68300}..."`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await richHtmlTextarea.getMainExampleRichHtmlTextareaValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            const mainExampleRichHtmlTextarea = await driver.findElement(
                                richHtmlTextarea.MainExampleRichHtmlTextarea,
                            );
                            const mainExampleRichHtmlTextareaDisabled = await mainExampleRichHtmlTextarea.getAttribute(
                                'class',
                            );
                            console.info(
                                'mainExampleRichHtmlTextareaDisabled (true): ',
                                JSON.stringify(mainExampleRichHtmlTextareaDisabled, null, 2),
                            );
                            expect(mainExampleRichHtmlTextareaDisabled).to.include('mat-form-field-disabled');
                        });
                        it(`opening button and making sure the popup dialog contains Read Only display`, async function () {
                            await driver.click(richHtmlTextarea.MainExampleRichHtmlTextarea_button);
                            driver.sleep(0.5 * 1000);
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Read Only - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExamplePopup = await driver.findElement(
                                richHtmlTextarea.MainExample_PopupDialog_readOnly,
                            );
                            expect(mainExamplePopup).to.not.be.null.and.not.be.undefined;
                            // closing dialog:
                            await driver.click(richHtmlTextarea.OverlayContainer);
                            await driver.click(richHtmlTextarea.OverlayContainer);
                            driver.sleep(2 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Read Only - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            const mainExampleRichHtmlTextarea = await driver.findElement(
                                richHtmlTextarea.MainExampleRichHtmlTextarea,
                            );
                            const mainExampleRichHtmlTextareaDisabled = await mainExampleRichHtmlTextarea.getAttribute(
                                'class',
                            );
                            console.info(
                                'mainExampleRichHtmlTextareaDisabled (false): ',
                                JSON.stringify(mainExampleRichHtmlTextareaDisabled, null, 2),
                            );
                            expect(mainExampleRichHtmlTextareaDisabled).to.not.include('mat-form-field-disabled');
                        });
                        it(`opening button and making sure the popup dialog contains Editable display`, async function () {
                            await driver.click(richHtmlTextarea.MainExampleRichHtmlTextarea_button);
                            driver.sleep(0.5 * 1000);
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Edit Mode - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExamplePopup = await driver.findElement(
                                richHtmlTextarea.MainExample_PopupDialog_editMode,
                            );
                            expect(mainExamplePopup).to.not.be.null.and.not.be.undefined;
                            // closing dialog:
                            await driver.click(richHtmlTextarea.MainExample_PopupDialog_closeButton);
                            driver.sleep(2 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Edit Mode - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            const mainExampleRichHtmlTextarea = await driver.findElement(
                                richHtmlTextarea.MainExampleRichHtmlTextarea,
                            );
                            const mainExampleRichHtmlTextareaDisabled = await mainExampleRichHtmlTextarea.getAttribute(
                                'class',
                            );
                            expect(mainExampleRichHtmlTextareaDisabled).to.include('mat-form-field-disabled');
                        });
                        break;

                    case 'inlineMode':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('inlineMode')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('mandatory')).to.be.true;
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
                            await storyBookPage.elemntDoNotExist(richHtmlTextarea.MainExample_mandatoryIcon);
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
                            await storyBookPage.untilIsVisible(richHtmlTextarea.MainExample_mandatoryIcon);
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
                            await storyBookPage.elemntDoNotExist(richHtmlTextarea.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'maxFieldCharacters':
                        it(`it '${input}'`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        it(`making sure current value is NaN`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control default value = NaN`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(richHtmlTextarea.MainExample_numOfCharacters);
                        });
                        it(`functional test [ control = 3 ] (+screenshot)`, async function () {
                            await driver.click(await richHtmlTextarea.getInputRowSelectorByName('showTitle'));
                            const newValueToSet = 3;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control Change -> 3`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            // await storyBookPage.untilIsVisible(richHtmlTextarea.MainExample_numOfCharacters); // BUG https://pepperi.atlassian.net/browse/DI-25701
                            // await storyBookPage.inputs.changeInput(
                            //     richHtmlTextarea.MainExampleLink_value,
                            //     'https://www.google.com',
                            // );
                        });
                        it(`back to non-functional value [ control = 0 ] (+screenshots)`, async function () {
                            await driver.click(await richHtmlTextarea.getInputRowSelectorByName('showTitle'));
                            const newValueToSet = 0;
                            await storyBookPage.inputs.changeMaxFieldCharactersControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of maxFieldCharacters Control value = 0`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.elemntDoNotExist(richHtmlTextarea.MainExample_numOfCharacters);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(
                                richHtmlTextarea.Inputs_mainTableRow,
                            );
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(richHtmlTextarea.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(richHtmlTextarea.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(richHtmlTextarea.MainExample_titleLabel);
                        });
                        break;

                    case 'visible':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('visible')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            await driver.click(await storyBookPage.inputs.getInputRowSelectorByName('visible'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            const mainExamplePepRichHtmlTextarea = await driver.findElement(
                                richHtmlTextarea.MainExamplePepRichHtmlTextarea,
                            );
                            const mainExamplePepRichHtmlTextareaClasses =
                                await mainExamplePepRichHtmlTextarea.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepRichHtmlTextareaClasses).to.not.include('hidden-element');
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleVisibleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            try {
                                const mainExamplePepRichHtmlTextarea = await driver.findElement(
                                    richHtmlTextarea.MainExamplePepRichHtmlTextarea,
                                );
                                const mainExamplePepRichHtmlTextareaClasses =
                                    await mainExamplePepRichHtmlTextarea.getAttribute('class');
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(mainExamplePepRichHtmlTextareaClasses).to.include('hidden-element');
                            } catch (error) {
                                console.error(error);
                                const theError = error as Error;
                                console.info("Can't find Pep-RichHtmlTextarea");
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `Upper View of Visible Input "false"`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(theError.message).contains(
                                    `After wait time of: 15000, for selector of '//div[@id="story--components-rich-html-textarea--story-1"]//pep-rich-html-textarea', The test must end, The element is not visible`,
                                );
                            }
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleVisibleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Visible Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(richHtmlTextarea.MainHeader);
                            const mainExamplePepRichHtmlTextarea = await driver.findElement(
                                richHtmlTextarea.MainExamplePepRichHtmlTextarea,
                            );
                            const mainExamplePepRichHtmlTextareaClasses =
                                await mainExamplePepRichHtmlTextarea.getAttribute('class');
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of Visible Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExamplePepRichHtmlTextareaClasses).to.not.include('hidden-element');
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(richHtmlTextareaInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await richHtmlTextarea.getTxtAlignmentByComponent(
                                'rich-html-textarea',
                            );
                            await driver.click(richHtmlTextarea.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: rich-html-textarea with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await richHtmlTextarea.getTxtAlignmentByComponent(
                                        'rich-html-textarea',
                                    );
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(richHtmlTextarea.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: richHtmlTextarea with x-alignment = '${title}'`,
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
        richHtmlTextareaOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await richHtmlTextarea.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(richHtmlTextareaOutputsTitles.includes('valueChange')).to.be.true;
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
            richHtmlTextareaSubFoldersHeaders.forEach(async (header, index) => {
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
