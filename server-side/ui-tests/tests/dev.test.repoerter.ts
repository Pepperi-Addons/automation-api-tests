import chai from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';

chai.use(promised);

export async function DevTestReporter(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const testsAndJenkinsLinksList = {
        configurtions: {
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
        sync: {
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
    const base64Credentials = Buffer.from(jenkinsBuildUserCred).toString('base64');
    const addons = Object.keys(testsAndJenkinsLinksList);
    for (let i = 0; i < addons.length; i++) {
        const addon = addons[i];
        const jenkinsData = testsAndJenkinsLinksList[addon].jenkins;
        const jenkinsDataKeys = Object.keys(jenkinsData);
        for (let index = 0; index < jenkinsDataKeys.length; index++) {
            const jenkinsEntry = jenkinsData[jenkinsDataKeys[index]];
            const didTestPassOnJenkins = await generalService.didLastJenkinsRunSucceed(
                base64Credentials,
                jenkinsEntry.jenkinsLink,
            );
            if (!didTestPassOnJenkins) {
                failedTestsAddonNames.push({
                    user: jenkinsEntry.user,
                    addon: addon,
                    env: jenkinsDataKeys[index],
                    jenkinsLink: jenkinsEntry.jenkinsLink,
                });
            }
        }
    }
    debugger;
}
