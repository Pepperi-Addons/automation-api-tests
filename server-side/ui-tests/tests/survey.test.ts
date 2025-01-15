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
// import { MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { ResourceViews } from '../pom/addons/ResourceList';
// import { DataViewsService } from '../../services/data-views.service';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptEditor } from '../pom/addons/ScriptPicker';
// import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';
import { SlideShowPage } from '../pom/addons/SlideShowPage';
import { SurveyPicker } from '../pom/addons/SurveyPicker';
import { SurveyFiller } from '../pom/addons/SurveyFiller';
import { UDCService } from '../../services/user-defined-collections.service';
import { ObjectsService } from '../../services/objects.service';
import addContext from 'mochawesome/addContext';

chai.use(promised);

const surveySpesificTestData = {
    'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''], //OUR TESTING ADDON --
    'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''], //PAPI locked on TLS 2 version --
    'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', ''], //cpapi --
    'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''], //CPAS --
    'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
    'Key Management Service': ['8b4a1bd8-a2eb-4241-85ac-89c9e724e900', ''],
    'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
    'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
    'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''], // evgeny - 24/3/24; new CPI Data addon versions
    'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''], //1.4.22 in the interim 1.4.X PFS version
    'System Health': ['f8b9fa6f-aa4d-4c8d-a78c-75aabc03c8b3', ''],
    // configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', '1.%.%'], //locked for survey
    configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
    sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], //sync is now public
    'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
    'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', ''],
    'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', ''],
    'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', ''],
    'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
    'Async Task Execution': ['00000000-0000-0000-0000-0000000a594c', ''],
    'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''],
    ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
    'Automated Jobs': ['fcb7ced2-4c81-4705-9f2b-89310d45e6c7', ''],
    // 'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', '1.0.2'],
    'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
    // 'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', '1.0.134'], //hardcoded because newest isn't phased and otherwise wont match new webapp
    'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', ''],
    'Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
    'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', ''],
    'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', ''],
    'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', ''],
    'Audit Log': ['00000000-0000-0000-0000-00000da1a109', ''],
    'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    // 'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', '2.2.%'],
    'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', ''],
    Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
};

export async function SurveyTests(email: string, password: string, client: Client, varPass) {
    const date = new Date();
    const generalService = new GeneralService(client);
    let driver: Browser;
    let surveyBlockPageName: string;
    let surveyBlockPageUUID: string;
    let slideshowBlockPageUUID: string;
    let surveyViewUUID: string;
    let accountViewUUID: string;
    let scriptUUID: string;
    let slideshowSlugDisplayName: string;
    let surveySlugDisplayName: string;
    let surveyUUID: string;
    let surveyTemplateName: string;
    let surveyTemplateDesc: string;

    const collectionProperties = [
        'GenericResource',
        'ModificationDateTime',
        'SyncData',
        'SyncDataDirty', // DI-28156
        'CreationDateTime',
        'UserDefined',
        'Fields',
        'Description',
        'DataSourceData',
        'DocumentKey',
        'Type',
        'Lock',
        'ListView',
        'Hidden',
        'Name',
        'AddonUUID',
    ];

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
    const buyerEmailProd = 'surveyNeo4jProdBuyer@pepperitest.com';
    const buyerPassProd = '9Z^ch5';
    const repEmailProd = 'surveyNeo4jProdRep@pepperitest.com';
    const repPassProd = 'sZ&4Ew';
    const buyerEmailStage = 'surveyNeo4jSBBuyer@pepperitest.com';
    const buyerPassStage = '4iuWd*';
    const repEmailStage = 'surveyNeo4jSBRep@pepperitest.com';
    const repPassStage = 'F@QVr9';
    const buyerEmailEU = 'surveyNeo4jEUBuyer2@pepperitest.com';
    const buyerPassEU = '5&6bAx';
    const repEmailEU = 'surveyNeo4jEURep2@pepperitest.com';
    const repPassEU = 'j58Y$x';

    let repEmail;
    let repPass;
    let buyerEmail;
    let buyerPass;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        repEmail = repEmailStage;
        repPass = repPassStage;
        buyerEmail = buyerEmailStage;
        buyerPass = buyerPassStage;
    } else if (generalService.papiClient['options'].baseURL.includes('eu')) {
        repEmail = repEmailEU;
        repPass = repPassEU;
        buyerEmail = buyerEmailEU;
        buyerPass = buyerPassEU;
    } else {
        repEmail = repEmailProd;
        repPass = repPassProd;
        buyerEmail = buyerEmailProd;
        buyerPass = buyerPassProd;
    }
    await generalService.baseAddonVersionsInstallation(varPass, surveySpesificTestData);
    // #region Upgrade survey dependencies

    const testData = {
        // using special testData object because survey users are special - they are locked on nebula versions
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
        'application-header': ['9bc8af38-dd67-4d33-beb0-7d6b39a6e98d', ''],
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', '1.%.%'], //locked because config 1.x.y is for open sync
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.69'],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '1.%.%'], //locked because cpi-data 1.x.y is for sync 3.x.y which we work with now
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        Crawler: ['f489d076-381f-4cf7-aa63-33c6489eb017', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', '%'],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '3.%.%'], //locked because sync 2.x.y is for open sync
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', '%'], //dependecy of udc
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Abstract Activity': ['92b9bd68-1660-4998-91bc-3b745b4bab11', ''],
        Survey: ['dd0a85ea-7ef0-4bc1-b14f-959e0372877a', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', '1.3.7'], //slugs above 1.3.7 (1.3.8 and so on) require config  >=1.0.18 but we cant upgrade as its for open sync
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'pepperi-pack': ['4817f4fe-9ff6-435e-9415-96b1142675eb', ''],
        'Survey Builder': ['cf17b569-1af4-45a9-aac5-99f23cae45d8', '0.8.%'], //15/5/24: phased version is 0.7.50, once we'll phase 0.8.x and avaliable 0.9.x this has to change
        Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    const installedSurveyBuilderVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Survey Builder',
    )?.Version;
    const installedSurveyVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Survey',
    )?.Version;

    // #endregion Upgrade survey dependencies

    const objectsService = new ObjectsService(generalService);
    const udcService = new UDCService(generalService);
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let surveyService: SurveyTemplateBuilder;
    let e2eUtils: E2EUtils;
    let resourceViews: ResourceViews;
    let pageBuilder: PageBuilder;
    let scriptEditor: ScriptEditor;
    let brandedApp: BrandedApp;
    let slideShowPage: SlideShowPage;
    let surveyPicker: SurveyPicker;
    let surveyFiller: SurveyFiller;
    let slugs: Slugs;

    describe(`Survey Builder Tests Suit - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } || Survey Ver. ${installedSurveyVersion} || Survey Builder Ver. ${installedSurveyBuilderVersion} || ${date}`, async function () {
        describe('Configuring Survey', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
                webAppHomePage = new WebAppHomePage(driver);
                webAppLoginPage = new WebAppLoginPage(driver);
                surveyService = new SurveyTemplateBuilder(driver);
                webAppHeader = new WebAppHeader(driver);
                e2eUtils = new E2EUtils(driver);
                resourceViews = new ResourceViews(driver);
                pageBuilder = new PageBuilder(driver);
                scriptEditor = new ScriptEditor(driver);
                brandedApp = new BrandedApp(driver);
            });

            after(async function () {
                await driver.close();
            });

            afterEach(async function () {
                // const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });

            it(`"MySurveys" Collection Upsert`, async function () {
                const bodyOfCollection = udcService.prepareDataForUdcCreation({
                    nameOfCollection: 'MySurveys',
                    descriptionOfCollection: 'Created with Automation',
                    inherits: 'surveys',
                    fieldsOfCollection: [],
                    syncDefinitionOfCollection: { Sync: true },
                });
                const pipelineUpsertResponse = await udcService.postScheme(bodyOfCollection);
                console.info(`MySurveys pipelineUpsertResponse: ${JSON.stringify(pipelineUpsertResponse, null, 2)}`);
                expect(pipelineUpsertResponse).to.be.an('object');
                Object.keys(pipelineUpsertResponse).forEach((collectionProperty) => {
                    expect(collectionProperty).to.be.oneOf(collectionProperties);
                });
                expect(pipelineUpsertResponse.Name).to.equal('MySurveys');
                expect(pipelineUpsertResponse.Fields).to.be.an('object');
                if (pipelineUpsertResponse.Fields)
                    expect(Object.keys(pipelineUpsertResponse.Fields)).to.eql([
                        'Account',
                        'Agent',
                        'Answers',
                        'ExternalID',
                        'StatusName',
                        'Creator',
                        'ActionDateTime',
                        'Template',
                    ]);

                // addContext(this, {
                //     title: `Collection data for "MySurveys" (CollectionFields): `,
                //     value: fields,
                // });
                addContext(this, {
                    title: `Upsert Response: `,
                    value: JSON.stringify(pipelineUpsertResponse, null, 2),
                });
            });

            it(`"MySurveyTemplates" Collection Upsert`, async function () {
                const bodyOfCollection = udcService.prepareDataForUdcCreation({
                    nameOfCollection: 'MySurveyTemplates',
                    descriptionOfCollection: 'Created with Automation',
                    inherits: 'survey_templates',
                    fieldsOfCollection: [],
                    syncDefinitionOfCollection: { Sync: true },
                });
                const pipelineUpsertResponse = await udcService.postScheme(bodyOfCollection);
                console.info(
                    `MySurveyTemplates pipelineUpsertResponse: ${JSON.stringify(pipelineUpsertResponse, null, 2)}`,
                );
                expect(pipelineUpsertResponse).to.be.an('object');
                Object.keys(pipelineUpsertResponse).forEach((collectionProperty) => {
                    expect(collectionProperty).to.be.oneOf(collectionProperties);
                });
                expect(pipelineUpsertResponse.Name).to.equal('MySurveyTemplates');
                expect(pipelineUpsertResponse.Fields).to.be.an('object');
                if (pipelineUpsertResponse.Fields)
                    expect(Object.keys(pipelineUpsertResponse.Fields)).to.eql([
                        'Active',
                        'Description',
                        'Sections',
                        'Name',
                    ]);

                // addContext(this, {
                //     title: `Collection data for "MySurveyTemplates" (CollectionFields): `,
                //     value: fields,
                // });
                addContext(this, {
                    title: `Upsert Response: `,
                    value: JSON.stringify(pipelineUpsertResponse, null, 2),
                });
            });

            it(`Truncate "MySurveys" Collection`, async function () {
                const truncateResponse = await udcService.truncateScheme('MySurveys');
                console.info(`MySurveys truncateResponse: ${JSON.stringify(truncateResponse, null, 2)}`);
                addContext(this, {
                    title: `Truncate Response: `,
                    value: JSON.stringify(truncateResponse, null, 2),
                });
                expect(truncateResponse.Ok).to.be.true;
                expect(truncateResponse.Status).to.equal(200);
                expect(truncateResponse.Error).to.eql({});
                expect(Object.keys(truncateResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                expect(truncateResponse.Body.Done).to.be.true;

                const mySurveysDocs = await udcService.getDocuments('MySurveys');
                expect(mySurveysDocs).to.be.an('array').with.lengthOf(0);
            });

            it(`Truncate "MySurveyTemplates" Collection`, async function () {
                const truncateResponse = await udcService.truncateScheme('MySurveyTemplates');
                console.info(`MySurveyTemplates truncateResponse: ${JSON.stringify(truncateResponse, null, 2)}`);
                addContext(this, {
                    title: `Truncate Response: `,
                    value: JSON.stringify(truncateResponse, null, 2),
                });
                expect(truncateResponse.Ok).to.be.true;
                expect(truncateResponse.Status).to.equal(200);
                expect(truncateResponse.Error).to.eql({});
                expect(Object.keys(truncateResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                expect(truncateResponse.Body.Done).to.be.true;

                const mySurveyTemplatesDocs = await udcService.getDocuments('MySurveyTemplates');
                expect(mySurveyTemplatesDocs).to.be.an('array').with.lengthOf(0);
            });

            it('Views Leftovers Cleanup (containing "Accounts")', async () => {
                const allViews = await resourceViews.getAllViews(client);
                const viewsOfAutoTest = allViews?.Body.filter((view) => {
                    if (view.Name.includes('Accounts')) {
                        return view.Key;
                    }
                });
                console.info(`allViews Length: ${allViews.Body.length}`);
                console.info(`viewsOfAutoTest Length: ${viewsOfAutoTest.length}`);
                console.info(`allViews: ${JSON.stringify(allViews.Body, null, 4)}`);
                console.info(`viewsOfAutoTest: ${JSON.stringify(viewsOfAutoTest, null, 4)}`);
                const deleteAutoViewsResponse: FetchStatusResponse[] = await Promise.all(
                    viewsOfAutoTest.map(async (autoView) => {
                        const deleteAutoViewResponse = await resourceViews.deleteViewViaAPI(autoView.Key, client);
                        // console.info(`deleteAutoViewResponse: ${JSON.stringify(deleteAutoViewResponse, null, 4)}`);
                        return deleteAutoViewResponse;
                    }),
                );
                console.info(`deleteAutoViewResponse Length: ${deleteAutoViewsResponse.length}`);
                console.info(`deleteAutoViewsResponse: ${JSON.stringify(deleteAutoViewsResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allViewsAfterCleanup = await resourceViews.getAllViews(client);
                const findAutoViewAfterCleanup = allViewsAfterCleanup?.Body.find((view) =>
                    view.Name.includes('Accounts'),
                );
                console.info(`findAutoViewAfterCleanup: ${JSON.stringify(findAutoViewAfterCleanup, null, 4)}`);
                expect(findAutoViewAfterCleanup).to.be.undefined;
            });

            it('Views Leftovers Cleanup (containing "Surveys")', async () => {
                const allViews = await resourceViews.getAllViews(client);
                const viewsOfAutoTest = allViews?.Body.filter((view) => {
                    if (view.Name.includes('Surveys')) {
                        return view.Key;
                    }
                });
                console.info(`allViews Length: ${allViews.Body.length}`);
                console.info(`viewsOfAutoTest Length: ${viewsOfAutoTest.length}`);
                console.info(`allViews: ${JSON.stringify(allViews.Body, null, 4)}`);
                console.info(`viewsOfAutoTest: ${JSON.stringify(viewsOfAutoTest, null, 4)}`);
                const deleteAutoViewsResponse: FetchStatusResponse[] = await Promise.all(
                    viewsOfAutoTest.map(async (autoView) => {
                        const deleteAutoViewResponse = await resourceViews.deleteViewViaAPI(autoView.Key, client);
                        // console.info(`deleteAutoViewResponse: ${JSON.stringify(deleteAutoViewResponse, null, 4)}`);
                        return deleteAutoViewResponse;
                    }),
                );
                console.info(`deleteAutoViewResponse Length: ${deleteAutoViewsResponse.length}`);
                console.info(`deleteAutoViewsResponse: ${JSON.stringify(deleteAutoViewsResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allViewsAfterCleanup = await resourceViews.getAllViews(client);
                const findAutoViewAfterCleanup = allViewsAfterCleanup?.Body.find((view) =>
                    view.Name.includes('Surveys'),
                );
                console.info(`findAutoViewAfterCleanup: ${JSON.stringify(findAutoViewAfterCleanup, null, 4)}`);
                expect(findAutoViewAfterCleanup).to.be.undefined;
            });

            it('Slugs Leftovers Cleanup (containing "survey_slug_")', async () => {
                const surveySlugDeleteResponses = await slugs.deleteSlugsByPartialName('survey_slug_', client);
                surveySlugDeleteResponses.forEach((surveySlugDeleteResponse) => {
                    expect(surveySlugDeleteResponse.Ok).to.equal(true);
                    expect(surveySlugDeleteResponse.Status).to.equal(200);
                    expect(surveySlugDeleteResponse.Body.success).to.equal(true);
                });
            });

            it('Slugs Leftovers Cleanup (containing "slideshow_slug_")', async () => {
                const slideShowSlugsResponses = await slugs.deleteSlugsByPartialName('slideshow_slug_', client);
                slideShowSlugsResponses.forEach((slideShowSlugDeleteResponse) => {
                    expect(slideShowSlugDeleteResponse.Ok).to.equal(true);
                    expect(slideShowSlugDeleteResponse.Status).to.equal(200);
                    expect(slideShowSlugDeleteResponse.Body.success).to.equal(true);
                });
            });

            it(`1. Create A UDC Which Extends 'surveys' Scheme Before Creating A Survey`, async function () {
                // debugger;
                if (!generalService.papiClient['options'].baseURL.includes('staging')) {
                    //PNS SB issue
                    const newSurveyUDCName = 'NewSurveyCollection' + generalService.generateRandomString(4);
                    console.log('about to create a new UDC named: ' + newSurveyUDCName);
                    const response = await udcService.createUDCWithFields(
                        newSurveyUDCName,
                        [],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        { AddonUUID: 'dd0a85ea-7ef0-4bc1-b14f-959e0372877a', Name: 'surveys' },
                    );
                    console.log('got the response from : ' + newSurveyUDCName);
                    expect(response).to.haveOwnProperty('Account');
                    expect(response).to.haveOwnProperty('ActionDateTime');
                    expect(response).to.haveOwnProperty('Agent');
                    expect(response).to.haveOwnProperty('Creator');
                    expect(response).to.haveOwnProperty('ExternalID');
                    expect(response).to.haveOwnProperty('StatusName');
                    expect(response).to.haveOwnProperty('Template');
                }
            });
            it('2. ADMIN Set Up: Create A Survey Template - Validate Via API All Data Is Sent Correctly', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // const surveyService = new SurveyTemplateBuilder(driver);
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
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                driver.sleep(8 * 1000);
                // const webAppHomePage = new WebAppHomePage(driver);
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
                // debugger;
                await webAppLoginPage.logout_Web18();
            });
            it('3. ADMIN Set Up: Login Again - Edit The Survey And See API Respose Is Changed', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // const surveyService = new SurveyTemplateBuilder(driver);
                const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
                expect(isSurveyBuilderSettingsShown).to.equal(true);
                await surveyService.enterSurveyTemplateEditMode(surveyTemplateName);
                const newName = surveyTemplateName + generalService.generateRandomString(4);
                await surveyService.editSurveyTemplateName(newName);
                // const webAppHomePage = new WebAppHomePage(driver);
                webAppHomePage.returnToHomePage();
                driver.sleep(8000); //give it some time to update
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
            it('4. ADMIN Set Up: Configure Resource Views For Account + Survey', async function () {
                // const e2eUtils = new E2EUtils(driver);
                // const resourceViews = new ResourceViews(driver);
                // Configure View - Accounts
                await e2eUtils.addView({
                    nameOfView: 'Accounts',
                    descriptionOfView: 'Acc',
                    nameOfResource: 'accounts',
                });
                accountViewUUID = await e2eUtils.getUUIDfromURL();
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: accountViewUUID,
                    fieldsToConfigureInView: [
                        { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'InternalID', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    ],
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                // Configure View - Survey
                await e2eUtils.addView({
                    nameOfView: 'Surveys',
                    descriptionOfView: 'Sur',
                    nameOfResource: 'MySurveyTemplates',
                });
                // Configure View
                surveyViewUUID = await e2eUtils.getUUIDfromURL();
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: surveyViewUUID,
                    fieldsToConfigureInView: [
                        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'Description', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'Sections', dataViewType: 'TextBox', mandatory: false, readonly: true },
                    ],
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('5. ADMIN Set Up: Create Page With Survey Block Inside It', async function () {
                // const e2eUtils = new E2EUtils(driver);
                surveyBlockPageName = 'surveyBlockPage';
                surveyBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
                // const pageBuilder = new PageBuilder(driver);
                const createdPage = await pageBuilder.getPageByUUID(surveyBlockPageUUID, client);
                const surveyBlockInstance = new SurveyBlock();
                createdPage.Blocks.push(surveyBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new SurveyBlockColumn(surveyBlockInstance.Key);
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('6. ADMIN Set Up: Create Slug And Map It To Show The Page With Survey Block', async function () {
                surveySlugDisplayName = `survey_slug_${generalService.generateRandomString(4)}`;
                const slugPath = surveySlugDisplayName;
                await e2eUtils.createAndMapSlug(
                    surveySlugDisplayName,
                    slugPath,
                    surveyBlockPageUUID,
                    email,
                    password,
                    client,
                );
            });
            it('7. ADMIN Set Up: Create Script Based On Config File With New Resource Views Configured', async function () {
                let script;
                try {
                    script = fs.readFileSync(path.join(__dirname, '..', 'test-data', 'surveyScriptFile.txt'), 'utf-8');
                } catch (error) {
                    throw `couldnt read script from file, got exception: ${(error as any).message}`;
                }
                const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
                const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
                const script3 = script2.replace('{surveySlugNamePlaceHolder}', surveySlugDisplayName);
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                // const scriptEditor = new ScriptEditor(driver);
                scriptUUID = await scriptEditor.configureScriptForSurvey_Web18(script3, generalService);
                await webAppHeader.goHome();
            });
            it('8. ADMIN Set Up: Create Page With SlideShow Which Will Run The Script', async function () {
                // const e2eUtils = new E2EUtils(driver);
                surveyBlockPageName = 'surveySlideShow';
                slideshowBlockPageUUID = await e2eUtils.addPageNoSections(surveyBlockPageName, 'tests');
                // const pageBuilder = new PageBuilder(driver);
                const createdPage = await pageBuilder.getPageByUUID(slideshowBlockPageUUID, client);
                const SlideShowBlockInstance = new SlideShowBlock(scriptUUID);
                createdPage.Blocks.push(SlideShowBlockInstance);
                createdPage.Layout.Sections[0].Columns[0] = new SlideShowBlockColumn(SlideShowBlockInstance.Key);
                console.info('createdPage: ', JSON.stringify(createdPage, null, 2));
                const responseOfPublishPage = await pageBuilder.publishPage(createdPage, client);
                console.info('responseOfPublishPage: ', JSON.stringify(responseOfPublishPage, null, 2));
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it('9. ADMIN Set Up: Create A Slug For The Slideshow Page And Set It To Show On Homepage', async function () {
                slideshowSlugDisplayName = `slideshow_slug_${generalService.generateRandomString(4)}`;
                const slugPath = slideshowSlugDisplayName;
                // debugger;
                await e2eUtils.createAndMapSlug(
                    slideshowSlugDisplayName,
                    slugPath,
                    slideshowBlockPageUUID,
                    email,
                    password,
                    client,
                );
                driver.sleep(5000);
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                // const brandedApp = new BrandedApp(driver);
                await brandedApp.addRepHomePageButtons(slideshowSlugDisplayName);
                // const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.validateATDIsApearingOnHomeScreen(slideshowSlugDisplayName);
                // debugger;
            });
        });

        describe('UI Test Configured Survey: Admin, Rep, Buyer', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                surveyPicker = new SurveyPicker(driver);
                surveyFiller = new SurveyFiller(driver);
                slideShowPage = new SlideShowPage(driver);
                slugs = new Slugs(driver);
                // surveyService = new SurveyTemplateBuilder(driver);
                webAppHeader = new WebAppHeader(driver);
                e2eUtils = new E2EUtils(driver);
                // resourceViews = new ResourceViews(driver);
                pageBuilder = new PageBuilder(driver);
                // scriptEditor = new ScriptEditor(driver);
                brandedApp = new BrandedApp(driver);
            });

            after(async function () {
                await driver.close();
            });

            afterEach(async function () {
                // const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it('1. Admin Testing: Fill Survey Via UI, See Is Synced To Admin UDC', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.reSyncApp();
                await webAppHomePage.enterActivty(slideshowSlugDisplayName);
                driver.sleep(3000);
                // const slideShowPage = new SlideShowPage(driver);
                await slideShowPage.enterSurveyPicker();
                // const surveyPicker = new SurveyPicker(driver);
                driver.sleep(6500);
                const isAccountSelectionOpen = await surveyPicker.selectSurvey(surveyUUID);
                driver.sleep(2500);
                expect(isAccountSelectionOpen).to.equal(true);
                // const objectsService = new ObjectsService(generalService);
                const accounts = await objectsService.getAccounts();
                expect(accounts.length).to.be.above(0);
                const accName = accounts[0].Name;
                const accUUID = accounts[0].UUID;
                const isTemplateOpen = await surveyPicker.selectAccount(accName);
                driver.sleep(2500);
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
                // const surveyFiller = new SurveyFiller(driver);
                const surveyKey = await surveyFiller.getKeyOfSurveyFromURL();
                console.log(`################ SURVEY KEY: Admin ===>>>> ${surveyUUID} ########`);
                addContext(this, {
                    title: `SURVEY KEY => ${surveyUUID}`,
                    value: 'NONE',
                });
                // debugger;
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
                const surveyResponse = await generalService.fetchStatus(`/resources/MySurveys?page_size=-1`, {
                    method: 'GET',
                });
                // debugger;
                const filteredSurveyResponse = surveyResponse.Body.filter((survey) => survey.Key === surveyKey);
                expect(filteredSurveyResponse.length).to.equal(1);
                const currentSurvey = filteredSurveyResponse[0];
                expect(currentSurvey).to.not.be.undefined;
                expect(currentSurvey.Template).to.equal(surveyUUID);
                expect(currentSurvey.StatusName).to.equal('Submitted');
                expect(currentSurvey.ResourceName).to.equal('MySurveys');
                expect(currentSurvey.Account).to.equal(accUUID);
                const surveyAnswers = currentSurvey.Answers;
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
            it('1.1. Admin Testing: Logout From User - Done This Way To Prevent Failure In Next User Login', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.logout_Web18();
            });
            it('2. Rep Testing: Fill Survey Via UI, See Is Synced To Admin UDC', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForRep(repEmail, repPass);
                // const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.enterActivty(slideshowSlugDisplayName);
                driver.sleep(3000);
                // const slideShowPage = new SlideShowPage(driver);
                await slideShowPage.enterSurveyPicker();
                // const surveyPicker = new SurveyPicker(driver);
                driver.sleep(6500);
                const isAccountSelectionOpen = await surveyPicker.selectSurvey(surveyUUID);
                driver.sleep(2500);
                expect(isAccountSelectionOpen).to.equal(true);
                // const objectsService = new ObjectsService(generalService);
                const accounts = await objectsService.getAccounts();
                expect(accounts.length).to.be.above(0);
                const accName = accounts[0].Name;
                const accUUID = accounts[0].UUID;
                const isTemplateOpen = await surveyPicker.selectAccount(accName);
                driver.sleep(2500);
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
                // const surveyFiller = new SurveyFiller(driver);
                const surveyKey = await surveyFiller.getKeyOfSurveyFromURL();
                console.log(`################ SURVEY KEY: Rep ===>>>> ${surveyUUID} ########`);
                addContext(this, {
                    title: `SURVEY KEY => ${surveyUUID}`,
                    value: 'NONE',
                });
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
                const surveyResponse = await generalService.fetchStatus(`/resources/MySurveys?page_size=-1`, {
                    method: 'GET',
                });
                // debugger;
                const filteredSurveyResponse = surveyResponse.Body.filter((survey) => survey.Key === surveyKey);
                expect(filteredSurveyResponse.length).to.equal(1);
                const currentSurvey = filteredSurveyResponse[0];
                expect(currentSurvey).to.not.be.undefined;
                expect(currentSurvey.Template).to.equal(surveyUUID);
                expect(currentSurvey.StatusName).to.equal('Submitted');
                expect(currentSurvey.ResourceName).to.equal('MySurveys');
                expect(currentSurvey.Account).to.equal(accUUID);
                const surveyAnswers = currentSurvey.Answers;
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
            it('2.1. Rep Testing: Logout From User - Done This Way To Prevent Failure In Next User Login', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.logout_Web18();
            });
            it('3. Buyer Testing: Fill Survey Via UI, See Is Synced To Admin UDC', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForBuyer(buyerEmail, buyerPass);
                // const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.enterActivty(slideshowSlugDisplayName);
                driver.sleep(3000);
                // const slideShowPage = new SlideShowPage(driver);
                await slideShowPage.enterSurveyPicker();
                // const surveyPicker = new SurveyPicker(driver);
                driver.sleep(6500);
                const isAccountSelectionOpen = await surveyPicker.selectSurvey(surveyUUID);
                driver.sleep(2500);
                expect(isAccountSelectionOpen).to.equal(true);
                // const objectsService = new ObjectsService(generalService);
                const accounts = await objectsService.getAccounts();
                expect(accounts.length).to.be.above(0);
                const accName = accounts[0].Name;
                const accUUID = accounts[0].UUID;
                const isTemplateOpen = await surveyPicker.selectAccount(accName);
                driver.sleep(2500);
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
                // const surveyFiller = new SurveyFiller(driver);
                const surveyKey = await surveyFiller.getKeyOfSurveyFromURL();
                console.log(`################ SURVEY KEY: Buyer ===>>>> ${surveyUUID} ########`);
                addContext(this, {
                    title: `SURVEY KEY => ${surveyUUID}`,
                    value: 'NONE',
                });
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
                const surveyResponse = await generalService.fetchStatus(`/resources/MySurveys?page_size=-1`, {
                    method: 'GET',
                });
                // debugger;
                const filteredSurveyResponse = surveyResponse.Body.filter((survey) => survey.Key === surveyKey);
                expect(filteredSurveyResponse.length).to.equal(1);
                const currentSurvey = filteredSurveyResponse[0];
                expect(currentSurvey).to.not.be.undefined;
                expect(currentSurvey.Template).to.equal(surveyUUID);
                expect(currentSurvey.StatusName).to.equal('Submitted');
                expect(currentSurvey.ResourceName).to.equal('MySurveys');
                expect(currentSurvey.Account).to.equal(accUUID);
                const surveyAnswers = currentSurvey.Answers;
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
            it('3.1. Buyer Testing: Logout From User - Done This Way To Prevent Failure In Next User Login', async function () {
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.logout_Web18();
            });
            it('API Data Cleansing: 1. survey template', async function () {
                //1. delete survey template
                // debugger;
                const body = { Key: surveyUUID, Hidden: true };
                const deleteSurveyTemplateResponse = await generalService.fetchStatus(`/resources/MySurveyTemplates`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                });
                expect(deleteSurveyTemplateResponse.Ok).to.equal(true);
                expect(deleteSurveyTemplateResponse.Status).to.equal(200);
                expect(deleteSurveyTemplateResponse.Body.Key).to.equal(surveyUUID);
                expect(deleteSurveyTemplateResponse.Body.Hidden).to.equal(true);
            });
            it('API Data Cleansing: 2. resource views', async function () {
                //2. delete resource views
                const accBody = { Key: accountViewUUID, Hidden: true };
                const deleteAccountRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(accBody),
                    },
                );
                expect(deleteAccountRLResponse.Ok).to.equal(true);
                expect(deleteAccountRLResponse.Status).to.equal(200);
                expect(deleteAccountRLResponse.Body.Name).to.equal('Accounts');
                expect(deleteAccountRLResponse.Body.Hidden).to.equal(true);
                const surveyBody = { Key: surveyViewUUID, Hidden: true };
                const deleteSurveyRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(surveyBody),
                    },
                );
                expect(deleteSurveyRLResponse.Ok).to.equal(true);
                expect(deleteSurveyRLResponse.Status).to.equal(200);
                expect(deleteSurveyRLResponse.Body.Name).to.equal('Surveys');
                expect(deleteSurveyRLResponse.Body.Hidden).to.equal(true);
            });
            it('API Data Cleansing: 3. pages', async function () {
                //3. delete relevant pages
                const surveyPageDeleteBody = { Hidden: true, Key: surveyBlockPageUUID };
                const deleteSurveyPageResponse = await generalService.fetchStatus(
                    `/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=50062e0c-9967-4ed4-9102-f2bc50602d41&name=Pages&scheme=drafts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(surveyPageDeleteBody),
                    },
                );
                expect(deleteSurveyPageResponse.Ok).to.equal(true);
                expect(deleteSurveyPageResponse.Status).to.equal(200);
                expect(deleteSurveyPageResponse.Body.Key).to.equal(surveyBlockPageUUID);
                const slideshowPageDeleteBody = { Hidden: true, Key: slideshowBlockPageUUID };
                const deleteSlideShowPageResponse = await generalService.fetchStatus(
                    `/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=50062e0c-9967-4ed4-9102-f2bc50602d41&name=Pages&scheme=drafts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(slideshowPageDeleteBody),
                    },
                );
                expect(deleteSlideShowPageResponse.Ok).to.equal(true);
                expect(deleteSlideShowPageResponse.Status).to.equal(200);
                expect(deleteSlideShowPageResponse.Body.Key).to.equal(slideshowBlockPageUUID);
            });
            it('API Data Cleansing: 4. script', async function () {
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
            });
            it('API Data Cleansing: 5. UDC', async function () {
                //delete UDC
                // const udcService = new UDCService(generalService);
                const documents = await udcService.getSchemes();
                const toHideCollections = documents.filter((doc) => doc.Name.includes('NewSurveyCollection'));
                for (let index = 0; index < toHideCollections.length; index++) {
                    const collectionToHide = toHideCollections[index];
                    const collectionsObjcts = await udcService.getAllObjectFromCollectionCount(collectionToHide.Name);
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
            });
            it('API Data Cleansing: 6. slugs', async function () {
                //4. delete slugs
                // const slugs: Slugs = new Slugs(driver);
                const slideShowSlugsResponse = await slugs.deleteSlugByName(slideshowSlugDisplayName, client);
                expect(slideShowSlugsResponse.Ok).to.equal(true);
                expect(slideShowSlugsResponse.Status).to.equal(200);
                expect(slideShowSlugsResponse.Body.success).to.equal(true);
                const surveySlugResponse = await slugs.deleteSlugByName(surveySlugDisplayName, client);
                expect(surveySlugResponse.Ok).to.equal(true);
                expect(surveySlugResponse.Status).to.equal(200);
                expect(surveySlugResponse.Body.success).to.equal(true);
            });
            it('UI Data Cleansing: 7. ATD from home screen', async function () {
                //5. delete ATD from homescreen
                // const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                // const brandedApp = new BrandedApp(driver);
                await brandedApp.removeRepHomePageButtons(slideshowSlugDisplayName);
                // const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.manualResync(client);
                const isNotFound = await webAppHomePage.validateATDIsNOTApearingOnHomeScreen(slideshowSlugDisplayName);
                expect(isNotFound).to.equal(true);
            });

            it('Pages Leftovers Cleanup (containing "surveyBlockPage")', async () => {
                // const pageBuilder = new PageBuilder(driver);
                const allPages = await pageBuilder.getAllPages(client);
                const pagesOfAutoTest = allPages?.Body.filter((page) => {
                    if (page.Name.includes('surveyBlockPage')) {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`pagesOfAutoTest: ${JSON.stringify(pagesOfAutoTest, null, 4)}`);
                const deleteAutoPagesResponse: FetchStatusResponse[] = await Promise.all(
                    pagesOfAutoTest.map(async (autoPage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(autoPage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteAutoPagesResponse: ${JSON.stringify(deleteAutoPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getAllPages(client);
                const findAutoPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                    page.Name.includes('surveyBlockPage'),
                );
                console.info(`findAutoPageAfterCleanup: ${JSON.stringify(findAutoPageAfterCleanup, null, 4)}`);
                expect(findAutoPageAfterCleanup).to.be.undefined;
            });

            it('Pages Leftovers Cleanup (containing "surveySlideShow")', async () => {
                // const pageBuilder = new PageBuilder(driver);
                const allPages = await pageBuilder.getAllPages(client);
                const pagesOfAutoTest = allPages?.Body.filter((page) => {
                    if (page.Name.includes('surveySlideShow')) {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`pagesOfAutoTest: ${JSON.stringify(pagesOfAutoTest, null, 4)}`);
                const deleteAutoPagesResponse: FetchStatusResponse[] = await Promise.all(
                    pagesOfAutoTest.map(async (autoPage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(autoPage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteAutoPagesResponse: ${JSON.stringify(deleteAutoPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getAllPages(client);
                const findAutoPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                    page.Name.includes('surveySlideShow'),
                );
                console.info(`findAutoPageAfterCleanup: ${JSON.stringify(findAutoPageAfterCleanup, null, 4)}`);
                expect(findAutoPageAfterCleanup).to.be.undefined;
            });

            it('Pages Leftovers Cleanup (starting with "Blank Page")', async () => {
                // const pageBuilder = new PageBuilder(driver);
                const allPages = await pageBuilder.getDraftPages(client);
                console.info(
                    `allPages.Body.length (looking for Blank Page): ${JSON.stringify(allPages.Body.length, null, 4)}`,
                );
                const blankPages = allPages?.Body.filter((page) => {
                    if (page.Name.includes('Blank Page ')) {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`blankPages: ${JSON.stringify(blankPages, null, 4)}`);
                const deleteBlankPagesResponse: FetchStatusResponse[] = await Promise.all(
                    blankPages.map(async (blankPage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(blankPage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteBlankPagesResponse: ${JSON.stringify(deleteBlankPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getDraftPages(client);
                const findBlankPageAfterCleanup = allPagesAfterCleanup?.Body.find((page) =>
                    page.Name.includes('Blank Page'),
                );
                console.info(`findBlankPageAfterCleanup: ${JSON.stringify(findBlankPageAfterCleanup, null, 4)}`);
                expect(findBlankPageAfterCleanup).to.be.undefined;
            });

            it('Pages Leftovers Cleanup (name equal empty string "")', async () => {
                // const pageBuilder = new PageBuilder(driver);
                const allPages = await pageBuilder.getDraftPages(client);
                console.info(
                    `allPages.Body.length (looking for Blank Page): ${JSON.stringify(allPages.Body.length, null, 4)}`,
                );
                const noNamePages = allPages?.Body.filter((page) => {
                    if (page.Name === '') {
                        return page.Key;
                    }
                });
                console.info(`allPages: ${JSON.stringify(allPages.Body, null, 4)}`);
                console.info(`noNamePages: ${JSON.stringify(noNamePages, null, 4)}`);
                const deleteBlankPagesResponse: FetchStatusResponse[] = await Promise.all(
                    noNamePages.map(async (noNamePage) => {
                        const deleteAutoPageResponse = await pageBuilder.removePageByUUID(noNamePage.Key, client);
                        console.info(`deleteAutoPageResponse: ${JSON.stringify(deleteAutoPageResponse, null, 4)}`);
                        return deleteAutoPageResponse;
                    }),
                );
                console.info(`deleteBlankPagesResponse: ${JSON.stringify(deleteBlankPagesResponse, null, 4)}`);
                generalService.sleep(5 * 1000);
                const allPagesAfterCleanup = await pageBuilder.getDraftPages(client);
                const findNoNamePageAfterCleanup = allPagesAfterCleanup?.Body.find((page) => page.Name === '');
                console.info(`findNoNamePageAfterCleanup: ${JSON.stringify(findNoNamePageAfterCleanup, null, 4)}`);
                expect(findNoNamePageAfterCleanup).to.be.undefined;
            });

            it('Remove Leftovers Buttons from home screen (Rep profile)', async function () {
                // const e2eUiService = new E2EUtils(driver);
                // const webAppHomePage = new WebAppHomePage(driver);
                // const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
                await webAppHeader.openSettings();
                await webAppHomePage.isSpinnerDone();
                driver.sleep(0.5 * 1000);
                await e2eUtils.removeHomePageButtonsLeftoversByProfile(`slidshow_slug_`, 'Rep');
                await e2eUtils.performManualSync.bind(this)(client, driver);
                const leftoversButtonsOnHomeScreen = await webAppHomePage.buttonsApearingOnHomeScreenByPartialText.bind(
                    this,
                )(driver, `slidshow_slug_`);
                expect(leftoversButtonsOnHomeScreen).to.equal(false);
            });

            // it('Remove Leftovers Buttons from home screen (Admin profile)', async function () {
            //     const e2eUtils = new E2EUtils(driver);
            //     const webAppHomePage = new WebAppHomePage(driver);
            //     const webAppHeader = new WebAppHeader(driver);
            //     await webAppHeader.goHome();
            //     await webAppHeader.openSettings();
            //     await webAppHomePage.isSpinnerDone();
            //     driver.sleep(0.5 * 1000);
            //     await e2eUtils.removeHomePageButtonsLeftoversByProfile(`slidshow_slug_`, 'Admin');
            //     await e2eUtils.performManualSync.bind(this)(client, driver);
            //     const leftoversButtonsOnHomeScreen = await webAppHomePage.buttonsApearingOnHomeScreenByPartialText.bind(
            //         this,
            //     )(driver, `slidshow_slug_`);
            //     expect(leftoversButtonsOnHomeScreen).to.equal(false);
            // });

            // it('Remove Leftovers Buttons from home screen (Buyer profile)', async function () {
            //     const e2eUtils = new E2EUtils(driver);
            //     const webAppHomePage = new WebAppHomePage(driver);
            //     const webAppHeader = new WebAppHeader(driver);
            //     await webAppHeader.goHome();
            //     await webAppHeader.openSettings();
            //     await webAppHomePage.isSpinnerDone();
            //     driver.sleep(0.5 * 1000);
            //     await e2eUtils.removeHomePageButtonsLeftoversByProfile(`slidshow_slug_`, 'Buyer');
            //     await e2eUtils.performManualSync.bind(this)(client, driver);
            //     const leftoversButtonsOnHomeScreen = await webAppHomePage.buttonsApearingOnHomeScreenByPartialText.bind(
            //         this,
            //     )(driver, `slidshow_slug_`);
            //     expect(leftoversButtonsOnHomeScreen).to.equal(false);
            // });

            it('Remove Leftovers Slugs (containing "survey_slug_") via API', async function () {
                // const slugs = new Slugs(driver);
                const deleteResponses = await slugs.deleteSlugsByPartialName('survey_slug_', client);
                deleteResponses.forEach((res) => {
                    expect(res).to.have.property('Ok').that.is.true;
                    expect(res).to.have.property('Status').that.is.equal(200);
                    expect(res).to.have.property('Error').that.is.eql({});
                    expect(res).to.have.property('Body').that.haveOwnProperty('success').that.is.true;
                });
                expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug.includes('survey_slug_'))).to
                    .be.undefined;
            });

            it('Remove Leftovers Slugs (containing "slideshow_slug_") via API', async function () {
                // const slugs = new Slugs(driver);
                const deleteResponses = await slugs.deleteSlugsByPartialName('slideshow_slug_', client);
                deleteResponses.forEach((res) => {
                    expect(res).to.have.property('Ok').that.is.true;
                    expect(res).to.have.property('Status').that.is.equal(200);
                    expect(res).to.have.property('Error').that.is.eql({});
                    expect(res).to.have.property('Body').that.haveOwnProperty('success').that.is.true;
                });
                expect(await (await slugs.getSlugs(client)).Body.find((item) => item.Slug.includes('slideshow_slug_')))
                    .to.be.undefined;
            });

            it('Print Screen', async function () {
                driver.sleep(0.5 * 1000);
                const base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Buttons Removal`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });
        });

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
    });
}

// async function CreateSlug(
//     email: string,
//     password: string,
//     driver: Browser,
//     generalService: GeneralService,
//     slugDisplayName: string,
//     slug_path: string,
//     pageToMapToKey: string,
//     client: Client,
// ) {
//     // const slugDisplayName = 'slideshow_slug';
//     // const slug_path = 'slideshow_slug';
//     const e2eUiService = new E2EUtils(driver);
//     await e2eUiService.navigateTo('Slugs');
//     const slugs: Slugs = new Slugs(driver);
//     driver.sleep(2000);
//     if (await driver.isElementVisible(slugs.SlugMappingScreenTitle)) {
//         await slugs.clickTab('Slugs_Tab');
//     }
//     driver.sleep(2000);
//     await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
//     driver.sleep(1000);
//     await slugs.clickTab('Mapping_Tab');
//     driver.sleep(1000);
//     await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
//     await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
//     await slugs.isSpinnerDone();
//     driver.sleep(2500);
//     const dataViewsService = new DataViewsService(generalService.papiClient);
//     const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
//     const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
//         [{ slug_path: slug_path, pageUUID: pageToMapToKey }],
//         existingMappedSlugs,
//     );
//     console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
//     const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
//     console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`);
//     const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
//     console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
//     driver.sleep(2 * 1000);
//     await e2eUiService.logOutLogIn(email, password, client);
//     const webAppHomePage = new WebAppHomePage(driver);
//     await webAppHomePage.isSpinnerDone();
//     await e2eUiService.navigateTo('Slugs');
//     await slugs.clickTab('Mapping_Tab');
//     driver.sleep(15 * 1000);
//     const webAppHeader = new WebAppHeader(driver);
//     await webAppHeader.goHome();
// }

// export async function CreateSlug_Web18(
//     email: string,
//     password: string,
//     driver: Browser,
//     generalService: GeneralService,
//     slugDisplayName: string,
//     slug_path: string,
//     pageToMapToKey: string,
// ) {
//     // const slugDisplayName = 'slideshow_slug';
//     // const slug_path = 'slideshow_slug';
//     const e2eUiService = new E2EUtils(driver);
//     await e2eUiService.navigateTo('Slugs');
//     const slugs: Slugs = new Slugs(driver);
//     driver.sleep(2000);
//     if (await driver.isElementVisible(slugs.SlugMappingScreenTitle)) {
//         await slugs.clickTab('Slugs_Tab');
//     }
//     driver.sleep(2000);
//     await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
//     driver.sleep(1000);
//     await slugs.clickTab('Mapping_Tab');
//     driver.sleep(1000);
//     await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
//     await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
//     await slugs.isSpinnerDone();
//     driver.sleep(2500);
//     const dataViewsService = new DataViewsService(generalService.papiClient);
//     const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
//     const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
//         [{ slug_path: slug_path, pageUUID: pageToMapToKey }],
//         existingMappedSlugs,
//     );
//     console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
//     const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
//     console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`);
//     const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
//     console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
//     driver.sleep(2 * 1000);
//     await e2eUiService.logOutLogIn_Web18(email, password);
//     const webAppHomePage = new WebAppHomePage(driver);
//     await webAppHomePage.isSpinnerDone();
//     await e2eUiService.navigateTo('Slugs');
//     driver.sleep(4 * 1000);
//     await slugs.clickTab('Mapping_Tab');
//     driver.sleep(15 * 1000);
//     const webAppHeader = new WebAppHeader(driver);
//     await webAppHeader.goHome();
// }

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
    const e2eUtils = new E2EUtils(driver);
    const resourceViews = new ResourceViews(driver);
    // const dataViewsService = new DataViewsService(generalService.papiClient);
    // Configure View - Accounts
    await e2eUtils.addView({
        nameOfView: 'Accounts',
        descriptionOfView: 'Acc',
        nameOfResource: 'accounts',
    });
    const accountViewUUID = await e2eUtils.getUUIDfromURL();
    await resourceViews.customViewConfig(client, {
        matchingEditorName: '',
        viewKey: accountViewUUID,
        fieldsToConfigureInView: [
            { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: false },
            { fieldName: 'InternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
            { fieldName: 'ExternalID', dataViewType: 'TextBox', mandatory: false, readonly: false },
            { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
        ],
    });
    await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
    // Configure View - Survey
    await e2eUtils.addView({
        nameOfView: 'Surveys',
        descriptionOfView: 'Sur',
        nameOfResource: 'MySurveyTemplates',
    });
    // Configure View
    const surveyViewUUID = await e2eUtils.getUUIDfromURL();
    await resourceViews.customViewConfig(client, {
        matchingEditorName: '',
        viewKey: surveyViewUUID,
        fieldsToConfigureInView: [
            { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
            { fieldName: 'Name', dataViewType: 'TextBox', mandatory: false, readonly: true },
            { fieldName: 'Description', dataViewType: 'TextBox', mandatory: false, readonly: true },
            { fieldName: 'Sections', dataViewType: 'TextBox', mandatory: false, readonly: true },
        ],
    });
    await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
    await webAppHeader.goHome();
    //3. survey page creation
    // const e2eUtils = new E2EUtils(driver);
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
    await e2eUtils.createAndMapSlug(surveySlugDisplayName, slugPath, surveyBlockPageUUID, email, password, client);
    //5. survey script creation
    let script;
    try {
        script = fs.readFileSync(path.join(__dirname, '..', 'test-data', 'surveyScriptFile.txt'), 'utf-8');
    } catch (error) {
        throw `couldnt read script from file, got exception: ${(error as any).message}`;
    }
    const script1 = script.replace('{surveyViewPlaceHolder}', surveyViewUUID);
    const script2 = script1.replace('{accountViewPlaceHolder}', accountViewUUID);
    const script3 = script2.replace('{surveySlugNamePlaceHolder}', surveySlugDisplayName);
    await webAppHeader.goHome();
    const scriptEditor = new ScriptEditor(driver);
    const scriptUUID = await scriptEditor.configureScriptForSurvey(script3, generalService);
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
    await e2eUtils.createAndMapSlug(
        slideshowSlugDisplayName,
        slugPath2,
        slideshowBlockPageUUID,
        email,
        password,
        client,
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

export async function configureSurvey(surveyTemplateName, surveyTemplateDesc, driver) {
    const surveyService = new SurveyTemplateBuilder(driver);
    await surveyService.enterSurveyBuilderSettingsPage();
    await surveyService.enterSurveyBuilderActualBuilder();
    const surveyUUID = await surveyService.configureTheSurveyTemplate(
        surveyTemplateName,
        surveyTemplateDesc,
        surveyService.surveyTemplateToCreate,
    );
    return surveyUUID;
}
