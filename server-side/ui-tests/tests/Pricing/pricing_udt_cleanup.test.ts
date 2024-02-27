import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { ObjectsService } from '../../../services';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';

chai.use(promised);

export async function PricingUdtCleanup(client: Client, specificVersion: 'version07for05data' | undefined = undefined) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingRules = new PricingRules();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    const dateTime = new Date();
    let ppmVluesEnd: UserDefinedTableRow[];
    let ppmValues_content;

    describe(`UDT: "PPM_Values" cleanup - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | ${dateTime}`, () => {
        it('getting data object according to installed version', async () => {
            switch (installedPricingVersionShort) {
                case '5':
                    console.info('AT installedPricingVersion CASE 5');
                    ppmValues_content = pricingRules.version05;
                    break;

                case '7':
                    console.info('AT installedPricingVersion CASE 7');
                    ppmValues_content =
                        specificVersion === 'version07for05data' ? pricingRules.version05 : pricingRules.version06;
                    break;

                default:
                    console.info('AT installedPricingVersion Default');
                    ppmValues_content = pricingRules.version06;
                    break;
            }
        });

        it('retrieving "PPM_Values" UDT values via API', async () => {
            ppmVluesEnd = await objectsService.getUDT({
                where: `MapDataExternalID='${pricingRules.tableName}'`,
                page_size: -1,
            });
        });

        it('deleting valid rules from the UDT "PPM_Values"', async () => {
            const valueObjs: UserDefinedTableRow[] = [];
            const validPPM_ValuesKeys = Object.keys(ppmValues_content);
            const deleteResponses = await Promise.all(
                validPPM_ValuesKeys.map(async (validPPM_Key) => {
                    const valueObj: UserDefinedTableRow | undefined = ppmVluesEnd.find((listing) => {
                        if (listing.MainKey === validPPM_Key) return listing;
                    });
                    console.info(
                        'validPPM_Key:',
                        validPPM_Key,
                        ', validPPM_ValueObj: ',
                        JSON.stringify(valueObj, null, 2),
                    );
                    if (valueObj) {
                        console.info(`valueObj for key "${validPPM_Key}" EXIST!`);
                        valueObjs.push(valueObj);
                        valueObj.Hidden = true;
                        return await objectsService.postUDT(valueObj);
                    }
                }),
            );
            valueObjs.length && expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
            deleteResponses.forEach((deleteUDTresponse) => {
                console.info(
                    `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                    JSON.stringify(deleteUDTresponse, null, 2),
                );
                if (deleteUDTresponse) {
                    console.info('UDT delete response exist!');
                    const PPMvalue = ppmValues_content[deleteUDTresponse.MainKey];
                    expect(deleteUDTresponse).to.deep.include({
                        MapDataExternalID: pricingRules.tableName,
                        SecondaryKey: null,
                        Values: [PPMvalue],
                    });
                    expect(deleteUDTresponse).to.have.property('MainKey');
                    expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
                    expect(deleteUDTresponse)
                        .to.have.property('ModificationDateTime')
                        .that.contains(new Date().toISOString().split('T')[0]);
                    expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
                    expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
                    expect(deleteUDTresponse).to.have.property('InternalID');
                }
            });
        });

        it('validating "PPM_Values" UDT length after deletion via API', async () => {
            ppmVluesEnd = await objectsService.getUDT({
                where: `MapDataExternalID='${pricingRules.tableName}'`,
                page_size: -1,
            });
            expect(ppmVluesEnd.length).equals(pricingRules.dummyPPM_Values_length);
        });
    });
}
