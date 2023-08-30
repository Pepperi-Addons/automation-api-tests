import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { UDCService, UdcField } from '../../services/user-defined-collections.service';
import fs from 'fs';
import { PFSService } from '../../services/pfs.service';
import { BrandedApp, WebAppHeader, WebAppHomePage, WebAppList, WebAppLoginPage } from '../pom';
import E2EUtils from '../utilities/e2e_utils';
import { ResourceEditors, ResourceList, ResourceViews } from '../pom/addons/ResourceList';
import { PageBuilder } from '../pom/addons/PageBuilder/PageBuilder';
import { Slugs } from '../pom/addons/Slugs';
import { DataViewsService } from '../../services/data-views.service';
import { BaseFormDataViewField, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import { UpsertFieldsToMappedSlugs } from '../blueprints/DataViewBlueprints';
import { AccountDashboardLayout } from '../pom/AccountDashboardLayout';
import { ObjectsService } from '../../services';
import { AccountsPage } from '../pom/Pages/AccountPage';

chai.use(promised);

export async function SyncTests(email: string, password: string, client: Client, varPass) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const pfsService = new PFSService(generalService);
    const divisionsCollectionName = 'Divisions';
    const divisionCollectionSize = 10;
    const companiesCollectionName = 'Companies';
    const companiesCollectionSize = 2;
    const accountsInfoCollectionName = 'AccountsInfo';
    const accpuntsInfoCollectionSize = 2000;
    const dataCollectionName = 'DataCollection';
    const dataCollectionSize = 10000;
    let slugNameCollectionData;
    let slugNameAccountInfo;
    let accountsInfoPageUUID;
    let dataCollectionPageUUID;
    let accountViewUUID;
    let dataCollectionViewUUID;
    let accountViewName;
    let dataCollectionViewName;
    let accountInfoEditorName;
    let editorKey;
    let accountInfoPageName;
    let dataCollectionPageName;
    let changedAccountName;
    const updatedValue = 'val_evgeny_xyz123';
    const repEmail = 'SyncE2ETestingSBRep@pepperitest.com';
    const repPass = '*5AX4m';
    const buyerEmail = 'SyncE2ETestingSBBuyer@pepperitest.com';
    const buyerPass = '2HT#bK';
    let driver: Browser;
    // await generalService.baseAddonVersionsInstallationNewSync(varPass);//---> has to get 1.0.X which is NOT avaliable
    // #region Upgrade survey dependencies

    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI has to be on version 9.6.x
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'], //to match sync version
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.7.%'], //has to remain untouched - latest 0.7.x
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],//---> has to get 1.0.X which is NOT avaliable
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade survey dependencies

    describe('Sync E2E Builder Tests Suit', async function () {
        describe('Prerequisites Addons for Survey Builder Tests', () => {
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
        describe('API Set Up: Create All UDC Data', () => {
            it(`1. Create Divisions UDC `, async function () {
                const divisionCode: UdcField = {
                    Name: 'divisionCode',
                    Mandatory: true,
                    Type: 'String',
                    Indexed: true,
                };
                const divisionName: UdcField = {
                    Name: 'divisionName',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [divisionCode, divisionName];
                const keysArray = [divisionCode];
                const response = await udcService.createUDCWithFields(
                    divisionsCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    keysArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.divisionCode.Type).to.equal('String');
                expect(response.divisionCode.Indexed).to.equal(true);
                expect(response.divisionName.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                const newCollection = documents.filter((doc) => doc.Name === divisionsCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                expect(newCollection.SyncData?.Sync).to.equal(true);
                const fields: any[] = [];
                for (const i in newCollection.Fields) {
                    fields.push({ Name: i, Field: newCollection.Fields[i] });
                }
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    expect(field.Field.Mandatory).to.equal(true);
                }
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(keysArray.map((key) => key.Name));
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`2. Create Companies UDC `, async function () {
                const companyCode: UdcField = {
                    Name: 'companyCode',
                    Mandatory: true,
                    Type: 'String',
                    Indexed: true,
                };
                const companyName: UdcField = {
                    Name: 'companyName',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [companyCode, companyName];
                const keysArray = [companyCode];
                const response = await udcService.createUDCWithFields(
                    companiesCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    keysArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.companyCode.Type).to.equal('String');
                expect(response.companyCode.Indexed).to.equal(true);
                expect(response.companyName.Type).to.equal('String');
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                const newCollection = documents.filter((doc) => doc.Name === companiesCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                expect(newCollection.SyncData?.Sync).to.equal(true);
                const fields: any[] = [];
                for (const i in newCollection.Fields) {
                    fields.push({ Name: i, Field: newCollection.Fields[i] });
                }
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    expect(field.Field.Mandatory).to.equal(true);
                }
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(keysArray.map((key) => key.Name));
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`3. Create AccountsInfo UDC `, async function () {
                const companyRef: UdcField = {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: companiesCollectionName,
                    ApplySystemFilter: true,
                    AdddonUID: '122c0e9d-c240-4865-b446-f37ece866c22',
                };
                const divisionRef: UdcField = {
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: divisionsCollectionName,
                    ApplySystemFilter: true,
                    AdddonUID: '122c0e9d-c240-4865-b446-f37ece866c22',
                };
                const accountRef: UdcField = {
                    Name: 'accountRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: 'accounts',
                    ApplySystemFilter: true,
                    AdddonUID: 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f',
                };
                const basicValue: UdcField = {
                    Name: 'basicValue',
                    Mandatory: true,
                    Indexed: true,
                    Type: 'String',
                };
                const fieldsArray = [companyRef, divisionRef, accountRef, basicValue];
                const keysArray = [companyRef, divisionRef, accountRef];
                const response = await udcService.createUDCWithFields(
                    accountsInfoCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    keysArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.companyRef.Type).to.equal('Resource');
                expect(response.companyRef.Resource).to.equal('Companies');
                expect(response.companyRef.ApplySystemFilter).to.equal(true);
                expect(response.basicValue.Type).to.equal('String');
                expect(response.basicValue.Indexed).to.equal(true);
                expect(response.divisionRef.Type).to.equal('Resource');
                expect(response.divisionRef.Resource).to.equal('Divisions');
                expect(response.divisionRef.ApplySystemFilter).to.equal(true);
                expect(response.accountRef.Type).to.equal('Resource');
                expect(response.accountRef.Resource).to.equal('accounts');
                expect(response.accountRef.ApplySystemFilter).to.equal(true);
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                const newCollection = documents.filter((doc) => doc.Name === accountsInfoCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                expect(newCollection.SyncData?.Sync).to.equal(true);
                const fields: any[] = [];
                for (const i in newCollection.Fields) {
                    fields.push({ Name: i, Field: newCollection.Fields[i] });
                }
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    expect(field.Field.Mandatory).to.equal(true);
                }
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(keysArray.map((key) => key.Name));
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`4. Create DataCollection UDC `, async function () {
                const companyRef: UdcField = {
                    Name: 'companyRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: companiesCollectionName,
                    ApplySystemFilter: true,
                    AdddonUID: '122c0e9d-c240-4865-b446-f37ece866c22',
                };
                const divisionRef: UdcField = {
                    Name: 'divisionRef',
                    Mandatory: true,
                    Type: 'Resource',
                    Resource: divisionsCollectionName,
                    ApplySystemFilter: true,
                    AdddonUID: '122c0e9d-c240-4865-b446-f37ece866c22',
                };
                const basicValue1: UdcField = {
                    Name: 'basicValue1',
                    Mandatory: true,
                    Indexed: true,
                    Type: 'String',
                };
                const basicValue2: UdcField = {
                    Name: 'basicValue2',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [companyRef, divisionRef, basicValue1, basicValue2];
                const keysArray = [companyRef, divisionRef, basicValue1];
                const response = await udcService.createUDCWithFields(
                    dataCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    keysArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.companyRef.Type).to.equal('Resource');
                expect(response.companyRef.Resource).to.equal('Companies');
                expect(response.companyRef.ApplySystemFilter).to.equal(true);
                expect(response.basicValue1.Type).to.equal('String');
                expect(response.basicValue1.Indexed).to.equal(true);
                expect(response.basicValue2.Type).to.equal('String');
                expect(response.divisionRef.Type).to.equal('Resource');
                expect(response.divisionRef.Resource).to.equal('Divisions');
                expect(response.divisionRef.ApplySystemFilter).to.equal(true);
                generalService.sleep(5000);
                const documents = await udcService.getSchemes({ page_size: -1 });
                const newCollection = documents.filter((doc) => doc.Name === dataCollectionName)[0];
                expect(newCollection).to.not.equal(undefined);
                expect(newCollection.AddonUUID).to.equal(UserDefinedCollectionsUUID);
                expect(newCollection.Description).to.equal('automation testing UDC');
                expect(newCollection).to.haveOwnProperty('DocumentKey');
                expect(newCollection.SyncData?.Sync).to.equal(true);
                const fields: any[] = [];
                for (const i in newCollection.Fields) {
                    fields.push({ Name: i, Field: newCollection.Fields[i] });
                }
                for (let index = 0; index < fields.length; index++) {
                    const field = fields[index];
                    expect(field.Field.Mandatory).to.equal(true);
                }
                let documentKey = {};
                if (newCollection.DocumentKey) {
                    documentKey = newCollection.DocumentKey;
                }
                expect(documentKey['Delimiter']).to.equal('@');
                expect(documentKey['Fields']).to.deep.equal(keysArray.map((key) => key.Name));
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`5. Add Data To Divisions UDC: Import Ten Rows With Name And Code Which Are Keys`, async function () {
                // 1. create the data file
                await generalService.createCSVFile(
                    'udc_file_for_divisions',
                    divisionCollectionSize,
                    'divisionCode,divisionName',
                    '',
                    ['division_code_index', 'division_name_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./udc_file_for_divisions.csv');
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
                    `CSV File That Is About To Be Uploaded To ${divisionsCollectionName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${divisionsCollectionName}`,

                    { method: 'POST', body: JSON.stringify(bodyToImport1) },
                );
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    400,
                    7000,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                console.log(
                    `Received Line Statistics From ${divisionsCollectionName}, Are: ${JSON.stringify(
                        JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics,
                    )}`,
                );
                // debugger;
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    divisionCollectionSize,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(divisionCollectionSize);
                generalService.sleep(1000 * 5);
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    divisionsCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(divisionCollectionSize);
            });
            it(`6. Add Data To Companies UDC: Import Two Rows With Name And Code Which Are Keys`, async function () {
                // 1. create the data file
                await generalService.createCSVFile(
                    'udc_file_for_companies',
                    companiesCollectionSize,
                    'companyCode,companyName',
                    '',
                    ['company_code_index', 'company_name_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./udc_file_for_companies.csv');
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
                    `CSV File That Is About To Be Uploaded To ${companiesCollectionName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${companiesCollectionName}`,

                    { method: 'POST', body: JSON.stringify(bodyToImport1) },
                );
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    400,
                    7000,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                console.log(
                    `Received Line Statistics From ${companiesCollectionName}, Are: ${JSON.stringify(
                        JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics,
                    )}`,
                );
                // debugger;
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    companiesCollectionSize,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(companiesCollectionSize);
                generalService.sleep(1000 * 5);
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    companiesCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(companiesCollectionSize);
            });
            it(`7. Add Data To AccountsInfo UDC: Import Thousand Rows With: Division Reference, Company Reference, Account Reference And A Basic Value`, async function () {
                // 1. create the data file
                await generalService.createCSVFileForAccountsInfo(
                    'udc_file_for_accountsInfo',
                    accpuntsInfoCollectionSize,
                    companiesCollectionSize,
                    divisionCollectionSize,
                    'companyRef,divisionRef,accountRef#ExternalID,basicValue',
                    '',
                    ['company_code_index', 'division_code_index', 'accounts_index', 'val_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./udc_file_for_accountsInfo.csv');
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
                    `CSV File That Is About To Be Uploaded To ${accountsInfoCollectionName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,

                    { method: 'POST', body: JSON.stringify(bodyToImport1) },
                );
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    400,
                    7000,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                console.log(
                    `Received Line Statistics From ${accountsInfoCollectionName}, Are: ${JSON.stringify(
                        JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics,
                    )}`,
                );
                // debugger;
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    accpuntsInfoCollectionSize,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(accpuntsInfoCollectionSize);
                generalService.sleep(1000 * 30);
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    accountsInfoCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(accpuntsInfoCollectionSize);
            });
            it(`8. Add Data To DataCollection UDC: Import Ten Thousand Rows With: Division Reference, Company Reference, BasicValue1 And BasicValue2 - Which Are Strings`, async function () {
                // 1. create the data file
                await generalService.createCSVFileForAccountsInfo(
                    'udc_file_for_dataCollection',
                    dataCollectionSize,
                    companiesCollectionSize,
                    divisionCollectionSize,
                    'companyRef,divisionRef,basicValue1,basicValue2',
                    '',
                    ['company_code_index', 'division_code_index', 'val1_index', 'val2_abc_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./udc_file_for_dataCollection.csv');
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
                    `CSV File That Is About To Be Uploaded To ${dataCollectionName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${dataCollectionName}`,

                    { method: 'POST', body: JSON.stringify(bodyToImport1) },
                );
                const executionURI = importResponse.Body.URI;
                const auditLogResponseForImporting = await generalService.getAuditLogResultObjectIfValid(
                    executionURI as string,
                    400,
                    7000,
                );
                expect((auditLogResponseForImporting as any).Status.ID).to.equal(1);
                expect((auditLogResponseForImporting as any).Status.Name).to.equal('Success');
                console.log(
                    `Received Line Statistics From ${dataCollectionName}, Are: ${JSON.stringify(
                        JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics,
                    )}`,
                );
                // debugger;
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    dataCollectionSize,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(dataCollectionSize);
                generalService.sleep(1000 * 30);
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    dataCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(dataCollectionSize);
            });
        });
        describe(`UI Set Up: Create A View's
         To Show DataCollection & AccountsInfo UDC's, Set It Inside A Page, Create Slug For The Page And Set It In Acc. Dashboard To See Filtering By User`, () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Create An Editor For AccountInfo View`, async function () {
                const resourceListUtils = new E2EUtils(driver);
                const resourceEditors = new ResourceEditors(driver);
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                accountInfoEditorName = 'AccountsInfoEditor';
                // Configure View - User Info UDC
                await resourceListUtils.addEditor({
                    nameOfEditor: accountInfoEditorName,
                    descriptionOfEditor: 'for test',
                    nameOfResource: accountsInfoCollectionName,
                });
                // Configure Editor
                await resourceListUtils.gotoEditPageOfSelectedEditorByName(accountInfoEditorName);
                editorKey = await resourceListUtils.getUUIDfromURL();
                const editorFields: BaseFormDataViewField[] =
                    resourceListUtils.prepareDataForDragAndDropAtEditorAndView([
                        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'accountRef', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'companyRef', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'divisionRef', dataViewType: 'TextBox', mandatory: false, readonly: true },
                        { fieldName: 'basicValue', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    ]);
                await resourceEditors.customEditorConfig(
                    generalService,
                    {
                        editorKey: editorKey,
                        fieldsToConfigureInView: editorFields,
                    },
                    accountInfoEditorName,
                );
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it(`2. Create A View To Show AccountInfo UDC & DataCollection UDC`, async function () {
                const resourceListUtils = new E2EUtils(driver);
                const resourceViews = new ResourceViews(driver);
                // Configure View - User Info UDC
                accountViewName = 'AccountsInfoView';
                await resourceListUtils.addView({
                    nameOfView: accountViewName,
                    descriptionOfView: 'Accounts Info View',
                    nameOfResource: accountsInfoCollectionName,
                });
                accountViewUUID = await resourceListUtils.getUUIDfromURL();
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: accountInfoEditorName,
                    viewKey: accountViewUUID,
                    fieldsToConfigureInView: [
                        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'accountRef', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'companyRef', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'divisionRef', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'basicValue', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    ],
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                generalService.sleep(1000 * 3);
                // Configure View - Data Collection UDC
                dataCollectionViewName = 'DataCollectionView';
                await resourceListUtils.addView({
                    nameOfView: dataCollectionViewName,
                    descriptionOfView: 'Data Collection View',
                    nameOfResource: dataCollectionName,
                });
                dataCollectionViewUUID = await resourceListUtils.getUUIDfromURL();
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
                    viewKey: dataCollectionViewUUID,
                    fieldsToConfigureInView: [
                        { fieldName: 'Key', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'divisionRef', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'companyRef', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'basicValue1', dataViewType: 'TextBox', mandatory: false, readonly: false },
                        { fieldName: 'basicValue2', dataViewType: 'TextBox', mandatory: false, readonly: false },
                    ],
                });
                await resourceViews.clickUpdateHandleUpdatePopUpGoBack();
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            it(`3. Create A Page For AccountsInfo Resource View & DataCollection Resource View`, async function () {
                const e2eUtils = new E2EUtils(driver);
                accountInfoPageName = 'AccountsInfoPage';
                accountsInfoPageUUID = await e2eUtils.addPageNoSections(accountInfoPageName, 'tests');
                const pageBuilder = new PageBuilder(driver);
                const createdPageAccountInfo = await pageBuilder.getPageByUUID(accountsInfoPageUUID, client);
                const sectionUUIDAccountInfo = createdPageAccountInfo.Layout.Sections[0].Key;
                const pageResponseAccountInfo = await pageBuilder.publishPageWithResourceListDataViewerBlock(
                    accountsInfoPageUUID,
                    accountInfoPageName,
                    accountViewName,
                    accountsInfoCollectionName,
                    accountViewUUID,
                    sectionUUIDAccountInfo,
                    client,
                );
                expect(pageResponseAccountInfo.Ok).to.equal(true);
                expect(pageResponseAccountInfo.Status).to.equal(200);
                const actualAccountInfoPage = pageResponseAccountInfo.Body;
                expect(actualAccountInfoPage.Key).to.equal(accountsInfoPageUUID);
                expect(actualAccountInfoPage.Name).to.equal(accountInfoPageName);
                expect(actualAccountInfoPage.Hidden).to.equal(false);
                const accountInfoPageBlock = actualAccountInfoPage.Blocks[0];
                expect(accountInfoPageBlock.Configuration.Resource).to.equal('DataViewerBlock');
                expect(accountInfoPageBlock.Configuration.AddonUUID).to.equal('0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3');
                expect(accountInfoPageBlock.Configuration.Data.viewsList[0].selectedResource).to.equal(
                    accountsInfoCollectionName,
                );
                expect(accountInfoPageBlock.Configuration.Data.viewsList[0].title).to.equal(accountViewName);
                //////////////////////////////////////
                dataCollectionPageName = 'DataCollectionPage';
                dataCollectionPageUUID = await e2eUtils.addPageNoSections(dataCollectionPageName, 'tests');
                const createdPageDataCollection = await pageBuilder.getPageByUUID(dataCollectionPageUUID, client);
                const dataCollectionsectionUUID = createdPageDataCollection.Layout.Sections[0].Key;
                const pageResponseDataCollection = await pageBuilder.publishPageWithResourceListDataViewerBlock(
                    dataCollectionPageUUID,
                    dataCollectionPageName,
                    dataCollectionViewName,
                    dataCollectionName,
                    dataCollectionViewUUID,
                    dataCollectionsectionUUID,
                    client,
                );
                expect(pageResponseDataCollection.Ok).to.equal(true);
                expect(pageResponseDataCollection.Status).to.equal(200);
                const actualDataCollectionPage = pageResponseDataCollection.Body;
                expect(actualDataCollectionPage.Key).to.equal(dataCollectionPageUUID);
                expect(actualDataCollectionPage.Name).to.equal(dataCollectionPageName);
                expect(actualDataCollectionPage.Hidden).to.equal(false);
                const dataCollectionPageBlock = actualDataCollectionPage.Blocks[0];
                expect(dataCollectionPageBlock.Configuration.Resource).to.equal('DataViewerBlock');
                expect(dataCollectionPageBlock.Configuration.AddonUUID).to.equal(
                    '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',
                );
                expect(dataCollectionPageBlock.Configuration.Data.viewsList[0].selectedResource).to.equal(
                    dataCollectionName,
                );
                expect(dataCollectionPageBlock.Configuration.Data.viewsList[0].title).to.equal(dataCollectionViewName);
            });
            it(`4. Create A Slug For CollectionData Page And Add To HomePage`, async function () {
                slugNameCollectionData = `datacollection_slug_${generalService.generateRandomString(4)}`;
                const slugPath = slugNameCollectionData;
                await CreateSlug(
                    email,
                    password,
                    driver,
                    generalService,
                    slugNameCollectionData,
                    slugPath,
                    dataCollectionPageUUID,
                );
                driver.sleep(5000);
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                const brandedApp = new BrandedApp(driver);
                await brandedApp.addRepHomePageButtons(slugNameCollectionData);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.validateATDIsApearingOnHomeScreen(slugNameCollectionData);
            });
            it(`5. Create A Slug For AccountsInfo Page And Add To HomePage`, async function () {
                slugNameAccountInfo = `accountsinfo_slug_${generalService.generateRandomString(4)}`;
                const slugPath = slugNameAccountInfo;
                await CreateSlug(
                    email,
                    password,
                    driver,
                    generalService,
                    slugNameAccountInfo,
                    slugPath,
                    accountsInfoPageUUID,
                );
                driver.sleep(5000);
            });
            it(`6. Set Slug To Be Shown In Acc. Dashboard`, async function () {
                const accountDashboardLayout = new AccountDashboardLayout(driver);
                await accountDashboardLayout.configureToAccountMenuRepCardEVGENY(
                    driver,
                    slugNameAccountInfo,
                    slugNameAccountInfo,
                );
            });
        });
        describe('UI Tests - Enter DataCollection Page From Home Page - See Data Is Loading And Valid', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Admin`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                //1. re-sync
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.reSyncApp();
                await webAppHomePage.enterATD(slugNameCollectionData);
                generalService.sleep(3 * 1000);
                const webAppList = new WebAppList(driver);
                const numberOfElements = await webAppList.getNumOfElementsTitle();
                expect(Number(numberOfElements)).to.equal(dataCollectionSize);
                await webAppList.clickEmptySpace();
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const rowElement = allDataAsArray[index];
                    //rowElement[0] - Key
                    expect(rowElement[0]).to.contain('@');
                    expect(rowElement[0]).to.contain('company_code');
                    expect(rowElement[0]).to.contain('division_code');
                    expect(rowElement[0]).to.contain('val1');
                    //rowElement[1] - division
                    expect(rowElement[1]).to.contain('division_code_');
                    //rowElement[2] - company
                    expect(rowElement[2]).to.contain('company_code_');
                    //rowElement[3] - val1
                    expect(rowElement[3]).to.contain('val1_');
                    //rowElement[4] - val2
                    expect(rowElement[4]).to.contain('val2_abc_');
                }
                await webAppLoginPage.logout();
            });
            it(`2. Sales Rep`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForRep(repEmail, repPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.enterATD(slugNameCollectionData);
                generalService.sleep(4 * 1000);
                const webAppList = new WebAppList(driver);
                const numberOfElements = await webAppList.getNumOfElementsTitle();
                expect(Number(numberOfElements)).to.equal(dataCollectionSize);
                await webAppList.clickEmptySpace();
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const rowElement = allDataAsArray[index];
                    //rowElement[0] - Key
                    expect(rowElement[0]).to.contain('@');
                    expect(rowElement[0]).to.contain('company_code');
                    expect(rowElement[0]).to.contain('division_code');
                    expect(rowElement[0]).to.contain('val1');
                    //rowElement[1] - division
                    expect(rowElement[1]).to.contain('division_code_');
                    //rowElement[2] - company
                    expect(rowElement[2]).to.contain('company_code_');
                    //rowElement[3] - val1
                    expect(rowElement[3]).to.contain('val1_');
                    //rowElement[4] - val2
                    expect(rowElement[4]).to.contain('val2_abc_');
                }
                await webAppLoginPage.logout();
            });
            it(`3. Buyer`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForBuyer(buyerEmail, buyerPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                await webAppHomePage.enterATD(slugNameCollectionData);
                generalService.sleep(6 * 1000);
                const webAppList = new WebAppList(driver);
                const numberOfElements = await webAppList.getNumOfElementsTitle();
                expect(Number(numberOfElements)).to.equal(dataCollectionSize);
                await webAppList.clickEmptySpace();
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const rowElement = allDataAsArray[index];
                    //rowElement[0] - Key
                    expect(rowElement[0]).to.contain('@');
                    expect(rowElement[0]).to.contain('company_code');
                    expect(rowElement[0]).to.contain('division_code');
                    expect(rowElement[0]).to.contain('val1');
                    //rowElement[1] - division
                    expect(rowElement[1]).to.contain('division_code_');
                    //rowElement[2] - company
                    expect(rowElement[2]).to.contain('company_code_');
                    //rowElement[3] - val1
                    expect(rowElement[3]).to.contain('val1_');
                    //rowElement[4] - val2
                    expect(rowElement[4]).to.contain('val2_abc_');
                }
            });
        });
        describe('UI Tests - Enter 10 Account Dashboards And See Data Is Arriving', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Admin`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                //1. re-sync
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.reSyncApp();
                //2. choose 10 random accounts
                const objectsService = new ObjectsService(generalService);
                const allAccounts = await objectsService.getAccounts({ page_size: -1 });
                const filteredAccounts = allAccounts.filter(
                    (account) => account.Name?.includes('accounts_') && Number(account.Name.split('_')[1]) <= 1000,
                );
                const accountArray = generalService.getNumberOfRandomElementsFromArray(filteredAccounts, 10);
                const accountNamesArray = accountArray.map((account) => account.Name);
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                for (let index = 0; index < accountNamesArray.length; index++) {
                    await webAppHomePage.clickOnBtn('Accounts');
                    generalService.sleep(1000 * 5);
                    const accountName = accountNamesArray[index];
                    console.log(
                        `Testing Account: ${accountName}, Number ${index + 1} Out Of ${accountNamesArray.length}`,
                    );
                    await webAppList.searchInList(accountName);
                    await webAppList.clickOnLinkFromListRowWebElement(0);
                    const eseUtils = new E2EUtils(driver);
                    const accUUID = await eseUtils.getUUIDfromURL();
                    await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                    generalService.sleep(1000 * 15);
                    await accountPage.clickOnEmptySpace(accountViewName);
                    const allListElements = await webAppList.getAllListElementsTextValue();
                    const allDataAsArray = allListElements.map((element) => element.split('\n'));
                    for (let index = 0; index < allDataAsArray.length; index++) {
                        const dataRow = allDataAsArray[index];
                        //0 - key
                        expect(dataRow[0]).to.equal(`${dataRow[2]}@${dataRow[3]}@${accUUID}`);
                        //1 - accountRef
                        expect(dataRow[1]).to.equal(accUUID);
                        //get company and division data from UDC for this account
                        const bodyToSend = {};
                        bodyToSend['KeyList'] = [dataRow[0]];
                        const response = await generalService.fetchStatus(
                            `/addons/data/search/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,
                            { method: 'POST', body: JSON.stringify(bodyToSend) },
                        );
                        expect(response.Ok).to.equal(true);
                        expect(response.Status).to.equal(200);
                        const division = response.Body.Objects[0].divisionRef;
                        const company = response.Body.Objects[0].companyRef;
                        //2 - companyRef
                        expect(dataRow[2]).to.equal(company);
                        //3 - divisionRef
                        expect(dataRow[3]).to.equal(division);
                        //4 - dasicVal
                        expect(dataRow[4]).to.equal(`val_${accountName.split('_')[1]}`);
                        await webAppHomePage.returnToHomePage();
                    }
                }
                await webAppLoginPage.logout();
            });
            it(`2. Sales Rep`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForRep(repEmail, repPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                //2. choose 10 random accounts
                const objectsService = new ObjectsService(generalService);
                const allAccounts = await objectsService.getAccounts({ page_size: -1 });
                const filteredAccounts = allAccounts.filter(
                    (account) => account.Name?.includes('accounts_') && Number(account.Name.split('_')[1]) < 1000,
                );
                const accountArray = generalService.getNumberOfRandomElementsFromArray(filteredAccounts, 10);
                const accountNamesArray = accountArray.map((account) => account.Name);
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                for (let index = 0; index < accountNamesArray.length; index++) {
                    await webAppHomePage.clickOnBtn('Accounts');
                    generalService.sleep(1000 * 5);
                    const accountName = accountNamesArray[index];
                    console.log(
                        `Testing Account: ${accountName}, Number ${index + 1} Out Of ${accountNamesArray.length}`,
                    );
                    await webAppList.searchInList(accountName);
                    await webAppList.clickOnLinkFromListRowWebElement(0);
                    const eseUtils = new E2EUtils(driver);
                    const accUUID = await eseUtils.getUUIDfromURL();
                    await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                    generalService.sleep(1000 * 5);
                    await accountPage.clickOnEmptySpace(accountViewName);
                    const allListElements = await webAppList.getAllListElementsTextValue();
                    const allDataAsArray = allListElements.map((element) => element.split('\n'));
                    for (let index = 0; index < allDataAsArray.length; index++) {
                        const dataRow = allDataAsArray[index];
                        //0 - key
                        expect(dataRow[0]).to.equal(`${dataRow[2]}@${dataRow[3]}@${accUUID}`);
                        //1 - accountRef
                        expect(dataRow[1]).to.equal(accUUID);
                        //get company and division data from UDC for this account
                        const bodyToSend = {};
                        bodyToSend['KeyList'] = [dataRow[0]];
                        const response = await generalService.fetchStatus(
                            `/addons/data/search/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,
                            { method: 'POST', body: JSON.stringify(bodyToSend) },
                        );
                        expect(response.Ok).to.equal(true);
                        expect(response.Status).to.equal(200);
                        const division = response.Body.Objects[0].divisionRef;
                        const company = response.Body.Objects[0].companyRef;
                        //2 - companyRef
                        expect(dataRow[2]).to.equal(company);
                        //3 - divisionRef
                        expect(dataRow[3]).to.equal(division);
                        //4 - dasicVal
                        expect(dataRow[4]).to.equal(`val_${accountName.split('_')[1]}`);
                        await webAppHomePage.returnToHomePage();
                    }
                }
                await webAppLoginPage.logout();
            });
            it(`3. Buyer`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForBuyer(buyerEmail, buyerPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                await webAppHomePage.clickOnBtn('Accounts');
                generalService.sleep(1000 * 5);
                const accountName = 'accounts_0';
                await webAppList.clickOnLinkFromListRowWebElement(0);
                const eseUtils = new E2EUtils(driver);
                const accUUID = await eseUtils.getUUIDfromURL();
                await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                generalService.sleep(1000 * 8);
                await accountPage.clickOnEmptySpace(accountViewName);
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const dataRow = allDataAsArray[index];
                    //0 - key
                    expect(dataRow[0]).to.equal(`${dataRow[2]}@${dataRow[3]}@${accUUID}`);
                    //1 - accountRef
                    expect(dataRow[1]).to.equal(accUUID);
                    //get company and division data from UDC for this account
                    const bodyToSend = {};
                    bodyToSend['KeyList'] = [dataRow[0]];
                    const response = await generalService.fetchStatus(
                        `/addons/data/search/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,
                        { method: 'POST', body: JSON.stringify(bodyToSend) },
                    );
                    expect(response.Ok).to.equal(true);
                    expect(response.Status).to.equal(200);
                    const division = response.Body.Objects[0].divisionRef;
                    const company = response.Body.Objects[0].companyRef;
                    //2 - companyRef
                    expect(dataRow[2]).to.equal(company);
                    //3 - divisionRef
                    expect(dataRow[3]).to.equal(division);
                    //4 - dasicVal
                    expect(dataRow[4]).to.equal(`val_${accountName.split('_')[1]}`);
                }
                await webAppHomePage.returnToHomePage();
            });
        });
        describe('UI Tests - Change Certain UDC Row Via UI And See Data Was Updated In Admin, Buyer & Rep', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it(`1. Admin - Change The Basic Value Of "Accounts_0" account`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                await webAppHomePage.clickOnBtn('Accounts');
                generalService.sleep(1000 * 5);
                changedAccountName = 'accounts_0';
                await webAppList.searchInList(changedAccountName);
                await webAppList.clickOnLinkFromListRowWebElement(0);
                await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                generalService.sleep(1000 * 15);
                await accountPage.clickOnEmptySpace(accountViewName);
                await webAppList.clickOnRadioButtonByElementIndex(0);
                await webAppList.clickOnPencilMenuButton();
                await webAppList.clickOnPencilMenuButtonEdit();
                generalService.sleep(1000 * 8);
                const resourceListService = new ResourceList(driver);
                await resourceListService.editDataInsideRsourceListEditorPopup('basicValue', updatedValue);
                await webAppLoginPage.logout();
            });
            it(`2. Sales Rep`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForRep(repEmail, repPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                await webAppHomePage.clickOnBtn('Accounts');
                generalService.sleep(1000 * 5);
                await webAppList.searchInList(changedAccountName);
                await webAppList.clickOnLinkFromListRowWebElement(0);
                const eseUtils = new E2EUtils(driver);
                const accUUID = await eseUtils.getUUIDfromURL();
                await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                generalService.sleep(1000 * 5);
                await accountPage.clickOnEmptySpace(accountViewName);
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const dataRow = allDataAsArray[index];
                    //0 - key
                    expect(dataRow[0]).to.equal(`${dataRow[2]}@${dataRow[3]}@${accUUID}`);
                    //1 - accountRef
                    expect(dataRow[1]).to.equal(accUUID);
                    //get company and division data from UDC for this account
                    const bodyToSend = {};
                    bodyToSend['KeyList'] = [dataRow[0]];
                    const response = await generalService.fetchStatus(
                        `/addons/data/search/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,
                        { method: 'POST', body: JSON.stringify(bodyToSend) },
                    );
                    expect(response.Ok).to.equal(true);
                    expect(response.Status).to.equal(200);
                    const division = response.Body.Objects[0].divisionRef;
                    const company = response.Body.Objects[0].companyRef;
                    //2 - companyRef
                    expect(dataRow[2]).to.equal(company);
                    //3 - divisionRef
                    expect(dataRow[3]).to.equal(division);
                    //4 - dasicVal
                    expect(dataRow[4]).to.equal(updatedValue);
                    await webAppHomePage.returnToHomePage();
                }
                await webAppLoginPage.logout();
            });
            it(`3. Buyer`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.longLoginForBuyer(buyerEmail, buyerPass);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                const webAppList = new WebAppList(driver);
                const accountPage = new AccountsPage(driver);
                await webAppHomePage.clickOnBtn('Accounts');
                generalService.sleep(1000 * 5);
                await webAppList.clickOnLinkFromListRowWebElement(0);
                const eseUtils = new E2EUtils(driver);
                const accUUID = await eseUtils.getUUIDfromURL();
                await accountPage.selectOptionFromBurgerMenu(slugNameAccountInfo);
                generalService.sleep(1000 * 8);
                await accountPage.clickOnEmptySpace(accountViewName);
                const allListElements = await webAppList.getAllListElementsTextValue();
                const allDataAsArray = allListElements.map((element) => element.split('\n'));
                for (let index = 0; index < allDataAsArray.length; index++) {
                    const dataRow = allDataAsArray[index];
                    //0 - key
                    expect(dataRow[0]).to.equal(`${dataRow[2]}@${dataRow[3]}@${accUUID}`);
                    //1 - accountRef
                    expect(dataRow[1]).to.equal(accUUID);
                    //get company and division data from UDC for this account
                    const bodyToSend = {};
                    bodyToSend['KeyList'] = [dataRow[0]];
                    const response = await generalService.fetchStatus(
                        `/addons/data/search/122c0e9d-c240-4865-b446-f37ece866c22/${accountsInfoCollectionName}`,
                        { method: 'POST', body: JSON.stringify(bodyToSend) },
                    );
                    expect(response.Ok).to.equal(true);
                    expect(response.Status).to.equal(200);
                    const division = response.Body.Objects[0].divisionRef;
                    const company = response.Body.Objects[0].companyRef;
                    //2 - companyRef
                    expect(dataRow[2]).to.equal(company);
                    //3 - divisionRef
                    expect(dataRow[3]).to.equal(division);
                    //4 - dasicVal
                    expect(dataRow[4]).to.equal(updatedValue);
                }
                await webAppHomePage.returnToHomePage();
            });
        });
        describe('Tear Down Via API', () => {
            it('1. resource editor', async function () {
                const accBody = { Key: editorKey, Hidden: true };
                const deleteAccountRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/editors`,
                    {
                        method: 'POST',
                        body: JSON.stringify(accBody),
                    },
                );
                expect(deleteAccountRLResponse.Ok).to.equal(true);
                expect(deleteAccountRLResponse.Status).to.equal(200);
                expect(deleteAccountRLResponse.Body.Name).to.equal(accountInfoEditorName);
                expect(deleteAccountRLResponse.Body.Hidden).to.equal(true);
            });
            it('2. resource views', async function () {
                const accBodyForAccountInfo = { Key: accountViewUUID, Hidden: true };
                const deleteAccountRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(accBodyForAccountInfo),
                    },
                );
                expect(deleteAccountRLResponse.Ok).to.equal(true);
                expect(deleteAccountRLResponse.Status).to.equal(200);
                expect(deleteAccountRLResponse.Body.Name).to.equal(accountViewName);
                expect(deleteAccountRLResponse.Body.Hidden).to.equal(true);
                const accBodyForDataCollection = { Key: dataCollectionViewUUID, Hidden: true };
                const deleteDataCollectionRLResponse = await generalService.fetchStatus(
                    `/addons/api/0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3/api/views`,
                    {
                        method: 'POST',
                        body: JSON.stringify(accBodyForDataCollection),
                    },
                );
                expect(deleteDataCollectionRLResponse.Ok).to.equal(true);
                expect(deleteDataCollectionRLResponse.Status).to.equal(200);
                expect(deleteDataCollectionRLResponse.Body.Name).to.equal(dataCollectionViewName);
                expect(deleteDataCollectionRLResponse.Body.Hidden).to.equal(true);
            });
            it('3. pages', async function () {
                //3. delete relevant pages
                const deleteAccounrInfoPageResponse = await generalService.fetchStatus(
                    `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${accountsInfoPageUUID}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({}),
                    },
                );
                expect(deleteAccounrInfoPageResponse.Ok).to.equal(true);
                expect(deleteAccounrInfoPageResponse.Status).to.equal(200);
                expect(deleteAccounrInfoPageResponse.Body).to.equal(true);
                const deleteDataCollectionPageResponse = await generalService.fetchStatus(
                    `/addons/api/50062e0c-9967-4ed4-9102-f2bc50602d41/internal_api/remove_page?key=${dataCollectionPageUUID}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({}),
                    },
                );
                expect(deleteDataCollectionPageResponse.Ok).to.equal(true);
                expect(deleteDataCollectionPageResponse.Status).to.equal(200);
                expect(deleteDataCollectionPageResponse.Body).to.equal(true);
            });
            it('4. slugs', async function () {
                const slugs: Slugs = new Slugs(driver);
                const accountInfoSlugsResponse = await slugs.deleteSlugByName(slugNameAccountInfo, client);
                expect(accountInfoSlugsResponse.Ok).to.equal(true);
                expect(accountInfoSlugsResponse.Status).to.equal(200);
                expect(accountInfoSlugsResponse.Body.success).to.equal(true);
                const dataCollectionSlugsResponse = await slugs.deleteSlugByName(slugNameCollectionData, client);
                expect(dataCollectionSlugsResponse.Ok).to.equal(true);
                expect(dataCollectionSlugsResponse.Status).to.equal(200);
                expect(dataCollectionSlugsResponse.Body.success).to.equal(true);
            });
            it(`5. Purging All left UDCs - To Keep Dist Clean`, async function () {
                const udcService = new UDCService(generalService);
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
        describe('Tear Down Via UI', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it('Delete AccountInfo slug from acc. dashboard', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const accountDashboardLayout = new AccountDashboardLayout(driver);
                await accountDashboardLayout.unconfigureFromAccountMenuRepCardEVGENY(
                    driver,
                    slugNameAccountInfo,
                    slugNameAccountInfo,
                );
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.returnToHomePage();
            });
            it('Delete DataCollection ATD from home screen', async function () {
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                driver.sleep(6000);
                const brandedApp = new BrandedApp(driver);
                await brandedApp.removeRepHomePageButtons(slugNameCollectionData);
                const webAppHomePage = new WebAppHomePage(driver);
                for (let index = 0; index < 2; index++) {
                    await webAppHomePage.manualResync(client);
                }
                const isNotFound = await webAppHomePage.validateATDIsNOTApearingOnHomeScreen(slugNameCollectionData);
                expect(isNotFound).to.equal(true);
            });
        });
    });
}

async function CreateSlug(
    email: string,
    password: string,
    driver: Browser,
    generalService: GeneralService,
    slugDisplayName: string,
    slug_path: string,
    pageToMapToKey: string,
) {
    // const slugDisplayName = 'slideshow_slug';
    // const slug_path = 'slideshow_slug';
    const e2eUiService = new E2EUtils(driver);
    await e2eUiService.navigateTo('Slugs');
    const slugs: Slugs = new Slugs(driver);
    driver.sleep(2000);
    if (await driver.isElementVisible(slugs.SlugMappingScreenTitle)) {
        await slugs.clickTab('Slugs_Tab');
    }
    driver.sleep(2000);
    await slugs.createSlugEvgeny(slugDisplayName, slug_path, 'for testing');
    driver.sleep(1000);
    await slugs.clickTab('Mapping_Tab');
    driver.sleep(1000);
    await slugs.waitTillVisible(slugs.EditPage_ConfigProfileCard_EditButton_Rep, 5000);
    await slugs.click(slugs.EditPage_ConfigProfileCard_EditButton_Rep);
    await slugs.isSpinnerDone();
    driver.sleep(2500);
    const dataViewsService = new DataViewsService(generalService.papiClient);
    const existingMappedSlugs = await slugs.getExistingMappedSlugsList(dataViewsService);
    const slugsFields: MenuDataViewField[] = e2eUiService.prepareDataForDragAndDropAtSlugs(
        [{ slug_path: slug_path, pageUUID: pageToMapToKey }],
        existingMappedSlugs,
    );
    console.info(`slugsFields: ${JSON.stringify(slugsFields, null, 2)}`);
    const slugsFieldsToAddToMappedSlugsObj = new UpsertFieldsToMappedSlugs(slugsFields);
    console.info(`slugsFieldsToAddToMappedSlugs: ${JSON.stringify(slugsFieldsToAddToMappedSlugsObj, null, 2)}`);
    const upsertFieldsToMappedSlugs = await dataViewsService.postDataView(slugsFieldsToAddToMappedSlugsObj);
    console.info(`RESPONSE: ${JSON.stringify(upsertFieldsToMappedSlugs, null, 2)}`);
    driver.sleep(2 * 1000);
    await e2eUiService.logOutLogIn(email, password);
    const webAppHomePage = new WebAppHomePage(driver);
    await webAppHomePage.isSpinnerDone();
    await e2eUiService.navigateTo('Slugs');
    await slugs.clickTab('Mapping_Tab');
    driver.sleep(15 * 1000);
    const webAppHeader = new WebAppHeader(driver);
    await webAppHeader.goHome();
}
