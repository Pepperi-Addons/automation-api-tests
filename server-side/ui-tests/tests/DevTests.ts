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

export class DevTest {
    public addonName: string;
    public addonUUID: string;
    public addonTestsURL: string;
    public listOfTests: string[] = [];
    public channelToReportURL: string;
    public userList: DevTestUser[] = [];
    public varPass;
    public varPassEU;
    public varPassSB;
    public adminBaseUserGeneralService;
    public adminBaseUserEmail;
    public adminBaseUserPass;
    public addonVersion;
    public addonEntryUUIDProd;
    public addonEntryUUIDEU;
    public addonEntryUUIDSb;
    public devPassingEnvs: string[] = [];
    public devFailedEnvs: string[] = [];
    public failedSuitesEU: any[] = [];
    public failedSuitesProd: any[] = [];
    public failedSuitesSB: any[] = [];
    public euUser;
    public prodUser;
    public sbUser;

    constructor(
        addonName: string,
        varPass,
        varPassEU,
        varPassSB,
        adminBaseUserGeneralService: GeneralService,
        adminBaseUserEmail,
        adminBaseUserPass,
    ) {
        this.addonName = addonName;
        this.addonUUID = this.convertNameToUUIDForDevTests(addonName.toUpperCase());
        this.addonTestsURL = `/addons/api/async/${this.addonUUID}/tests/tests`;
        this.channelToReportURL = '';
        this.varPass = varPass;
        this.varPassEU = varPassEU;
        this.varPassSB = varPassSB;
        this.adminBaseUserGeneralService = adminBaseUserGeneralService;
        this.adminBaseUserEmail = adminBaseUserEmail;
        this.adminBaseUserPass = adminBaseUserPass;
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

    async installDependencies() {
        const userList = await this.resolveUserPerTest2();
        for (let index = 0; index < userList.length; index++) {
            const user = userList[index];
            const varPass = user.env === 'EU' || user.env === 'PROD' ? this.varPass : this.varPassSB;
            try {
                await this.installDependenciesInternal(user.email, user.env, varPass);
            } catch (error) {
                const errorString = `Error: Got Exception While Trying To Upgrade / Install ${
                    this.addonName
                }, Got Exception: ${(error as any).message}, On User: ${user.email}, Making ${
                    this.addonName
                } Unavailable As We Coludn't Install It`;
                await this.unavailableVersion();
                await this.reportToTeamsMessage(errorString);
                throw new Error(errorString);
            }
        }
    }

    async valdateTestedAddonLatestVersionIsInstalled() {
        const arrayOfResponses: boolean[] = [];
        const userList = await this.resolveUserPerTest2();
        for (let index = 0; index < userList.length; index++) {
            const user = userList[index];
            arrayOfResponses.push(await this.valdateTestedAddonLatestVersionIsInstalledInternal(user.email, user.env));
        }
        for (let index = 0; index < arrayOfResponses.length; index++) {
            const isTestedAddonInstalled = arrayOfResponses[index];
            if (isTestedAddonInstalled === false) {
                throw new Error(
                    `Error: didn't install ${this.addonName} - ${this.addonUUID}, version: ${this.addonVersion}`,
                );
            }
        }
    }

    async valdateTestedAddonLatestVersionIsInstalledInternal(userName, env) {
        const client = await initiateTester(userName, 'Aa123456', env);
        const service = new GeneralService(client);
        const installedAddonsArr = await service.getInstalledAddons({ page_size: -1 });
        const isInstalled = installedAddonsArr.find(
            (addon) => addon.Addon.UUID == this.addonUUID && addon.Version == this.addonVersion,
        )
            ? true
            : false;
        return isInstalled;
    }

    async installDependenciesInternal(userName, env, varPass) {
        const client = await initiateTester(userName, 'Aa123456', env);
        const service = new GeneralService(client);
        const testName = `Installing Addon Prerequisites (Dependencies) On ${
            userName.toLocaleUpperCase().includes('EU') ? 'EU' : env
        } Env, User: ${userName}, Addon: ${this.addonName}, UUID: ${this.addonUUID}, Version: ${this.addonVersion}`;
        service.PrintStartOfInstallation('Start', testName);
        //1. upgrade dependencys - basic: correct for all addons
        await service.baseAddonVersionsInstallation(varPass);
        //1.1 install addon-testing-framework - Chasky's addon which we need
        const templateAddonResponse = await service.installLatestAvalibaleVersionOfAddon(varPass, {
            automation_template_addon: ['d541b959-87af-4d18-9215-1b30dbe1bcf4', ''],
        });
        if (templateAddonResponse[0] != true) {
            throw new Error(
                `Error: can't install automation_template_addon (Chasky's Addon), got the exception: ${templateAddonResponse} from audit log`,
            );
        }
        //2. get dependencys of tested addon
        const addonDep = await this.getDependenciesOfAddon(service, this.addonUUID, varPass);
        //3. install dependencys
        if (addonDep !== undefined && addonDep.length !== 0) {
            if (this.addonUUID === '00000000-0000-0000-0000-0000000f11e5') {
                //OFS
                const depObjNebula = {};
                depObjNebula['Nebula'] = ['00000000-0000-0000-0000-000000006a91', ''];
                const depObjSync = {};
                depObjSync['sync'] = ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''];
                addonDep.push(depObjNebula);
                addonDep.push(depObjSync);
            }
            if (
                this.addonUUID !== '5122dc6d-745b-4f46-bb8e-bd25225d350a' &&
                addonDep.map((dep) => Object.keys(dep)[0]).includes('sync')
            ) {
                //New sync dependecy in case were not in sync addon but have to install it
                const depObjSync = {};
                depObjSync['pepperi-pack'] = ['4817f4fe-9ff6-435e-9415-96b1142675eb', ''];
                addonDep.splice(0, 0, depObjSync);
            }
            if (
                this.addonUUID === '00000000-0000-0000-0000-000000006a91' //Nebula
            ) {
                const depObj = {};
                depObj['Core Resources'] = ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''];
                addonDep.push(depObj);
            }
            if (this.addonUUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a') {
                //Sync
                const depObj = {};
                depObj['Core Resources'] = ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''];
                addonDep.push(depObj);
            }
            if (
                this.addonUUID === 'cebb251f-1c80-4d80-b62c-442e48e678e8' //Febula
            ) {
                const depObj = {};
                depObj['Generic Resource'] = ['df90dba6-e7cc-477b-95cf-2c70114e44e0', '%'];
                addonDep.push(depObj);
            }
            if (
                this.addonUUID === 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f' //Core
            ) {
                const depObj = {};
                depObj['User Defined Collections'] = ['122c0e9d-c240-4865-b446-f37ece866c22', ''];
                addonDep.push(depObj);
            }
            for (let index = 0; index < addonDep.length; index++) {
                const addonToInstall = addonDep[index];
                const currentAddonName = Object.entries(addonToInstall)[0][0];
                const uuid = (Object.entries(addonToInstall)[0][1] as any)[0];
                if (currentAddonName === 'papi' && this.addonUUID === '5122dc6d-745b-4f46-bb8e-bd25225d350a') {
                    addonToInstall[currentAddonName][1] = '9.6.%';
                }
                if (
                    this.addonName !== 'nebula' &&
                    currentAddonName === 'nebula' &&
                    uuid === '00000000-0000-0000-0000-000000006a91'
                ) {
                    const NebulaDep = await this.getDependenciesOfAddon(service, uuid, varPass);
                    for (let index = 0; index < NebulaDep.length; index++) {
                        const nebulaDepAddon = NebulaDep[index];
                        const installAddonResponse = (await service.installLatestAvalibaleVersionOfAddon(
                            varPass,
                            nebulaDepAddon,
                        )) as any;
                        if (!installAddonResponse[0] || installAddonResponse[0] !== true) {
                            throw new Error(
                                `Error: can't install one of Nebulas dependency's: ${
                                    Object.entries(nebulaDepAddon)[0][0]
                                } - ${(Object.entries(nebulaDepAddon)[0][1] as any)[0]}, error:${
                                    installAddonResponse[0]
                                }`,
                            );
                        }
                    }
                }
                //4. install tested addon
                const installAddonResponse = await service.installLatestAvalibaleVersionOfAddon(
                    varPass,
                    addonToInstall,
                );
                if (!installAddonResponse[0] || installAddonResponse[0] !== true) {
                    throw new Error(
                        `\nError: can't install: ${Object.keys(addonToInstall)[0]} - ${
                            addonToInstall[Object.keys(addonToInstall)[0]][0]
                        }, Recived Error: ${installAddonResponse[0]}`,
                    );
                }
            }
        }
        //5. validate actual tested addon is installed
        const addonToInstall = {};
        // this can be used to install version which is NOT the latest avalivale versions
        // const version = addonName === 'SYNC' ? '0.7.30' : '%';
        addonToInstall[this.addonName] = [this.addonUUID, '%'];
        const installAddonResponse = await service.installLatestAvalibaleVersionOfAddon(varPass, addonToInstall);
        if (installAddonResponse[0] != true) {
            throw new Error(
                `Error: can't install ${this.addonName} - ${this.addonUUID}, exception: ${installAddonResponse}`,
            );
        }
        console.log('\n#####################################################################\n');
    }

    async getEuUserEmail() {
        return this.euUser.email;
    }

    async getSbUserEmail() {
        return this.sbUser.email;
    }

    async getProdUserEmail() {
        return this.prodUser.email;
    }

    async validateAllVersionsAreEqualBetweenEnvs() {
        this.euUser = (await this.resolveUserPerTest2())[0];
        this.prodUser = (await this.resolveUserPerTest2())[1];
        this.sbUser = (await this.resolveUserPerTest2())[2];
        let latestVersionOfTestedAddonProd,
            addonEntryUUIDProd,
            latestVersionOfTestedAddonEu,
            addonEntryUUIDEU,
            latestVersionOfTestedAddonSb,
            addonEntryUUIDSb;
        try {
            [latestVersionOfTestedAddonProd, addonEntryUUIDProd] =
                await this.euUser.generalService.getLatestAvailableVersion(this.addonUUID, this.varPass, null, 'prod');
            [latestVersionOfTestedAddonEu, addonEntryUUIDEU] =
                await this.prodUser.generalService.getLatestAvailableVersion(
                    this.addonUUID,
                    this.varPass,
                    null,
                    'prod',
                );
            [latestVersionOfTestedAddonSb, addonEntryUUIDSb] =
                await this.sbUser.generalService.getLatestAvailableVersion(
                    this.addonUUID,
                    this.varPassSB,
                    null,
                    'stage',
                );
        } catch (error) {
            debugger;
            const errorString = `Error: Couldn't Get Latest Available Versions Of ${this.addonName}: ${
                (error as any).message
            }`;
            await this.reportToTeamsMessage(errorString);
            throw new Error(errorString);
        }
        if (
            latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu ||
            latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonEu ||
            latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonSb
        ) {
            const errorString = `Error: Latest Avalibale Versions Of ${this.addonName} Across Envs Are Different: Prod - ${latestVersionOfTestedAddonProd}, Staging - ${latestVersionOfTestedAddonSb}, EU - ${latestVersionOfTestedAddonEu}`;
            debugger;
            await this.reportToTeamsMessage(errorString);
            await this.unavailableVersion();
            throw new Error(errorString);
        } else {
            this.addonVersion = latestVersionOfTestedAddonProd;
            this.addonEntryUUIDProd = addonEntryUUIDProd;
            this.addonEntryUUIDEU = addonEntryUUIDEU;
            this.addonEntryUUIDSb = addonEntryUUIDSb;
        }
    }

    async getTestNames(): Promise<string[] | { ADAL: any; DataIndex: any }> {
        if (this.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
            return await this.getTestNamesADAL();
        }
        return await this.getTestNamesInt();
    }

    async getTestNamesInt() {
        const urlToGetTestsFrom = `/addons/api/${this.addonUUID}/tests/tests`;
        const response = (
            await (
                await this.getProdUser()
            ).generalService.fetchStatus(urlToGetTestsFrom, {
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

    async getTestNamesADAL() {
        const urlToGetTestsFromADAL = `/addons/api/${this.addonUUID}/tests/tests`;
        const urlToGetTestsFromDataIndex = `/addons/api/00000000-0000-0000-0000-00000e1a571c/tests/tests`;
        let responseFromAdal = (
            await (
                await this.getProdUser()
            ).generalService.fetchStatus(urlToGetTestsFromADAL, {
                method: 'GET',
            })
        ).Body;
        if (!Array.isArray(responseFromAdal)) {
            debugger;
            const numAddonVersion = Number(
                this.addonVersion
                    .split('.')
                    .splice(this.addonVersion.split('.'), this.addonVersion.split('.').length - 1, 1)
                    .join('.'),
            );
            if (numAddonVersion >= 1.8) {
                throw new Error(`${responseFromAdal.fault.faultstring}`);
            } else {
                responseFromAdal = [];
            }
        }
        const responseFromDataIndex = (
            await (
                await this.getProdUser()
            ).generalService.fetchStatus(urlToGetTestsFromDataIndex, {
                method: 'GET',
            })
        ).Body;
        let toReturnADAL = responseFromAdal.map((jsonData) => JSON.stringify(jsonData.Name));
        toReturnADAL = toReturnADAL.map((testName) => testName.replace(/"/g, ''));
        let roReturnDataIndex = responseFromDataIndex.map((jsonData) => JSON.stringify(jsonData.Name));
        roReturnDataIndex = roReturnDataIndex.map((testName) => testName.replace(/"/g, ''));
        return { ADAL: toReturnADAL, DataIndex: roReturnDataIndex };
    }

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
            let addonSk = null;
            if (this.addonName === 'DATA INDEX' || this.addonName === 'DATA-INDEX' || this.addonName === 'ADAL') {
                addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'AutomationAddonSecretKey',
                );
            }
            if (this.addonName === 'CONFIGURATIONS') {
                addonSk = await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'AutomationAddonSecretKeyConfigAddon',
                );
            }
            const euUser = await this.getEuUserEmail();
            const prodUser = await this.getProdUserEmail();
            const sbUser = await this.getSbUserEmail();
            const [devTestResponseEu, devTestResponseProd, devTestResponseSb] = await Promise.all([
                //devTestResponseEu,
                //userName, env, addonSk, bodyToSend
                this.runDevTestOnCertainEnv(euUser, 'prod', addonSk, body, testserUuid),
                this.runDevTestOnCertainEnv(prodUser, 'prod', addonSk, body, testserUuid),
                this.runDevTestOnCertainEnv(sbUser, 'stage', addonSk, body, testserUuid),
            ]);
            if (
                devTestResponseEu === undefined ||
                devTestResponseProd === undefined ||
                devTestResponseSb === undefined
            ) {
                let whichEnvs = devTestResponseEu === undefined ? 'EU,,' : '';
                whichEnvs += devTestResponseProd === undefined ? 'PRDO,' : '';
                whichEnvs += devTestResponseSb === undefined ? 'SB' : '';
                const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                await this.reportToTeamsMessage(errorString);
                throw new Error(`${errorString}`);
            }
            if (
                devTestResponseEu.Body.URI === undefined ||
                devTestResponseProd.Body.URI === undefined ||
                devTestResponseSb.Body.URI === undefined
            ) {
                let whichEnvs = devTestResponseEu.Body.URI === undefined ? 'EU,,' : '';
                whichEnvs += devTestResponseProd.Body.URI === undefined ? 'PRDO,' : '';
                whichEnvs += devTestResponseSb.Body.URI === undefined ? 'SB' : '';
                const errorString = `Error: got undefined when trying to run ${whichEnvs} tests - no EXECUTION UUID!`;
                await this.reportToTeamsMessage(errorString);
                throw new Error(`${errorString}`);
            }
            console.log(
                `####################### ${currentTestName}: EXECUTION UUIDS:\nEU - ${devTestResponseEu.Body.URI}\nPROD - ${devTestResponseProd.Body.URI}\nSB - ${devTestResponseSb.Body.URI}`,
            );
            debugger;
            const testObject = {
                name: currentTestName,
                prodExecution: devTestResponseProd.Body.URI,
                sbExecution: devTestResponseSb.Body.URI,
                euExecution: devTestResponseEu.Body.URI,
            };
            this.adminBaseUserGeneralService.sleep(1000 * 15);
            const devTestResutsEu = await this.getTestResponse(euUser, 'prod', devTestResponseEu.Body.URI);
            const devTestResultsProd = await this.getTestResponse(prodUser, 'prod', devTestResponseProd.Body.URI);
            const devTestResultsSb = await this.getTestResponse(sbUser, 'stage', devTestResponseSb.Body.URI);
            if (
                (devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                (devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')) ||
                (devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after'))
            ) {
                debugger;
                let errorString = '';
                if (
                    devTestResutsEu.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResutsEu.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage} from Audit Log, On Test:${currentTestName}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                }
                if (
                    devTestResultsProd.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResultsProd.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    errorString += `${prodUser} got the error: ${devTestResultsProd.AuditInfo.ErrorMessage} from Audit Log, On Test:${currentTestName}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                }
                if (
                    devTestResultsSb.AuditInfo.hasOwnProperty('ErrorMessage') &&
                    devTestResultsSb.AuditInfo.ErrorMessage.includes('Task timed out after')
                ) {
                    errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, On Test:${currentTestName}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                }
                await this.reportToTeamsMessage(errorString);
                await this.unavailableVersion();
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            debugger;
            //4.3. parse the response
            let testResultArrayEu;
            let testResultArrayProd;
            let testResultArraySB;
            try {
                testResultArrayEu = JSON.parse(devTestResutsEu.AuditInfo.ResultObject);
                testResultArrayProd = JSON.parse(devTestResultsProd.AuditInfo.ResultObject);
                testResultArraySB = JSON.parse(devTestResultsSb.AuditInfo.ResultObject);
            } catch (error) {
                debugger;
                let errorString = '';
                if (!devTestResutsEu.AuditInfo.ResultObject) {
                    errorString += `${euUser} got the error: ${devTestResutsEu.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName} ,EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                }
                if (!devTestResultsProd.AuditInfo.ResultObject) {
                    errorString += `${prodUser} got the error: ${devTestResultsProd.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                }
                if (!devTestResultsSb.AuditInfo.ResultObject) {
                    errorString += `${sbUser} got the error: ${devTestResultsSb.AuditInfo.ErrorMessage} from Audit Log, On Test ${currentTestName}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                }
                await this.reportToTeamsMessage(errorString);
                await this.unavailableVersion();
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            let objectToPrintEu;
            let objectToPrintProd;
            let objectToPrintSB;
            let shouldAlsoPrintVer = false;
            if (
                testResultArrayProd.results === undefined &&
                testResultArraySB.results === undefined &&
                testResultArrayEu.results === undefined &&
                testResultArrayProd.tests === undefined &&
                testResultArraySB.tests === undefined &&
                testResultArrayEu.tests === undefined
            ) {
                const errorString = `Cannot Parse Result Object, Recieved: Prod: ${JSON.stringify(
                    testResultArrayProd,
                )}, EU: ${JSON.stringify(testResultArrayEu)}, SB: ${JSON.stringify(
                    testResultArraySB,
                )}, On: ${currentTestName} Test`;
                debugger;
                await this.reportToTeamsMessage(errorString);
                await this.unavailableVersion();
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            //TODO: move the parsing to another function
            if (
                testResultArrayProd.results &&
                testResultArrayProd.results[0].suites[0].suites &&
                testResultArrayProd.results[0].suites[0].suites.length > 0
            ) {
                shouldAlsoPrintVer = true;
                objectToPrintEu = testResultArrayEu.results[0].suites[0].suites;
                objectToPrintProd = testResultArrayProd.results[0].suites[0].suites;
                objectToPrintSB = testResultArraySB.results[0].suites[0].suites;
            } else if (testResultArrayProd.results) {
                //add an if to catch the other result config also
                objectToPrintEu = testResultArrayEu.results[0].suites;
                objectToPrintProd = testResultArrayProd.results[0].suites;
                objectToPrintSB = testResultArraySB.results[0].suites;
            } else {
                objectToPrintEu = testResultArrayEu.tests;
                objectToPrintProd = testResultArrayProd.tests;
                objectToPrintSB = testResultArraySB.tests;
            }
            if (objectToPrintEu === undefined || objectToPrintProd === undefined || objectToPrintSB === undefined) {
                debugger;
                let errorString = '';
                if (!objectToPrintEu) {
                    errorString += `${euUser} got the error: ${
                        devTestResutsEu.AuditInfo.ErrorMessage
                    } from Audit Log, Recived Audit Log: ${JSON.stringify(
                        devTestResutsEu.AuditInfo,
                    )}, EXECUTION UUID: ${devTestResponseEu.Body.URI},\n`;
                }
                if (!objectToPrintProd) {
                    errorString += `${prodUser} got the error: ${
                        devTestResultsProd.AuditInfo.ErrorMessage
                    } from Audit Log, Recived Audit Log: ${JSON.stringify(
                        devTestResultsProd.AuditInfo,
                    )}, EXECUTION UUID: ${devTestResponseProd.Body.URI},\n`;
                }
                if (!objectToPrintSB) {
                    errorString += `${sbUser} got the error: ${
                        devTestResultsSb.AuditInfo.ErrorMessage
                    } from Audit Log, Recived Audit Log: ${JSON.stringify(
                        devTestResultsSb.AuditInfo,
                    )}, EXECUTION UUID: ${devTestResponseSb.Body.URI},\n`;
                }
                await this.reportToTeamsMessage(errorString);
                await this.unavailableVersion();
                throw new Error(`Error: got exception trying to parse returned result object: ${errorString} `);
            }
            console.log(
                `********* this printing is made for debugging - you can skip downward to see the prettified tests result *********`,
            );
            for (let index = 0; index < objectToPrintProd.length; index++) {
                const result = objectToPrintProd[index];
                console.log(`\n***${currentTestName} PROD result object: ${JSON.stringify(result)}***\n`);
            }
            for (let index = 0; index < objectToPrintSB.length; index++) {
                const result = objectToPrintSB[index];
                console.log(`\n***${currentTestName} SB result object: ${JSON.stringify(result)}***\n`);
            }
            for (let index = 0; index < objectToPrintEu.length; index++) {
                const result = objectToPrintEu[index];
                console.log(`\n***${currentTestName} EU result object: ${JSON.stringify(result)}***\n`);
            }
            console.log(
                `\n****************************************************** Prettified Tests Results Splitted To Envs ******************************************************\n'`,
            );
            const euResults = await this.printResultsTestObject(objectToPrintEu, euUser, 'prod', currentTestName);
            const prodResults = await this.printResultsTestObject(objectToPrintProd, prodUser, 'prod', currentTestName);
            const sbResults = await this.printResultsTestObject(objectToPrintSB, sbUser, 'stage', currentTestName);
            if (shouldAlsoPrintVer) {
                objectToPrintEu = testResultArrayEu.results[0].suites[1].suites;
                objectToPrintProd = testResultArrayProd.results[0].suites[1].suites;
                objectToPrintSB = testResultArraySB.results[0].suites[1].suites;
                await this.printResultsTestObject(objectToPrintEu, euUser, 'prod', currentTestName);
                await this.printResultsTestObject(objectToPrintProd, prodUser, 'prod', currentTestName);
                await this.printResultsTestObject(objectToPrintSB, sbUser, 'stage', currentTestName);
            }
            // debugger;
            //4.6. create the array of passing / failing tests
            // debugger;
            if (euResults.didSucceed) {
                //devPassingEnvs  devFailedEnvs   failedSuitesEU   failedSuitesProd   failedSuitesSB
                this.devPassingEnvs.push('Eu');
            } else {
                this.devFailedEnvs.push('Eu');
                this.failedSuitesEU.push({ testName: currentTestName, executionUUID: testObject.euExecution });
            }
            if (prodResults.didSucceed) {
                this.devPassingEnvs.push('Production');
            } else {
                this.devFailedEnvs.push('Production');
                this.failedSuitesProd.push({ testName: currentTestName, executionUUID: testObject.prodExecution });
            }
            if (sbResults.didSucceed) {
                this.devPassingEnvs.push('Stage');
            } else {
                this.devFailedEnvs.push('Stage');
                this.failedSuitesSB.push({ testName: currentTestName, executionUUID: testObject.sbExecution });
            }
        }
    }
    async runDevTestADAL(testNamesADAL: string[], testNamesDataIndex: string[]) {
        if (testNamesADAL.length !== 0) {
            console.log('ADAL Dev Tests: ');
            await this.runDevTestInt(testNamesADAL, this.addonUUID);
        } else {
            console.log(`No ADAL Dev Tests For Version ${this.addonVersion}`);
        }
        console.log('Data Index Dev Tests: ');
        await this.runDevTestInt(testNamesDataIndex);
    }

    async runDevTest(testNames: any) {
        if (this.addonUUID === '00000000-0000-0000-0000-00000000ada1') {
            await this.runDevTestADAL(testNames.ADAL, testNames.DataIndex);
        } else {
            await this.runDevTestInt(testNames);
        }
    }

    async calculateAndReportResults(isLocal, numOfTests) {
        const devPassingEnvs2: string[] = [];
        const devFailedEnvs2: string[] = [];
        // const testsList = await this.getTestNames();
        let jenkinsLink;
        if (
            this.devPassingEnvs.filter((v) => v === 'Eu').length === numOfTests &&
            this.devFailedEnvs.filter((v) => v === 'Eu').length === 0
        ) {
            devPassingEnvs2.push('EU');
        } else {
            devFailedEnvs2.push('EU');
        }
        if (
            this.devPassingEnvs.filter((v) => v === 'Production').length === numOfTests &&
            this.devFailedEnvs.filter((v) => v === 'Production').length === 0
        ) {
            devPassingEnvs2.push('PROD');
        } else {
            devFailedEnvs2.push('PROD');
        }
        if (
            this.devPassingEnvs.filter((v) => v === 'Stage').length === numOfTests &&
            this.devFailedEnvs.filter((v) => v === 'Stage').length === 0
        ) {
            devPassingEnvs2.push('STAGING');
        } else {
            devFailedEnvs2.push('STAGING');
        }
        // debugger;
        if (isLocal) {
            jenkinsLink = 'none, running locally';
        } else {
            const kmsSecret = await this.adminBaseUserGeneralService.getSecretfromKMS(
                this.adminBaseUserEmail,
                this.adminBaseUserPass,
                'JenkinsBuildUserCred',
            );
            const latestRun = await this.adminBaseUserGeneralService.getLatestJenkinsJobExecutionId(
                kmsSecret,
                'API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons',
            );
            jenkinsLink = `https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addons%20Api%20Tests/job/GitHubAddons/${latestRun}/console`;
        }
        if (devFailedEnvs2.length != 0) {
            debugger;
            await this.unavailableVersion();
            this.devPassingEnvs = devPassingEnvs2;
            this.devFailedEnvs = devFailedEnvs2;
            await this.reportToTeams(jenkinsLink);
            console.log('Dev Test Didnt Pass - No Point In Running Approvment');
            return false;
        } else if (!this.doWeHaveSuchAppTest(this.addonName)) {
            this.devPassingEnvs = devPassingEnvs2;
            this.devFailedEnvs = devFailedEnvs2;
            await this.reportToTeams(jenkinsLink);
        }
    }

    doWeHaveSuchAppTest(addonName: string) {
        switch (addonName) {
            //add another 'case' here when adding new addons to this mehcanisem
            case 'ADAL': {
                return true;
            }
            case 'DATA INDEX':
            case 'DATA-INDEX': {
                return true;
            }
            case 'PNS': {
                return true;
            }
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC': {
                return true;
            }
            case 'PAPI-DATA-INDEX':
            case 'PAPI INDEX': {
                return true;
            }
            case 'SCHEDULER': {
                return true;
            }
            case 'DIMX': {
                return true;
            }
            case 'DATA INDEX':
            case 'DATA-INDEX': {
                return true;
            }
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS': {
                return true;
            }
            case 'CORE-GENERIC-RESOURCES':
            case 'CORE': {
                return true;
            }
            case 'ASYNCADDON': {
                return true;
            }
            default:
                return false;
        }
    }

    async getProdUser() {
        return this.prodUser;
    }

    async reportToTeams(jenkinsLink) {
        await this.reportBuildEnded();
        const users = await this.resolveUserPerTest2();
        const userMails = users.map((user) => user.email);
        const stringUsers = userMails.join(', ');
        const uniqFailingEnvs = [...new Set(this.devFailedEnvs.map((env) => env.toUpperCase()))];
        const message = `Dev Test: ${this.addonName} - (${this.addonUUID}), Version:${
            this.addonVersion
        }, Test Users:<br>${stringUsers}<br>${
            this.devPassingEnvs.length === 0 ? '' : 'Passed On: ' + this.devPassingEnvs.join(', ') + ' |||'
        } ${
            this.devFailedEnvs.length === 0 ? '' : 'Failed On: ' + uniqFailingEnvs.join(', ')
        },<br>Link: ${jenkinsLink}`;
        const failedTestsDesc = `${
            this.failedSuitesProd.length === 0 && this.failedSuitesEU.length === 0 && this.failedSuitesSB.length === 0
                ? ''
                : 'FAILED TESTS AND EXECUTION UUIDS:<br>'
        }${
            this.failedSuitesProd.length === 0
                ? ''
                : `<br>* PROD User: ${await this.getProdUserEmail()}<br>Failed Prod Tests:<br>` +
                  this.failedSuitesProd.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>') +
                  '<br>'
        }${
            this.failedSuitesEU.length === 0
                ? ''
                : `<br>* EU User: ${await this.getEuUserEmail()}<br>Failed EU Tests:<br>` +
                  this.failedSuitesEU.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>') +
                  '<br>'
        }${
            this.failedSuitesSB.length === 0
                ? ''
                : `<br>* SB User: ${await this.getSbUserEmail()}<br>Failed SB Tests:<br>` +
                  this.failedSuitesSB.map((obj) => `${obj.testName} - ${obj.executionUUID}`).join(',<br>') +
                  '<br>'
        }`;
        const bodyToSend = {
            Name: `The Results Of Intergration Tests Written By Developer For ${this.addonName} - (${this.addonUUID}), Version: ${this.addonVersion}`,
            Description: message,
            Status: this.devPassingEnvs.length < 3 ? 'FAILED' : 'PASSED',
            Message: failedTestsDesc === '' ? '√' : failedTestsDesc,
            UserWebhook: await this.handleTeamsURL(this.addonName),
        };
        console.log(
            `####################### Dev Tests Results: ${this.addonName}, On Version ${this.addonVersion} Has ${bodyToSend.Status} #######################`,
        );
        if (bodyToSend.Message !== '~') {
            console.log(`####################### FAILED TESTS:\n ${bodyToSend.Message}`);
        }
        const monitoringResponse = await this.adminBaseUserGeneralService.fetchStatus(
            'https://papi.pepperi.com/v1.0/system_health/notifications',
            {
                method: 'POST',
                headers: {
                    'X-Pepperi-SecretKey': await this.adminBaseUserGeneralService.getSecret()[1],
                    'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                },
                body: JSON.stringify(bodyToSend),
            },
        );
        if (monitoringResponse.Ok !== true) {
            throw new Error(
                `Error: system monitor returned error OK: ${monitoringResponse.Ok}, Response: ${JSON.stringify(
                    monitoringResponse,
                )}`,
            );
        }
        if (monitoringResponse.Status !== 200) {
            throw new Error(
                `Error: system monitor returned error STATUS: ${monitoringResponse.Status}, Response: ${JSON.stringify(
                    monitoringResponse,
                )}`,
            );
        }
        if (Object.keys(monitoringResponse.Error).length !== 0) {
            throw new Error(
                `Error: system monitor returned ERROR: ${monitoringResponse.Error}, Response: ${JSON.stringify(
                    monitoringResponse,
                )}`,
            );
        }
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

    async unavailableVersion() {
        debugger;
        await Promise.all([
            this.unavailableAddonVersion(
                'prod',
                this.addonName,
                this.addonEntryUUIDEU,
                this.addonVersion,
                this.addonUUID,
                this.varPassEU,
            ),
            this.unavailableAddonVersion(
                'prod',
                this.addonName,
                this.addonEntryUUIDProd,
                this.addonVersion,
                this.addonUUID,
                this.varPass,
            ),
            this.unavailableAddonVersion(
                'stage',
                this.addonName,
                this.addonEntryUUIDSb,
                this.addonVersion,
                this.addonUUID,
                this.varPassSB,
            ),
        ]);
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

    async reportToTeamsMessage(error) {
        debugger;
        await this.reportBuildEnded();
        const message = `${error}`;
        const bodyToSend = {
            Name: `${this.addonName} Approvment Tests Status: Failed Due CI/CD Process Exception`,
            Description: `${this.addonName} - (${this.addonUUID}), Version:${this.addonVersion}, Failed!`,
            Status: 'ERROR',
            Message: message,
            UserWebhook: await this.handleTeamsURL(this.addonName),
        };
        const testAddonSecretKey = await this.adminBaseUserGeneralService.getSecret()[1];
        const testAddonUUID = await this.adminBaseUserGeneralService.getSecret()[0];
        debugger;
        const monitoringResponse = await this.adminBaseUserGeneralService.fetchStatus(
            'https://papi.pepperi.com/v1.0/system_health/notifications',
            {
                method: 'POST',
                headers: {
                    'X-Pepperi-SecretKey': testAddonSecretKey,
                    'X-Pepperi-OwnerID': testAddonUUID,
                },
                body: JSON.stringify(bodyToSend),
            },
        );
        debugger;
        if (monitoringResponse.Ok !== true) {
            throw new Error(`Error: system monitor returned error OK: ${monitoringResponse.Ok}`);
        }
        if (monitoringResponse.Status !== 200) {
            throw new Error(`Error: system monitor returned error STATUS: ${monitoringResponse.Status}`);
        }
        if (Object.keys(monitoringResponse.Error).length !== 0) {
            throw new Error(`Error: system monitor returned ERROR: ${monitoringResponse.Error}`);
        }
    }

    async reportBuildEnded() {
        const message = `${this.addonName} - (${this.addonUUID}), Version:${this.addonVersion}, Ended Testing`;
        const bodyToSend = {
            Name: `${this.addonName}, ${this.addonUUID}, ${this.addonVersion}`,
            Description: message,
            Status: 'INFO',
            Message: message,
            UserWebhook: await this.handleTeamsURL('QA'),
        };
        const monitoringResponse = await this.adminBaseUserGeneralService.fetchStatus(
            'https://papi.pepperi.com/v1.0/system_health/notifications',
            {
                method: 'POST',
                headers: {
                    'X-Pepperi-SecretKey': await this.adminBaseUserGeneralService.getSecret()[1],
                    'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                },
                body: JSON.stringify(bodyToSend),
            },
        );
        if (monitoringResponse.Ok !== true) {
            throw new Error(`Error: system monitor returned error OK: ${monitoringResponse.Ok}`);
        }
        if (monitoringResponse.Status !== 200) {
            throw new Error(`Error: system monitor returned error STATUS: ${monitoringResponse.Status}`);
        }
        if (Object.keys(monitoringResponse.Error).length !== 0) {
            throw new Error(`Error: system monitor returned ERROR: ${monitoringResponse.Error}`);
        }
    }

    async handleTeamsURL(addonName: string) {
        //-->eb26afcd-3cf2-482e-9ab1-b53c41a6adbe
        switch (addonName) {
            case 'QA':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'QAWebHook',
                );
            case 'PAPI-DATA-INDEX':
            case 'PAPI INDEX':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'PapiDataIndexWebHook',
                );
            case 'JOURNEY':
            case 'JOURNEY-TRACKER':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'JourneyTeamsWebHook',
                );
            case 'SYNC':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'SyncTeamsWebHook',
                );
            case 'ADAL': //new teams
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'ADALTeamsWebHook',
                );
            case 'NEBULA':
            case 'FEBULA': //new teams
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'NebulaTeamsWebHook',
                );
            case 'DIMX':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'DIMXTeamsWebHook',
                );
            case 'DATA INDEX': //new teams
            case 'DATA-INDEX':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'DataIndexTeamsWebHook',
                );
            case 'PFS':
            case 'PEPPERI-FILE-STORAGE':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'PFSTeamsWebHook',
                );
            case 'PNS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'PNSTeamsWebHook',
                );
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'UDCTeamsWebHook',
                );
            case 'SCHEDULER':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'SchedulerTeamsWebHook',
                );
            case 'CPI-DATA': //new teams
            case 'CPI DATA':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'ADALTeamsWebHook',
                );
            case 'CORE': //new teams
            case 'CORE-GENERIC-RESOURCES':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'CORETeamsWebHook',
                );
            case 'RESOURCE-LIST': //new teams
            case 'RESOURCE LIST':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'ResourceListTeamsWebHook',
                );
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'UDBTeamsWebHook',
                );
            case 'CONFIGURATIONS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'CONFIGURATIONSTeamsWebHook',
                );
            case 'RELATED-ITEMS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'RelatedItemsTeamsWebHook',
                );
            case 'GENERIC-RESOURCE': //new teams
            case 'GENERIC RESOURCE':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'GenericResourceTeamsWebHook',
                );
            case 'NODE': //new teams
            case 'CPI-NODE':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'CPINodeTeamsWebHook',
                );
            case 'CRAWLER':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'CRAWLERTeamsWebHook',
                );
            case 'ASYNCADDON':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'ASYNCTeamsWebHook',
                );
            case 'TRANSLATION':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(
                    this.adminBaseUserEmail,
                    this.adminBaseUserPass,
                    'TRANSLATIONTeamsWebHook',
                );
        }
    }

    async resolveUserPerTest2(): Promise<DevTestUser[]> {
        const usreEmailList = this.resolveUserPerTest();
        const userListToReturn: DevTestUser[] = [];
        for (let index = 0; index < usreEmailList.length; index++) {
            const userEmail = usreEmailList[index];
            const userPass = 'Aa123456';
            const userEnv = userEmail.toLocaleUpperCase().includes('EU')
                ? 'EU'
                : userEmail.toLocaleUpperCase().includes('SB')
                ? 'stage'
                : 'PROD';
            const client = await initiateTester(userEmail, userPass, userEnv);
            const service = new GeneralService(client);
            const devUser: DevTestUser = new DevTestUser(userEmail, userPass, userEnv, service);
            userListToReturn.push(devUser);
        }
        return userListToReturn;
    }

    resolveUserPerTest(): any[] {
        switch (this.addonName) {
            case 'DATA INDEX':
            case 'DATA-INDEX':
                return ['DataIndexEU@pepperitest.com', 'DataIndexProd@pepperitest.com', 'DataIndexSB@pepperitest.com'];
            // case 'NEBULA'://0.6.x neptune
            //     return ['NebulaTestEU@pepperitest.com', 'NebulaTestProd@pepperitest.com', 'NebulaTestSB@pepperitest.com'];
            case 'NEBULA': //0.7.x neo4j
                return ['neo4JSyncEU@pepperitest.com', 'Neo4JSyncProd@pepperitest.com', 'Neo4JSyncSB@pepperitest.com']; //
            case 'FEBULA':
                return ['febulaEU@pepperitest.com', 'febulaProd@pepperitest.com', 'febulaSB@pepperitest.com']; //
            case 'ADAL':
                return ['AdalEU@pepperitest.com', 'AdalProd@pepperitest.com', 'AdalSB@pepperitest.com'];
            case 'SYNC':
                return ['syncNeo4JEU@pepperitest.com', 'syncNeo4JProd@pepperitest.com', 'syncNeo4JSB@pepperitest.com'];
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES':
                return ['CoreAppEU@pepperitest.com', 'CoreAppProd@pepperitest.com', 'CoreAppSB@pepperitest.com'];
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS':
                return [
                    'PfsCpiTestEU@pepperitest.com',
                    'PfsCpiTestProd@pepperitest.com',
                    'PfsCpiTestSB@pepperitest.com',
                ];
            case 'CONFIGURATIONS':
                return ['configEU@pepperitest.com', 'configProd@pepperitest.com', 'configSB@pepperitest.com'];
            case 'RELATED-ITEMS':
                return [
                    'relatedItemsTestEU@pepperitest.com',
                    'relatedItemsTestProd@pepperitest.com',
                    'relatedItemsTestSB@pepperitest.com',
                ];
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return [
                    'UserDefinedBlocksEUApp2@pepperitest.com',
                    'UserDefinedBlocksEUApp5@pepperitest.com',
                    'UserDefinedBlocksSBApp2@pepperitest.com',
                ];
            case 'JOURNEY-TRACKER':
            case 'JOURNEY':
                return [
                    'JourneyTrackerTesterEU@pepperitest.com',
                    'JourneyTrackerTesterProd@pepperitest.com',
                    'JourneyTrackerTesterSB@pepperitest.com',
                ];
            case 'CPI-NODE':
            case 'NODE':
                return [
                    'CpiNodeTesterEU@pepperitest.com',
                    'CpiNodeTesterProd@pepperitest.com',
                    'CpiNodeTesterSB@pepperitest.com',
                ];
            case 'CRAWLER':
                return [
                    'crawlerTesterEU@pepperitest.com',
                    'crawlerTesterProd@pepperitest.com',
                    'crawlerTesterSB@pepperitest.com',
                ];
            case 'ASYNCADDON':
                return [
                    'AsyncCiCdTesterEU@pepperitest.com',
                    'AsyncCiCdTesterProd@pepperitest.com',
                    'AsyncCiCdTesterSB@pepperitest.com',
                ];
            case 'TRANSLATION':
                return [
                    'TranslationTesterEU@pepperitest.com',
                    'TranslationTesterProd@pepperitest.com',
                    'TranslationTesterSB@pepperitest.com',
                ];
            case 'DIMX':
                return ['DIMXAppEU@pepperitest.com', 'DIMXAppProd@pepperitest.com', 'DimxAppSB@pepperitest.com'];
            default:
                return [];
        }
    }

    async unavailableAddonVersion(env, addonName, addonEntryUUID, addonVersion, addonUUID, varCredentials) {
        const [varUserName, varPassword] = varCredentials.split(':');
        const client = await initiateTester(varUserName, varPassword, env);
        const service = new GeneralService(client);
        const bodyToSendVARProd = {
            UUID: addonEntryUUID,
            Version: addonVersion,
            Available: false,
            AddonUUID: addonUUID,
        };
        const varCredBase64 = Buffer.from(varCredentials).toString('base64');
        // const baseURL = env === 'prod' ? 'papi' : userName.includes('eu') ? 'papi-eu' : 'papi.staging';
        const varResponseProd = await service.fetchStatus(
            `/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersion}' AND Available=1`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${varCredBase64}`,
                },
                body: JSON.stringify(bodyToSendVARProd),
            },
        );
        if (varResponseProd.Ok !== true) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseProd.Ok}`,
            );
        }
        if (varResponseProd.Status !== 200) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseProd.Status}`,
            );
        }
        if (varResponseProd.Body.AddonUUID !== addonUUID) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseProd.Body.AddonUUID} instead of ${addonUUID}`,
            );
        }
        if (varResponseProd.Body.Version !== addonVersion) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseProd.Body.Version} instead of ${addonVersion}`,
            );
        }
        if (varResponseProd.Body.Available !== false) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseProd.Body.Available} instead of false`,
            );
        }
        console.log(
            `${addonName}, version: ${addonVersion}  on Production became unavailable: Approvment tests didnt pass`,
        );
    }

    async getDependenciesOfAddon(service: GeneralService, addonUUID, varPass) {
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
        for (const dependecyAddon in dependenciesFromPublishConfig) {
            const depObj = {};
            depObj[dependecyAddon] = [allAddonDependencysAsObject[dependecyAddon], ''];
            arrayOfAllUUIDs.push(depObj);
        }
        return arrayOfAllUUIDs;
    }
}
