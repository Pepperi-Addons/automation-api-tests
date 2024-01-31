import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';

chai.use(promised);

export async function IdosPapiTests(email: string, password: string, client: Client, varPass) {
    const generalService = new GeneralService(client);
    // await generalService.baseAddonVersionsInstallationNewSync(varPass);
    // #region Upgrade survey dependencies

    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe(`Ido's Papi Tests Suit`, async function () {
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

        describe(`Ido's Papi Tests`, () => {
            this.retries(0);

            it(`Call GET: '/v1.0/addons/api/async/{{Papi}}/tests/tests' To Get Tests List, Then Call  POST: '/v1.0/addons/api/async/{{Papi}}/tests/tests' To Run And Report`, async function () {
                debugger;
                const papiUuid = '00000000-0000-0000-0000-000000000a91';
                const urlToUse = `/v1.0/addons/api/async/${papiUuid}/tests/tests`;
                // const ourFrameworkUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
                const installedAddonsArr = await generalService.getInstalledAddons({ page_size: -1 });
                const didSucceed: { status: boolean; name: string }[] = [];
                // const ourAddonSK = await generalService.getSecretKey(ourFrameworkUUID, varPass);
                //1. get tests
                const testList = await (
                    await generalService.fetchStatus(urlToUse, {
                        method: 'GET',
                    })
                ).Body;
                //2. iterate on all Tests
                for (let index = 0; index < testList.length; index++) {
                    const currentTestName = testList[index];
                    const body = {
                        Name: currentTestName,
                    };
                    // const _headers = {
                    //     'x-pepperi-ownerid': '84c999c3-84b7-454e-9a86-71b7abc96554',
                    //     'x-pepperi-secretkey': ourAddonSK,
                    //     Authorization: `Bearer ${generalService['client'].OAuthAccessToken}`,
                    // };
                    console.log(
                        `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                            testList.length
                        }  #######################`,
                    );
                    const testResponse = await generalService.fetchStatus(urlToUse, {
                        body: JSON.stringify(body),
                        method: 'POST',
                        // headers: _headers,
                    });
                    if (testResponse === undefined) {
                        const errorString = `Error: got undefined when trying to run ${currentTestName} papi test - got no EXECUTION UUID!`;
                        throw new Error(`${errorString}`);
                    }
                    if (testResponse.Body.URI === undefined) {
                        const errorString = `Error: got URI = undefined when trying to run ${currentTestName} papi test - no EXECUTION UUID!`;
                        throw new Error(`${errorString}`);
                    }
                    console.log(`####################### ${currentTestName}: EXECUTION UUID: ${testResponse.Body.URI}`);
                    debugger;
                    const auditLogTestResults = await generalService.getAuditLogResultObjectIfValid(
                        testResponse.Body.URI as string,
                        120,
                        7000,
                    );
                    if (
                        auditLogTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                        auditLogTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
                    ) {
                        debugger;
                        let errorString = '';
                        if (
                            auditLogTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                            auditLogTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
                        ) {
                            errorString += `${email} got the error: ${auditLogTestResults.AuditInfo.ErrorMessage} from Audit Log, On Test:${currentTestName}, EXECUTION UUID: ${testResponse.Body.URI},\n`;
                        }
                        throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                    }
                    debugger;
                    //4.3. parse the response
                    let testParsedResults;
                    let shouldAlsoPrintVer = false;
                    try {
                        testParsedResults = JSON.parse(auditLogTestResults.AuditInfo.ResultObject);
                    } catch (error) {
                        debugger;
                        let errorString = '';
                        if (!testParsedResults.AuditInfo.ResultObject) {
                            errorString += `${email} got the error: ${error} trying to parse results from Audit Log, On Test ${currentTestName} ,EXECUTION UUID: ${testResponse.Body.URI},\n`;
                        }
                        throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                    }
                    let objectToWorkWith;
                    if (testParsedResults.results === undefined) {
                        const errorString = `Cannot Parse Result Object, Recieved: ${testParsedResults}, On: ${currentTestName} Test`;
                        debugger;
                        throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                    }
                    //TODO: move the parsing to another function
                    if (
                        testParsedResults.results &&
                        testParsedResults.results[0].suites[0].suites &&
                        testParsedResults.results[0].suites[0].suites.length > 0
                    ) {
                        shouldAlsoPrintVer = true;
                        objectToWorkWith = testParsedResults.results[0].suites[0].suites;
                    } else if (testParsedResults.results) {
                        //add an if to catch the other result config also
                        objectToWorkWith = testParsedResults.results[0].suites;
                    } else {
                        objectToWorkWith = testParsedResults.tests;
                    }
                    if (objectToWorkWith === undefined) {
                        debugger;
                        let errorString = '';
                        if (!objectToWorkWith) {
                            errorString = `Cannot Get Results Out Of The Result Object Which Returned: ${testParsedResults}\n`;
                        }
                        throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
                    }
                    for (let index = 0; index < objectToWorkWith.length; index++) {
                        const result = objectToWorkWith[index];
                        console.log(`\n***${currentTestName} EU result object: ${JSON.stringify(result)}***\n`);
                    }
                    // const euResults = await this.printResultsTestObject(objectToWorkWith, euUser, 'prod');
                    console.log(
                        `#######################  Dev Test Results For Addon ${this.addonUUID}, Test: ${currentTestName} #######################`,
                    );
                    for (let index = 0; index < objectToWorkWith.length; index++) {
                        const testResult = objectToWorkWith[index];
                        if (testResult.title.includes('Test Data')) {
                            if (testResult.failures.length > 1) {
                                didSucceed.push({ status: false, name: currentTestName });
                            }
                        } else if (testResult.failures) {
                            if (testResult.failures.length > 0)
                                didSucceed.push({ status: false, name: currentTestName });
                        } else {
                            for (let index = 0; index < objectToWorkWith.length; index++) {
                                const test = objectToWorkWith[index];
                                if (
                                    !test.passed ||
                                    test.failed ||
                                    (test.hasOwnProperty('failure') && test.failure.length > 0)
                                ) {
                                    didSucceed.push({ status: false, name: currentTestName });
                                }
                            }
                        }
                        if (objectToWorkWith.length > 1) {
                            for (let index = 0; index < objectToWorkWith.length; index++) {
                                const test = objectToWorkWith[index];
                                generalService.reportResults2(
                                    test,
                                    installedAddonsArr.find(
                                        (addon) =>
                                            addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
                                    ),
                                );
                            }
                        } else {
                            generalService.reportResults2(
                                testResult,
                                installedAddonsArr.find(
                                    (addon) => addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
                                ),
                            );
                        }
                    }
                    console.log(`##############################################`);
                    if (shouldAlsoPrintVer) {
                        objectToWorkWith = testParsedResults.results[0].suites[1].suites;
                        for (let index = 0; index < objectToWorkWith.length; index++) {
                            const testResult = objectToWorkWith[index];
                            if (testResult.title.includes('Test Data')) {
                                if (testResult.failures.length > 1) {
                                    didSucceed.push({ status: false, name: currentTestName });
                                }
                            } else if (testResult.failures) {
                                if (testResult.failures.length > 0)
                                    didSucceed.push({ status: false, name: currentTestName });
                            } else {
                                for (let index = 0; index < objectToWorkWith.length; index++) {
                                    const test = objectToWorkWith[index];
                                    if (
                                        !test.passed ||
                                        test.failed ||
                                        (test.hasOwnProperty('failure') && test.failure.length > 0)
                                    ) {
                                        didSucceed.push({ status: false, name: currentTestName });
                                    }
                                }
                            }
                            if (objectToWorkWith.length > 1) {
                                for (let index = 0; index < objectToWorkWith.length; index++) {
                                    const test = objectToWorkWith[index];
                                    generalService.reportResults2(
                                        test,
                                        installedAddonsArr.find(
                                            (addon) =>
                                                addon.Addon.UUID == this.addonUUID &&
                                                addon.Version == this.addonVersion,
                                        ),
                                    );
                                }
                            } else {
                                generalService.reportResults2(
                                    testResult,
                                    installedAddonsArr.find(
                                        (addon) =>
                                            addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
                                    ),
                                );
                            }
                        }
                        console.log(`##############################################`);
                    }
                }
                for (let index = 0; index < didSucceed.length; index++) {
                    const testStatus = didSucceed[index];
                    expect(testStatus.status, `Test Name: ${testStatus.name} FAILED!`).to.equal(true);
                }
            });
        });
    });
}
