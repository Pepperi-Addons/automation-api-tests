import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../pom/Pages/Components/ColorPicker';

chai.use(promised);

export async function NgxLibPOC() {
    // const storybook_homeURL = 'https://www.chromatic.com/library?appId=60ae3e9eff8e4c003b2f90d4&branch=master';
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let colorPicker: ColorPicker;

    describe('NGX_LIB POC Tests Suit', async function () {
        await describe('Color Picker Component Testing', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
                webAppHomePage = new WebAppHomePage(driver);
                storyBookPage = new StoryBookPage(driver);
                colorPicker = new ColorPicker(driver);
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                await webAppHomePage.collectEndTestData(this);
            });

            it(`1. Enter Story Book Site & Choose Latest Master Build`, async function () {
                //1. navigate to story book webstite
                await storyBookPage.navigate();
                //1.1. choose the latest build
                await storyBookPage.chooseLatestBuild();
                //1.2. document on which build were running
                const base64ImageBuild = await driver.saveScreenshots();
                addContext(this, {
                    title: `Were Running On This Build Of StoryBook`,
                    value: 'data:image/png;base64,' + base64ImageBuild,
                });
            });
            it(`2. Enter Color-Picker Component StoryBook`, async function () {
                //2. choose a component by name
                await storyBookPage.chooseComponent('color-picker');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`3. Test Color-Picker Component`, async function () {
                //3. test component
                //3.1. is shown
                const isComponentFound = await colorPicker.isComponentFound();
                expect(isComponentFound).to.equal(true);
                //3.2. can be opened and presents correct modal
                await colorPicker.openComonentModal();
                const base64ImageComponentModal = await driver.saveScreenshots();
                addContext(this, {
                    title: `Presented Component Modal`,
                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                });
                const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                expect(isComponentModalFullyShown).to.equal(true);
                await colorPicker.okModal();
                //3.3. can change label
                const newLabelToSet = 'evgeny';
                await storyBookPage.inputs.changeLabel(newLabelToSet);
                const newLabelGotFromUi = await colorPicker.getLabel();
                expect(newLabelGotFromUi).to.equal(newLabelToSet);
                //3.4. can disabled
                await storyBookPage.inputs.toggleDissableComponent();
                const isPenIconFound = await colorPicker.isPenIconFound();
                expect(isPenIconFound).to.equal(false);
                await storyBookPage.inputs.toggleDissableComponent();
                //3.5. can AACompilent on/off -- TODO: what does it mean?
                //3.6. showTitle
                await storyBookPage.inputs.toggleShowTitle();
                const labelAfterDisabelingTitle = await colorPicker.getLabel();
                expect(labelAfterDisabelingTitle).to.equal('Type is main'); // once there is no title - the next title is the one 'taken'
                await storyBookPage.inputs.toggleShowTitle();
                //3.7. run on all type and see ->3.2.
                const allTypes = await storyBookPage.inputs.getAllTypes();
                for (let index = 0; index < allTypes.length; index++) {
                    const type = allTypes[index];
                    await type.click();
                    const isComponentModalFullyShown = await colorPicker.testComponentModal();
                    expect(isComponentModalFullyShown).to.equal(true);
                }
                await allTypes[0].click();
                //3.8. color value
                await storyBookPage.inputs.setColorValue('#1fbeb9');
                const currentColor = await colorPicker.getComponentColor();
                expect(currentColor).to.equal('(31, 190, 185)'); // same as "#1fbeb9" in RGB
                //3.9. xAlignment
                const currentAlign = await colorPicker.getComponentTxtAlignment();
                expect(currentAlign).to.include('left');
                const allAlignments = await storyBookPage.inputs.getAllAlignments();
                const alignExpectedValues = ['center', 'right'];
                for (let index = 0; index < allAlignments.length; index++) {
                    const alignment = allAlignments[index];
                    await alignment.click();
                    const currentAlign = await colorPicker.getComponentTxtAlignment();
                    expect(currentAlign).to.include(alignExpectedValues[index]);
                }
            });
            it(`4. Test All Color-Picker Stories`, async function () {
                //4. test all stories
                const allStories = await colorPicker.getAllStories();
                for (let index = 0; index < allStories.length; index++) {
                    const storyComponent = allStories[index];
                    await storyComponent.click();
                    const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                    const story64ImageComponent = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Story Modal As Presented In StoryBook`,
                        value: 'data:image/png;base64,' + story64ImageComponent,
                    });
                    expect(isComponentModalFullyShown).to.equal(true);
                    await colorPicker.okModal();
                }
            });
        });
        // describe('Border Radius Component Testing', async () => {
        //     // const driver: Browser = await Browser.initiateChrome();
        //     this.retries(0);

        //     // before(async function () {
        //     //     driver = await Browser.initiateChrome();
        //     //     webAppHomePage = new WebAppHomePage(driver);
        //     //     storyBookPage = new StoryBookPage(driver);
        //     //     colorPicker = new ColorPicker(driver);
        //     // });

        //     after(async function () {
        //         await driver.quit();
        //     });

        //     afterEach(async function () {
        //         await webAppHomePage.collectEndTestData(this);
        //     });
        //     it(`1. Enter Story Book Site & Choose Latest Master Build`, async function () {
        //         //1. navigate to story book webstite
        //         await storyBookPage.navigate();
        //         //1.1. choose the latest build
        //         await storyBookPage.chooseLatestBuild();
        //         //1.2. document on which build were running
        //         const base64ImageBuild = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Were Running On This Build Of StoryBook`,
        //             value: 'data:image/png;base64,' + base64ImageBuild,
        //         });
        //     });
        //     it(`5. Enter Border-Radius Component StoryBook`, async function () {
        //         // Navigate to Storybook Home Page
        //         // await driver.navigate(storybook_homeURL);
        //         // await driver.switchToDefaultContent
        //         // await storyBookPage.isSpinnerDone();
        //         //5. choose a component by name
        //         await storyBookPage.chooseComponent('border-radius');
        //         const base64ImageComponent = await driver.saveScreenshots();
        //         addContext(this, {
        //             title: `Component Page We Got Into`,
        //             value: 'data:image/png;base64,' + base64ImageComponent,
        //         });
        //     });
        //     // it(`6. Test Border-Radius Component`, async function () {
        //     //     //6. test component
        //     //     //6.1. is shown
        //     //     const isComponentFound = await colorPicker.isComponentFound();
        //     //     expect(isComponentFound).to.equal(true);
        //     //     //6.2. can be opened and presents correct modal
        //     //     await colorPicker.openComonentModal();
        //     //     const base64ImageComponentModal = await driver.saveScreenshots();
        //     //     addContext(this, {
        //     //         title: `Presented Component Modal`,
        //     //         value: 'data:image/png;base64,' + base64ImageComponentModal,
        //     //     });
        //     //     const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
        //     //     expect(isComponentModalFullyShown).to.equal(true);
        //     //     await colorPicker.okModal();
        //     //     //6.3. can change label
        //     //     const newLabelToSet = 'evgeny';
        //     //     await storyBookPage.inputs.changeLabel(newLabelToSet);
        //     //     const newLabelGotFromUi = await colorPicker.getLabel();
        //     //     expect(newLabelGotFromUi).to.equal(newLabelToSet);
        //     //     //6.4. can disabled
        //     //     await storyBookPage.inputs.toggleDissableComponent();
        //     //     const isPenIconFound = await colorPicker.isPenIconFound();
        //     //     expect(isPenIconFound).to.equal(false);
        //     //     await storyBookPage.inputs.toggleDissableComponent();
        //     //     //6.5. can AACompilent on/off -- TODO: what does it mean?
        //     //     //6.6. showTitle
        //     //     await storyBookPage.inputs.toggleShowTitle();
        //     //     const labelAfterDisabelingTitle = await colorPicker.getLabel();
        //     //     expect(labelAfterDisabelingTitle).to.equal('Type is main'); // once there is no title - the next title is the one 'taken'
        //     //     await storyBookPage.inputs.toggleShowTitle();
        //     //     //6.7. run on all type and see ->6.2.
        //     //     const allTypes = await storyBookPage.inputs.getAllTypes();
        //     //     for (let index = 0; index < allTypes.length; index++) {
        //     //         const type = allTypes[index];
        //     //         await type.click();
        //     //         const isComponentModalFullyShown = await colorPicker.testComponentModal();
        //     //         expect(isComponentModalFullyShown).to.equal(true);
        //     //     }
        //     //     await allTypes[0].click();
        //     //     //6.8. color value
        //     //     await storyBookPage.inputs.setColorValue('#1fbeb9');
        //     //     const currentColor = await colorPicker.getComponentColor();
        //     //     expect(currentColor).to.equal('(31, 190, 185)'); // same as "#1fbeb9" in RGB
        //     //     //6.9. xAlignment
        //     //     const currentAlign = await colorPicker.getComponentTxtAlignment();
        //     //     expect(currentAlign).to.include('left');
        //     //     const allAlignments = await storyBookPage.inputs.getAllAlignments();
        //     //     const alignExpectedValues = ['center', 'right'];
        //     //     for (let index = 0; index < allAlignments.length; index++) {
        //     //         const alignment = allAlignments[index];
        //     //         await alignment.click();
        //     //         const currentAlign = await colorPicker.getComponentTxtAlignment();
        //     //         expect(currentAlign).to.include(alignExpectedValues[index]);
        //     //     }
        //     // });
        //     // it(`7. Test All Border-Radius Stories`, async function () {
        //     //     //7. test all stories
        //     //     const allStories = await colorPicker.getAllStories();
        //     //     for (let index = 0; index < allStories.length; index++) {
        //     //         const storyComponent = allStories[index];
        //     //         await storyComponent.click();
        //     //         const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
        //     //         const story64ImageComponent = await driver.saveScreenshots();
        //     //         addContext(this, {
        //     //             title: `Story Modal As Presented In StoryBook`,
        //     //             value: 'data:image/png;base64,' + story64ImageComponent,
        //     //         });
        //     //         expect(isComponentModalFullyShown).to.equal(true);
        //     //         await colorPicker.okModal();
        //     //     }
        //     // });

        // });
    });
}
