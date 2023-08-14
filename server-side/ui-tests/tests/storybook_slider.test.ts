import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Slider } from '../pom/Pages/StorybookComponents/Slider';

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
            it(`Enter ** Slider ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('slider');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Slider ** Component`, async function () {
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
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
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
                        it(`it '${input}'`, async function () {
                            expect(sliderInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
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
