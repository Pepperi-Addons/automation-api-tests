import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Icon } from '../pom/Pages/StorybookComponents/Icon';

chai.use(promised);

export async function StorybookIconTests() {
    const iconInputs = ['name', 'fill', 'spin'];
    const iconSubFoldersHeaders = ['All icons'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let icon: Icon;
    let iconInputsTitles;

    describe('Storybook "Icon" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            icon = new Icon(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Icon Component * Initial Testing', () => {
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
            it(`Enter ** Icon ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('icon');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Icon ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await icon.doesIconComponentFound();
                iconInputsTitles = await icon.getInputsTitles();
                console.info('iconInputsTitles:', JSON.stringify(iconInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(iconInputsTitles).to.eql(iconInputs);
                driver.sleep(5 * 1000);
            });
        });
        iconInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'name':
                        it(`it '${input}'`, async function () {
                            expect(iconInputsTitles.includes('name')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'fill':
                        it(`it '${input}'`, async function () {
                            expect(iconInputsTitles.includes('fill')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'spin':
                        it(`it '${input}'`, async function () {
                            expect(iconInputsTitles.includes('spin')).to.be.true;
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
            iconSubFoldersHeaders.forEach(async (header) => {
                describe(`"${header}"`, async function () {
                    it(`Navigate to story (Screenshot)`, async function () {
                        await driver.switchToDefaultContent();
                        await storyBookPage.chooseSubFolder(`base-all-icons`);
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
                        const storyHeaderSelector = await storyBookPage.getStorySelectorByText(0, headerText);
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
