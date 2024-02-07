import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { PricingData05 } from '../pom/addons/Pricing05';
import { PricingData06 } from '../pom/addons/Pricing06';
import { PricingData07 } from '../pom/addons/Pricing07';

chai.use(promised);

export async function PricingConfigUpload(client: Client) {
    const generalService = new GeneralService(client);
    let installedPricingVersion;
    let pricingData;

    describe('Config Upload', () => {
        it('sending configuration object to end point', async () => {
            switch (installedPricingVersion) {
                case '5':
                    console.info('AT installedPricingVersion CASE 5');
                    pricingData = new PricingData05();
                    // await uploadConfiguration(pricingData.config_05);
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
            await uploadConfiguration(pricingData.config);
        });
    });

    async function uploadConfiguration(payload: any) {
        const uploadConfigResponse = await generalService.fetchStatus(
            `/addons/api/adb3c829-110c-4706-9168-40fba9c0eb52/api/configuration`,
            {
                method: 'POST',
                body: JSON.stringify({
                    Key: 'main',
                    Config: JSON.stringify(payload),
                }),
            },
        );
        console.info('uploadConfigResponse: ', JSON.stringify(uploadConfigResponse, null, 2));
        expect(uploadConfigResponse.Ok).to.equal(true);
        expect(uploadConfigResponse.Status).to.equal(200);
        expect(Object.keys(uploadConfigResponse.Body)).to.eql([
            'ModificationDateTime',
            'Hidden',
            'CreationDateTime',
            'Config',
            'Key',
        ]);
        expect(uploadConfigResponse.Body.Key).to.equal('main');
    }
}
