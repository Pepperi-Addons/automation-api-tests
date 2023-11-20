import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ImageFilmstrip } from '../../pom/Pages/StorybookComponents/ImageFilmstrip';
import { WebElement } from 'selenium-webdriver';

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
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let imageFilmstrip: ImageFilmstrip;
    let imageFilmstripInputsTitles;
    let imageFilmstripComplexElement;
    let imageFilmstripComplexHeight;
    let allAlignments: WebElement[] = [];

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await imageFilmstrip.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(imageFilmstrip.Inputs_mainTableRow);
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
                            expect(imageFilmstripInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 8 ] measurement (+screenshot)`, async function () {
                            imageFilmstripComplexElement = await driver.findElement(
                                imageFilmstrip.MainExampleHeightDiv,
                            );
                            imageFilmstripComplexHeight = await imageFilmstripComplexElement.getCssValue('height');
                            console.info('imageFilmstripComplexHeight: ', imageFilmstripComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageFilmstripComplexHeight.trim()).to.equal('512px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await imageFilmstrip.changeRowSpanControl(1);
                            imageFilmstripComplexElement = await driver.findElement(
                                imageFilmstrip.MainExampleHeightDiv,
                            );
                            imageFilmstripComplexHeight = await imageFilmstripComplexElement.getCssValue('height');
                            console.info('imageFilmstripComplexHeight: ', imageFilmstripComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageFilmstripComplexHeight.trim()).to.equal('64px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await imageFilmstrip.changeRowSpanControl(3);
                            imageFilmstripComplexElement = await driver.findElement(
                                imageFilmstrip.MainExampleHeightDiv,
                            );
                            imageFilmstripComplexHeight = await imageFilmstripComplexElement.getCssValue('height');
                            console.info('imageFilmstripComplexHeight: ', imageFilmstripComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageFilmstripComplexHeight.trim()).to.equal('192px');
                        });
                        it(`[ control = 0 ] height measurement (+screenshot)`, async function () {
                            await imageFilmstrip.changeRowSpanControl(0);
                            imageFilmstripComplexElement = await driver.findElement(
                                imageFilmstrip.MainExampleHeightDiv,
                            );
                            imageFilmstripComplexHeight = await imageFilmstripComplexElement.getCssValue('height');
                            console.info('imageFilmstripComplexHeight: ', imageFilmstripComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageFilmstripComplexHeight.trim()).to.equal('64px');
                        });
                        it(`back to default height [ control = 8 ] measurement (+screenshot)`, async function () {
                            await imageFilmstrip.changeRowSpanControl(8);
                            imageFilmstripComplexElement = await driver.findElement(
                                imageFilmstrip.MainExampleHeightDiv,
                            );
                            imageFilmstripComplexHeight = await imageFilmstripComplexElement.getCssValue('height');
                            console.info('imageFilmstripComplexHeight: ', imageFilmstripComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' back to default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageFilmstripComplexHeight.trim()).to.equal('512px');
                        });
                        break;

                    case 'label':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('label')).to.be.true;
                            await driver.click(imageFilmstrip.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await imageFilmstrip.getMainExampleLabel('image-filmstrip');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'value':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('value')).to.be.true;
                        });
                        it(`making sure current value is "https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png"`, async function () {
                            const expectedValue = `url("https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png");`;
                            await driver.click(imageFilmstrip.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await imageFilmstrip.getMainExampleImageFilmstripValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        it(`functional test [ control = "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg" ] (+screenshot)`, async function () {
                            const newValueToSet =
                                'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg';
                            const expectedValue = `url("https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg");`;
                            await storyBookPage.inputs.changeValueControl(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change -> 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            imageFilmstrip.pause(1 * 1000);
                            const newValueGotFromUi = await imageFilmstrip.getMainExampleImageFilmstripValue();
                            expect(newValueGotFromUi).to.equal(expectedValue);
                        });
                        it(`back to default [ control = "https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png" ] (+screenshots)`, async function () {
                            await driver.click(imageFilmstrip.ResetControlsButton);
                            const expectedValue = `url("https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png");`;
                            await driver.click(imageFilmstrip.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input default value = "https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const valueGotFromUi = await imageFilmstrip.getMainExampleImageFilmstripValue();
                            expect(valueGotFromUi).to.equal(expectedValue);
                        });
                        break;

                    case 'renderTitle':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('renderTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(imageFilmstrip.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(imageFilmstrip.MainExample_pepTitle);
                        });
                        it(`Functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(imageFilmstrip.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(imageFilmstrip.MainExample_pepTitle);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleRenderTitleControl();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `RenderTitle Input changed back to default value = "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(imageFilmstrip.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Upper View of RenderTitle Input "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(imageFilmstrip.MainExample_pepTitle);
                        });
                        break;

                    case 'showThumbnails':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('showThumbnails')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const showThumbnailsControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'ShowThumbnails',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `showThumbnails Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(showThumbnailsControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(imageFilmstrip.MainExampleGalleryThumbs);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowThumbnailsControl();
                            const showThumbnailsControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'ShowThumbnails',
                            );
                            expect(showThumbnailsControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `showThumbnails Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(imageFilmstrip.MainExampleGalleryThumbs);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowThumbnailsControl();
                            const showThumbnailsControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'ShowThumbnails',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `showThumbnails Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(showThumbnailsControlState).to.be.false;
                            await storyBookPage.elemntDoNotExist(imageFilmstrip.MainExampleGalleryThumbs);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(
                                imageFilmstrip.Inputs_mainTableRow,
                            );
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(imageFilmstrip.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(imageFilmstrip.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(imageFilmstrip.MainExample_titleLabel);
                        });
                        break;

                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(imageFilmstripInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await imageFilmstrip.getTxtAlignmentByComponent('image-filmstrip');
                            await driver.click(imageFilmstrip.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: image-filmstrip with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await imageFilmstrip.getTxtAlignmentByComponent(
                                        'image-filmstrip',
                                    );
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(imageFilmstrip.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: imageFilmstrip with x-alignment = '${title}'`,
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
