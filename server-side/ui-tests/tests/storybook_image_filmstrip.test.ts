import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ImageFilmstrip } from '../pom/Pages/StorybookComponents/ImageFilmstrip';

chai.use(promised);

export async function StorybookImageFilmstripTests() {
    const imageFilmstripInputs = [
        'rowSpan',
        'label',
        'value',
        'renderTitle',
        'showThumbnails',
        'showTitle',
        'xAlignment',
    ];
    const imageFilmstripSubFoldersHeaders = ['No title & missing image', 'With thumbnails'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let imageFilmstrip: ImageFilmstrip;
    let imageFilmstripInputsTitles;

    describe('Storybook "ImageFilmstrip" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            imageFilmstrip = new ImageFilmstrip(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* ImageFilmstrip Component * Initial Testing', () => {
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
            it(`Enter ** ImageFilmstrip ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('image-filmstrip');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** ImageFilmstrip ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await imageFilmstrip.doesImageFilmstripComponentFound();
                imageFilmstripInputsTitles = await imageFilmstrip.getInputsTitles();
                console.info('imageFilmstripInputsTitles:', JSON.stringify(imageFilmstripInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(imageFilmstripInputsTitles).to.eql(imageFilmstripInputs);
                driver.sleep(5 * 1000);
            });
        });
        imageFilmstripInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'rowSpan':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showThumbnails':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('showThumbnails')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(imageFilmstripInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        describe(`**STORIES`, async function () {
            imageFilmstripSubFoldersHeaders.forEach(async (header, index) => {
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
