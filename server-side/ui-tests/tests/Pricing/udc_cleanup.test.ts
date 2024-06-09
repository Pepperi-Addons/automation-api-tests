import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import addContext from 'mochawesome/addContext';
import { UDCService } from '../../../services/user-defined-collections.service';

chai.use(promised);

type tableNames = 'PricingUdtReplacement' | 'PricingTest1' | 'PricingTest2';

export async function PricingUdcCleanup(client: Client, tablesNames?: tableNames[]) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const dateTime = new Date();
    const udcTables = ['PricingUdtReplacement', 'PricingTest1', 'PricingTest2'];
    let bodyOfUdc;
    let upsert_response;
    let udcTable_valuesEnd;

    describe(`UDC Values Deletion - Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | ${dateTime}`, () => {
        udcTables.forEach((udcTable) => {
            it(`upserting "${udcTable}" UDC via API`, async () => {
                bodyOfUdc = await udcService.prepareDataForUdcCreation({
                    nameOfCollection: udcTable,
                    fieldsOfCollection: [],
                    descriptionOfCollection: 'created with automation',
                    syncDefinitionOfCollection: { Sync: true }, // Pricing works through CPI thus the collection must be Online & Offline
                    inherits: 'pricing_table',
                });
                upsert_response = await udcService.postScheme(bodyOfUdc);
                console.info(`${udcTable} response: `, JSON.stringify(upsert_response, null, 2));
                expect(upsert_response).to.be.an('object');
                expect(upsert_response).to.haveOwnProperty('Fields');
                expect(Object.keys(upsert_response.Fields)).to.eql(['PricingKey', 'PricingData']);
            });
        });

        tablesNames &&
            tablesNames.forEach((tableName) => {
                describe(`UDC: "${tableName}" cleanup`, () => {
                    it(`Truncate "${tableName}" Collection`, async function () {
                        const truncateResponse = await udcService.truncateScheme(tableName);
                        console.info(`${tableName} truncateResponse: ${JSON.stringify(truncateResponse, null, 2)}`);
                        addContext(this, {
                            title: `Truncate Response: `,
                            value: JSON.stringify(truncateResponse, null, 2),
                        });
                        expect(truncateResponse.Ok).to.be.true;
                        expect(truncateResponse.Status).to.equal(200);
                        expect(truncateResponse.Error).to.eql({});
                        expect(Object.keys(truncateResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                        expect(truncateResponse.Body.Done).to.be.true;
                    });

                    it(`Validating "${tableName}" UDC length after deletion is 0 via API`, async () => {
                        udcTable_valuesEnd = await udcService.getDocuments(tableName);
                        expect(udcTable_valuesEnd.length).equals(0);
                    });
                });
            });

        !tablesNames &&
            udcTables.forEach((tableName) => {
                describe(`UDC: "${tableName}" cleanup`, () => {
                    it(`Truncate "${tableName}" Collection`, async function () {
                        const truncateResponse = await udcService.truncateScheme(tableName);
                        console.info(`${tableName} truncateResponse: ${JSON.stringify(truncateResponse, null, 2)}`);
                        addContext(this, {
                            title: `Truncate Response: `,
                            value: JSON.stringify(truncateResponse, null, 2),
                        });
                        expect(truncateResponse.Ok).to.be.true;
                        expect(truncateResponse.Status).to.equal(200);
                        expect(truncateResponse.Error).to.eql({});
                        expect(Object.keys(truncateResponse.Body)).to.eql(['Done', 'ProcessedCounter']);
                        expect(truncateResponse.Body.Done).to.be.true;
                    });

                    it(`Validating "${tableName}" UDC length after deletion is 0 via API`, async () => {
                        udcTable_valuesEnd = await udcService.getDocuments(tableName);
                        expect(udcTable_valuesEnd.length).equals(0);
                    });
                });
            });
    });
}
