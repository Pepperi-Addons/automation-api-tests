import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Flow, FlowBuilderFilter, FlowParam, FlowService, FlowStep } from '../pom/addons/flow.service';
import { ScriptEditor } from '../pom/addons/ScriptPicker';
import jwt_decode from 'jwt-decode';

chai.use(promised);

export async function FlowTests(email: string, password: string, client: Client, varPass) {
    let driver: Browser;
    let flowService: FlowService;
    const generalService = new GeneralService(client);
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = varPass.body.varKeyStage;
    } else {
        varKey = varPass.body.varKeyPro;
    }
    const parsedToken = jwt_decode(generalService.papiClient['options'].token);
    const userName = parsedToken.email;

    let firstScriptUUID = '';
    let secondScriptUUID = '';
    const firstScriptParam = { name: 'first', desc: 'test', type: 'String' };
    const firstStepScript = {
        actualScript: `export async function main(data){return data.first;}`,
        scriptName: 'firstScriptForFlowStep',
        scriptDesc: 'forFlow',
        params: firstScriptParam,
    };
    const secondScriptParam = { name: 'second', desc: 'test', type: 'String' };
    const secondStepScript = {
        actualScript: `export async function main(data){return data.second + "XXX";}`,
        scriptName: 'secondScriptForFlowStep',
        scriptDesc: 'forFlow',
        params: secondScriptParam,
    };
    const newFlowName = 'test_flow_' + generalService.generateRandomString(5);
    const newFlowParams: FlowParam[] = [
        {
            DefaultValue: 'evgenyos',
            Type: 'String',
            Description: 'evgeny_test_desc',
            Internal: false,
            Name: 'test',
        },
        {
            DefaultValue: '10',
            Type: 'Integer',
            Description: 'for Disabaling',
            Internal: false,
            Name: 'number',
        },
    ];
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
                    ScriptData: {
                        first: {
                            Source: 'dynamic',
                            Value: 'test',
                        },
                    },
                    ScriptKey: '',
                },
            },
            Name: 'Step1',
        },
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
                    ScriptData: {
                        second: {
                            Source: 'dynamic',
                            Value: 'test',
                        },
                    },
                    ScriptKey: '',
                },
            },
            Name: 'Step2',
        },
    ];
    const positiveFlow: Flow = {
        Params: newFlowParams,
        Description: 'testing Description',
        Hidden: false,
        Steps: newFlowSteps,
        Name: newFlowName,
    };

    const ifFilter: FlowBuilderFilter = {
        paramName: newFlowParams[1].Name,
        Operation: 'Less than',
        Value: 10,
    };
    const expectedResult = 'evgenyosXXX';
    await generalService.baseAddonVersionsInstallationNewSync(varKey);
    // #region Upgrade survey dependencies

    const testData = {
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'user-defined-flows': ['dc8c5ca7-3fcc-4285-b790-349c7f3908bd', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Flow Builder Tests Suit', async function () {
        describe('Prerequisites Addons for Flows Builder Tests', () => {
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

        describe('Flow Builder E2E Addon Tests', () => {
            this.retries(0);
            let flowKey;
            let stepsResponse;
            let duplicatedFlow;
            before(async function () {
                driver = await Browser.initiateChrome();
                flowService = new FlowService(driver);
            });

            after(async function () {
                await driver.close();
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it('1. Create Two Scripts To Use As Flow Steps', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const scriptEditor = new ScriptEditor(driver);
                firstScriptUUID = await scriptEditor.configureScript(
                    firstStepScript.actualScript,
                    firstStepScript.scriptName,
                    firstStepScript.scriptDesc,
                    [firstStepScript.params],
                    generalService,
                );
                newFlowSteps[0].Configuration.runScriptData.ScriptKey = firstScriptUUID;
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
                secondScriptUUID = await scriptEditor.configureScript(
                    secondStepScript.actualScript,
                    secondStepScript.scriptName,
                    secondStepScript.scriptDesc,
                    [secondStepScript.params],
                    generalService,
                );
                newFlowSteps[1].Configuration.runScriptData.ScriptKey = secondScriptUUID;
                await webAppHomePage.returnToHomePage();
            });
            it('2. Enter Flows Main Page, Validate Everything Is Shown, Create Flow', async function () {
                //enter flows from settings
                const isFlowBuilderMainPageShown = await flowService.enterFlowBuilderSettingsPage();
                expect(isFlowBuilderMainPageShown).to.equal(true);
                //add flow modal
                const isAddFlowModalOpened = await flowService.openAddFlowPage();
                expect(isAddFlowModalOpened).to.equal(true);
                const [isIternalPageOfFlowShown, flowKey_] = await flowService.enterNewFlowPage(positiveFlow);
                flowKey = flowKey_;
                expect(isIternalPageOfFlowShown).to.equal(true);
                expect(flowKey).to.be.a.string;
                expect(flowKey.length).to.equal(36);
                const isGeneralDataShownCorrectly = await flowService.enterGeneralTabAndSeeValues(positiveFlow);
                expect(isGeneralDataShownCorrectly).to.equal(true);
            });
            it('3. Add Parameter To The Flow', async function () {
                //2. add parameters by given flow
                const isParamTabShown = await flowService.enterParamTab();
                expect(isParamTabShown).to.equal(true);
                const [isModalShownCorrectly, saveButtonDisability, areValuesSimilar] = await flowService.addParam(
                    positiveFlow,
                );
                expect(isModalShownCorrectly).to.equal(true);
                expect(saveButtonDisability).to.equal('true');
                expect(areValuesSimilar).to.equal(true);
                const isFlowPagePresentedAfterSaving = await flowService.saveFlow();
                expect(isFlowPagePresentedAfterSaving).to.equal(true);
            });
            it('4. Add Steps Using API And Validate By UI All Is Shown', async function () {
                //->add steps via API
                stepsResponse = await flowService.addStepViaAPI(
                    generalService,
                    flowKey,
                    positiveFlow.Name,
                    newFlowSteps,
                );
                expect(stepsResponse.Ok).to.equal(true);
                expect(stepsResponse.Status).to.equal(200);
                const stepsObjectFromAPI = stepsResponse.Body.Steps;
                for (let index = 0; index < stepsObjectFromAPI.length; index++) {
                    const stepFromAPI = stepsObjectFromAPI[index];
                    const stepInput = newFlowSteps[index];
                    expect(stepFromAPI.Type).to.equal(stepInput.Type);
                    expect(stepFromAPI.Name).to.equal(stepInput.Name);
                    expect(stepFromAPI.Disabled).to.equal(stepInput.Disabled);
                    expect(stepFromAPI.Relation).to.deep.equal(stepInput.Relation);
                    expect(stepFromAPI.Configuration).to.deep.equal(stepInput.Configuration);
                }
                driver.sleep(10000); //wait for eveything to sync or whatever
                //-> enter flow
                await flowService.enterFlowBySearchingName(positiveFlow.Name);
                //->validate all steps are there with correct names
                for (let index = 0; index < newFlowSteps.length; index++) {
                    const step = newFlowSteps[index];
                    const isCreatedSecsefully = await flowService.validateStepCreatedByApi(step.Name, index + 1);
                    expect(isCreatedSecsefully).to.equal(true);
                }
                //-> validate the script inside the step and its params
                for (let index = 0; index < newFlowSteps.length; index++) {
                    const step = newFlowSteps[index];
                    const isCreatedSuccessfully = await flowService.validateStepScript(index + 1, step, generalService);
                    expect(isCreatedSuccessfully).to.equal(true);
                    await flowService.closeScriptModal();
                }
                //->save
                await flowService.saveFlow();
            });
            it('5. Get All Flows By API And See We Got Only One Which Is Setup Correctly', async function () {
                //->get flow via api
                const newFlow = await flowService.getFlowByKeyViaAPI(generalService, flowKey);
                //->validate flow from api
                expect(newFlow.Ok).to.be.true;
                expect(newFlow.Status).to.equal(200);
                expect(newFlow.Body.Description).to.equal(positiveFlow.Description);
                expect(newFlow.Body.Hidden).to.equal(false);
                expect(newFlow.Body.Key).to.equal(flowKey);
                expect(newFlow.Body.Name).to.equal(positiveFlow.Name);
                expect(newFlow.Body.Params).to.deep.equal(positiveFlow.Params);
                expect(newFlow.Body.Steps).to.deep.equal(positiveFlow.Steps);
            });
            it('6. Run Flow And See Result', async function () {
                debugger;
                const isRunFlowPresentedCorrectly = await flowService.getToRunPageOfFlowByKeyUsingNav(
                    flowKey,
                    positiveFlow,
                );
                expect(isRunFlowPresentedCorrectly).to.equal(true);
                await flowService.runFlow();
                const runDParamShown = await flowService.validateRunParam();
                expect(runDParamShown).to.equal('evgenyos');
                const runDataShown = await flowService.validateRunData();
                expect(runDataShown).to.equal('FlowKey:' + flowKey);
                const returnedValue = await flowService.validateRunResult(expectedResult);
                expect(returnedValue).to.equal(expectedResult);
                await flowService.backToList();
            });
            it('7. Enter Flows Logs And See Everything Was Recoreded', async function () {
                //enter Logs For The Same Flow
                const isLogsPagePresentedCorrectly = await flowService.getToLogsPageOfFlowByKeyUsingNav(
                    flowKey,
                    positiveFlow,
                );
                expect(isLogsPagePresentedCorrectly).to.equal(true);
                driver.sleep(1000 * 60 * 5); //wait 5 minutes for the logs to load
                await flowService.refreshLogs(); //refresh logs by pressing button
                const logsDataPresented = await flowService.validateLogs();
                expect(logsDataPresented.number).to.equal(6);
                for (let index = 0; index < Object.values(logsDataPresented.mails).length; index++) {
                    const mail = Object.values(logsDataPresented.mails)[index];
                    expect(mail).to.equal(userName);
                }
                for (let index = 0; index < Object.values(logsDataPresented.levels).length; index++) {
                    const level = Object.values(logsDataPresented.levels)[index];
                    expect(level).to.equal('INFO');
                }
                for (let index = 0; index < Object.values(logsDataPresented.dates).length; index++) {
                    const date = Object.values(logsDataPresented.dates)[index];
                    const today = new Date();
                    const todaysDateUsFormat = today.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    expect(date).to.include(todaysDateUsFormat);
                }
                await flowService.backToList();
            });
            it('8. Duplicate The Flow - Run The Copy - See Everything Was Created Correctly', async function () {
                const duplicateResponse = await flowService.duplicateFlowByKeyUsingAPI(
                    generalService,
                    flowKey,
                    positiveFlow,
                );
                expect(duplicateResponse.Status).to.equal(200);
                expect(duplicateResponse.Ok).to.equal(true);
                await driver.refresh();
                driver.sleep(6000);
                duplicatedFlow = {
                    Key: duplicateResponse.Body.Key,
                    Name: positiveFlow.Name + '_copy',
                    Params: positiveFlow.Params,
                    Steps: positiveFlow.Steps,
                    Hidden: false,
                };
                await flowService.searchFlowByName(duplicatedFlow.Name);
                const isRunFlowPresentedCorrectlyCopyFlow = await flowService.getToRunPageOfFlowByKeyUsingNav(
                    duplicatedFlow.Key,
                    duplicatedFlow,
                );
                expect(isRunFlowPresentedCorrectlyCopyFlow).to.equal(true);
                await flowService.runFlow();
                const runParamShownCopyFlow = await flowService.validateRunParam();
                expect(runParamShownCopyFlow).to.equal('evgenyos');
                const returnedValueCopyFlow = await flowService.validateRunResult(expectedResult);
                expect(returnedValueCopyFlow).to.equal(expectedResult);
                await flowService.backToList();
            });
            it('9. Dissable All Steps On Flow And Run Once Again', async function () {
                const flowService = new FlowService(driver);
                await flowService.enterFlowBySearchingName(duplicatedFlow.Name);
                for (let index = 0; index < newFlowSteps.length; index++) {
                    await flowService.disableStep(index + 1);
                }
                await flowService.saveFlow();
                const isRunFlowPresentedCorrectlyCopyFlow = await flowService.getToRunPageOfFlowByKeyUsingNav(
                    duplicatedFlow.Key,
                    duplicatedFlow,
                );
                expect(isRunFlowPresentedCorrectlyCopyFlow).to.equal(true);
                await flowService.runFlow();
                const returnedValue = await flowService.validateRunResultStepsAreDisabled();
                expect(returnedValue).to.include(`finished running flow ${duplicatedFlow.Name}, result is {}. `);
                await flowService.backToList();
            });
            it(`10. Configure 'Disable If' On The Copied Flow: Run When Condition Is False - See It Works, Run When Condition True - See It Doesn't Run`, async function () {
                await flowService.enterFlowBySearchingName(duplicatedFlow.Name); //
                for (let index = 0; index < newFlowSteps.length; index++) {
                    await flowService.disableStepIf(index + 1, ifFilter);
                }
                await flowService.saveFlow();
                const isRunFlowPresentedCorrectlyCopyFlow = await flowService.getToRunPageOfFlowByKeyUsingNav(
                    duplicatedFlow.Key,
                    duplicatedFlow,
                );
                //add the flow of changing the param
                expect(isRunFlowPresentedCorrectlyCopyFlow).to.equal(true);
                await flowService.runFlow();
                const runParamShownCopyFlow = await flowService.validateRunParam();
                expect(runParamShownCopyFlow).to.equal('evgenyos');
                await flowService.setParamValueInsideRunPage(ifFilter.paramName, 5);
                await flowService.runFlow();
                const returnedValue = await flowService.validateRunResultStepsAreDisabled();
                expect(returnedValue).to.include(`finished running flow ${duplicatedFlow.Name}, result is {}. `);
                await flowService.backToList();
            });
            it('10. Delete The Copy - See It Dosnet Show In The List, Call API See It Was Deleted', async function () {
                //3. delete the duplicate using pencil menu - see only the first one is left
                await flowService.searchFlowByName(duplicatedFlow.Name);
                const deleteResponse = await flowService.deleteFlowByKeyUsingAPI(generalService, duplicatedFlow.Key);
                expect(deleteResponse.Status).to.equal(200);
                expect(deleteResponse.Ok).to.equal(true);
                expect(deleteResponse.Body.Key).to.equal(duplicatedFlow.Key);
                expect(deleteResponse.Body.Hidden).to.equal(true);
                await driver.refresh();
                driver.sleep(6000);
                const allFlowInMainList = await flowService.getAllFlowsFromMainList();
                expect(allFlowInMainList.length).to.equal(1);
                //->Get all flow by API - see only the original is left
                const flowResponse = await flowService.getAllFlowsViaAPI(generalService);
                const allFlows = flowResponse.Body;
                expect(allFlows.length).to.equal(1);
            });
            it('Data Cleansing: 1. Scripts', async function () {
                //delete the script
                let bodyForSctips = { Keys: [`${firstScriptUUID}`] };
                let deleteScriptResponse = await generalService.fetchStatus(
                    `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(bodyForSctips),
                    },
                );
                expect(deleteScriptResponse.Ok).to.equal(true);
                expect(deleteScriptResponse.Status).to.equal(200);
                expect(deleteScriptResponse.Body[0].Key).to.equal(firstScriptUUID);
                bodyForSctips = { Keys: [`${secondScriptUUID}`] };
                deleteScriptResponse = await generalService.fetchStatus(
                    `/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/delete_scripts`,
                    {
                        method: 'POST',
                        body: JSON.stringify(bodyForSctips),
                    },
                );
                expect(deleteScriptResponse.Ok).to.equal(true);
                expect(deleteScriptResponse.Status).to.equal(200);
                expect(deleteScriptResponse.Body[0].Key).to.equal(secondScriptUUID);
            });
            it('Data Cleansing: 2. Flows', async function () {
                //delete the script
                const flowResponse = await flowService.getAllFlowsViaAPI(generalService);
                const allFlows = flowResponse.Body;
                console.log(`There Are: ${allFlows.length} Flows`);
                for (let index = 0; index < allFlows.length; index++) {
                    const flow = allFlows[index];
                    const hideResponse = await flowService.hideFlowViaAPI(generalService, flow.Key);
                    expect(hideResponse.Ok).to.equal(true);
                    expect(hideResponse.Status).to.equal(200);
                    expect(hideResponse.Body.Key).to.equal(flow.Key);
                    expect(hideResponse.Body.Hidden).to.equal(true);
                    const flowResponse_ = await flowService.getAllFlowsViaAPI(generalService);
                    const allFlows_ = flowResponse_.Body;
                    console.log(`${flow.Key} Is Deleted, There Are: ${allFlows_.length} Flows Left`);
                }
            });
        });
    });
}
