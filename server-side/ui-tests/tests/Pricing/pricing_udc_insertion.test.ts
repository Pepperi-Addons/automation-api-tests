import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';
import { UDCService } from '../../../services/user-defined-collections.service';

chai.use(promised);

export async function PricingUdcInsertion(
    client: Client,
    // specificVersion: 'version07for05data' | 'version08for07data' | undefined = undefined,
) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const pricingRules = new PricingRules();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    const udcFirstTableName = 'PricingUdtReplacement';
    // const udcSecondTableName = 'future_udc_table_name';
    const dataToInsertToUdc: { PricingKey: string; PricingData: any }[] = [];
    let udc_ppmValuesEnd;
    let batchUDTresponse: any;
    let udc_ppmValues_content;
    // let secondUDC_content;

    describe('UDC Upsert - Test Suite', () => {
        describe(`UDC: "${udcFirstTableName}" insertion`, () => {
            it('getting data object according to installed version', async function () {
                switch (installedPricingVersionShort) {
                    case '8':
                        console.info('AT installedPricingVersion CASE 8');
                        udc_ppmValues_content = pricingRules[`UDC_${udcFirstTableName}`].features08;
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        udc_ppmValues_content = pricingRules[`UDC_${udcFirstTableName}`].features08;
                        break;
                }
                addContext(this, {
                    title: `udc_ppmValues_content length`,
                    value: Object.keys(udc_ppmValues_content).length,
                });
                addContext(this, {
                    title: `udc_ppmValues_content`,
                    value: JSON.stringify(udc_ppmValues_content, null, 2),
                });
            });

            it(`inserting valid rules to the UDC "${udcFirstTableName}"`, async function () {
                Object.keys(udc_ppmValues_content).forEach((ppmValueKey) => {
                    dataToInsertToUdc.push({
                        PricingKey: ppmValueKey,
                        PricingData: udc_ppmValues_content[ppmValueKey],
                    });
                });

                const upsertingValues_Responses = await Promise.all(
                    dataToInsertToUdc.map(async (listing) => {
                        return await udcService.postDocument(udcFirstTableName, listing);
                    }),
                );
                upsertingValues_Responses.forEach((upsertingValues_Response) => {
                    console.info(`upsertingValues_Response: ${JSON.stringify(upsertingValues_Response, null, 2)}`);
                    expect(upsertingValues_Response.Ok).to.be.true;
                    expect(upsertingValues_Response.Status).to.equal(200);
                    expect(upsertingValues_Response.Error).to.eql({});
                });
                addContext(this, {
                    title: `batchUDTresponse length`,
                    value: batchUDTresponse.length,
                });
                addContext(this, {
                    title: `batchUDTresponse`,
                    value: JSON.stringify(batchUDTresponse, null, 2),
                });
            });

            it(`validating "${udcFirstTableName}" UDC length after insertion via API`, async () => {
                udc_ppmValuesEnd = await udcService.getSchemes({
                    where: `Name="${udcFirstTableName}"`,
                });
                console.info(`${udcFirstTableName} fields: `, JSON.stringify(udc_ppmValuesEnd[0].Fields, null, 2));
                expect(udc_ppmValuesEnd).to.be.an('array').with.lengthOf(1);
                expect(udc_ppmValuesEnd[0]).to.haveOwnProperty('Fields');
                expect(Object.keys(udc_ppmValuesEnd[0].Fields)).to.eql(['PricingKey', 'PricingData']);
                expect(udc_ppmValuesEnd.length).equals(dataToInsertToUdc.length);
            });
        });

        // describe(`UDC: "${udcSecondTableName}" insertion`, () => {
        //     it('getting data object according to installed version', async function () {
        //         switch (installedPricingVersionShort) {
        //             case '8':
        //                 console.info('AT installedPricingVersion CASE 8');
        //                 secondUDC_content =
        //                     specificVersion === 'version08for07data'
        //                         ? pricingRules[udcSecondTableName].version07
        //                         : pricingRules[udcSecondTableName].version08;
        //                 break;

        //             default:
        //                 console.info('AT installedPricingVersion Default');
        //                 secondUDC_content = pricingRules[udcSecondTableName].version07;
        //                 break;
        //         }
        //         addContext(this, {
        //             title: `secondUDC_content length`,
        //             value: Object.keys(secondUDC_content).length,
        //         });
        //         addContext(this, {
        //             title: `secondUDC_content`,
        //             value: JSON.stringify(secondUDC_content, null, 2),
        //         });
        //     });
        // });
    });
}
