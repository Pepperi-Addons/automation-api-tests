import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services';
// import { PricingData } from '../pom/addons/Pricing';
// import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { PricingData05 } from '../pom/addons/Pricing05';
import { PricingData06 } from '../pom/addons/Pricing06';

chai.use(promised);

export async function PricingDataPrep(varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const tableName = 'PPM_Values';
    const dummyPPMvalue = '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]';
    let installedPricingVersion;
    let pricingData;
    const dummyPPM_ValuesKeys: any[] = [];
    let batchUDTresponse: any;
    let dummyBatchUDTresponse: any;
    // let deleteUDTresponse: any;
    let initialPpmValues: any;
    const dummyDataToBatch: {
        MapDataExternalID: string;
        MainKey: string;
        SecondaryKey: string;
        Values: string[];
    }[] = [];

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies

    const testData = {
        pricing: ['adb3c829-110c-4706-9168-40fba9c0eb52', ''],
        // 'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', ''], // current phased version 17.15.117 | dependency > 17.15.106
        // 'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', ''], // CPAS current phased version 17.10.4 | dependency > 17.0.8
        'Cross Platform Engine': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', ''], // CPI_Node current phased version 1.2.12 | dependency > 1.1.85
        'Cross Platform Engine Data': ['d6b06ad0-a2c1-4f15-bebb-83ecc4dca74b', ''], // CPI_Node_data current phased version 0.6.14 | dependency > 0.6.11
        // 'Core Data Source Interface': ['00000000-0000-0000-0000-00000000c07e', ''], // current phased version 0.6.48 | dependency > 0.6.41
        // 'Core Resources': ['fc5a5974-3b30-4430-8feb-7d5b9699bc9f', ''], // current phased version 0.6.41 | dependency > 0.6.35
        'User Defined Collections': ['122c0e9d-c240-4865-b446-f37ece866c22', ''], // UDC current phased version 0.8.29 | dependency > 0.8.11
        'Resource List': ['0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3', ''], // current phased version 0.7.112 | dependency > 0.7.104
        'Generic Resource': ['df90dba6-e7cc-477b-95cf-2c70114e44e0', ''], // current phased version 0.6.2 | dependency > 0.6.2
        Pages: ['50062e0c-9967-4ed4-9102-f2bc50602d41', ''], // current phased version 0.9.38 | dependency > 0.9.31
        Slugs: ['4ba5d6f9-6642-4817-af67-c79b68c96977', ''], // current phased version 1.0.23 | dependency > 1.0.23
        'User Defined Events': ['cbbc42ca-0f20-4ac8-b4c6-8f87ba7c16ad', ''], // current phased version 0.5.10 | dependency > 0.5.7
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', ''], // current phased version 0.6.26 | dependency > 0.6.3
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.6.%'], //PAPI on version 9.6.x , current phased version 9.5.533
        sync: ['5122dc6d-745b-4f46-bb8e-bd25225d350a', ''], // dependency > 0.2.58
        Nebula: ['00000000-0000-0000-0000-000000006a91', '0.7.%'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    console.info('Installed Addons: ', JSON.stringify(await generalService.getInstalledAddons(), null, 2));
    installedPricingVersion = (await generalService.getInstalledAddons())
        .find((addon) => addon.Addon.Name == 'pricing')
        ?.Version?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    // #endregion Upgrade script dependencies

    describe('Prerequisites Addons for Pricing Tests', async () => {
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
                    if (addonName === 'pricing') {
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

    describe('Data Prep', () => {
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

                default:
                    break;
            }
            await uploadConfiguration(pricingData.config);
        });
        it('inserting valid rules to the UDT "PPM_Values"', async () => {
            // const tableName = 'PPM_Values';
            const dataToBatch: {
                MapDataExternalID: string;
                MainKey: string;
                SecondaryKey: string;
                Values: string[];
            }[] = [];
            Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
                dataToBatch.push({
                    MapDataExternalID: tableName,
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
                expect(row).to.have.property('Status').that.is.oneOf(['Insert', 'Ignore']);
                expect(row)
                    .to.have.property('Message')
                    .that.is.oneOf(['Row inserted.', 'No changes in this row. The row is being ignored.']);
                expect(row)
                    .to.have.property('URI')
                    .that.equals('/user_defined_tables/' + row.InternalID);
            });
        });
        it('inserting 20,000 dummy rules to the UDT "PPM_Values"', async () => {
            for (let index = 1; index < 3; index++) {
                dummyDataToBatch.push({
                    MapDataExternalID: tableName,
                    MainKey: `ZDS1@A001@Dummy${index}`,
                    SecondaryKey: '',
                    Values: [dummyPPMvalue],
                });
            }
            dummyBatchUDTresponse = await objectsService.postBatchUDT(dummyDataToBatch);
            expect(dummyBatchUDTresponse).to.be.an('array').with.lengthOf(dummyDataToBatch.length);
            console.info('insertion to PPM_Values RESPONSE: ', JSON.stringify(dummyBatchUDTresponse, null, 2));
            dummyBatchUDTresponse.map((row) => {
                expect(row).to.have.property('InternalID').that.is.above(0);
                dummyPPM_ValuesKeys.push(row['InternalID']);
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
        it('get UDT Values (PPM_Values)', async () => {
            initialPpmValues = await objectsService.getUDT({ where: "MapDataExternalID='PPM_Values'" });
            console.info('PPM_Values: ', JSON.stringify(initialPpmValues, null, 2));
        });
        it('validating "PPM_Values" via API', async () => {
            expect(initialPpmValues.length).equals(
                Object.keys(pricingData.documentsIn_PPM_Values).length + dummyPPM_ValuesKeys.length,
            );
            Object.keys(pricingData.documentsIn_PPM_Values).forEach((mainKey) => {
                console.info('mainKey: ', mainKey);
                const matchingRowOfinitialPpmValues = initialPpmValues.find((tableRow) => {
                    if (tableRow.MainKey === mainKey) {
                        return tableRow;
                    }
                });
                console.info('matchingRowOfinitialPpmValues: ', matchingRowOfinitialPpmValues['Values'][0]);
                expect(pricingData.documentsIn_PPM_Values[mainKey]).equals(matchingRowOfinitialPpmValues['Values'][0]);
            });
            // initialPpmValues.forEach((tableRow) => {
            //     expect(tableRow['Values'][0]).equals(pricingData.documentsIn_PPM_Values[tableRow.MainKey]);
            // });
        });
        // it('deleting dummy rules from the UDT "PPM_Values"', async () => {
        //     generalService.sleep(5 * 1000);
        //     dummyPPM_ValuesKeys.forEach(async dummyPPM_InternalID => {
        //         const valueObj = initialPpmValues.find(obj => { if (obj.InternalID === dummyPPM_InternalID) { return obj } });
        //         // valueObj["Hidden"] = true;
        //         console.info('dummyPPM_InternalID', dummyPPM_InternalID, 'dummyPPM_ValueObj: ', JSON.stringify(valueObj, null, 2));
        //         // debugger
        //         const body: UserDefinedTableRow = {
        //             "InternalID": dummyPPM_InternalID,
        //             "Hidden": true,
        //             "MainKey": valueObj?.MainKey || "",
        //             "SecondaryKey": '',
        //             "MapDataExternalID": tableName,
        //             "Values": [dummyPPMvalue]
        //         };
        //         deleteUDTresponse = await objectsService.postUDT(body);
        //         expect(deleteUDTresponse).to.deep.include({
        //             MapDataExternalID: tableName,
        //             SecondaryKey: null,
        //             Values: [dummyPPMvalue],
        //         });
        //         expect(deleteUDTresponse).to.have.property('MainKey').that.contains('ZDS1@A001@Dummy');
        //         expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
        //         expect(deleteUDTresponse)
        //             .to.have.property('ModificationDateTime')
        //             .that.contains(new Date().toISOString().split('T')[0]);
        //         expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
        //         expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
        //         expect(deleteUDTresponse).to.have.property('InternalID').that.equals(dummyPPM_InternalID);
        //         console.info('dummyPPM_ValuesKeys Delete RESPONSE: ', JSON.stringify(deleteUDTresponse, null, 2));
        //     });
        // });
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
