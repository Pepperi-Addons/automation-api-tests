import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage } from '../pom';
import GeneralService, { testDataNoSync } from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { AppHeaderObject, ApplicationHeader } from '../pom/addons/AppHeaderService';
import { createFlowUsingE2E } from './flows_builder.test';
import { Flow, FlowStep } from '../pom/addons/flow.service';
import { ConfigurationsService } from '../../services/configurations.service';

chai.use(promised);

export async function SyncE2ETester(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    let driver: Browser;
    const flowStepScript = {
        actualScript: `export async function main(data){return 'evgeny123';}`,
        scriptName: 'flowScriptForFlowStep',
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
        Menu: [{ FlowKey: '', Name: 'evgeny_test_menu', FlowName: '' }],
    };
    // #region Upgrade survey dependencies
    await generalService.baseAddonVersionsInstallation(varPass, testDataNoSync);
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.30.%'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        // sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '2.0.20'],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'Theme Editor': ['95501678-6687-4fb3-92ab-1155f47f839e', ''],
        'user-defined-flows': ['dc8c5ca7-3fcc-4285-b790-349c7f3908bd', ''],
        'application-header': ['9bc8af38-dd67-4d33-beb0-7d6b39a6e98d', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

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
            });
            it(`1. Basic UI Test: Using Admin Login To WebApp, Create A Basic Flow, Set App. Header To Show This Flow And Notifications Button Using Legacy Resources And See It Changes The Header On Admin And Buyer`, async function () {
                //1. login to webapp & create a flow
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
                //2. goto legacy settings - app. header - configure menu and buttons - menu is based on flow, button is based on notifications addon
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
                const appHeaderService = new ApplicationHeader(driver);
                const isAppHeaderPagePresented = await appHeaderService.enterApplicationHeaderPage();
                expect(isAppHeaderPagePresented).to.equal(true);
                const appHeaderUUID = await appHeaderService.addNewAppHeader(headerObject);
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
                //3. shortly validate
                const isMenuAndButtonAreCreated = await appHeaderService.validateMenuAndButtonsViaUI(headerObject);
                expect(isMenuAndButtonAreCreated).to.equal(true);
                //4. goto slugs and set Application_Header to use just created header
                await appHeaderService.mapASlugToAppHeader(email, password, generalService, appHeaderUUID);
                await webAppHomePage.reSyncApp();
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
                debugger;
            });
            it(`3. Data Aspect API Test: Check the Data Inside The ADAL Inside Chache And All This`, async function () {
                console.log('dsfsfds');
            });
        });
    });
}
