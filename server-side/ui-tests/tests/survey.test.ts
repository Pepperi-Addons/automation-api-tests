import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import {
    SlideShowBlock,
    SlideShowBlockColumn,
    SurveyBlock,
    SurveyBlockColumn,
    SurveyQuestion,
    SurveySection,
    SurveyTemplateBuilder,
} from '../pom/addons/SurveyTemplateBuilder';
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
import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';
import { SlideShowPage } from '../pom/addons/SlideShowPage';
import { SurveyPicker } from '../pom/addons/SurveyPicker';
import { SurveyFiller } from '../pom/addons/SurveyFiller';
import { UDCService } from '../../services/user-defined-collections.service';
import { ObjectsService } from '../../services/objects.service';

chai.use(promised);

export async function SurveyTests(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    let surveyBlockPageName;
    let surveyBlockPageUUID;
    let slideshowBlockPageUUID;
    let surveyViewUUID;
    let accountViewUUID;
    let scriptUUID;
    let slideshowSlugDisplayName;
    let surveySlugDisplayName;
    let surveyUUID;
    let surveyTemplateName;
    let surveyTemplateDesc;

    const surveyTemplateToCreate: SurveySection[] = [
        {
            Title: 'my survey',
            Key: '',
            Questions: [
                {
                    Key: '',
                    Title: 'first question',
                    Type: 'Multiple Select',
                    OptionalValues: [
                        { Value: 'A', Key: 'A' },
                        { Value: 'B', Key: 'B' },
                        { Value: 'C', Key: 'C' },
                    ],
                    isMandatory: true,
                },
                {
                    Key: '',
                    Title: 'second question',
                    Type: 'Radio Group',
                    OptionalValues: [
                        { Value: 'A', Key: 'A' },
                        { Value: 'B', Key: 'B' },
                    ],
                    isMandatory: false,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: [{ QuestionName: 'first question', ValueToLookFor: ['A', 'C'] }],
                    },
                },
                {
                    Key: '',
                    Title: 'third question',
                    Type: 'Short Text',
                    isMandatory: true,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: [
                            { QuestionName: 'second question', ValueToLookFor: ['B'] },
                            { QuestionName: 'first question', ValueToLookFor: ['A', 'C'] },
                        ],
                    },
                },
                {
                    Key: '',
                    Title: 'fourth question',
                    Type: 'Checkbox',
                    isMandatory: false,
                    OptionalValues: [
                        { Value: '1', Key: '1' },
                        { Value: '2', Key: '2' },
                    ],
                },
                {
                    Key: '',
                    Title: 'fifth question',
                    Type: 'Yes/No',
                    isMandatory: false,
                    OptionalValues: [{ Value: '1' }, { Value: '2' }],
                    ShowIf: {
                        Operator: 'Or',
                        FilterData: [{ QuestionName: 'fourth question', ValueToLookFor: ['1', '2'] }],
                    },
                },
                {
                    Key: '',
                    Title: 'sixth question',
                    Type: 'Decimal',
                    isMandatory: true,
                },
                {
                    Key: '',
                    Title: 'seventh question',
                    Type: 'Date',
                    isMandatory: false,
                },
            ],
        },
    ];

    await generalService.baseAddonVersionsInstallation(varPass);
    // #region Upgrade survey dependencies

    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI on version 9.6.x to
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', '0.5.43'], //has to remain untouched
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.5.11'], //has to remain untouched
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Abstract Activity': ['92b9bd68-1660-4998-91bc-3b745b4bab11', ''],
        survey: ['dd0a85ea-7ef0-4bc1-b14f-959e0372877a', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Survey Builder': ['cf17b569-1af4-45a9-aac5-99f23cae45d8', ''],
        Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Survey Builder Tests Suit', async function () {
        describe('Prerequisites Addons for Survey Builder Tests', () => {
            //Test Data
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                    expect(isInstalled).to.be.true;
                });
            });
            for (const addonName in testData) {
                const addonUUID = testData[addonName][0];
                const version = testData[addonName][1];
                const varLatestVersion = chnageVersionResponseArr[addonName][2];
                const changeType = chnageVersionResponseArr[addonName][3];
                describe(`Test Data: ${addonName}`, () => {
                    it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                        if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

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
            it(`1. Create A UDC Which Extends 'surveys' Scheme Before Creating A Survey`, async function () {
                const udcService = new UDCService(generalService);
                const newSurveyUDCName = 'NewSurveyCollection' + generalService.generateRandomString(4);
                const response = await udcService.createUDCWithFields(
                    newSurveyUDCName,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    { AddonUUID: 'dd0a85ea-7ef0-4bc1-b14f-959e0372877a', Name: 'surveys' },
                );
                expect(response).to.haveOwnProperty('Account');
                expect(response).to.haveOwnProperty('ActionDateTime');
                expect(response).to.haveOwnProperty('Agent');
                expect(response).to.haveOwnProperty('Creator');
                expect(response).to.haveOwnProperty('ExternalID');
                expect(response).to.haveOwnProperty('StatusName');
                expect(response).to.haveOwnProperty('Template');
            });
            it('2. Create A Survey Template - Validate Via API All Data Is Sent Correctly', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const surveyService = new SurveyTemplateBuilder(driver);
                const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
                expect(isSurveyBuilderSettingsShown).to.equal(true);
                const isSurveyBuilderPageShown = await surveyService.enterSurveyBuilderActualBuilder();
                expect(isSurveyBuilderPageShown).to.equal(true);
                surveyTemplateName = 'surveyTemplate';
                surveyTemplateDesc = 'template';
                surveyUUID = await surveyService.configureTheSurveyTemplate(
                    surveyTemplateName,
                    surveyTemplateDesc,
                    surveyTemplateToCreate,
                );
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                const webAppHomePage = new WebAppHomePage(driver);
                //- sync
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                //- find the survey template using API
                const surveyTemplateResponse = await generalService.fetchStatus(
                    `/resources/MySurveyTemplates?order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                    },
                );
                const latestSurveyTemp = surveyTemplateResponse.Body[0];
                expect(latestSurveyTemp.Active).to.equal(true);
                expect(latestSurveyTemp.Hidden).to.equal(false);
                expect(latestSurveyTemp).to.haveOwnProperty('Key');
                // expect(latestSurveyTemp.CreationDateTime).to.include(false);
                expect(latestSurveyTemp.Description).to.equal(surveyTemplateDesc);
                expect(latestSurveyTemp.Name).to.equal(surveyTemplateName);
                const surveyTempSections = surveyTemplateResponse.Body[0].Sections;
                for (let index = 0; index < surveyTempSections.length; index++) {
                    const sectionFromApi = surveyTempSections[index];
                    const sectionFromCode = surveyTemplateToCreate[index];
                    expect(sectionFromApi).to.haveOwnProperty('Key');
                    expect(sectionFromApi.Title).to.equal(sectionFromCode.Title);
                    const sectionQuestionsFromApi = sectionFromApi.Questions;
                    const sectionQuestionsFromCode = sectionFromCode.Questions;
                    for (let index1 = 0; index1 < sectionQuestionsFromApi.length; index1++) {
                        const questionFromApi = sectionQuestionsFromApi[index1];
                        const questionFromCode = sectionQuestionsFromCode[index1];
                        expect(questionFromApi).to.haveOwnProperty('Key');
                        expect(questionFromApi).to.haveOwnProperty('Name');
                        expect(questionFromApi.Title).to.equal(questionFromCode.Title + '\n\n');
                        const convertedApiType = convertApiType(questionFromApi.Type);
                        expect(convertedApiType).to.equal(questionFromCode.Type);
                        if (questionFromApi.hasOwnProperty('OptionalValues')) {
                            const optionalValApi = questionFromApi.OptionalValues;
                            const optionalValCode = questionFromCode.OptionalValues as any;
                            for (let index2 = 0; index2 < optionalValApi.length; index2++) {
                                const optValApi = optionalValApi[index2];
                                const optValCode = optionalValCode[index2];
                                expect(optValApi.value).to.equal(optValCode.Value + '\n');
                                expect(optValApi.key).to.equal(optValCode.Key);
                            }
                        }
                        if (questionFromApi.hasOwnProperty('ShowIf')) {
                            const showIfApi = questionFromApi.ShowIf;
                            const showIfCode = questionFromCode.ShowIf as any;
                            if (showIfApi.hasOwnProperty('Operation') && showIfApi.Operation !== 'IsEqual') {
                                expect(showIfApi.Operation).to.equal(showIfCode.Operator.toUpperCase());
                            }
                            if (showIfApi.hasOwnProperty('Values')) {
                                expect(showIfApi.Values).to.deep.equal(showIfCode.FilterData[0].ValueToLookFor);
                            } else {
                                const firstNodeAPI = showIfApi.LeftNode.Values;
                                expect(firstNodeAPI).to.deep.equal(showIfCode.FilterData[0].ValueToLookFor);
                                const secNodeAPI = showIfApi.RightNode.Values;
                                expect(secNodeAPI).to.deep.equal(showIfCode.FilterData[1].ValueToLookFor);
                            }
                        }
                    }
                }
                await webAppLoginPage.logout();
            });
            it('3. Login Again - Edit The Survey And See API Respose Is Changed', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const surveyService = new SurveyTemplateBuilder(driver);
                const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
                expect(isSurveyBuilderSettingsShown).to.equal(true);
                await surveyService.enterSurveyTemplateEditMode(surveyTemplateName);
                const newName = surveyTemplateName + generalService.generateRandomString(4);
                await surveyService.editSurveyTemplateName(newName);
                const webAppHomePage = new WebAppHomePage(driver);
                webAppHomePage.returnToHomePage();
                driver.sleep(3000);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                //- find the survey template using API
                const surveyTemplateResponse = await generalService.fetchStatus(
                    `/resources/MySurveyTemplates?where=Key='${surveyUUID}'`,
                    {
                        method: 'GET',
                    },
                );
                expect(surveyTemplateResponse.Body[0].Name).to.equal(newName);
                surveyTemplateName = newName;
            });
            it('4. Configure Resource Views For Account + Survey', async function () {
                const resourceListUtils = new E2EUtils(driver);
                const resourceViews = new ResourceViews(driver);
                const generalService = new GeneralService(client);
                const dataViewsService = new DataViewsService(generalService.papiClient);
                // Configure View - Accounts
                await resourceListUtils.addView({
                    nameOfView: 'Accounts',
                    descriptionOfView: 'Acc',
                    nameOfResource: 'accounts',
                });
                accountViewUUID = await resourceListUtils.getUUIDfromURL();
                let viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
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
                    nameOfResource: 'MySurveyTemplates',
                });
                // Configure View
                surveyViewUUID = await resourceListUtils.getUUIDfromURL();
                viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                    { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Description', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    { fieldName: 'Sections', dataViewType: 'TextBox', mandatory: false, readonly: false },
                ]);
                await resourceViews.customViewConfig(dataViewsService, {
                    matchingEditorName: '',
                    viewKey: surveyViewUUID,
                    fieldsToConfigureInView: viewFields,
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('5. Create Page With Survey Block Inside It', async function () {
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
            it('6. Create Slug And Map It To Show The Page With Survey Block', async function () {
                surveySlugDisplayName = `survey_slug_${generalService.generateRandomString(4)}`;
                const slugPath = surveySlugDisplayName;
                await CreateSlug(
                    email,
                    password,
                    driver,
                    generalService,
                    surveySlugDisplayName,
                    slugPath,
                    surveyBlockPageUUID,
                );
            });
            it('7. Create Script Based On Config File With New Resource Views Configured', async function () {
                let script;
                try {
                    script = fs.readFileSync(path.join(__dirname, 'surveyScriptFile.txt'), 'utf-8');
                } catch (error) {
                    throw `couldnt read script from file, got exception: ${(error as any).message}`;
                }
                const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
                const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
                const script3 = script2.replace('{surveySlugNamePlaceHolder}', surveySlugDisplayName);
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                const scriptEditor = new ScriptEditor(driver);
                scriptUUID = await scriptEditor.configureScript(script3, generalService);
                await webAppHeader.goHome();
            });
            it('8. Create Page With SlideShow Which Will Run The Script', async function () {
                const e2eUtils = new E2EUtils(driver);
                surveyBlockPageName = 'surveySlideShow';
                slideshowBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
                const pageBuilder = new PageBuilder(driver);
                const createdPage = await pageBuilder.getPageByUUID(slideshowBlockPageUUID, client);
                const SlideShowBlockInstance = new SlideShowBlock(scriptUUID);
                createdPage.Blocks.push(SlideShowBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new SlideShowBlockColumn(SlideShowBlockInstance.Key);
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('9. Create A Slug For The Slideshow Page And Set It To Show On Homepage', async function () {
                slideshowSlugDisplayName = `slideshow_slug_${generalService.generateRandomString(4)}`;
                const slugPath = slideshowSlugDisplayName;
                await CreateSlug(
                    email,
                    password,
                    driver,
                    generalService,
                    slideshowSlugDisplayName,
                    slugPath,
                    slideshowBlockPageUUID,
                );
                driver.sleep(5000);
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                const brandedApp = new BrandedApp(driver);
                await brandedApp.addAdminHomePageButtons(slideshowSlugDisplayName);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.validateATDIsApearingOnHomeScreen(slideshowSlugDisplayName);
            });
        });
        describe('Test Configured Survey', () => {
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
            it('1. Fill First Survey And Validate All Is Working', async function () {
                // const slideshowSlugDisplayName = 'slideshow_slug_knub';
                // const surveyUUID = 'e3970843-80a2-4c19-9053-5ea9c16ac053';
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.reSyncApp();
                await webAppHomePage.initiateSalesActivity(slideshowSlugDisplayName);
                const slideShowPage = new SlideShowPage(driver);
                await slideShowPage.enterSurveyPicker();
                const surveyPicker = new SurveyPicker(driver);
                const isAccountSelectionOpen = await surveyPicker.selectSurvey(surveyUUID);
                expect(isAccountSelectionOpen).to.equal(true);
                const objectsService = new ObjectsService(generalService);
                const accounts = await objectsService.getAccounts();
                expect(accounts.length).to.be.above(0);
                const accName = accounts[0].Name;
                const accUUID = accounts[0].UUID;
                const isTemplateOpen = await surveyPicker.selectAccount(accName);
                expect(isTemplateOpen).to.equal(true);
                const allQuestionNames = [
                    'first question',
                    'second question',
                    'third question',
                    'fourth question',
                    'fifth question',
                    'sixth question',
                    'seventh question',
                ];
                const allQuestionTypes: SurveyQuestion['Type'][] = [
                    'Multiple Select',
                    'Radio Group',
                    'Short Text',
                    'Checkbox',
                    'Yes/No',
                    'Decimal',
                    'Date',
                ];
                const allQuestionPositiveAns = [['A', 'C'], 'B', 'short Text12', ['1', '2'], 'Yes', '.123', '1/1/2022'];
                const surveyFiller = new SurveyFiller(driver);
                for (let index = 0; index < allQuestionNames.length; index++) {
                    const currentQuestionName = allQuestionNames[index];
                    const currentQuestionType = allQuestionTypes[index];
                    const currentQuestionAns = allQuestionPositiveAns[index];
                    if (Array.isArray(currentQuestionAns)) {
                        await surveyFiller.answerQuestion(currentQuestionType, currentQuestionName, currentQuestionAns);
                    } else {
                        await surveyFiller.answerQuestion(currentQuestionType, currentQuestionName, [
                            currentQuestionAns,
                        ]);
                    }
                }
                await surveyFiller.saveSurvey();
                driver.sleep(8000);
                await webAppHomePage.returnToHomePage();
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                const surveyResponse = await generalService.fetchStatus(
                    `/resources/MySurveys?order_by=CreationDateTime DESC`,
                    {
                        method: 'GET',
                    },
                );
                const latestSurvey = surveyResponse.Body[0];
                expect(latestSurvey).to.not.be.undefined;
                expect(latestSurvey.Template).to.equal(surveyUUID);
                expect(latestSurvey.StatusName).to.equal('Submitted');
                expect(latestSurvey.ResourceName).to.equal('MySurveys');
                expect(latestSurvey.Account).to.equal(accUUID);
                const surveyAnswers = latestSurvey.Answers;
                for (let index = 0; index < surveyAnswers.length; index++) {
                    const ans = surveyAnswers[index];
                    if (Array.isArray(allQuestionPositiveAns[index])) {
                        const joinedArray = (allQuestionPositiveAns[index] as string[]).join(';');
                        expect(ans.Answer).to.equal(joinedArray);
                    } else {
                        if (allQuestionPositiveAns[index] === 'Yes' || allQuestionPositiveAns[index] === 'No') {
                            const convertedAns = allQuestionPositiveAns[index] === 'Yes' ? 'true' : 'false';
                            expect(ans.Answer).to.equal(convertedAns);
                        } else {
                            if (allQuestionPositiveAns[index] === '.123') {
                                const numb = '0' + allQuestionPositiveAns[index];
                                expect(ans.Answer).to.equal(numb);
                            } else if (allQuestionPositiveAns[index] === '1/1/2022') {
                                const dateSplit = (allQuestionPositiveAns[index] as string).split('/');
                                const date =
                                    dateSplit[dateSplit.length - 1] +
                                    '-' +
                                    dateSplit[dateSplit.length - 2] +
                                    '-' +
                                    dateSplit[dateSplit.length - 3];
                                expect(ans.Answer).to.equal(date);
                            } else {
                                expect(ans.Answer).to.equal(allQuestionPositiveAns[index]);
                            }
                        }
                    }
                }
            });
            it('Data Cleansing', async function () {
                //1. delete survey template
                let body = { Key: surveyUUID, Hidden: true };
                const deleteSurveyTemplateResponse = await generalService.fetchStatus(`/resources/MySurveyTemplates`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                });
                expect(deleteSurveyTemplateResponse.Ok).to.equal(true);
                expect(deleteSurveyTemplateResponse.Status).to.equal(200);
                expect(deleteSurveyTemplateResponse.Body.Key).to.equal(surveyUUID);
                expect(deleteSurveyTemplateResponse.Body.Hidden).to.equal(true);
                //2. delete resource views
                body = { Key: accountViewUUID, Hidden: true };
                const deleteAccountRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                    },
                );
                expect(deleteAccountRLResponse.Ok).to.equal(true);
                expect(deleteAccountRLResponse.Status).to.equal(200);
                expect(deleteAccountRLResponse.Body.Name).to.equal('Accounts');
                expect(deleteAccountRLResponse.Body.Hidden).to.equal(true);
                body = { Key: surveyViewUUID, Hidden: true };
                const deleteSurveyRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                    },
                );
                expect(deleteSurveyRLResponse.Ok).to.equal(true);
                expect(deleteSurveyRLResponse.Status).to.equal(200);
                expect(deleteSurveyRLResponse.Body.Name).to.equal('Surveys');
                expect(deleteSurveyRLResponse.Body.Hidden).to.equal(true);
                //3. delete relevant pages
                const deleteSurveyPageResponse = await generalService.fetchStatus(
                    `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${surveyBlockPageUUID}`,
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                    },
                );
                expect(deleteSurveyPageResponse.Ok).to.equal(true);
                expect(deleteSurveyPageResponse.Status).to.equal(200);
                expect(deleteSurveyPageResponse.Body).to.equal(true);
                const deleteSlideShowPageResponse = await generalService.fetchStatus(
                    `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${slideshowBlockPageUUID}`,
                    {
                        method: 'POST',
                        body: JSON.stringify(body),
                    },
                );
                expect(deleteSlideShowPageResponse.Ok).to.equal(true);
                expect(deleteSlideShowPageResponse.Status).to.equal(200);
                expect(deleteSlideShowPageResponse.Body).to.equal(true);
                //delete the script
                const bodyForSctips = { Keys: [`${scriptUUID}`] };
                const deleteScriptResponse = await generalService.fetchStatus(
                    `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(bodyForSctips),
                    },
                );
                expect(deleteScriptResponse.Ok).to.equal(true);
                expect(deleteScriptResponse.Status).to.equal(200);
                expect(deleteScriptResponse.Body[0].Key).to.equal(scriptUUID);
                //delete UDC
                const udcService = new UDCService(generalService);
                const documents = await udcService.getSchemes();
                const toHideCollections = documents.filter((doc) => doc.Name.includes('NewSurveyCollection'));
                for (let index = 0; index < toHideCollections.length; index++) {
                    const collectionToHide = toHideCollections[index];
                    const collectionsObjcts = await udcService.getAllObjectFromCollection(collectionToHide.Name);
                    if (collectionsObjcts.objects && collectionsObjcts.objects.length > 0) {
                        for (let index = 0; index < collectionsObjcts.objects.length; index++) {
                            const obj = collectionsObjcts.objects[index];
                            const hideResponse = await udcService.hideObjectInACollection(
                                collectionToHide.Name,
                                obj.Key,
                            );
                            expect(hideResponse.Body.Key).to.equal(obj.Key);
                            expect(hideResponse.Body.Hidden).to.equal(true);
                        }
                    }
                    const hideResponse = await udcService.hideCollection(collectionToHide.Name);
                    expect(hideResponse.Ok).to.equal(true);
                    expect(hideResponse.Status).to.equal(200);
                    expect(hideResponse.Body.Name).to.equal(collectionToHide.Name);
                    expect(hideResponse.Body.Hidden).to.equal(true);
                }
                //4. delete slugs
                const slugs: Slugs = new Slugs(driver);
                const slideShowSlugsResponse = await slugs.deleteSlugByName(slideshowSlugDisplayName, client);
                expect(slideShowSlugsResponse.Ok).to.equal(true);
                expect(slideShowSlugsResponse.Status).to.equal(200);
                expect(slideShowSlugsResponse.Body.success).to.equal(true);
                const surveySlugResponse = await slugs.deleteSlugByName(surveySlugDisplayName, client);
                expect(surveySlugResponse.Ok).to.equal(true);
                expect(surveySlugResponse.Status).to.equal(200);
                expect(surveySlugResponse.Body.success).to.equal(true);
                //5. delete ATD from homescreen
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                const brandedApp = new BrandedApp(driver);
                await brandedApp.removeAdminHomePageButtons(slideshowSlugDisplayName);
            });
        });
    });
}

async function CreateSlug(
    email: string,
    password: string,
    driver: Browser,
    generalService: GeneralService,
    slugDisplayName: string,
    slug_path: string,
    pageToMapToKey: string,
) {
    // const slugDisplayName = 'slideshow_slug';
    // const slug_path = 'slideshow_slug';
    const e2eUiService = new E2EUtils(driver);
    await e2eUiService.navigateTo('Slugs');
    const slugs: Slugs = new Slugs(driver);
    driver.sleep(2000);
    if (await driver.isElementVisible(slugs.SlugMappingScreenTitle)) {
        await slugs.clickTab('Slugs_Tab');
    }
    driver.sleep(2000);
    await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
    driver.sleep(1000);
    await slugs.clickTab('Mapping_Tab');
    driver.sleep(1000);
    await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
    await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
    await slugs.isSpinnerDone();
    driver.sleep(2500);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
    const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
        [{ slug_path: slug_path, pageUUID: pageToMapToKey }],
        existingMappedSlugs,
    );
    console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
    const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
    console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`);
    const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
    console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
    driver.sleep(2 * 1000);
    await e2eUiService.logOutLogIn(email, password);
    const webAppHomePage = new WebAppHomePage(driver);
    await webAppHomePage.isSpinnerDone();
    await e2eUiService.navigateTo('Slugs');
    await slugs.clickTab('Mapping_Tab');
    driver.sleep(15 * 1000);
    const webAppHeader = new WebAppHeader(driver);
    await webAppHeader.goHome();
}

function convertApiType(type: string) {
    switch (type) {
        case 'single-selection-radiobuttons':
            return 'Radio Group';
        case 'multiple-selection-dropdown':
            return 'Multiple Select';
        case 'short-text':
            return 'Short Text';
        case 'multiple-selection-checkboxes':
            return 'Checkbox';
        case 'boolean-toggle':
            return 'Yes/No';
        case 'decimal':
            return 'Decimal';
        case 'date':
            return 'Date';
    }
}

//this is sort of a "public api" to clean surveys without running a test - to integrate survey cleaning inside any test
//starts from all things needed for survey on home-page and ending in everything deleted
//*dosent delete the UDC as in the test as you dont need a UDC to use a survey
export async function cleanSurvey(
    generalService,
    driver,
    client,
    surveyUUID,
    accountViewUUID,
    surveyViewUUID,
    surveyBlockPageUUID,
    slideshowBlockPageUUID,
    scriptUUID,
    slideshowSlugDisplayName,
    surveySlugDisplayName,
) {
    //1. delete survey template
    let body = { Key: surveyUUID, Hidden: true };
    const deleteSurveyTemplateResponse = await generalService.fetchStatus(`/resources/MySurveyTemplates`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    expect(deleteSurveyTemplateResponse.Ok).to.equal(true);
    expect(deleteSurveyTemplateResponse.Status).to.equal(200);
    expect(deleteSurveyTemplateResponse.Body.Key).to.equal(surveyUUID);
    expect(deleteSurveyTemplateResponse.Body.Hidden).to.equal(true);
    //2. delete resource views
    body = { Key: accountViewUUID, Hidden: true };
    const deleteAccountRLResponse = await generalService.fetchStatus(
        `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
    );
    expect(deleteAccountRLResponse.Ok).to.equal(true);
    expect(deleteAccountRLResponse.Status).to.equal(200);
    expect(deleteAccountRLResponse.Body.Name).to.equal('Accounts');
    expect(deleteAccountRLResponse.Body.Hidden).to.equal(true);
    body = { Key: surveyViewUUID, Hidden: true };
    const deleteSurveyRLResponse = await generalService.fetchStatus(
        `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
    );
    expect(deleteSurveyRLResponse.Ok).to.equal(true);
    expect(deleteSurveyRLResponse.Status).to.equal(200);
    expect(deleteSurveyRLResponse.Body.Name).to.equal('Surveys');
    expect(deleteSurveyRLResponse.Body.Hidden).to.equal(true);
    //3. delete relevant pages
    const deleteSurveyPageResponse = await generalService.fetchStatus(
        `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${surveyBlockPageUUID}`,
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
    );
    expect(deleteSurveyPageResponse.Ok).to.equal(true);
    expect(deleteSurveyPageResponse.Status).to.equal(200);
    expect(deleteSurveyPageResponse.Body).to.equal(true);
    const deleteSlideShowPageResponse = await generalService.fetchStatus(
        `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${slideshowBlockPageUUID}`,
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
    );
    expect(deleteSlideShowPageResponse.Ok).to.equal(true);
    expect(deleteSlideShowPageResponse.Status).to.equal(200);
    expect(deleteSlideShowPageResponse.Body).to.equal(true);
    //delete the script
    const bodyForSctips = { Keys: [`${scriptUUID}`] };
    const deleteScriptResponse = await generalService.fetchStatus(
        `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
        {
            method: 'POST',
            body: JSON.stringify(bodyForSctips),
        },
    );
    expect(deleteScriptResponse.Ok).to.equal(true);
    expect(deleteScriptResponse.Status).to.equal(200);
    expect(deleteScriptResponse.Body[0].Key).to.equal(scriptUUID);
    //4. delete slugs
    const slugs: Slugs = new Slugs(driver);
    const slideShowSlugsResponse = await slugs.deleteSlugByName(slideshowSlugDisplayName, client);
    expect(slideShowSlugsResponse.Ok).to.equal(true);
    expect(slideShowSlugsResponse.Status).to.equal(200);
    expect(slideShowSlugsResponse.Body.success).to.equal(true);
    const surveySlugResponse = await slugs.deleteSlugByName(surveySlugDisplayName, client);
    expect(surveySlugResponse.Ok).to.equal(true);
    expect(surveySlugResponse.Status).to.equal(200);
    expect(surveySlugResponse.Body.success).to.equal(true);
    //5. delete ATD from homescreen
    const webAppHeader = new WebAppHeader(driver);
    await webAppHeader.openSettings();
    driver.sleep(6000);
    const brandedApp = new BrandedApp(driver);
    await brandedApp.removeAdminHomePageButtons(slideshowSlugDisplayName);
}

//this is sort of a "public api" to create surveys without running a test - to integrate survey creation inside any test
//starts from "nothing" and ends with survey configured inside an ATD on home screen
export async function createSurvey(
    client,
    driver,
    generalService,
    surveyTemplateName,
    surveyTemplateDesc,
    email,
    password,
    surveyTemplateToCreate,
) {
    //1. survey creation
    const webAppLoginPage = new WebAppLoginPage(driver);
    await webAppLoginPage.login(email, password);
    const surveyService = new SurveyTemplateBuilder(driver);
    await surveyService.enterSurveyBuilderSettingsPage();
    await surveyService.enterSurveyBuilderActualBuilder();
    await surveyService.configureTheSurveyTemplate(surveyTemplateName, surveyTemplateDesc, surveyTemplateToCreate);
    const webAppHeader = new WebAppHeader(driver);
    await webAppHeader.goHome();
    //2. RL creation
    const resourceListUtils = new E2EUtils(driver);
    const resourceViews = new ResourceViews(driver);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    // Configure View - Accounts
    await resourceListUtils.addView({
        nameOfView: 'Accounts',
        descriptionOfView: 'Acc',
        nameOfResource: 'accounts',
    });
    const accountViewUUID = await resourceListUtils.getUUIDfromURL();
    let viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
        { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
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
        nameOfResource: 'MySurveyTemplates',
    });
    // Configure View
    const surveyViewUUID = await resourceListUtils.getUUIDfromURL();
    viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
        { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
        { fieldName: 'Description', dataViewType: 'TextBox', mandatory: false, readonly: false },
        { fieldName: 'Sections', dataViewType: 'TextBox', mandatory: false, readonly: false },
    ]);
    await resourceViews.customViewConfig(dataViewsService, {
        matchingEditorName: '',
        viewKey: surveyViewUUID,
        fieldsToConfigureInView: viewFields,
    });
    await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
    await webAppHeader.goHome();
    //3. survey page creation
    const e2eUtils = new E2EUtils(driver);
    let surveyBlockPageName = 'surveyBlockPage';
    const surveyBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
    const pageBuilder = new PageBuilder(driver);
    const createdPage = await pageBuilder.getPageByUUID(surveyBlockPageUUID, client);
    const surveyBlockInstance = new SurveyBlock();
    createdPage.Blocks.push(surveyBlockInstance);
    createdPage.Layout.Sections[0].Columns[0] = new SurveyBlockColumn(surveyBlockInstance.Key);
    console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
    const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
    console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
    await webAppHeader.goHome();
    //4. survey slug creation
    const surveySlugDisplayName = `survey_slug_${generalService.generateRandomString(4)}`;
    const slugPath = surveySlugDisplayName;
    await CreateSlug(email, password, driver, generalService, surveySlugDisplayName, slugPath, surveyBlockPageUUID);
    //5. survey script creation
    let script;
    try {
        script = fs.readFileSync(path.join(__dirname, 'surveyScriptFile.txt'), 'utf-8');
    } catch (error) {
        throw `couldnt read script from file, got exception: ${(error as any).message}`;
    }
    const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
    const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
    const script3 = script2.replace('{surveySlugNamePlaceHolder}', surveySlugDisplayName);
    await webAppHeader.goHome();
    const scriptEditor = new ScriptEditor(driver);
    const scriptUUID = await scriptEditor.configureScript(script3, generalService);
    await webAppHeader.goHome();
    //6. slide show page creation with survey inside
    surveyBlockPageName = 'surveySlideShow';
    const slideshowBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
    const createdPage2 = await pageBuilder.getPageByUUID(slideshowBlockPageUUID, client);
    const SlideShowBlockInstance = new SlideShowBlock(scriptUUID);
    createdPage.Blocks.push(SlideShowBlockInstance);
    createdPage.Layout.Sections[0].Columns[0] = new SlideShowBlockColumn(SlideShowBlockInstance.Key);
    console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
    const responseOfPublishPage2 = await pageBuilder.publishPage(createdPage2, client);
    console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage2, null, 2));
    await webAppHeader.goHome();
    //7. slide show slug creation
    const slideshowSlugDisplayName = `slideshow_slug_${generalService.generateRandomString(4)}`;
    const slugPath2 = slideshowSlugDisplayName;
    await CreateSlug(
        email,
        password,
        driver,
        generalService,
        slideshowSlugDisplayName,
        slugPath2,
        slideshowBlockPageUUID,
    );
    //8. ATD creation on homepage
    driver.sleep(5000);
    await webAppHeader.openSettings();
    driver.sleep(6000);
    const brandedApp = new BrandedApp(driver);
    await brandedApp.addAdminHomePageButtons(slideshowSlugDisplayName);
    const webAppHomePage = new WebAppHomePage(driver);
    for (let index = 0; index < 2; index++) {
        await webAppHomePage.manualResync(client);
    }
    await webAppHomePage.validateATDIsApearingOnHomeScreen(slideshowSlugDisplayName);
}
