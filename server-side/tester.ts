import Mocha, { Suite } from 'mocha';
import chai, { expect, assert } from 'chai';
import promised from 'chai-as-promised';
import fs from 'fs';
import path from 'path';
import Mochawesome from 'mochawesome';
import { Client } from '@pepperi-addons/debug-server';
import { ConsoleColors } from './services/general.service';
//SYS REPORTING
// import GeneralService from './services/general.service';
// import jwt_decode from 'jwt-decode';

chai.use(promised);

export default function Tester(client?: Client, testName?: string, environment?: string) {
    // debugger;
    const failedTestsNames: string[] = [];
    let suitName = '';
    let wholeTestName = '';
    const isLocal = client ? client.AssetsBaseUrl.includes('/localhost:') : true;
    const testObject = {};
    const mochaDir = `/tmp/${testName ? testName : 'Mocha'}-${
        environment ? environment : 'Default'
    }-Tests-Results-${new Date()
        .toISOString()
        .substring(0, 16)
        .replace(/-/g, '.')
        .replace(/:/g, '_')
        .replace(/T/g, 'T_')}`;
    const fileName = 'report';
    const mocha = new Mocha({
        reporter: Mochawesome,
        reporterOptions: {
            reportDir: mochaDir,
            reportFilename: fileName,
            html: isLocal,
            autoOpen: isLocal,
            consoleReporter: 'none',
        },
        timeout: 1200000,
    });
    const root = mocha.suite;
    let context: Suite | undefined = root;
    let nestedGap = '';

    return {
        describe: (name: string, fn: () => any) => {
            const suite = new Mocha.Suite(name);
            context?.addSuite(suite);
            context = suite;

            fn();
            context = suite.parent;
        },

        it: (name: string, fn: Mocha.Func | Mocha.AsyncFunc | undefined) => {
            context?.addTest(new Mocha.Test(name, fn));
        },

        expect: expect,

        assert: assert,

        run: () => {
            return new Promise((resolve, reject) => {
                mocha
                    .run((failures) => {
                        console.log(failures);
                    })
                    .on('suite', (data) => {
                        if (data.title != '') {
                            wholeTestName = wholeTestName === '' ? data.title : wholeTestName;
                            nestedGap += '\t';
                            console.log(
                                `%c${nestedGap.slice(1)}Test Suite Start: ${data.title}`,
                                ConsoleColors.SystemInformation,
                            );
                        }
                    })
                    .on('suite end', (data) => {
                        suitName = suitName === '' ? data.title : suitName;
                        if (data.title != '') {
                            nestedGap = nestedGap.slice(1);
                            console.log(
                                `%c${nestedGap}Test Suite End: ${data.title}\n`,
                                ConsoleColors.SystemInformation,
                            );
                        }
                    })
                    .on('test', (data) => {
                        console.log(
                            `%c${nestedGap.slice(1)}Test Start: ${data.title}`,
                            ConsoleColors.SystemInformation,
                        );
                    })
                    .on('test end', (data) => {
                        if (data.state != 'passed') {
                            //EVGENY HERE every test -- data is the same as in e2e
                            console.log(
                                `%c${nestedGap.slice(1)}Test End: ${data.title}: Result: ${data.state}`,
                                ConsoleColors.Error,
                            );
                            failedTestsNames.push(`${suitName}: ${data.title}`);
                        } else {
                            console.log(
                                `%c${nestedGap.slice(1)}Test End: ${data.title}: Result: ${data.state}`,
                                ConsoleColors.Success,
                            );
                        }
                        suitName = '';
                    })
                    .on('end', () => {
                        // resolve((runner as any).testResults);
                        setTimeout(() => {
                            fs.readFile(path.join(mochaDir, fileName + '.json'), async (err, data) => {
                                if (err) {
                                    console.error(err);
                                    reject(new Error('error reading output file'));
                                } else {
                                    let res;
                                    try {
                                        res = JSON.parse(data.toString());
                                    } catch (error) {
                                        if (error instanceof Error) {
                                            return resolve(error.toString());
                                        } else {
                                            return resolve(String(error));
                                        }
                                    }

                                    //Test results report might be to big for the addon, so remove some data from response
                                    let outpot = JSON.stringify(res);
                                    //SYS REPORTING
                                    // console.log(
                                    //     `%cStarting To Report Test Results To Monitoring Addon`,
                                    //     ConsoleColors.SystemInformation,
                                    // );
                                    // const parsedToken = jwt_decode(client!.OAuthAccessToken);
                                    // const userName = parsedToken.email;
                                    // //TODO:
                                    // const generalService = new GeneralService(client!);
                                    // //2. are all tests passed?
                                    // const testResults = res.stats.failures === 0 ? 'SUCCESS' : 'ERROR';
                                    //2.1 if so - send as "SUCSESS"  with only suit name
                                    // if (failedTestsNames && failedTestsNames.length) {
                                    //     for (let index = 0; index < failedTestsNames.length; index++) {
                                    //         const element = failedTestsNames[index];
                                    //         const monitoringResult = await generalService.sendResultsToMonitoringAddon(
                                    //             userName,
                                    //             `API Test: ${testName!} ` + element,
                                    //             'ERROR',
                                    //             environment!,
                                    //         );
                                    // if (monitoringResult.Ok !== true || monitoringResult.Status !== 200) {
                                    //     //monitoringResult.Body.fault.faultstring
                                    //     console.log(
                                    //         `%cFAILED TO SEND REPORT TO MONITORING ADDON, with the exception:${monitoringResult.Body.fault.faultstring}`,
                                    //         ConsoleColors.Error,
                                    //     );
                                    // }
                                    // }
                                    // } else {
                                    //     //2.2 if not - iterate on all failed tests and send test by test
                                    //     const monitoringResult = await generalService.sendResultsToMonitoringAddon(
                                    //         userName,
                                    //         'API Test: ' + testName!,
                                    //         testResults,
                                    //         environment!,
                                    //     );
                                    // if (monitoringResult.Ok !== true || monitoringResult.Status !== 200) {
                                    //     console.log(
                                    //         `%cFAILED TO SEND REPORT TO MONITORING ADDON, with the exception:${monitoringResult.Body.fault.faultstring}`,
                                    //         ConsoleColors.Error,
                                    //     );
                                    // }
                                    // }
                                    // console.log(`%cReporting ended`, ConsoleColors.SystemInformation);
                                    // debugger;
                                    //------------------------------------------------------------------------------------
                                    //Check response length to remove the code parts if needed
                                    //Changed from 200000 to 100000 since KB limitation is set to 128KB (16/11/2021 by Nofar)
                                    if (outpot.length > 100000) {
                                        outpot = outpot
                                            .replace(/\s/g, '')
                                            .replace(/,"fullFile":""/g, '')
                                            .replace(/,"afterHooks":\[\]/g, '')
                                            .replace(/,"beforeHooks":\[\]/g, '')
                                            .replace(/,"err":{}/g, '')
                                            .replace(/,"isHook":false/g, '')
                                            .replace(/,"skipped":false/g, '')
                                            .replace(/,"pending":\[\]/g, '')
                                            .replace(/,"pending":false/g, '')
                                            .replace(/,"context":null/g, '')
                                            .replace(/,"skipped":\[\]/g, '')
                                            .replace(/,"file":""/g, '')
                                            .replace(/,"root":true/g, '')
                                            .replace(/,"rootEmpty":true/g, '')
                                            .replace(/(\"code\":)(.*?)(?=\"uuid\":)/g, '');
                                    }
                                    return resolve(JSON.parse(outpot));
                                }
                            });
                        }, 4000);
                    });
            });
        },

        setNewTestHeadline(testHeadline) {
            testObject[testHeadline] = {};
            testObject[testHeadline].testsNamesArr = [];
            testObject[testHeadline].errorsArr = [];
        },

        addTestResultUnderHeadline(testHeadline, testName, testResult?) {
            testObject[testHeadline].testsNamesArr.push(testName);
            switch (typeof testResult) {
                case 'object':
                    if (testResult.stack === undefined) {
                        testObject[testHeadline].errorsArr.push(JSON.stringify(testResult) + '\nMocha run exception:');
                    } else {
                        testObject[testHeadline].errorsArr.push(testResult.stack.toString() + '\nMocha run exception:');
                    }
                    break;
                case 'boolean':
                    if (!testResult) {
                        testObject[testHeadline].errorsArr.push('Test failed' + '\nMocha run exception:');
                    } else {
                        testObject[testHeadline].errorsArr.push('');
                    }
                    break;
                case 'string':
                    if (testResult.length > 0) {
                        testObject[testHeadline].errorsArr.push(testResult + '\nMocha run exception:');
                    } else {
                        testObject[testHeadline].errorsArr.push('');
                    }
                    break;
                default:
                    testObject[testHeadline].errorsArr.push('');
                    break;
            }
        },

        printTestResults(describe, expect, it, testSuitesName) {
            describe(`${testSuitesName} Tests Suites`, () => {
                for (const key in testObject) {
                    describe(key, () => {
                        for (let i = 0; i < testObject[key]['testsNamesArr'].length; i++) {
                            it(i + 1 + ') ' + testObject[key]['testsNamesArr'][i], () => {
                                expect(testObject[key]['errorsArr'][i].toString()).to.not.contain(' ');
                            });
                        }
                    });
                }
            });
        },
    };
}
