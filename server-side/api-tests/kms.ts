import GeneralService, { TesterFunctions } from '../services/general.service';

export async function KmsTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade KMS
    const testData = {
        kms: ['45677e5f-66c5-48dc-b3b9-4165e820d7f9', '0.0.32'], //alway take the newest version of 'KMS' addon
        "API Testing Framework": ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', '0.0.576'],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    //#endregion Upgrade KMS

    describe('Data Queries Tests Suites', () => {
        describe('Prerequisites Addon for Data Queries Tests', () => {
            //Test Data
            //KMS
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
        describe('Endpoints', () => {
            describe('Get All', async () => {
                debugger;
                const secretKey = await generalService.getSecretKey("eb26afcd-3cf2-482e-9ab1-b53c41a6adbe", varKey);
                const kmsResponse = await generalService.fetchStatus("/api/8b4a1bd8-a2eb-4241-85ac-89c9e724e900/api/GetAll", {
                    method: `GET`,
                    headers: {
                        // Authorization: `Basic ${Buffer.from(varKey).toString('base64')}`,
                        "x-pepperi-ownerid": "eb26afcd-3cf2-482e-9ab1-b53c41a6adbe",
                        "X-Pepperi-SecretKey": secretKey,
                    },
                });
            });
        });
        describe('Data Cleansing', () => {

        });
    });
}
