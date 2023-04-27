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
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], // current phased version 17.15.117 | dependency > 17.15.106
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''], // CPAS current phased version 17.10.4 | dependency > 17.0.8
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], // CPI_Node current phased version 1.1.92 | dependency > 1.1.85
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', '0.7.9'], // current phased version 0.6.48 | dependency > 0.6.41
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', '0.7.36'], // current phased version 0.6.41 | dependency > 0.6.35
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', ''], // Do Not change!
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''], // CPI_Node_data current phased version 0.6.14 | dependency > 0.6.11
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', '0.7.%'], // current phased version 0.7.112 | dependency > 0.7.104
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''], // current phased version 0.6.2 | dependency > 0.6.2
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], // current phased version 0.9.38 | dependency > 0.9.31
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''], // current phased version 1.0.23 | dependency > 1.0.23
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // current phased version 0.5.10 | dependency > 0.5.7
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''], // current phased version 0.6.26 | dependency > 0.6.3
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI on version 9.6.x , current phased version 9.5.533
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', '0.5.11'], // dependency > 0.2.58
        Nebula: ['00000000-0000-0000-0000-000000006a91', '0.5.43'],
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
