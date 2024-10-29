import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Client } from '@pepperi-addons/debug-server/dist';
import { Browser } from '../utilities/browser';
import { WebAppLoginPage } from '../pom';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import chai, { expect } from 'chai';
import GeneralService from '../../services/general.service';
import E2EUtils from '../utilities/e2e_utils';
import { ObjectsService } from '../../services/objects.service';
import {
    // CollectionDefinition,
    FieldDefinition,
    UDCService,
} from '../../services/user-defined-collections.service';
import { Collection, UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { BodyToUpsertUdcWithFields } from '../blueprints/UdcBlueprints';

chai.use(promised);

export async function SyncResyncPerformanceTests(email: string, password: string, client: Client, varPass: string) {
    /** Description **/
    /* the Nebulus / Nebula Performance Tests measure sync & resync perform time with the following scenarios:
        0 - sync
        add 10k - sync
        add/modify 1k - sync
        add 100k - sync
        add/modify 1k - sync
        in UDT, UDC+nebulus / UDC+nebula
        
        UDC should have 1 field with about 200 chars
    */

    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const objectsService = new ObjectsService(generalService);
    // const testUniqueString = generalService.generateRandomString(5);
    const dateTime = new Date();
    const performanceMeasurements = {};
    const collectionProperties = [
        'GenericResource',
        'ModificationDateTime',
        'SyncData',
        'SyncDataDirty', // DI-28156
        'CreationDateTime',
        'UserDefined',
        'Fields',
        'Description',
        'DataSourceData',
        'DocumentKey',
        'Type',
        'Lock',
        'ListView',
        'Hidden',
        'Name',
        'AddonUUID',
    ];

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // open-sync 2.0.% or 3.%
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

    describe(`Prerequisites Addons for Lists Tests - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | Tested user: ${email} | Date Time: ${dateTime}`, () => {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            const status = currentAddonChnageVersionResponse[4];
            const note = currentAddonChnageVersionResponse[5];

            describe(`"${addonName}"`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (status == 'Failure') {
                        expect(note).to.include('is already working on version');
                    } else {
                        expect(status).to.include('Success');
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

    const installedSyncVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Sync',
    )?.Version;
    const installedNebulaVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Nebula',
    )?.Version;
    const installedNebulusVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Nebulus',
    )?.Version;

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let e2eUtils: E2EUtils;
    // let allUDTs;
    let allUDCs: Collection[];
    // let udtsDeleteResponses;
    let udtsDeleteResponse;
    // let udcsDeleteResponses;
    let createdUDT;
    let bulkUpdateUDT;

    describe(`Sync Resync Performance Test Suite |  Sync Ver: ${installedSyncVersion}, Nebulus Ver: ${installedNebulusVersion}, Nebula Ver: ${installedNebulaVersion}`, async () => {
        describe('Performance Measurement tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                e2eUtils = new E2EUtils(driver);
            });

            after(async function () {
                await driver.quit();
            });

            // it('UDTs Pre-clean via API', async () => {
            //     allUDTs = await objectsService.getUDTMetaDataList();
            //     addContext(this, {
            //         title: `All UDTs`,
            //         value: JSON.stringify(allUDTs, null, 2),
            //     });
            //     udtsDeleteResponses = await Promise.all(
            //         allUDTs.map(async (udt) => {
            //             return udt.InternalID ? await objectsService.deleteUDT(udt.InternalID) : undefined;
            //         }),
            //     );
            // });

            // it('Validate UDTs were deleted', async () => {
            //     allUDTs = await objectsService.getUDT();
            //     udtsDeleteResponses.forEach(deleteResponse => {
            //         expect(deleteResponse).to.be.oneOf([true, undefined]);
            //     });
            //     expect(allUDTs).to.be.an('array').with.lengthOf(0);
            // });

            // it('UDCs Pre-clean via API', async () => {
            //     allUDCs = await udcService.getSchemes();
            //     udcsDeleteResponses = await Promise.all(
            //         allUDCs.map(async (udc) => {
            //             return await udcService.truncateScheme(udc.Name);
            //         }),
            //     );
            // });

            it('Validate UDCs were deleted', async () => {
                allUDCs = await udcService.getSchemes();
                expect(allUDCs).to.be.an('array').with.lengthOf(0);
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            it('Perform Manual Sync (No Data) With Time Measurement', async function () {
                const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Sync Time Interval`,
                    value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Sync'] = {
                    milisec: syncTime,
                    sec: Number((syncTime / 1000).toFixed(1)),
                };
                expect(syncTime).to.be.a('number').and.greaterThan(0);
            });

            it('Perform Manual Resync (No Data) With Time Measurement', async function () {
                const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                addContext(this, {
                    title: `Resync Time Interval`,
                    value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                });
                performanceMeasurements['No Data Resync'] = {
                    milisec: resyncTime,
                    sec: Number((resyncTime / 1000).toFixed(1)),
                };
                expect(resyncTime).to.be.a('number').and.greaterThan(0);
            });

            describe('UDT', async () => {
                it('Create UDT', async function () {
                    createdUDT = await objectsService.postUDTMetaData({
                        // InternalID: Math.floor(Math.random() * 1000000),
                        TableID: `SyncPerformanceUDT_Test`,
                        MainKeyType: {
                            ID: 54,
                            Name: 'Catalog Name',
                        },
                        SecondaryKeyType: {
                            ID: 0,
                            Name: 'Any',
                        },
                    });
                    addContext(this, {
                        title: `createdUDT`,
                        value: JSON.stringify(createdUDT, null, 2),
                    });
                    // const getCreatedUDT = createdUDT.InternalID ? await objectsService.getUDTMetaData(createdUDT.InternalID) : undefined;
                    // expect(getCreatedUDT).to.not.be.undefined;
                    // expect(getCreatedUDT).to.haveOwnProperty('InternalID');
                    // expect(getCreatedUDT).to.haveOwnProperty('TableID');
                    // expect(getCreatedUDT).to.haveOwnProperty('MainKeyType');
                    // expect(getCreatedUDT).to.haveOwnProperty('SecondaryKeyType');
                    // expect(getCreatedUDT?.InternalID).to.equal(createdUDT.InternalID);
                    // expect(getCreatedUDT?.TableID).to.equal(createdUDT.TableID);
                });

                it('Bulk update UDT with 10K Rows', async function () {
                    const lines: string[][] = [];
                    for (let index = 1; index < 10001; index++) {
                        lines.push([createdUDT.TableID, `Test ${index}`, '', `Value ${index}`]);
                    }
                    addContext(this, {
                        title: `Lines Length`,
                        value: `${lines.length}`,
                    });
                    bulkUpdateUDT = await objectsService.bulkCreate('user_defined_tables', {
                        Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
                        Lines: lines,
                    });
                    expect(bulkUpdateUDT.JobID).to.be.a('number');
                    expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
                });

                it('Validate Number of Rows of UDT is 10K', async function () {
                    const testUDTsize = await objectsService.countUDTRows({
                        where: `MapDataExternalID='${createdUDT.TableID}'`,
                    });
                    addContext(this, {
                        title: `${createdUDT.TableID} Size`,
                        value: `${testUDTsize}`,
                    });
                    expect(testUDTsize).to.be.a('number').and.equal(10000);
                });

                it('Perform Manual Sync (10K Rows UDT) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Sync (10K Rows)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (10K Rows UDT) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Resync (10K Rows)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Modify 1K Rows of the created UDT', async function () {
                    const dataToBatch: UserDefinedTableRow[] = [];
                    for (let index = 1; index < 1001; index++) {
                        dataToBatch.push({
                            MapDataExternalID: createdUDT.TableID,
                            MainKey: `Test ${index}`,
                            SecondaryKey: '',
                            Values: [`Value X`],
                        });
                    }
                    addContext(this, {
                        title: `dataToBatch length`,
                        value: `${dataToBatch.length}`,
                    });
                    addContext(this, {
                        title: `first item of dataToBatch`,
                        value: JSON.stringify(dataToBatch[0], null, 2),
                    });
                    const batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
                    addContext(this, {
                        title: `first item of batchUDTresponse`,
                        value: JSON.stringify(batchUDTresponse[0], null, 2),
                    });
                    expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
                });

                it('Validate Number of Rows of UDT is 10K', async function () {
                    const testUDTsize = await objectsService.countUDTRows({
                        where: `MapDataExternalID='${createdUDT.TableID}'`,
                    });
                    addContext(this, {
                        title: `${createdUDT.TableID} Size`,
                        value: `${testUDTsize}`,
                    });
                    expect(testUDTsize).to.be.a('number').and.equal(10000);
                });

                it('Perform Manual Sync (10K Rows UDT + 1K Modification) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Sync (10K Rows + 1K Modification)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (10K Rows UDT + 1K Modification) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Resync (10K Rows + 1K Modification)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Bulk update UDT with 100K Rows', async function () {
                    const lines: string[][] = [];
                    for (let index = 1; index < 100001; index++) {
                        lines.push([createdUDT.TableID, `Test ${index}`, '', `Value ${index}`]);
                    }
                    addContext(this, {
                        title: `Lines Length`,
                        value: `${lines.length}`,
                    });
                    bulkUpdateUDT = await objectsService.bulkCreate('user_defined_tables', {
                        Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
                        Lines: lines,
                    });
                    expect(bulkUpdateUDT.JobID).to.be.a('number');
                    expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
                });

                it('Validate Number of Rows of UDT is 100K', async function () {
                    const testUDTsize = await objectsService.countUDTRows({
                        where: `MapDataExternalID='${createdUDT.TableID}'`,
                    });
                    addContext(this, {
                        title: `${createdUDT.TableID} Size`,
                        value: `${testUDTsize}`,
                    });
                    expect(testUDTsize).to.be.a('number').and.equal(100000);
                });

                it('Perform Manual Sync (100K Rows UDT) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Sync (100K Rows)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (100K Rows UDT) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Resync (100K Rows)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Modify 1K Rows of the enlagred UDT', async function () {
                    const dataToBatch: UserDefinedTableRow[] = [];
                    for (let index = 1; index < 1001; index++) {
                        dataToBatch.push({
                            MapDataExternalID: createdUDT.TableID,
                            MainKey: `Test ${index}`,
                            SecondaryKey: '',
                            Values: [`-`],
                        });
                    }
                    addContext(this, {
                        title: `dataToBatch length`,
                        value: `${dataToBatch.length}`,
                    });
                    addContext(this, {
                        title: `first item of dataToBatch`,
                        value: JSON.stringify(dataToBatch[0], null, 2),
                    });
                    const batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
                    addContext(this, {
                        title: `first item of batchUDTresponse`,
                        value: JSON.stringify(batchUDTresponse[0], null, 2),
                    });
                    expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
                });

                it('Perform Manual Sync (100K Rows UDT + 1K Modification) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Sync (100K Rows + 1K Modification)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (100K Rows UDT + 1K Modification) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDT Resync (100K Rows + 1K Modification)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Delete Test UDT via API', async function () {
                    udtsDeleteResponse = await objectsService.deleteUDTMetaData(createdUDT.InternalID);
                    expect(udtsDeleteResponse).to.be.true;
                });

                it('Validate UDTs deletedtion was successful', async function () {
                    const getTestUDT = await objectsService.getUDTMetaData(createdUDT.InternalID);
                    expect(getTestUDT).to.haveOwnProperty('Hidden');
                    expect(getTestUDT.Hidden).to.be.true;
                });
            });

            describe('UDC', async () => {
                it('Create UDC', async function () {
                    const udcName = 'SyncPerformanceUDCTest';
                    const fields: FieldDefinition[] = [
                        {
                            classType: 'Primitive',
                            fieldName: 'str',
                            fieldTitle: '',
                            field: { Type: 'String', Mandatory: false, Indexed: false, Description: '' },
                        },
                        {
                            classType: 'Primitive',
                            fieldName: 'int',
                            fieldTitle: '',
                            field: { Type: 'Integer', Mandatory: false, Indexed: false, Description: '' },
                        },
                    ];
                    const bodyOfCollection: BodyToUpsertUdcWithFields = udcService.prepareDataForUdcCreation({
                        nameOfCollection: udcName,
                        descriptionOfCollection: 'Created with Automation',
                        typeOfCollection: 'data',
                        syncDefinitionOfCollection: { Sync: false },
                        fieldsOfCollection: fields,
                    });
                    const upsertResponse = await udcService.postScheme(bodyOfCollection);
                    console.info(`Upsert Response: ${JSON.stringify(upsertResponse, null, 2)}`);
                    expect(upsertResponse).to.be.an('object');
                    Object.keys(upsertResponse).forEach((collectionProperty) => {
                        expect(collectionProperty).to.be.oneOf(collectionProperties);
                    });
                    expect(upsertResponse.Name).to.equal(udcName);
                    expect(upsertResponse.Fields).to.be.an('object');
                    if (upsertResponse.Fields) expect(Object.keys(upsertResponse.Fields)).to.eql(['str', 'int']);

                    addContext(this, {
                        title: `Collection data for "${udcName}" (CollectionFields): `,
                        value: fields,
                    });
                    addContext(this, {
                        title: `Upsert Response: `,
                        value: JSON.stringify(upsertResponse, null, 2),
                    });
                });

                // it('Insert 10K Rows to UDC', async function () {});

                // it('Validate Number of Rows of UDC is 10K', async function () {});

                it('Perform Manual Sync (10K Rows UDC) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Sync (10K Rows)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (10K Rows UDC) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Resync (10K Rows)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                // it('Modify 1K Rows of the created UDC', async function () {});

                // it('Validate Number of Rows of UDC is 10K', async function () {});

                it('Perform Manual Sync (10K Rows UDC + 1K Modification) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Sync (10K Rows + 1K Modification)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (10K Rows UDC + 1K Modification) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Resync (10K Rows + 1K Modification)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                // it('Add 90K Rows to the created UDC', async function () {});

                it('Perform Manual Sync (100K Rows UDC) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Sync (100K Rows)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (100K Rows UDC) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Resync (100K Rows)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                // it('Modify 1K Rows of the enlagred UDC', async function () {});

                it('Perform Manual Sync (100K Rows UDC + 1K Modification) With Time Measurement', async function () {
                    const syncTime = await e2eUtils.performManualSyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Sync Time Interval`,
                        value: `milisec: ${syncTime} , ${(syncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Sync (100K Rows + 1K Modification)'] = {
                        milisec: syncTime,
                        sec: Number((syncTime / 1000).toFixed(1)),
                    };
                    expect(syncTime).to.be.a('number').and.greaterThan(0);
                });

                it('Perform Manual Resync (100K Rows UDC + 1K Modification) With Time Measurement', async function () {
                    const resyncTime = await e2eUtils.performManualResyncWithTimeMeasurement.bind(this)(client, driver);
                    addContext(this, {
                        title: `Resync Time Interval`,
                        value: `milisec: ${resyncTime} , ${(resyncTime / 1000).toFixed(1)} S`,
                    });
                    performanceMeasurements['UDC Resync (100K Rows + 1K Modification)'] = {
                        milisec: resyncTime,
                        sec: Number((resyncTime / 1000).toFixed(1)),
                    };
                    expect(resyncTime).to.be.a('number').and.greaterThan(0);
                });

                // it('Delete Test UDC via API', async function () {});

                // it('Validate UDCs deletedtion was successful', async function () {});
            });

            describe('Conclusion', async () => {
                it(`Measured Performance Time List`, async function () {
                    addContext(this, {
                        title: `All Measured Times (in seconds):`,
                        value: `${JSON.stringify(performanceMeasurements, null, 2)}`,
                    });
                    console.info(JSON.stringify(performanceMeasurements, null, 2));
                });
            });
        });
    });
}
