import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../../services';
import { PricingData05 } from '../../pom/addons/Pricing05';
import { PricingData06 } from '../../pom/addons/Pricing06';
import { PricingData07 } from '../../pom/addons/Pricing07';

chai.use(promised);

export async function PricingUdtInsertion(client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let batchUDTresponse: any;
    let installedPricingVersion;
    let pricingData;

    describe('UDT: "PPM_Values" insertion', () => {
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

        it('inserting valid rules to the UDT "PPM_Values"', async () => {
            const dataToBatch: {
                MapDataExternalID: string;
                MainKey: string;
                SecondaryKey: string;
                Values: string[];
            }[] = [];
            Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
                dataToBatch.push({
                    MapDataExternalID: pricingData.tableName,
                    MainKey: mainKey,
                    SecondaryKey: '',
                    Values: [pricingData.documentsIn_PPM_Values[mainKey]],
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
        });
    });
}
