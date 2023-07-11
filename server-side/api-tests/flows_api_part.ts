import GeneralService, { TesterFunctions } from '../services/general.service';

export async function FlowAPITest(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    interface FlowParam {
        Name: string;
        Type: 'String' | 'Bool' | 'DateTime' | 'Integer' | 'Double' | 'Object';
        Description?: string;
        DefaultValue?: string | boolean | Date | number | Record<string, unknown>;
        Internal?: boolean;
    }

    interface FlowStep {
        Name: string;
        Disabled: boolean; //
        Type: 'LogicBlock'; //
        Relation?: RelationForFlow; //
        Configuration: stepConfig;
    }

    interface FlowStepGroup {
        Name: string;
        Disabled: boolean;
        Type: 'Group';
        Configuration: stepConfig;
        Steps: FlowStep[];
    }

    interface RelationForFlow {
        ExecutionURL: '/addon-cpi/run_logic_block_script';
        AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3';
        Name: 'UserScriptsBlock';
    }

    interface stepConfig {
        runScriptData: { ScriptData: Record<string, unknown>; ScriptKey: string };
    }

    interface Flow {
        Key?: string; //
        Name: string; //
        Description?: string; //
        Params: FlowParam[]; //
        Steps: FlowStep[] | FlowStepGroup;
        Hidden: boolean;
    }

    //#region Upgrade ADAL
    // let varKey;
    // if (generalService.papiClient['options'].baseURL.includes('staging')) {
    //     varKey = request.body.varKeyStage;
    // } else {
    //     varKey = request.body.varKeyPro;
    // }
    // await generalService.baseAddonVersionsInstallation(varKey);
    // const testData = {
    //     Nebula: ['00000000-0000-0000-0000-000000006a91', '0.8.%'],
    //     sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.7.%'],
    //     'user-defined-flows': ['dc8c5ca7-3fcc-4285-b790-349c7f3908bd', ''],
    // };
    // const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade ADAL

    describe('Flow Builder Tests Suites', () => {
        // describe('Prerequisites Addon for Flow Builder Tests', () => {
        //     //Test Data
        //     //ADAL
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
        describe(`API Testing`, () => {
            it(`POST Flow - Positive basic flow - with signle external Param and a single step - should work`, async function () {
                const newFlowName = 'test_api_pos' + generalService.generateRandomString(8);
                const newFlowParams: FlowParam[] = [
                    {
                        DefaultValue: 'evgenyos',
                        Type: 'String',
                        Description: 'test',
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: Flow = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
                expect(responseForPosFlow.Body.Params).to.deep.equal(newFlowParams);
                expect(responseForPosFlow.Body.Steps).to.deep.equal(newFlowSteps);
            });
            it(`POST Flow - Positive Test: sending post without Steps at all - should work`, async function () {
                const newFlowName = 'test_api_pos' + generalService.generateRandomString(8);
                const newFlowParams: FlowParam[] = [
                    {
                        DefaultValue: 'evgenyos',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
                        Name: 'test',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
                expect(responseForPosFlow.Body.Params).to.deep.equal(newFlowParams);
            });
            it(`POST Flow - Positive Test: sending post without params at all - should work`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
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
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
                expect(responseForPosFlow.Body.Steps).to.deep.equal(newFlowSteps);
            });
            it(`POST Flow - Positive Test: sending post with name only - should work`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const positiveFlow: any = {
                    Hidden: false,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
            });
            it(`POST Flow - Negative Test: sending post without flow name - should reject`, async function () {
                const newFlowParams: FlowParam[] = [
                    {
                        DefaultValue: 'evgenyos',
                        Type: 'String',
                        Description: 'test',
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal('Failed due to exception: Name is required');
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`POST Flow - Negative Test: sending Params without a name - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'evgenyos',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Params[0].Name is required\nParams[0] requires property "Name"',
                );
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`POST Flow - Negative Test: sending Params with a not correct type - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'evgenyos',
                        Type: 'EVGENY',
                        Description: 'test',
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Params[0].Type is not one of enum values: String,Bool,Integer,Double,Object',
                );
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`POST Flow - Negative Test: sending Params with not matching deafult value to type - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: FlowParam[] = [
                    {
                        DefaultValue: { evgeny: 11 },
                        Type: 'String',
                        Description: 'test',
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
            });
            it(`POST Flow - Negative Test: sending Params with non boolean internal value - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'zaza',
                        Type: 'String',
                        Description: 'test',
                        Internal: 15,
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
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Params[0].Internal is not of a type(s) boolean',
                );
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`POST Flow - Negative Test: sending Steps without a name - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'zaza',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
                        Name: 'test',
                    },
                ];
                const newFlowSteps: any[] = [
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
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Steps[0].Name is required\nSteps[0] requires property "Name"',
                );
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`POST Flow - Psitive Test: sending Steps without a relation - should work`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'zaza',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
                        Name: 'test',
                    },
                ];
                const newFlowSteps: FlowStep[] = [
                    {
                        Type: 'LogicBlock',
                        Disabled: false,
                        Configuration: {
                            runScriptData: {
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
            });
            it(`POST Flow - Positive Test: sending Steps without configuration - should work`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: any[] = [
                    {
                        DefaultValue: 'zaza',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
                        Name: 'test',
                    },
                ];
                const newFlowSteps: any[] = [
                    {
                        Type: 'LogicBlock',
                        Relation: {
                            ExecutionURL: '/addon-cpi/run_logic_block_script',
                            AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
                            Name: 'UserScriptsBlock',
                        },
                        Disabled: false,
                        Name: 'Step',
                    },
                ];
                const positiveFlow: any = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                expect(responseForPosFlow.Error).to.deep.equal({});
                expect(responseForPosFlow.Body).to.haveOwnProperty('CreationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('ModificationDateTime');
                expect(responseForPosFlow.Body).to.haveOwnProperty('Key');
                expect(responseForPosFlow.Body.Hidden).to.be.false;
                expect(responseForPosFlow.Body.Name).to.equal(newFlowName);
            });
            it(`POST Flow - Negative Test: sending Steps with a not correct type - should reject`, async function () {
                const newFlowName = 'test_negative_pos' + generalService.generateRandomString(8);
                const newFlowParams: FlowParam[] = [
                    {
                        DefaultValue: 'zaza',
                        Type: 'String',
                        Description: 'test',
                        Internal: false,
                        Name: 'test',
                    },
                ];
                const newFlowSteps: any[] = [
                    {
                        Type: 'EVGENY',
                        Relation: {
                            ExecutionURL: '/addon-cpi/run_logic_block_script',
                            AddonUUID: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
                            Name: 'UserScriptsBlock',
                        },
                        Disabled: false,
                        Configuration: {
                            runScriptData: {
                                ScriptData: {},
                                ScriptKey: '0c52a228-cf30-4baa-a635-83fa6e4edef8',
                            },
                        },
                        Name: 'Step',
                    },
                ];
                const positiveFlow: Flow = {
                    Params: newFlowParams,
                    Hidden: false,
                    Steps: newFlowSteps,
                    Name: newFlowName,
                };
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'POST',
                        body: JSON.stringify(positiveFlow),
                    },
                );
                expect(responseForPosFlow.Ok).to.be.false;
                expect(responseForPosFlow.Status).to.equal(400);
                expect(responseForPosFlow.Body.fault.faultstring).to.equal(
                    'Failed due to exception: Steps[0].Type is not one of enum values: LogicBlock,Group',
                );
                expect(responseForPosFlow.Body.fault.detail.errorcode).to.equal('BadRequest');
            });
            it(`ENDPOINT TEST: GET`, async function () {
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'GET',
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                const arrayOfFlows = responseForPosFlow.Body;
                expect(arrayOfFlows.length).to.be.at.least(1);
                for (let index = 0; index < arrayOfFlows.length; index++) {
                    const flow = arrayOfFlows[index];
                    expect(flow).to.haveOwnProperty('CreationDateTime');
                    expect(flow).to.haveOwnProperty('Hidden');
                    expect(flow).to.haveOwnProperty('Key');
                    expect(flow).to.haveOwnProperty('ModificationDateTime');
                    expect(flow).to.haveOwnProperty('Name');
                    if (flow.Params) {
                        for (let index = 0; index < flow.Params.length; index++) {
                            const param = flow.Params[index];
                            expect(param).to.haveOwnProperty('Name');
                            expect(param).to.haveOwnProperty('Type');
                            expect(param).to.haveOwnProperty('Internal');
                        }
                    }
                    if (flow.Steps) {
                        for (let index = 0; index < flow.Steps.length; index++) {
                            const step = flow.Steps[index];
                            expect(step).to.haveOwnProperty('Name');
                            expect(step).to.haveOwnProperty('Type');
                        }
                    }
                }
            });
            it(`ENDPOINT TEST: GET BY KEY`, async function () {
                const responseForPosFlow = await generalService.fetchStatus(
                    '/addons/api/dc8c5ca7-3fcc-4285-b790-349c7f3908bd/api/flows',
                    {
                        method: 'GET',
                    },
                );
                expect(responseForPosFlow.Ok).to.be.true;
                expect(responseForPosFlow.Status).to.equal(200);
                const gottenFlow = responseForPosFlow.Body[0];
                const responseForPosFlow2 = await generalService.fetchStatus(
                    `/user_defined_flows/key/${gottenFlow.Key}`,
                    {
                        method: 'GET',
                    },
                );
                expect(responseForPosFlow2.Ok).to.be.true;
                expect(responseForPosFlow2.Status).to.equal(200);
                expect(responseForPosFlow2.Body).to.deep.equal(gottenFlow);
            });
            it(`ENDPOINT TEST: SEARCH`, async function () {
                const responseForPosFlow2 = await generalService.fetchStatus(`/user_defined_flows/search`, {
                    method: 'POST',
                    body: JSON.stringify({}),
                });
                expect(responseForPosFlow2.Ok).to.be.true;
                expect(responseForPosFlow2.Status).to.equal(200);
                expect(responseForPosFlow2.Body).to.haveOwnProperty('Objects');
                const objects = responseForPosFlow2.Body.Objects;
                expect(objects.length).to.be.at.least(1);
                // expect(responseForPosFlow2.Body).to.deep.equal(gottenFlow);
            });
        });
    });
}
