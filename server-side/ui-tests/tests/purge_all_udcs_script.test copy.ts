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
        const howManyRows = 10000; //QTY! -- this is here so we can print it in the log (report)
        const schemaName = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
        const scheme: AddonDataScheme = {
            Name: schemaName,
            Type: 'data',
            Fields: {
                Value: { Type: 'String' },
            }
        };
        it(`RUNNING ON ${howManyRows} ROWS!, TABLE NAME: ${schemaName}, SCHEME: ${scheme}`, async function () {
            //START OF DIMX UPLOAD USING PFS
            const pfsService = new PFSService(generalService);
            const adalService = new ADALService(generalService.papiClient);
            //1. create new ADALTable to import to
            console.log(`new ADAL table will be called: ${schemaName}`);
            const createSchemaResponse = await adalService.postSchema(scheme);
            expect(createSchemaResponse.Name).to.equal(schemaName);
            expect(createSchemaResponse.Hidden).to.be.false;
            expect(createSchemaResponse.Type).to.equal('data');
            expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
            //1.1 test the table is indeed new => empty
            const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
            const secretKey = await generalService.getSecretKey(addonUUID, varPass);
            const getAdalTablenResponse = await generalService.fetchStatus(
                `/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName}`,
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
                Name: schemaName,
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
            await createInitalData(howManyRows);
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
            expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
                howManyRows,
            );
            const duration = Date.now() - start;
            const durationInSec = (duration / 1000).toFixed(3);
            console.log(`±±±±TOOK: seconds: ${durationInSec}, which are: ${Number(durationInSec) / 60} minutes±±±±`);
            //6. delete the ADAL table
            const newUUID = newUuid();
            console.log(`PURGE actionID: ${newUUID}`);
            const deleteSchemaResponse = await generalService.fetchStatus(`/addons/data/schemes/${schemaName}/purge`, {
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
                console.log(
                    `EVGENY: RETUREND RemovedCounter: ${JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter
                    }`,
                );
                expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
                    howManyRows,
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

async function genrateFile(tempFileName, data) {
    try {
        fs.writeFileSync(`./${tempFileName}.csv`, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
}
