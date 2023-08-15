import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Attachment } from '../pom/Pages/StorybookComponents/Attachment';

chai.use(promised);

export async function StorybookAttachmentTests() {
    const attachmentInputs = ['rowSpan', 'label', 'src', 'disabled', 'mandatory', 'showTitle', 'xAlignment'];
    const attachmentOutputs = ['elementClick', 'fileChange'];
    const attachmentSubFoldersHeaders = [
        'With content',
        'Without content',
        'One span high',
        'Read only / Disabled',
        'Mandatory',
    ];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let attachment: Attachment;
    let attachmentInputsTitles;
    let attachmentOutputsTitles;

    describe('Storybook "Attachment" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            attachment = new Attachment(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Attachment Component * Initial Testing', () => {
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
            it(`Enter ** Attachment ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('attachment');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Attachment ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await attachment.doesAttachmentComponentFound();
                attachmentInputsTitles = await attachment.getInputsTitles();
                console.info('attachmentInputsTitles:', JSON.stringify(attachmentInputsTitles, null, 2));
                attachmentOutputsTitles = await attachment.getOutputsTitles();
                console.info('attachmentOutputsTitles:', JSON.stringify(attachmentOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(attachmentInputsTitles).to.eql(attachmentInputs);
                expect(attachmentOutputsTitles).to.eql(attachmentOutputs);
                driver.sleep(5 * 1000);
            });
        });
        attachmentInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'rowSpan':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'src':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('src')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        attachmentOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'elementClick':
                        it(`it '${output}'`, async function () {
                            expect(attachmentOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'fileChange':
                        it(`it '${output}'`, async function () {
                            expect(attachmentOutputsTitles.includes('fileChange')).to.be.true;
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
            attachmentSubFoldersHeaders.forEach(async (header, index) => {
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
                    // it(`it '${header}'`, async function () {
                    // let headerText = '';
                    // switch (header) {
                    //     case 'With content':
                    //     case 'Without content':
                    //         headerText = header.toLowerCase().replace(' ', '-');
                    //         break;
                    //     case 'One span high':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                    //         break;
                    //     case 'Read only / Disabled':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-').replace('/', '-').replace(' ', '-');
                    //         // headerText = 'read-only---disabled';
                    //         break;
                    //     case 'Mandatory':
                    //         headerText = header.toLowerCase();
                    //         break;

                    //     default:
                    //         throw new Error(`Header: "${header}" is not covered in switch!`);
                    //         // break;
                    // }
                    // });
                });
            });
        });
    });
}
