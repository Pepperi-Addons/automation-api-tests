import { AddonDataScheme } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as newUuid } from 'uuid';
import { PFSService } from '../services/pfs.service';
import { ADALService } from '../services/adal.service';
import { AddonRelationService } from '../services/addon-relation.service';
import { fileForAdal40KImportAndPurgeTest } from './textFileForAdal40KImportAndPurgeTest';

export async function Adal40KImportAndPurgeTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;
    //#region Upgrade ADAL
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const testData = {
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const pfsService = new PFSService(generalService);
    const adalService = new ADALService(generalService.papiClient);
    const relationService = new AddonRelationService(generalService);
    const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
    const secretKey = await generalService.getSecretKey(addonUUID, varKey);
    let tempFileResponse;
    //#endregion Upgrade ADAL

    describe('Addon Relation Tests Suites', () => {
        describe('Prerequisites Addon for relation Tests', () => {
            //Test Data
            //ADAL
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
        const howManyRows = 40 * 1000; //QTY! -- this is here so we can print it in the log (report)
        const schemaName = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
        const schemeData: AddonDataScheme = {
            Name: schemaName,
            Type: 'data',
            Fields: {
                Value: { Type: 'String' },
            },
        };
        describe(`Create ADAL Table, Import 40K File From PFS Then Purge, Running On: ${
            howManyRows > 1000 ? howManyRows / 1000 + 'K' : howManyRows
        } Rows, Table Name: ${schemaName}, Scheme: ${JSON.stringify(schemeData)}`, () => {
            it(`1. Create ADAL Scheme ${schemaName} And Add Export And Import Relations`, async function () {
                //1. create new ADALTable to import to
                console.log(`new ADAL table will be called: ${schemaName}`);
                const createSchemaResponse = await adalService.postSchema(schemeData);
                expect(createSchemaResponse.Name).to.equal(schemaName);
                expect(createSchemaResponse.Hidden).to.be.false;
                expect(createSchemaResponse.Type).to.equal('data');
                expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
                //1.1 test the table is indeed new => empty
                const getAdalTablenResponse = await adalService.getDataFromSchema(addonUUID, schemaName);
                expect(getAdalTablenResponse).to.deep.equal([]);
                //1.2 create relation to import
                const bodyForRelationImport = {
                    Name: schemaName,
                    AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    RelationName: 'DataImportResource',
                    Type: 'AddonAPI',
                    AddonRelativeURL: '',
                };
                const relationResponseImport = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    bodyForRelationImport,
                );
                expect(relationResponseImport).to.equal(200);
                //1.3 create relation to export
                const bodyForRelationExport = {
                    Name: schemaName,
                    AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    RelationName: 'DataExportResource',
                    Type: 'AddonAPI',
                    AddonRelativeURL: '',
                };
                const relationResponseExport = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    bodyForRelationExport,
                );
                expect(relationResponseExport).to.equal(200);
            });
            it(`2. Create The Data CSV File, Which Size Is ${howManyRows} Rows And Upload To PFS`, async function () {
                //2. create PFS Temp file
                const fileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
                const mime = 'text/csv';
                tempFileResponse = await pfsService.postTempFile({
                    FileName: fileName,
                    MIME: mime,
                });
                expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
                //3. create the data file
                const buf = Buffer.from(fileForAdal40KImportAndPurgeTest);
                //4. upload the file to PFS Temp
                const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
                expect(putResponsePart1.ok).to.equal(true);
                expect(putResponsePart1.status).to.equal(200);
                console.log(
                    `The File About To Be Imported To ADAL Table ${schemeData}, Is Found Here: ${tempFileResponse.TemporaryFileURL}`,
                );
            });
            it(`3. Import CSV File To ADAL Table ${schemaName}`, async function () {
                //5. import the Temp File to ADAL
                const bodyToImport = {
                    URI: tempFileResponse.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName}`,
                    { method: 'POST', body: JSON.stringify(bodyToImport) },
                );
                const start = Date.now();
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    120,
                    7000,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    howManyRows,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(howManyRows);
                const duration = Date.now() - start;
                const durationInSec = (duration / 1000).toFixed(3);
                console.log(`TOOK: seconds: ${durationInSec}, which are: ${Number(durationInSec) / 60} minutes±±±±`);
                //shouldnt take more than 5 mins
                expect(Number(durationInSec) / 60).to.be.lessThan(5);
            });
            it(`4. Export Data From ${schemaName} To CSV File - And See File Is Correct`, async function () {
                //6. export the file
                const bodyToSendExport = {
                    Format: 'csv',
                    IncludeDeleted: false,
                    Fields: 'Value',
                    Delimiter: ',',
                };
                const exportResponse = await generalService.fetchStatus(
                    `/addons/data/export/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName}`,
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
                expect(allUDCRowsInArray.length).to.equal(howManyRows + 1); //40,000 + header row
                expect(allUDCRowsInArray[0]).to.equal('Value');
                for (let index = 1; index < allUDCRowsInArray.length; index++) {
                    const fileRow = allUDCRowsInArray[index];
                    const fileRowSplit = fileRow.split(',');
                    for (let index1 = 0; index1 < fileRowSplit.length; index1++) {
                        const value = fileRowSplit[index1];
                        expect(value).to.be.a('number');
                    }
                }
            });
            it(`5. Delete ${schemaName} - And See All Data Is Correct`, async function () {
                //7. delete the ADAL table
                const newUUID = newUuid();
                console.log(`PURGE actionID: ${newUUID}`);
                const deleteSchemaResponse = await generalService.fetchStatus(
                    `/addons/data/schemes/${schemaName}/purge`,
                    {
                        method: 'POST',
                        headers: {
                            'X-Pepperi-OwnerID': addonUUID,
                            'X-Pepperi-SecretKey': secretKey,
                            'x-pepperi-actionid': newUUID,
                        },
                    },
                );
                const deleteSchemaResponseBody = deleteSchemaResponse.Body;
                if (deleteSchemaResponseBody.hasOwnProperty('Done')) {
                    expect(deleteSchemaResponseBody.Done).to.equal(true);
                    expect(deleteSchemaResponseBody.ProcessedCounter).to.equal(howManyRows);
                } else {
                    const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
                        deleteSchemaResponseBody.URI as string,
                        120,
                        7000,
                    );
                    expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
                    expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
                    expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
                    expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).ProcessedCounter).to.equal(
                        howManyRows,
                    );
                }
            });
        });
    });
}
