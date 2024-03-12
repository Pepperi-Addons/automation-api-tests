import chai from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { genericReportToTeams } from './test.index';

chai.use(promised);

export async function DevTestReporter(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const testsAndJenkinsLinksList = {
        COVGIGURTIONS: {
            uuid: '84c999c3-84b7-454e-9a86-71b7abc96554',
            jenkins: {
                prod: {
                    user: 'configRegProd@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E1%20Production%20-%20Dev%20Test%20Configuration%20Addon%20CLI',
                },
                eu: {
                    user: 'configRegEU@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E1%20EU%20-%20Dev%20Test%20Configuration%20Addon%20CLI',
                },
                sb: {
                    user: 'configRegSB@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E1%20Stage%20-%20Dev%20Test%20Configuration%20Addon%20CLI',
                },
            },
        },
        SYNC: {
            uuid: '5122dc6d-745b-4f46-bb8e-bd25225d350a',
            jenkins: {
                prod: {
                    user: 'syncRegPROD@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E2%20Production%20-%20Dev%20Test%20Sync%20Addon%20CLI',
                },
                eu: {
                    user: 'syncRegEU@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E2%20EU%20-%20Dev%20Test%20Sync%20Addon%20CLI',
                },
                sb: {
                    user: 'syncRegSB@pepperitest.com',
                    jenkinsLink:
                        'API%20Testing%20Framework/job/Test%20-%20E2%20Stage%20-%20Dev%20Test%20Sync%20Addon%20CLI',
                },
            },
        },
    };

    const failedTestsAddonNames: any[] = [];
    const jenkinsBuildUserCred = await generalService.getSecretfromKMS(email, password, 'JenkinsBuildUserCred');
    const bufferedJenkinsBuildCreds = Buffer.from(jenkinsBuildUserCred).toString('base64');
    const addons = Object.keys(testsAndJenkinsLinksList);
    for (let i = 0; i < addons.length; i++) {
        const addon = addons[i];
        const jenkinsData = testsAndJenkinsLinksList[addon].jenkins;
        const jenkinsDataKeys = Object.keys(jenkinsData);
        for (let index = 0; index < jenkinsDataKeys.length; index++) {
            const jenkinsEntry = jenkinsData[jenkinsDataKeys[index]];
            const didTestPassOnJenkins = await generalService.didLastJenkinsRunSucceed(
                bufferedJenkinsBuildCreds,
                jenkinsEntry.jenkinsLink,
            );
            if (!didTestPassOnJenkins) {
                failedTestsAddonNames.push({
                    user: jenkinsEntry.user,
                    addon: addon,
                    uuid: testsAndJenkinsLinksList[addon].uuid,
                    env: jenkinsDataKeys[index],
                    jenkinsLink: jenkinsEntry.jenkinsLink,
                });
            }
        }
    }
    let messageToReport = '';
    let version = '';
    for (let index = 0; index < failedTestsAddonNames.length; index++) {
        const failedTest = failedTestsAddonNames[index];
        const consoleTextRaw = await generalService.getConsoleDataFromJenkinsJob(
            bufferedJenkinsBuildCreds,
            failedTest.jenkinsLink,
        );
        const consoleTextParsed = consoleTextRaw.Body.Text;
        if (consoleTextParsed.includes(`*** Failed Tests With Execution UUID's ***`)) {
            //real failure
            version = await getVersion(consoleTextParsed, failedTest, generalService);
            const consoleTextAfterUpperSplit = consoleTextParsed.split(`*** Failed Tests With Execution UUID's ***`)[1];
            const consoleTextAfterDownwardSplit = consoleTextAfterUpperSplit.split(`Test Data`);
            const actualFailureText = consoleTextAfterDownwardSplit[0].trim().split('1)')[0].trim();
            messageToReport = actualFailureText;
        } else {
            //some BS
            if (consoleTextParsed.includes(`ERROR: Error cloning remote repo 'origin')`)) {
                version = 'cannot get version from Jenkins console';
                messageToReport = 'Jenkins - Github connection error, please connect QA :)';
            } else if (consoleTextParsed.includes(`Error: Cannot find module 'mocha/bin/mocha'`)) {
                version = 'cannot get version from Jenkins console';
                messageToReport = 'Jenkins workspace error - please connect QA :)';
            } else if (
                consoleTextParsed.includes(
                    `Error: ENOENT: no such file or directory, open '\\?\F:\Jenkins\UITests\addon.config.json'`,
                )
            ) {
                version = 'cannot get version from Jenkins console';
                messageToReport = 'Jenkins workspace error - please connect QA :)';
            } else if (
                consoleTextParsed.includes(`Error: Error: got exception trying to parse returned result object:`)
            ) {
                version = await getVersion(consoleTextParsed, failedTest, generalService);
                const consoleTextAfterUpperSplit = consoleTextParsed.split(
                    `Error: Error: got exception trying to parse returned result object:`,
                )[1];
                const consoleTextAfterDownwardSplit = consoleTextAfterUpperSplit.split(`at`)[0].trim();
                messageToReport = consoleTextAfterDownwardSplit;
            }
        }
        await genericReportToTeams(
            failedTest.addon,
            failedTest.env,
            failedTest.uuid,
            messageToReport,
            failedTest.user,
            version,
            generalService,
        );
    }
}

async function getVersion(consoleTextParsed, failedTest, generalService) {
    let version;
    let indexOfTitle = consoleTextParsed.indexOf('Latest Available Version:  ');
    if (indexOfTitle < 0) {
        version = 'cannot get version from Jenkins console';
        const messageToReport = 'please connect QA - looks like the test didnt even run!';
        await genericReportToTeams(
            failedTest.addon,
            failedTest.env,
            failedTest.uuid,
            messageToReport,
            failedTest.user,
            version,
            generalService,
        );
    }
    indexOfTitle += 'Latest Available Version:  '.length;
    const versionWithSomeExtension = consoleTextParsed.slice(indexOfTitle, indexOfTitle + 15);
    version = versionWithSomeExtension.replace(/[^0-9.]+/g, '');
    return version;
}
