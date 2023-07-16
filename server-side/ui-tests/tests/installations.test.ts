import { Client } from '@pepperi-addons/debug-server/dist';
import GeneralService from '../../services/general.service';
import { describe, it } from 'mocha';
import promised from 'chai-as-promised';
import chai, { expect } from 'chai';

chai.use(promised);

export async function InstallationsTest(varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const areBaseAddonsPhased = await generalService.setBaseAddonsToPhasedForE2E(varPass);
    console.info('Are Base Addons Phased: ', JSON.stringify(areBaseAddonsPhased, null, 2));
    const areAddonsPhased = await generalService.setToLatestPhasedVersion(varPass, generalService.testDataWithNewSync);
    console.info('Are Addons Phased: ', JSON.stringify(areAddonsPhased, null, 2));

    const testData = {
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
        ResourceListABI_Addon: ['cd3ba412-66a4-42f4-8abc-65768c5dc606', ''],
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    describe('Prerequisites Addons for Resource List Tests', () => {
        const addonsLatestVersionList = Object.keys(testData);

        isInstalledArr.forEach((isInstalled, index) => {
            it(`Validate That The Needed Addon: ${addonsLatestVersionList[index]} - Is Installed.`, () => {
                expect(isInstalled).to.be.true;
            });
        });
        for (const addonName in testData) {
            const addonUUID = testData[addonName][0];
            const version = testData[addonName][1];
            const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
            const varLatestVersion = currentAddonChnageVersionResponse[2];
            const changeType = currentAddonChnageVersionResponse[3];
            const status = currentAddonChnageVersionResponse[4];
            const note = currentAddonChnageVersionResponse[5];

            describe(`"${addonName}"`, () => {
                it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                    if (status == 'Failure') {
                        expect(note).to.include('is already working on version');
                    } else {
                        expect(status).to.include('Success');
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
        for (const addonName in areAddonsPhased) {
            if (!Object.keys(testData).includes(addonName)) {
                const currentAddonChnageVersionResponse = areAddonsPhased[addonName];
                const addonUUID = currentAddonChnageVersionResponse[0];
                const latestPhasedVersion = currentAddonChnageVersionResponse[2];
                const changeType = currentAddonChnageVersionResponse[3];
                const status = currentAddonChnageVersionResponse[4];
                const note = currentAddonChnageVersionResponse[5] || '';

                describe(`"${addonName}"`, () => {
                    it(`${changeType} To Latest PHASED Version`, () => {
                        if (status == 'Failure') {
                            expect(note).to.include('is already working on version');
                        } else {
                            expect(status).to.include('Success');
                        }
                    });
                    it(`Latest Phased Version Is Installed ${latestPhasedVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(latestPhasedVersion);
                    });
                });
            }
        }
        for (const addonName in areBaseAddonsPhased) {
            if (!Object.keys(testData).includes(addonName) && !Object.keys(areAddonsPhased).includes(addonName)) {
                const currentAddonChnageVersionResponse = areBaseAddonsPhased[addonName];
                const addonUUID = currentAddonChnageVersionResponse[0];
                const latestPhasedVersion = currentAddonChnageVersionResponse[2];
                const changeType = currentAddonChnageVersionResponse[3];
                const status = currentAddonChnageVersionResponse[4];
                const note = currentAddonChnageVersionResponse[5] || '';

                describe(`"${addonName}"`, () => {
                    it(`${changeType} To Latest PHASED Version`, () => {
                        if (status == 'Failure') {
                            expect(note).to.include('is already working on version');
                        } else {
                            expect(status).to.include('Success');
                        }
                    });
                    it(`Latest Phased Version Is Installed ${latestPhasedVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(latestPhasedVersion);
                    });
                });
            }
        }
    });
}
