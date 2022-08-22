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

//     const versionsAfterUpdate = [
//         {name: 'Pages', uuid: '50062e0c-9967-4ed4-9102-f2bc50602d41', version: '0.7.144', latestPhased:'0.7.35' },
//         {name: 'Assets Manager ', uuid: 'ad909780-0c23-401e-8e8e-f514cc4f6aa2', version: '0.7.115', latestPhased:'' },
//         {name: 'Gallery', uuid: '5adbc9e0-ed1d-4b2d-98e9-9c50891812ea', version: '0.7.128', latestPhased:'' },
//         {name: 'Slideshow', uuid: 'f93658be-17b6-4c92-9df3-4e6c7151e038', version: '0.7.120', latestPhased:'' },
//         {name: 'Survey', uuid: 'cf17b569-1af4-45a9-aac5-99f23cae45d8', version: '0.0.134', latestPhased:'' },
//         {name: 'Script Launcher', uuid: '21d174ae-a8dc-4842-a40d-1437a677abcf', version: '0.7.118', latestPhased:'' },
//         {name: 'LegacySettings', uuid: '354c5123-a7d0-4f52-8fce-3cf1ebc95314', version: '9.5.343', latestPhased:'9.5.328' },
//         {name: 'DIMX', uuid: '44c97115-6d14-4626-91dc-83f176e9a0fc', version: '0.1.118', latestPhased:'0.0.192' },
//         {name: 'AuditDataLog', uuid: '00000000-0000-0000-0000-00000da1a109', version: '0.1.118', latestPhased:'0.0.189' },
//         {name: 'Data visualization', uuid: '00000000-0000-0000-0000-0da1a0de41e5', version: '0.6.127', latestPhased:'0.5.3' },
//         {name: 'Data queries', uuid: 'c7544a9d-7908-40f9-9814-78dc9c03ae77', version: '0.5.115', latestPhased:'' },
//         {name: 'user Defined Collections', uuid: '122c0e9d-c240-4865-b446-f37ece866c22', version: '0.6.117', latestPhased:'' },
//         {name: 'resource List', uuid: '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', version: '0.1.115', latestPhased:'' },
//         {name: 'events', uuid: 'cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', version: '0.0.119', latestPhased:'' },
//         {name: 'atd Events', uuid: '316afc44-af38-4354-ac4c-22011cb0ea84', version: '0.0.116', latestPhased:'' },
//         {name: 'logic Block Example', uuid: 'bd822717-76bc-480c-8f71-7f38b1bab0cb', version: '0.0.118', latestPhased:'' },
//         {name: 'related Items', uuid: '4f9f10f3-cd7d-43f8-b969-5029dad9d02b', version: '0.1.118', latestPhased:'0.0.191' },
//         {name: 'transaction events', uuid: 'd2e046c0-8e2d-4cf6-979e-a365fca4a095', version: '0.0.115', latestPhased:'' },
//         {name: 'intercom chat', uuid: '26f57caf-1b8d-46a3-ac31-0e8ac9260657', version: '0.0.116', latestPhased:'' },
//         {name: 'push notifications', uuid: '95025423-9096-4a4f-a8cd-d0a17548e42e', version: '0.1.123', latestPhased:'' },
//         {name: 'uom', uuid: '1238582e-9b32-4d21-9567-4e17379f41bb', version: '1.3.116', latestPhased:'' },
//         {name: 'scripts', uuid: '9f3b727c-e88c-4311-8ec4-3857bc8621f3', version: '0.1.118', latestPhased:'' },
//         {name: 'atd-editor', uuid: '04de9428-8658-4bf7-8171-b59f6327bbf1', version: '1.0.126', latestPhased:'1.0.19' },
//         {name: 'ImportExportATD', uuid: 'e9029d7f-af32-4b0e-a513-8d9ced6f8186', version: '1.2.115', latestPhased:'1.1.216' },
//         {name: 'Script Picker Example', uuid: '43b165e7-b6fc-416e-af79-8acf0ae00ddc', version: '0.0.115', latestPhased:'' }
//     ];

//     const testData = {
//         Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''],
//         'Assets Manager': ['ad909780-0c23-401e-8e8e-f514cc4f6aa2', ''],
//         Gallery: ['5adbc9e0-ed1d-4b2d-98e9-9c50891812ea', ''],
//         Slideshow: ['f93658be-17b6-4c92-9df3-4e6c7151e038', ''],
//         Survey: ['cf17b569-1af4-45a9-aac5-99f23cae45d8', ''],
//         'Script Launcher': ['21d174ae-a8dc-4842-a40d-1437a677abcf', ''],
//         LegacySettings:['354c5123-a7d0-4f52-8fce-3cf1ebc95314',''],
//         DIMX:['44c97115-6d14-4626-91dc-83f176e9a0fc',''],
//         AuditDataLog:['00000000-0000-0000-0000-00000da1a109',''],
//         'Data visualization':['00000000-0000-0000-0000-0da1a0de41e5',''],
//         'Data queries':['c7544a9d-7908-40f9-9814-78dc9c03ae77',''],
//         'user Defined Collections':['122c0e9d-c240-4865-b446-f37ece866c22',''],
//         'resource List':['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3',''],
//         events:['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad',''],
//         'atd Events':['316afc44-af38-4354-ac4c-22011cb0ea84',''],
//         'logic Block Example':['bd822717-76bc-480c-8f71-7f38b1bab0cb',''],
//         'related Items':['4f9f10f3-cd7d-43f8-b969-5029dad9d02b',''],
//         'push notifications':['95025423-9096-4a4f-a8cd-d0a17548e42e',''],
//         'uom':['1238582e-9b32-4d21-9567-4e17379f41bb',''],
//         scripts:['9f3b727c-e88c-4311-8ec4-3857bc8621f3',''],
//         'atd-editor':['04de9428-8658-4bf7-8171-b59f6327bbf1',''],
//         'ImportExportATD':['e9029d7f-af32-4b0e-a513-8d9ced6f8186',''],
//         'Script Picker Example':['43b165e7-b6fc-416e-af79-8acf0ae00ddc','']
//     };

//     //validate the dist has all needed addons
//     await generalService.changeVersion(varKey, testData, false);
//     await generalService.areAddonsInstalled(testData);
//     describe('Check Versions Test For Angular 14 Regression', async function () {
//         it(`Get Installed Addon versions, Upgrade To Angular 14 WebApp, Get Installed Addon Versions Again`, async function () {
//             //upgrade to angilar 14
//             const uriWebAppAngular14 = await generalService.papiClient.addons.installedAddons
//                 .addonUUID('00000000-0000-0000-1234-000000000b2b')
//                 .upgrade('17.14.65');
//             const responseUpgrade = await generalService.getAuditLogResultObjectIfValid(uriWebAppAngular14.URI!);
//             if (
//                 responseUpgrade.AuditInfo.ErrorMessage &&
//                 !responseUpgrade.AuditInfo.ErrorMessage.includes('is already working on version')
//             ) {
//                 expect(responseUpgrade.Status?.ID).to.equal(1);
//             }
//             // generalService.sleep(240000);
//             generalService.sleep(50000);
//             //get the installed addons
//             const installedAddonsAfterUpgrade = await generalService.papiClient.addons.installedAddons.find({ page_size: -1 });
//             const allAddonsAfter14: any[] = [];
//             for (let index = 0; index < installedAddonsAfterUpgrade.length; index++) {
//                 allAddonsAfter14.push({
//                     uuid: installedAddonsAfterUpgrade[index].Addon.UUID,
//                     name: installedAddonsAfterUpgrade[index].Addon.Name,
//                     version: installedAddonsAfterUpgrade[index].Version,
//                 });
//             }
//             //validate verions are matching
//             it(
//                 `UPGRADE`,
//             );
//             for (let index = 0; index < allAddonsAfter14.length; index++) {
//                 const filteredExpected = versionsAfterUpdate.filter(addon => addon.uuid === allAddonsAfter14[index].uuid);
//                 if (filteredExpected.length === 1) {
//                     if (filteredExpected[0].version !== allAddonsAfter14[index].version) {
//                         it(
//                             `${filteredExpected[0].name}: version after upgrade is: ${allAddonsAfter14[index].version}, expected: ${filteredExpected[0].version}`,
//                         );
//                     }
//                 }
//             }
//             //downgrade to 12
//             const uriWebAppAngular13 = await generalService.papiClient.addons.installedAddons
//                 .addonUUID('00000000-0000-0000-1234-000000000b2b')
//                 .downgrade('16.85.91');
//             const responseDowngrade = await generalService.getAuditLogResultObjectIfValid(uriWebAppAngular13.URI!);
//             expect(responseDowngrade.Status?.ID).to.equal(1);
//             generalService.sleep(50000);
//             //get installed addons
//             const installedAddonsAfterDowngrade = await generalService.papiClient.addons.installedAddons.find({ page_size: -1 });
//             const allAddonsAfter13: any[] = [];
//             for (let index = 0; index < installedAddonsAfterDowngrade.length; index++) {
//                 allAddonsAfter13.push({
//                     uuid: installedAddonsAfterDowngrade[index].Addon.UUID,
//                     name: installedAddonsAfterDowngrade[index].Addon.Name,
//                     version: installedAddonsAfterDowngrade[index].Version,
//                 });
//             }
//             it(
//                 `DOWNGRADE`,
//             );
//             for (let index = 0; index < allAddonsAfter13.length; index++) {
//                 const filteredExpected = versionsAfterUpdate.filter(addon => addon.uuid === allAddonsAfter13[index].uuid);
//                 if (filteredExpected.length === 1) {
//                     if (filteredExpected[0].latestPhased !== allAddonsAfter13[index].version && filteredExpected[0].latestPhased !== '') {
//                         it(
//                             `${filteredExpected[0].name}: version after downgrade is: ${allAddonsAfter14[index].version}, expected: ${filteredExpected[0].latestPhased}`,
//                         );
//                     }
//                     // expect(filteredExpected[0].version).to.equal(allAddonsAfter14[index].version, `${filteredExpected[0].name}: version after update is: ${allAddonsAfter14[index].version}, expected: ${filteredExpected[0].version}`);
//                 }
//             }
//         });
//     });
// }
//  // for (let index = 0; index < allAddonsBefore14.length; index++) {
//             //     it(
//             //         `BEFORE: ${allAddonsBefore14[index].name}: version before:${allAddonsBefore14[index].version}`,
//             //     );
//             // }
//             // const uriWebAppAngular14 = await generalService.papiClient.addons.installedAddons
//             //     .addonUUID('00000000-0000-0000-1234-000000000b2b')
//             //     .upgrade('17.14.65');
//             // const response = await generalService.getAuditLogResultObjectIfValid(uriWebAppAngular14.URI!);
//             // expect(response.Status?.ID).to.equal(1);
//             // generalService.sleep(8500);
//             // const installedAddonsAfterUpgrade = await generalService.papiClient.addons.installedAddons.find({ page_size: -1 });
//             // const installedAddonsUUIDsAfterUpgrade = installedAddonsAfterUpgrade.map((addonEntry) => addonEntry.UUID);
//             // const installedAddonsNamesAfterUpgrade = installedAddonsAfterUpgrade.map(
//             //     (addonEntry) => addonEntry.Addon.Name,
//             // );
//             // const installedAddonsVersionsAfterUpgrade = installedAddonsAfterUpgrade.map(
//             //     (addonEntry) => addonEntry.Version,
//             // );
//             // const allAddonsAfter14: any[] = [];
//             // for (let index = 0; index < installedAddonsUUIDsBeforeUpgrade.length; index++) {
//             //     allAddonsAfter14.push({
//             //         uuid: installedAddonsUUIDsAfterUpgrade[index],
//             //         name: installedAddonsNamesAfterUpgrade[index],
//             //         version: installedAddonsVersionsAfterUpgrade[index],
//             //     });
//             // }
//             // for (let index = 0; index < allAddonsBefore14.length; index++) {
//             //     const filteredAfter = allAddonsAfter14.filter((addon) => addon.uuid === allAddonsBefore14[index].uuid);
//             //     if (filteredAfter[0].version !== allAddonsBefore14[index].version) {
//             //         it(
//             //             `${filteredAfter[0].name}: version before:${allAddonsBefore14[index].version} version after:${filteredAfter[0].version}`,
//             //         );
//             //     }
//             // }
