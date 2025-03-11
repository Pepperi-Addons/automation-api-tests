import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import * as path from 'path';
import fs from 'fs';
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
import { BatchApiResponse, Collection, UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { BodyToUpsertUdcWithFields } from '../blueprints/UdcBlueprints';
import { PFSService } from '../../services/pfs.service';
// import { createInitalData } from '../../api-tests/user_defined_collections_100K_overwrite';

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
    const pfsService = new PFSService(generalService);
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
    // const tableName = `SyncPerformanceUDT_Test_${testUniqueString}`;
    const tableName = `SyncPerformanceUDT_Test`;
    const collectionName = 'SyncPerformanceUDCTest';
    const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    const random200charString = generalService.generateRandomString(200);

    await generalService.baseAddonVersionsInstallation(varPass);

    const testData = {
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // open-sync 2.0.% or 3.%
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);

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
    let udtsTableRows: UserDefinedTableRow[];
    let udtsTableRowsNoAddonCpi: UserDefinedTableRow[];
    let udtsTableRowsTestTable: UserDefinedTableRow[];
    let allUDTs;
    let allUDCs: Collection[];
    let udtsRowsDeleteResponses: BatchApiResponse[];
    let udtsDeleteResponses;
    let udtsDeleteResponse;
    let udcsDeleteResponses;
    let createdUDT;
    let bulkUpdateUDT;
    let howManyRows;
    let noUdtData = false;
    let noUdcData = false;

    describe(`Sync Resync Performance Test Suite |  Sync Ver: ${installedSyncVersion}, Nebulus Ver: ${installedNebulusVersion}, Nebula Ver: ${installedNebulaVersion} |  ${dateTime}`, async () => {
        describe('Performance Measurement tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                e2eUtils = new E2EUtils(driver);
                udtsTableRows = [];
            });

            after(async function () {
                await driver.quit();
            });

            it('UDTs Pre-clean via API', async function () {
                let index = 1;
                udtsTableRows = await objectsService.getUDT({ page_size: -1 });
                console.info('Index: 0 , udtsTableRows length: ', udtsTableRows.length);
                addContext(this, {
                    title: `All udtsTableRows length`,
                    value: `index: ${index} , udtsTableRows length: ${udtsTableRows.length}`,
                });
                udtsTableRowsNoAddonCpi = udtsTableRows.filter((tableRow) => {
                    if (tableRow.MapDataExternalID != 'ADDON_CPI_SIDE_DATA') {
                        return tableRow;
                    }
                });
                console.info(
                    'first element in udtsTableRowsNoAddonCpi: ',
                    JSON.stringify(udtsTableRowsNoAddonCpi[0], null, 2),
                );
                addContext(this, {
                    title: `first element in udtsTableRowsNoAddonCpi`,
                    value: JSON.stringify(udtsTableRowsNoAddonCpi[0], null, 2),
                });

                do {
                    udtsTableRows = await objectsService.getUDT({ page_size: 250, page: index });
                    udtsTableRowsNoAddonCpi = udtsTableRows.filter((tableRow) => {
                        if (tableRow.MapDataExternalID != 'ADDON_CPI_SIDE_DATA') {
                            return tableRow;
                        }
                    });
                    console.info(
                        'Index: ',
                        index,
                        ' , udtsTableRowsNoAddonCpi length: ',
                        udtsTableRowsNoAddonCpi.length,
                    );
                    udtsTableRowsNoAddonCpi.forEach((tableRow) => {
                        tableRow.Hidden = true;
                    });

                    udtsRowsDeleteResponses = await objectsService.postBatchUDT(udtsTableRowsNoAddonCpi);
                    udtsRowsDeleteResponses.forEach((rowDeleteResponse) => {
                        Object.keys(rowDeleteResponse).forEach((rowDeleteResponseKey) => {
                            expect(rowDeleteResponseKey).to.be.oneOf([
                                'InternalID',
                                'ExternalID',
                                'Message',
                                'Status',
                                'URI',
                                'UUID',
                            ]);
                        });
                        expect(rowDeleteResponse.Status).to.equal('Update');
                        expect(rowDeleteResponse.Message).to.equal('Row updated.');
                    });
                    index++;
                } while (udtsTableRows.length > 0 && index < 402);

                allUDTs = await objectsService.getUDTMetaDataList();
                addContext(this, {
                    title: `index`,
                    value: `${index}`,
                });
                addContext(this, {
                    title: `All UDTs`,
                    value: JSON.stringify(allUDTs, null, 2),
                });
                console.info(JSON.stringify(allUDTs, null, 2));
                const testUDTs = allUDTs.filter((table) => {
                    if (table['TableID'].startsWith(tableName)) return table;
                });
                console.info(JSON.stringify(testUDTs, null, 2));
                udtsDeleteResponses = await Promise.all(
                    testUDTs.map(async (udt) => {
                        return await objectsService.deleteUDTMetaData(udt.TableID as number);
                    }),
                );
                udtsDeleteResponses.forEach((deleteResponse) => {
                    expect(deleteResponse).to.be.true;
                });
            });

            it('UDCs Pre-clean via API', async function () {
                allUDCs = await udcService.getSchemes();
                udcsDeleteResponses = await Promise.all(
                    allUDCs.map(async (udc) => {
                        return await udcService.purgeScheme(udc.Name);
                    }),
                );
                udcsDeleteResponses.forEach((deleteResponse) => {
                    expect(deleteResponse.Ok).to.be.true;
                    expect(deleteResponse.Status).to.equal(200);
                    expect(deleteResponse.Error).to.eql({});
                    expect(Object.keys(deleteResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                    expect(deleteResponse.Body.Done).to.be.true;
                });
            });

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
            });

            it('Perform Manual Sync NO Time Measurement', async function () {
                await e2eUtils.performManualSync.bind(this)(client, driver);
            });

            it('Perform Manual Resync NO Time Measurement', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('Logout Login', async function () {
                await e2eUtils.logOutLogIn(email, password, client);
            });

            it('Validate UDTs were deleted', async function () {
                udtsTableRows = await objectsService.getUDT({ page_size: -1 });
                driver.sleep(1 * 1000);
                udtsTableRowsNoAddonCpi = udtsTableRows.filter((tableRow) => {
                    if (tableRow.MapDataExternalID !== 'ADDON_CPI_SIDE_DATA') {
                        return tableRow;
                    }
                });
                addContext(this, {
                    title: `All UDT documents Length`,
                    value: `${udtsTableRows.length}`,
                });
                addContext(this, {
                    title: `All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents`,
                    value: `${udtsTableRowsNoAddonCpi.length}`,
                });
                allUDTs = await objectsService.getUDTMetaDataList();
                addContext(this, {
                    title: `All UDT active tables`,
                    value: JSON.stringify(allUDTs, null, 2),
                });
                expect(udtsTableRowsNoAddonCpi).to.be.an('array').with.lengthOf(0);
                expect(allUDTs).to.be.an('array').with.lengthOf(1);
                expect(allUDTs[0]['TableID']).to.equal('ADDON_CPI_SIDE_DATA');
                noUdtData = true;
            });

            it('Validate UDCs were deleted', async function () {
                allUDCs = await udcService.getSchemes();
                expect(allUDCs).to.be.an('array').with.lengthOf(0);
                noUdcData = true;
            });

            it('Perform Manual Sync (No Data) With Time Measurement', async function () {
                if (noUdtData && noUdcData) {
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
                }
            });

            it('Perform Manual Resync (No Data) With Time Measurement', async function () {
                if (noUdtData && noUdcData) {
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
                }
            });

            describe('UDT', async () => {
                it('Create UDT', async function () {
                    createdUDT = await objectsService.postUDTMetaData({
                        // InternalID: Math.floor(Math.random() * 1000000),
                        TableID: tableName,
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
                    const getCreatedUDT = await objectsService.getUDTMetaData(createdUDT.TableID as number);
                    expect(getCreatedUDT).to.not.be.undefined;
                    expect(getCreatedUDT).to.haveOwnProperty('InternalID');
                    expect(getCreatedUDT).to.haveOwnProperty('TableID');
                    expect(getCreatedUDT).to.haveOwnProperty('MainKeyType');
                    expect(getCreatedUDT).to.haveOwnProperty('SecondaryKeyType');
                    expect(getCreatedUDT?.InternalID).to.equal(createdUDT.InternalID);
                    expect(getCreatedUDT?.TableID).to.equal(createdUDT.TableID);
                });

                it('Perform Manual Sync NO Time Measurement', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Get All UDT Values', async function () {
                    const getAllUDTdocuments = await objectsService.getUDT({ page_size: -1 });
                    driver.sleep(1 * 1000);
                    console.info('All MapDataExternalID documents length: ', getAllUDTdocuments.length);
                    addContext(this, {
                        title: `All MapDataExternalID documents length`,
                        value: `${getAllUDTdocuments.length}`,
                    });
                    const allNotAddonCpidocuments = getAllUDTdocuments.filter((tableRow) => {
                        if (tableRow.MapDataExternalID !== 'ADDON_CPI_SIDE_DATA') {
                            return tableRow;
                        }
                    });
                    console.info(
                        'All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length: ',
                        allNotAddonCpidocuments.length,
                    );
                    addContext(this, {
                        title: `All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length`,
                        value: `${allNotAddonCpidocuments.length}`,
                    });
                    noUdtData = allNotAddonCpidocuments.length > 0 ? false : true;
                    console.info('noUdtData value: ', noUdtData);
                });

                it('Truncate UDT before inserting new values', async function () {
                    if (noUdtData == false) {
                        let index = 1;
                        udtsTableRows = await objectsService.getUDT({ page_size: -1 });
                        console.info('All udtsTableRows length: ', udtsTableRows.length);
                        addContext(this, {
                            title: `All udtsTableRows length`,
                            value: `${udtsTableRows.length}`,
                        });
                        udtsTableRowsTestTable = udtsTableRows.filter((tableRow) => {
                            if (tableRow.MapDataExternalID == tableName) {
                                return tableRow;
                            }
                        });
                        console.info('udtsTableRowsTestTable length: ', udtsTableRowsTestTable.length);
                        addContext(this, {
                            title: `All MapDataExternalID='SyncPerformanceUDT_Test' documents length`,
                            value: `${udtsTableRowsTestTable.length}`,
                        });

                        do {
                            udtsTableRowsTestTable = await objectsService.getUDT({
                                where: "MapDataExternalID='SyncPerformanceUDT_Test'",
                                page_size: 1000,
                                page: index,
                            });
                            // console.info('index: ', index, ' udtsTableRows length: ', udtsTableRows.length);
                            // udtsTableRowsTestTable = udtsTableRows.filter((tableRow) => {
                            //     if (tableRow.MapDataExternalID == tableName) {
                            //         return tableRow;
                            //     }
                            // });
                            console.info(
                                'Index: ',
                                index,
                                ' , udtsTableRowsTestTable length: ',
                                udtsTableRowsTestTable.length,
                            );
                            udtsTableRowsTestTable.forEach((testTableRow) => {
                                testTableRow.Hidden = true;
                            });
                            console.info(
                                'First item of udtsTableRowsTestTable: ',
                                JSON.stringify(udtsTableRowsTestTable[0], null, 2),
                            );
                            addContext(this, {
                                title: `First item of udtsTableRowsTestTable`,
                                value: JSON.stringify(udtsTableRowsTestTable[0], null, 2),
                            });

                            udtsRowsDeleteResponses = await objectsService.postBatchUDT(udtsTableRowsTestTable);
                            udtsRowsDeleteResponses.forEach((rowDeleteResponse) => {
                                Object.keys(rowDeleteResponse).forEach((rowDeleteResponseKey) => {
                                    expect(rowDeleteResponseKey).to.be.oneOf([
                                        'InternalID',
                                        'ExternalID',
                                        'UUID',
                                        'Status',
                                        'URI',
                                        'Message',
                                    ]);
                                });
                                expect(rowDeleteResponse.Status).to.equal('Update');
                                expect(rowDeleteResponse.Message).to.equal('Row updated.');
                            });
                            index++;
                        } while (udtsTableRowsTestTable.length > 0 && index < 102);

                        const getCreatedUDTdocuments = await objectsService.getUDT({
                            where: "MapDataExternalID='SyncPerformanceUDT_Test'",
                            page_size: -1,
                        });
                        addContext(this, {
                            title: `index`,
                            value: `${index}`,
                        });
                        addContext(this, {
                            title: `All MapDataExternalID='SyncPerformanceUDT_Test' documents length`,
                            value: `${getCreatedUDTdocuments.length}`,
                        });
                    }
                });

                it('Perform Manual Sync NO Time Measurement', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Logout Login', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                });

                it('Perform Manual Resync NO Time Measurement', async function () {
                    await e2eUtils.performManualResync.bind(this)(client, driver);
                });

                it('Validate UDT Values were Truncated', async function () {
                    const getAllUDTdocuments = await objectsService.getUDT({ page_size: -1 });
                    driver.sleep(1 * 1000);
                    console.info('All MapDataExternalID documents length: ', getAllUDTdocuments.length);
                    addContext(this, {
                        title: `All MapDataExternalID documents length`,
                        value: `${getAllUDTdocuments.length}`,
                    });
                    const allNotAddonCpidocuments = getAllUDTdocuments.filter((tableRow) => {
                        if (tableRow.MapDataExternalID !== 'ADDON_CPI_SIDE_DATA') {
                            return tableRow;
                        }
                    });
                    console.info(
                        'All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length: ',
                        allNotAddonCpidocuments.length,
                    );
                    addContext(this, {
                        title: `All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length`,
                        value: `${allNotAddonCpidocuments.length}`,
                    });
                    expect(allNotAddonCpidocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Bulk create UDT with 10K Rows', async function () {
                    const lines: string[][] = [];
                    const udtRows_10k: UserDefinedTableRow[] = [];
                    for (let index = 1; index < 10001; index++) {
                        lines.push([createdUDT.TableID, `Test ${index}`, '', `Value ${index}`]);
                        udtRows_10k.push({
                            Hidden: false,
                            MainKey: `Test ${index}`,
                            MapDataExternalID: createdUDT.TableID,
                            SecondaryKey: '',
                            Values: [`Value ${index}`],
                        });
                    }
                    addContext(this, {
                        title: `Lines Length`,
                        value: `${lines.length}`,
                    });
                    addContext(this, {
                        title: `First Item of Lines`,
                        value: JSON.stringify(lines[0], null, 2),
                    });
                    addContext(this, {
                        title: `udtRows_10k Length`,
                        value: `${udtRows_10k.length}`,
                    });
                    addContext(this, {
                        title: `First Item of udtRows_10k`,
                        value: JSON.stringify(udtRows_10k[0], null, 2),
                    });

                    // bulkUpdateUDT = await objectsService.bulkCreate('user_defined_tables', {
                    //     Headers: ['MapDataExternalID', 'MainKey', 'SecondaryKey', 'Values'],
                    //     Lines: lines,
                    // });
                    // expect(bulkUpdateUDT.JobID).to.be.a('number');
                    // expect(bulkUpdateUDT.URI).to.include('/bulk/jobinfo/' + bulkUpdateUDT.JobID);
                    // batchUDT
                    bulkUpdateUDT = await objectsService.postBatchUDT(udtRows_10k);
                    expect(bulkUpdateUDT).to.be.an('array').with.lengthOf(10000);
                    bulkUpdateUDT.map((row) => {
                        expect(row).to.have.property('InternalID').that.is.above(0);
                        expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                        // expect(row).to.have.property('Status').that.equals('Insert');
                        // expect(row).to.have.property('Message').that.equals('Row inserted.');
                        expect(row)
                            .to.have.property('URI')
                            .that.equals('/user_defined_tables/' + row.InternalID);
                    });
                });

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

                it('Validate Number of Rows of UDT is 10K', async function () {
                    const testUDTsize = await objectsService.countUDTRows({
                        where: `MapDataExternalID='${createdUDT.TableID}'`,
                    });
                    addContext(this, {
                        title: `"${createdUDT.TableID}" Size`,
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

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

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

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

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

                it('Validate Number of Rows of UDT is 100K - Again', async function () {
                    const testUDTsize = await objectsService.countUDTRows({
                        where: `MapDataExternalID='${createdUDT.TableID}'`,
                    });
                    addContext(this, {
                        title: `${createdUDT.TableID} Size`,
                        value: `${testUDTsize}`,
                    });
                    expect(testUDTsize).to.be.a('number').and.equal(100000);
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

                it('Delete Test UDT Table-Rows via API', async function () {
                    let index = 1;
                    udtsTableRowsTestTable = await objectsService.getUDT({
                        where: "MapDataExternalID='SyncPerformanceUDT_Test'",
                        page_size: -1,
                    });
                    addContext(this, {
                        title: `udtsTableRowsTestTable length`,
                        value: `udtsTableRowsTestTable length: ${udtsTableRowsTestTable.length}`,
                    });

                    do {
                        // udtsTableRows = await objectsService.getUDT({
                        //     where: "MapDataExternalID='SyncPerformanceUDT_Test'",
                        //     page_size: 250,
                        //     page: index,
                        // });
                        // console.info('index: ', index, ' udtsTableRows length: ', udtsTableRows.length);
                        udtsTableRowsTestTable = await objectsService.getUDT({
                            where: "MapDataExternalID='SyncPerformanceUDT_Test'",
                            page_size: 1000,
                            page: index,
                        });
                        // addContext(this, {
                        //     title: `udtsTableRows length`,
                        //     value: `index: ${index} , udtsTableRows length: ${udtsTableRows.length}`,
                        // });
                        // udtsTableRowsTestTable = udtsTableRows.filter((tableRow) => {
                        //     if (tableRow.MapDataExternalID == tableName) {
                        //         return tableRow;
                        //     }
                        // });
                        console.info(
                            'Index: ',
                            index,
                            ' udtsTableRowsTestTable length: ',
                            udtsTableRowsTestTable.length,
                        );

                        udtsTableRowsTestTable.forEach((testTableRow) => {
                            testTableRow.Hidden = true;
                        });
                        console.info(
                            'First item of udtsTableRowsTestTable: ',
                            JSON.stringify(udtsTableRowsTestTable[0], null, 2),
                        );
                        addContext(this, {
                            title: `First item of udtsTableRowsTestTable`,
                            value: JSON.stringify(udtsTableRowsTestTable[0], null, 2),
                        });

                        udtsRowsDeleteResponses = await objectsService.postBatchUDT(udtsTableRowsTestTable);
                        udtsRowsDeleteResponses.forEach((rowDeleteResponse) => {
                            Object.keys(rowDeleteResponse).forEach((rowDeleteResponseKey) => {
                                expect(rowDeleteResponseKey).to.be.oneOf([
                                    'InternalID',
                                    'ExternalID',
                                    'UUID',
                                    'Status',
                                    'URI',
                                    'Message',
                                ]);
                            });
                            expect(rowDeleteResponse.Status).to.be.oneOf(['Insert', 'Ignore', 'Update']);
                            expect(rowDeleteResponse.Message).to.be.oneOf([
                                'Row inserted.',
                                'No changes in this row. The row is being ignored.',
                                'Row updated.',
                            ]);
                        });
                        index++;
                    } while (udtsTableRowsTestTable.length > 0 && index < 102);

                    addContext(this, {
                        title: `index`,
                        value: `${index}`,
                    });
                });

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

                it('Logout Login', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                });

                it('Perform Manual Resync NO Time Measurement', async function () {
                    await e2eUtils.performManualResync.bind(this)(client, driver);
                });

                it('Validate UDT Values were Deleted', async function () {
                    const getAllUDTdocuments = await objectsService.getUDT({ page_size: -1 });
                    driver.sleep(1 * 1000);
                    console.info('All MapDataExternalID documents length: ', getAllUDTdocuments.length);
                    addContext(this, {
                        title: `All MapDataExternalID documents length`,
                        value: `${getAllUDTdocuments.length}`,
                    });
                    const allNotAddonCpidocuments = getAllUDTdocuments.filter((tableRow) => {
                        if (tableRow.MapDataExternalID !== 'ADDON_CPI_SIDE_DATA') {
                            return tableRow;
                        }
                    });
                    console.info(
                        'All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length: ',
                        allNotAddonCpidocuments.length,
                    );
                    addContext(this, {
                        title: `All MapDataExternalID != "ADDON_CPI_SIDE_DATA" documents length`,
                        value: `${allNotAddonCpidocuments.length}`,
                    });
                    expect(allNotAddonCpidocuments).to.be.an('array').with.lengthOf(0);
                });

                it('Delete Test UDT Table via API', async function () {
                    createdUDT.Hidden = true;
                    udtsDeleteResponse = await objectsService.postUDTMetaData(createdUDT);
                    expect(udtsDeleteResponse.Hidden).to.be.true;
                });

                it('Perform Manual Sync NO Time Measurement', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Validate UDTs deletion was successful', async function () {
                    udtsTableRows = await objectsService.getUDT({ page_size: -1 });
                    udtsTableRowsNoAddonCpi = udtsTableRows.filter((tableRow) => {
                        if (tableRow.MapDataExternalID != 'ADDON_CPI_SIDE_DATA') {
                            return tableRow;
                        }
                    });
                    expect(udtsTableRowsNoAddonCpi).to.be.an('array').with.lengthOf(0);
                    allUDTs = await objectsService.getUDTMetaDataList();
                    addContext(this, {
                        title: `All UDTs`,
                        value: JSON.stringify(allUDTs, null, 2),
                    });
                    console.info(JSON.stringify(allUDTs, null, 2));
                    const testUDTs = allUDTs.filter((table) => {
                        if (table['TableID'].startsWith(tableName)) return table;
                    });
                    console.info(JSON.stringify(testUDTs, null, 2));
                    addContext(this, {
                        title: `Test UDTs`,
                        value: JSON.stringify(testUDTs, null, 2),
                    });
                    expect(testUDTs).to.be.an('array').with.lengthOf(0);
                });
            });

            describe('UDC', async () => {
                it('Logout Login', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                });

                it('Create UDC', async function () {
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
                        nameOfCollection: collectionName,
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
                    expect(upsertResponse.Name).to.equal(collectionName);
                    expect(upsertResponse.Fields).to.be.an('object');
                    if (upsertResponse.Fields) expect(Object.keys(upsertResponse.Fields)).to.eql(['str', 'int']);

                    addContext(this, {
                        title: `Collection data for "${collectionName}" (CollectionFields): `,
                        value: fields,
                    });
                    addContext(this, {
                        title: `Upsert Response: `,
                        value: JSON.stringify(upsertResponse, null, 2),
                    });
                });

                it('Insert 10K Rows to UDC', async function () {
                    howManyRows = 10000;
                    const headers = 'str,int';
                    const runningDataStr = `index_${random200charString}`;
                    const runningDataInt = 'index';
                    // Create a file to import
                    const randomString = Math.floor(Math.random() * 1000000).toString();
                    const fileName = 'SyncPerformanceTest' + randomString + '.csv';
                    addContext(this, {
                        title: `File Name`,
                        value: fileName,
                    });
                    console.log('File Name: ', fileName);
                    const mime = 'text/csv';
                    const tempFileResponse = await pfsService.postTempFile({
                        FileName: fileName,
                        MIME: mime,
                    });
                    addContext(this, {
                        title: `Temp File Response`,
                        value: JSON.stringify(tempFileResponse, null, 2),
                    });
                    console.log('Temp File Response: ', JSON.stringify(tempFileResponse, null, 2));
                    expect(tempFileResponse).to.have.property('PutURL').that.is.a('string').and.is.not.empty;
                    expect(tempFileResponse).to.have.property('TemporaryFileURL').that.is.a('string').and.is.not.empty;
                    expect(tempFileResponse.TemporaryFileURL).to.include('pfs.');
                    const localPath = __dirname;
                    addContext(this, {
                        title: `localPath`,
                        value: localPath,
                    });
                    console.log('localPath: ', localPath);
                    const csvFileName = await udcService.createInitalDataToPFS(
                        howManyRows,
                        headers,
                        [runningDataStr, runningDataInt],
                        localPath,
                    );
                    addContext(this, {
                        title: `csv File Name`,
                        value: csvFileName,
                    });
                    console.log('csv File Name: ', csvFileName);
                    console.log('localPath after "\\tests" removed: ', localPath.replace(`\\tests`, ``));
                    // const combinedPath = path.join(localPath.replace(`\\tests`,``), csvFileName);
                    const combinedPath = path.join(localPath, csvFileName);
                    addContext(this, {
                        title: `combinedPath`,
                        value: combinedPath,
                    });
                    console.log('combinedPath: ', combinedPath);
                    const buf = fs.readFileSync(combinedPath);
                    // addContext(this, {
                    //     title: `buf`,
                    //     value: JSON.stringify(buf),
                    // });
                    console.log('buf: ', JSON.stringify(buf));
                    addContext(this, {
                        title: `tempFileResponse.PutURL`,
                        value: tempFileResponse.PutURL,
                    });
                    console.log('tempFileResponse.PutURL: ', tempFileResponse.PutURL);
                    const putResponsePart1 = await pfsService.putPresignedURL(tempFileResponse.PutURL, buf);
                    expect(putResponsePart1.ok).to.equal(true);
                    expect(putResponsePart1.status).to.equal(200);
                    // Import file to UDC
                    const bodyToImport = {
                        URI: tempFileResponse.TemporaryFileURL,
                    };
                    const importResponse = await generalService.fetchStatus(
                        `/addons/data/import/file/${UserDefinedCollectionsUUID}/${collectionName}`,
                        { method: 'POST', body: JSON.stringify(bodyToImport) },
                    );
                    const executionURI = importResponse.Body.URI;
                    const auditLogDevTestResponse = await generalService.getAuditLogResultObjectIfValid(
                        executionURI as string,
                        250,
                        7000,
                    );
                    addContext(this, {
                        title: `Audit Log Dev Test Response`,
                        value: JSON.stringify(auditLogDevTestResponse, null, 2),
                    });
                    console.log('Audit Log Dev Test Response: ', JSON.stringify(auditLogDevTestResponse, null, 2));
                    if (auditLogDevTestResponse.Status) {
                        expect(auditLogDevTestResponse.Status.Name).to.equal('Success');
                    } else {
                        expect(auditLogDevTestResponse.Status).to.not.be.undefined;
                    }
                    const lineStats = JSON.parse(auditLogDevTestResponse.AuditInfo.ResultObject).LinesStatistics;
                    expect(lineStats.Inserted).to.equal(howManyRows);
                });

                it(`Get UDC Lines - validating each line's value`, async function () {
                    generalService.sleep(1000 * 60 * 2.5); //let PNS Update for 2.5 minutes
                    for (let index = 1; index <= 100; index++) {
                        console.log(`searching for 250 rows for the ${index} time - out of 100 sampling batch`);
                        const allObjectsFromCollection = await udcService.getAllObjectFromCollectionCount(
                            collectionName,
                            index,
                            250,
                        );
                        // expect(allObjectsFromCollection.count).to.equal(howManyRows);
                        for (let index1 = 0; index1 < allObjectsFromCollection.objects.length; index1++) {
                            const row = allObjectsFromCollection.objects[index1];
                            console.info(
                                'Index: ',
                                index1,
                                ' , random200charString.slice(0, 10): ',
                                random200charString,
                            );
                            // expect(row.str).to.contain(`_${random200charString.slice(0, 10)}`);
                            expect(row.int).to.be.a('number');
                        }
                    }
                });

                it('Perform Manual Sync NO Time Measurement', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Logout Login', async function () {
                    await e2eUtils.logOutLogIn(email, password, client);
                });

                it('Validate Number of Rows of UDC is 10K', async function () {
                    const getSchemesResponse = await udcService.getSchemes({
                        where: `Name=${collectionName}`,
                        page_size: -1,
                    });
                    expect(getSchemesResponse).to.be.an('array').with.lengthOf(10000);
                });

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

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

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

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

                // it('Validate Number of Rows of UDC is 10K', async function () {});

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

                // it('Perform Manual Sync NO Time Measurement', async function () {
                //     await e2eUtils.performManualSync.bind(this)(client, driver);
                // });

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

                it('Delete Test UDC via API', async function () {
                    const purgeResponse = await udcService.purgeScheme(collectionName);
                    console.info(`${collectionName} Truncate Response: ${JSON.stringify(purgeResponse, null, 2)}`);
                    addContext(this, {
                        title: `Truncate Response: `,
                        value: JSON.stringify(purgeResponse, null, 2),
                    });
                    expect(purgeResponse.Ok).to.be.true;
                    expect(purgeResponse.Status).to.equal(200);
                    expect(purgeResponse.Error).to.eql({});
                    expect(Object.keys(purgeResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                    expect(purgeResponse.Body.Done).to.be.true;
                });

                it('Perform Manual Sync NO Time Measurement', async function () {
                    await e2eUtils.performManualSync.bind(this)(client, driver);
                });

                it('Validate UDCs deletedtion was successful', async function () {
                    allUDCs = await udcService.getSchemes();
                    expect(allUDCs).to.be.an('array').with.lengthOf(0);
                });
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
}
