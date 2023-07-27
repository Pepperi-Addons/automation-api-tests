import GeneralService, { TesterFunctions } from '../services/general.service';
import { PFSService } from '../services/pfs.service';
import fs from 'fs';
import { UdcField, UDCService } from '../services/user-defined-collections.service';

export async function UDCImportExportTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDCImportExportTests(generalService, request, tester);
}
export async function UDCImportExportTests(generalService: GeneralService, request, tester: TesterFunctions) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const udcService = new UDCService(generalService);
    const pfsService = new PFSService(generalService);
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
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''],
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

    //For local run that run on Jenkins this is needed since Jenkins dont inject SK to the test execution folder
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    //#endregion Upgrade UDC

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
            const udcName = 'TestUDC_' + generalService.generateRandomString(8);
            it(`Create UDC Named: ${udcName}, With 2 Basic Values And 1 Reference Field`, async () => {
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                const accField: UdcField = {
                    Name: 'myAcc',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: 'accounts',
                    AdddonUID: 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f',
                    Indexed: true,
                };
                const val1Field: UdcField = {
                    Name: 'val1',
                    Mandatory: true,
                    Type: 'String',
                };
                const val2Field: UdcField = {
                    Name: 'val2',
                    Mandatory: true,
                    Type: 'String',
                };
                const response = await udcService.createUDCWithFields(
                    udcName,
                    [accField, val1Field, val2Field],
                    'automation testing UDC',
                    undefined,
                    undefined,
                    [accField, val1Field, val2Field],
                );
                expect(response.Fail).to.be.undefined;
                expect(response.myAcc.Type).to.equal('Resource');
                expect(response.myAcc.Resource).to.equal('accounts');
                expect(response.myAcc.Indexed).to.equal(true);
                expect(response.val1.Type).to.equal('String');
                expect(response.val2.Type).to.equal('String');
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === udcName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                if (newCollection.SyncData) {
                    expect(newCollection.SyncData.Sync).to.equal(true);
                    expect(newCollection.SyncData.SyncFieldLevel).to.equal(false);
                } else {
                    expect(newCollection).to.haveOwnProperty('SyncData');
                }
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(['myAcc', 'val1', 'val2']);
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`Import 10K Rows To UDC With 2 Values And 1 Reference Field`, async () => {
                // 1. create the data file
                await generalService.createCSVFile(
                    'newUDCFile',
                    10000,
                    'myAcc#ExternalID,val1,val2',
                    '',
                    ['Account for order scenarios', 'val1_index', 'val2_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./newUDCFile.csv');
                // 2. create PFS Temp file
                const fileName1 = 'TempFile' + generalService.generateRandomString(8) + '.csv';
                const mime = 'text/csv';
                const tempFileResponse1 = await pfsService.postTempFile({
                    FileName: fileName1,
                    MIME: mime,
                });
                expect(tempFileResponse1).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse1).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse1.TemporaryFileURL).to.include('pfs.');
                // 3. upload the file to PFS Temp
                const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse1.PutURL, buf1);
                expect(putResponsePart1.ok).to.equal(true);
                expect(putResponsePart1.status).to.equal(200);
                console.log(
                    `CSV File That Is About To Be Uploaded To ${udcName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${udcName}`,

                    { method: 'POST', body: JSON.stringify(bodyToImport1) },
                );
                const start = Date.now();
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    400,
                    7000,
                );
                const duration = Date.now() - start;
                const durationInSec = (duration / 1000).toFixed(3);
                console.log(
                    `~~~~~~Upload To UDC TOOK: seconds: ${durationInSec}, which are: ${
                        Number(durationInSec) / 60
                    } minutes~~~~~~`,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    10000,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(10000);
            });
            it('Iterate Through All 10K Rows And See Values Are Okay', async function () {
                for (let index = 1; index <= 40; index++) {
                    const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                        udcName,
                        index,
                        250,
                    );
                    expect(allObjectsFromCollection.count).to.equal(10000);
                    for (let index1 = 0; index1 < allObjectsFromCollection.objects.length; index1++) {
                        const row = allObjectsFromCollection.objects[index1];
                        expect(row.myAcc).to.equal('dbc958f7-e0cd-4014-a5cb-1b1764d4381e');
                        expect(row.val1).to.contain('val1_');
                        expect(row.val2).to.contain('val2_');
                    }
                }
            });
            it('Export The Collection', async function () {
                const bodyToSendExport = {
                    Format: 'csv',
                    IncludeDeleted: false,
                    Fields: 'val1,val2,myAcc',
                    Delimiter: ',',
                };
                const exportResponse = await generalService.fetchStatus(
                    `/addons/data/export/file/122c0e9d-c240-4865-b446-f37ece866c22/${udcName}`,
                    { method: 'POST', body: JSON.stringify(bodyToSendExport) },
                );
                const executionURI4 = exportResponse.Body.URI;
                const auditLogResponseForExport = await generalService.getAuditLogResultObjectIfValid(
                    executionURI4 as string,
                    300,
                    7000,
                );
                expect(auditLogResponseForExport.Status?.ID).to.equal(1);
                expect(auditLogResponseForExport.Status?.Name).to.equal('Success');
                const resultObject = JSON.parse(auditLogResponseForExport.AuditInfo.ResultObject);
                expect(resultObject).to.haveOwnProperty('URI');
                const exportedFileURI = resultObject.URI;
                const exportedFileResponse = await generalService.fetchStatus(exportedFileURI, { method: 'GET' });
                const allUDCRowsInArray = exportedFileResponse.Body.Text.split('\n');
                expect(allUDCRowsInArray.length).to.equal(10001);//10,000 + header row
                expect(allUDCRowsInArray[0]).to.equal('myAcc,val1,val2');
                for (let index = 1; index < allUDCRowsInArray.length; index++) {
                    const fileRow = allUDCRowsInArray[index];
                    const fileRowSplit = fileRow.split(',');
                    for (let index1 = 0; index1 < fileRowSplit.length; index1++) {
                        const value = fileRowSplit[index1];
                        expect(value).to.contain.oneOf(['val1', 'val2', 'dbc958f7-e0cd-4014-a5cb-1b1764d4381e']);
                    }
                }
            });
            it(`Tear Down: Purging All left UDCs - To Keep Dist Clean`, async function () {
                let allUdcs = await udcService.getSchemes({ page_size: -1 });
                const onlyRelevantUdcNames = allUdcs.map((doc) => doc.Name);
                for (let index = 0; index < onlyRelevantUdcNames.length; index++) {
                    const udcName = onlyRelevantUdcNames[index];
                    const purgeResponse = await udcService.purgeScheme(udcName);
                    expect(purgeResponse.Ok).to.equal(true);
                    expect(purgeResponse.Status).to.equal(200);
                    expect(purgeResponse.Body.Done).to.equal(true);
                    generalService.sleep(1500);
                    allUdcs = await udcService.getSchemes({ page_size: -1 });
                    console.log(`${udcName} was deleted, ${allUdcs.length} left`);
                }
            });
        });
    });
}
