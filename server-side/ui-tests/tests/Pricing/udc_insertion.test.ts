import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';
import { UDCService } from '../../../services/user-defined-collections.service';

chai.use(promised);

type tableNames = 'PricingUdtReplacement' | 'PricingTest1' | 'PricingTest2';

export async function PricingUdcInsertion(client: Client, testingFeatures: '0.8' | '1.0', tablesNames: tableNames[]) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const pricingRules = new PricingRules();
    const udcTables = ['PricingUdtReplacement', 'PricingTest1', 'PricingTest2'];
    let dataToInsertToUdc: { PricingKey: string; PricingData: any }[] = [];
    // let bodyOfUdc;
    // let upsert_response;
    let udcTable_fromAPI;
    let udcTable_valuesEnd;
    // let batchUDTresponse: any;
    let udc_table_rules;

    describe('UDC Upsert - Test Suite', () => {
        udcTables.forEach((udcTable) => {
            it(`validating "${udcTable}" UDC via API`, async () => {
                udcTable_fromAPI = await udcService.getSchemes({
                    where: `Name="${udcTable}"`,
                });
                console.info(`${udcTable} fields: `, JSON.stringify(udcTable_fromAPI[0].Fields, null, 2));
                expect(udcTable_fromAPI).to.be.an('array').with.lengthOf(1);
                expect(udcTable_fromAPI[0]).to.haveOwnProperty('Fields');
                expect(Object.keys(udcTable_fromAPI[0].Fields)).to.eql(['PricingKey', 'PricingData']);
                expect(udcTable_fromAPI[0]).to.haveOwnProperty('SyncData');
                expect(udcTable_fromAPI[0].SyncData).to.haveOwnProperty('Sync');
                expect(udcTable_fromAPI[0].SyncData.Sync).to.be.true;
            });
        });

        tablesNames.forEach((tableName) => {
            describe(`UDC: "${tableName}" insertion`, () => {
                // it(`validating "${tableName}" UDC structure via API`, async () => {
                //     udcTable_fromAPI = await udcService.getSchemes({
                //         where: `Name="${tableName}"`,
                //     });
                //     console.info(`${tableName} fields: `, JSON.stringify(udcTable_fromAPI[0].Fields, null, 2));
                //     expect(udcTable_fromAPI).to.be.an('array').with.lengthOf(1);
                //     expect(udcTable_fromAPI[0]).to.haveOwnProperty('Fields');
                //     expect(Object.keys(udcTable_fromAPI[0].Fields)).to.eql(['PricingKey', 'PricingData']);
                // });

                it('getting data object according to installed version', async function () {
                    udc_table_rules = {};
                    switch (testingFeatures) {
                        case '0.8':
                            console.info('AT testingFeatures CASE 0.8');
                            udc_table_rules = pricingRules[`UDC_${tableName}`].features08;
                            break;

                        default:
                            console.info('AT testingFeatures Default');
                            udc_table_rules = pricingRules[`UDC_${tableName}`].features08;
                            break;
                    }
                    addContext(this, {
                        title: `udc_${tableName} length`,
                        value: Object.keys(udc_table_rules).length,
                    });
                    addContext(this, {
                        title: `udc_${tableName}`,
                        value: JSON.stringify(udc_table_rules, null, 2),
                    });
                });

                it(`inserting valid rules to the UDC "${tableName}"`, async function () {
                    dataToInsertToUdc = [];
                    Object.keys(udc_table_rules).forEach((ppmValueKey) => {
                        dataToInsertToUdc.push({
                            PricingKey: ppmValueKey,
                            PricingData: udc_table_rules[ppmValueKey],
                        });
                    });

                    const upsertingValues_Responses = await Promise.all(
                        dataToInsertToUdc.map(async (listing) => {
                            return await udcService.postDocument(tableName, listing);
                        }),
                    );
                    upsertingValues_Responses.forEach((upsertingValues_Response) => {
                        console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                        // expect(upsertingValues_Response.Ok).to.be.true;
                        // expect(upsertingValues_Response.Status).to.equal(200);
                        // expect(upsertingValues_Response.Error).to.eql({});
                    });
                    addContext(this, {
                        title: `upsertingValues_Responses length`,
                        value: upsertingValues_Responses.length,
                    });
                    addContext(this, {
                        title: `upsertingValues_Responses`,
                        value: JSON.stringify(upsertingValues_Responses, null, 2),
                    });
                });

                it(`validating "${tableName}" UDC length after insertion via API`, async function () {
                    udcTable_valuesEnd = await udcService.getDocuments(tableName);
                    console.info(`${tableName} documents: `, JSON.stringify(udcTable_valuesEnd, null, 2));
                    addContext(this, {
                        title: `Expected Length:`,
                        value: dataToInsertToUdc.length,
                    });
                    addContext(this, {
                        title: `Actual Length:`,
                        value: udcTable_valuesEnd.length,
                    });
                    addContext(this, {
                        title: `Values from API`,
                        value: JSON.stringify(udcTable_valuesEnd, null, 2),
                    });
                    expect(udcTable_valuesEnd).to.be.an('array').with.lengthOf(dataToInsertToUdc.length);
                });
            });
        });
    });
}
