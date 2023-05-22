import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

export async function VFdataPrep(varPass: string, client: Client) {
    const generalService = new GeneralService(client);

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies

    const testData = {
        VisitFlow: ['2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], // PAPI
        // 'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.6.18'], // CPAPI
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '17.10.4'], // CPAS
        // 'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''],
        // 'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5.364'],
        // 'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '1.1.3'],
        // 'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.0.5'],
        // 'Data Index Framework': ['00000000-0000-0000-0000-00000e1a571c', '1.3.22'],
        // 'Activity Data Index': ['10979a11-d7f4-41df-8993-f06bfd778304', '1.1.12'],
        // 'ADAL': ['00000000-0000-0000-0000-00000000ada1', '1.5.51'],
        // 'Audit Log': ['00000000-0000-0000-0000-00000da1a109', '1.0.38'],
        // 'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', '1.0.2'],
        // 'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', '1.0.134'],
        // 'Notification Service': ['00000000-0000-0000-0000-000000040fa9', '1.0.118'],
        // 'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', '6.3.66'],
        // 'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', '6.3.72'],
        // 'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', '6.4.54'],
        // 'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '1.3.3'], // CPI_Node current phased version 1.1.92 | dependency > 1.1.85
        // 'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', '0.6.15'], // CPI_Node_data current phased version 0.6.14 | dependency > 0.6.11
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // dependency > 0.2.58
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''], // current phased version 0.6.48 | dependency > 0.6.41
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''], // current phased version 0.6.41 | dependency > 0.6.35
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''], // current phased version 0.6.2 | dependency > 0.6.2
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''], // current phased version 0.7.112 | dependency > 0.7.104
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], // current phased version 0.9.38 | dependency > 0.9.31
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''], // current phased version 1.0.23 | dependency > 1.0.23
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // current phased version 0.5.10 | dependency > 0.5.7
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''], // current phased version 0.6.26 | dependency > 0.6.3
        'Abstract Activity': ['92b9bd68-1660-4998-91bc-3b745b4bab11', ''],
        survey: ['dd0a85ea-7ef0-4bc1-b14f-959e0372877a', ''],
        'Survey Builder': ['cf17b569-1af4-45a9-aac5-99f23cae45d8', ''],
        Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade script dependencies

    describe('Prerequisites Addons for Visit Flow Tests', async () => {
        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const varLatestVersion = chnageVersionResponseArr[addonName][2];
            const changeType = chnageVersionResponseArr[addonName][3];
            describe(`Test Data: ${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });
                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}
