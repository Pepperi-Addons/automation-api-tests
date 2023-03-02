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

    const surveyTemplateToCreate: SurveySection[] = [
        {
            Title: 'boolean',
            Key: '',
            Questions: [
                {
                    Key: '',
                    Title: 'first question',
                    Type: 'Multiple Select',
                    OptionalValues: [{ Value: 'A' }, { Value: 'B' }, { Value: 'C' }],
                    isMandatory: true,
                },
                {
                    Key: '',
                    Title: 'second question',
                    Type: 'Radio Group',
                    OptionalValues: [{ Value: 'A' }, { Value: 'B' }],
                    isMandatory: false,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: { QuestionName: 'first question', ValueToLookFor: ['A', 'C'] },
                    },
                },
                {
                    Key: '',
                    Title: 'third question',
                    Type: 'Short Text',
                    isMandatory: true,
                    ShowIf: {
                        Operator: 'And',
                        FilterData: { QuestionName: 'second question', ValueToLookFor: ['B'] },
                    },
                },
                {
                    Key: '',
                    Title: 'fourth question',
                    Type: 'Checkbox',
                    isMandatory: false,
                    OptionalValues: [{ Value: '1' }, { Value: '2' }],
                },
                {
                    Key: '',
                    Title: 'fifth question',
                    Type: 'Yes/No',
                    isMandatory: false,
                    OptionalValues: [{ Value: '1' }, { Value: '2' }],
                    ShowIf: {
                        Operator: 'Or',
                        FilterData: { QuestionName: 'fourth question', ValueToLookFor: ['1', '2'] },
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

    // await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies

    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI on version 9.6.x to
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', '0.5.32'], //has to remain untouched
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.5.8'], //has to remain untouched
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

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade script dependencies

    describe('Survey Builder Tests Suit', async function () {
        // describe('Prerequisites Addons for Survey Builder Tests', () => {
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

        // describe('Configuring Survey', () => {
        //     this.retries(0);

        //     before(async function () {
        //         driver = await Browser.initiateChrome();
        //     });

        //     after(async function () {
        //         await driver.quit();
        //     });

        //     afterEach(async function () {
        //         const webAppHomePage = new WebAppHomePage(driver);
        //         await webAppHomePage.collectEndTestData(this);
        //     });
        //     it('1. Create A Survey Template', async function () {
        //         const webAppLoginPage = new WebAppLoginPage(driver);
        //         await webAppLoginPage.login(email, password);
        //         const surveyService = new SurveyTemplateBuilder(driver);
        //         const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
        //         expect(isSurveyBuilderSettingsShown).to.equal(true);
        //         const isSurveyBuilderPageShown = await surveyService.enterSurveyBuilderActualBuilder();
        //         expect(isSurveyBuilderPageShown).to.equal(true);
        //         surveyUUID = await surveyService.configureTheSurveyTemplate('surveyTemplate', 'template', surveyTemplateToCreate);
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.goHome();
        //     });
        //     it('2. Configure Resource Views For Account + Survey', async function () {
        //         const resourceListUtils = new E2EUtils(driver);
        //         const resourceViews = new ResourceViews(driver);
        //         const generalService = new GeneralService(client);
        //         const dataViewsService = new DataViewsService(generalService.papiClient);
        //         // Configure View - Accounts
        //         await resourceListUtils.addView({
        //             nameOfView: 'Accounts',
        //             descriptionOfView: 'Acc',
        //             nameOfResource: 'accounts',
        //         });
        //         accountViewUUID = await resourceListUtils.getUUIDfromURL();
        //         let viewFields: GridDataViewField[] = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
        //             { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'InternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //         ]);
        //         await resourceViews.customViewConfig(dataViewsService, {
        //             matchingEditorName: '',
        //             viewKey: accountViewUUID,
        //             fieldsToConfigureInView: viewFields,
        //         });
        //         await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
        //         // Configure View - Survey
        //         await resourceListUtils.addView({
        //             nameOfView: 'Surveys',
        //             descriptionOfView: 'Sur',
        //             nameOfResource: 'MySurveyTemplates',
        //         });
        //         // Configure View
        //         surveyViewUUID = await resourceListUtils.getUUIDfromURL();
        //         viewFields = resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
        //             { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'Description', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //             { fieldName: 'Sections', dataViewType: 'TextBox', mandatory: false, readonly: false },
        //         ]);
        //         await resourceViews.customViewConfig(dataViewsService, {
        //             matchingEditorName: '',
        //             viewKey: surveyViewUUID,
        //             fieldsToConfigureInView: viewFields,
        //         });
        //         await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.goHome();
        //     });
        //     it('3. Create Page With Survey Block Inside It', async function () {
        //         const e2eUtils = new E2EUtils(driver);
        //         surveyBlockPageName = 'surveyBlockPage';
        //         surveyBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
        //         const pageBuilder = new PageBuilder(driver);
        //         const createdPage = await pageBuilder.getPageByUUID(surveyBlockPageUUID, client);
        //         const surveyBlockInstance = new SurveyBlock();
        //         createdPage.Blocks.push(surveyBlockInstance);
        //         createdPage.Layout.Sections[0].Columns[0] = new SurveyBlockColumn(surveyBlockInstance.Key);
        //         console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
        //         const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
        //         console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.goHome();
        //     });
        //     it('4. Create Slug And Map It To Show The Page With Survey Block', async function () {
        //         surveySlugDisplayName = `survey_slug_${generalService.generateRandomString(4)}`;
        //         const slugPath = surveySlugDisplayName;
        //         await CreateSlug(
        //             email,
        //             password,
        //             driver,
        //             generalService,
        //             surveySlugDisplayName,
        //             slugPath,
        //             surveyBlockPageUUID,
        //         );
        //     });
        //     it('5. Create Script Based On Config File With New Resource Views Configured', async function () {
        //         let script;
        //         try {
        //             script = fs.readFileSync(path.join(__dirname, 'surveyScriptFile.txt'), 'utf-8');
        //         } catch (error) {
        //             throw `couldnt read script from file, got exception: ${(error as any).message}`;
        //         }
        //         const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
        //         const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
        //         const script3 = script2.replace('{surveySlugNamePlaceHolder}', surveySlugDisplayName);
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.goHome();
        //         const scriptEditor = new ScriptEditor(driver);
        //         scriptUUID = await scriptEditor.configureScript(script3, generalService);
        //         await webAppHeader.goHome();
        //     });
        //     it('6. Create Page With SlideShow Which Will Run The Script', async function () {
        //         const e2eUtils = new E2EUtils(driver);
        //         surveyBlockPageName = 'surveySlideShow';
        //         slideshowBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
        //         const pageBuilder = new PageBuilder(driver);
        //         const createdPage = await pageBuilder.getPageByUUID(slideshowBlockPageUUID, client);
        //         const SlideShowBlockInstance = new SlideShowBlock(scriptUUID);
        //         createdPage.Blocks.push(SlideShowBlockInstance);
        //         createdPage.Layout.Sections[0].Columns[0] = new SlideShowBlockColumn(SlideShowBlockInstance.Key);
        //         console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
        //         const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
        //         console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.goHome();
        //     });
        //     it('7. create a slug for the slideshow page and set it to show on homepage', async function () {
        //         slideshowSlugDisplayName = `slideshow_slug_${generalService.generateRandomString(4)}`;
        //         const slugPath = slideshowSlugDisplayName;
        //         await CreateSlug(
        //             email,
        //             password,
        //             driver,
        //             generalService,
        //             slideshowSlugDisplayName,
        //             slugPath,
        //             slideshowBlockPageUUID,
        //         );
        //         driver.sleep(5000);
        //         const webAppHeader = new WebAppHeader(driver);
        //         await webAppHeader.openSettings();
        //         driver.sleep(6000);
        //         const brandedApp = new BrandedApp(driver);
        //         await brandedApp.addAdminHomePageButtons(slideshowSlugDisplayName);
        //         const webAppHomePage = new WebAppHomePage(driver);
        //         for (let index = 0; index < 2; index++) {
        //             await webAppHomePage.manualResync(client);
        //         }
        //         await webAppHomePage.validateATDIsApearingOnHomeScreen(slideshowSlugDisplayName);
        //     });
        //     it('Data Cleansing', async function () {
        //         //TODO
        //         //1. delete survey template
        //         //2. delete resource views
        //         //3. delete relevant pages
        //         //4. delete slugs
        //         //5. delete from homescreen
        //         // debugger;
        //     });
        // });
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
                const surveyUUID = '6c2044d1-efa9-4edd-ac9d-48eee52217d3';
                const slideshowSlugDisplayName = 'slideshow_slug_kvhy';
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity(slideshowSlugDisplayName);
                const slideShowPage = new SlideShowPage(driver);
                await slideShowPage.enterSurveyPicker();
                const surveyPicker = new SurveyPicker(driver);
                const isAccountSelectionOpen = await surveyPicker.selectSurvey(surveyUUID);
                expect(isAccountSelectionOpen).to.equal(true);
                const isTemplateOpen = await surveyPicker.selectAccount('Account for order scenarios');
                expect(isTemplateOpen).to.equal(true);
                debugger;
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
