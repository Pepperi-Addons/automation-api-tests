import { Client } from '@pepperi-addons/debug-server/dist';
import GeneralService, { TesterFunctions } from '../services/general.service';

import { UDCService, UdcField } from '../services/user-defined-collections.service';

export async function UDCTestserPermission(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDCTestsPermission(generalService, request, tester);
}
export async function UDCTestsPermission(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }

    await generalService.baseAddonVersionsInstallation(varKey);
    //#region Upgrade UDC
    const testData = {
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '2.%.%'],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
        Crawler: ['f489d076-381f-4cf7-aa63-33c6489eb017', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''],
        'User Defined Collections': [UserDefinedCollectionsUUID, ''],
        'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', ''],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };

    const buyerEmailProd = '⁠udcPRODBuyerPermissions@pepperitest.com';
    const buyerPassProd = '*8sGs7';

    const buyerEmailStage = '⁠udcSBBuyerPermissions@pepperitest.com';
    const buyerPassStage = 'n5#QDM';

    const buyerEmailEU = '⁠udcEUBuyerPermissions@pepperitest.com';
    const buyerPassEU = 't3b#tG';

    let buyerEmail;
    let buyerPass;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        buyerEmail = buyerEmailStage;
        buyerPass = buyerPassStage;
    } else if (generalService.papiClient['options'].baseURL.includes('eu')) {
        buyerEmail = buyerEmailEU;
        buyerPass = buyerPassEU;
    } else {
        buyerEmail = buyerEmailProd;
        buyerPass = buyerPassProd;
    }

    const buyerClient: Client = await generalService.initiateTester(buyerEmail, buyerPass);

    const buyerGeneralService = new GeneralService(buyerClient);

    const buyerUdcService = new UDCService(buyerGeneralService);

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }

    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('UDC Tests Suites', () => {
        describe('Prerequisites Addon for UDC Tests', () => {
            //Test Data
            //UDC
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
        describe('Base Collection Testing', () => {
            it(`Negative Test: call '/V1.0/user_defined_collections/schemes?page_size=-1' on a BUYER`, async () => {
                let errorMessage = '';
                try {
                    await buyerUdcService.getSchemes({ page_size: -1 });
                } catch (error) {
                    errorMessage = (error as any).message;
                }
                expect(errorMessage).to.include(
                    `"fault":{"faultstring":"Failed due to exception: You don't have permissions to call this endpoint","detail":{"errorcode":"Forbidden"}}}`,
                );
            });
            it(`Positive Test: Create New Collection Using Admin And See We Can Call '/V1.0/user_defined_collections/<NEW_COLL>' on a BUYER - See The Response Is Not Empty Nor Error`, async () => {
                const basicCollectionName = 'BasicTesting' + generalService.generateRandomString(15);
                const fieldStr: UdcField = {
                    Name: 'str',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [fieldStr];
                const response = await udcService.createUDCWithFields(
                    basicCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                );
                expect(response.Fail).to.be.undefined;
                expect(response.str.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                const newCollection = documents.filter((doc) => doc.Name === basicCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                const udcResponse = await buyerGeneralService.fetchStatus(
                    `/user_defined_collections/${basicCollectionName}`,
                );
                expect(udcResponse.Ok).to.equal(true);
                expect(udcResponse.Status).to.equal(200);
                expect(udcResponse.Error).to.deep.equal({});
                expect(udcResponse.Body).to.deep.equal([]);
            });
            it(`Tear Down: Purging All left UDCs - To Keep Dist Clean`, async function () {
                const allUdcs = await udcService.getSchemes({ page_size: -1 });
                const onlyRelevantUdcNames = allUdcs.map((doc) => doc.Name);
                for (let index = 0; index < onlyRelevantUdcNames.length; index++) {
                    const udcsBeforePurge = await udcService.getSchemes({ page_size: -1 });
                    const udcName = onlyRelevantUdcNames[index];
                    const purgeResponse = await udcService.purgeScheme(udcName);
                    if (purgeResponse.Body.URI) {
                        const auditLogUri = purgeResponse.Body.URI;
                        const auditLogPurgeResponse = await generalService.getAuditLogResultObjectIfValidV2(
                            auditLogUri as string,
                            170,
                            5000,
                        );
                        expect((auditLogPurgeResponse.Status as any).Name).to.equal('Success');
                        expect(JSON.parse(auditLogPurgeResponse.AuditInfo.ResultObject).Done).to.equal(true);
                        expect(JSON.parse(auditLogPurgeResponse.AuditInfo.ResultObject).ProcessedCounter).to.be.above(
                            0,
                        );
                    } else {
                        expect(purgeResponse.Ok).to.equal(true);
                        expect(purgeResponse.Status).to.equal(200);
                        expect(purgeResponse.Body.Done).to.equal(true);
                        generalService.sleep(1500);
                    }
                    generalService.sleep(1500);
                    const udcsAfterPurge = await udcService.getSchemes({ page_size: -1 });
                    expect(udcsBeforePurge.length).to.be.above(udcsAfterPurge.length);
                    console.log(`${udcName} was deleted, ${udcsAfterPurge.length} left`);
                }
            });
        });
    });
}
