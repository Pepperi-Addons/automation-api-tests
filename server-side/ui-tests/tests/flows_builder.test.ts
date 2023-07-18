import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Flow, FlowParam, FlowService, FlowStep } from '../pom/addons/flow.service';
import { ScriptEditor } from '../pom/addons/ScriptPicker';

chai.use(promised);

export async function FlowTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;
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
    // await generalService.baseAddonVersionsInstallation(varPass);
    // #region Upgrade survey dependencies

    // const testData = {};

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Survey Builder Tests Suit', async function () {
        // describe('Prerequisites Addons for Survey Builder Tests', () => {
        //     //Test Data
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
                await webAppHomePage.collectEndTestData2(this);
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
            it(`Create Flow Using UI - Call It From Api And See Everything Is Correct`, async function () {
                //TODO: split this it lol
                const flowService = new FlowService(driver);
                //enter flows from settings
                const isFlowBuilderMainPageShown = await flowService.enterFlowBuilderSettingsPage();
                expect(isFlowBuilderMainPageShown).to.equal(true);
                //add flow modal
                const isAddFlowModalOpened = await flowService.openAddFlowPage();
                expect(isAddFlowModalOpened).to.equal(true);
                const [isIternalPageOfFlowShown, flowKey] = await flowService.enterNewFlowPage(positiveFlow);
                expect(isIternalPageOfFlowShown).to.equal(true);
                expect(flowKey).to.be.a.string;
                expect(flowKey.length).to.equal(36);
                //1. inside flow: validate name + Description in General Tab
                const isGeneralDataShownCorrectly = await flowService.enterGeneralTabAndSeeValues(positiveFlow);
                expect(isGeneralDataShownCorrectly).to.equal(true);
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
                //->add steps via API
                const stepsResponse = await flowService.addStepViaAPI(
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
                //-> validate the script inside the stepand its params
                for (let index = 0; index < newFlowSteps.length; index++) {
                    const step = newFlowSteps[index];
                    const isCreatedSuccessfully = await flowService.validateStepScript(index + 1, step, generalService);
                    expect(isCreatedSuccessfully).to.equal(true);
                    await flowService.closeScriptModal();
                }
                //->save
                await flowService.saveFlow();
                //->get flow via api
                const newFlow = await flowService.getFlowByKeyViaAPI(generalService, flowKey);
                //->validate flow from api
                expect(newFlow.Ok).to.be.true;
                expect(newFlow.Status).to.equal(200);
                expect(stepsResponse.Body.Description).to.equal(positiveFlow.Description);
                expect(stepsResponse.Body.Hidden).to.equal(false);
                expect(stepsResponse.Body.Key).to.equal(flowKey);
                expect(stepsResponse.Body.Name).to.equal(positiveFlow.Name);
                expect(stepsResponse.Body.Params).to.deep.equal(positiveFlow.Params);
                expect(stepsResponse.Body.Steps).to.deep.equal(positiveFlow.Steps);
                //->run flow and see result
                const isRunFlowPresentedCorrectly = await flowService.enterRunFlowPageByIndex(1, positiveFlow);
                expect(isRunFlowPresentedCorrectly).to.equal(true);
                await flowService.runFlow();
                const returnedValue = await flowService.validateRunResult();
                expect(returnedValue).to.equal('evgenyosXXX');
                debugger;
                //->see logs (todo)
                // //add step via API
                // const stepsResponse = await flowService.addEmptyStepViaAPI(
                //     generalService,
                //     flowKey,
                //     positiveFlow.Name,
                //     emptyStep,
                // );
                // //test everything is good from server
                // expect(stepsResponse.Ok).to.equal(true);
                // expect(stepsResponse.Status).to.equal(200);
                // expect(stepsResponse.Body.Description).to.equal(positiveFlow.Description);
                // expect(stepsResponse.Body.Hidden).to.equal(false);
                // expect(stepsResponse.Body.Key).to.equal(flowKey);
                // expect(stepsResponse.Body.Name).to.equal(positiveFlow.Name);
                // expect(stepsResponse.Body.Params).to.deep.equal(positiveFlow.Params);
                // expect(stepsResponse.Body.Steps.length).to.equal(1);
                // expect(stepsResponse.Body.Steps[0]).to.deep.equal(emptyStep[0]);
                // //- search for flow in search input
                // await flowService.enterFlowBySearchingName(positiveFlow.Name);
                // //3. add steps by given flow
                // //3.1. validate first step has all correct data
                // const isCreatedSecsefully = await flowService.validateStepCreatedByApi(emptyStep[0].Name, 1);
                // expect(isCreatedSecsefully).to.equal(true);
                // //3.2. edit the first step to be similar to given object
                // const isEditeSuccessfully = await flowService.editStep(1, positiveFlow.Steps[0], generalService);
                // expect(isEditeSuccessfully).to.equal(true);
                // //3.3. duplicate it by the number of steps - not including first
                // for (let index = 1; index < (positiveFlow.Steps as any).length; index++) {
                //     const step = positiveFlow.Steps[index];
                //     const isDuplicatedCorrectly = await flowService.duplicateAndValidateStep(1, generalService, step);
                //     expect(isDuplicatedCorrectly).to.equal(true);
                // }
                //4. save everything
                //5. call API to see everything is similar
                //other it: -> run "test" and validate
                //other it: -> run "log" and validate
            });
            it('Data Cleansing: 1. script', async function () {
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
            it('Data Cleansing: 2. flows', async function () {
                //delete the script
                const flowService = new FlowService(driver);
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
