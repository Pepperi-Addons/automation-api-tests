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
    const iconPositionsExpectedValues = ['start', 'end'];
    const sizeTypesExpectedValues = ['xs', 'sm', 'md', 'lg', 'xl'];
    const styleStateTypeExpectedValues = ['system', 'caution', 'success'];
    const styleTypeExpectedValues = ['weak', 'weak-invert', 'regular', 'strong'];
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let button: Button;
    let buttonInputsTitles;
    let buttonOutputsTitles;
    let allIconPositions;
    let allSizeTypes;
    let mainExampleButton;
    let mainExampleButtonHeight;
    let allStyleStateTypes;
    let allStyleTypes;

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
                        console.info('Already on iFrame');
                    }
                });
                it(`open inputs if it's closed`, async function () {
                    const inputsMainTableRowElement = await driver.findElement(button.Inputs_mainTableRow);
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
                    case 'value':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('value')).to.be.true;
                        });
                        it(`[ control = 'Auto test' ] functional test (+screenshot)`, async function () {
                            const newValueToSet = 'Auto test';
                            await storyBookPage.inputs.changeValue(newValueToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Value Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newValueGotFromUi = await button.getMainExampleButtonValue();
                            expect(newValueGotFromUi).to.equal(newValueToSet);
                        });
                        break;

                    case 'classNames':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('classNames')).to.be.true;
                        });
                        it(`[ control = 'rotate3d' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = 'rotate3d';
                            await storyBookPage.inputs.changeClassNames(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(button.MainExampleButton)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.contain(newClassNamesToSet);
                        });
                        it(`[ control = '' ] functional test (+screenshot)`, async function () {
                            const newClassNamesToSet = '';
                            await storyBookPage.inputs.changeClassNames(newClassNamesToSet);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `ClassNames Input Change`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const newClassNamesGotFromUi = await (
                                await driver.findElement(button.MainExampleButton)
                            ).getAttribute('class');
                            console.info('newClassNamesGotFromUi: ', JSON.stringify(newClassNamesGotFromUi, null, 2));
                            expect(newClassNamesGotFromUi).to.not.contain('rotate3d');
                        });
                        break;

                    case 'disabled':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('disabled')).to.be.true;
                        });
                        it(`Functional test (+screenshots)`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.toggleDissableComponent();
                            await driver.scrollToElement(button.MainHeader);
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "true"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            let mainExampleButton = await driver.findElement(button.MainExampleButton);
                            expect(await mainExampleButton.getAttribute('disabled')).to.equal('true');
                            await storyBookPage.inputs.toggleDissableComponent();
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Disabled Input Changed to "false"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleButton = await driver.findElement(button.MainExampleButton);
                            const disabledAttribute = await mainExampleButton.getAttribute('disabled');
                            expect(disabledAttribute).to.be.null;
                        });
                        break;

                    case 'iconName':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('iconName')).to.be.true;
                        });
                        it(`Functional test [ control = 'arrow_up' ](+screenshots)`, async function () {
                            const newIconNameToSelect = 'arrow_up';
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.selectIconName(newIconNameToSelect);
                            await driver.scrollToElement(button.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Icon Name Select Changed to "${newIconNameToSelect}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExampleButtonIcon = await driver.findElement(button.MainExampleButton_icon);
                            const mainExampleButtonIconSvgValue = await (
                                await driver.findElement(button.MainExampleButton_iconSvgValue)
                            ).getAttribute('d');
                            console.info(
                                'mainExampleButtonIconSvgValue: ',
                                JSON.stringify(mainExampleButtonIconSvgValue, null, 2),
                            );
                            expect(mainExampleButtonIcon).to.not.be.undefined.and.not.be.null;
                            expect(mainExampleButtonIconSvgValue).equals(
                                'M18.2 14.713l-5.454-3.916a1.113 1.113 0 00-1.492 0L5.8 14.713a1.113 1.113 0 01-1.491 0 .93.93 0 010-1.384l6.2-5.756c.823-.764 2.159-.764 2.982 0l6.2 5.756a.93.93 0 010 1.384 1.113 1.113 0 01-1.491 0z',
                            );
                        });
                        it(`Functional test [ control = 'device_mobile' ](+screenshots)`, async function () {
                            const newIconNameToSelect = 'device_mobile';
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            await storyBookPage.inputs.selectIconName(newIconNameToSelect);
                            await driver.scrollToElement(button.MainHeader);
                            const base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Icon Name Select Changed to "${newIconNameToSelect}"`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            const mainExampleButtonIcon = await driver.findElement(button.MainExampleButton_icon);
                            const mainExampleButtonIconSvgValue = await (
                                await driver.findElement(button.MainExampleButton_iconSvgValue)
                            ).getAttribute('d');
                            console.info(
                                'mainExampleButtonIconSvgValue: ',
                                JSON.stringify(mainExampleButtonIconSvgValue, null, 2),
                            );
                            expect(mainExampleButtonIcon).to.not.be.undefined.and.not.be.null;
                            expect(mainExampleButtonIconSvgValue).equals(
                                'M16 3a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2h8zm-1 2H9a1 1 0 00-1 1v12a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1zm-1 11a1 1 0 010 2h-4a1 1 0 010-2h4z',
                            );
                        });
                        break;

                    case 'iconPosition':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('iconPosition')).to.be.true;
                        });
                        it(`get all icon positions`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allIconPositions = await storyBookPage.inputs.getAllIconPositions();
                            driver.sleep(1 * 1000);
                            console.info('allIconPositions length: ', allIconPositions.length);
                            expect(allIconPositions.length).equals(iconPositionsExpectedValues.length);
                        });
                        it(`validate current icon position is "end"`, async function () {
                            const buttonFirstChild = await driver.findElement(button.MainExampleButton_firstChild);
                            const buttonFirstChildHtmlTag = await buttonFirstChild.getTagName();
                            const buttonSecondChild = await driver.findElement(button.MainExampleButton_secondChild);
                            const buttonSecondChildHtmlTag = await buttonSecondChild.getTagName();
                            console.info('buttonFirstChildHtmlTag: ', buttonFirstChildHtmlTag);
                            console.info('buttonSecondChildHtmlTag: ', buttonSecondChildHtmlTag);
                            expect(buttonFirstChildHtmlTag).to.equal('span');
                            expect(buttonSecondChildHtmlTag).to.equal('mat-icon');
                        });
                        iconPositionsExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const iconPosition = allIconPositions[index];
                                await iconPosition.click();
                                const buttonFirstChild = await driver.findElement(button.MainExampleButton_firstChild);
                                const buttonFirstChildHtmlTag = await buttonFirstChild.getTagName();
                                const buttonSecondChild = await driver.findElement(
                                    button.MainExampleButton_secondChild,
                                );
                                const buttonSecondChildHtmlTag = await buttonSecondChild.getTagName();
                                console.info('buttonFirstChildHtmlTag: ', buttonFirstChildHtmlTag);
                                console.info('buttonSecondChildHtmlTag: ', buttonSecondChildHtmlTag);
                                const base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (iconPosition) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                switch (title) {
                                    case 'start':
                                        expect(buttonFirstChildHtmlTag).to.equal('mat-icon');
                                        expect(buttonSecondChildHtmlTag).to.equal('span');
                                        break;
                                    case 'end':
                                        expect(buttonFirstChildHtmlTag).to.equal('span');
                                        expect(buttonSecondChildHtmlTag).to.equal('mat-icon');
                                        break;

                                    default:
                                        break;
                                }
                            });
                        });
                        break;

                    case 'sizeType':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('sizeType')).to.be.true;
                        });
                        it(`get all size types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allSizeTypes = await storyBookPage.inputs.getAllSizeTypes();
                            driver.sleep(1 * 1000);
                            console.info('allSizeTypes length: ', allSizeTypes.length);
                            expect(allSizeTypes.length).equals(sizeTypesExpectedValues.length);
                        });
                        it(`validate current size type is "md"`, async function () {
                            mainExampleButton = await driver.findElement(button.MainExampleButton);
                            mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                            console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                            expect(mainExampleButtonHeight).to.equal('40px');
                        });
                        sizeTypesExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const sizeType = allSizeTypes[index];
                                await sizeType.click();
                                mainExampleButton = await driver.findElement(button.MainExampleButton);
                                mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                                console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (sizeType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                let expectedHeight;
                                switch (title) {
                                    case 'xs':
                                        expectedHeight = '24px';
                                        break;
                                    case 'sm':
                                        expectedHeight = '32px';
                                        break;
                                    case 'md':
                                        expectedHeight = '40px';
                                        break;
                                    case 'lg':
                                        expectedHeight = '48px';
                                        break;
                                    case 'xl':
                                        expectedHeight = '64px';
                                        break;

                                    default:
                                        expectedHeight = '';
                                        break;
                                }
                                expect(mainExampleButtonHeight).to.equal(expectedHeight);
                                await driver.click(button.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: button with [size type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [size type = "md"]`, async function () {
                            await allSizeTypes[2].click();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `size type changed to 'md'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            mainExampleButton = await driver.findElement(button.MainExampleButton);
                            mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                            console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                            await driver.click(button.MainHeader);
                            driver.sleep(0.1 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: button with [size type = 'md']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            expect(mainExampleButtonHeight).to.equal('40px');
                        });
                        break;

                    case 'styleStateType':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('styleStateType')).to.be.true;
                        });
                        it(`get all style state types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allStyleStateTypes = await storyBookPage.inputs.getAllStyleStateTypes();
                            driver.sleep(1 * 1000);
                            console.info('allStyleStateTypes length: ', allStyleStateTypes.length);
                            expect(allStyleStateTypes.length).equals(styleStateTypeExpectedValues.length);
                        });
                        // it(`validate current style state type is "system"`, async function () {
                        // });
                        styleStateTypeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const styleStateType = allStyleStateTypes[index];
                                await styleStateType.click();
                                // mainExampleButton = await driver.findElement(button.MainExampleButton);
                                // mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                                // console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (styleStateType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                // let expectedHeight;
                                switch (title) {
                                    case 'system':
                                        console.info(`At SYSTEM style state type`);
                                        break;
                                    case 'caution':
                                        console.info(`At CAUSION style state type`);
                                        break;
                                    case 'success':
                                        console.info(`At SUCCESS style state type`);
                                        break;

                                    default:
                                        console.info(`At DEFAULT style state type`);
                                        break;
                                }
                                // expect(mainExampleButtonHeight).to.equal(expectedHeight);
                                await driver.click(button.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: button with [style state type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [style state type = "system"]`, async function () {
                            await allStyleStateTypes[0].click();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `style state type changed to 'system'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // mainExampleButton = await driver.findElement(button.MainExampleButton);
                            // mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                            // console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                            await driver.click(button.MainHeader);
                            driver.sleep(0.1 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: button with [style state type = 'system']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // expect(mainExampleButtonHeight).to.equal('40px');
                        });
                        break;

                    case 'styleType':
                        it(`validate input`, async function () {
                            expect(buttonInputsTitles.includes('styleType')).to.be.true;
                        });
                        it(`get all style types`, async function () {
                            const base64ImageComponent = await driver.saveScreenshots();
                            addContext(this, {
                                title: `'${input}' input`,
                                value: 'data:image/png;base64,' + base64ImageComponent,
                            });
                            allStyleTypes = await storyBookPage.inputs.getAllStyleTypes();
                            driver.sleep(1 * 1000);
                            console.info('allStyleTypes length: ', allStyleTypes.length);
                            expect(allStyleTypes.length).equals(styleTypeExpectedValues.length);
                        });
                        // it(`validate current style type is "weak"`, async function () {
                        // });
                        styleTypeExpectedValues.forEach(async (title, index) => {
                            it(`'${title}' -- functional test (+screenshot)`, async function () {
                                const styleType = allStyleTypes[index];
                                await styleType.click();
                                // mainExampleButton = await driver.findElement(button.MainExampleButton);
                                // mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                                // console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                                let base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `${title} (styleType) input change`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                                // let expectedHeight;
                                switch (title) {
                                    case 'weak':
                                        console.info(`At WEAK style type`);
                                        break;
                                    case 'weak-invert':
                                        console.info(`At WEAK-INVERT style type`);
                                        break;
                                    case 'regular':
                                        console.info(`At REGULAR style type`);
                                        break;
                                    case 'strong':
                                        console.info(`At STRONG style type`);
                                        break;

                                    default:
                                        console.info(`At DEFAULT style type`);
                                        break;
                                }
                                // expect(mainExampleButtonHeight).to.equal(expectedHeight);
                                await driver.click(button.MainHeader);
                                driver.sleep(0.1 * 1000);
                                base64ImageComponentModal = await driver.saveScreenshots();
                                addContext(this, {
                                    title: `upper screenshot: button with [style type = '${title}']`,
                                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                                });
                            });
                        });
                        it(`back to default [style type = "weak"]`, async function () {
                            await allStyleTypes[0].click();
                            let base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `style type changed to 'weak'`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // mainExampleButton = await driver.findElement(button.MainExampleButton);
                            // mainExampleButtonHeight = await mainExampleButton.getCssValue('height');
                            // console.info('mainExampleButtonHeight: ', mainExampleButtonHeight);
                            await driver.click(button.MainHeader);
                            driver.sleep(0.1 * 1000);
                            base64ImageComponentModal = await driver.saveScreenshots();
                            addContext(this, {
                                title: `upper screenshot: button with [style type = 'weak']`,
                                value: 'data:image/png;base64,' + base64ImageComponentModal,
                            });
                            // expect(mainExampleButtonHeight).to.equal('40px');
                        });
                        break;

                    case 'visible':
                        it(`validate input`, async function () {
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
