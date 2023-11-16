import { Browser } from '../../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../../pom';
import { StoryBookPage } from '../../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Signature } from '../../pom/Pages/StorybookComponents/Signature';
import { WebElement } from 'selenium-webdriver';

chai.use(promised);

export async function StorybookSignatureTests() {
    const signatureInputs = ['rowSpan', 'src', 'label', 'disabled', 'mandatory', 'readonly', 'showTitle', 'xAlignment'];
    const signatureOutputs = ['elementClick', 'fileChange'];
    const signatureSubFoldersHeaders = ['Empty', 'Read only'];
    const alignExpectedValues = ['', 'center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let signature: Signature;
    let signatureInputsTitles;
    let signatureOutputsTitles;
    let signatureComplexElement;
    let signatureComplexHeight;
    let expectedSrc;
    let imageSrc;
    let allAlignments: WebElement[] = [];

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
                it(`SCREENSHOT`, async function () {
                    await driver.click(await signature.getInputRowSelectorByName(input));
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
                    const inputsMainTableRowElement = await driver.findElement(signature.Inputs_mainTableRow);
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
                            expect(signatureInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 4 ] measurement (+screenshot)`, async function () {
                            signatureComplexElement = await driver.findElement(signature.MainExampleHeightDiv);
                            signatureComplexHeight = await signatureComplexElement.getCssValue('height');
                            console.info('signatureComplexHeight: ', signatureComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(signatureComplexHeight.trim()).to.equal('258px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await signature.changeRowSpanControl(1);
                            signatureComplexElement = await driver.findElement(signature.MainExampleHeightDiv);
                            signatureComplexHeight = await signatureComplexElement.getCssValue('height');
                            console.info('signatureComplexHeight: ', signatureComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(signatureComplexHeight.trim()).to.equal('66px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await signature.changeRowSpanControl(3);
                            signatureComplexElement = await driver.findElement(signature.MainExampleHeightDiv);
                            signatureComplexHeight = await signatureComplexElement.getCssValue('height');
                            console.info('signatureComplexHeight: ', signatureComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(signatureComplexHeight.trim()).to.equal('194px');
                        });
                        it(`[ control = 0 ] height measurement (+screenshot)`, async function () {
                            await signature.changeRowSpanControl(0);
                            signatureComplexElement = await driver.findElement(signature.MainExampleHeightDiv);
                            signatureComplexHeight = await signatureComplexElement.getCssValue('height');
                            console.info('signatureComplexHeight: ', signatureComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(signatureComplexHeight.trim()).to.equal('64px');
                        });
                        it(`back to default height [ control = 4 ] measurement (+screenshot)`, async function () {
                            await signature.changeRowSpanControl(4);
                            signatureComplexElement = await driver.findElement(signature.MainExampleHeightDiv);
                            signatureComplexHeight = await signatureComplexElement.getCssValue('height');
                            console.info('signatureComplexHeight: ', signatureComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' back to default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(signatureComplexHeight.trim()).to.equal('258px');
                        });
                        break;
                    case 'src':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('src')).to.be.true;
                        });
                        it(`default source [ control = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png' ] (+screenshot)`, async function () {
                            expectedSrc = 'https://yonatankof.com/misc/pepp/signature.png';
                            imageSrc = await signature.getImageSource();
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
                            await signature.changeSrcControl(expectedSrc);
                            driver.sleep(0.2 * 1000);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of dfstudio`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            imageSrc = await signature.getImageSource();
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of dfstudio`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(imageSrc).to.equal(expectedSrc);
                            expectedSrc = 'https://yonatankof.com/misc/pepp/signature.png';
                        });
                        break;
                    case 'label':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('label')).to.be.true;
                            await driver.click(signature.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabelControl(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await signature.getMainExampleLabel('signature');
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;
                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(signature.MainHeader);
                            const mainExampleSignature = await driver.findElement(signature.MainExampleSignature);
                            const mainExampleSignatureDisabled = await mainExampleSignature.getAttribute('class');
                            console.info(
                                'mainExampleSignatureDisabled (false): ',
                                JSON.stringify(mainExampleSignatureDisabled, null, 2),
                            );
                            expect(mainExampleSignatureDisabled).to.not.include('disable');
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(signature.MainHeader);
                            const mainExampleSignature = await driver.findElement(signature.MainExampleSignature);
                            const mainExampleSignatureDisabled = await mainExampleSignature.getAttribute('class');
                            console.info(
                                'mainExampleSignatureDisabled (true): ',
                                JSON.stringify(mainExampleSignatureDisabled, null, 2),
                            );
                            expect(mainExampleSignatureDisabled).to.include('disable');
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleDisableControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disable Input changed back to default value = "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await driver.click(signature.MainHeader);
                            const mainExampleSignature = await driver.findElement(signature.MainExampleSignature);
                            const mainExampleSignatureDisabled = await mainExampleSignature.getAttribute('class');
                            expect(mainExampleSignatureDisabled).to.not.include('disable');
                        });
                        break;
                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('mandatory')).to.be.true;
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
                            await storyBookPage.elemntDoNotExist(signature.MainExample_mandatoryIcon);
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
                            await storyBookPage.untilIsVisible(signature.MainExample_mandatoryIcon);
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
                            await storyBookPage.elemntDoNotExist(signature.MainExample_mandatoryIcon);
                        });
                        break;
                    case 'readonly':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('readonly')).to.be.true;
                        });
                        it(`making sure current value is "False"`, async function () {
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(readonlyControlState).to.be.false;
                            const mainExampleSignature = await driver.findElement(signature.MainExampleSignature);
                            const mainExampleSignatureDisabled = await mainExampleSignature.getAttribute('class');
                            console.info('mainExampleSignatureDisabled: ', mainExampleSignatureDisabled);
                            // await signature.untilIsVisible(signature.MainExampleSignature);
                            // await storyBookPage.elemntDoNotExist(signature.MainExampleSignatureReadonly);
                        });
                        it(`Functional test [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleReadonlyControl();
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            expect(readonlyControlState).to.be.true;
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // await signature.untilIsVisible(signature.MainExampleSignatureReadonly);
                            // await storyBookPage.elemntDoNotExist(signature.MainExampleSignature);
                        });
                        it(`back to default [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleReadonlyControl();
                            const readonlyControlState = await storyBookPage.inputs.getTogglerStateByInputName(
                                'Readonly',
                            );
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Readonly Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(readonlyControlState).to.be.false;
                            // await signature.untilIsVisible(signature.MainExampleSignature);
                            // await storyBookPage.elemntDoNotExist(signature.MainExampleSignatureReadonly);
                        });
                        break;
                    case 'showTitle':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('showTitle')).to.be.true;
                        });
                        it(`making sure current value is "True"`, async function () {
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const inputsMainTableRowElement = await driver.findElement(signature.Inputs_mainTableRow);
                            if ((await inputsMainTableRowElement.getAttribute('title')).includes('Show')) {
                                await inputsMainTableRowElement.click();
                            }
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.untilIsVisible(signature.MainExample_titleLabel);
                        });
                        it(`functional test [ control = 'False' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(signature.MainExample_titleLabel);
                        });
                        it(`back to default [ control = 'True' ](+screenshots)`, async function () {
                            await storyBookPage.inputs.toggleShowTitleControl();
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(signature.MainExample_titleLabel);
                        });
                        break;
                    case 'xAlignment':
                        it(`validate input`, async function () {
                            expect(signatureInputsTitles.includes('xAlignment')).to.be.true;
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
                            const currentAlign = await signature.getTxtAlignmentByComponent('signature');
                            await driver.click(signature.MainHeader);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: signature with x-alignment = 'left'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            if (title) {
                                it(`'${title}' -- functional test (+screenshots)`, async function () {
                                    const alignment = allAlignments[index];
                                    await alignment.click();
                                    const currentAlign = await signature.getTxtAlignmentByComponent('signature');
                                    let base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `${title} (xAlignment) input change`,
                                        value: 'data:image/png;base64,' + base64ImageComponentModal,
                                    });
                                    expect(currentAlign).to.include(title);
                                    await driver.click(signature.MainHeader);
                                    base64ImageComponentModal = await driver.saveScreenshots();
                                    addContext(this, {
                                        title: `upper screenshot: signature with x-alignment = '${title}'`,
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
        signatureOutputs.forEach(async (output) => {
            describe(`OUTPUT: '${output}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    await driver.click(await signature.getOutputRowSelectorByName(output));
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${output}' output`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (output) {
                    case 'elementClick':
                        it(`validate output`, async function () {
                            expect(signatureOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        // TODO
                        break;
                    case 'fileChange':
                        it(`validate output`, async function () {
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
