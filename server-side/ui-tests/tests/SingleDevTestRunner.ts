import GeneralService, { initiateTester } from '../../services/general.service';

class DevTestUser {
    email: string;
    pass: string;
    env: string;
    generalService: GeneralService;

    constructor(userEmail: string, userPass: string, userEnv: string, service: GeneralService) {
        this.email = userEmail;
        this.pass = userPass;
        this.env = userEnv;
        this.generalService = service;
    }
}

export class SingleDevTestRunner {
    public addonName: string;
    public addonUUID: string;
    public addonTestsURL: string;
    public listOfTests: string[] = [];
    public devTestUserObject: DevTestUser;
    public varPass;
    public service;
    public addonVersion;
    public failedTests: any[] = [];

    constructor(userEmail, userPass, client, service, userEnv, addonName: string, addonVersion, varPass) {
        this.devTestUserObject = new DevTestUser(userEmail, userPass, userEnv, service);
        this.addonName = addonName;
        this.addonUUID = this.convertNameToUUIDForDevTests(addonName.toUpperCase());
        this.addonTestsURL = `/addons/api/async/${this.addonUUID}/tests/tests`;
        this.varPass = varPass;
        this.service = service;
        this.addonVersion = addonVersion;
    }

    convertNameToUUIDForDevTests(addonName: string) {
        switch (addonName) {
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return '9abbb634-9df5-49ab-91d1-41ad7a2632a6';
            case 'ADAL':
                return '00000000-0000-0000-0000-00000000ada1';
            case 'DATA INDEX':
            case 'DATA-INDEX':
                return '00000000-0000-0000-0000-00000e1a571c';
            case 'NEBULA':
                return '00000000-0000-0000-0000-000000006a91';
            case 'FEBULA':
                return 'cebb251f-1c80-4d80-b62c-442e48e678e8';
            case 'SYNC':
                return '5122dc6d-745b-4f46-bb8e-bd25225d350a';
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES':
                return 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f';
            case 'CONFIGURATIONS':
                return '84c999c3-84b7-454e-9a86-71b7abc96554';
            case 'RELATED-ITEMS':
                return '4f9f10f3-cd7d-43f8-b969-5029dad9d02b';
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS':
                return '00000000-0000-0000-0000-0000000f11e5';
            case 'JOURNEY':
            case 'JOURNEY-TRACKER':
                return '41011fbf-debf-40d8-8990-767738b8af03';
            case 'NODE':
            case 'CPI-NODE':
                return 'bb6ee826-1c6b-4a11-9758-40a46acb69c5';
            case 'CRAWLER':
                return 'f489d076-381f-4cf7-aa63-33c6489eb017';
            case 'ASYNCADDON':
                return '00000000-0000-0000-0000-0000000a594c';
            case 'TRANSLATION':
                return 'fbbac53c-c350-42c9-b9ad-17c238e55b42';
            case 'DIMX':
                return '44c97115-6d14-4626-91dc-83f176e9a0fc';
            case 'CPI-DATA':
            case 'CPI DATA':
            case 'ADDONS-CPI-DATA':
                return 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b';
            default:
                return 'none';
        }
    }

    async getTestNames(): Promise<string[] | { ADAL: any; DataIndex: any }> {
        // if (this.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
        //     return await this.getTestNamesADAL();
        // }
        return await this.getTestNamesInt();
    }

    async getTestNamesInt() {
        const urlToGetTestsFrom = `/addons/api/${this.addonUUID}/tests/tests`;
        const response = (
            await this.devTestUserObject.generalService.fetchStatus(urlToGetTestsFrom, {
                method: 'GET',
            })
        ).Body;
        if (!Array.isArray(response)) {
            throw new Error(`${response.fault.faultstring}`);
        }
        let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
        toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
        return toReturn;
    }

    // async getTestNamesADAL() {
    //     const urlToGetTestsFromADAL = `/addons/api/${this.addonUUID}/tests/tests`;
    //     const urlToGetTestsFromDataIndex = `/addons/api/00000000-0000-0000-0000-00000e1a571c/tests/tests`;
    //     let responseFromAdal = (
    //         await (
    //             await this.devTestUserObject
    //         ).generalService.fetchStatus(urlToGetTestsFromADAL, {
    //             method: 'GET',
    //         })
    //     ).Body;
    //     if (!Array.isArray(responseFromAdal)) {
    //         debugger;
    //         const numAddonVersion = Number(
    //             this.addonVersion
    //                 .split('.')
    //                 .splice(this.addonVersion.split('.'), this.addonVersion.split('.').length - 1, 1)
    //                 .join('.'),
    //         );
    //         if (numAddonVersion >= 1.8) {
    //             throw new Error(`${responseFromAdal.fault.faultstring}`);
    //         } else {
    //             responseFromAdal = [];
    //         }
    //     }
    //     const responseFromDataIndex = (
    //         await (
    //             await this.devTestUserObject
    //         ).generalService.fetchStatus(urlToGetTestsFromDataIndex, {
    //             method: 'GET',
    //         })
    //     ).Body;
    //     let toReturnADAL = responseFromAdal.map((jsonData) => JSON.stringify(jsonData.Name));
    //     toReturnADAL = toReturnADAL.map((testName) => testName.replace(/"/g, ''));
    //     let roReturnDataIndex = responseFromDataIndex.map((jsonData) => JSON.stringify(jsonData.Name));
    //     roReturnDataIndex = roReturnDataIndex.map((testName) => testName.replace(/"/g, ''));
    //     return { ADAL: toReturnADAL, DataIndex: roReturnDataIndex };
    // }

    async runDevTestInt(testNames: string[], testserUuid?: string) {
        debugger;
        for (let index = 0; index < testNames.length; index++) {
            const currentTestName = testNames[index];
            const body = {
                Name: currentTestName,
            };
            console.log(
                `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                    testNames.length
                }  #######################`,
            );
            const addonSk = null;
            // if (this.addonName === 'DATA INDEX' || this.addonName === 'DATA-INDEX' || this.addonName === 'ADAL') {
            //     addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
            //         this.adminBaseUserEmail,
            //         this.adminBaseUserPass,
            //         'AutomationAddonSecretKey',
            //     );
            // }
            // if (this.addonName === 'CONFIGURATIONS') {
            //     addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
            //         this.adminBaseUserEmail,
            //         this.adminBaseUserPass,
            //         'AutomationAddonSecretKeyConfigAddon',
            //     );
            // }
            const devTestResponse: any = await this.runDevTestOnCertainEnv(
                this.devTestUserObject.email,
                this.devTestUserObject.env,
                addonSk,
                body,
                testserUuid,
            );
            if (!devTestResponse) {
                const errorString = `Error: got undefined when trying to run ${this.addonName} tests - no EXECUTION UUID!`;
                throw new Error(`${errorString}`);
            }
            if (devTestResponse.Body.URI === undefined) {
                const errorString = `Error: got undefined when trying to run ${this.addonName} tests - no EXECUTION UUID!`;
                throw new Error(`${errorString}`);
            }
            console.log(
                `####################### ${currentTestName}: EXECUTION UUID: ${devTestResponse.Body.URI} ####################### `,
            );
            debugger;
            this.service.sleep(1000 * 15);
            const devTestResults = await this.getTestResponse(
                this.devTestUserObject.email,
                this.devTestUserObject.env,
                devTestResponse.Body.URI,
            );
            if (
                devTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                devTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
            ) {
                debugger;
                let errorString = '';
                if (
                    devTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    errorString += `got the error: ${devTestResults.AuditInfo.ErrorMessage} from Audit Log, On Test: ${currentTestName}, EXECUTION UUID: ${devTestResponse.Body.URI},\n`;
                }
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            debugger;
            //4.3. parse the response
            let testResultArray;
            try {
                testResultArray = JSON.parse(devTestResults.AuditInfo.ResultObject);
            } catch (error) {
                debugger;
                let errorString = '';
                if (!devTestResults.AuditInfo.ResultObject) {
                    errorString += `got the error: ${devTestResults.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName} ,EXECUTION UUID: ${devTestResponse.Body.URI},\n`;
                }
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }

            let objectToPrint;
            let shouldAlsoPrintVer = false;
            if (testResultArray.results === undefined && testResultArray.tests === undefined) {
                const errorString = `Cannot Parse Result Object, Recieved: ${JSON.stringify(testResultArray)}`;
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            //TODO: move the parsing to another function
            if (
                testResultArray.results &&
                testResultArray.results[0].suites[0].suites &&
                testResultArray.results[0].suites[0].suites.length > 0
            ) {
                shouldAlsoPrintVer = true;
                objectToPrint = testResultArray.results[0].suites[0].suites;
            } else if (testResultArray.results) {
                //add an if to catch the other result config also
                objectToPrint = testResultArray.results[0].suites;
            } else {
                objectToPrint = testResultArray.tests;
            }
            if (objectToPrint === undefined) {
                debugger;
                let errorString = '';
                errorString += `${this.devTestUserObject.email} got the error: ${
                    devTestResults.AuditInfo.ErrorMessage
                } from Audit Log, Recived Audit Log: ${JSON.stringify(devTestResults.AuditInfo)}, EXECUTION UUID: ${
                    devTestResponse.Body.URI
                },\n`;
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            console.log(
                `********* this printing is made for debugging - you can skip downward to see the prettified tests result *********`,
            );
            for (let index = 0; index < objectToPrint.length; index++) {
                const result = objectToPrint[index];
                console.log(`\n***${currentTestName} result object: ${JSON.stringify(result)}***\n`);
            }
            console.log(
                `\n****************************************************** Prettified Tests Results Splitted To Envs ******************************************************\n'`,
            );
            const results = await this.printResultsTestObject(
                objectToPrint,
                this.devTestUserObject.email,
                this.devTestUserObject.env,
                currentTestName,
            );
            if (shouldAlsoPrintVer) {
                objectToPrint = testResultArray.results[0].suites[1].suites;
                await this.printResultsTestObject(
                    objectToPrint,
                    this.devTestUserObject.email,
                    this.devTestUserObject.env,
                    currentTestName,
                );
            }
            // debugger;
            //4.6. create the array of passing / failing tests
            // debugger;
            if (results.didSucceed) {
                //devPassingEnvs  devFailedEnvs   failedSuitesEU   failedSuitesProd   failedSuitesSB
                console.log(`${currentTestName} passed!`);
            } else {
                console.log(`${currentTestName} failed!`);
                this.failedTests.push({ name: currentTestName, executionUuid: devTestResponse.Body.URI });
                return false;
            }
        }
        return true;
    }

    async runSingleDevTestInt(testNames: string[], service: GeneralService, testserUuid?: string) {
        const arrayOfResults: { testName: string; passed: boolean }[] = [];
        debugger;
        for (let index = 0; index < testNames.length; index++) {
            const currentTestName = testNames[index];
            const body = {
                Name: currentTestName,
            };
            console.log(
                `####################### Running: ${currentTestName}, number: ${index + 1} out of: ${
                    testNames.length
                }  #######################`,
            );
            const addonSk = null;
            // if (this.addonName === 'DATA INDEX' || this.addonName === 'DATA-INDEX' || this.addonName === 'ADAL') {
            //     addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
            //         this.adminBaseUserEmail,
            //         this.adminBaseUserPass,
            //         'AutomationAddonSecretKey',
            //     );
            // }
            // if (this.addonName === 'CONFIGURATIONS') {
            //     addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
            //         this.adminBaseUserEmail,
            //         this.adminBaseUserPass,
            //         'AutomationAddonSecretKeyConfigAddon',
            //     );
            // }
            const devTestResponse: any = await this.runSingleDevTestOnCertainEnv(service, addonSk, body, testserUuid);
            if (!devTestResponse) {
                const errorString = `Error: got undefined when trying to run ${this.addonName} tests - no EXECUTION UUID!`;
                throw new Error(`${errorString}`);
            }
            if (devTestResponse.Body.URI === undefined) {
                const errorString = `Error: got undefined when trying to run ${this.addonName} tests - no EXECUTION UUID!`;
                throw new Error(`${errorString}`);
            }
            console.log(
                `####################### ${currentTestName}: EXECUTION UUID: ${devTestResponse.Body.URI} ####################### `,
            );
            debugger;
            this.service.sleep(1000 * 15);
            const devTestResults = await this.getTestResponse(
                this.devTestUserObject.email,
                this.devTestUserObject.env,
                devTestResponse.Body.URI,
            );
            if (
                devTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                devTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
            ) {
                debugger;
                let errorString = '';
                if (
                    devTestResults.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResults.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    errorString += `got the error: ${devTestResults.AuditInfo.ErrorMessage} from Audit Log, On Test: ${currentTestName}, EXECUTION UUID: ${devTestResponse.Body.URI},\n`;
                }
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            debugger;
            //4.3. parse the response
            let testResultArray;
            try {
                testResultArray = JSON.parse(devTestResults.AuditInfo.ResultObject);
            } catch (error) {
                debugger;
                let errorString = '';
                if (!devTestResults.AuditInfo.ResultObject) {
                    errorString += `got the error: ${devTestResults.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName} ,EXECUTION UUID: ${devTestResponse.Body.URI},\n`;
                }
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }

            let objectToPrint;
            let shouldAlsoPrintVer = false;
            if (testResultArray.results === undefined && testResultArray.tests === undefined) {
                const errorString = `Cannot Parse Result Object, Recieved: ${JSON.stringify(testResultArray)}`;
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            //TODO: move the parsing to another function
            if (
                testResultArray.results &&
                testResultArray.results[0].suites[0].suites &&
                testResultArray.results[0].suites[0].suites.length > 0
            ) {
                shouldAlsoPrintVer = true;
                objectToPrint = testResultArray.results[0].suites[0].suites;
            } else if (testResultArray.results) {
                //add an if to catch the other result config also
                objectToPrint = testResultArray.results[0].suites;
            } else {
                objectToPrint = testResultArray.tests;
            }
            if (objectToPrint === undefined) {
                debugger;
                let errorString = '';
                errorString += `${this.devTestUserObject.email} got the error: ${
                    devTestResults.AuditInfo.ErrorMessage
                } from Audit Log, Recived Audit Log: ${JSON.stringify(devTestResults.AuditInfo)}, EXECUTION UUID: ${
                    devTestResponse.Body.URI
                },\n`;
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            console.log(
                `********* this printing is made for debugging - you can skip downward to see the prettified tests result *********`,
            );
            for (let index = 0; index < objectToPrint.length; index++) {
                const result = objectToPrint[index];
                console.log(`\n***${currentTestName} result object: ${JSON.stringify(result)}***\n`);
            }
            console.log(
                `\n****************************************************** Prettified Tests Results Splitted To Envs ******************************************************\n'`,
            );
            const results = await this.printResultsTestObject(
                objectToPrint,
                this.devTestUserObject.email,
                this.devTestUserObject.env,
                currentTestName,
            );
            if (shouldAlsoPrintVer) {
                objectToPrint = testResultArray.results[0].suites[1].suites;
                await this.printResultsTestObject(
                    objectToPrint,
                    this.devTestUserObject.email,
                    this.devTestUserObject.env,
                    currentTestName,
                );
            }
            // debugger;
            //4.6. create the array of passing / failing tests
            // debugger;
            if (results.didSucceed) {
                //devPassingEnvs  devFailedEnvs   failedSuitesEU   failedSuitesProd   failedSuitesSB
                console.log(`${currentTestName} passed!`);
                arrayOfResults.push({ testName: currentTestName, passed: true });
            } else {
                console.log(`${currentTestName} failed!`);
                arrayOfResults.push({ testName: currentTestName, passed: false });
                // return false;
            }
        }
        return arrayOfResults;
    }
    // async runDevTestADAL(testNamesADAL: string[], testNamesDataIndex: string[]) {
    //     if (testNamesADAL.length !== 0) {
    //         console.log('ADAL Dev Tests: ');
    //         await this.runDevTestInt(testNamesADAL, this.addonUUID);
    //     } else {
    //         console.log(`No ADAL Dev Tests For Version ${this.addonVersion}`);
    //     }
    //     console.log('Data Index Dev Tests: ');
    //     await this.runDevTestInt(testNamesDataIndex);
    // }

    // async getBaseUser(testNamesADAL: string[], testNamesDataIndex: string[]) {}

    async runDevTest(testNames: any) {
        // if (this.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
        //     await this.runDevTestADAL(testNames.ADAL, testNames.DataIndex);
        // } else {
        return await this.runDevTestInt(testNames);
        // }
    }

    async handleSingleDevTest(testNames, generalService) {
        const configDevResults = await this.runSingleDevTest(testNames, generalService);
        return this.handleSingleDevTestResults(configDevResults);
    }

    async runSingleDevTest(testNames: any, service: GeneralService) {
        // if (this.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
        //     await this.runDevTestADAL(testNames.ADAL, testNames.DataIndex);
        // } else {
        return await this.runSingleDevTestInt(testNames, service);
        // }
    }

    async handleSingleDevTestResults(testResults) {
        let didPass = true;
        console.log(`\n${this.addonName} - ${this.addonUUID}, Version: ${this.addonVersion} TEST RESULTS:\n`);
        for (let index = 0; index < testResults.length; index++) {
            const testResult = testResults[index];
            if (!testResult.passed) {
                console.log(`The Test ${testResult.testName} has FAILED!`);
                didPass = false;
            } else {
                console.log(`The Test ${testResult.testName} has PASSED!`);
            }
        }
        const failedTestsObjects = testResults.filter((result) => result.passed === false);
        const failedTestsList = failedTestsObjects.map((result) => result.testName);
        if (failedTestsList.length !== 0) {
            console.log(
                `Failed Tests For ${this.addonName}, Version: ${this.addonVersion}: [${failedTestsList as string[]}]`,
            );
            console.log(`*** Failed Tests With Execution UUID's ***`);
            for (let index = 0; index < this.failedTests.length; index++) {
                const failedTest = this.failedTests[index];
                console.log(
                    `Failed Tests For ${this.addonName}, Version: ${this.addonVersion}: Test Name: ${
                        failedTest.name
                    } Execution UUID: [${failedTest.executionUUID as string[]}]`,
                );
            }
        }
        return didPass;
    }

    async printResultsTestObject(testResultArray, userName, env, currentTestName) {
        const client = await initiateTester(userName, 'Aa123456', env);
        const service = new GeneralService(client);
        const installedAddonsArr = await service.getInstalledAddons({ page_size: -1 });
        let didSucceed = true;
        // debugger;
        console.log(
            `####################### ${
                userName.includes('EU') ? 'EU' : env
            }, User: ${userName} Dev Test Results For Addon ${
                this.addonUUID
            } For Test Name: ${currentTestName} #######################`,
        );
        for (let index = 0; index < testResultArray.length; index++) {
            const testResult = testResultArray[index];
            if (testResult.title.includes('Test Data')) {
                if (testResult.failures.length > 1) {
                    didSucceed = false;
                }
            } else if (testResult.failures) {
                if (testResult.failures.length > 0) didSucceed = false;
            } else {
                for (let index = 0; index < testResultArray.length; index++) {
                    const test = testResultArray[index];
                    if (!test.passed || test.failed || (test.hasOwnProperty('failure') && test.failure.length > 0)) {
                        didSucceed = false;
                    }
                }
            }
            if (testResultArray.length > 1) {
                for (let index = 0; index < testResultArray.length; index++) {
                    const test = testResultArray[index];
                    service.reportResults2(
                        test,
                        installedAddonsArr.find(
                            (addon) => addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
                        ),
                    );
                }
            } else {
                service.reportResults2(
                    testResult,
                    installedAddonsArr.find(
                        (addon) => addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
                    ),
                );
            }
        }
        console.log(`##############################################`);
        return { didSucceed };
    }

    async getTestResponse(userName, env, URI) {
        const client = await initiateTester(userName, 'Aa123456', env);
        const service = new GeneralService(client);
        const auditLogDevTestResponse = await service.getAuditLogResultObjectIfValid(URI as string, 120, 7000);
        return auditLogDevTestResponse;
    }

    async runDevTestOnCertainEnv(userName, env, addonSk, bodyToSend, testerAddonUUID?) {
        const client = await initiateTester(userName, 'Aa123456', env);
        const service = new GeneralService(client);
        let _headers;
        let addonsTestingEndpoint = `/addons/api/async/${this.addonUUID}/tests/tests`;
        if (this.addonName === 'CONFIGURATIONS') {
            _headers = {
                'x-pepperi-ownerid': '84c999c3-84b7-454e-9a86-71b7abc96554',
                'x-pepperi-secretkey': addonSk,
                Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
            };
        }
        if (this.addonName === 'DATA INDEX' || this.addonName === 'DATA-INDEX' || this.addonName === 'ADAL') {
            if (testerAddonUUID != undefined) {
                addonsTestingEndpoint = `/addons/api/async/${testerAddonUUID}/tests/tests`; //run data index tests for ADAL
            } else {
                addonsTestingEndpoint = `/addons/api/async/00000000-0000-0000-0000-00000e1a571c/tests/tests`; //run data index tests for ADAL
            }
            _headers = {
                'x-pepperi-ownerid': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                'x-pepperi-secretkey': addonSk,
                Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
            };
        }
        const testResponse = await service.fetchStatus(addonsTestingEndpoint, {
            body: JSON.stringify(bodyToSend),
            method: 'POST',
            headers: _headers ? _headers : { Authorization: `Bearer ${service['client'].OAuthAccessToken}` },
        });
        return testResponse;
    }

    async runSingleDevTestOnCertainEnv(service, addonSk, bodyToSend, testerAddonUUID?) {
        let _headers;
        let addonsTestingEndpoint = `/addons/api/async/${this.addonUUID}/tests/tests`;
        if (this.addonName === 'CONFIGURATIONS') {
            _headers = {
                'x-pepperi-ownerid': '84c999c3-84b7-454e-9a86-71b7abc96554',
                'x-pepperi-secretkey': addonSk,
                Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
            };
        }
        if (this.addonName === 'DATA INDEX' || this.addonName === 'DATA-INDEX' || this.addonName === 'ADAL') {
            if (testerAddonUUID != undefined) {
                addonsTestingEndpoint = `/addons/api/async/${testerAddonUUID}/tests/tests`; //run data index tests for ADAL
            } else {
                addonsTestingEndpoint = `/addons/api/async/00000000-0000-0000-0000-00000e1a571c/tests/tests`; //run data index tests for ADAL
            }
            _headers = {
                'x-pepperi-ownerid': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                'x-pepperi-secretkey': addonSk,
                Authorization: `Bearer ${service['client'].OAuthAccessToken}`,
            };
        }
        const testResponse = await service.fetchStatus(addonsTestingEndpoint, {
            body: JSON.stringify(bodyToSend),
            method: 'POST',
            headers: _headers ? _headers : { Authorization: `Bearer ${service['client'].OAuthAccessToken}` },
        });
        return testResponse;
    }

    async getDependenciesOfAddon(service: GeneralService, addonUUID, varPass) {
        debugger;
        const latestVer = (
            await service.fetchStatus(
                `${service['client'].BaseURL.replace(
                    'papi-eu',
                    'papi',
                )}/var/addons/versions?where=AddonUUID='${addonUUID}'AND Available=1&order_by=CreationDateTime DESC`,
                {
                    method: `GET`,
                    headers: {
                        Authorization: `Basic ${Buffer.from(varPass).toString('base64')}`,
                    },
                },
            )
        ).Body[0];
        const latestVerPublishConfig = JSON.parse(latestVer.PublishConfig);
        const dependenciesFromPublishConfig = latestVerPublishConfig.Dependencies;
        let dependeciesUUIDs: any[] = [];
        if (dependenciesFromPublishConfig !== undefined && Object.entries(dependenciesFromPublishConfig).length !== 0) {
            dependeciesUUIDs = await this.buildTheDependencyArray(service, dependenciesFromPublishConfig);
        }
        return dependeciesUUIDs;
    }

    async buildTheDependencyArray(service: GeneralService, dependenciesFromPublishConfig) {
        //map the dependency addons to thier real name in VAR
        const allAddonDependencys = await service.fetchStatus('/configuration_fields?key=AddonsForDependencies');
        const allAddonDependencysAsObject = JSON.parse(allAddonDependencys.Body.Value);
        const arrayOfAllUUIDs: any[] = [];
        debugger;
        for (const dependecyAddon in dependenciesFromPublishConfig) {
            if (allAddonDependencysAsObject[dependecyAddon] === undefined) {
                throw new Error(
                    `Error: The Name: '${dependecyAddon}' Is Not A Real Dependency Name, Call: /configuration_fields?key=AddonsForDependencies And See`,
                );
            }
            const depObj = {};
            depObj[dependecyAddon] = [allAddonDependencysAsObject[dependecyAddon], ''];
            arrayOfAllUUIDs.push(depObj);
        }
        return arrayOfAllUUIDs;
    }
}
