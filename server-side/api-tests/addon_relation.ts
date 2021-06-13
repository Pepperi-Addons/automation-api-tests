import GeneralService, { TesterFunctions } from '../services/general.service';
import { AddonRelationService } from '../services/addon-relation.service';

export async function AddonRelationTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    const relationService = new AddonRelationService(generalService);

    const addonUUID = generalService['client'].BaseURL.includes('staging')
        ? '48d20f0b-369a-4b34-b48a-ffe245088513'
        : '78696fc6-a04f-4f82-aadf-8f823776473f';
    const secretKey = await relationService.getSecretKey();

    //#region Upgrade ADAL
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        relations: ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
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
            it(`negative : AddonUUID not equale to OwnerID`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': generalService.papiClient['options'].addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: AddonUUID must be equal to X-Pepperi-OwnerID header value',
                );
            });
            it(`negative : AddonUUID not equale to SecretKey`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': generalService.papiClient['options'].addonUUID,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: secret key must match to addon UUID',
                );
            });
            it(`negative : Name is mandatory field`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        //"Name": "wrong addonUUID test", // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: Name is a required field',
                );
            });
            it(`negative : RelationName is mandatory field`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        //"RelationName": "ATDExport", // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: RelationName is a required field',
                );
            });
            it(`negative : Type is mandatory field`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        //"Type": "AddonAPI", // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: Type is a required field',
                );
            });
            it(`negative :  Relation type AddonAPI, creation without AddonRelativeURL`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        //"AddonRelativeURL": "/api/test1", // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: AddonRelativeURL is a required field',
                );
            });
            it(`negative :  Relation type NgComponent, creation without SubType`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'NgComponent', // mandatory on create
                        Description: 'test1',
                        //"SubType":"ng11", // mandatory
                        ComponentName: 'AddonComponent', // mandatory
                        ModuleName: 'AddonModule', // mandatory
                        AddonRelativeURL: '/my_editors/main1', // mandatory
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: SubType is a required field',
                );
            });
            it(`negative :  Relation type NgComponent, creation without ComponentName`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'NgComponent', // mandatory on create
                        Description: 'test1',
                        SubType: 'ng11', // mandatory
                        //"ComponentName":"AddonComponent", // mandatory
                        ModuleName: 'AddonModule', // mandatory
                        AddonRelativeURL: '/my_editors/main1', // mandatory
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: ComponentName is a required field',
                );
            });
            it(`negative :  Relation type NgComponent, creation without ModuleName`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'NgComponent', // mandatory on create
                        Description: 'test1',
                        SubType: 'ng11', // mandatory
                        ComponentName: 'AddonComponent', // mandatory
                        //"ModuleName":"AddonModule", // mandatory
                        AddonRelativeURL: '/my_editors/main1', // mandatory
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: ModuleName is a required field',
                );
            });
            it(`negative :  Relation type NgComponent, creation without AddonRelativeURL`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'NgComponent', // mandatory on create
                        Description: 'test1',
                        SubType: 'ng11', // mandatory
                        ComponentName: 'AddonComponent', // mandatory
                        ModuleName: 'AddonModule', // mandatory
                        //"AddonRelativeURL":"/my_editors/main1", // mandatory
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: AddonRelativeURL is a required field',
                );
            });
            it(`negative :  Relation type Navigate, creation without AddonRelativeURL`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'wrong addonUUID test', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'Navigate', // mandatory on create
                        Description: 'test1',
                        //"AddonRelativeURL": "/api/foo", // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce.fault.faultstring).to.equal(
                    'Failed due to exception: AddonRelativeURL is a required field',
                );
            });
        });
        describe(`addon Relation positive scenarios`, () => {
            it(`Craete addon Relation`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'Addon relation positive1', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                    },
                );
                //debugger;
                expect(relationResponce).to.equal(200);
            });
            it(`Get addon Relation`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.getRelation(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    // {
                    //     "Name": "Addon relation positive1", // mandatory
                    //     "AddonUUID": addonUUID, // mandatory
                    //     "RelationName": "ATDExport", // mandatory
                    //     "Type": "AddonAPI", // mandatory on create
                    //     "Description": "test1",
                    //     "AddonRelativeURL": "/api/test1", // mandatory on create
                    // }
                );
                const relationBody = {
                    Name: 'Addon relation positive1', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'ATDExport', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'test1',
                    AddonRelativeURL: '/api/test1', // mandatory on create
                };
                //debugger;
                expect(relationResponce[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: false,
                });
            });

            ///////////////////////////
            it(`Update  addon Relation to Hidden = true`, async () => {
                //const secretKey = await relationService.getSecretKey()
                const relationResponce = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                        // 'X-Pepperi-ActionID': 'afecaa32-98e6-45e1-93c9-1ba6cc06ea7d',
                    },
                    {
                        Name: 'Addon relation positive1', // mandatory
                        AddonUUID: addonUUID, // mandatory
                        RelationName: 'ATDExport', // mandatory
                        Type: 'AddonAPI', // mandatory on create
                        Description: 'test1',
                        AddonRelativeURL: '/api/test1', // mandatory on create
                        Hidden: true,
                    },
                );
                //debugger;
                expect(relationResponce).to.equal(200);
            });
            ///////////////////////////////////
            it(`Get addon Relation where clause by Name`, async () => {
                const relationBody = {
                    Name: 'Addon relation positive1', // mandatory
                    AddonUUID: addonUUID, // mandatory
                    RelationName: 'ATDExport', // mandatory
                    Type: 'AddonAPI', // mandatory on create
                    Description: 'test1',
                    AddonRelativeURL: '/api/test1', // mandatory on create
                };
                const relationResponce = await relationService.getRelationWithName(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    relationBody.Name,

                );

                debugger;
                expect(relationResponce[0]).to.include({
                    ...relationBody,
                    Key: `${relationBody.Name}_${relationBody.AddonUUID}_${relationBody.RelationName}`,
                    Hidden: true,
                });
            });
            ///////////////////////////////////
        });
    });


}
