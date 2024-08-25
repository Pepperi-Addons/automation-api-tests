import { Client } from '@pepperi-addons/debug-server/dist';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { after, afterEach, before, describe, it } from 'mocha';
import GeneralService, { testData as testDataBase } from '../../services/general.service';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { AppHeaderObject, ApplicationHeader } from '../pom/addons/AppHeaderService';
import { Flow, FlowStep } from '../pom/addons/flow.service'; //, FlowService
import { Browser } from '../utilities/browser';
import { createFlowUsingE2E } from './flows_builder.test';
import { OpenSyncService } from '../../services/open-sync.service';
import E2EUtils from '../utilities/e2e_utils';
// import { PFSService } from '../../services/pfs.service';

chai.use(promised);

export async function SyncE2ETester(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    let APP_HEADER_OBJECT_FROM_CONFIG;
    let appHeaderUUID;
    const buyerEmailStage = 'UITesterForHeaderOpenSyncBuyer@pepperitest.com';
    const buyerPassStage = '@UE3mn';

    const flowStepScript = {
        actualScript: `export async function main(data){return 'evgeny123';}`,
        scriptName: generalService.generateRandomString(5) + '_forFlow',
        scriptDesc: 'forFlow',
        params: '',
    };
    const newFlowSteps: FlowStep[] = [
        {
            Type: 'LogicBlock',
            Relation: {
                ExecutionURL: '/addon-cpi/run_logic_block_script',
                AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
                Name: 'UserScriptsBlock',
            },
            Disabled: false,
            Configuration: {
                runScriptData: {
                    ScriptData: {},
                    ScriptKey: '',
                },
            },
            Name: 'Step',
        },
    ];
    const flowToAdd: Flow = {
        Params: [],
        Description: 'testing Description',
        Hidden: false,
        Steps: newFlowSteps,
        Name: 'test_flow_' + generalService.generateRandomString(9),
    };

    const headerObject: AppHeaderObject = {
        Name: 'test_header_' + generalService.generateRandomString(5),
        Description: 'test',
        Button: [{ ButtonName: `button_${generalService.generateRandomString(5)}`, ButtonKey: 'Notification' }],
        Menu: [{ FlowKey: '', Name: `menu_${generalService.generateRandomString(5)}`, FlowName: '' }], //
    };
    // #region Upgrade open sync dependencies
    await generalService.baseAddonVersionsInstallation(varPass, testDataBase);
    const testData = {
        nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', '%'], //dependecy of udc
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], //cpi-node
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.31.%'], //cpas
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'], //cpapi
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //papi
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', '1.4.%'], //pfs
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '3.%.%'],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], //webapp b2b
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''], //cpi - data
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], //udc
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', '2.2.%'],
        'user-defined-flows': ['dc8c5ca7-3fcc-4285-b790-349c7f3908bd', ''], //flows
        'application-header': ['9bc8af38-dd67-4d33-beb0-7d6b39a6e98d', ''], // the header itself
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade open sync dependencies

    describe('Sync E2E Tests Suit', async function () {
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

        describe('Sync E2E', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.close();
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`0. Pre-Test Step: Check That Sync Version Is Above 3`, async function () {
                const installedAddons = await generalService.getInstalledAddons();
                const syncVersion = installedAddons.find(
                    (addonObject) => addonObject.Addon.UUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a',
                )?.Version;
                const nebulaObject = installedAddons.find(
                    (addonObject) => addonObject.Addon.UUID === '00000000-0000-0000-0000-000000006a91',
                );
                expect(syncVersion).to.include('3.0');
                expect(nebulaObject).to.be.undefined;
                console.log(`Sync Version: ${syncVersion}, With NO Nebula!`);
                debugger;
            });
            // it(`*. Pre-Test Step: Testing That PFS Is Working On Open Sync`, async function () {
            //     //1. create a PFS scheme which is sync true
            //     const pfsService = new PFSService(generalService);

            //     //2.
            // });
            it(`1. Basic UI Test: Using Admin Login To WebApp, Create A Basic Flow, Set App. Header To Show This Flow And Notifications Button Using Legacy Resources And See It Changes The Header On Admin And Buyer`, async function () {
                //1. login to webapp & create a flow
                console.log('UI Test Step --> 1. Creating A Flow To Use In Header');
                const [flowKey, flowName] = await createFlowUsingE2E(
                    driver,
                    generalService,
                    email,
                    password,
                    [flowStepScript],
                    newFlowSteps,
                    flowToAdd,
                );
                headerObject.Menu[0].FlowKey = flowKey;
                headerObject.Menu[0].FlowName = flowName;
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
                //2. add new naked header
                console.log('UI Test Step --> 2. Creating A The Header');
                const appHeaderService = new ApplicationHeader(driver);
                const isAppHeaderPagePresented = await appHeaderService.enterApplicationHeaderPage();
                expect(isAppHeaderPagePresented).to.equal(true);
                appHeaderUUID = await appHeaderService.addNewAppHeader(headerObject);
                //3. validate it was created correctly using API: confguration drafts
                const draftsResponsePreButtonsAndMenu = await generalService.fetchStatus(
                    '/addons/configurations/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/AppHeaderConfiguration/drafts',
                );
                expect(draftsResponsePreButtonsAndMenu.Ok).to.equal(true);
                expect(draftsResponsePreButtonsAndMenu.Status).to.equal(200);
                expect(draftsResponsePreButtonsAndMenu.Body).to.be.an('Array');
                expect(draftsResponsePreButtonsAndMenu.Body.length).to.be.above(0);
                //4. this spesific header validation
                const newlyCreatedHeader = draftsResponsePreButtonsAndMenu.Body.find(
                    (header) => header.Key === appHeaderUUID,
                );
                expect(newlyCreatedHeader.AddonUUID).to.equal('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
                expect(newlyCreatedHeader.ConfigurationSchemaName).to.equal('AppHeaderConfiguration');
                expect(newlyCreatedHeader.Description).to.equal(headerObject.Description);
                expect(newlyCreatedHeader.Name).to.equal(headerObject.Name);
                expect(newlyCreatedHeader.Hidden).to.equal(false);
                expect(newlyCreatedHeader.Data.Published).to.equal(true);
                expect(newlyCreatedHeader.Data.Draft).to.equal(true);
                //5. adding button and menu using API (d&d)
                console.log('UI Test Step --> 3. Adding Buttons And Menu For Header');
                const [headerCreationRespone, menuKey] = await appHeaderService.configureMenuAndButtonViaAPI(
                    generalService,
                    headerObject,
                    appHeaderUUID,
                );
                expect(headerCreationRespone.Ok).to.equal(true);
                expect(headerCreationRespone.Status).to.equal(200);
                expect(headerCreationRespone.Body.success).to.equal(true);
                expect(headerCreationRespone.Body.body.publish.VersionKey).to.not.be.null;
                expect(headerCreationRespone.Body.body.publish.VersionKey).to.be.a.string;
                // 6. validate these menu & button got to confugurations
                const draftsResponsePostButtonsAndMenu_1 = await generalService.fetchStatus(
                    '/addons/configurations/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/AppHeaderConfiguration/drafts',
                );
                expect(draftsResponsePostButtonsAndMenu_1.Ok).to.equal(true);
                expect(draftsResponsePostButtonsAndMenu_1.Status).to.equal(200);
                expect(draftsResponsePostButtonsAndMenu_1.Body).to.be.an('Array');
                expect(draftsResponsePostButtonsAndMenu_1.Body.length).to.be.above(0);
                const newlyCreatedHeaderWithButtonAndMenu1 = draftsResponsePostButtonsAndMenu_1.Body.find(
                    (header) => header.Key === appHeaderUUID,
                );
                expect(newlyCreatedHeaderWithButtonAndMenu1.Name).to.equal(headerObject.Name);
                expect(newlyCreatedHeaderWithButtonAndMenu1.ConfigurationSchemaName).to.equal('AppHeaderConfiguration');
                expect(newlyCreatedHeaderWithButtonAndMenu1.AddonUUID).to.equal('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Published).to.equal(true);
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Hidden).to.equal(false);
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Buttons[0].Title).to.equal(
                    headerObject.Button[0].ButtonName,
                );
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Buttons[0].FieldID).to.equal(
                    headerObject.Button[0].ButtonKey,
                );
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Buttons[0].Visible).to.equal(true);
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Menu[0].Title).to.equal(headerObject.Menu[0].Name);
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Menu[0].Flow.FlowKey).to.equal(flowKey);
                expect(newlyCreatedHeaderWithButtonAndMenu1.Data.Menu[0].Visible).to.equal(true);
                APP_HEADER_OBJECT_FROM_CONFIG = newlyCreatedHeaderWithButtonAndMenu1;
                debugger;
                //7. shortly validate - using UI
                const isMenuAndButtonAreCreated = await appHeaderService.validateMenuAndButtonsViaUI(headerObject);
                expect(isMenuAndButtonAreCreated).to.equal(true);
                //* check open sync object got this published header + cpi data schemes
                const openSyncService = new OpenSyncService(generalService);
                const sourcesForConfig = [
                    { AddonUUID: '84c999c3-84b7-454e-9a86-71b7abc96554', LastSyncDateTime: '1970-02-18T08:48:44.880Z' },
                ];
                console.log(`======> app header: looking for: ${appHeaderUUID}`);
                const openSyncResponseCofig = await openSyncService.getSyncedConfigurationObjectBasedOnResource(
                    sourcesForConfig,
                    '1970-11-23T14:39:50.781Z',
                );
                debugger;
                const syncConfigObject = openSyncResponseCofig.Body.Response.Resources.Data.find(
                    (data) => data.Schema.Name === 'synced_configuration_objects',
                );
                const spesificHeaderWeJustCreated = syncConfigObject.Objects.filter((obj) => obj.Key === appHeaderUUID);
                expect(spesificHeaderWeJustCreated.length).to.equal(1);
                const headerElement = spesificHeaderWeJustCreated[0];
                //Profile??
                //Version??
                expect(headerElement.ConfigurationSchemeName).to.equal('AppHeaderConfiguration');
                expect(headerElement.AddonUUID).to.equal('9bc8af38-dd67-4d33-beb0-7d6b39a6e98d');
                expect(headerElement.Hidden).to.equal(false);
                expect(headerElement.Key).to.equal(headerElement.Draft);
                expect(headerElement.Data.Published).to.equal(true);
                expect(headerElement.Data.Menu.length).to.equal(1);
                const headersMenu = headerElement.Data.Menu[0];
                expect(headersMenu.Enabled).to.equal(true);
                expect(headersMenu.Key).to.equal(menuKey);
                expect(headersMenu.Flow.FlowKey).to.equal(flowKey);
                expect(headersMenu.Title).to.equal(headerObject.Menu[0].Name);
                expect(headerElement.Data.Buttons.length).to.equal(1);
                const headersButton = headerElement.Data.Buttons[0];
                expect(headersButton.Title).to.equal(headerObject.Button[0].ButtonName);
                expect(headersButton.Key).to.equal(headerObject.Button[0].ButtonKey);
                expect(headersButton.Visible).to.equal(true);
                const sourcesForSchemes = [
                    { AddonUUID: 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', LastSyncDateTime: '1970-02-18T08:48:44.880Z' },
                ];
                const openSyncResponseSchemes = await openSyncService.getSyncedConfigurationObjectBasedOnResource(
                    sourcesForSchemes,
                    '1970-11-23T14:39:50.781Z',
                );
                const syncSchemesObject = openSyncResponseSchemes.Body.Response.Resources.Data.find(
                    (data) => data.Schema.Name === 'schemes',
                );
                const spesificHeaderWeJustCreatedFromSchemes = syncSchemesObject.Objects.filter(
                    (obj) => obj.Name === 'synced_configuration_objects',
                );
                expect(spesificHeaderWeJustCreatedFromSchemes.length).to.equal(1);
                const headerElementFromSchemes = spesificHeaderWeJustCreatedFromSchemes[0];
                expect(headerElementFromSchemes.AddonUUID).to.equal('84c999c3-84b7-454e-9a86-71b7abc96554');
                expect(headerElementFromSchemes.Key).to.include('84c999c3-84b7-454e-9a86-71b7abc96554');
                expect(headerElementFromSchemes.Key).to.include('synced_configuration_objects');
                expect(headerElementFromSchemes.SyncData.Sync).to.equal(true);
                expect(headerElementFromSchemes.Fields).to.not.be.undefined;
                //8. goto slugs and set Application_Header to use just created header
                console.log('UI Test Step --> 4. Set A Slug To Show The Header');
                await appHeaderService.deleteAppHeaderSlug();
                await appHeaderService.mapASlugToAppHeader(email, password, generalService, appHeaderUUID);
                //9. re-sync -- sync? refresh?
                driver.sleep(1500);
                await driver.refresh();
                driver.sleep(1500);
                //test that the button + menu are there on the header
                console.log('UI Test Step --> 5. Test The Header Is Shown - Admin');
                const isHeaderPresentedCorrectly = await appHeaderService.UIValidateWeSeeAppHeader(
                    headerObject.Button[0].ButtonName,
                    headerObject.Menu[0].Name,
                );
                expect(isHeaderPresentedCorrectly).to.equal(true);
                // logout & login again - see header is still presented
                console.log('UI Test Step --> 6. Test The Header Is Shown, After Logout & Login - Admin');
                const e2eUiService = new E2EUtils(driver);
                await e2eUiService.logOutLogIn_Web18(email, password);
                const isHeaderPresentedCorrectlyAfterLoggingOut = await appHeaderService.UIValidateWeSeeAppHeader(
                    headerObject.Button[0].ButtonName,
                    headerObject.Menu[0].Name,
                );
                expect(isHeaderPresentedCorrectlyAfterLoggingOut).to.equal(true);
                // logout from Admin - login to buyer - tests the header
                console.log('UI Test Step --> 7. Test The Header Is Shown - BUYER');
                const webAppLoginPage: WebAppLoginPage = new WebAppLoginPage(driver);
                debugger;
                await webAppLoginPage.logout_Web18();
                driver.sleep(2500);
                await webAppLoginPage.longLoginForBuyer(buyerEmailStage, buyerPassStage);
                driver.sleep(2500);
                await webAppHomePage.reSyncApp();
                driver.sleep(1500);
                await driver.refresh();
                generalService.sleep(2000);
                const isHeaderPresentedCorrectlyAfterLoggingOutBuyer = await appHeaderService.UIValidateWeSeeAppHeader(
                    headerObject.Button[0].ButtonName,
                    headerObject.Menu[0].Name,
                );
                expect(isHeaderPresentedCorrectlyAfterLoggingOutBuyer).to.equal(true);
                await webAppLoginPage.logout_Web18();
            });
            it(`2. Data Cleansing After UI Was Created & Tested - Delete Header And Slug Before Trying To Push A Header Using Config API`, async function () {
                //1. slug
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const appHeaderService = new ApplicationHeader(driver);
                await appHeaderService.deleteAppHeaderSlug();
                //2. header
                //->
                const allHeaders = await generalService.fetchStatus(
                    '/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=9bc8af38-dd67-4d33-beb0-7d6b39a6e98d&name=AppHeaderConfiguration&scheme=drafts',
                    {
                        method: 'GET',
                    },
                );
                expect(allHeaders.Ok).to.equal(true);
                expect(allHeaders.Status).to.equal(200);
                console.log('there are: ' + allHeaders.Body.length + ' headers to delete');
                for (let index = 0; index < allHeaders.Body.length; index++) {
                    const header = allHeaders.Body[index];
                    const bodyToDelete = {
                        Hidden: true,
                        Key: header.Key,
                    };
                    const deleteResponse = await generalService.fetchStatus(
                        '/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=9bc8af38-dd67-4d33-beb0-7d6b39a6e98d&name=AppHeaderConfiguration&scheme=drafts',
                        {
                            method: 'POST',
                            body: JSON.stringify(bodyToDelete),
                        },
                    );
                    expect(deleteResponse.Ok).to.equal(true);
                    expect(deleteResponse.Status).to.equal(200);
                    expect(deleteResponse.Body.Hidden).to.equal(true);
                    expect(deleteResponse.Body.Key).to.equal(header.Key);
                    console.log(
                        header.Name +
                            'was deleted, ' +
                            ((allHeaders.Body.length - (index + 1)) as number) +
                            ' headers left',
                    );
                }
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
                await webAppHomePage.reSyncApp();
                await driver.refresh();
                generalService.sleep(2000);
                const isHeaderPresentedCorrectlyAfterLoggingOut = await appHeaderService.UIValidateWeSeeAppHeader(
                    headerObject.Button[0].ButtonName,
                    headerObject.Menu[0].Name,
                );
                expect(isHeaderPresentedCorrectlyAfterLoggingOut).to.equal(false);
            });
            it(`3. Integration Test: Push Data To Configurations Which Is Our Source Addon And See It Changes The UI - Admin And Buyer`, async function () {
                //1. push to config and see data is updating in UI
                const configResponseDraft = await generalService.fetchStatus(
                    '/addons/configurations/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/AppHeaderConfiguration/drafts',
                    {
                        method: 'POST',
                        body: JSON.stringify(APP_HEADER_OBJECT_FROM_CONFIG),
                    },
                );
                expect(configResponseDraft.Ok).to.equal(true);
                expect(configResponseDraft.Status).to.equal(200);
                expect(configResponseDraft.Body.Key).to.equal(APP_HEADER_OBJECT_FROM_CONFIG.Key);
                expect(configResponseDraft.Body.Data).to.deep.equal(APP_HEADER_OBJECT_FROM_CONFIG.Data);
                const configResponsePublish = await generalService.fetchStatus(
                    `/addons/configurations/9bc8af38-dd67-4d33-beb0-7d6b39a6e98d/AppHeaderConfiguration/drafts/key/${configResponseDraft.Body.Key}/publish`,
                    {
                        method: 'POST',
                        body: JSON.stringify({}),
                    },
                );
                expect(configResponsePublish.Ok).to.equal(true);
                expect(configResponsePublish.Status).to.equal(200);
                expect(configResponsePublish.Body.VersionKey).to.not.be.undefined;
                generalService.sleep(3500);
                const appHeaderService = new ApplicationHeader(driver);
                await appHeaderService.mapASlugToAppHeader(email, password, generalService, appHeaderUUID);
                const e2eUiService = new E2EUtils(driver);
                await e2eUiService.logOutLogIn_Web18(email, password);
                const isHeaderPresentedCorrectlyAfterLoggingOut = await appHeaderService.UIValidateWeSeeAppHeader(
                    headerObject.Button[0].ButtonName,
                    headerObject.Menu[0].Name,
                );
                expect(isHeaderPresentedCorrectlyAfterLoggingOut).to.equal(true);
            });
            it(`4. Data Cleansing After UI Was Created - To Nullify The Header`, async function () {
                //1. scripts
                const allScripts = await generalService.fetchStatus(
                    '/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                    {
                        method: 'GET',
                    },
                );
                expect(allScripts.Ok).to.equal(true);
                expect(allScripts.Status).to.equal(200);
                for (let index = 0; index < allScripts.Body.length; index++) {
                    const script = allScripts.Body[index];
                    const bodyToDeleteScript = { Keys: [`${script.Key}`] };
                    const deleteScriptResponse = await generalService.fetchStatus(
                        `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
                        {
                            method: 'POST',
                            body: JSON.stringify(bodyToDeleteScript),
                        },
                    );
                    expect(deleteScriptResponse.Ok).to.equal(true);
                    expect(deleteScriptResponse.Status).to.equal(200);
                    expect(deleteScriptResponse.Body[0].Key).to.equal(script.Key);
                }
                //2. flow
                // const flowService = new FlowService(driver);
                // const flowResponse = await flowService.getAllFlowsViaAPI(generalService);
                // const allFlows = flowResponse.Body;
                // console.log(`There Are: ${allFlows.length} Flows`);
                // for (let index = 0; index < allFlows.length; index++) {
                //     const flow = allFlows[index];
                //     const hideResponse = await flowService.hideFlowViaAPI(generalService, flow.Key);
                //     expect(hideResponse.Ok).to.equal(true);
                //     expect(hideResponse.Status).to.equal(200);
                //     expect(hideResponse.Body.Key).to.equal(flow.Key);
                //     expect(hideResponse.Body.Hidden).to.equal(true);
                //     const flowResponse_ = await flowService.getAllFlowsViaAPI(generalService);
                //     const allFlows_ = flowResponse_.Body;
                //     console.log(`${flow.Key} Is Deleted, There Are: ${allFlows_.length} Flows Left`);
                // }
                //3. slug
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const appHeaderService = new ApplicationHeader(driver);
                await appHeaderService.deleteAppHeaderSlug();
                //4. header
                //->
                const allHeaders = await generalService.fetchStatus(
                    '/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=9bc8af38-dd67-4d33-beb0-7d6b39a6e98d&name=AppHeaderConfiguration&scheme=drafts',
                    {
                        method: 'GET',
                    },
                );
                expect(allHeaders.Ok).to.equal(true);
                expect(allHeaders.Status).to.equal(200);
                console.log('there are: ' + allHeaders.Body.length + ' headers to delete');
                for (let index = 0; index < allHeaders.Body.length; index++) {
                    const header = allHeaders.Body[index];
                    const bodyToDelete = {
                        Hidden: true,
                        Key: header.Key,
                    };
                    const deleteResponse = await generalService.fetchStatus(
                        '/addons/api/84c999c3-84b7-454e-9a86-71b7abc96554/api/objects?addonUUID=9bc8af38-dd67-4d33-beb0-7d6b39a6e98d&name=AppHeaderConfiguration&scheme=drafts',
                        {
                            method: 'POST',
                            body: JSON.stringify(bodyToDelete),
                        },
                    );
                    expect(deleteResponse.Ok).to.equal(true);
                    expect(deleteResponse.Status).to.equal(200);
                    expect(deleteResponse.Body.Hidden).to.equal(true);
                    expect(deleteResponse.Body.Key).to.equal(header.Key);
                    console.log(
                        header.Name +
                            'was deleted, ' +
                            ((allHeaders.Body.length - (index + 1)) as number) +
                            ' headers left',
                    );
                }
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
                await webAppHomePage.reSyncApp();
                await driver.refresh();
            });
        });
    });
}
