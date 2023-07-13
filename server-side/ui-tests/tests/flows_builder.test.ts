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
//     const firstStepScript = `export async function main(data)  {
//         return data.first;
//     }`;
//     const firstScriptParam = { Name: 'first', Type: 'String' };
//     const secondStepScript = `export async function main(data)  {
//         return data.second + "XXX";
//     }`;
//     const secondScriptParam = { Name: 'second', Type: 'String' };
//     let driver: Browser;
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
//                 await webAppHomePage.collectEndTestData(this);
//             });
//             it('1. Create Two Scripts To Use As Flow Steps', async function () {
//                 const webAppLoginPage = new WebAppLoginPage(driver);
//                 await webAppLoginPage.login(email, password);
//                 const scriptEditor = new ScriptEditor(driver);
//                 const firstScriptUUID = await scriptEditor.configureScript(
//                     firstStepScript,
//                     'firstScriptForFlowStep',
//                     'forFlow',
//                     generalService,
//                 );
//                 const secondScriptUUID = await scriptEditor.configureScript(
//                     secondStepScript,
//                     'secondScriptForFlowStep',
//                     'forFlow',
//                     generalService,
//                 );
//                 debugger;
//             });
//             it(`Create Flow Using UI - Call It From Api And See Everything Is Correct`, async function () {
//                 const webAppLoginPage = new WebAppLoginPage(driver);
//                 await webAppLoginPage.login(email, password);
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
//                 //- search for flow in search input
//                 await flowService.enterFlowBySearchingName(positiveFlow.Name);
//                 debugger;
//                 //3. add steps by given flow

//                 //4. save everything
//                 //5. call API to see everything is similar
//             });
//         });
//     });
// }
