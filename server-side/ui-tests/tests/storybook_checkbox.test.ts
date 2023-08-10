import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Checkbox } from '../pom/Pages/StorybookComponents/Checkbox';

chai.use(promised);

export async function StorybookCheckboxTests() {
    const checkboxInputs = [
        'label',
        'value',
        'additionalValue',
        'disabled',
        'mandatory',
        'renderTitle',
        'showTitle',
        'type',
        'visible',
        'xAlignment',
    ];
    const checkboxStoriesHeaders = [
        'No label',
        'Disabled & checked',
        'Disabled & unchecked',
        'Flipped & mandatory',
        'Type is booleanText',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let checkbox: Checkbox;

    describe('Storybook "Checkbox" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            checkbox = new Checkbox(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Checkbox Component * Initial Testing', () => {
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
            it(`Enter ** Checkbox ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('checkbox');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Checkbox ** Component`, async function () {
                await checkbox.doesCheckboxComponentFound();
                const checkboxInputsTitles = await checkbox.getInputsTitles();
                console.info('checkboxInputsTitles:', JSON.stringify(checkboxInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(checkboxInputsTitles).to.eql(checkboxInputs);
                driver.sleep(5 * 1000);
            });
        });
        checkboxInputs.forEach(async (input) => {
            describe(`'${input}' Input`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('label')).to.be.true;
                        });
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('value')).to.be.true;
                        });
                        break;
                    case 'additionalValue':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('additionalValue')).to.be.true;
                        });
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('disabled')).to.be.true;
                        });
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('mandatory')).to.be.true;
                        });
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('renderTitle')).to.be.true;
                        });
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('showTitle')).to.be.true;
                        });
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('type')).to.be.true;
                        });
                        break;
                    case 'visible':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('visible')).to.be.true;
                        });
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(checkboxInputs.includes('xAlignment')).to.be.true;
                        });
                        break;

                    default:
                        break;
                }
            });
        });

        describe(`***STORIES`, async function () {
            checkboxStoriesHeaders.forEach(async (header, index) => {
                describe(`'${header}'`, async function () {
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
                        let headerText = '';
                        switch (header) {
                            case 'No label':
                                headerText = header.toLowerCase().replace(' ', '-');
                                break;
                            case 'Disabled & checked':
                            case 'Disabled & unchecked':
                            case 'Flipped & mandatory':
                                headerText = header.toLowerCase().replace(' ', '-').replace('&', '-').replace(' ', '-');
                                break;
                            case 'Type is booleanText':
                                headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                                break;

                            default:
                                break;
                        }
                        console.info('at validate story header -> headerText: ', headerText);
                        const storyHeaderSelector = await storyBookPage.getStorySelectorByText(index + 2, headerText);
                        const storyHeader = await (await driver.findElement(storyHeaderSelector)).getText();
                        expect(storyHeader.trim()).equals(header);
                    });
                    // add test
                });
            });
        });
    });
}
