import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../../services';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { PricingData05 } from '../../pom/addons/Pricing05';
import { PricingData06 } from '../../pom/addons/Pricing06';
import { PricingData07 } from '../../pom/addons/Pricing07';

chai.use(promised);

export async function PricingUdtCleanup(client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let ppmVluesEnd: UserDefinedTableRow[];
    let installedPricingVersion;
    let pricingData;

    describe('UDT: "PPM_Values" cleanup', () => {
        it('getting data object according to installed version', async () => {
            switch (installedPricingVersion) {
                case '5':
                    console.info('AT installedPricingVersion CASE 5');
                    pricingData = new PricingData05();
                    break;
                case '6':
                    console.info('AT installedPricingVersion CASE 6');
                    pricingData = new PricingData06();
                    break;
                case '7':
                    console.info('AT installedPricingVersion CASE 7');
                    pricingData = new PricingData07();
                    break;

                default:
                    console.info('AT installedPricingVersion Default');
                    pricingData = new PricingData07();
                    break;
            }
        });

        it('retrieving "PPM_Values" UDT values via API', async () => {
            ppmVluesEnd = await objectsService.getUDT({
                where: `MapDataExternalID='${pricingData.tableName}'`,
                page_size: -1,
            });
        });

        it('deleting valid rules from the UDT "PPM_Values"', async () => {
            const valueObjs: UserDefinedTableRow[] = [];
            const validPPM_ValuesKeys = Object.keys(pricingData.documentsIn_PPM_Values);
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
            expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
            deleteResponses.forEach((deleteUDTresponse) => {
                console.info(
                    `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                    JSON.stringify(deleteUDTresponse, null, 2),
                );
                if (deleteUDTresponse) {
                    console.info('UDT delete response exist!');
                    const PPMvalue = pricingData.documentsIn_PPM_Values[deleteUDTresponse.MainKey];
                    expect(deleteUDTresponse).to.deep.include({
                        MapDataExternalID: pricingData.tableName,
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
                where: `MapDataExternalID='${pricingData.tableName}'`,
                page_size: -1,
            });
            expect(ppmVluesEnd.length).equals(pricingData.dummyPPM_Values_length);
        });
    });
}
