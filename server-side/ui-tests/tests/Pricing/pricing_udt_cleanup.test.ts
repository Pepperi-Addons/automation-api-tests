import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { ObjectsService } from '../../../services';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';

chai.use(promised);

export async function PricingUdtCleanup(
    client: Client,
    specialVersion: 'version07for05data' | 'version08for07data' | undefined = undefined,
) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingRules = new PricingRules();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    const dateTime = new Date();
    const udtFirstTableName = 'PPM_Values';
    const udtSecondTableName = 'PPM_AccountValues';
    let ppmValuesEnd: UserDefinedTableRow[];
    let ppmAccountValuesEnd: UserDefinedTableRow[];
    let ppmValues_content;
    let ppmAccountValues_content;

    describe(`UDT Values Deletion - Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | ${dateTime}`, () => {
        describe(`UDT: "${udtFirstTableName}" cleanup`, () => {
            it('getting data object according to installed version', async function () {
                switch (installedPricingVersionShort) {
                    case '5':
                        console.info('AT installedPricingVersion CASE 5');
                        ppmValues_content = pricingRules[udtFirstTableName].features05;
                        break;

                    case '6':
                        console.info('AT installedPricingVersion CASE 6');
                        ppmValues_content = {
                            ...pricingRules[udtFirstTableName].features05,
                            ...pricingRules[udtFirstTableName].features06,
                        };
                        break;

                    case '7':
                        console.info('AT installedPricingVersion CASE 7');
                        ppmValues_content =
                            specialVersion === 'version07for05data'
                                ? pricingRules[udtFirstTableName].features05
                                : {
                                      ...pricingRules[udtFirstTableName].features05,
                                      ...pricingRules[udtFirstTableName].features06,
                                      ...pricingRules[udtFirstTableName].features07,
                                  };
                        break;

                    case '8':
                        console.info('AT installedPricingVersion CASE 8');
                        ppmValues_content =
                            specialVersion === 'version08for07data'
                                ? {
                                      ...pricingRules[udtFirstTableName].features05,
                                      ...pricingRules[udtFirstTableName].features06,
                                      ...pricingRules[udtFirstTableName].features07,
                                  }
                                : {
                                      ...pricingRules[udtFirstTableName].features05,
                                      ...pricingRules[udtFirstTableName].features06,
                                      ...pricingRules[udtFirstTableName].features07,
                                      ...pricingRules[udtFirstTableName].features08,
                                  };
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        ppmValues_content = {
                            ...pricingRules[udtFirstTableName].features05,
                            ...pricingRules[udtFirstTableName].features06,
                            ...pricingRules[udtFirstTableName].features07,
                            ...pricingRules[udtFirstTableName].features08,
                        };
                        break;
                }
                addContext(this, {
                    title: `ppmValues_content.length`,
                    value: ppmValues_content.length,
                });
            });

            it(`retrieving "${udtFirstTableName}" UDT values via API`, async function () {
                ppmValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtFirstTableName}'`,
                    page_size: -1,
                });
                addContext(this, {
                    title: `ppmValuesEnd.length`,
                    value: ppmValuesEnd.length,
                });
            });

            it(`deleting valid rules from the UDT "${udtFirstTableName}"`, async function () {
                const valueObjs: UserDefinedTableRow[] = [];
                const validPPM_ValuesKeys = Object.keys(ppmValues_content);
                const deleteResponses = await Promise.all(
                    validPPM_ValuesKeys.map(async (validPPM_Key) => {
                        const valueObj: UserDefinedTableRow | undefined = ppmValuesEnd.find((listing) => {
                            if (listing.MainKey === validPPM_Key) return listing;
                        });
                        console.info(
                            'validPPM_Key:',
                            validPPM_Key,
                            ', validPPM_ValueObj: ',
                            JSON.stringify(valueObj, null, 2),
                        );
                        if (valueObj) {
                            console.info(`valueObj for key "${validPPM_Key}" EXIST!`);
                            valueObj.Hidden = true;
                            valueObjs.push(valueObj);
                            const deleteResponse = await objectsService.postUDT(valueObj);
                            addContext(this, {
                                title: `key "${validPPM_Key}" EXIST in UDT`,
                                value: deleteResponse,
                            });
                            return deleteResponse;
                        }
                    }),
                );
                valueObjs.length && expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
                deleteResponses.forEach((deleteUDTresponse) => {
                    console.info(
                        `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                        JSON.stringify(deleteUDTresponse, null, 2),
                    );
                    if (deleteUDTresponse) {
                        console.info('UDT delete response exist!');
                        const PPMvalue = ppmValues_content[deleteUDTresponse.MainKey];
                        expect(deleteUDTresponse).to.deep.include({
                            MapDataExternalID: udtFirstTableName,
                            SecondaryKey: null,
                            Values: [PPMvalue],
                        });
                        expect(deleteUDTresponse).to.have.property('MainKey');
                        expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
                        expect(deleteUDTresponse)
                            .to.have.property('ModificationDateTime')
                            .that.contains(new Date().toISOString().split('T')[0]);
                        expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
                        expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
                        expect(deleteUDTresponse).to.have.property('InternalID');
                    }
                });
            });

            it(`validating "${udtFirstTableName}" UDT length after deletion via API`, async () => {
                ppmValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtFirstTableName}'`,
                    page_size: -1,
                });
                expect(ppmValuesEnd.length).equals(pricingRules.dummyPPM_Values_length);
            });
        });

        describe(`UDT: "${udtSecondTableName}" cleanup`, () => {
            it('getting data object according to installed version', async function () {
                switch (installedPricingVersionShort) {
                    case '8':
                        console.info('AT installedPricingVersion CASE 8');
                        ppmAccountValues_content =
                            specialVersion === 'version08for07data'
                                ? pricingRules[udtSecondTableName].features07
                                : pricingRules[udtSecondTableName].features08;
                        break;

                    default:
                        console.info('AT installedPricingVersion Default');
                        ppmAccountValues_content = pricingRules[udtSecondTableName].features07;
                        break;
                }
                addContext(this, {
                    title: `ppmAccountValues_content.length`,
                    value: ppmAccountValues_content.length,
                });
            });

            it(`retrieving "${udtSecondTableName}" UDT values via API`, async function () {
                ppmAccountValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtSecondTableName}'`,
                    page_size: -1,
                });
                addContext(this, {
                    title: `ppmAccountValuesEnd.length`,
                    value: ppmAccountValuesEnd.length,
                });
            });

            it(`deleting valid rules from the UDT "${udtSecondTableName}"`, async function () {
                const valueObjs: UserDefinedTableRow[] = [];
                const validPPM_AccountValuesKeys = Object.keys(ppmAccountValues_content);
                const deleteResponses = await Promise.all(
                    validPPM_AccountValuesKeys.map(async (validPPM_Key) => {
                        const valueObj: UserDefinedTableRow | undefined = ppmAccountValuesEnd.find((listing) => {
                            if (listing.MainKey === validPPM_Key) return listing;
                        });
                        console.info(
                            'validPPM_Key:',
                            validPPM_Key,
                            ', validPPM_ValueObj: ',
                            JSON.stringify(valueObj, null, 2),
                        );
                        if (valueObj) {
                            console.info(`valueObj for key "${validPPM_Key}" EXIST!`);
                            valueObj.Hidden = true;
                            valueObjs.push(valueObj);
                            const deleteResponse = await objectsService.postUDT(valueObj);
                            addContext(this, {
                                title: `key "${validPPM_Key}" EXIST in UDT`,
                                value: deleteResponse,
                            });
                            return deleteResponse;
                        }
                    }),
                );
                valueObjs.length && expect(valueObjs.length).equals(validPPM_AccountValuesKeys.length);
                deleteResponses.forEach((deleteUDTresponse) => {
                    console.info(
                        `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                        JSON.stringify(deleteUDTresponse, null, 2),
                    );
                    if (deleteUDTresponse) {
                        console.info('UDT delete response exist!');
                        const PPMvalue = ppmAccountValues_content[deleteUDTresponse.MainKey];
                        expect(deleteUDTresponse).to.deep.include({
                            MapDataExternalID: udtSecondTableName,
                            SecondaryKey: null,
                            Values: [PPMvalue],
                        });
                        expect(deleteUDTresponse).to.have.property('MainKey');
                        expect(deleteUDTresponse).to.have.property('CreationDateTime').that.contains('Z');
                        expect(deleteUDTresponse)
                            .to.have.property('ModificationDateTime')
                            .that.contains(new Date().toISOString().split('T')[0]);
                        expect(deleteUDTresponse).to.have.property('ModificationDateTime').that.contains('Z');
                        expect(deleteUDTresponse).to.have.property('Hidden').that.is.true;
                        expect(deleteUDTresponse).to.have.property('InternalID');
                    }
                });
            });

            it(`validating "${udtSecondTableName}" UDT length after deletion via API`, async () => {
                ppmAccountValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtSecondTableName}'`,
                    page_size: -1,
                });
                expect(ppmAccountValuesEnd.length).equals(pricingRules.dummyPPM_AccountValues_length);
            });
        });
    });
}
