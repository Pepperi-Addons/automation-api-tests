import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Image } from '../../pom/Pages/StorybookComponents/Image';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookImageTests() {
    const imageInputs = ['rowSpan', 'src', 'disabled', 'label', 'mandatory', 'showTitle', 'xAlignment'];
    const imageOutputs = ['elementClick', 'fileChange'];
    const imageSubFoldersHeaders = ['Without an image', 'With an image', 'Change row span', 'Broken image link'];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let image: Image;
    let imageInputsTitles;
    let imageOutputsTitles;
    let imageComplexElement;
    let imageComplexHeight;
    let expectedSrc;
    let imageSrc;
    let allAlignments: WebElement[] = [];

    describe('Storybook "Image" Tests Suite', function () {
        this.retries(0);

        before(async function () {
            driver = await Browser.initiateChrome();
            webAppHomePage = new WebAppHomePage(driver);
            storyBookPage = new StoryBookPage(driver);
            image = new Image(driver);
        });

        after(async function () {
            await driver.quit();
        });

        describe('* Image Component * Initial Testing', () => {
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
            it(`Enter ** Image ** Component StoryBook - SCREENSHOT`, async function () {
                await storyBookPage.chooseComponent('image');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`Overview Test of ** Image ** Component - ASSERTIONS + SCREENSHOT`, async function () {
                await image.doesImageComponentFound();
                imageInputsTitles = await image.getInputsTitles();
                console.info('imageInputsTitles:', JSON.stringify(imageInputsTitles, null, 2));
                imageOutputsTitles = await image.getOutputsTitles();
                console.info('imageOutputsTitles:', JSON.stringify(imageOutputsTitles, null, 2));
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
                expect(imageInputsTitles).to.eql(imageInputs);
                expect(imageOutputsTitles).to.eql(imageOutputs);
                driver.sleep(5 * 1000);
            });
        });
        imageInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await image.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(image.Inputs_mainTableRow);
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
                    case 'rowSpan':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 4 ] measurement (+screenshot)`, async function () {
                            imageComplexElement = await driver.findElement(image.MainExampleHeightDiv);
                            imageComplexHeight = await imageComplexElement.getCssValue('height');
                            console.info('imageComplexHeight: ', imageComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageComplexHeight.trim()).to.equal('258px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await image.changeRowSpanControl(1);
                            imageComplexElement = await driver.findElement(image.MainExampleHeightDiv);
                            imageComplexHeight = await imageComplexElement.getCssValue('height');
                            console.info('imageComplexHeight: ', imageComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageComplexHeight.trim()).to.equal('66px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await image.changeRowSpanControl(3);
                            imageComplexElement = await driver.findElement(image.MainExampleHeightDiv);
                            imageComplexHeight = await imageComplexElement.getCssValue('height');
                            console.info('imageComplexHeight: ', imageComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageComplexHeight.trim()).to.equal('194px');
                        });
                        it(`[ control = 0 ] height measurement (+screenshot)`, async function () {
                            await image.changeRowSpanControl(0);
                            imageComplexElement = await driver.findElement(image.MainExampleHeightDiv);
                            imageComplexHeight = await imageComplexElement.getCssValue('height');
                            console.info('imageComplexHeight: ', imageComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageComplexHeight.trim()).to.equal('64px');
                        });
                        it(`back to default height [ control = 4 ] measurement (+screenshot)`, async function () {
                            await image.changeRowSpanControl(4);
                            imageComplexElement = await driver.findElement(image.MainExampleHeightDiv);
                            imageComplexHeight = await imageComplexElement.getCssValue('height');
                            console.info('imageComplexHeight: ', imageComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' back to default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageComplexHeight.trim()).to.equal('258px');
                        });
                        break;
                    case 'src':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('src')).to.be.true;
                        });
                        it(`default source [ control = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png' ] (+screenshot)`, async function () {
                            expectedSrc = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png';
                            imageSrc = await image.getImageSource();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `default '${input}'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageSrc).to.equal(expectedSrc);
                        });
                        it(`[ control = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg' ] functional test (+screenshot)`, async function () {
                            expectedSrc =
                                'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg';
                            await image.changeSrcControl(expectedSrc);
                            driver.sleep(0.2 * 1000);
                            imageSrc = await image.getImageSource();
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of dfstudio`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageSrc).to.equal(expectedSrc);
                            expectedSrc = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png';
                        });
                        break;
                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(image.MainHeader);
                            const mainExampleImage = await driver.findElement(image.MainExampleImage);
                            const mainExampleImageDisabled = await mainExampleImage.getAttribute('disabled');
                            console.info(
                                'mainExampleImageDisabled (false): ',
                                JSON.stringify(mainExampleImageDisabled, null, 2),
                            );
                            expect(mainExampleImageDisabled).to.be.null;
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(image.MainHeader);
                            expect(await driver.isElementVisible(image.MainExampleImage)).to.be.false;
                            driver.sleep(1 * 1000);
                            // expect(await driver.isElementVisible(image.MainExampleImage_disabled)).to.eventually.be
                            //     .true;
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(image.MainHeader);
                            const mainExampleImage = await driver.findElement(image.MainExampleImage);
                            const mainExampleImageDisabled = await mainExampleImage.getAttribute('disabled');
                            expect(mainExampleImageDisabled).to.be.null;
                        });
                        break;
                    case 'label':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('label')).to.be.true;
                            await driver.click(image.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await image.getMainExampleLabel('image');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;
                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`making sure current value is "False"`, async function () {
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(image.MainExample_mandatoryIcon);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            expect(mandatoryControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(image.MainExample_mandatoryIcon);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleMandatoryControl();
                            const mandatoryControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Mandatory',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mandatoryControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(image.MainExample_mandatoryIcon);
                        });
                        break;
                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(image.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(image.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(image.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(image.MainExample_titleLabel);
                        });
                        break;
                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(imageInputsTitles.includes('xAlignment')).to.be.true;
                        });
                        it(`get all xAlignments`, async function () {
                            allAlignments = await storyBookPage.inputs.getAllxAlignments();
                            driver.sleep(1 * 1000);
                        });
                        it(`validate current xAlignment is "left"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `[xAlignment = 'left']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const currentAlign = await image.getTxtAlignmentByComponent('image');
                            await driver.click(image.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: image with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await image.getTxtAlignmentByComponent('image');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(image.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: image with x-alignment = '${title}'`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                });
                            }
                        });
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        imageOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await image.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'elementClick':
                        it(`it '${output}'`, async function () {
                            expect(imageOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'fileChange':
                        it(`it '${output}'`, async function () {
                            expect(imageOutputsTitles.includes('fileChange')).to.be.true;
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
            imageSubFoldersHeaders.forEach(async (header, index) => {
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
