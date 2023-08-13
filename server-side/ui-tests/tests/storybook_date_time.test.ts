import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { DateTime } from '../pom/Pages/StorybookComponents/DateTime';

chai.use(promised);

export async function StorybookDateTimeTests() {
    const dateTimeInputs = [
        'label',
        'value',
        'disabled',
        'mandatory',
        'renderError',
        'renderSymbol',
        'renderTitle',
        'showTitle',
        'textColor',
        'type',
        'xAlignment',
    ];
    const dateTimeSubFoldersHeaders = ['Empty date-time'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let dateTime: DateTime;

    describe('Storybook "DateTime" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            dateTime = new DateTime(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* DateTime Component * Initial Testing', () => {
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
            it(`Enter ** DateTime ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('date-date-time');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** DateTime ** Component`, async function () {
                await dateTime.doesDateTimeComponentFound();
                const dateTimeInputsTitles = await dateTime.getInputsTitles();
                console.info('dateTimeInputsTitles:', JSON.stringify(dateTimeInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(dateTimeInputsTitles).to.eql(dateTimeInputs);
                driver.sleep(5 * 1000);
            });
        });
        dateTimeInputs.forEach(async (input) => {
            describe(`'${input}' Input`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('label')).to.be.true;
                        });
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('value')).to.be.true;
                        });
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('disabled')).to.be.true;
                        });
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('mandatory')).to.be.true;
                        });
                        break;
                    case 'renderError':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('renderError')).to.be.true;
                        });
                        break;
                    case 'renderSymbol':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('renderSymbol')).to.be.true;
                        });
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('renderTitle')).to.be.true;
                        });
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('showTitle')).to.be.true;
                        });
                        break;
                    case 'textColor':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('textColor')).to.be.true;
                        });
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('type')).to.be.true;
                        });
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(dateTimeInputs.includes('xAlignment')).to.be.true;
                        });
                        break;

                    default:
                        break;
                }
            });
        });

        describe(`***STORIES`, async function () {
            dateTimeSubFoldersHeaders.forEach(async (header, index) => {
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
                        // await driver.switchTo(dateTime.IframeElement);
                    });
                    it(`validate story header`, async function () {
                        await driver.switchTo(storyBookPage.StorybookIframe);
                        let headerText = '';
                        switch (header) {
                            case 'Empty date-time':
                                headerText = header.toLowerCase().replace(' ', '-');
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
                    // it(`it '${header}'`, async function () { });
                });
            });
        });
    });
}
