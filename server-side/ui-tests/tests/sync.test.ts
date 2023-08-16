// import { Browser } from '../utilities/browser';
import { describe, it} from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { Client } from '@pepperi-addons/debug-server/dist';
import { UDCService, UdcField } from '../../services/user-defined-collections.service';

chai.use(promised);

export async function SyncTests(email: string, password: string, client: Client, varPass) {
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const generalService = new GeneralService(client);
    // let driver: Browser;
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

    describe('Survey Builder Tests Suit', async function () {
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

        describe('Create All UDC Data', () => {
            it(`1. Create Divisions UDC `, async function () {
                const divisionsCollectionName = 'Divisions';
                const udcService = new UDCService(generalService);
                const divisionCode: UdcField = {
                    Name: 'divisionCode',
                    Mandatory: true,
                    Type: 'String',
                };
                const divisionName: UdcField = {
                    Name: 'divisionName',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [divisionCode, divisionName];
                const response = await udcService.createUDCWithFields(
                    divisionsCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    fieldsArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.divisionCode.Type).to.equal('String');
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
                expect(documentKey['Fields']).to.deep.equal(['divisionCode','divisionName']);
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
            });
            it(`2. Create Companies UDC `, async function () {
                const divisionsCollectionName = 'Companies';
                const udcService = new UDCService(generalService);
                const companyCode: UdcField = {
                    Name: 'companyCode',
                    Mandatory: true,
                    Type: 'String',
                };
                const companyName: UdcField = {
                    Name: 'companyName',
                    Mandatory: true,
                    Type: 'String',
                };
                const fieldsArray = [companyCode, companyName];
                const response = await udcService.createUDCWithFields(
                    divisionsCollectionName,
                    fieldsArray,
                    'automation testing UDC',
                    undefined,
                    false,
                    fieldsArray,
                );
                expect(response.Fail).to.be.undefined;
                expect(response.companyCode.Type).to.equal('String');
                expect(response.companyName.Type).to.equal('String');
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
                expect(documentKey['Fields']).to.deep.equal(['companyCode','companyName']);
                expect(documentKey['Type']).to.equal('Composite');
                expect(newCollection.Type).to.equal('data');
                expect(newCollection.Hidden).to.equal(false);
                expect(newCollection.GenericResource).to.equal(true);
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
        // describe('Test Configured Survey', () => {
        //     this.retries(0);

        //     before(async function () {
        //         driver = await Browser.initiateChrome();
        //     });

        //     after(async function () {
        //         await driver.quit();
        //     });

        //     afterEach(async function () {
        //         const webAppHomePage = new WebAppHomePage(driver);
        //         await webAppHomePage.collectEndTestData(this);
        //     });
        //     it('1. Fill First Survey And Validate All Is Working', async function () {

        //     });
        //     it('Data Cleansing: 1. survey template', async function () {

        //     });
        //     it('Data Cleansing: 2. resource views', async function () {
        //     });
        //     it('Data Cleansing: 3. pages', async function () {
        //     });
        //     it('Data Cleansing: 4. script', async function () {

        //     });
        //     it('Data Cleansing: 5. UDC', async function () {

        //     });
        //     it('Data Cleansing: 6. slugs', async function () {

        //     });
        //     it('Data Cleansing: 7. ATD from home screen', async function () {

        //     });
        // });
    });
}
