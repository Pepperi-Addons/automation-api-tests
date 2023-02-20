import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

export async function VFdataPrep(varPass: string, client: Client) {
    const generalService = new GeneralService(client);

    /* Addons Installation */
    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI on version 9.6.x to
        Nebula: ['00000000-0000-0000-0000-000000006a91', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''],
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''],
        'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''],
        'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''],
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''],
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        VisitFlow: ['2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Visit Flow Tests', async () => {
        const addonsList = Object.keys(testData);
        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That Needed Addon Is Installed: ${addonsList[index]}`, () => {
                expect(isInstalled).to.be.true;
            });
        });
        let addonUUID: string;
        let version: string;
        let varLatestVersion: string;
        let changeType: string;
        for (const addonName in testData) {
            addonUUID = testData[addonName][0];
            version = testData[addonName][1];
            varLatestVersion = chnageVersionResponseArr[addonName][2];
            changeType = chnageVersionResponseArr[addonName][3];
            describe(`Test Data: ${addonName}`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                        expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                    } else {
                        expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                    }
                });
                it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                    await expect(await generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(varLatestVersion);
                });
            });
        }
    });
}
