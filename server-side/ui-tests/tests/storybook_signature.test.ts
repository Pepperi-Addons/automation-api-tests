import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Signature } from '../pom/Pages/StorybookComponents/Signature';

chai.use(promised);

export async function StorybookSignatureTests() {
    const signatureInputs = ['rowSpan', 'src', 'label', 'disabled', 'mandatory', 'readonly', 'showTitle', 'xAlignment'];
    const signatureOutputs = ['fileChange'];
    const signatureSubFoldersHeaders = ['Empty', 'Read only'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let signature: Signature;
    let signatureInputsTitles;
    let signatureOutputsTitles;

    describe('Storybook "Signature" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            signature = new Signature(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Signature Component * Initial Testing', () => {
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
            it(`Enter ** Signature ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('signature');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Signature ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await signature.doesSignatureComponentFound();
                signatureInputsTitles = await signature.getInputsTitles();
                console.info('signatureInputsTitles:', JSON.stringify(signatureInputsTitles, null, 2));
                signatureOutputsTitles = await signature.getOutputsTitles();
                console.info('signatureOutputsTitles:', JSON.stringify(signatureOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(signatureInputsTitles).to.eql(signatureInputs);
                expect(signatureOutputsTitles).to.eql(signatureOutputs);
                driver.sleep(5 * 1000);
            });
        });
        signatureInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'rowSpan':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'src':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('src')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'readonly':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('readonly')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(signatureInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        signatureOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'fileChange':
                        it(`it '${output}'`, async function () {
                            expect(signatureOutputsTitles.includes('fileChange')).to.be.true;
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
            signatureSubFoldersHeaders.forEach(async (header, index) => {
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
