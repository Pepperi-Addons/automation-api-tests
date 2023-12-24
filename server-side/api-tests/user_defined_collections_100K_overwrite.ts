import GeneralService, { TesterFunctions } from '../services/general.service';
import { PFSService } from '../services/pfs.service';
import fs from 'fs';
import { UdcField, UDCService } from '../services/user-defined-collections.service';
import * as path from 'path';

export async function UDC100KOverwriteTestser(generalService: GeneralService, request, tester: TesterFunctions) {
    await UDC100KOverwrite(generalService, request, tester);
}
export async function UDC100KOverwrite(generalService: GeneralService, request, tester: TesterFunctions) {
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
            let dimxOverWriteCollectionName = '';
            let howManyNewRowsOnOverwrite = 0;
            it('Positive Test: DIMX overwrite test: 100K rows API import to new UDC then overwriting the data using DIMX', async () => {
                dimxOverWriteCollectionName = 'DimxOverwrite' + generalService.generateRandomString(15);
                const pfsService = new PFSService(generalService);
                const howManyRows = 100000;
                //1. create the file to import
                const fileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
                const mime = 'text/csv';
                const tempFileResponse = await pfsService.postTempFile({
                    FileName: fileName,
                    MIME: mime,
                });
                expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
                const csvFileName = await createInitalData(howManyRows);
                const localPath = __dirname;
                const combinedPath = path.join(localPath, csvFileName);
                const buf = fs.readFileSync(combinedPath);
                const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
                expect(putResponsePart1.ok).to.equal(true);
                expect(putResponsePart1.status).to.equal(200);
                //2. create the UDC to import to
                const numOfInitialCollections = (await udcService.getSchemes({ page_size: -1 })).length;
                const codeField: UdcField = {
                    Name: 'code',
                    Mandatory: true,
                    Type: 'String',
                    Indexed: true,
                };
                const dataFields: UdcField = {
                    Name: 'value',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [codeField, dataFields];
                const response = await udcService.createUDCWithFields(
                    dimxOverWriteCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    undefined,
                    [codeField],
                );
                expect(response.Fail).to.be.undefined;
                expect(response.code.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                expect(documents.length).to.equal(numOfInitialCollections + 1);
                const newCollection = documents.filter((doc) => doc.Name === dimxOverWriteCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                //3. import file to UDC
                const bodyToImport = {
                    URI: tempFileResponse.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/${UserDefinedCollectionsUUID}/${dimxOverWriteCollectionName}`,
                    { method: 'POST', body: JSON.stringify(bodyToImport) },
                );
                const executionURI = importResponse.Body.URI;
                const auditLogDevTestResponse = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    250,
                    7000,
                );
                if (auditLogDevTestResponse.Status) {
                    expect(auditLogDevTestResponse.Status.Name).to.equal('Success');
                } else {
                    expect(auditLogDevTestResponse.Status).to.not.be.undefined;
                }
                const lineStats = JSON.parse(auditLogDevTestResponse.AuditInfo.ResultObject).LinesStatistics;
                expect(lineStats.Inserted).to.equal(howManyRows);
                generalService.sleep(1000 * 150); //let PNS Update
                for (let index = 1; index <= 100; index++) {
                    console.log(`searching for 250 rows for the ${index} time - out of out of 100 sampling batch`);
                    const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                        dimxOverWriteCollectionName,
                        index,
                        250,
                    );
                    expect(allObjectsFromCollection.count).to.equal(howManyRows);
                    for (let index1 = 0; index1 < allObjectsFromCollection.objects.length; index1++) {
                        const row = allObjectsFromCollection.objects[index1];
                        expect(row.code).to.contain('data_');
                        expect(row.value).to.contain('old_value_');
                    }
                }
                //4. create new file which overwrites
                const newFileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
                const tempFileNewResponse = await pfsService.postTempFile({
                    FileName: newFileName,
                    MIME: mime,
                });
                expect(tempFileNewResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                expect(tempFileNewResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                expect(tempFileNewResponse.TemporaryFileURL).to.include('pfs.');
                const howManyOld = 298000;
                const howManyUpdated = 1000;
                howManyNewRowsOnOverwrite = 1000;
                const newCSVFileName = await createUpdatedData(howManyOld, howManyUpdated, howManyNewRowsOnOverwrite);
                const newCombinedPath = path.join(localPath, newCSVFileName);
                const newBuf = fs.readFileSync(newCombinedPath);
                const putResponse2 = await pfsService.putPresignedURL(tempFileNewResponse.PutURL, newBuf);
                expect(putResponse2.ok).to.equal(true);
                expect(putResponse2.status).to.equal(200);
                //5. run DIMX overwrite on new file
                const bodyToSendOverWrite = { URI: tempFileNewResponse.TemporaryFileURL, OverwriteTable: true };
                const importOverWriteResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/${UserDefinedCollectionsUUID}/${dimxOverWriteCollectionName}`,
                    { method: 'POST', body: JSON.stringify(bodyToSendOverWrite) },
                );
                const executionURIOverWrite = importOverWriteResponse.Body.URI;
                const overwriteResponse = await generalService.getAuditLogResultObjectIfValidV2(
                    executionURIOverWrite as string,
                    300,
                    7000,
                );
                if (overwriteResponse.Status) {
                    expect(overwriteResponse.Status.Name).to.equal('Success');
                } else {
                    expect(overwriteResponse.Status).to.not.be.undefined;
                }
                const overwriteLineStats = JSON.parse(overwriteResponse.AuditInfo.ResultObject).LinesStatistics;
                expect(overwriteLineStats.Ignored).to.equal(howManyOld);
                expect(overwriteLineStats.Updated).to.equal(howManyUpdated);
                expect(overwriteLineStats.Inserted).to.equal(howManyNewRowsOnOverwrite);
                expect(overwriteLineStats.Total).to.equal(howManyOld + howManyUpdated + howManyNewRowsOnOverwrite);
                generalService.sleep(1000 * 60); //let PNS Update
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    dimxOverWriteCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(100000);
                const fileURI = JSON.parse(overwriteResponse.AuditInfo.ResultObject).URI;
                const fileAfterOverwriting = await generalService.fetchStatus(fileURI);
                const updateArray = fileAfterOverwriting.Body.filter((entry) => entry.Status === 'Update');
                expect(updateArray.length).to.equal(howManyUpdated);
                const insertArray = fileAfterOverwriting.Body.filter((entry) => entry.Status === 'Insert');
                expect(insertArray.length).to.equal(howManyNewRowsOnOverwrite);
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

async function createInitalData(howManyDataRows: number) {
    const headers = 'code,value';
    const runningDataCode = 'data_index';
    const runningDataValue = 'old_value_index';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataCode.replace('index', index.toString())},`;
        strData += `${runningDataValue.replace('index', index.toString())}\n`;
    }
    return await genrateFile('Data', strData);
}

async function createUpdatedData(howManyOldRows: number, howManyUpdatedRows: number, howManyNewRows: number) {
    const headers = 'code,value';
    const runningDataCode = 'data_index';
    const runningNewDataCode = 'new_data_index';
    const runningDataValue = 'old_value_index';
    const runningDataCodeNew = 'new_value_index';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyOldRows; index++) {
        strData += `${runningDataCode.replace('index', index.toString())},`;
        strData += `${runningDataValue.replace('index', index.toString())}\n`;
    }
    for (let index = howManyOldRows; index < howManyUpdatedRows + howManyOldRows; index++) {
        strData += `${runningDataCode.replace('index', index.toString())},`;
        strData += `${runningDataCodeNew.replace('index', index.toString())}\n`;
    }
    for (
        let index = howManyUpdatedRows + howManyOldRows;
        index < howManyUpdatedRows + howManyOldRows + howManyNewRows;
        index++
    ) {
        strData += `${runningNewDataCode.replace('index', index.toString())},`;
        strData += `${runningDataCodeNew.replace('index', index.toString())}\n`;
    }
    return await genrateFile('UpdatedData', strData);
}

async function genrateFile(tempFileName, data) {
    let filePath;
    try {
        const localPath = __dirname;
        filePath = `./test-data/${tempFileName}.csv`;
        const xx = path.join(localPath, filePath);
        fs.writeFileSync(xx, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
    return filePath;
}
