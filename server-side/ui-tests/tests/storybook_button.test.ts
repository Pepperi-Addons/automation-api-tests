import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Button } from '../pom/Pages/StorybookComponents/Button';

chai.use(promised);

export async function StorybookButtonTests() {
    const buttonInputs = [
        'value',
        'classNames',
        'disabled',
        'iconName',
        'iconPosition',
        'sizeType',
        'styleStateType',
        'styleType',
        'visible',
    ];
    const buttonOutputs = ['buttonClick'];
    const buttonStoriesHeaders = ['Disabled', 'Icon on start', 'Icon on end', 'Icon only', 'Styles, options and sizes'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let button: Button;
    let buttonInputsTitles;
    let buttonOutputsTitles;

    describe('Storybook "Button" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            button = new Button(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Button Component * Initial Testing', () => {
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
            it(`Enter ** Button ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('button');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Button ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await button.doesButtonComponentFound();
                buttonInputsTitles = await button.getInputsTitles();
                console.info('buttonInputsTitles:', JSON.stringify(buttonInputsTitles, null, 2));
                buttonOutputsTitles = await button.getOutputsTitles();
                console.info('buttonOutputsTitles:', JSON.stringify(buttonOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(buttonInputsTitles).to.eql(buttonInputs);
                expect(buttonOutputsTitles).to.eql(buttonOutputs);
                driver.sleep(5 * 1000);
            });
        });
        buttonInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                switch (input) {
                    case 'value':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('value')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'classNames':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('classNames')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'disabled':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('disabled')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'iconName':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('iconName')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'iconPosition':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('iconPosition')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'sizeType':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('sizeType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleStateType':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('styleStateType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'styleType':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('styleType')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'visible':
                        it(`it '${input}'`, async function () {
                            expect(buttonInputsTitles.includes('visible')).to.be.true;
                        });
                        // TODO
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        buttonOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                switch (output) {
                    case 'buttonClick':
                        it(`it '${output}'`, async function () {
                            expect(buttonOutputsTitles.includes('buttonClick')).to.be.true;
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
            buttonStoriesHeaders.forEach(async (header, index) => {
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
                    //     case 'Disabled':
                    //         headerText = header.toLowerCase();
                    //         break;
                    //     case 'Icon on start':
                    //     case 'Icon on end':
                    //         headerText = header.toLowerCase().replace(' ', '-').replace(' ', '-');
                    //         break;
                    //     case 'Icon only':
                    //         headerText = header.toLowerCase().replace(' ', '-');
                    //         break;
                    //     case 'Styles, options and sizes':
                    //         headerText = header.split(', ')[1].replace(' ', '-').replace(' ', '-');
                    //         // headerText = 'options-and-sizes';
                    //         break;

                    //     default:
                    //         throw new Error(`Header: "${header}" is not covered in switch!`);
                    //         // break;
                    // }

                    //});
                });
            });
        });
    });
}
