import { Client } from '@pepperi-addons/debug-server/dist';
import GeneralService from '../../services/general.service';
import { describe, it } from 'mocha';
import promised from 'chai-as-promised';
import chai, { expect } from 'chai';

chai.use(promised);

export async function InstallationsTest(varPass: string, client: Client) {
    const setOfAddonsForE2EusersWithNewSync = [
        // Hagit, July 2023
        // { addonName: string, addonUUID: string, setToVersion?: string, setToLatestAvailable?: boolean, setToLatestPhased?: boolean, }
        // { addonName: 'Services Framework', addonUUID: '00000000-0000-0000-0000-000000000a91', setToVersion: '9.6.%', },
        // { addonName: 'Cross Platforms API', addonUUID: '00000000-0000-0000-0000-000000abcdef', setToVersion: '9.6.%', },
        {
            addonName: 'WebApp API Framework',
            addonUUID: '00000000-0000-0000-0000-0000003eba91',
            setToLatestPhased: true,
        },
        {
            addonName: 'Cross Platform Engine',
            addonUUID: 'bb6ee826-1c6b-4a11-9758-40a46acb69c5',
            setToLatestPhased: true,
        },
        {
            addonName: 'Cross Platform Engine Data',
            addonUUID: 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b',
            setToLatestPhased: true,
        },
        {
            addonName: 'Async Task Execution',
            addonUUID: '00000000-0000-0000-0000-0000000a594c',
            setToLatestPhased: true,
        },
        {
            addonName: 'Core Data Source Interface',
            addonUUID: '00000000-0000-0000-0000-00000000c07e',
            setToLatestPhased: true,
        },
        { addonName: 'Core Resources', addonUUID: 'fc5a5974-3b30-4430-8feb-7d5b9699bc9f', setToLatestPhased: true },
        { addonName: 'Generic Resource', addonUUID: 'df90dba6-e7cc-477b-95cf-2c70114e44e0', setToLatestPhased: true },
        {
            addonName: 'File Service Framework',
            addonUUID: '00000000-0000-0000-0000-0000000f11e5',
            setToLatestPhased: true,
        },
        { addonName: 'WebApp Platform', addonUUID: '00000000-0000-0000-1234-000000000b2b', setToLatestPhased: true },
        { addonName: 'System Health', addonUUID: 'f8b9fa6f-aa4d-4c8d-a78c-75aabc03c8b3', setToLatestPhased: true },
        { addonName: 'Settings Framework', addonUUID: '354c5123-a7d0-4f52-8fce-3cf1ebc95314', setToLatestPhased: true },
        { addonName: 'Addons Manager', addonUUID: 'bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', setToLatestPhased: true },
        { addonName: 'Data Views API', addonUUID: '484e7f22-796a-45f8-9082-12a734bac4e8', setToLatestPhased: true },
        {
            addonName: 'Data Index Framework',
            addonUUID: '00000000-0000-0000-0000-00000e1a571c',
            setToLatestPhased: true,
        },
        {
            addonName: 'Activity Data Index',
            addonUUID: '10979a11-d7f4-41df-8993-f06bfd778304',
            setToLatestPhased: true,
        },
        { addonName: 'ADAL', addonUUID: '00000000-0000-0000-0000-00000000ada1', setToLatestPhased: true },
        {
            addonName: 'User Defined Collections',
            addonUUID: '122c0e9d-c240-4865-b446-f37ece866c22',
            setToLatestPhased: true,
        },
        { addonName: 'Nebula', addonUUID: '00000000-0000-0000-0000-000000006a91', setToLatestPhased: true },
        { addonName: 'sync', addonUUID: '5122dc6d-745b-4f46-bb8e-bd25225d350a', setToLatestAvailable: true },
    ];
    const generalService = new GeneralService(client);
    const baseAddons = await generalService.getSystemAddons();
    // console.info('List of Base Addons: ', JSON.stringify(baseAddons, null, 2));
    // debugger
    console.info('Length of List of Base Addons: ', baseAddons.length);
    const changedVersionsResponses = await generalService.changeSetOfAddonsToRequestedVersions(
        setOfAddonsForE2EusersWithNewSync,
        varPass,
    );
    console.info('changedVersionsResponses: ', JSON.stringify(changedVersionsResponses, null, 2));

    describe('Prerequisites Addons for Resource List Tests', async () => {
        debugger;
        const installedAddonsList = await generalService.getInstalledAddons({ page_size: -1 });
        console.info('Installed Addons Length: ', installedAddonsList.length);
        changedVersionsResponses.forEach((changeResponse) => {
            it(`Validate That The Needed Addon: ${changeResponse.addonName} - Is Installed.`, () => {
                expect(
                    installedAddonsList.find((obj) => {
                        obj.Addon.Name === changeResponse.addonName;
                    }),
                ).to.be.true;
            });
            describe(`"${changeResponse.addonName}"`, () => {
                it(`${changeResponse.auditLogResponseChangeType} To ${
                    changeResponse.setToLatestPhased ? 'Latest Phased Version' : ''
                }${changeResponse.setToLatestAvailable ? 'Latest Available Version' : ''}${
                    changeResponse.setToVersion ? `Latest Version That Start With: ${changeResponse.setToVersion}` : ''
                }`, () => {
                    if (changeResponse.auditLogResponseStatusName == 'Failure') {
                        expect(changeResponse.auditLogResponseErrorMessage).to.include('is already working on version');
                    } else {
                        expect(changeResponse.auditLogResponseStatusName).to.include('Success');
                    }
                });
                it(`${
                    changeResponse.setToLatestPhased
                        ? `Latest Phased Version: "${changeResponse.latestPhasedVersion}"`
                        : ''
                }${
                    changeResponse.setToLatestAvailable
                        ? `Latest Available Version: "${changeResponse.latestAvailableVersion}"`
                        : ''
                }${
                    changeResponse.setToVersion
                        ? `Latest Version That Start With: "${changeResponse.setToVersion}"`
                        : ''
                } Is Installed`, async () => {
                    const expectedVersion = changeResponse.setToLatestPhased
                        ? changeResponse.latestPhasedVersion
                        : changeResponse.setToLatestAvailable
                        ? changeResponse.latestAvailableVersion
                        : changeResponse.setToVersion
                        ? changeResponse.setToVersion
                        : '';
                    await expect(
                        generalService.papiClient.addons.installedAddons.addonUUID(changeResponse.addonUUID).get(),
                    )
                        .eventually.to.have.property('Version')
                        .a('string')
                        .that.is.equal(expectedVersion);
                });
            });
        });
    });

    // const areBaseAddonsPhased = await generalService.setBaseAddonsToPhasedForE2E(varPass);
    // console.info('Are Base Addons Phased: ', JSON.stringify(areBaseAddonsPhased, null, 2));
    // const areAddonsPhased = await generalService.setToLatestPhasedVersion(varPass, generalService.testDataWithNewSync);
    // console.info('Are Addons Phased: ', JSON.stringify(areAddonsPhased, null, 2));

    // const testData = {
    //     'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''],
    //     ResourceListABI_Addon: ['cd3ba412-66a4-42f4-8abc-65768c5dc606', ''],
    //     sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''],
    //     // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''],
    // };

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false); // changeSetOfAddonsToRequestedVersions
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // describe('Prerequisites Addons for Resource List Tests', () => {
    //     const addonsLatestVersionList = Object.keys(testData);

    //     isInstalledArr.forEach((isInstalled, index) => {
    //         it(`Validate That The Needed Addon: ${addonsLatestVersionList[index]} - Is Installed.`, () => {
    //             expect(isInstalled).to.be.true;
    //         });
    //     });
    //     for (const addonName in testData) {
    //         const addonUUID = testData[addonName][0];
    //         const version = testData[addonName][1];
    //         const currentAddonChnageVersionResponse = chnageVersionResponseArr[addonName];
    //         const varLatestVersion = currentAddonChnageVersionResponse[2];
    //         const changeType = currentAddonChnageVersionResponse[3];
    //         const status = currentAddonChnageVersionResponse[4];
    //         const note = currentAddonChnageVersionResponse[5];

    //         describe(`"${addonName}"`, () => {
    //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
    //                 if (status == 'Failure') {
    //                     expect(note).to.include('is already working on version');
    //                 } else {
    //                     expect(status).to.include('Success');
    //                 }
    //             });
    //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
    //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
    //                     .eventually.to.have.property('Version')
    //                     .a('string')
    //                     .that.is.equal(varLatestVersion);
    //             });
    //         });
    //     }
    //     for (const addonName in areAddonsPhased) {
    //         if (!Object.keys(testData).includes(addonName)) {
    //             const currentAddonChnageVersionResponse = areAddonsPhased[addonName];
    //             const addonUUID = currentAddonChnageVersionResponse[0];
    //             const latestPhasedVersion = currentAddonChnageVersionResponse[2];
    //             const changeType = currentAddonChnageVersionResponse[3];
    //             const status = currentAddonChnageVersionResponse[4];
    //             const note = currentAddonChnageVersionResponse[5] || '';

    //             describe(`"${addonName}"`, () => {
    //                 it(`${changeType} To Latest PHASED Version`, () => {
    //                     if (status == 'Failure') {
    //                         expect(note).to.include('is already working on version');
    //                     } else {
    //                         expect(status).to.include('Success');
    //                     }
    //                 });
    //                 it(`Latest Phased Version Is Installed ${latestPhasedVersion}`, async () => {
    //                     await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
    //                         .eventually.to.have.property('Version')
    //                         .a('string')
    //                         .that.is.equal(latestPhasedVersion);
    //                 });
    //             });
    //         }
    //     }
    //     for (const addonName in areBaseAddonsPhased) {
    //         if (!Object.keys(testData).includes(addonName) && !Object.keys(areAddonsPhased).includes(addonName)) {
    //             const currentAddonChnageVersionResponse = areBaseAddonsPhased[addonName];
    //             const addonUUID = currentAddonChnageVersionResponse[0];
    //             const latestPhasedVersion = currentAddonChnageVersionResponse[2];
    //             const changeType = currentAddonChnageVersionResponse[3];
    //             const status = currentAddonChnageVersionResponse[4];
    //             const note = currentAddonChnageVersionResponse[5] || '';

    //             describe(`"${addonName}"`, () => {
    //                 it(`${changeType} To Latest PHASED Version`, () => {
    //                     if (status == 'Failure') {
    //                         expect(note).to.include('is already working on version');
    //                     } else {
    //                         expect(status).to.include('Success');
    //                     }
    //                 });
    //                 it(`Latest Phased Version Is Installed ${latestPhasedVersion}`, async () => {
    //                     await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
    //                         .eventually.to.have.property('Version')
    //                         .a('string')
    //                         .that.is.equal(latestPhasedVersion);
    //                 });
    //             });
    //         }
    //     }
    // });
}
