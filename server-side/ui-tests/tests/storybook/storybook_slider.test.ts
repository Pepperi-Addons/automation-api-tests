import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Slider } from '../../pom/Pages/StorybookComponents/Slider';

chai.use(promised);

export async function StorybookSliderTests() {
    const sliderInputs = ['label', 'value', 'hint', 'minValue', 'maxValue', 'disabled', 'step'];
    const sliderProperties = ['xAlignment'];
    const sliderSubFoldersHeaders = ['Show value, with step'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let slider: Slider;
    let sliderInputsTitles;
    let sliderPropertiesTitles;

    describe('Storybook "Slider" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            slider = new Slider(driver);
        });

        after(async function () {
            await driver.close();
            await driver.quit();
        });

        describe('* Slider Component * Initial Testing', () => {
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
            it(`Enter ** Slider ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('slider');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Slider ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await slider.doesSliderComponentFound();
                sliderInputsTitles = await slider.getInputsTitles();
                console.info('sliderInputsTitles:', JSON.stringify(sliderInputsTitles, null, 2));
                sliderPropertiesTitles = await slider.getPropertiesTitles();
                console.info('sliderPropertiesTitles:', JSON.stringify(sliderPropertiesTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(sliderInputsTitles).to.eql(sliderInputs);
                expect(sliderPropertiesTitles).to.eql(sliderProperties);
                driver.sleep(5 * 1000);
            });
        });
        sliderInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await slider.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(slider.Inputs_mainTableRow);
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
                            expect(sliderInputsTitles.includes('label')).to.be.true;
                            await driver.click(slider.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await slider.getMainExampleLabel('slider');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;
                    case 'value':
                        it(`validate input`, async function () {
                            expect(sliderInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "50"`, async function () {
                            const expectedValue = '50';
                            await driver.click(slider.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "50"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await slider.getMainExampleSliderValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = '100' ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 100;
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await slider.getMainExampleSliderValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet.toString());
                        });
                        it(`back to default [ control = "50" ](+screenshots)`, async function () {
                            await driver.click(slider.ResetControlsButton);
                            const expectedValue = '50';
                            await driver.click(slider.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "50"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await slider.getMainExampleSliderValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;
                    case 'hint':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('hint')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'minValue':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('minValue')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'maxValue':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('maxValue')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(sliderInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(slider.MainHeader);
                            const mainExampleSlider = await driver.findElement(slider.MainExampleSlider);
                            const mainExampleSliderDisabled = await mainExampleSlider.getAttribute('aria-disabled');
                            console.info(
                                'mainExampleSliderDisabled (false): ',
                                JSON.stringify(mainExampleSliderDisabled, null, 2),
                            );
                            expect(mainExampleSliderDisabled).equals('false');
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(slider.MainHeader);
                            const mainExampleSlider = await driver.findElement(slider.MainExampleSlider);
                            const mainExampleSliderDisabled = await mainExampleSlider.getAttribute('aria-disabled');
                            console.info(
                                'mainExampleSliderDisabled (true): ',
                                JSON.stringify(mainExampleSliderDisabled, null, 2),
                            );
                            expect(mainExampleSliderDisabled).equals('true');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(slider.MainHeader);
                            const mainExampleSlider = await driver.findElement(slider.MainExampleSlider);
                            const mainExampleSliderDisabled = await mainExampleSlider.getAttribute('aria-disabled');
                            expect(mainExampleSliderDisabled).equals('false');
                        });
                        break;
                    case 'step':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('step')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        sliderProperties.forEach(async (property) => {
            describe(`PROPERTY: '${property}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await slider.getPropertyRowSelectorByName(property));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${property}' property`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (property) {
                    case 'fadeState':
                        it(`it '${property}'`, async function () {
                            expect(sliderPropertiesTitles.includes('fadeState')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Property: "${property}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            sliderSubFoldersHeaders.forEach(async (header, index) => {
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
