import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

export async function PricingAddonsUpsert(varPass: string, client: Client, prcVer = '') {
    const generalService = new GeneralService(client);
    let installedPricingVersion;

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies

    const testData = {
        pricing: ['adb3c829-110c-4706-9168-40fba9c0eb52', prcVer], //
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''], // dependency > 1.1.105 | Nelt: 1.1.115
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // dependency > 1.0.42 | Nelt: 0.7.79 | has to evoid open sync which is 2.% | sync 3.% is available
        configurations: ['84c999c3-84b7-454e-9a86-71b7abc96554', ''],
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // current phased version 0.5.10 | dependency > 0.5.7
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''], // current phased version 0.6.26 | dependency > 0.6.3
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
        // 'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.31'], // CPAPI | dependency > 9.6.43
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.30.7'], //CPAS | dependency > 17.3
        'WebApp API Framework': [
            '00000000-0000-0000-0000-0000003eba91',
            `${prcVer?.startsWith('0.5') ? '17.20.%' : ''}`,
        ], //CPAS | dependency > 17.3
        'Cross Platform Engine': [
            'bb6ee826-1c6b-4a11-9758-40a46acb69c5',
            `${prcVer?.startsWith('0.5') ? '1.4.%' : ''}`,
        ], //CPI-NODE (Cross Platform Engine) | dependency > 1.5.39
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        // 'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.%'],  // restriction due to Nebula & Sync 1.%
        uom: ['1238582e-9b32-4d21-9567-4e17379f41bb', ''],
        // Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], // current phased version 0.9.38 | dependency > 0.9.31
        // Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''], // current phased version 1.0.23 | dependency > 1.0.23
        Nebulus: ['e8b5bb3a-d2df-4828-90f4-32cc3d49f207', ''], // dependency of UDC
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        // 'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''], // current phased version 0.7.112 | dependency > 0.7.104
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);
    // console.info('Installed Addons: ', JSON.stringify(await generalService.getInstalledAddons(), null, 2));
    // installedPricingVersion = (await generalService.getInstalledAddons())
    //     .find((addon) => addon.Addon.Name == 'Pricing')
    //     ?.Version?.split('.')[1];
    // console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    // #endregion Upgrade script dependencies

    describe(`Prerequisites Addons for PRICING Tests - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    }`, async () => {
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            describe(`Test Data: ${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (currentAddonChnageVersionResponse[4] == 'Failure') {
                        expect(currentAddonChnageVersionResponse[5]).to.include('is already working on version');
                    } else {
                        expect(currentAddonChnageVersionResponse[4]).to.include('Success');
                    }
                });
                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                    if (addonName === 'Pricing') {
                        installedPricingVersion = varLatestVersion.split('.')[1];
                        console.info(
                            'Installed Pricing Latest Version: ',
                            JSON.stringify(installedPricingVersion, null, 2),
                        );
                    }
                });
            });
        }
    });
}
