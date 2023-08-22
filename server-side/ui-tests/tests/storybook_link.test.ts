import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Link } from '../pom/Pages/StorybookComponents/Link';

chai.use(promised);

export async function StorybookLinkTests() {
    const linkInputs = [
        'label',
        'value',
        'displayValue',
        'disabled',
        'mandatory',
        'maxFieldCharacters',
        'renderError',
        'renderSymbol',
        'renderTitle',
        'showTitle',
        'textColor',
        'xAlignment',
    ];
    const linkOutputs = ['elementClick', 'valueChange'];
    const linkSubFoldersHeaders = ['Empty', 'Read only', 'Read only, no button', 'Max characters'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let link: Link;
    let linkInputsTitles;
    let linkOutputsTitles;

    describe('Storybook "Link" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            link = new Link(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Link Component * Initial Testing', () => {
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
            it(`Enter ** Link ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('link');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Link ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await link.doesLinkComponentFound();
                linkInputsTitles = await link.getInputsTitles();
                console.info('linkInputsTitles:', JSON.stringify(linkInputsTitles, null, 2));
                linkOutputsTitles = await link.getOutputsTitles();
                console.info('linkOutputsTitles:', JSON.stringify(linkOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(linkInputsTitles).to.eql(linkInputs);
                expect(linkOutputsTitles).to.eql(linkOutputs);
                driver.sleep(5 * 1000);
            });
        });
        linkInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
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
                    const inputsMainTableRowElement = await driver.findElement(link.Inputs_mainTableRow);
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
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('label')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'displayValue':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('displayValue')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'mandatory':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('mandatory')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'maxFieldCharacters':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('maxFieldCharacters')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderError':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('renderError')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderSymbol':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('renderSymbol')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'renderTitle':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'showTitle':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('showTitle')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'textColor':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('textColor')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'xAlignment':
                        it(`it '${input}'`, async function () {
                            expect(linkInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        linkOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'elementClick':
                        it(`it '${output}'`, async function () {
                            expect(linkOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'valueChange':
                        it(`it '${output}'`, async function () {
                            expect(linkOutputsTitles.includes('valueChange')).to.be.true;
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
            linkSubFoldersHeaders.forEach(async (header, index) => {
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
