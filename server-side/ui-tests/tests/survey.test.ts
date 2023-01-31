import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage, WebAppSettingsSidePanel } from '../pom';
import { SurveyBlock, SurveyBlockColumn, SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';
import E2EUtils from '../utilities/e2e_utils';
import { GridDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { ResourceViews } from '../pom/addons/ResourceList';
import { DataViewsService } from '../../services/data-views.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptEditor } from '../pom/addons/ScriptPicker';
import { Key } from 'selenium-webdriver';
import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';

chai.use(promised);

export async function SurveyTests(email: string, password: string, client: Client) {
    //varPass: string, client: Client
    const generalService = new GeneralService(client);
    let driver: Browser;
    let surveyBlockPageName;
    let surveyBlockPageUUID;
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
                    nameOfView: 'Accounts',
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
                await webAppLoginPage.login(email, password); //?
                const e2eUtils = new E2EUtils(driver);
                surveyBlockPageName = 'surveyBlockPage';
                surveyBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
                const pageBuilder = new PageBuilder(driver);
                const createdPage = await pageBuilder.getPageByUUID(surveyBlockPageUUID, client);
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
                const e2eUiService = new E2EUtils(driver);
                await e2eUiService.navigateTo('Slugs');
                const slugs: Slugs = new Slugs(driver);
                await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
                await slugs.clickTab('Mapping_Tab');
                await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
                await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
                await slugs.isSpinnerDone();
                driver.sleep(2500);
                const dataViewsService = new DataViewsService(generalService.papiClient);
                const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
                const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
                    [{ slug_path: slug_path, pageUUID: surveyBlockPageUUID }],
                    existingMappedSlugs,
                );
                console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
                const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
                console.info(
                    `slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`,
                );
                const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
                console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
                driver.sleep(2 * 1000);
                await e2eUiService.logOutLogIn(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.isSpinnerDone();
                await e2eUiService.navigateTo('Slugs');
                await slugs.clickTab('Mapping_Tab');
                driver.sleep(15 * 1000);
                debugger;
            });
            it('5. Create Script Based On Config File With New Resource Views Configured', async function () {
                let script;
                try {
                    script = fs.readFileSync(path.join(__dirname, 'surveyScriptFile.txt'), 'utf-8');
                } catch (error) {
                    throw `couldnt read script from file, got exception: ${(error as any).message}`;
                }
                const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
                const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
                const script3 = script2.replace('{surveySlugNamePlaceHolder}', 'survey_slug');
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                //TODO has to move to script
                await webAppHeader.openSettings();
                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Configuration');
                await driver.click(webAppSettingsSidePanel.ScriptsEditor);
                const scriptEditor = new ScriptEditor(driver);
                await driver.click(scriptEditor.addScriptButton);
                const isModalFound = await driver.isElementVisible(scriptEditor.addScriptModal);
                const isMainTitleFound = await driver.isElementVisible(scriptEditor.addScriptMainTitle);
                expect(isModalFound).to.equal(true);
                expect(isMainTitleFound).to.equal(true);
                //1. give name
                await driver.sendKeys(scriptEditor.NameInput, 'SurveyScript');
                //2. give desc
                await driver.sendKeys(scriptEditor.DescInput, 'script for survey');
                //3. push code of script instead of the code found in the UI
                const selectAll = Key.chord(Key.CONTROL, 'a');
                await driver.sendKeys(scriptEditor.CodeTextArea, selectAll);
                await driver.sendKeys(scriptEditor.CodeTextArea, Key.DELETE);
                await driver.sendKeys(scriptEditor.CodeTextArea, script3);
                driver.sleep(2000);
                //4. save
                await driver.click(scriptEditor.SaveBtn);
                driver.sleep(2000);
                await driver.click(scriptEditor.ModalCloseBtn);
                //5. validate script is found in list
                const webAppList = new WebAppList(driver);
                const allListElemsText = await webAppList.getAllListElementsTextValue();
                expect(allListElemsText.length).to.be.at.least(1);
                const foundScript = allListElemsText.find((elem) => elem.includes('SurveyScript'));
                expect(foundScript).to.not.be.undefined.and.to.include('SurveyScript');
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
