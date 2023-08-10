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
            it(`Enter ** Attachment ** Component StoryBook`, async function () {
                await storyBookPage.chooseComponent('attachment');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Attachment ** Component`, async function () {
                await attachment.doesAttachmentComponentFound();
                const attachmentInputsTitles = await attachment.getInputsTitles();
                console.info('attachmentInputsTitles:', JSON.stringify(attachmentInputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(attachmentInputsTitles).to.eql(attachmentInputs);
                driver.sleep(5 * 1000);
            });
        });
        attachmentInputs.forEach(async (input) => {
            describe(`'${input}' Input`, async function () {
                switch (input) {
                    case 'rowSpan':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('rowSpan')).to.be.true;
                        });
                        break;
                    case 'label':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('label')).to.be.true;
                        });
                        break;
                    case 'src':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('src')).to.be.true;
                        });
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('disabled')).to.be.true;
                        });
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('mandatory')).to.be.true;
                        });
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('showTitle')).to.be.true;
                        });
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(attachmentInputs.includes('xAlignment')).to.be.true;
                        });
                        break;

                    default:
                        break;
                }
            });
        });

        describe(`***STORIES`, async function () {
            attachmentSubFoldersHeaders.forEach(async (header, index) => {
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
                            case 'With content':
                            case 'Without content':
                                headerText = header.toLowerCase().replace(' ', '-');
                                break;
                            case 'One span high':
                                headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                                break;
                            case 'Read only / Disabled':
                                headerText = 'read-only---disabled';
                                break;
                            case 'Mandatory':
                                headerText = header.toLowerCase();
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
