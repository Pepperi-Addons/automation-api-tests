import { AddonDataScheme } from '@pepperi-addons/papi-sdk';
import GeneralService, { TesterFunctions } from '../services/general.service';
import { v4 as newUuid } from 'uuid';
import { PFSService } from '../services/pfs.service';
import { ADALService } from '../services/adal.service';
import fs from 'fs';
import { AddonRelationService } from '../services/addon-relation.service';

export async function Adal40KImportAndPurgeTest(generalService: GeneralService, request, tester: TesterFunctions) {
    const describe = tester.describe;
    const expect = tester.expect;
    const it = tester.it;

    //#region Upgrade ADAL
    const testData = {
        // 'ADAL': ['00000000-0000-0000-0000-00000000ada1', '1.5.99'],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = request.body.varKeyStage;
    } else {
        varKey = request.body.varKeyPro;
    }
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const pfsService = new PFSService(generalService);
    const adalService = new ADALService(generalService.papiClient);
    const relationService = new AddonRelationService(generalService);
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
        describe(`Create ADAL Table, Import 40K File From PFS Then Purge`, () => {
            const howManyRows = 40 * 1000; //QTY! -- this is here so we can print it in the log (report)
            const schemaName = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
            const schemeData: AddonDataScheme = {
                Name: schemaName,
                Type: 'data',
                Fields: {
                    Value: { Type: 'String' },
                },
            };
            it(`Test Is Running On: ${
                howManyRows > 1000 ? howManyRows / 1000 + 'K' : howManyRows
            } Rows, Table Name: ${schemaName}, Scheme: ${JSON.stringify(schemeData)}`, async function () {
                //1. create new ADALTable to import to
                console.log(`new ADAL table will be called: ${schemaName}`);
                const createSchemaResponse = await adalService.postSchema(schemeData);
                expect(createSchemaResponse.Name).to.equal(schemaName);
                expect(createSchemaResponse.Hidden).to.be.false;
                expect(createSchemaResponse.Type).to.equal('data');
                expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
                //1.1 test the table is indeed new => empty
                const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
                const secretKey = await generalService.getSecretKey(addonUUID, varKey);
                const getAdalTablenResponse = await adalService.getDataFromSchema(addonUUID, schemaName);
                expect(getAdalTablenResponse).to.deep.equal([]);
                //1.2 create relation to import
                const bodyForRelation = {
                    Name: schemaName,
                    AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                    RelationName: 'DataImportResource',
                    Type: 'AddonAPI',
                    AddonRelativeURL: '',
                };
                const relationResponse = await relationService.postRelationStatus(
                    {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                    bodyForRelation,
                );
                expect(relationResponse).to.equal(200);
                //2. create PFS Temp file
                const fileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
                const mime = 'text/csv';
                const tempFileResponse = await pfsService.postTempFile({
                    FileName: fileName,
                    MIME: mime,
                });
                expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
                //3. create the data file
                await generalService.createCSVFile(howManyRows, 'Key,Value,Hidden', 'key_index', [`"index"`], 'false');
                const buf = fs.readFileSync('./Data.csv');
                //4. upload the file to PFS Temp
                const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
                expect(putResponsePart1.ok).to.equal(true);
                expect(putResponsePart1.status).to.equal(200);
                console.log(tempFileResponse.TemporaryFileURL);
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
                //6. delete the ADAL table
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
                    expect(deleteSchemaResponseBody.RemovedCounter).to.equal(howManyRows);
                } else {
                    const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
                        deleteSchemaResponseBody.URI as string,
                        120,
                        7000,
                    );
                    expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
                    expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
                    expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
                    expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
                        howManyRows,
                    );
                }
            });
        });
    });
}
