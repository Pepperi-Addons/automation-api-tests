import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Chips } from '../pom/Pages/StorybookComponents/Chips';

chai.use(promised);

export async function StorybookChipsTests() {
    const chipsInputs = [
        'label',
        'chips',
        'classNames',
        'disabled',
        'inline',
        'mandatory',
        'orientation',
        'placeholder',
        'renderTitle',
        'showTitle',
        'styleType',
        'type',
        'xAlignment',
    ];
    const chipsSubFoldersHeaders = [
        'Without content',
        'With content',
        'Inline is true',
        'Type is select',
        'Orientation is vertical',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let chips: Chips;

    describe('Storybook "Chips" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            chips = new Chips(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Chips Component * Initial Testing', () => {
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
            it(`Enter ** Chips ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('chips');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Chips ** Component`, async function () {
                await chips.doesChipsComponentFound();
                const chipsInputsTitles = await chips.getInputsTitles();
                console.info('chipsInputsTitles:', JSON.stringify(chipsInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(chipsInputsTitles).to.eql(chipsInputs);
                driver.sleep(5 * 1000);
            });
        });
        chipsInputs.forEach(async (input) => {
            describe(`'${input}' Input`, async function () {
                switch (input) {
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('label')).to.be.true;
                        });
                        break;
                    case 'chips':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('chips')).to.be.true;
                        });
                        break;
                    case 'classNames':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('classNames')).to.be.true;
                        });
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('disabled')).to.be.true;
                        });
                        break;
                    case 'inline':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('inline')).to.be.true;
                        });
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('mandatory')).to.be.true;
                        });
                        break;
                    case 'orientation':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('orientation')).to.be.true;
                        });
                        break;
                    case 'placeholder':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('placeholder')).to.be.true;
                        });
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('renderTitle')).to.be.true;
                        });
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('showTitle')).to.be.true;
                        });
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('styleType')).to.be.true;
                        });
                        break;
                    case 'type':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('type')).to.be.true;
                        });
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(chipsInputs.includes('xAlignment')).to.be.true;
                        });
                        break;

                    default:
                        break;
                }
            });
        });

        describe(`***STORIES`, async function () {
            chipsSubFoldersHeaders.forEach(async (header, index) => {
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
                        // await driver.switchTo(attachment.IframeElement);
                    });
                    it(`validate story header`, async function () {
                        await driver.switchTo(storyBookPage.StorybookIframe);
                        let headerText = '';
                        switch (header) {
                            case 'Without content':
                            case 'With content':
                                headerText = header.toLowerCase().replace(' ', '-');
                                break;
                            case 'Inline is true':
                            case 'Type is select':
                            case 'Orientation is vertical':
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
                    // it(`it '${header}'`, async function () { });
                });
            });
        });
    });
}
