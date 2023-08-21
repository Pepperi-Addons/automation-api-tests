import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { Attachment } from '../pom/Pages/StorybookComponents/Attachment';
import { WebElement } from 'selenium-webdriver';

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
    const alignExpectedValues = ['center', 'right'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let attachment: Attachment;
    let attachmentInputsTitles;
    let attachmentOutputsTitles;
    let attachmentComplexElement;
    let attachmentComplexHeight;
    let expectedUrl;
    let allAlignments: WebElement[] = [];

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
            it(`Overview Test of ** Attachment ** Component - ASSERTIONS`, async function () {
                await attachment.doesAttachmentComponentFound();
                attachmentInputsTitles = await attachment.getInputsTitles();
                console.info('attachmentInputsTitles:', JSON.stringify(attachmentInputsTitles, null, 2));
                attachmentOutputsTitles = await attachment.getOutputsTitles();
                console.info('attachmentOutputsTitles:', JSON.stringify(attachmentOutputsTitles, null, 2));
                expect(attachmentInputsTitles).to.eql(attachmentInputs);
                expect(attachmentOutputsTitles).to.eql(attachmentOutputs);
                driver.sleep(5 * 1000);
            });
        });
        attachmentInputs.forEach(async (input) => {
            describe(`INPUT: '${input}'`, async function () {
                it(`SCREENSHOT`, async function () {
                    const base64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `'${input}' input`,
                        value: 'data:image/png;base64,' + base64ImageComponent,
                    });
                });
                switch (input) {
                    case 'rowSpan':
                        it(`validate input`, async function () {
                            expect(attachmentInputsTitles.includes('rowSpan')).to.be.true;
                        });
                        it(`default height [ control = 2 ] measurement (+screenshot)`, async function () {
                            attachmentComplexElement = await driver.findElement(attachment.MainExampleHeightDiv);
                            attachmentComplexHeight = await attachmentComplexElement.getCssValue('height');
                            console.info('attachmentComplexHeight: ', attachmentComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentComplexHeight.trim()).to.equal('106px');
                        });
                        it(`[ control = 1 ] height measurement (+screenshot)`, async function () {
                            await attachment.changeRowSpanControl(1);
                            attachmentComplexElement = await driver.findElement(attachment.MainExampleHeightDiv);
                            attachmentComplexHeight = await attachmentComplexElement.getCssValue('height');
                            console.info('attachmentComplexHeight: ', attachmentComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentComplexHeight.trim()).to.equal('42px');
                        });
                        it(`[ control = 3 ] height measurement (+screenshot)`, async function () {
                            await attachment.changeRowSpanControl(3);
                            attachmentComplexElement = await driver.findElement(attachment.MainExampleHeightDiv);
                            attachmentComplexHeight = await attachmentComplexElement.getCssValue('height');
                            console.info('attachmentComplexHeight: ', attachmentComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentComplexHeight.trim()).to.equal('170px');
                        });
                        it(`[ control = 0 ] height measurement (+screenshot)`, async function () {
                            await attachment.changeRowSpanControl(0);
                            attachmentComplexElement = await driver.findElement(attachment.MainExampleHeightDiv);
                            attachmentComplexHeight = await attachmentComplexElement.getCssValue('height');
                            console.info('attachmentComplexHeight: ', attachmentComplexHeight);
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' default height`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentComplexHeight.trim()).to.equal('46px');
                        });
                        break;

                    case 'label':
                        it(`validate input`, async function () {
                            expect(attachmentInputsTitles.includes('label')).to.be.true;
                            await driver.click(attachment.ResetControlsButton);
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newLabelToSet = 'Auto test';
                            await storyBookPage.inputs.changeLabel(newLabelToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Label Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newLabelGotFromUi = await attachment.getLabel();
                            expect(newLabelGotFromUi).to.equal(newLabelToSet);
                        });
                        break;

                    case 'src':
                        it(`validate input`, async function () {
                            expect(attachmentInputsTitles.includes('src')).to.be.true;
                            await attachment.changeRowSpanControl(1);
                        });
                        it(`default source [ control = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png' ] (+screenshot)`, async function () {
                            expectedUrl = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png';
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `default '${input}'`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            const newUrl = await attachment.openMainExampleSource(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `default '${input}'- new tab after click`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('default image Url: ', newUrl);
                            expect(newUrl).to.equal(expectedUrl);
                        });
                        it(`[ control = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg' ] functional test (+screenshot)`, async function () {
                            expectedUrl =
                                'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg';
                            await driver.switchTo(storyBookPage.StorybookIframe);
                            await attachment.changeSrcControl(expectedUrl);
                            let base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of dfstudio`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            driver.sleep(2 * 1000);
                            const newUrl = await attachment.openMainExampleSource(); // opens new tab
                            base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `image of dfstudio`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await driver.close(); // closes new tab
                            await driver.switchToOtherTab(1);
                            console.info('image Url of dfstudio: ', newUrl);
                            expect(newUrl).to.equal(expectedUrl);
                            expectedUrl = 'https://yonatankof.com/misc/pepp/Addon%20Hackathon%20-%20Badge.png';
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(attachmentInputsTitles.includes('disabled')).to.be.true;
                            await driver.switchTo(storyBookPage.StorybookIframe);
                            driver.sleep(1 * 1000);
                        });
                        it(`open inputs`, async function () {
                            await driver.click(attachment.Inputs_mainTableRow);
                        });
                        it(`Functional test (+screenshots)`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.toggleDissableComponent();
                            await driver.scrollToElement(attachment.MainHeader);
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(attachment.MainExample_deleteButton);
                            await storyBookPage.inputs.toggleDissableComponent();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(attachment.MainExample_deleteButton);
                        });
                        break;

                    case 'mandatory':
                        it(`validate input`, async function () {
                            expect(attachmentInputsTitles.includes('mandatory')).to.be.true;
                            driver.sleep(1 * 1000);
                        });
                        it(`Functional test (+screenshots)`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.toggleMandatoryComponent();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(attachment.MainExample_mandatoryIcon);
                            await storyBookPage.inputs.toggleMandatoryComponent();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Mandatory Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(attachment.MainExample_mandatoryIcon);
                        });
                        break;

                    case 'showTitle':
                        it(`validate input`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentInputsTitles.includes('showTitle')).to.be.true;
                            await attachment.changeSrcControl(expectedUrl);
                            driver.sleep(1 * 1000);
                        });
                        it(`Functional test (+screenshots)`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.toggleShowTitle();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.elemntDoNotExist(attachment.MainExample_titleLabel);
                            await storyBookPage.inputs.toggleShowTitle();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ShowTitle Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            await storyBookPage.untilIsVisible(attachment.MainExample_titleLabel);
                        });
                        break;

                    case 'xAlignment':
                        it(`close outputs`, async function () {
                            await driver.click(attachment.Outputs_mainTableRow);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Closed Outputs`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                        });
                        it(`validate input & get all xAlignments`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            expect(attachmentInputsTitles.includes('xAlignment')).to.be.true;
                            allAlignments = await storyBookPage.inputs.getAllAlignments();
                            driver.sleep(1 * 1000);
                        });
                        it(`validate current xAlignment is "left"`, async function () {
                            const currentAlign = await attachment.getTxtAlignmentByComponent('attachment');
                            expect(currentAlign).to.include('left');
                        });
                        alignExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshots)`, async function () {
                                const alignment = allAlignments[index + 1];
                                await alignment.click();
                                const currentAlign = await attachment.getTxtAlignmentByComponent('attachment');
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (xAlignment) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                expect(currentAlign).to.include(title);
                                await driver.click(attachment.MainExampleDiv);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: attachment with x-alignment = '${title}'`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        break;

                    default:
                        throw new Error(`Input: "${input}" is not covered in switch!`);
                    // break;
                }
            });
        });
        attachmentOutputs.forEach(async (output, index) => {
            describe(`OUTPUT: '${output}'`, async function () {
                if (index === 0) {
                    it(`close inputs & open outputs`, async function () {
                        await driver.click(attachment.Inputs_mainTableRow);
                        let base64ImageComponentModal = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Closed Inputs`,
                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                        });
                        await driver.click(attachment.Outputs_mainTableRow);
                        base64ImageComponentModal = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Opened Outputs`,
                            value: 'data:image/png;base64,' + base64ImageComponentModal,
                        });
                    });
                }
                switch (output) {
                    case 'elementClick':
                        it(`validate output`, async function () {
                            expect(attachmentOutputsTitles.includes('elementClick')).to.be.true;
                        });
                        it(`validate '${output}' output default value [new EventEmitter<IPepFieldClickEvent>()]`, async function () {
                            const selectorOfOutputDefaultValue = await attachment.getSelectorOfOutputDefaultValueByName(
                                output,
                            );
                            const outputDefaultValue = await (
                                await driver.findElement(selectorOfOutputDefaultValue)
                            ).getText();
                            expect(outputDefaultValue.trim()).equals('new EventEmitter<IPepFieldClickEvent>()');
                        });
                        break;
                    case 'fileChange':
                        it(`validate output`, async function () {
                            expect(attachmentOutputsTitles.includes('fileChange')).to.be.true;
                        });
                        it(`validate '${output}' output default value [new EventEmitter<any>()]`, async function () {
                            const selectorOfOutputDefaultValue = await attachment.getSelectorOfOutputDefaultValueByName(
                                output,
                            );
                            const outputDefaultValue = await (
                                await driver.findElement(selectorOfOutputDefaultValue)
                            ).getText();
                            expect(outputDefaultValue.trim()).equals('new EventEmitter<any>()');
                        });
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
