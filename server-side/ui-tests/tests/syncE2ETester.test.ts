import { Client } from '@pepperi-addons/debug-server/dist';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { after, afterEach, before, describe, it } from 'mocha';
import { ConfigurationsService } from '../../services/configurations.service';
import GeneralService, { testData as testDataBase } from '../../services/general.service';
import { WebAppHomePage } from '../pom';
import { AppHeaderObject, ApplicationHeader } from '../pom/addons/AppHeaderService';
import { Flow, FlowStep } from '../pom/addons/flow.service';
import { Browser } from '../utilities/browser';
import { createFlowUsingE2E } from './flows_builder.test';
import { OpenSyncService } from '../../services/open-sync.service';

chai.use(promised);

export async function SyncE2ETester(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    const flowStepScript = {
        actualScript: `export async function main(data){return 'evgeny123';}`,
        scriptName: generalService.generateRandomString(5) + '_fowFlow',
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
        Name: 'test_flow_' + generalService.generateRandomString(5),
    };

    const headerObject: AppHeaderObject = {
        Name: 'test_header_' + generalService.generateRandomString(5),
        Description: 'test',
        Button: [{ ButtonName: 'evgeny_test_button', ButtonKey: 'Notification' }],
        Menu: [{ FlowKey: '', Name: 'evgeny_test_menu', FlowName: '' }], //
    };
    // #region Upgrade open sync dependencies
    await generalService.baseAddonVersionsInstallation(varPass, testDataBase);
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], //cpi-node
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.30.%'], //cpas
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'], //cpapi
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //papi
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''], //pfs
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '2.0.%'],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], //webapp b2b
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], //udc
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', ''],
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
            it(`0. Pre-Test Step: Check That Sync Version Is Above 2`, async function () {
                const installedAddons = await generalService.getInstalledAddons();
                const syncVersion = installedAddons.find(
                    (addonObject) => addonObject.Addon.UUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a',
                )?.Version;
                const nebulaObject = installedAddons.find(
                    (addonObject) => addonObject.Addon.UUID === '00000000-0000-0000-0000-000000006a91',
                );
                expect(syncVersion).to.include('2.0');
                expect(nebulaObject).to.be.undefined;
                console.log(`Sync Version: ${syncVersion}, With NO Nebula!`);
                debugger;
            });
            it(`1. Basic UI Test: Using Admin Login To WebApp, Create A Basic Flow, Set App. Header To Show This Flow And Notifications Button Using Legacy Resources And See It Changes The Header On Admin And Buyer`, async function () {
                //1. login to webapp & create a flow
                debugger;
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
                const appHeaderService = new ApplicationHeader(driver);
                const isAppHeaderPagePresented = await appHeaderService.enterApplicationHeaderPage();
                expect(isAppHeaderPagePresented).to.equal(true);
                const appHeaderUUID = await appHeaderService.addNewAppHeader(headerObject);
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
                const headerCreationRespone = await appHeaderService.configureMenuAndButtonViaAPI(
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
                //7. shortly validate - using UI
                const isMenuAndButtonAreCreated = await appHeaderService.validateMenuAndButtonsViaUI(headerObject);
                expect(isMenuAndButtonAreCreated).to.equal(true);
                //* check open sync object got this published header + cpi data schemes
                const openSyncService = new OpenSyncService(generalService);
                const sources = [
                    { AddonUUID: '84c999c3-84b7-454e-9a86-71b7abc96554', LastSyncDateTime: '1970-02-18T08:48:44.880Z' },
                ];
                const openSyncResponse = await openSyncService.getSyncedConfigurationObjectBasedOnResource(
                    sources,
                    '1970-11-23T14:39:50.781Z',
                );
                const filteredForSyncedConfigObject = openSyncResponse.Body.Resources.Data.filter((data) =>
                    data.Schema.Name.includes('synced_configuration_objects'),
                );
                const spesificHeaderWeJustCreated = filteredForSyncedConfigObject.Objects.filter(
                    (obj) => obj.Key === appHeaderUUID,
                );
                debugger;
                expect(spesificHeaderWeJustCreated.length).to.be.above(0); //to equal one?
                //ConfigurationSchemeName - > AppHeaderConfiguration
                //AddonUUID -> '9bc8af38-dd67-4d33-beb0-7d6b39a6e98d'
                //Hidden -> false
                //Profile??
                //Version??
                //Data.Buttons
                //Data.Menu
                debugger;
                //8. goto slugs and set Application_Header to use just created header
                await appHeaderService.deleteAppHeaderSlug();
                await appHeaderService.mapASlugToAppHeader(email, password, generalService, appHeaderUUID);
                //9. re-sync
                await webAppHomePage.reSyncApp();
                debugger;
                //TODO: test that the button + menu are there on the header
                //TODO: logout from Admin - login to buyer - tests the header
                debugger;
            });
            it(`2. Integration Test: Push Data To Configurations Which Is Our Source Addon And See It Changes The UI - Admin And Buyer`, async function () {
                //1. get all schemes and validate
                const configService = new ConfigurationsService(generalService);
                const appHeaderUUID = '9bc8af38-dd67-4d33-beb0-7d6b39a6e98d';
                const configResponse = await configService.getSchemes();
                expect(configResponse.Ok).to.equal(true);
                expect(configResponse.Status).to.equal(200);
                expect(configResponse.Error).to.deep.equal({});
                expect(configResponse.Body).to.be.an('array');
                const configSchemes = configResponse.Body;
                const appHeaderConfigScheme = configSchemes.find((config) => config.AddonUUID === appHeaderUUID);
                expect(appHeaderConfigScheme.length).to.equal(1);
                debugger;
            });
            it(`3. Data Aspect API Test: Check the Data Inside The ADAL Inside Chache And All This`, async function () {
                console.log('dsfsfds');
            });
        });
    });
}
