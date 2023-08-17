import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { UDCService, UdcField } from '../../services/user-defined-collections.service';
import fs from 'fs';
import { PFSService } from '../../services/pfs.service';
import { WebAppHeader, WebAppHomePage, WebAppLoginPage } from '../pom';
import E2EUtils from '../utilities/e2e_utils';
import { ResourceViews } from '../pom/addons/ResourceList';

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
    const userInfoCollectionName = 'UserInfo';
    const userInfoCollectionSize = 1000;
    let driver: Browser;
    await generalService.baseAddonVersionsInstallation(varPass);
    // #region Upgrade survey dependencies

    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI has to be on version 9.6.x
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.%'], //to match sync version
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.7.%'], //has to remain untouched - latest 0.7.x
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''],
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
            it(`3. Create User Info UDC `, async function () {
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
                    userInfoCollectionName,
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
                const newCollection = documents.filter((doc) => doc.Name === userInfoCollectionName)[0];
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
            it(`4. Add Data To Divisions UDC: Import Ten Rows With Name And Code Which Are Keys`, async function () {
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
            it(`5. Add Data To Companies UDC: Import Two Rows With Name And Code Which Are Keys`, async function () {
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
            it(`6. Add Data To UserInfo UDC: Import Thousand Rows With: Division Reference, Company Reference, Account Reference And A Basic Value`, async function () {
                // 1. create the data file
                await generalService.createCSVFileForUserInfo(
                    'udc_file_for_userInfo',
                    userInfoCollectionSize,
                    companiesCollectionSize,
                    divisionCollectionSize,
                    'companyRef,divisionRef,accountRef#ExternalID,basicValue',
                    '',
                    ['company_code_index', 'division_code_index', 'accounts_index', 'val_index'],
                    'false',
                );
                const buf1 = fs.readFileSync('./udc_file_for_userInfo.csv');
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
                    `CSV File That Is About To Be Uploaded To ${userInfoCollectionName} Is Found In: ${tempFileResponse1.TemporaryFileURL}`,
                );
                //5. import the Temp File to ADAL
                const bodyToImport1 = {
                    URI: tempFileResponse1.TemporaryFileURL,
                };
                const importResponse = await generalService.fetchStatus(
                    `/addons/data/import/file/122c0e9d-c240-4865-b446-f37ece866c22/${userInfoCollectionName}`,

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
                expect(JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Total).to.equal(
                    userInfoCollectionSize,
                );
                expect(
                    JSON.parse(auditLogResponseForImporting.AuditInfo.ResultObject).LinesStatistics.Inserted,
                ).to.equal(userInfoCollectionSize);
                generalService.sleep(1000 * 5);
                const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                    userInfoCollectionName,
                    1,
                    250,
                );
                expect(allObjectsFromCollection.count).to.equal(userInfoCollectionSize);
            });
        });
        describe('UI Set Up: Create A View To Show UserInfo UDC, Set It Inside A Page, Create Slug For The Page And Set It In Acc. Dashboard To See Filtering By User', () => {
            let accountViewUUID;
            let accountViewName;
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData2(this);
            });
            it(`1. Create A View To Show UserInfo UDC`, async function () {
                const resourceListUtils = new E2EUtils(driver);
                const resourceViews = new ResourceViews(driver);
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                // Configure View - Accounts
                accountViewName = 'UserInfoView';
                await resourceListUtils.addView({
                    nameOfView: accountViewName,
                    descriptionOfView: 'User Info View',
                    nameOfResource: userInfoCollectionName,
                });
                accountViewUUID = await resourceListUtils.getUUIDfromURL();
                await resourceViews.customViewConfig(client, {
                    matchingEditorName: '',
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
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.goHome();
            });
            //TODO:
            it(`2. Create A Page For UserInfo Resource View`, async function () {
                ///---> ask Hagit how to set a View RL Block Inside a Page
            });
        });
        describe('Tear Down', () => {
            it(`Purging All left UDCs - To Keep Dist Clean`, async function () {
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
    });
}
