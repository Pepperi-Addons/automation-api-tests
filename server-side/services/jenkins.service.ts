import GeneralService, { FetchStatusResponse } from './general.service';

export class JenkinsUtils {
    generalService: GeneralService;

    constructor(generalService: GeneralService) {
        this.generalService = generalService;
    }

    async runJenkinsJobRemotely(buildUserCredentials: string, jobPath: string, jobName: string): Promise<string[]> {
        const base64Credentials = Buffer.from(buildUserCredentials).toString('base64');
        const jobQueueId = await this.startJenkinsJobRemotely(base64Credentials, jobPath);
        console.log(`started ${jobName} Jenkins job with queue id: ${jobQueueId}`);
        // const jobNameAsUrlSafe = encodeURI(jobName);
        await this.pollJenkinsEndPointUntillJobStarted(base64Credentials, jobPath, jobQueueId);
        const JenkinBuildResult = await this.pollJenkinsEndPointUntillJobEnded(base64Credentials, jobName, jobPath);
        if (jobPath.includes('Production')) {
            return [JenkinBuildResult, 'Production'];
        }
        if (jobPath.includes('EU')) {
            return [JenkinBuildResult, 'EU'];
        }
        if (jobPath.includes('Stage')) {
            return [JenkinBuildResult, 'Stage'];
        }
        return [JenkinBuildResult];
    }

    async startJenkinsJobRemotely(base64Credentials: string, jobPath: string) {
        const jenkinsBaseUrl = 'https://admin-box.pepperi.com/job/';
        const jobRemoteURL = jenkinsBaseUrl + jobPath;
        const jenkinsStartingJobResponse = await this.generalService.fetchStatus(jobRemoteURL, {
            method: 'GET',
            headers: {
                Authorization: `Basic ` + base64Credentials,
            },
        });
        if (jenkinsStartingJobResponse.Status !== 201) {
            throw `ERROR STATUS WHEN CALLING: ${jobRemoteURL}, GOT ${jenkinsStartingJobResponse.Status} instead OF 201`;
        }
        if (jenkinsStartingJobResponse.Ok !== true) {
            throw `ERROR STATUS WHEN CALLING: ${jobRemoteURL}, GOT ${jenkinsStartingJobResponse.Ok} instead of TRUE`;
        }
        if (!jenkinsStartingJobResponse.Headers.location.includes('https://admin-box.pepperi.com/queue/item/')) {
            throw `ERROR RESPONSE WHEN CALLING: ${jobRemoteURL}, GOT PREFIX LOCATION OF ${jenkinsStartingJobResponse.Headers.location} instead of https://admin-box.pepperi.com/queue/item/`;
        }
        const jenkinsLocationSplit = jenkinsStartingJobResponse.Headers.location.split('/');
        const jenkinsRunQueueNumber = jenkinsLocationSplit[jenkinsLocationSplit.length - 2];
        const jenkinsRunQueueNumberAsNumber = parseInt(jenkinsRunQueueNumber);
        if (isNaN(jenkinsRunQueueNumberAsNumber)) {
            throw `ERROR RESPONSE WHEN CALLING: ${jobRemoteURL}, QUEUE ID IS NOT A NUMBER: ${jenkinsRunQueueNumber}`;
        }
        return jenkinsRunQueueNumberAsNumber;
    }

    async pollJenkinsEndPointUntillJobStarted(
        buildUserCredsBase64: string,
        jobPath: string,
        //jobNameAsUrlSafe: string,
        jenkinsRunQueueNumberAsNumber: number,
    ) {
        let gottenIdFromJenkins = 0;
        let jenkinsJobResponsePolling: FetchStatusResponse = {
            Ok: false,
            Status: 0,
            Body: undefined,
            Error: undefined,
        };
        const path = jobPath.split('/build')[0];
        do {
            jenkinsJobResponsePolling = await this.generalService.fetchStatus(
                `https://admin-box.pepperi.com/job/${path}/lastBuild/api/json`,
                //https://admin-box.pepperi.com/job/API%20Testing%20Framework/job/Addon%20Approvement%20Tests/job/Test%20-%20A1%20Production%20-%20ADAL/lastBuild/api/json
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Basic ` + buildUserCredsBase64,
                    },
                },
            );
            gottenIdFromJenkins = jenkinsJobResponsePolling.Body.queueId;
            console.log(`waiting for job queue id: ${gottenIdFromJenkins} to start -- still in Jenkins Queue`);
            this.generalService.sleep(4500);
        } while (gottenIdFromJenkins !== jenkinsRunQueueNumberAsNumber);
        const jenkinsJobName = jenkinsJobResponsePolling.Body.fullDisplayName;
        console.log(`job: ${jenkinsJobName} STARTED execution`);
        return;
    }

    async pollJenkinsEndPointUntillJobEnded(
        buildUserCredsBase64: string,
        jobName: string,
        jobPath: string,
    ): Promise<string> {
        let gottenResultFromJenkins = '';
        let jenkinsJobResponsePolling: FetchStatusResponse = {
            Ok: false,
            Status: 0,
            Body: undefined,
            Error: undefined,
        };
        const path = jobPath.split('/build')[0];
        do {
            jenkinsJobResponsePolling = await this.generalService.fetchStatus(
                `https://admin-box.pepperi.com/job/${path}/lastBuild/api/json`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Basic ` + buildUserCredsBase64,
                    },
                },
            );
            gottenResultFromJenkins = jenkinsJobResponsePolling.Body.result;
            console.log(
                `${jobName}: received result is ${gottenResultFromJenkins} ${
                    gottenResultFromJenkins === null
                        ? '(still running)'
                        : typeof gottenResultFromJenkins === 'undefined'
                        ? '(networking error should be resolved)'
                        : '(finished)'
                } `,
            );
            this.generalService.sleep(4500);
            // debugger;
        } while (gottenResultFromJenkins === null || typeof gottenResultFromJenkins === 'undefined');
        const jenkinsJobResult = jenkinsJobResponsePolling.Body.result;
        const jenkinsJobName = jenkinsJobResponsePolling.Body.fullDisplayName;
        console.log(`job: ${jenkinsJobName} is ended with status: ${jenkinsJobResult} `);
        return jenkinsJobResult;
    }
}
