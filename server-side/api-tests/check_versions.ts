// import GeneralService, { TesterFunctions } from '../services/general.service';
// import { AddonRelationService } from '../services/addon-relation.service';
// import { ADALService } from '../services/adal.service';
// import { DIMXService } from '../services/addon-data-import-export.service';
// import { PFSService } from '../services/pfs.service';
// import fs from 'fs';
// import path from 'path';
// import addContext from 'mochawesome/addContext';

// export async function checkVersionsTest(generalService: GeneralService, request, tester: TesterFunctions) {
//     const relationService = new AddonRelationService(generalService);
//     const dimxService = new DIMXService(generalService.papiClient);
//     const describe = tester.describe;
//     const expect = tester.expect;
//     const it = tester.it;
//     let varKey;

//     if (generalService.papiClient['options'].baseURL.includes('staging')) {
//         varKey = request.body.varKeyStage;
//     } else {
//         varKey = request.body.varKeyPro;
//     }
//     // const addonUUID = generalService['client'].BaseURL.includes('staging')
//     //     ? '48d20f0b-369a-4b34-b48a-ffe245088513'
//     //     : '78696fc6-a04f-4f82-aadf-8f823776473f';
//     // const secretKey = await generalService.getSecretKey(addonUUID, varKey);
//     // const version = '0.0.5';

//     // const testData = {
//     //     ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
//     //     'Relations Framework': ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
//     //     'Export and Import Framework': ['44c97115-6d14-4626-91dc-83f176e9a0fc', ''],
//     //     'Pepperitest (Jenkins Special Addon) - Code Jobs': [addonUUID, version],
//     //     'File Service Framework': ['00000000-0000-0000-0000-0000000f11e5', ''],
//     // };
//     // const isInstalledArr = await generalService.areAddonsInstalled(testData);
//     // const chnageVersionResponseArr = await generalService.changeVersion(varKey, testData, false);

//     if (generalService['client'].AddonSecretKey == '00000000-0000-0000-0000-000000000000') {
//         generalService['client'].AddonSecretKey = await generalService.getSecretKey(
//             generalService['client'].AddonUUID,
//             varKey,
//         );
//     }

//     //#region Upgrade Addons

//     describe('Check Versions Test For Angular 14 Regression', async function () {
//         it(`Get Installed Addon versions, Upgrade To Angular 14 WebApp, Get Installed Addon Versions Again`, async function () {
//             const uriWebAppAngular13 = await generalService.papiClient.addons.installedAddons
//                 .addonUUID('00000000-0000-0000-1234-000000000b2b')
//                 .downgrade('16.85.91');
//             const responseBefore = await generalService.getAuditLogResultObjectIfValid(uriWebAppAngular13.URI!);
//             if (
//                 responseBefore.AuditInfo.ErrorMessage &&
//                 !responseBefore.AuditInfo.ErrorMessage.includes('is already working on version')
//             ) {
//                 expect(responseBefore.Status).to.equal(1);
//             }
//             const installedAddonsBeforeUpgrade = await generalService.papiClient.addons.installedAddons.find();
//             const installedAddonsUUIDsBeforeUpgrade = installedAddonsBeforeUpgrade.map((addonEntry) => addonEntry.UUID);
//             const installedAddonsNamesBeforeUpgrade = installedAddonsBeforeUpgrade.map(
//                 (addonEntry) => addonEntry.Addon.Name,
//             );
//             const installedAddonsVersionsBeforeUpgrade = installedAddonsBeforeUpgrade.map(
//                 (addonEntry) => addonEntry.Version,
//             );
//             const allAddonsBefore14: any[] = [];
//             for (let index = 0; index < installedAddonsUUIDsBeforeUpgrade.length; index++) {
//                 allAddonsBefore14.push({
//                     uuid: installedAddonsUUIDsBeforeUpgrade[index],
//                     name: installedAddonsNamesBeforeUpgrade[index],
//                     version: installedAddonsVersionsBeforeUpgrade[index],
//                 });
//             }
//             const uriWebAppAngular14 = await generalService.papiClient.addons.installedAddons
//                 .addonUUID('00000000-0000-0000-1234-000000000b2b')
//                 .upgrade('17.14.58');
//             const response = await generalService.getAuditLogResultObjectIfValid(uriWebAppAngular14.URI!);
//             expect(response.Status?.ID).to.equal(1);
//             const installedAddonsAfterUpgrade = await generalService.papiClient.addons.installedAddons.find();
//             const installedAddonsUUIDsAfterUpgrade = installedAddonsAfterUpgrade.map((addonEntry) => addonEntry.UUID);
//             const installedAddonsNamesAfterUpgrade = installedAddonsAfterUpgrade.map(
//                 (addonEntry) => addonEntry.Addon.Name,
//             );
//             const installedAddonsVersionsAfterUpgrade = installedAddonsAfterUpgrade.map(
//                 (addonEntry) => addonEntry.Version,
//             );
//             const allAddonsAfter14: any[] = [];
//             for (let index = 0; index < installedAddonsUUIDsBeforeUpgrade.length; index++) {
//                 allAddonsAfter14.push({
//                     uuid: installedAddonsUUIDsAfterUpgrade[index],
//                     name: installedAddonsNamesAfterUpgrade[index],
//                     version: installedAddonsVersionsAfterUpgrade[index],
//                 });
//             }
//             for (let index = 0; index < allAddonsBefore14.length; index++) {
//                 const filteredAfter = allAddonsAfter14.filter((addon) => addon.uuid === allAddonsBefore14[index].uuid);
//                 if (filteredAfter[0].version !== allAddonsBefore14[index].version) {
//                     it(
//                         `${filteredAfter[0].name}: version before:${allAddonsBefore14[index].version} version after:${filteredAfter[0].version}`,
//                     );
//                 }
//             }
//             for (let index = 0; index < allAddonsBefore14.length; index++) {
//                 it(`${allAddonsBefore14[index].name}`);
//             }
//         });
//     });
// }
