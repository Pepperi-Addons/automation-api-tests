import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Link } from '../../pom/Pages/StorybookComponents/Link';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookLinkTests() {
    const linkInputs = [
        'label',
        'value',
        'displayValue',
        'disabled',
        'mandatory',
        'maxFieldCharacters',
        'renderError',
        'renderSymbol',
        'renderTitle',
        'showTitle',
        'textColor',
        'xAlignment',
    ];
    const linkOutputs = ['elementClick', 'valueChange'];
    const linkSubFoldersHeaders = ['Empty', 'Read only', 'Read only, no button', 'Max characters'];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let link: Link;
    let linkInputsTitles;
    let linkOutputsTitles;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Link" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            link = new Link(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Link Component * Initial Testing', () => {
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
            it(`Enter ** Link ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('link');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Link ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await link.doesLinkComponentFound();
                linkInputsTitles = await link.getInputsTitles();
                console.info('linkInputsTitles:', JSON.stringify(linkInputsTitles, null, 2));
                linkOutputsTitles = await link.getOutputsTitles();
                console.info('linkOutputsTitles:', JSON.stringify(linkOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(linkInputsTitles).to.eql(linkInputs);
                expect(linkOutputsTitles).to.eql(linkOutputs);
                driver.sleep(5 * 1000);
            });
        });
        linkInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`switch to iframe`, async function () {
                    try {
                        await driver.findElement(storyBookPage.StorybookIframe, 5000);
                        await driver.switchTo(storyBookPage.StorybookIframe);
                    } catch (error) {
                        console.error(error);
                        console.info('ALREADY ON IFRAME');
                    }
                });
                it(`SCREENSHOT`, async function () {
                    await driver.click(await link.getInputRowSelectorByName(input));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(link.Inputs_mainTableRow);
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
                            expect(linkInputsTitles.includes('label')).to.be.true;
                            await driver.click(link.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await link.getMainExampleLabel('link');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "https://www.pepperi.com"`, async function () {
                            const expectedValue = 'https://www.pepperi.com';
                            await driver.click(link.MainHeader);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "https://www.pepperi.com"`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const valueGotFromUi = await link.getMainExampleLinkValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                            const newUrl = await link.openMainExampleLink(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `default '${expectedValue}'- new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.be.oneOf([expectedValue, expectedValue + '/']);
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
                        it(`functional test [ control = "https://www.google.com" ] (+screenshot)`, async function () {
                            const newValueToSet = 'https://www.google.com';
                            await driver.click(link.MainHeader);
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> 'https://www.google.com'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newValueGotFromUi = await link.getMainExampleLinkValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                            const newUrl = await link.openMainExampleLink(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of ${newValueToSet} - at new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.be.oneOf([newValueToSet, newValueToSet + '/']);
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
                        it(`back to default [ control = "https://www.pepperi.com" ] (+screenshots)`, async function () {
                            await driver.click(link.ResetControlsButton);
                            const expectedValue = 'https://www.pepperi.com';
                            await driver.click(link.MainHeader);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "https://www.pepperi.com"`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const valueGotFromUi = await link.getMainExampleLinkValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                            const newUrl = await link.openMainExampleLink(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `default '${expectedValue}'- new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.be.oneOf([expectedValue, expectedValue + '/']);
                        });
                        break;

                    case 'displayValue':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('displayValue')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            const mainExampleLink = await driver.findElement(link.MainExampleLink);
                            const mainExampleLinkDisabled = await mainExampleLink.getAttribute('class');
                            console.info(
                                'mainExampleLinkDisabled (false): ',
                                JSON.stringify(mainExampleLinkDisabled, null, 2),
                            );
                            expect(mainExampleLinkDisabled).to.not.include('mat-form-field-disabled');
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            const mainExampleLink = await driver.findElement(link.MainExampleLink);
                            const mainExampleLinkDisabled = await mainExampleLink.getAttribute('class');
                            console.info(
                                'mainExampleLinkDisabled (true): ',
                                JSON.stringify(mainExampleLinkDisabled, null, 2),
                            );
                            expect(mainExampleLinkDisabled).include('mat-form-field-disabled');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            const mainExampleLink = await driver.findElement(link.MainExampleLink);
                            const mainExampleLinkDisabled = await mainExampleLink.getAttribute('class');
                            expect(mainExampleLinkDisabled).to.not.include('mat-form-field-disabled');
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(link.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(link.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(link.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'maxFieldCharacters':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'renderError':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('renderError')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            expect(renderErrorControlState).to.be.true;
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainExampleDiv);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`creating an error and making sure the error message is displayed`, async function () {
                            // changing mandatory to true:
                            await storyBookPage.inputs.toggleMandatoryControl();
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            // changing value to be empty:
                            await storyBookPage.inputs.changeValueControl('');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to 0 - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // click link:
                            await link.click(link.MainExampleLink_value);
                            await link.click(link.MainExampleLink_button);
                            link.pause(1 * 1000);
                            const errorMessageSpan = await driver.findElement(link.MainExample_ErrorMessageSpan);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(await errorMessageSpan.getText()).equals('Link input is mandatory');
                            expect(await errorMessageSpan.getCssValue('color')).equals('rgba(255, 255, 255, 1)');
                        });
                        it(`changing value control to VALID input and making sure no error is displayed`, async function () {
                            const newValueToSet = 'https://www.google.com';
                            await driver.click(link.MainHeader);
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> 'https://www.google.com'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newValueGotFromUi = await link.getMainExampleLinkValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                            const newUrl = await link.openMainExampleLink(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of ${newValueToSet} - at new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.be.oneOf([newValueToSet, newValueToSet + '/']);
                            const errorMessageSpan = await driver.isElementVisible(link.MainExample_ErrorMessageSpan);
                            link.pause(1 * 1000);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of ${newValueToSet} - after new tab closed`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(errorMessageSpan).to.be.false;
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
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderErrorControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            expect(renderErrorControlState).to.be.false;
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`changing value control to INVALID input and expacting error message NOT to be displayed`, async function () {
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            // changing value to be empty:
                            await storyBookPage.inputs.changeValueControl('');
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `value control change to '' - to cause an error`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainExampleLink);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was opened`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // click link:
                            await link.click(link.MainExampleLink_value);
                            await link.click(link.MainExampleLink_button);
                            const errorMessageSpan = await driver.isElementVisible(link.MainExample_ErrorMessageSpan);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Popup Dialog Select Date Time - was closed`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(errorMessageSpan).to.be.false;
                        });
                        it(`changing value control to VALID input and making sure no error indication is displayed`, async function () {
                            // changing mandatory to false:
                            await storyBookPage.inputs.toggleMandatoryControl();
                            // validating mandatory to be true:
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.false;
                            // changing value to be empty:
                            const newValueToSet = 'https://www.google.com';
                            await driver.click(link.MainHeader);
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> 'https://www.google.com'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newValueGotFromUi = await link.getMainExampleLinkValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                            const newUrl = await link.openMainExampleLink(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of ${newValueToSet} - at new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.be.oneOf([newValueToSet, newValueToSet + '/']);
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `No Error should be shown`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const errorMessageSpan = await driver.isElementVisible(link.MainExample_ErrorMessageSpan);
                            expect(errorMessageSpan).to.be.false;
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
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderErrorControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderError Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            const renderErrorControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'RenderError',
                            );
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of RenderError Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(renderErrorControlState).to.be.true;
                        });
                        it(`reset controls`, async function () {
                            await driver.click(link.ResetControlsButton);
                            const expectedValue = 'https://www.pepperi.com';
                            await driver.click(link.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "${expectedValue}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await link.getMainExampleLinkValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'renderSymbol':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('renderSymbol')).to.be.true;
                        });
                        // TODO
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(link.MainExample_pepTitle);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(link.MainExample_pepTitle);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(link.MainExample_pepTitle);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(link.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(link.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(link.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(link.MainExample_titleLabel);
                        });
                        break;

                    case 'textColor':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('textColor')).to.be.true;
                        });
                        it(`making sure current value is ""`, async function () {
                            const expectedValue = '';
                            await driver.click(await link.getInputRowSelectorByName('xAlignment'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input default value = ""`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await link.getMainExampleLinkTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "#780f97" ] (+screenshot)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('#780f97');
                            await driver.click(await link.getInputRowSelectorByName('xAlignment'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentColor = await link.getMainExampleLinkTxtColor();
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of txtColor Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentColor).to.equal('rgb(120, 15, 151)'); // same as "#780f97" in RGB
                        });
                        it(`back to default [ control = "" ] (+screenshots)`, async function () {
                            await storyBookPage.inputs.setTxtColorValue('');
                            await driver.click(await link.getInputRowSelectorByName('xAlignment'));
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(link.ResetControlsButton);
                            const expectedValue = '';
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper view of back to default value = "" of txtColor Input`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await link.getMainExampleLinkTxtColor();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(linkInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await link.getTxtAlignmentByComponent('link');
                            await driver.click(link.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: link with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await link.getTxtAlignmentByComponent('link');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(link.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: link with x-alignment = '${title}'`,
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
        linkOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await link.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'elementClick':
                        it(`it '${output}'`, async function () {
                            expect(linkOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(linkOutputsTitles.includes('valueChange')).to.be.true;
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
            linkSubFoldersHeaders.forEach(async (header, index) => {
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
