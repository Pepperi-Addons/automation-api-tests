import { describe, it } from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import promised from 'chai-as-promised';
// import { UDCService } from '../../services/user-defined-collections.service';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PFSService } from '../../services/pfs.service';
import fs from 'fs';
import { ADALService } from '../../services/adal.service';
import { v4 as newUuid } from 'uuid';
import { AddonDataScheme } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function PfsFileUploadToAdalUsingDimx(client: Client, varPass) {
    //
    const generalService = new GeneralService(client);
    describe('ADAL CREATE - DELETE', async function () {
        const howManyRows_delete = 10000; //QTY! -- this is here so we can print it in the log (report)
        const schemaName_delete = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
        const scheme_delete: AddonDataScheme = {
            Name: schemaName_delete,
            Type: 'data',
            Fields: {
                Value: { Type: 'String' },
            }
        };
        it(`TEST DELETE: RUNNING ON ${howManyRows_delete} ROWS!, TABLE NAME: ${schemaName_delete}, SCHEME: ${JSON.stringify(scheme_delete)}`, async function () {
            //START OF DIMX UPLOAD USING PFS
            const pfsService = new PFSService(generalService);
            const adalService = new ADALService(generalService.papiClient);
            //1. create new ADALTable to import to
            console.log(`new ADAL table will be called: ${schemaName_delete}`);
            const createSchemaResponse = await adalService.postSchema(scheme_delete);
            expect(createSchemaResponse.Name).to.equal(schemaName_delete);
            expect(createSchemaResponse.Hidden).to.be.false;
            expect(createSchemaResponse.Type).to.equal('data');
            expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
            //1.1 test the table is indeed new => empty
            const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
            const secretKey = await generalService.getSecretKey(addonUUID, varPass);
            const getAdalTablenResponse = await generalService.fetchStatus(
                `/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_delete}`,
                {
                    method: 'GET',
                    headers: {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                },
            );
            expect(getAdalTablenResponse.Body).to.deep.equal([]);
            //1.2 create relation to import
            const bodyForRelation = {
                Name: schemaName_delete,
                AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                RelationName: 'DataImportResource',
                Type: 'AddonAPI',
                AddonRelativeURL: '',
            };
            const relationResponse = await generalService.fetchStatus(`/addons/data/relations`, {
                method: 'POST',
                body: JSON.stringify(bodyForRelation),
                headers: {
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                },
            });
            expect(relationResponse.Status).to.equal(200);
            expect(relationResponse.Ok).to.equal(true);
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
            await createInitalData(howManyRows_delete);
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
                `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_delete}`,
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
                howManyRows_delete,
            );
            expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
                howManyRows_delete,
            );
            const duration = Date.now() - start;
            const durationInSec = (duration / 1000).toFixed(3);
            console.log(`±±±±TOOK: seconds: ${durationInSec}, which are: ${Number(durationInSec) / 60} minutes±±±±`);
            //6. delete the ADAL table
            const newUUID = newUuid();
            console.log(`PURGE actionID: ${newUUID}`);
            const deleteSchemaResponse = await generalService.fetchStatus(`/addons/data/schemes/${schemaName_delete}/purge`, {
                method: 'POST',
                headers: {
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                    'x-pepperi-actionid': newUUID,
                },
            });
            const deleteSchemaResponseBody = deleteSchemaResponse.Body;
            if (deleteSchemaResponseBody.hasOwnProperty('Done')) {
                expect(deleteSchemaResponseBody.Done).to.equal(true);
                console.log(`EVGENY: RETUREND RemovedCounter: ${deleteSchemaResponseBody.RemovedCounter}`);
                expect(deleteSchemaResponseBody.RemovedCounter).to.equal(howManyRows_delete);
            } else {
                const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
                    deleteSchemaResponseBody.URI as string,
                    120,
                    7000,
                );
                expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
                expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
                expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
                console.log(
                    `EVGENY: RETUREND RemovedCounter: ${JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter
                    }`,
                );
                expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
                    howManyRows_delete,
                );
            }
        });
        const howManyRows_create = 150000; //QTY! -- this is here so we can print it in the log (report)
        const schemaName_create = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
        const scheme_create: AddonDataScheme = {
            Name: schemaName_create,
            Type: 'data',
            Fields: {
                Value: { Type: 'String' },
            }
        };
        it(`TEST IMPORT: RUNNING ON ${howManyRows_create} ROWS!, TABLE NAME: ${schemaName_create}, SCHEME: ${JSON.stringify(scheme_create)}`, async function () {
            //START OF DIMX UPLOAD USING PFS
            const pfsService = new PFSService(generalService);
            const adalService = new ADALService(generalService.papiClient);
            //1. create new ADALTable to import to
            console.log(`new ADAL table will be called: ${schemaName_create}`);
            const createSchemaResponse = await adalService.postSchema(scheme_create);
            expect(createSchemaResponse.Name).to.equal(schemaName_create);
            expect(createSchemaResponse.Hidden).to.be.false;
            expect(createSchemaResponse.Type).to.equal('data');
            expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
            //1.1 test the table is indeed new => empty
            const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
            const secretKey = await generalService.getSecretKey(addonUUID, varPass);
            const getAdalTablenResponse = await generalService.fetchStatus(
                `/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,
                {
                    method: 'GET',
                    headers: {
                        'X-Pepperi-OwnerID': addonUUID,
                        'X-Pepperi-SecretKey': secretKey,
                    },
                },
            );
            expect(getAdalTablenResponse.Body).to.deep.equal([]);
            //1.2 create relation to import
            const bodyForRelation = {
                Name: schemaName_create,
                AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                RelationName: 'DataImportResource',
                Type: 'AddonAPI',
                AddonRelativeURL: '',
            };
            const relationResponse = await generalService.fetchStatus(`/addons/data/relations`, {
                method: 'POST',
                body: JSON.stringify(bodyForRelation),
                headers: {
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                },
            });
            expect(relationResponse.Status).to.equal(200);
            expect(relationResponse.Ok).to.equal(true);
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
            await createInitalData_create(howManyRows_create);
            const buf = fs.readFileSync('./Data.csv');
            debugger;
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
                `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,
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
                howManyRows_create,
            );
            expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
                howManyRows_create,
            );
            const duration = Date.now() - start;
            const durationInSec = (duration / 1000).toFixed(3);
            console.log(`±±±±TOOK: seconds: ${durationInSec}, which are: ${Number(durationInSec) / 60} minutes±±±±`);
            //6. delete the ADAL table
            const newUUID = newUuid();
            console.log(`PURGE actionID: ${newUUID}`);
            const deleteSchemaResponse = await generalService.fetchStatus(`/addons/data/schemes/${schemaName_create}/purge`, {
                method: 'POST',
                headers: {
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                    'x-pepperi-actionid': newUUID,
                },
            });
            const deleteSchemaResponseBody = deleteSchemaResponse.Body;
            if (deleteSchemaResponseBody.hasOwnProperty('Done')) {
                expect(deleteSchemaResponseBody.Done).to.equal(true);
                console.log(`EVGENY: RETUREND RemovedCounter: ${deleteSchemaResponseBody.RemovedCounter}`);
                expect(deleteSchemaResponseBody.RemovedCounter).to.equal(howManyRows_create);
            } else {
                const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
                    deleteSchemaResponseBody.URI as string,
                    120,
                    7000,
                );
                expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
                expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
                expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
                console.log(
                    `EVGENY: RETUREND RemovedCounter: ${JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter
                    }`,
                );
                expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
                    howManyRows_create,
                );
            }
        });
    });
}

async function createInitalData(howManyDataRows: number) {
    const headers = 'Key,Value,Hidden';
    const runningDataValue0 = 'key_index';
    const runningDataValue1 = `"index"`;
    const runningDataValue2 = 'false';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataValue0.replace('index', index.toString())},`;
        strData += `${runningDataValue1.replace('index', index.toString())},`;
        strData += `${runningDataValue2.replace('index', index.toString())}\n`;
    }
    await genrateFile('Data', strData);
}

async function createInitalData_create(howManyDataRows: number) {
    const headers = 'Key,Value,Hidden';
    const runningDataValue0 = 'key_index';
    const runningDataValue1 = `"index"`;
    // const runningDataValue1_1 = `"index"`;
    // const runningDataValue1_2 = `"index"`;
    const runningDataValue2 = 'false';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataValue0.replace('index', index.toString())},`;
        strData += `${runningDataValue1.replace('index', index.toString())},`;
        // strData += `${runningDataValue1_1.replace('index', index.toString())},`;
        // strData += `${runningDataValue1_2.replace('index', index.toString())},`;
        strData += `${runningDataValue2.replace('index', index.toString())}\n`;
    }
    await genrateFile('Data', strData);
}

async function genrateFile(tempFileName, data) {
    try {
        fs.writeFileSync(`./${tempFileName}.csv`, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
}
