import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import { SurveyBlock, SurveyBlockColumn, SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';
import E2EUtils from '../utilities/e2e_utils';
import { GridDataViewField } from '@pepperi-addons/papi-sdk';
import { ResourceViews } from '../pom/addons/ResourceList';
import { DataViewsService } from '../../services/data-views.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import * as fs from 'fs';
import * as path from 'path';

chai.use(promised);

export async function SurveyTests(email: string, password: string, client: Client) {
    //varPass: string, client: Client
    // const generalService = new GeneralService(client);
    let driver: Browser;
    let surveyBlockPageName;
    let surveyViewUUID;
    let accountViewUUID;

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
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const surveyService = new SurveyTemplateBuilder(driver);
                const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
                expect(isSurveyBuilderSettingsShown).to.equal(true);
                const isSurveyBuilderPageShown = await surveyService.enterSurveyBuilderActualBuilder();
                expect(isSurveyBuilderPageShown).to.equal(true);
                await surveyService.configureTheSurveyTemplate('first', 'first d', [
                    {
                        Title: 'boolean',
                        Key: '',
                        Questions: [
                            {
                                Key: '',
                                Title: 'what have i done1',
                                Type: 'Multiple Select',
                                OptionalValues: [{ Value: 'T' }, { Value: 'F' }, { Value: 'C' }],
                                isMandatory: true,
                            },
                            {
                                Key: '',
                                Title: 'what have i done2',
                                Type: 'Radio Group',
                                OptionalValues: [{ Value: 'A' }, { Value: 'B' }],
                                isMandatory: false,
                                ShowIf: {
                                    Operator: 'And',
                                    FilterData: { QuestionName: 'what have i done1', ValueToLookFor: ['T', 'C'] },
                                },
                            },
                        ],
                    },
                ]);
            });
            it('2. Configure Resource Views For Account + Survey', async function () {
                const resourceListUtils = new E2EUtils(driver);
                const resourceViews = new ResourceViews(driver);
                const generalService = new GeneralService(client);
                const dataViewsService = new DataViewsService(generalService.papiClient);
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // Configure View - Accounts
                await resourceListUtils.addView({
                    nameOfView: 'Accounts22',
                    descriptionOfView: 'Acc',
                    nameOfResource: 'accounts',
                });
                accountViewUUID = await resourceListUtils.getUUIDfromURL();
                let viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'name', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'InternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
                    matchingEditorName: '',
                    viewKey: accountViewUUID,
                    fieldsToConfigureInView: viewFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                // Configure View - Survey
                await resourceListUtils.addView({
                    nameOfView: 'Surveys',
                    descriptionOfView: 'Sur',
                    nameOfResource: 'surveys',
                });
                // Configure View
                surveyViewUUID = await resourceListUtils.getUUIDfromURL();
                viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'StatusName', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Template', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
                    matchingEditorName: '',
                    viewKey: surveyViewUUID,
                    fieldsToConfigureInView: viewFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
            });
            it('3. Create Page With Survey Block Inside It', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const e2eUtils = new E2EUtils(driver);
                surveyBlockPageName = 'surveyBlockPage';
                const pageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
                const pageBuilder = new PageBuilder(driver);
                const createdPage = await pageBuilder.getPageByUUID(pageUUID, client);
                const surveyBlockInstance = new SurveyBlock();
                createdPage.Blocks.push(surveyBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new SurveyBlockColumn(surveyBlockInstance.Key);
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('4. Create Slug And Map It To Show The Page With Survey Block + Configure On Home Screen', async function () {
                const slugDisplayName = 'survey_slug';
                const slug_path = 'survey_slug';
                const resourceListUtils = new E2EUtils(driver);
                await resourceListUtils.navigateTo('Slugs');
                const slugs: Slugs = new Slugs(driver);
                await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
                await resourceListUtils.mappingSlugWithPageEvgeny('survey_slug', surveyBlockPageName);
                debugger;
                //do i need these
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.isSpinnerDone();
                await resourceListUtils.logOutLogIn(email, password);
                await webAppHomePage.isSpinnerDone();
                await webAppHomePage.clickOnBtn(slugDisplayName);
                debugger;
            });
            it('5. Create Script Based On Config File With New Resource Views Configured', async function () {
                try {
                    const script = fs.readFileSync(path.join(__dirname, 'surveyScriptFile.txt'), 'utf-8');
                    const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
                    const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
                    const script3 = script2.replace('{surveySlugNamePlaceHolder}', 'survey_slug');
                    console.log(script3);
                    debugger;
                } catch (error) {
                    debugger;
                }
                debugger;
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
