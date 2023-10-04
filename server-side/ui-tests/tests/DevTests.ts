import GeneralService, { initiateTester } from "../../services/general.service";

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

    constructor(addonName: string, varPass, varPassEU, varPassSB, adminBaseUserGeneralService, adminBaseUserEmail, adminBaseUserPass) {
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
            default:
                return 'none';
        }
    }

    installDependencies() {

    }

    async validateAllVersionsAreEqualBetweenEnvs() {
        let latestVersionOfTestedAddonProd,
            addonEntryUUIDProd,
            latestVersionOfTestedAddonEu,
            addonEntryUUIDEU,
            latestVersionOfTestedAddonSb,
            addonEntryUUIDSb;
        try {
            [latestVersionOfTestedAddonProd, addonEntryUUIDProd] = await (await this.resolveUserPerTest2())[0].generalService.getLatestAvailableVersion(
                this.addonUUID,
                this.varPass,
                null,
                'prod',
            );
            [latestVersionOfTestedAddonEu, addonEntryUUIDEU] = await (await this.resolveUserPerTest2())[1].generalService.getLatestAvailableVersion(
                this.addonUUID,
                this.varPassEU,
                null,
                'prod',
            );
            [latestVersionOfTestedAddonSb, addonEntryUUIDSb] = await (await this.resolveUserPerTest2())[2].generalService.getLatestAvailableVersion(
                this.addonUUID,
                this.varPassSB,
                null,
                'stage',
            );
        } catch (error) {
            debugger;
            const errorString = `Error: Couldn't Get Latest Available Versions Of ${this.addonName}: ${(error as any).message
                }`;
            await this.reportToTeamsMessage(this.addonName);
            throw new Error(errorString);
        }
        if (
            latestVersionOfTestedAddonSb !== latestVersionOfTestedAddonEu ||
            latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonEu ||
            latestVersionOfTestedAddonProd !== latestVersionOfTestedAddonSb
        ) {
            const errorString = `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${latestVersionOfTestedAddonProd}, sb - ${latestVersionOfTestedAddonSb}, eu - ${latestVersionOfTestedAddonEu}`;
            debugger;
            await this.reportToTeamsMessage(this.addonName);
            await Promise.all([
                this.unavailableAddonVersion(
                    'prod',
                    this.addonName,
                    addonEntryUUIDEU,
                    latestVersionOfTestedAddonProd,
                    this.addonUUID,
                    this.varPassEU,
                ),
                this.unavailableAddonVersion(
                    'prod',
                    this.addonName,
                    addonEntryUUIDProd,
                    latestVersionOfTestedAddonProd,
                    this.addonUUID,
                    this.varPass,
                ),
                this.unavailableAddonVersion(
                    'stage',
                    this.addonName,
                    addonEntryUUIDSb,
                    latestVersionOfTestedAddonProd,
                    this.addonUUID,
                    this.varPassSB,
                ),
            ]);
            throw new Error(errorString);
        } else {
            this.addonVersion = latestVersionOfTestedAddonProd;
        }
    }

    async getTestNames() {
        const response = (
            await (await this.resolveUserPerTest2())[1].generalService.fetchStatus(`/addons/api/${this.addonUUID}/tests/tests`, {
                method: 'GET',
            })
        ).Body;
        let toReturn = response.map((jsonData) => JSON.stringify(jsonData.Name));
        toReturn = toReturn.map((testName) => testName.replace(/"/g, ''));
        return toReturn;
    }

    async reportToTeamsMessage(error) {
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
        const monitoringResponse = await this.adminBaseUserGeneralService.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
            method: 'POST',
            headers: {
                'X-Pepperi-SecretKey': testAddonSecretKey,
                'X-Pepperi-OwnerID': testAddonUUID,
            },
            body: JSON.stringify(bodyToSend),
        });
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
        const monitoringResponse = await this.adminBaseUserGeneralService.fetchStatus('https://papi.pepperi.com/v1.0/system_health/notifications', {
            method: 'POST',
            headers: {
                'X-Pepperi-SecretKey': await this.adminBaseUserGeneralService.getSecret()[1],
                'X-Pepperi-OwnerID': 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
            },
            body: JSON.stringify(bodyToSend),
        });
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
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'QAWebHook');
            case 'PAPI-DATA-INDEX':
            case 'PAPI INDEX': //evgeny todo
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'PapiDataIndexWebHook');
            case 'SYNC':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'SyncTeamsWebHook');
            case 'ADAL': //new teams
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'ADALTeamsWebHook');
            case 'NEBULA':
            case 'FEBULA': //new teams
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'NebulaTeamsWebHook');
            case 'DIMX':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'DIMXTeamsWebHook');
            case 'DATA INDEX': //new teams
            case 'DATA-INDEX':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'DataIndexTeamsWebHook');
            case 'PFS':
            case 'PEPPERI-FILE-STORAGE':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'PFSTeamsWebHook');
            case 'PNS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'PNSTeamsWebHook');
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'UDCTeamsWebHook');
            case 'SCHEDULER':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'SchedulerTeamsWebHook');
            case 'CPI-DATA': //new teams
            case 'CPI DATA':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'ADALTeamsWebHook');
            case 'CORE': //new teams
            case 'CORE-GENERIC-RESOURCES':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'CORETeamsWebHook');
            case 'RESOURCE-LIST': //new teams
            case 'RESOURCE LIST':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'ResourceListTeamsWebHook');
            case 'UDB':
            case 'USER DEFINED BLOCKS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'UDBTeamsWebHook');
            case 'CONFIGURATIONS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'CONFIGURATIONSTeamsWebHook');
            case 'RELATED-ITEMS':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'RelatedItemsTeamsWebHook');
            case 'GENERIC-RESOURCE': //new teams
            case 'GENERIC RESOURCE':
                return await this.adminBaseUserGeneralService.getSecretfromKMS(this.adminBaseUserEmail, this.adminBaseUserPass, 'GenericResourceTeamsWebHook');
        }
    }

    async resolveUserPerTest2(): Promise<DevTestUser[]> {
        const usreEmailList = this.resolveUserPerTest();
        const userListToReturn: DevTestUser[] = [];
        for (let index = 0; index < usreEmailList.length; index++) {
            const userEmail = usreEmailList[index];
            const userPass = "Aa123456";
            const userEnv = userEmail.toLocaleUpperCase().includes('EU') ? 'EU' : userEmail.toLocaleUpperCase().includes('SB') ? 'SB' : 'PRDO';
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
                return ['syncNeo4JEU@pepperitest.com', 'syncNeo4JSB@pepperitest.com']; //'syncNeo4JProd@pepperitest.com',
            case 'CORE':
            case 'CORE-GENERIC-RESOURCES':
                return ['CoreAppEU@pepperitest.com', 'CoreAppProd@pepperitest.com', 'CoreAppSB@pepperitest.com'];
            case 'PEPPERI-FILE-STORAGE':
            case 'PFS':
                return ['PfsCpiTestEU@pepperitest.com', 'PfsCpiTestProd@pepperitest.com', 'PfsCpiTestSB@pepperitest.com'];
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
            throw new Error(`Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseProd.Ok}`);
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

}