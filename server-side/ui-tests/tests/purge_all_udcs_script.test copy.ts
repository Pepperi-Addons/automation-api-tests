// import { describe, it } from 'mocha';
// import chai from 'chai';
// import { expect } from 'chai';
// import promised from 'chai-as-promised';
// // import { UDCService } from '../../services/user-defined-collections.service';
// import GeneralService from '../../services/general.service';
// import { Client } from '@pepperi-addons/debug-server/dist';
// import { PFSService } from '../../services/pfs.service';
// import fs from 'fs';
// import { ADALService } from '../../services/adal.service';
// import { v4 as newUuid } from 'uuid';
// import { AddonDataScheme } from '@pepperi-addons/papi-sdk';

// chai.use(promised);

// export async function PfsFileUploadToAdalUsingDimx(client: Client, varPass) {
//     //
//     const generalService = new GeneralService(client);
//     describe('ADAL CREATE - DELETE', async function () {
//         const howManyRows_delete = 100 * 1000; //QTY! -- this is here so we can print it in the log (report)
//         const schemaName_delete = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
//         const scheme_delete: AddonDataScheme = {
//             Name: schemaName_delete,
//             Type: 'data',
//             Fields: {
//                 Value: { Type: 'String' },
//             },
//         };
//         it(`TEST DELETE: RUNNING ON ${
//             howManyRows_delete > 1000 ? howManyRows_delete / 1000 + 'K' : howManyRows_delete
//         } ROWS!, TABLE NAME: ${schemaName_delete}, SCHEME: ${JSON.stringify(scheme_delete)}`, async function () {
//             //START OF DIMX UPLOAD USING PFS
//             const pfsService = new PFSService(generalService);
//             const adalService = new ADALService(generalService.papiClient);
//             //1. create new ADALTable to import to
//             console.log(`new ADAL table will be called: ${schemaName_delete}`);
//             const createSchemaResponse = await adalService.postSchema(scheme_delete);
//             expect(createSchemaResponse.Name).to.equal(schemaName_delete);
//             expect(createSchemaResponse.Hidden).to.be.false;
//             expect(createSchemaResponse.Type).to.equal('data');
//             expect(createSchemaResponse.Fields?.Value.Type).to.equal('String');
//             //1.1 test the table is indeed new => empty
//             const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
//             const secretKey = await generalService.getSecretKey(addonUUID, varPass);
//             const getAdalTablenResponse = await generalService.fetchStatus(
//                 `/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_delete}`,
//                 {
//                     method: 'GET',
//                     headers: {
//                         'X-Pepperi-OwnerID': addonUUID,
//                         'X-Pepperi-SecretKey': secretKey,
//                     },
//                 },
//             );
//             expect(getAdalTablenResponse.Body).to.deep.equal([]);
//             //1.2 create relation to import
//             const bodyForRelation = {
//                 Name: schemaName_delete,
//                 AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
//                 RelationName: 'DataImportResource',
//                 Type: 'AddonAPI',
//                 AddonRelativeURL: '',
//             };
//             const relationResponse = await generalService.fetchStatus(`/addons/data/relations`, {
//                 method: 'POST',
//                 body: JSON.stringify(bodyForRelation),
//                 headers: {
//                     'X-Pepperi-OwnerID': addonUUID,
//                     'X-Pepperi-SecretKey': secretKey,
//                 },
//             });
//             expect(relationResponse.Status).to.equal(200);
//             expect(relationResponse.Ok).to.equal(true);
//             //2. create PFS Temp file
//             const fileName = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
//             const mime = 'text/csv';
//             const tempFileResponse = await pfsService.postTempFile({
//                 FileName: fileName,
//                 MIME: mime,
//             });
//             expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
//             expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
//             expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
//             //3. create the data file
//             await createInitalData(howManyRows_delete);
//             const buf = fs.readFileSync('./Data.csv');
//             //4. upload the file to PFS Temp
//             const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
//             expect(putResponsePart1.ok).to.equal(true);
//             expect(putResponsePart1.status).to.equal(200);
//             console.log(tempFileResponse.TemporaryFileURL);
//             //5. import the Temp File to ADAL
//             const bodyToImport = {
//                 URI: tempFileResponse.TemporaryFileURL,
//             };
//             const importResponse = await generalService.fetchStatus(
//                 `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_delete}`,
//                 { method: 'POST', body: JSON.stringify(bodyToImport) },
//             );
//             const start = Date.now();
//             const executionURI = importResponse.Body.URI;
//             const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
//                 executionURI as string,
//                 120,
//                 7000,
//             );
//             expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
//             expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
//             expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
//                 howManyRows_delete,
//             );
//             expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
//                 howManyRows_delete,
//             );
//             const duration = Date.now() - start;
//             const durationInSec = (duration / 1000).toFixed(3);
//             console.log(`±±±±TOOK: seconds: ${durationInSec}, which are: ${Number(durationInSec) / 60} minutes±±±±`);
//             //6. delete the ADAL table
//             const newUUID = newUuid();
//             console.log(`PURGE actionID: ${newUUID}`);
//             const deleteSchemaResponse = await generalService.fetchStatus(
//                 `/addons/data/schemes/${schemaName_delete}/purge`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'X-Pepperi-OwnerID': addonUUID,
//                         'X-Pepperi-SecretKey': secretKey,
//                         'x-pepperi-actionid': newUUID,
//                     },
//                 },
//             );
//             const deleteSchemaResponseBody = deleteSchemaResponse.Body;
//             if (deleteSchemaResponseBody.hasOwnProperty('Done')) {
//                 expect(deleteSchemaResponseBody.Done).to.equal(true);
//                 console.log(`EVGENY: RETUREND RemovedCounter: ${deleteSchemaResponseBody.RemovedCounter}`);
//                 expect(deleteSchemaResponseBody.RemovedCounter).to.equal(howManyRows_delete);
//             } else {
//                 const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
//                     deleteSchemaResponseBody.URI as string,
//                     120,
//                     7000,
//                 );
//                 expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
//                 expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
//                 expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
//                 console.log(
//                     `EVGENY: RETUREND RemovedCounter: ${
//                         JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter
//                     }`,
//                 );
//                 expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
//                     howManyRows_delete,
//                 );
//             }
//         });
//         const howManyRows_create = 150000; //QTY! -- this is here so we can print it in the log (report)
//         const schemaName_create = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
//         const scheme_create: AddonDataScheme = {
//             Name: schemaName_create,
//             Type: 'data',
//             Fields: {
//                 Value1: { Type: 'String' },
//                 Value2: { Type: 'String' },
//                 Value3: { Type: 'String' },
//             },
//         };
//         // it(`TEST IMPORT: RUNNING ON ${howManyRows_create} ROWS!, TABLE NAME: ${schemaName_create}, SCHEME: ${JSON.stringify(
//         //     scheme_create,
//         // )}`, async function () {
//         //     //START OF DIMX UPLOAD USING PFS
//         //     const pfsService = new PFSService(generalService);
//         //     const adalService = new ADALService(generalService.papiClient);
//         //     //1. create new ADALTable to import to
//         //     console.log(`new ADAL table will be called: ${schemaName_create}`);
//         //     const createSchemaResponse = await adalService.postSchema(scheme_create);
//         //     expect(createSchemaResponse.Name).to.equal(schemaName_create);
//         //     expect(createSchemaResponse.Hidden).to.be.false;
//         //     expect(createSchemaResponse.Type).to.equal('data');
//         //     expect(createSchemaResponse.Fields?.Value1.Type).to.equal('String');
//         //     expect(createSchemaResponse.Fields?.Value2.Type).to.equal('String');
//         //     expect(createSchemaResponse.Fields?.Value3.Type).to.equal('String');
//         //     // 1.1 test the table is indeed new => empty
//         //     const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
//         //     const secretKey = await generalService.getSecretKey(addonUUID, varPass);
//         //     const getAdalTablenResponse = await generalService.fetchStatus(
//         //         `/addons/data/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,
//         //         {
//         //             method: 'GET',
//         //             headers: {
//         //                 'X-Pepperi-OwnerID': addonUUID,
//         //                 'X-Pepperi-SecretKey': secretKey,
//         //             },
//         //         },
//         //     );
//         //     expect(getAdalTablenResponse.Body).to.deep.equal([]);
//         //     // 1.2 create relation to import
//         //     const bodyForRelation = {
//         //         Name: schemaName_create,
//         //         AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
//         //         RelationName: 'DataImportResource',
//         //         Type: 'AddonAPI',
//         //         AddonRelativeURL: '',
//         //     };
//         //     const relationResponse = await generalService.fetchStatus(`/addons/data/relations`, {
//         //         method: 'POST',
//         //         body: JSON.stringify(bodyForRelation),
//         //         headers: {
//         //             'X-Pepperi-OwnerID': addonUUID,
//         //             'X-Pepperi-SecretKey': secretKey,
//         //         },
//         //     });
//         //     expect(relationResponse.Status).to.equal(200);
//         //     expect(relationResponse.Ok).to.equal(true);
//         //     const bodyForRelation_yoni = {
//         //         Name: schemaName_create,
//         //         AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
//         //         RelationName: 'DataExportResource',
//         //         Type: 'AddonAPI',
//         //         AddonRelativeURL: '',
//         //     };
//         //     const relationResponse_yoni = await generalService.fetchStatus(`/addons/data/relations`, {
//         //         method: 'POST',
//         //         body: JSON.stringify(bodyForRelation_yoni),
//         //         headers: {
//         //             'X-Pepperi-OwnerID': addonUUID,
//         //             'X-Pepperi-SecretKey': secretKey,
//         //         },
//         //     });
//         //     expect(relationResponse_yoni.Status).to.equal(200);
//         //     expect(relationResponse_yoni.Ok).to.equal(true);
//         //     // 2. create PFS Temp file
//         //     const fileName1 = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
//         //     const mime = 'text/csv';
//         //     const tempFileResponse1 = await pfsService.postTempFile({
//         //         FileName: fileName1,
//         //         MIME: mime,
//         //     });
//         //     expect(tempFileResponse1).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse1).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse1.TemporaryFileURL).to.include('pfs.');
//         //     const fileName2 = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
//         //     const tempFileResponse2 = await pfsService.postTempFile({
//         //         FileName: fileName2,
//         //         MIME: mime,
//         //     });
//         //     expect(tempFileResponse2).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse2).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse2.TemporaryFileURL).to.include('pfs.');
//         //     const fileName3 = 'Name' + Math.floor(Math.random() * 1000000).toString() + '.csv';
//         //     const tempFileResponse3 = await pfsService.postTempFile({
//         //         FileName: fileName3,
//         //         MIME: mime,
//         //     });
//         //     expect(tempFileResponse3).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse3).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
//         //     expect(tempFileResponse3.TemporaryFileURL).to.include('pfs.');
//         //     //3. create the data file
//         //     await createInitalData_create(howManyRows_create);
//         //     const buf1 = fs.readFileSync('./Data_0.csv');
//         //     const buf2 = fs.readFileSync('./Data_1.csv');
//         //     const buf3 = fs.readFileSync('./Data_2.csv');
//         //     debugger;
//         //     //4. upload the file to PFS Temp
//         //     const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse1.PutURL, buf1);
//         //     expect(putResponsePart1.ok).to.equal(true);
//         //     expect(putResponsePart1.status).to.equal(200);
//         //     console.log(tempFileResponse1.TemporaryFileURL);
//         //     const putResponsePart2 = await pfsService.putPresignedURL(tempFileResponse2.PutURL, buf2);
//         //     expect(putResponsePart2.ok).to.equal(true);
//         //     expect(putResponsePart2.status).to.equal(200);
//         //     console.log(tempFileResponse2.TemporaryFileURL);
//         //     const putResponsePart3 = await pfsService.putPresignedURL(tempFileResponse3.PutURL, buf3);
//         //     expect(putResponsePart3.ok).to.equal(true);
//         //     expect(putResponsePart3.status).to.equal(200);
//         //     console.log(tempFileResponse3.TemporaryFileURL);
//         //     //5. import the Temp File to ADAL
//         //     const bodyToImport1 = {
//         //         URI: tempFileResponse1.TemporaryFileURL,
//         //     };
//         //     const importResponse1 = await generalService.fetchStatus(
//         //         `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,

//         //         { method: 'POST', body: JSON.stringify(bodyToImport1) },
//         //     );

//         //     const start1 = Date.now();
//         //     const executionURI1 = importResponse1.Body.URI;
//         //     const auditLogResponseForImporting1 = await generalService.getAuditLogResultObjectIfValid(
//         //         executionURI1 as string,
//         //         240,
//         //         7000,
//         //     );
//         //     debugger;
//         //     expect((auditLogResponseForImporting1 as any).Status.ID).to.equal(1);
//         //     expect((auditLogResponseForImporting1 as any).Status.Name).to.equal('Success');
//         //     expect(JSON.parse(auditLogResponseForImporting1.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     expect(JSON.parse(auditLogResponseForImporting1.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     const duration1 = Date.now() - start1;
//         //     const durationInSec1 = (duration1 / 1000).toFixed(3);
//         //     console.log(`±±±±TOOK: seconds: ${durationInSec1}, which are: ${Number(durationInSec1) / 60} minutes±±±±`);
//         //     const bodyToImport2 = {
//         //         URI: tempFileResponse2.TemporaryFileURL,
//         //     };
//         //     const importResponse2 = await generalService.fetchStatus(
//         //         `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,
//         //         { method: 'POST', body: JSON.stringify(bodyToImport2) },
//         //     );
//         //     const start2 = Date.now();
//         //     const executionURI2 = importResponse2.Body.URI;
//         //     const auditLogResponseForImporting2 = await generalService.getAuditLogResultObjectIfValid(
//         //         executionURI2 as string,
//         //         240,
//         //         7000,
//         //     );
//         //     debugger;
//         //     expect((auditLogResponseForImporting2 as any).Status.ID).to.equal(1);
//         //     expect((auditLogResponseForImporting2 as any).Status.Name).to.equal('Success');
//         //     expect(JSON.parse(auditLogResponseForImporting2.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     expect(JSON.parse(auditLogResponseForImporting2.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     const duration2 = Date.now() - start2;
//         //     const durationInSec2 = (duration2 / 1000).toFixed(3);
//         //     console.log(`±±±±TOOK: seconds: ${durationInSec2}, which are: ${Number(durationInSec2) / 60} minutes±±±±`);
//         //     const bodyToImport3 = {
//         //         URI: tempFileResponse3.TemporaryFileURL,
//         //     };
//         //     const importResponse3 = await generalService.fetchStatus(
//         //         `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,
//         //         { method: 'POST', body: JSON.stringify(bodyToImport3) },
//         //     );
//         //     const start3 = Date.now();
//         //     const executionURI3 = importResponse3.Body.URI;
//         //     const auditLogResponseForImporting3 = await generalService.getAuditLogResultObjectIfValid(
//         //         executionURI3 as string,
//         //         240,
//         //         7000,
//         //     );
//         //     debugger;
//         //     expect((auditLogResponseForImporting3 as any).Status.ID).to.equal(1);
//         //     expect((auditLogResponseForImporting3 as any).Status.Name).to.equal('Success');
//         //     expect(JSON.parse(auditLogResponseForImporting3.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     expect(JSON.parse(auditLogResponseForImporting3.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
//         //         howManyRows_create / 3,
//         //     );
//         //     const duration3 = Date.now() - start3;
//         //     const durationInSec3 = (duration3 / 1000).toFixed(3);
//         //     console.log(`±±±±TOOK: seconds: ${durationInSec3}, which are: ${Number(durationInSec3) / 60} minutes±±±±`);
//         //     debugger;
//         //     //6. delete the ADAL table
//         //     // const newUUID = newUuid();
//         //     // console.log(`PURGE actionID: ${newUUID}`);
//         //     // const deleteSchemaResponse = await generalService.fetchStatus(`/addons/data/schemes/${schemaName_create}/purge`, {
//         //     //     method: 'POST',
//         //     //     headers: {
//         //     //         'X-Pepperi-OwnerID': addonUUID,
//         //     //         'X-Pepperi-SecretKey': secretKey,
//         //     //         'x-pepperi-actionid': newUUID,
//         //     //     },
//         //     // });
//         //     // const deleteSchemaResponseBody = deleteSchemaResponse.Body;
//         //     // if (deleteSchemaResponseBody.hasOwnProperty('Done')) {
//         //     //     expect(deleteSchemaResponseBody.Done).to.equal(true);
//         //     //     console.log(`EVGENY: RETUREND RemovedCounter: ${deleteSchemaResponseBody.RemovedCounter}`);
//         //     //     expect(deleteSchemaResponseBody.RemovedCounter).to.equal(howManyRows_create);
//         //     // } else if (deleteSchemaResponseBody.hasOwnProperty('URI')) {
//         //     //     const auditLogdeleteSchemaResponse = await generalService.getAuditLogResultObjectIfValid(
//         //     //         deleteSchemaResponseBody.URI as string,
//         //     //         120,
//         //     //         7000,
//         //     //     );
//         //     //     expect((auditLogdeleteSchemaResponse as any).Status.ID).to.equal(1);
//         //     //     expect((auditLogdeleteSchemaResponse as any).Status.Name).to.equal('Success');
//         //     //     expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).Done).to.equal(true);
//         //     //     console.log(
//         //     //         `EVGENY: RETUREND RemovedCounter: ${
//         //     //             JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter
//         //     //         }`,
//         //     //     );
//         //     //     expect(JSON.parse(auditLogdeleteSchemaResponse.AuditInfo.ResultObject).RemovedCounter).to.equal(
//         //     //         howManyRows_create,
//         //     //     );
//         //     // } else {
//         //     //     expect(deleteSchemaResponseBody, `${JSON.stringify(deleteSchemaResponseBody)}`).to.haveOwnProperty(
//         //     //         'URI',
//         //     //     );
//         //     // }
//         // });
//     });
// }

// async function createInitalData(howManyDataRows: number) {
//     const headers = 'Key,Value,Hidden';
//     const runningDataValue0 = 'key_index';
//     const runningDataValue1 = `"index"`;
//     const runningDataValue2 = 'false';
//     let strData = '';
//     strData += headers + '\n';
//     for (let index = 0; index < howManyDataRows; index++) {
//         strData += `${runningDataValue0.replace('index', index.toString())},`;
//         strData += `${runningDataValue1.replace('index', index.toString())},`;
//         strData += `${runningDataValue2.replace('index', index.toString())}\n`;
//     }
//     await genrateFile('Data', strData);
// }

// async function createInitalData_create(howManyDataRows: number) {
//     const headers = 'Key,Value1,Value2,Value3,Hidden';
//     const runningDataValue0 = 'key_index';
//     const runningDataValue1 = `2023-07-03T13:24:46.239Z_index`;
//     const runningDataValue2 = `2023-07-03T13:24:46.239Z_index`;
//     const runningDataValue3 = `2023-07-03T13:24:46.239Z_index`;
//     const runningDataValue4 = 'false';
//     let strData = '';
//     strData += headers + '\n';
//     let counter = 0;
//     let index_runner = 0;
//     for (let index = 0; index < howManyDataRows / 50000; index++) {
//         for (let index1 = 0; index1 < 50000; index1++) {
//             strData += `${runningDataValue0.replace('index', index_runner.toString())},`;
//             strData += `${runningDataValue1.replace('index', index_runner.toString())},`;
//             strData += `${runningDataValue2.replace('index', index_runner.toString())},`;
//             strData += `${runningDataValue3.replace('index', index_runner.toString())},`;
//             strData += `${runningDataValue4.replace('index', index_runner.toString())}\n`;
//             index_runner++;
//         }
//         await genrateFile(`Data_${counter}`, strData);
//         counter++;
//         strData = '';
//         strData += headers + '\n';
//     }
// }

// async function genrateFile(tempFileName, data) {
//     try {
//         fs.writeFileSync(`./${tempFileName}.csv`, data, 'utf-8');
//     } catch (error) {
//         throw new Error(`Error: ${(error as any).message}`);
//     }
// }
