import { Browser } from '../utilities/browser';
import { describe, it, before, afterEach, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import { StoryBookPage } from '../pom/Pages/StoryBookPage';
import addContext from 'mochawesome/addContext';
import { ColorPicker } from '../pom/Pages/StorybookComponents/ColorPicker';

chai.use(promised);

export async function NgxLibPOC() {
    let driver: Browser;
    let webAppHomePage: WebAppHomePage;
    let storyBookPage: StoryBookPage;
    let colorPicker: ColorPicker;

    describe('NGX_LIB POC Tests Suit', function () {
        describe('Color Picker Component Testing', () => {
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
            it(`2. Enter Table Of Contents of Storybook`, async function () {
                //2. enter table of contents through "View Storybook" button
                await storyBookPage.enterTableOfContents();
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`3. Enter Color-Picker Component StoryBook`, async function () {
                //3. choose a component by name
                await storyBookPage.chooseComponent('color-picker');
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `Component Page We Got Into`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
            it(`4. Test Color-Picker Component`, async function () {
                //4. test component
                //4.1. is shown
                const isComponentFound = await colorPicker.isComponentFound();
                expect(isComponentFound).to.equal(true);
                //4.2. can be opened and presents correct modal
                await colorPicker.openComonentModal();
                const base64ImageComponentModal = await driver.saveScreenshots();
                addContext(this, {
                    title: `Presented Component Modal`,
                    value: 'data:image/png;base64,' + base64ImageComponentModal,
                });
                const isComponentModalFullyShown = await colorPicker.isModalFullyShown();
                expect(isComponentModalFullyShown).to.equal(true);
                await colorPicker.okModal();
                //4.3. can change label
                const newLabelToSet = 'evgeny';
                await storyBookPage.inputs.changeLabel(newLabelToSet);
                const newLabelGotFromUi = await colorPicker.getLabel();
                expect(newLabelGotFromUi).to.equal(newLabelToSet);
                //4.4. can disabled
                await storyBookPage.inputs.toggleDissableComponent();
                const isPenIconFound = await colorPicker.isPenIconFound();
                expect(isPenIconFound).to.equal(false);
                await storyBookPage.inputs.toggleDissableComponent();
                //4.5. can AACompilent on/off -- TODO: what does it mean?
                //4.6. showTitle
                await storyBookPage.inputs.toggleShowTitle();
                const labelAfterDisabelingTitle = await colorPicker.getLabel();
                expect(labelAfterDisabelingTitle).to.equal('Type is main'); // once there is no title - the next title is the one 'taken'
                await storyBookPage.inputs.toggleShowTitle();
                //4.7. run on all type and see ->3.2.
                const allTypes = await storyBookPage.inputs.getAllTypes();
                for (let index = 0; index < allTypes.length; index++) {
                    const type = allTypes[index];
                    await type.click();
                    const isComponentModalFullyShown = await colorPicker.testComponentModal();
                    expect(isComponentModalFullyShown).to.equal(true);
                }
                await allTypes[0].click();
                //4.8. color value
                await storyBookPage.inputs.setColorValue('#1fbeb9');
                const currentColor = await colorPicker.getComponentColor();
                expect(currentColor).to.equal('(31, 190, 185)'); // same as "#1fbeb9" in RGB
                //4.9. xAlignment
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
            it(`5. Test All Color-Picker Stories`, async function () {
                //5. test all stories
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
    });
}
