import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';
import { UDCService } from '../../../services/user-defined-collections.service';

chai.use(promised);

export async function PricingUdcCleanup(
    client: Client,
    // specificVersion: 'version07for05data' | 'version08for07data' | undefined = undefined,
) {
    const generalService = new GeneralService(client);
    const udcService = new UDCService(generalService);
    const pricingRules = new PricingRules();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    const dateTime = new Date();
    const udcFirstTableName = 'PricingUdtReplacement';
    // const udcSecondTableName = 'future_udc_table_name';
    let udc_ppmValues_content;
    let udc_ppmValuesEnd;
    // let secondUDC_content;

    describe(`UDC Values Deletion - Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | ${dateTime}`, () => {
        describe(`UDC: "${udcFirstTableName}" cleanup`, () => {
            it('getting data object according to installed version', async function () {
                switch (installedPricingVersionShort) {
                    case '8':
                        console.info('AT installedPricingVersion CASE 8');
                        udc_ppmValues_content = pricingRules[`UDC_${udcFirstTableName}`].version08;
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        udc_ppmValues_content = pricingRules[`UDC_${udcFirstTableName}`].version08;
                        break;
                }
                addContext(this, {
                    title: `ppmValues_content.length`,
                    value: udc_ppmValues_content.length,
                });
            });

            // it(`retrieving "${udcFirstTableName}" UDC values via API`, async function () {
            //     udc_ppmValuesEnd = await objectsService.getUDT({
            //         where: `MapDataExternalID='${udcFirstTableName}'`,
            //         page_size: -1,
            //     });
            //     addContext(this, {
            //         title: `udc_ppmValuesEnd.length`,
            //         value: udc_ppmValuesEnd.length,
            //     });
            // });

            it(`deleting valid rules from the UDC "${udcFirstTableName}"`, async function () {
                const response = await udcService.truncateScheme(udcFirstTableName);
                console.info(`truncate "${udcFirstTableName}" response: ${JSON.stringify(response, null, 2)}`);
                expect(response.Ok).to.be.true;
                expect(response.Status).to.equal(200);
                expect(response.Error).to.eql({});
            });

            it(`validating "${udcFirstTableName}" UDC length after deletion via API`, async () => {
                udc_ppmValuesEnd = await udcService.getDocuments(udcFirstTableName);
                expect(udc_ppmValuesEnd.length).equals(0);
            });
        });

        // describe(`UDC: "${udcSecondTableName}" cleanup`, () => {
        //     it('getting data object according to installed version', async function () {
        //         switch (installedPricingVersionShort) {
        //             case '8':
        //                 console.info('AT installedPricingVersion CASE 8');
        //                 udc_ppmValues_content = pricingRules[`UDC_${udcSecondTableName}`].version08;
        //                 break;

        //             default:
        //                 console.info('AT installedPricingVersion Default');
        //                 udc_ppmValues_content = pricingRules[`UDC_${udcSecondTableName}`].version08;
        //                 break;
        //         }
        //         addContext(this, {
        //             title: `secondUDC_content.length`,
        //             value: secondUDC_content.length,
        //         });
        //     });

        //     // it(`retrieving "${udtSecondTableName}" UDT values via API`, async function () {
        //     //     ppmAccountValuesEnd = await objectsService.getUDT({
        //     //         where: `MapDataExternalID='${udtSecondTableName}'`,
        //     //         page_size: -1,
        //     //     });
        //     //     addContext(this, {
        //     //         title: `ppmAccountValuesEnd.length`,
        //     //         value: ppmAccountValuesEnd.length,
        //     //     });
        //     // });

        //     // it(`deleting valid rules from the UDT "${udtSecondTableName}"`, async function () {
        //     //     const valueObjs: UserDefinedTableRow[] = [];
        //     //     const validPPM_AccountValuesKeys = Object.keys(secondUDC_content);
        //     //     const deleteResponses = await Promise.all(
        //     //         validPPM_AccountValuesKeys.map(async (validPPM_Key) => {
        //     //             const valueObj: UserDefinedTableRow | undefined = ppmAccountValuesEnd.find((listing) => {
        //     //                 if (listing.MainKey === validPPM_Key) return listing;
        //     //             });
        //     //             console.info(
        //     //                 'validPPM_Key:',
        //     //                 validPPM_Key,
        //     //                 ', validPPM_ValueObj: ',
        //     //                 JSON.stringify(valueObj, null, 2),
        //     //             );
        //     //             if (valueObj) {
        //     //                 console.info(`valueObj for key "${validPPM_Key}" EXIST!`);
        //     //                 valueObj.Hidden = true;
        //     //                 valueObjs.push(valueObj);
        //     //                 const deleteResponse = await objectsService.postUDT(valueObj);
        //     //                 addContext(this, {
        //     //                     title: `key "${validPPM_Key}" EXIST in UDT`,
        //     //                     value: deleteResponse,
        //     //                 });
        //     //                 return deleteResponse;
        //     //             }
        //     //         }),
        //     //     );
        //     //     valueObjs.length && expect(valueObjs.length).equals(validPPM_AccountValuesKeys.length);
        //     //     deleteResponses.forEach((deleteUDTresponse) => {
        //     //         console.info(
        //     //             `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
        //     //             JSON.stringify(deleteUDTresponse, null, 2),
        //     //         );
        //     //         if (deleteUDTresponse) {
        //     //             console.info('UDT delete response exist!');
        //     //             const PPMvalue = secondUDC_content[deleteUDTresponse.MainKey];
        //     //             expect(deleteUDTresponse).to.deep.include({
        //     //                 MapDataExternalID: udtSecondTableName,
        //     //                 SecondaryKey: null,
        //     //                 Values: [PPMvalue],
        //     //             });
        //     //             expect(deleteUDTresponse).to.have.property('MainKey');
        //     //             expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
        //     //             expect(deleteUDTresponse)
        //     //                 .to.have.property('ModificationDateTime')
        //     //                 .that.contains(new Date().toISOString().split('T')[0]);
        //     //             expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
        //     //             expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
        //     //             expect(deleteUDTresponse).to.have.property('InternalID');
        //     //         }
        //     //     });
        //     // });

        //     // it(`validating "${udtSecondTableName}" UDT length after deletion via API`, async () => {
        //     //     ppmAccountValuesEnd = await objectsService.getUDT({
        //     //         where: `MapDataExternalID='${udtSecondTableName}'`,
        //     //         page_size: -1,
        //     //     });
        //     //     expect(ppmAccountValuesEnd.length).equals(pricingRules.dummyPPM_AccountValues_length);
        //     // });
        // });
    });
}
