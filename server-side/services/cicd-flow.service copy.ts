import { reportBuildStarted, reportToTeams, reportToTeamsMessage } from '../ui-tests/tests/test.index';
import GeneralService from './general.service';
import { initiateTester } from './general.service';

export class CiCdFlow {
    service: GeneralService;
    base64VARCredentialsProd;
    base64VARCredentialsEU;
    base64VARCredentialsSB;
    kmsSecret;
    adminUser = 'automation24@pepperitest.com';
    adminPass = 'Aa123456';

    constructor(
        public generalService: GeneralService,
        base64VARCredentialsProd: string,
        base64VARCredentialsEU: string,
        base64VARCredentialsSB: string,
    ) {
        this.service = generalService;
        this.base64VARCredentialsProd = base64VARCredentialsProd;
        this.base64VARCredentialsEU = base64VARCredentialsEU;
        this.base64VARCredentialsSB = base64VARCredentialsSB;
    }

    async jenkinsDoubleJobTestRunner(
        addonName: string,
        addonUUID: string,
        jobPathPROD,
        jobPathEU,
        jobPathSB,
        buildToken: string,
        jobPathPROD2?,
        jobPathEU2?,
        jobPathSB2?,
    ) {
        const {
            JenkinsBuildResultsAllEnvs,
            latestRunProd,
            latestRunEU,
            latestRunSB,
            addonEntryUUIDProd,
            addonEntryUUIDEu,
            addonEntryUUIDSb,
            addonVersionProd,
            addonVersionEU,
            addonVersionSb,
        } = await this.jenkinsSingleJobTestRunner(
            this.adminUser,
            this.adminPass,
            addonName,
            addonUUID,
            jobPathPROD,
            jobPathEU,
            jobPathSB,
            buildToken,
        );
        let didFailFirstTest = false;
        for (let index = 0; index < JenkinsBuildResultsAllEnvs.length; index++) {
            const resultAndEnv = JenkinsBuildResultsAllEnvs[index];
            if (resultAndEnv[0] === 'FAILURE') {
                didFailFirstTest = true;
                break;
            }
        }
        let JenkinsBuildResultsAllEnvs2;
        let latestRunProd2;
        let latestRunEU2;
        let latestRunSB2;
        let jobPathToReturnProd = jobPathPROD;
        let jobPathToReturnSB = jobPathSB;
        let jobPathToReturnEU = jobPathEU;
        if (!didFailFirstTest) {
            //if we already failed - dont run second part just keep running to the end
            console.log(`first part of ${addonName} tests passed - running 2nd part of ${addonName} approvement tests`);
            if (jobPathPROD2 && jobPathSB2 && jobPathEU2) {
                JenkinsBuildResultsAllEnvs2 = await Promise.all([
                    //if well fail here - well get to the regular reporting etc
                    this.service.runJenkinsJobRemotely(
                        this.kmsSecret,
                        `${jobPathPROD2}/build?token=${buildToken}`,
                        `Test - ${addonName} Part 2 - Prod`,
                    ),
                    this.service.runJenkinsJobRemotely(
                        this.kmsSecret,
                        `${jobPathEU2}/build?token=${buildToken}`,
                        `Test - ${addonName} Part 2 - EU`,
                    ),
                    this.service.runJenkinsJobRemotely(
                        this.kmsSecret,
                        `${jobPathSB2}/build?token=${buildToken}`,
                        `Test - ${addonName} Part 2 - SB`,
                    ),
                ]);
                latestRunProd2 = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathPROD2);
                latestRunEU2 = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathEU2);
                latestRunSB2 = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathSB2);
                jobPathToReturnProd = jobPathPROD2;
                jobPathToReturnSB = jobPathSB2;
                jobPathToReturnEU = jobPathEU2;
            } else if (jobPathPROD2) {
                JenkinsBuildResultsAllEnvs2 = await Promise.all([
                    //if well fail here - well get to the regular reporting etc
                    this.service.runJenkinsJobRemotely(
                        this.kmsSecret,
                        `${jobPathPROD2}/build?token=${buildToken}`,
                        `Test - ${addonName} Part 2 - Prod`,
                    ),
                ]);
                latestRunProd2 = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathPROD2);
                jobPathToReturnProd = jobPathPROD2;
            }
        }
        const latestRunProdReturn = latestRunProd2 ? latestRunProd2 : latestRunProd;
        const latestRunEUReturn = latestRunEU2 ? latestRunEU2 : latestRunEU;
        const latestRunSBReturn = latestRunSB2 ? latestRunSB2 : latestRunSB;
        const JenkinsBuildResultsAllEnvsToReturn = JenkinsBuildResultsAllEnvs2
            ? JenkinsBuildResultsAllEnvs2
            : JenkinsBuildResultsAllEnvs;
        return {
            addonEntryUUIDProd,
            addonEntryUUIDEu,
            addonEntryUUIDSb,
            latestRunProdReturn,
            latestRunEUReturn,
            latestRunSBReturn,
            JenkinsBuildResultsAllEnvsToReturn,
            addonVersionProd,
            addonVersionEU,
            addonVersionSb,
            jobPathToReturnProd,
            jobPathToReturnSB,
            jobPathToReturnEU,
        };
    }

    async jenkinsSingleJobTestRunner(
        email,
        pass,
        addonName: string,
        addonUUID: string,
        jobPathPROD,
        jobPathEU,
        jobPathSB,
        buildToken: string,
    ) {
        const responseProd = await this.service.fetchStatus(
            `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsProd}`,
                },
            },
        );
        const addonVersionProd = responseProd.Body[0].Version;
        const addonEntryUUIDProd = responseProd.Body[0].UUID;
        const responseEu = await this.service.fetchStatus(
            `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsEU}`,
                },
            },
        );
        const addonVersionEU = responseEu.Body[0].Version;
        const addonEntryUUIDEu = responseEu.Body[0].UUID;
        const responseSb = await this.service.fetchStatus(
            `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsSB}`,
                },
            },
        );
        const addonVersionSb = responseSb.Body[0].Version;
        const addonEntryUUIDSb = responseSb.Body[0].UUID;
        if (
            addonVersionSb !== addonVersionEU ||
            addonVersionProd !== addonVersionEU ||
            addonVersionProd !== addonVersionSb
        ) {
            const errorString = `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`;
            await reportToTeamsMessage(addonName, addonUUID, addonVersionProd, errorString, this.service);
            throw new Error(errorString);
        }
        console.log(`Asked To Run: '${addonName}' (${addonUUID}), On Version: ${addonVersionProd}`);
        await reportBuildStarted(addonName, addonUUID, addonVersionProd, this.service);
        this.kmsSecret = await this.service.getSecretfromKMS(this.adminUser, this.adminPass, 'JenkinsBuildUserCred');
        const JenkinsBuildResultsAllEnvs = await Promise.all([
            this.service.runJenkinsJobRemotely(
                this.kmsSecret,
                `${jobPathPROD}/build?token=${buildToken}`,
                `Test - ${addonName} - Prod`,
            ),
            this.service.runJenkinsJobRemotely(
                this.kmsSecret,
                `${jobPathEU}/build?token=${buildToken}`,
                `Test - ${addonName} - EU`,
            ),
            this.service.runJenkinsJobRemotely(
                this.kmsSecret,
                `${jobPathSB}/build?token=${buildToken}`,
                `Test - ${addonName} - SB`,
            ),
        ]);
        const latestRunProd = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathPROD);
        const latestRunEU = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathEU);
        const latestRunSB = await this.service.getLatestJenkinsJobExecutionId(this.kmsSecret, jobPathSB);
        return {
            JenkinsBuildResultsAllEnvs,
            latestRunProd,
            latestRunEU,
            latestRunSB,
            addonEntryUUIDProd,
            addonEntryUUIDEu,
            addonEntryUUIDSb,
            addonVersionProd,
            addonVersionEU,
            addonVersionSb,
        };
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

    async unavailableVersionAndReportMessage(
        addonName,
        addonUUID,
        addonVersion,
        errorString,
        addonEntryUUIDEu,
        addonEntryUUIDSb,
        addonEntryUUIDProd,
    ) {
        await reportToTeamsMessage(addonName, addonUUID, addonVersion, errorString, this.service);
        await Promise.all([
            this.unavailableAddonVersion(
                'prod',
                addonName,
                addonEntryUUIDEu,
                addonVersion,
                addonUUID,
                this.base64VARCredentialsEU,
            ),
            this.unavailableAddonVersion(
                'prod',
                addonName,
                addonEntryUUIDProd,
                addonVersion,
                addonUUID,
                this.base64VARCredentialsProd,
            ),
            this.unavailableAddonVersion(
                'stage',
                addonName,
                addonEntryUUIDSb,
                addonVersion,
                addonUUID,
                this.base64VARCredentialsSB,
            ),
        ]);
    }

    async resultParser(
        JenkinsBuildResultsAllEnvs,
        addonEntryUUIDEu,
        addonEntryUUIDProd,
        addonEntryUUIDSb,
        addonVersionEU,
        addonVersionProd,
        addonVersionSb,
        addonUUID,
        addonName,
        jobPathPROD,
        latestRunProd,
        jobPathEU,
        latestRunEU,
        jobPathSB,
        latestRunSB,
    ) {
        const passingEnvs: string[] = [];
        const failingEnvs: string[] = [];
        let isOneOfTestFailed = false;
        for (let index = 0; index < JenkinsBuildResultsAllEnvs.length; index++) {
            const resultAndEnv = JenkinsBuildResultsAllEnvs[index];
            if (resultAndEnv[0] === 'FAILURE') {
                isOneOfTestFailed = true;
                failingEnvs.push(resultAndEnv[1]);
            }
        }
        if (isOneOfTestFailed) {
            await this.unavailableVersionAfterAppTestFail(
                addonEntryUUIDEu,
                addonEntryUUIDProd,
                addonEntryUUIDSb,
                addonVersionEU,
                addonVersionProd,
                addonVersionSb,
                addonUUID,
                this.service,
                this.base64VARCredentialsEU,
                this.base64VARCredentialsProd,
                this.base64VARCredentialsSB,
                addonName,
            );
        }
        // debugger;
        if (!failingEnvs.includes('EU')) {
            passingEnvs.push('EU');
        }
        if (!failingEnvs.includes('Stage') && !failingEnvs.includes('Staging')) {
            passingEnvs.push('Stage');
        }
        if (!failingEnvs.includes('Production')) {
            passingEnvs.push('Production');
        }
        //3. send to Teams
        await reportToTeams(
            this.service,
            this.adminUser,
            this.adminPass,
            addonName,
            addonUUID,
            addonVersionProd,
            passingEnvs,
            failingEnvs,
            false,
            null,
            null,
            null,
            null,
            jobPathPROD,
            latestRunProd,
            jobPathEU,
            latestRunEU,
            jobPathSB,
            latestRunSB,
        );

        //4. run again on prev version to make tests green again
        if (failingEnvs.includes('Production') || failingEnvs.includes('EU') || failingEnvs.includes('Stage')) {
            const response = await this.getLatestAvailableVersionAndValidateAllEnvsAreSimilar(addonUUID, this.service);
            console.log(
                `Runnig: '${addonName}' (${addonUUID}), AGAIN AS IT FAILED ON VERSION: ${addonVersionProd} , THIS TIME On Version: ${response[0]}`,
            );
            const addonJenkToken = this.convertAddonNameToToken(addonName);
            JenkinsBuildResultsAllEnvs = await Promise.all([
                this.service.runJenkinsJobRemotely(
                    this.kmsSecret,
                    `${jobPathPROD}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
                this.service.runJenkinsJobRemotely(
                    this.kmsSecret,
                    `${jobPathEU}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
                this.service.runJenkinsJobRemotely(
                    this.kmsSecret,
                    `${jobPathSB}/build?token=${addonJenkToken}ApprovmentTests`,
                    `Re-Run Of ${addonName}`,
                ),
            ]);
        }
    }

    async unavailableVersionAfterAppTestFail(
        addonEntryUUIDEu,
        addonEntryUUIDProd,
        addonEntryUUIDSb,
        addonVersionEU,
        addonVersionProd,
        addonVersionSb,
        addonUUID,
        service,
        base64VARCredentialsEU,
        base64VARCredentialsProd,
        base64VARCredentialsSB,
        addonName,
    ) {
        const bodyToSendVAREU = {
            UUID: addonEntryUUIDEu,
            Version: addonVersionEU,
            Available: false,
            AddonUUID: addonUUID,
        };
        const varResponseEU = await service.fetchStatus(
            `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${base64VARCredentialsEU}`,
                },
                body: JSON.stringify(bodyToSendVAREU),
            },
        );
        const bodyToSendVARProd = {
            UUID: addonEntryUUIDProd,
            Version: addonVersionProd,
            Available: false,
            AddonUUID: addonUUID,
        };
        const varResponseProd = await service.fetchStatus(
            `https://papi.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${base64VARCredentialsProd}`,
                },
                body: JSON.stringify(bodyToSendVARProd),
            },
        );
        const bodyToSendVARSb = {
            UUID: addonEntryUUIDSb,
            Version: addonVersionSb,
            Available: false,
            AddonUUID: addonUUID,
        };
        const varResponseSb = await service.fetchStatus(
            `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Version='${addonVersionEU}' AND Available=1`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${base64VARCredentialsSB}`,
                },
                body: JSON.stringify(bodyToSendVARSb),
            },
        );
        if (varResponseEU.Ok !== true) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseEU.Ok}`,
            );
        }
        if (varResponseEU.Status !== 200) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseEU.Status}`,
            );
        }
        if (varResponseEU.Body.AddonUUID !== addonUUID) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseEU.Body.AddonUUID} instead of ${addonUUID}`,
            );
        }
        if (varResponseEU.Body.Version !== addonVersionEU) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseEU.Body.Version} instead of ${addonVersionEU}`,
            );
        }
        if (varResponseEU.Body.Available !== false) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseEU.Body.Available} instead of false`,
            );
        }
        console.log(`${addonName}, version: ${addonVersionEU}  on EU became unavailable: Approvment tests didnt pass`);
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
        if (varResponseProd.Body.Version !== addonVersionProd) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseProd.Body.Version} instead of ${addonVersionProd}`,
            );
        }
        if (varResponseProd.Body.Available !== false) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseProd.Body.Available} instead of false`,
            );
        }
        console.log(
            `${addonName}, version: ${addonVersionProd}  on Production became unavailable: Approvment tests didnt pass`,
        );
        if (varResponseSb.Ok !== true) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error OK: ${varResponseSb.Ok}`,
            );
        }
        if (varResponseSb.Status !== 200) {
            throw new Error(
                `Error: calling var to make ${addonName} unavailable returned error Status: ${varResponseSb.Status}`,
            );
        }
        if (varResponseSb.Body.AddonUUID !== addonUUID) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-UUID: ${varResponseSb.Body.AddonUUID} instead of ${addonUUID}`,
            );
        }
        if (varResponseSb.Body.Version !== addonVersionSb) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-VERSION: ${varResponseSb.Body.Version} instead of ${addonVersionSb}`,
            );
        }
        if (varResponseSb.Body.Available !== false) {
            throw new Error(
                `Error: var call to make ${addonName} unavailable returned WRONG ADDON-AVALIBILITY: ${varResponseSb.Body.Available} instead of false`,
            );
        }
        console.log(
            `${addonName}, version: ${addonVersionSb} on Staging became unavailable: Approvment tests didnt pass`,
        );
    }

    async getLatestAvailableVersionAndValidateAllEnvsAreSimilar(addonUUID, service) {
        const responseProd = await service.fetchStatus(
            `https://papi.pepperi.com/v1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsProd}`,
                },
            },
        );
        const addonVersionProd = responseProd.Body[0].Version;
        const addonEntryUUIDProd = responseProd.Body[0].UUID;
        const responseEu = await service.fetchStatus(
            `https://papi-eu.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsEU}`,
                },
            },
        );
        const addonVersionEU = responseEu.Body[0].Version;
        const addonEntryUUIDEu = responseEu.Body[0].UUID;
        const responseSb = await service.fetchStatus(
            `https://papi.staging.pepperi.com/V1.0/var/addons/versions?where=AddonUUID='${addonUUID}' AND Available=1&order_by=CreationDateTime DESC`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${this.base64VARCredentialsSB}`,
                },
            },
        );
        const addonVersionSb = responseSb.Body[0].Version;
        const addonEntryUUIDSb = responseSb.Body[0].UUID;
        if (
            addonVersionSb !== addonVersionEU ||
            addonVersionProd !== addonVersionEU ||
            addonVersionProd !== addonVersionSb
        ) {
            throw new Error(
                `Error: Latest Avalibale Addon Versions Across Envs Are Different: prod - ${addonVersionProd}, sb - ${addonVersionSb}, eu - ${addonVersionEU}`,
            );
        }
        return [
            addonVersionProd,
            addonEntryUUIDProd,
            addonVersionEU,
            addonEntryUUIDEu,
            addonVersionSb,
            addonEntryUUIDSb,
        ];
    }

    convertAddonNameToToken(addonName) {
        switch (addonName) {
            case 'ADAL':
                return 'ADAL';
            case 'PFS':
            case 'PEPPERI-FILE-STORAGE':
                return 'PFS';
            case 'DIMX':
                return 'DIMX';
            case 'DATA INDEX':
            case 'DATA-INDEX':
                return 'DATAINDEX';
            case 'RESOURCE LIST':
            case 'RESOURCE-LIST':
                return 'PNSApprovmentTests';
            case 'GENERIC-RESOURCE':
            case 'GENERIC RESOURCE':
                return 'COREApprovmentTests';
            case 'CPI-DATA': //new teams
            case 'ADDONS-CPI-DATA':
            case 'CPI DATA':
                return 'CPIDATAApprovmentTests';
            case 'PNS':
                return 'PNSApprovmentTests';
            case 'USER-DEFINED-COLLECTIONS':
            case 'UDC':
                return 'UDCApprovmentTests';
            case 'SCHEDULER':
                return 'SchedulerApprovmentTests';
        }
    }
}
