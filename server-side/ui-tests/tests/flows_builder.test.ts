// import { Browser } from '../utilities/browser';
// import { describe, it, afterEach, before, after } from 'mocha';
// import chai, { expect } from 'chai';
// import promised from 'chai-as-promised';
// import { WebAppHomePage, WebAppLoginPage } from '../pom';
// import GeneralService from '../../services/general.service';
// import { Client } from '@pepperi-addons/debug-server/dist';
// import { Flow, FlowParam, FlowService, FlowStep } from '../pom/addons/flow.service';
// import { ScriptEditor } from '../pom/addons/ScriptPicker';

// chai.use(promised);

// export async function FlowTests(email: string, password: string, client: Client, varPass) {
//     const generalService = new GeneralService(client);
//     let driver: Browser;
//     let firstScriptUUID = '';
//     let secondScriptUUID = '';
//     const firstScriptParam = { name: 'first', desc: 'test', type: 'String' };
//     const firstStepScript = {
//         actualScript: `export async function main(data){return data.first;}`,
//         scriptName: 'firstScriptForFlowStep',
//         scriptDesc: 'forFlow',
//         params: firstScriptParam,
//     };
//     const secondScriptParam = { name: 'second', desc: 'test', type: 'String' };
//     const secondStepScript = {
//         actualScript: `export async function main(data){return data.second + "XXX";}`,
//         scriptName: 'secondScriptForFlowStep',
//         scriptDesc: 'forFlow',
//         params: secondScriptParam,
//     };

//     const emptyStep: any[] = [
//         {
//             Configuration: {},
//             Type: 'LogicBlock',
//             Relation: {
//                 ExecutionURL: '/addon-cpi/run_logic_block_script',
//                 AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
//                 Name: 'UserScriptsBlock',
//             },
//             Disabled: false,
//             Name: 'Test_Step',
//         },
//     ];
//     const newFlowName = 'test_api_pos' + generalService.generateRandomString(5);
//     const newFlowParams: FlowParam[] = [
//         {
//             DefaultValue: 'evgenyos',
//             Type: 'String',
//             Description: 'evgeny_test_desc',
//             Internal: false,
//             Name: 'test',
//         },
//     ];
//     const newFlowSteps: FlowStep[] = [
//         {
//             Type: 'LogicBlock',
//             Relation: {
//                 ExecutionURL: '/addon-cpi/run_logic_block_script',
//                 AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
//                 Name: 'UserScriptsBlock',
//             },
//             Disabled: false,
//             Configuration: {
//                 runScriptData: {
//                     ScriptData: {},
//                     ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
//                 },
//             },
//             Name: 'Step',
//         },
//     ];
//     const positiveFlow: Flow = {
//         Params: newFlowParams,
//         Description: 'aaaaaaaaaaaaaa',
//         Hidden: false,
//         Steps: newFlowSteps,
//         Name: newFlowName,
//     };
//     // await generalService.baseAddonVersionsInstallation(varPass);
//     // #region Upgrade survey dependencies

//     const testData = {};

//     const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
//     const isInstalledArr = await generalService.areAddonsInstalled(testData);

//     // #endregion Upgrade survey dependencies

//     describe('Survey Builder Tests Suit', async function () {
//         describe('Prerequisites Addons for Survey Builder Tests', () => {
//             //Test Data
//             isInstalledArr.forEach((isInstalled, index) => {
//                 it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
//                     expect(isInstalled).to.be.true;
//                 });
//             });
//             for (const addonName in testData) {
//                 const addonUUID = testData[addonName][0];
//                 const version = testData[addonName][1];
//                 const varLatestVersion = chnageVersionResponseArr[addonName][2];
//                 const changeType = chnageVersionResponseArr[addonName][3];
//                 describe(`Test Data: ${addonName}`, () => {
//                     it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
//                         if (chnageVersionResponseArr[addonName][4] == 'Failure') {
//                             expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
//                         } else {
//                             expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
//                         }
//                     });
//                     it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
//                         await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
//                             .eventually.to.have.property('Version')
//                             .a('string')
//                             .that.is.equal(varLatestVersion);
//                     });
//                 });
//             }
//         });

//         describe('Configuring Survey', () => {
//             this.retries(0);

//             before(async function () {
//                 driver = await Browser.initiateChrome();
//             });

//             after(async function () {
//                 await driver.quit();
//             });

//             afterEach(async function () {
//                 const webAppHomePage = new WebAppHomePage(driver);
//                 await webAppHomePage.collectEndTestData2(this);
//             });
//             it('1. Create Two Scripts To Use As Flow Steps', async function () {
//                 const webAppLoginPage = new WebAppLoginPage(driver);
//                 await webAppLoginPage.login(email, password);
//                 const scriptEditor = new ScriptEditor(driver);
//                 firstScriptUUID = await scriptEditor.configureScript(
//                     firstStepScript.actualScript,
//                     firstStepScript.scriptName,
//                     firstStepScript.scriptDesc,
//                     [firstStepScript.params],
//                     generalService,
//                 );
//                 const webAppHomePage = new WebAppHomePage(driver);
//                 await webAppHomePage.returnToHomePage();
//                 secondScriptUUID = await scriptEditor.configureScript(
//                     secondStepScript.actualScript,
//                     secondStepScript.scriptName,
//                     secondStepScript.scriptDesc,
//                     [secondStepScript.params],
//                     generalService,
//                 );
//                 await webAppHomePage.returnToHomePage();
//             });
//             it(`Create Flow Using UI - Call It From Api And See Everything Is Correct`, async function () {
//                 const flowService = new FlowService(driver);
//                 //enter flows from settings
//                 const isFlowBuilderMainPageShown = await flowService.enterFlowBuilderSettingsPage();
//                 expect(isFlowBuilderMainPageShown).to.equal(true);
//                 //add flow modal
//                 const isAddFlowModalOpened = await flowService.openAddFlowPage();
//                 expect(isAddFlowModalOpened).to.equal(true);
//                 const [isIternalPageOfFlowShown, flowKey] = await flowService.enterNewFlowPage(positiveFlow);
//                 expect(isIternalPageOfFlowShown).to.equal(true);
//                 expect(flowKey).to.be.a.string;
//                 expect(flowKey.length).to.equal(36);
//                 //1. inside flow: validate name + Description in General Tab
//                 const isGeneralDataShownCorrectly = await flowService.enterGeneralTabAndSeeValues(positiveFlow);
//                 expect(isGeneralDataShownCorrectly).to.equal(true);
//                 //2. add parameters by given flow
//                 const isParamTabShown = await flowService.enterParamTab();
//                 expect(isParamTabShown).to.equal(true);
//                 const [isModalShownCorrectly, saveButtonDisability, areValuesSimilar] = await flowService.addParam(
//                     positiveFlow,
//                 );
//                 expect(isModalShownCorrectly).to.equal(true);
//                 expect(saveButtonDisability).to.equal('true');
//                 expect(areValuesSimilar).to.equal(true);
//                 const isFlowPagePresentedAfterSaving = await flowService.saveFlow();
//                 expect(isFlowPagePresentedAfterSaving).to.equal(true);
//                 //add param via API
//                 const stepsResponse = await flowService.addStepsViaAPI(
//                     generalService,
//                     flowKey,
//                     positiveFlow.Name,
//                     emptyStep,
//                 );
//                 //test everything is good from server
//                 expect(stepsResponse.Ok).to.equal(true);
//                 expect(stepsResponse.Status).to.equal(200);
//                 expect(stepsResponse.Body.Description).to.equal(positiveFlow.Description);
//                 expect(stepsResponse.Body.Hidden).to.equal(false);
//                 expect(stepsResponse.Body.Key).to.equal(flowKey);
//                 expect(stepsResponse.Body.Name).to.equal(positiveFlow.Name);
//                 expect(stepsResponse.Body.Params).to.deep.equal(positiveFlow.Params);
//                 expect(stepsResponse.Body.Steps.length).to.equal(1);
//                 expect(stepsResponse.Body.Steps[0]).to.deep.equal(emptyStep[0]);
//                 debugger;
//                 //- search for flow in search input
//                 await flowService.enterFlowBySearchingName(positiveFlow.Name);
//                 debugger;
//                 //3. add steps by given flow
//                 //3.1. validate first step has all correct data
//                 const isCreatedSecsefully = await flowService.validateStepCreatedByApi(emptyStep[0].Name, 1);
//                 expect(isCreatedSecsefully).to.equal(true);
//                 //3.2. duplicate it - validate it happened
//                 //3.3. add first and secnod scripts
//                 //4. save everything
//                 //5. call API to see everything is similar
//                 //other it: -> run "test" and validate
//                 //other it: -> run "log" and validate
//             });
//             it('Data Cleansing: 1. script', async function () {
//                 //delete the script
//                 let bodyForSctips = { Keys: [`${firstScriptUUID}`] };
//                 let deleteScriptResponse = await generalService.fetchStatus(
//                     `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
//                     {
//                         method: 'POST',
//                         body: JSON.stringify(bodyForSctips),
//                     },
//                 );
//                 expect(deleteScriptResponse.Ok).to.equal(true);
//                 expect(deleteScriptResponse.Status).to.equal(200);
//                 expect(deleteScriptResponse.Body[0].Key).to.equal(firstScriptUUID);
//                 bodyForSctips = { Keys: [`${secondScriptUUID}`] };
//                 deleteScriptResponse = await generalService.fetchStatus(
//                     `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
//                     {
//                         method: 'POST',
//                         body: JSON.stringify(bodyForSctips),
//                     },
//                 );
//                 expect(deleteScriptResponse.Ok).to.equal(true);
//                 expect(deleteScriptResponse.Status).to.equal(200);
//                 expect(deleteScriptResponse.Body[0].Key).to.equal(secondScriptUUID);
//             });
//             it('Data Cleansing: 2. flows', async function () {
//                 //delete the script
//                 const flowService = new FlowService(driver);
//                 const flowResponse = await flowService.getAllFlowsViaAPI(generalService);
//                 const allFlows = flowResponse.Body;
//                 console.log(`There Are: ${allFlows.length} Flows`);
//                 for (let index = 0; index < allFlows.length; index++) {
//                     const flow = allFlows[index];
//                     const hideResponse = await flowService.hideFlowViaAPI(generalService, flow.Key);
//                     expect(hideResponse.Ok).to.equal(true);
//                     expect(hideResponse.Status).to.equal(200);
//                     expect(hideResponse.Body.Key).to.equal(flow.Key);
//                     expect(hideResponse.Body.Hidden).to.equal(true);
//                     const flowResponse_ = await flowService.getAllFlowsViaAPI(generalService);
//                     const allFlows_ = flowResponse_.Body;
//                     console.log(`${flow.Key} Is Deleted, There Are: ${allFlows_.length} Flows Left`);
//                 }
//             });
//         });
//     });
// }
