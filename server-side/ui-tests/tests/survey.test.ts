import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';
import ResourceListUtils from '../utilities/resource_list';
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { ResourceEditors, ResourceViews } from '../pom/addons/ResourceList';
import { DataViewsService } from '../../services/data-views.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { ResourceListBasicViewerEditorBlocksStructurePage } from '../blueprints/PageBlocksBlueprints';

chai.use(promised);

export async function SurveyTests(email: string, password: string, client: Client) {
    //varPass: string, client: Client
    // const generalService = new GeneralService(client);
    let driver: Browser;

    // const templateToCreate: SurveyTemplate = {
    //     Name: 'first',
    //     Active: true,
    //     Key: '',
    //     Description: 'first',
    //     Sections: [
    //         {
    //             Key: '',
    //             Title: 'first section',
    //             Questions: [
    //                 {
    //                     Name: 'firstQ',
    //                     Key: '',
    //                     Title: 'firstQ',
    //                     Type: 'Short Text',
    //                 },
    //             ],
    //         },
    //     ],
    // };

    //TODO: add dependency installation for this
    // await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    // const testData = {
    //     'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.4.13'],
    //     Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
    //     'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
    //     Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', '0.0.100'],
    // };

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade script dependencies

    describe('Scripts Tests Suit', async function () {
        // describe('Prerequisites Addons for Scripts Tests', () => {
        //     //Test Data
        //     //Scripts
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     for (const addonName in testData) {
        //         const addonUUID = testData[addonName][0];
        //         const version = testData[addonName][1];
        //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         const changeType = chnageVersionResponseArr[addonName][3];
        //         describe(`Test Data: ${addonName}`, () => {
        //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });
        //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

        describe('Configuring Survey', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it('1. Create A Survey Template', async function () {
            //     const webAppLoginPage = new WebAppLoginPage(driver);
            //     await webAppLoginPage.login(email, password);
            //     const surveyService = new SurveyTemplateBuilder(driver);
            //     const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
            //     expect(isSurveyBuilderSettingsShown).to.equal(true);
            //     const isSurveyBuilderPageShown = await surveyService.enterSurveyBuilderActualBuilder();
            //     expect(isSurveyBuilderPageShown).to.equal(true);
            //     await surveyService.configureTheSurveyTemplate('first', 'first d', [
            //         {
            //             Title: 'boolean',
            //             Key: '',
            //             Questions: [
            //                 {
            //                     Key: '',
            //                     Title: 'what have i done1',
            //                     Type: 'Multiple Select',
            //                     OptionalValues: [{ Value: 'T' }, { Value: 'F' }, { Value: 'C' }],
            //                     isMandatory: true,
            //                 },
            //                 {
            //                     Key: '',
            //                     Title: 'what have i done2',
            //                     Type: 'Radio Group',
            //                     OptionalValues: [{ Value: 'A' }, { Value: 'B' }],
            //                     isMandatory: false,
            //                     ShowIf: {
            //                         Operator: 'And',
            //                         FilterData: { QuestionName: 'what have i done1', ValueToLookFor: ['T', 'C'] },
            //                     },
            //                 },
            //             ],
            //         },
            //     ]);
            });
            // it('2. Configure Resource Views For Account + Survey', async function () {
            //     const resourceListUtils = new ResourceListUtils(driver);
            //     const resourceViews = new ResourceViews(driver);
            //     const generalService = new GeneralService(client);
            //     const dataViewsService = new DataViewsService(generalService.papiClient);
            //     const webAppLoginPage = new WebAppLoginPage(driver);
            //     await webAppLoginPage.login(email, password);
            //     // Configure View - Accounts
            //     await resourceListUtils.addView({
            //         nameOfView: "Accounts22",
            //         descriptionOfView: "Acc",
            //         nameOfResource: "accounts",
            //     });
            //     const accViewKey = await resourceListUtils.getUUIDfromURL();
            //     let viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
            //         { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'InternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //     ]);
            //     await resourceViews.customViewConfig(dataViewsService, {
            //         matchingEditorName: "",
            //         viewKey: accViewKey,
            //         fieldsToConfigureInView: viewFields,
            //     });
            //     await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            //     // Configure View - Survey
            //     await resourceListUtils.addView({
            //         nameOfView: "Surveys",
            //         descriptionOfView: "Sur",
            //         nameOfResource: "surveys",
            //     });
            //     // Configure View
            //     const surveyViewKey = await resourceListUtils.getUUIDfromURL();
            //     viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
            //         { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'StatusName', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //         { fieldName: 'Template', dataViewType: 'TextBox', mandatory: false, readonly: false },
            //     ]);
            //     await resourceViews.customViewConfig(dataViewsService, {
            //         matchingEditorName: "",
            //         viewKey: surveyViewKey,
            //         fieldsToConfigureInView: viewFields,
            //     });
            //     await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            // });
            it('3. Create Page With Survey Block Inside It', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                const pageBuilder = new PageBuilder(driver);
                const resourceListUtils = new ResourceListUtils(driver);
                await webAppLoginPage.login(email, password);
                debugger;
                await resourceListUtils.navigateTo('Page Builder');
                await pageBuilder.addBlankPage("surveyBlockPage", `Automation Testing Page for survey`);
                driver.sleep(2 * 1000);
                const pageKey = await resourceListUtils.getUUIDfromURL();
                const createdPage = await pageBuilder.getPageByUUID(pageKey, client);
                const viewerBlockKey = createdPage.page.Blocks.find((block) => {
                    if (block.Configuration.Resource === 'DataViewerBlock') {
                        return block.Key;
                    }
                });
                const configurationBlockKey = createdPage.page.Blocks.find((block) => {
                    if (block.Configuration.Resource === 'DataConfigurationBlock') {
                        return block.Key;
                    }
                });
                console.info(`createdPage: ${JSON.stringify(createdPage, null, 2)}`);
                // console.info(`viewerBlockKey: ${JSON.stringify(viewerBlockKey, null, 2)}`);
                console.info(`viewerBlockKey: ${viewerBlockKey.Key}`);
                // console.info(`configurationBlockKey: ${JSON.stringify(configurationBlockKey, null, 2)}`);
                console.info(`configurationBlockKey: ${configurationBlockKey.Key}`);
              //TODO: do API call to set the page with survey block
            //   const pageObj = new ResourceListBasicViewerEditorBlocksStructurePage(
            //     pageKey,
            //     [
            //         {
            //             blockKey: viewerBlockKey,
            //             blockResource: 'DataViewerBlock',
            //             collectionName: resource_name,
            //             selectedView: {
            //                 selectedViewUUID: viewKey,
            //                 selectedViewName: viewName,
            //             },
            //         },
            //         {
            //             blockKey: configurationBlockKey,
            //             blockResource: 'DataConfigurationBlock',
            //             collectionName: resource_name,
            //             editorUUID: editorKey,
            //         },
            //     ],
            //     [
            //         {
            //             sectionKey: 'daef8f6c-1d91-cfba-ec3c-9da2828fb800',
            //             listOfBlockKeys: [viewerBlockKey],
            //         },
            //         {
            //             sectionKey: 'e23cc2d1-3e2a-f745-d41c-60b8020fb167',
            //             listOfBlockKeys: [configurationBlockKey],
            //         },
            //     ],
            // );
            });
            it('4. Create Slug And Map It To Show The Page With Survey Block + Configure On Home Screen', async function () {
                //TODO
            });
            it('5. Create Script Based On Config File With New Resource Views Configured', async function () {
                //TODO
            });
            it('6. Create Page With SlideShow Which Will Run The Script', async function () {
                //TODO
            });
            it('Data Cleansing', async function () {
                //TODO
            });
        });
    });
}
