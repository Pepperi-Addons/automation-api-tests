import { describe, it } from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { PFSService } from '../../services/pfs.service';
import fs from 'fs';
import { ADALService } from '../../services/adal.service';
import { AddonDataScheme } from '@pepperi-addons/papi-sdk';

chai.use(promised);

export async function Import150KToAdalFromDimx(client: Client, varPass) {
    //
    const generalService = new GeneralService(client);
    let varKey;
    if (generalService.papiClient['options'].baseURL.includes('staging')) {
        varKey = varPass.body.varKeyStage;
    } else {
        varKey = varPass.body.varKeyPro;
    }
    const testData = {
        'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', ''],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        'Export and Import Framework (DIMX)': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
    };
    if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
        const addonSecretKey = await generalService.getSecretKey(generalService['client'].AddonUUID, varKey);
        generalService['client'].AddonSecretKey = addonSecretKey;
        generalService.papiClient['options'].addonSecretKey = addonSecretKey;
    }
    const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const howManyRows_create = 150000; //QTY! -- this is here so we can print it in the log (report)
    const schemaName_create = 'AdalTable' + Math.floor(Math.random() * 1000000).toString(); //-- this is here so we can print it in the log (report)
    const scheme_create: AddonDataScheme = {
        Name: schemaName_create,
        Type: 'data',
        Fields: {
            Value1: { Type: 'String' },
            Value2: { Type: 'String' },
            Value3: { Type: 'String' },
        },
    };
    describe('ADAL CREATE SCHEME - IMPORT 150K ROWS USING PFS AND DIMX - EXPORT', async function () {
        describe('Prerequisites Addons for DIMX Big Data Import Tests', () => {
            //Test Data
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
        it(`TEST IMPORT TO ADAL: RUNNING ON FILE WITH ${howManyRows_create} ROWS, ADAL TABLE NAME: ${schemaName_create}, SCHEME: ${JSON.stringify(
            scheme_create,
        )}`, async function () {
            const pfsService = new PFSService(generalService);
            const adalService = new ADALService(generalService.papiClient);
            //1. create new ADALTable to import to
            console.log(`new ADAL table will be called: ${schemaName_create}`);
            const createSchemaResponse = await adalService.postSchema(scheme_create);
            expect(createSchemaResponse.Name).to.equal(schemaName_create);
            expect(createSchemaResponse.Hidden).to.be.false;
            expect(createSchemaResponse.Type).to.equal('data');
            expect(createSchemaResponse.Fields?.Value1.Type).to.equal('String');
            expect(createSchemaResponse.Fields?.Value2.Type).to.equal('String');
            expect(createSchemaResponse.Fields?.Value3.Type).to.equal('String');
            // 1.1 test the table is indeed new => empty
            const addonUUID = 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe';
            const secretKey = '1a3cbde5-1afb-412b-a7a0-5f314b1cc9e8';
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
            // 1.2 create relation to import
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
            const bodyForRelation_yoni = {
                Name: schemaName_create,
                AddonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
                RelationName: 'DataExportResource',
                Type: 'AddonAPI',
                AddonRelativeURL: '',
            };
            const relationResponse_yoni = await generalService.fetchStatus(`/addons/data/relations`, {
                method: 'POST',
                body: JSON.stringify(bodyForRelation_yoni),
                headers: {
                    'X-Pepperi-OwnerID': addonUUID,
                    'X-Pepperi-SecretKey': secretKey,
                },
            });
            expect(relationResponse_yoni.Status).to.equal(200);
            expect(relationResponse_yoni.Ok).to.equal(true);
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
            //3. create the data file
            await createInitalData_create(howManyRows_create);
            const buf1 = fs.readFileSync('./Data_NEW12.csv');
            //4. upload the file to PFS Temp
            const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse1.PutURL, buf1);
            expect(putResponsePart1.ok).to.equal(true);
            expect(putResponsePart1.status).to.equal(200);
            console.log(
                `CSV File That Is About To Be Uploaded To ${schemaName_create} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
            );
            //5. import the Temp File to ADAL
            const bodyToImport1 = {
                URI: tempFileResponse1.TemporaryFileURL,
            };
            debugger;
            const importResponse1 = await generalService.fetchStatus(
                `/addons/data/import/file/eb26afcd-3cf2-482e-9ab1-b53c41a6adbe/${schemaName_create}`,

                { method: 'POST', body: JSON.stringify(bodyToImport1) },
            );
            const start1 = Date.now();
            const executionURI1 = importResponse1.Body.URI;
            console.log('uploading started - this is a big file, may take up to ~40 minutes');
            const auditLogResponseForImporting1 = await generalService.getAuditLogResultObjectIfValid(
                executionURI1 as string,
                400,
                7000,
            );
            const duration1 = Date.now() - start1;
            const durationInSec1 = (duration1 / 1000).toFixed(3);
            console.log(
                `~~~~~~Upload To Adal Table TOOK: seconds: ${durationInSec1}, which are: ${
                    Number(durationInSec1) / 60
                } minutes~~~~~~`,
            );
            console.log(`1. Full Result From Dimx:\n${JSON.stringify(auditLogResponseForImporting1)}`);
            console.log(
                `2. Result Object From Dimx:\n${JSON.stringify(auditLogResponseForImporting1.AuditInfo.ResultObject)}`,
            );
            console.log(
                `3. Error Message Object From Dimx:\n${JSON.stringify(
                    auditLogResponseForImporting1.AuditInfo.ErrorMessage,
                )}`,
            );
            expect((auditLogResponseForImporting1 as any).Status.ID).to.equal(1);
            expect((auditLogResponseForImporting1 as any).Status.Name).to.equal('Success');
            expect(JSON.parse(auditLogResponseForImporting1.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                howManyRows_create,
            );
            expect(JSON.parse(auditLogResponseForImporting1.AuditInfo.ResultObject).LinesStatistics.Inserted).to.equal(
                howManyRows_create,
            );
        });
    });
}

async function createInitalData_create(howManyDataRows: number) {
    const headers = 'Key,Value1,Value2,Value3,Hidden';
    const runningDataValue0 = 'key_index';
    const runningDataValue1 = `evg_index`;
    const runningDataValue2 = `abc_index`;
    const runningDataValue3 = `jhjgj_index`;
    const runningDataValue4 = 'false';
    let strData = '';
    strData += headers + '\n';
    for (let index = 0; index < howManyDataRows; index++) {
        strData += `${runningDataValue0.replace('index', index.toString())},`;
        strData += `${runningDataValue1.replace('index', index.toString())},`;
        strData += `${runningDataValue2.replace('index', index.toString())},`;
        strData += `${runningDataValue3.replace('index', index.toString())},`;
        strData += `${runningDataValue4.replace('index', index.toString())}\n`;
    }
    await genrateFile(`Data_NEW12`, strData);
}

async function genrateFile(tempFileName, data) {
    try {
        fs.writeFileSync(`./${tempFileName}.csv`, data, 'utf-8');
    } catch (error) {
        throw new Error(`Error: ${(error as any).message}`);
    }
}
