import GeneralService, { TesterFunctions } from '../services/general.service';
import  { AddonRelationService } from '../services/addon-relation.service';

export async function AddonRelationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const relationService = new AddonRelationService(generalService)
    
    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const baseURL = generalService['client'].BaseURL;
    const token = generalService['client'].OAuthAccessToken;

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        relations:['5ac7d8c3-0249-4805-8ce9-af4aecd77794',''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(request.body.varKey, testData, false);
    //#endregion Upgrade ADAL

    describe('addon relation Tests Suites', () => {
        describe('Prerequisites Addon for relation Tests', () => {
            //Test Data
            //ADAL
            it('Validate that all the needed addons are installed', async () => {
                isInstalledArr.forEach((isInstalled) => {
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
        describe(`addon Relation negative scenarios`, () => {
            it(``,async () => {
                const secretKey = await relationService.getSecretKey()
                debugger;
                const oleg = await relationService.getRelation( {
                    //Authorization: 'Bearer ' + token,
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                    'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                },);
                
                debugger;
                expect(oleg).to.deep.equal("oren")
            });
        })
    })
        
}

