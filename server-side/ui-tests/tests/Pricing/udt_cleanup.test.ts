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

export async function PricingUdtCleanup(client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingRules = new PricingRules();
    const dateTime = new Date();
    const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    const latestAvailablePricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    const udtFirstTableName = 'PPM_Values';
    const udtSecondTableName = 'PPM_AccountValues';
    const ppmValues_content = {
        ...pricingRules[udtFirstTableName].features05,
        ...pricingRules[udtFirstTableName].features06,
        ...pricingRules[udtFirstTableName].features07,
        ...pricingRules[udtFirstTableName].features08,
    };
    const ppmAccountValues_content = {
        ...pricingRules[udtSecondTableName].features07,
        ...pricingRules[udtSecondTableName].features08,
    };
    let ppmValuesEnd: UserDefinedTableRow[];
    let ppmAccountValuesEnd: UserDefinedTableRow[];

    describe(`UDT Values Deletion - Test Suite - ${
        client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
    } | ${dateTime} | Pricing Version ${latestAvailablePricingVersion}`, () => {
        describe(`UDT: "${udtFirstTableName}" cleanup`, () => {
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
                // valueObjs.length && expect(valueObjs.length).equals(validPPM_ValuesKeys.length);
                deleteResponses.forEach((deleteUDTresponse) => {
                    console.info(
                        `${deleteUDTresponse?.MainKey} Delete RESPONSE: `,
                        JSON.stringify(deleteUDTresponse, null, 2),
                    );
                    if (deleteUDTresponse) {
                        console.info('UDT delete response exist!');
                        const PPMvalue = ppmValues_content[deleteUDTresponse.MainKey];
                        addContext(this, {
                            title: `Expected Rule Value`,
                            value: PPMvalue,
                        });
                        expect(deleteUDTresponse).to.deep.include({
                            MapDataExternalID: udtFirstTableName,
                            SecondaryKey: null,
                            // Values: [PPMvalue],
                        });
                        expect(deleteUDTresponse).to.have.property('MainKey');
                        expect(deleteUDTresponse).to.have.property('Values');
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

            it(`validating "${udtFirstTableName}" UDT length after deletion via API`, async function () {
                ppmValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtFirstTableName}'`,
                    page_size: -1,
                });
                addContext(this, {
                    title: `Expected Length`,
                    value: pricingRules.dummyPPM_Values_length,
                });
                addContext(this, {
                    title: `Actual Length`,
                    value: ppmValuesEnd.length,
                });
                expect(ppmValuesEnd.length).equals(pricingRules.dummyPPM_Values_length);
            });
        });

        describe(`UDT: "${udtSecondTableName}" cleanup`, () => {
            it(`retrieving "${udtSecondTableName}" UDT values via API`, async function () {
                ppmAccountValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtSecondTableName}'`,
                    page_size: -1,
                });
                addContext(this, {
                    title: `ppmAccountValues.length before deletion`,
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
                // valueObjs.length && expect(valueObjs.length).equals(validPPM_AccountValuesKeys.length);
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

            it(`validating "${udtSecondTableName}" UDT length after deletion via API`, async function () {
                ppmAccountValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtSecondTableName}'`,
                    page_size: -1,
                });
                addContext(this, {
                    title: `Expected Length`,
                    value: pricingRules.dummyPPM_AccountValues_length,
                });
                addContext(this, {
                    title: `Actual Length`,
                    value: ppmAccountValuesEnd.length,
                });
                expect(ppmAccountValuesEnd.length).equals(pricingRules.dummyPPM_AccountValues_length);
            });
        });
    });
}
