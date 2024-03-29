import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { ObjectsService } from '../../../services';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function PricingUdtInsertion(
    client: Client,
    specificVersion: 'version07for05data' | undefined = undefined,
) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingRules = new PricingRules();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    let batchUDTresponse: any;
    let ppmValues_content;

    describe('UDT: "PPM_Values" insertion', () => {
        it('getting data object according to installed version', async function () {
            switch (installedPricingVersionShort) {
                case '5':
                    console.info('AT installedPricingVersion CASE 5');
                    ppmValues_content = pricingRules.version05;
                    break;

                case '6':
                    console.info('AT installedPricingVersion CASE 6');
                    ppmValues_content = pricingRules.version06;
                    break;

                case '7':
                    console.info('AT installedPricingVersion CASE 7');
                    ppmValues_content =
                        specificVersion === 'version07for05data' ? pricingRules.version05 : pricingRules.version07;
                    break;

                default:
                    console.info('AT installedPricingVersion Default');
                    ppmValues_content = pricingRules.version07;
                    break;
            }
            addContext(this, {
                title: `ppmValues_content length`,
                value: Object.keys(ppmValues_content).length,
            });
            addContext(this, {
                title: `ppmValues_content`,
                value: JSON.stringify(ppmValues_content, null, 2),
            });
        });

        it('inserting valid rules to the UDT "PPM_Values"', async function () {
            const dataToBatch: {
                MapDataExternalID: string;
                MainKey: string;
                SecondaryKey: string;
                Values: string[];
            }[] = [];
            Object.keys(ppmValues_content).forEach((mainKey) => {
                dataToBatch.push({
                    MapDataExternalID: pricingRules.tableName,
                    MainKey: mainKey,
                    SecondaryKey: '',
                    Values: [ppmValues_content[mainKey]],
                });
            });
            batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
            expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
            console.info('insertion to PPM_Values RESPONSE: ', JSON.stringify(batchUDTresponse, null, 2));
            batchUDTresponse.map((row) => {
                expect(row).to.have.property('InternalID').that.is.above(0);
                expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                expect(row).to.have.property('Status').that.is.oneOf(['Insert', 'Ignore', 'Update']);
                expect(row)
                    .to.have.property('Message')
                    .that.is.oneOf([
                        'Row inserted.',
                        'No changes in this row. The row is being ignored.',
                        'Row updated.',
                    ]);
                expect(row)
                    .to.have.property('URI')
                    .that.equals('/user_defined_tables/' + row.InternalID);
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
    });
}
