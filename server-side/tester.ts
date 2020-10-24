import Mocha, { Suite } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import fs from 'fs';
import path from 'path';
import Mochawesome from 'mochawesome';

chai.use(promised);

export default function Tester(testName?: string, environment?: string) {
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
            html: false,
            consoleReporter: 'none',
        },
        timeout: 1200000,
    });
    const root = mocha.suite;
    let context: Suite | undefined = root;

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

        run: () => {
            return new Promise((resolve, reject) => {
                mocha
                    .run((failures) => {
                        console.log(failures);
                    })
                    .on('end', () => {
                        // resolve((runner as any).testResults);
                        setTimeout(() => {
                            fs.readFile(path.join(mochaDir, fileName + '.json'), (err, data) => {
                                if (err) {
                                    console.error(err);
                                    reject(new Error('error reading output file'));
                                } else {
                                    let res;
                                    try {
                                        res = JSON.parse(data.toString());
                                    } catch (e) {
                                        return resolve(e.toString());
                                    }

                                    //Test results report might be to big for the addon, so remove some data from response
                                    let outpot = JSON.stringify(res)
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
                                        .replace(/,"rootEmpty":true/g, '');

                                    //Check response length to remove the code parts if needed
                                    if (outpot.length > 200000) {
                                        outpot = outpot.replace(/(\"code\":)(.*?)(?=\"uuid\":)/g, '');
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
            describe(`${testSuitesName} Tests Suites`, function () {
                for (const key in testObject) {
                    describe(key, function () {
                        for (let i = 0; i < testObject[key]['testsNamesArr'].length; i++) {
                            it(i + 1 + ') ' + testObject[key]['testsNamesArr'][i], function () {
                                expect(testObject[key]['errorsArr'][i].toString()).to.not.contain(' ');
                            });
                        }
                    });
                }
            });
        },
    };
}
