import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import { ObjectsService } from '../../../services';
import GeneralService from '../../../services/general.service';
import PricingRules from '../../pom/addons/PricingRules';
import addContext from 'mochawesome/addContext';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import { Browser } from '../../utilities/browser';
import E2EUtils from '../../utilities/e2e_utils';
import { WebAppLoginPage } from '../../pom';

chai.use(promised);

export async function PricingUdtInsertion(
    client: Client,
    email: string,
    password: string,
    testingFeatures: '0.5' | '0.6' | '0.7' | '0.8' | '1.0',
    specialVersion: 'version07for05data' | 'version08for07data' | 'noUom' | undefined = undefined,
) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingRules = new PricingRules();
    // const allInstalledAddons = await generalService.getInstalledAddons({ page_size: -1 });
    // const installedPricingVersion = allInstalledAddons.find((addon) => addon.Addon.Name == 'Pricing')?.Version;
    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    const udtFirstTableName = 'PPM_Values';
    const udtSecondTableName = 'PPM_AccountValues';
    const ppmValuesDataToBatch: {
        MapDataExternalID: string;
        MainKey: string;
        SecondaryKey: string;
        Values: string[];
    }[] = [];
    const ppmAccountValuesDataToBatch: {
        MapDataExternalID: string;
        MainKey: string;
        SecondaryKey: string;
        Values: string[];
    }[] = [];
    let ppmValuesEnd: UserDefinedTableRow[];
    let ppmAccountValuesEnd: UserDefinedTableRow[];
    let batchUDTresponse: any;
    let ppmValues_content;
    let ppmAccountValues_content;
    let driver: Browser;
    let e2eUtils: E2EUtils;
    let webAppLoginPage: WebAppLoginPage;
    let screenShot;

    describe('UDT Upsert - Test Suite', () => {
        describe(`UDT: "${udtFirstTableName}" insertion`, () => {
            specialVersion === undefined &&
                it('getting data object according to installed version', async function () {
                    switch (testingFeatures) {
                        case '0.5':
                            console.info('AT testingFeatures for ppmValues_content CASE 0.5');
                            ppmValues_content = pricingRules[udtFirstTableName].features05;
                            break;

                        case '0.6':
                            console.info('AT testingFeatures for ppmValues_content CASE 0.6');
                            ppmValues_content = {
                                ...pricingRules[udtFirstTableName].features05,
                                ...pricingRules[udtFirstTableName].features06,
                            };
                            break;

                        case '0.7':
                            console.info('AT testingFeatures for ppmValues_content CASE 0.7');
                            ppmValues_content = {
                                ...pricingRules[udtFirstTableName].features05,
                                ...pricingRules[udtFirstTableName].features06,
                                ...pricingRules[udtFirstTableName].features07,
                            };
                            break;

                        case '0.8':
                            console.info('AT testingFeatures for ppmValues_content CASE 0.8');
                            ppmValues_content = pricingRules[udtFirstTableName].features08;
                            break;

                        default:
                            console.info('AT testingFeatures for ppmValues_content Default');
                            ppmValues_content = {
                                ...pricingRules[udtFirstTableName].features05,
                                ...pricingRules[udtFirstTableName].features06,
                                ...pricingRules[udtFirstTableName].features07,
                                ...pricingRules[udtFirstTableName].features08,
                            };
                            break;
                    }
                    addContext(this, {
                        title: `ppmValues_content length`,
                        value: Object.keys(ppmValues_content).length,
                    });
                    addContext(this, {
                        title: `ppmValues_content`,
                        value: JSON.stringify(ppmValues_content, null, 2),
                    });
                });

            specialVersion &&
                it('getting data object according to special version', async function () {
                    switch (specialVersion) {
                        case 'version07for05data':
                            pricingRules[udtFirstTableName].features05;
                            break;

                        case 'version08for07data':
                            ppmValues_content = {
                                ...pricingRules[udtFirstTableName].features05,
                                ...pricingRules[udtFirstTableName].features06,
                                ...pricingRules[udtFirstTableName].features07,
                            };
                            break;

                        case 'noUom':
                            switch (testingFeatures) {
                                case '0.5':
                                    console.info('AT CASE 0.5 of testingFeatures for ppmValues_content NO UOM');
                                    ppmValues_content = pricingRules[udtFirstTableName].features05noUom;
                                    break;

                                case '0.6':
                                    console.info('AT CASE 0.6 of testingFeatures for ppmValues_content NO UOM');
                                    ppmValues_content = {
                                        ...pricingRules[udtFirstTableName].features05noUom,
                                        ...pricingRules[udtFirstTableName].features06noUom,
                                    };
                                    break;

                                case '0.7':
                                    console.info('AT CASE 0.7 of testingFeatures for ppmValues_content NO UOM');
                                    ppmValues_content = {
                                        ...pricingRules[udtFirstTableName].features05noUom,
                                        ...pricingRules[udtFirstTableName].features06noUom,
                                        ...pricingRules[udtFirstTableName].features07,
                                    };
                                    break;

                                case '0.8':
                                    console.info('AT CASE 0.8 of testingFeatures for ppmValues_content NO UOM');
                                    ppmValues_content = pricingRules[udtFirstTableName].features08noUom;
                                    break;

                                default:
                                    break;
                            }
                            break;

                        default:
                            break;
                    }
                    addContext(this, {
                        title: `ppmValues_content length`,
                        value: Object.keys(ppmValues_content).length,
                    });
                    addContext(this, {
                        title: `ppmValues_content`,
                        value: JSON.stringify(ppmValues_content, null, 2),
                    });
                });

            it(`inserting valid rules to the UDT "${udtFirstTableName}"`, async function () {
                Object.keys(ppmValues_content).forEach((mainKey) => {
                    ppmValuesDataToBatch.push({
                        MapDataExternalID: udtFirstTableName,
                        MainKey: mainKey,
                        SecondaryKey: '',
                        Values: [ppmValues_content[mainKey]],
                    });
                });
                addContext(this, {
                    title: `ppmValuesDataToBatch`,
                    value: JSON.stringify(ppmValuesDataToBatch, null, 2),
                });
                batchUDTresponse = await objectsService.postBatchUDT(ppmValuesDataToBatch);
                expect(batchUDTresponse).to.be.an('array').with.lengthOf(ppmValuesDataToBatch.length);
                console.info(`insertion to ${udtFirstTableName} RESPONSE: `, JSON.stringify(batchUDTresponse, null, 2));
                batchUDTresponse.map((row) => {
                    expect(row).to.have.property('InternalID').that.is.above(0);
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
                addContext(this, {
                    title: `batchUDTresponse length`,
                    value: batchUDTresponse.length,
                });
                addContext(this, {
                    title: `batchUDTresponse`,
                    value: JSON.stringify(batchUDTresponse, null, 2),
                });
            });

            it(`validating "${udtFirstTableName}" UDT length after insertion via API`, async () => {
                ppmValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtFirstTableName}'`,
                    page_size: -1,
                });
                expect(ppmValuesEnd.length).equals(ppmValuesDataToBatch.length + pricingRules.dummyPPM_Values_length);
            });
        });

        describe(`UDT: "${udtSecondTableName}" insertion`, () => {
            specialVersion === undefined &&
                it('getting data object according to installed version', async function () {
                    switch (testingFeatures) {
                        case '0.7':
                            console.info('AT testingFeatures for ppmAccountValues_content CASE 0.7');
                            ppmAccountValues_content = pricingRules[udtSecondTableName].features07;
                            break;

                        case '0.8':
                            console.info('AT testingFeatures for ppmAccountValues_content CASE 0.8');
                            ppmAccountValues_content = pricingRules[udtSecondTableName].features08;
                            break;

                        default:
                            console.info('AT testingFeatures for ppmAccountValues_content Default');
                            ppmAccountValues_content = {};
                            break;
                    }
                    addContext(this, {
                        title: `ppmAccountValues_content length`,
                        value: Object.keys(ppmAccountValues_content).length,
                    });
                    addContext(this, {
                        title: `ppmAccountValues_content`,
                        value: JSON.stringify(ppmAccountValues_content, null, 2),
                    });
                });

            specialVersion &&
                it('getting data object according to special version', async function () {
                    switch (specialVersion) {
                        case 'noUom':
                            switch (testingFeatures) {
                                case '0.7':
                                    console.info('AT CASE 0.7 of testingFeatures for ppmAccountValues_content NO UOM');
                                    ppmAccountValues_content = pricingRules[udtSecondTableName].features07noUom;
                                    break;

                                case '0.8':
                                    console.info('AT CASE 0.8 of testingFeatures for ppmAccountValues_content NO UOM');
                                    ppmAccountValues_content = pricingRules[udtSecondTableName].features08noUom;
                                    break;

                                default:
                                    console.info('AT testingFeatures for ppmAccountValues_content NO UOM Default');
                                    ppmAccountValues_content = {};
                                    break;
                            }
                            break;

                        default:
                            break;
                    }
                    addContext(this, {
                        title: `ppmAccountValues_content NO UOM length`,
                        value: Object.keys(ppmAccountValues_content).length,
                    });
                    addContext(this, {
                        title: `ppmAccountValues_content NO UOM`,
                        value: JSON.stringify(ppmAccountValues_content, null, 2),
                    });
                });

            it(`inserting valid rules to the UDT "${udtSecondTableName}"`, async function () {
                Object.keys(ppmAccountValues_content).forEach((mainKey) => {
                    ppmAccountValuesDataToBatch.push({
                        MapDataExternalID: udtSecondTableName,
                        MainKey: mainKey,
                        SecondaryKey: '',
                        Values: [ppmAccountValues_content[mainKey]],
                    });
                });
                batchUDTresponse = await objectsService.postBatchUDT(ppmAccountValuesDataToBatch);
                expect(batchUDTresponse).to.be.an('array').with.lengthOf(ppmAccountValuesDataToBatch.length);
                console.info(
                    `insertion to ${udtSecondTableName} RESPONSE: `,
                    JSON.stringify(batchUDTresponse, null, 2),
                );
                batchUDTresponse.map((row) => {
                    expect(row).to.have.property('InternalID').that.is.above(0);
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
                addContext(this, {
                    title: `batchUDTresponse length`,
                    value: batchUDTresponse.length,
                });
                addContext(this, {
                    title: `batchUDTresponse`,
                    value: JSON.stringify(batchUDTresponse, null, 2),
                });
            });

            it(`validating "${udtSecondTableName}" UDT length after insertion via API`, async () => {
                ppmAccountValuesEnd = await objectsService.getUDT({
                    where: `MapDataExternalID='${udtSecondTableName}'`,
                    page_size: -1,
                });
                expect(ppmAccountValuesEnd.length).equals(
                    ppmAccountValuesDataToBatch.length + pricingRules.dummyPPM_AccountValues_length,
                );
            });
        });

        describe(`Login to Pricing Test User after UDT Values Upload`, () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                e2eUtils = new E2EUtils(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Manual Resync', async function () {
                await e2eUtils.performManualResync.bind(this)(client, driver);
            });

            it('Logout', async function () {
                await webAppLoginPage.logout();
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `Logged out`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });
        });
    });
}
