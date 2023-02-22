import { describe, it, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { Browser } from '../utilities/browser';
import {
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    // WebAppSettingsSidePanel,
    WebAppTopBar,
} from '../pom';
import { ObjectsService } from '../../services';
import { OrderPage } from '../pom/Pages/OrderPage';
import { Key } from 'selenium-webdriver';

interface PriceTsaFields {
    PriceBaseUnitPriceAfter1: number;
    PriceDiscountUnitPriceAfter1: number;
    PriceGroupDiscountUnitPriceAfter1: number;
    PriceManualLineUnitPriceAfter1: number;
    PriceTaxUnitPriceAfter1: number;
    NPMCalcMessage: [any];
}

chai.use(promised);

export async function PricingTests(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);

    let driver: Browser;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    // let settingsSidePanel: WebAppSettingsSidePanel;
    let orderPage: OrderPage;
    // let batchUDTresponse;
    // let transactionUUID_Acc01: string;
    // let transactionUUID_OtherAcc: string;

    const testAccounts = ['Acc01', 'OtherAcc'];
    const testStates = ['baseline', '1unit', '3units', '6units', '24units'];
    const testItems = ['Lipstick no.1', 'MakeUp019', 'Frag005', 'Frag012', 'ToBr56', 'Drug0001', 'Drug0003'];
    const testItemsData_PPM_Values = {
        'Lipstick no.1': {
            ItemPrice: 27.75,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
                OtherAcc: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
                OtherAcc: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
                OtherAcc: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
                OtherAcc: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
                OtherAcc: { baseline: 27.75, '1unit': 27.75, '3units': 27.75, '6units': 27.75, '24units': 27.75 },
            },
        },
        MakeUp019: {
            ItemPrice: 15.95,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
                OtherAcc: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
                OtherAcc: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
                OtherAcc: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
                OtherAcc: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
                OtherAcc: { baseline: 15.95, '1unit': 15.95, '3units': 15.95, '6units': 15.95, '24units': 15.95 },
            },
        },
        Frag005: {
            ItemPrice: 26.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A002@Acc01@Frag005': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A002', [[0, 'S', 10, 'P']]],
                            ],
                        },
                        {
                            'MTAX@A002@Acc01@Frag005': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'MTAX_A002', [[0, 'I', 17, '%']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '6units': 10, '24units': 10 },
                OtherAcc: { baseline: 26.25, '1unit': 26.25, '3units': 26.25, '6units': 26.25, '24units': 26.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '6units': 10, '24units': 10 },
                OtherAcc: { baseline: 26.25, '1unit': 26.25, '3units': 26.25, '6units': 26.25, '24units': 26.25 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '6units': 10, '24units': 10 },
                OtherAcc: { baseline: 26.25, '1unit': 26.25, '3units': 26.25, '6units': 26.25, '24units': 26.25 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '6units': 10, '24units': 10 },
                OtherAcc: { baseline: 26.25, '1unit': 26.25, '3units': 26.25, '6units': 26.25, '24units': 26.25 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 11.7, '1unit': 11.7, '3units': 11.7, '6units': 11.7, '24units': 11.7 },
                OtherAcc: { baseline: 26.25, '1unit': 26.25, '3units': 26.25, '6units': 26.25, '24units': 26.25 },
            },
            //{ "Name": "Base", "Base": 0, "Conditions": [{ "Name": "ZBASE_A002", "Type": "S", "Value": 10, "Amount": 0 }], "New": 0, "Amount": 0 },
            //{ "Name": "Tax", "Base": 0, "Conditions": [{ "Name": "MTAX_A002", "Type": "%", "Value": 17, "Amount": 0 }], "New": 0, "Amount": 0 }
        },
        Frag012: {
            ItemPrice: 33.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A001@Frag012': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A002', [[0, 'S', 20, 'P']]],
                            ],
                        },
                        {
                            'MTAX@A002@Acc01@Frag012': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'MTAX_A002', [[0, 'I', 17, '%']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [
                        {
                            'ZBASE@A001@Frag012': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A002', [[0, 'S', 20, 'P']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 23.4, '1unit': 23.4, '3units': 23.4, '6units': 23.4, '24units': 23.4 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '6units': 20, '24units': 20 },
            },
        },
        ToBr56: {
            ItemPrice: 29.5,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A002@Acc01@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A002', [[0, 'S', 22, 'P']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '6units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '24units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [
                        {
                            'ZBASE@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A002', [[0, 'S', 50, 'P']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '6units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '24units': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 22, '6units': 22, '24units': 22 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 50, '6units': 50, '24units': 50 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '6units': 17.6, '24units': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '6units': 40, '24units': 40 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 22, '6units': 22, '24units': 22 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 50, '6units': 50, '24units': 50 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '6units': 17.6, '24units': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '6units': 40, '24units': 40 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '6units': 17.6, '24units': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '6units': 40, '24units': 40 },
            },
        },
        Drug0001: {
            // Pharmacy Category
            ItemPrice: 30.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A003@Acc01@Pharmacy': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A003', [[0, 'S', 30, 'P']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 30.25, '1unit': 30.25, '3units': 30.25, '6units': 30.25, '24units': 30.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 30.25, '1unit': 30.25, '3units': 30.25, '6units': 30.25, '24units': 30.25 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 30.25, '1unit': 30.25, '3units': 30.25, '6units': 30.25, '24units': 30.25 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 30.25, '1unit': 30.25, '3units': 30.25, '6units': 30.25, '24units': 30.25 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 30.25, '1unit': 30.25, '3units': 30.25, '6units': 30.25, '24units': 30.25 },
            },
        },
        Drug0003: {
            // Pharmacy Category
            ItemPrice: 32.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A003@Acc01@Pharmacy': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A003', [[0, 'S', 30, 'P']]],
                            ],
                        },
                    ],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '6units': [],
                    '24units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 32.25, '1unit': 32.25, '3units': 32.25, '6units': 32.25, '24units': 32.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 32.25, '1unit': 32.25, '3units': 32.25, '6units': 32.25, '24units': 32.25 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 32.25, '1unit': 32.25, '3units': 32.25, '6units': 32.25, '24units': 32.25 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 32.25, '1unit': 32.25, '3units': 32.25, '6units': 32.25, '24units': 32.25 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '6units': 30, '24units': 30 },
                OtherAcc: { baseline: 32.25, '1unit': 32.25, '3units': 32.25, '6units': 32.25, '24units': 32.25 },
            },
        },
    };

    describe('Pricing Test Suite', async () => {
        describe('Pricing UI tests', () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                webAppTopBar = new WebAppTopBar(driver);
                webAppDialog = new WebAppDialog(driver);
                // settingsSidePanel = new WebAppSettingsSidePanel(driver);
                orderPage = new OrderPage(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async () => {
                await webAppLoginPage.login(email, password);
            });

            describe('Sales Order Transaction', () => {
                it('Get UDT Values (PPM_Values)', async () => {
                    const ppmValues = await objectsService.getUDT({ where: 'MapDataExternalID="PPM_Values"' });
                    console.info('PPM_Values: ', ppmValues);
                });
                // it('Data Prep (inserting rules to UDT PPM_Values)', async () => {
                //     const dataToBatch = [
                //         {
                //             MapDataExternalID: 'PPM_Values',
                //             MainKey: 'MTAX@A002@Pharmacy',
                //             SecondaryKey: '',
                //             Values: ['[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]'],
                //         },
                //         // {
                //         //     MapDataExternalID: 'PPM_Values',
                //         //     MainKey: 'batch API Test row 2',
                //         //     SecondaryKey: '',
                //         //     Values: ['Api Test value 2'],
                //         // },
                //         // {
                //         //     MapDataExternalID: 'PPM_Values',
                //         //     MainKey: 'batch API Test row 3',
                //         //     SecondaryKey: '',
                //         //     Values: ['Api Test value 3'],
                //         // },
                //         // {
                //         //     MapDataExternalID: 'PPM_Values',
                //         //     MainKey: 'batch API Test row 4',
                //         //     SecondaryKey: '',
                //         //     Values: ['Api Test value 4'],
                //         // },
                //     ];
                //     batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
                //     expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
                //     batchUDTresponse.map((row) => {
                //         expect(row).to.have.property('InternalID').that.is.above(0);
                //         expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                //         expect(row).to.have.property('Status').that.equals('Insert');
                //         expect(row).to.have.property('Message').that.equals('Row inserted.');
                //         expect(row)
                //             .to.have.property('URI')
                //             .that.equals('/user_defined_tables/' + row.InternalID);
                //     });
                //     await webAppHeader.goHome();
                //     await webAppHomePage.isSpinnerDone();
                //     await webAppHeader.openSettings();
                //     await webAppHeader.isSpinnerDone();
                //     driver.sleep(0.5 * 1000);
                //     await settingsSidePanel.selectSettingsByID('Configuration');
                //     await settingsSidePanel.clickSettingsSubCategory('user_defined_tables', 'Configuration');
                //     await webAppHeader.isSpinnerDone();
                //     driver.sleep(10 * 1000);
                // });
                testAccounts.forEach((account) => {
                    describe(`Account "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, () => {
                        it('Creating new transaction', async () => {
                            if (account === 'Acc01') {
                                // transactionUUID_Acc01 = await startNewSalesOrderTransaction('My Store');
                                await startNewSalesOrderTransaction('My Store');
                            }
                            if (account === 'OtherAcc') {
                                // transactionUUID_OtherAcc = await startNewSalesOrderTransaction(
                                await startNewSalesOrderTransaction('Account for order scenarios');
                            }
                        });
                        testItems.forEach((item) => {
                            describe(`Item "${item}"`, () => {
                                it(`Search for "${item}" in Order Center`, async () => {
                                    await searchInOrderCenter(item);
                                });

                                testStates.forEach((state) => {
                                    it(`Test State "${state}"`, async () => {
                                        switch (
                                            state //'baseline', '1unit', '3units', '6units', '24units'
                                        ) {
                                            case '1unit':
                                                await changeSelectedQuantityOfSpecificItem('Each', item, 1);
                                                break;
                                            case '3units':
                                                await changeSelectedQuantityOfSpecificItem('Each', item, 3);
                                                break;
                                            case '6units':
                                                await changeSelectedQuantityOfSpecificItem('Case', item, 1);
                                                break;
                                            case '24units':
                                                await changeSelectedQuantityOfSpecificItem('Case', item, 4);
                                                break;

                                            default:
                                                break;
                                        }
                                        const priceTSAs = await getItemTSAs(item);
                                        console.info(`${item} ${state} priceTSAs:`, priceTSAs);

                                        expect(typeof priceTSAs).equals('object');
                                        expect(Object.keys(priceTSAs)).to.eql([
                                            'PriceBaseUnitPriceAfter1',
                                            'PriceDiscountUnitPriceAfter1',
                                            'PriceGroupDiscountUnitPriceAfter1',
                                            'PriceManualLineUnitPriceAfter1',
                                            'PriceTaxUnitPriceAfter1',
                                            'NPMCalcMessage',
                                        ]);
                                        if (state === 'baseline') {
                                            expect(priceTSAs['NPMCalcMessage'].length).equals(
                                                testItemsData_PPM_Values[item]['NPMCalcMessage'][account][state].length,
                                            );
                                        } else {
                                            expect(priceTSAs['NPMCalcMessage'].length).equals(
                                                testItemsData_PPM_Values[item]['NPMCalcMessage'][account]['baseline']
                                                    .length +
                                                    testItemsData_PPM_Values[item]['NPMCalcMessage'][account][state]
                                                        .length,
                                            );
                                        }
                                        const priceFieldKeys = [
                                            'PriceBaseUnitPriceAfter1',
                                            'PriceDiscountUnitPriceAfter1',
                                            'PriceGroupDiscountUnitPriceAfter1',
                                            'PriceManualLineUnitPriceAfter1',
                                            'PriceTaxUnitPriceAfter1',
                                        ];
                                        priceFieldKeys.forEach((priceField) => {
                                            expect(priceTSAs[priceField]).equals(
                                                testItemsData_PPM_Values[item][priceField][account][state],
                                            );
                                        });
                                        driver.sleep(2 * 1000);
                                    });
                                });
                                describe('Clear Order Center Search', () => {
                                    it(`Completed test of "${item}" under "${
                                        account == 'Acc01' ? 'My Store' : 'Account for order scenarios'
                                    }"`, async () => {
                                        await clearOrderCenterSearch();
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('Cleanup', () => {
                it('Deleting all Activities', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Activities');
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.5 * 1000);
                    try {
                        await webAppList.checkAllListElements();
                        driver.sleep(0.5 * 1000);
                        await webAppList.clickOnPencilMenuButton();
                        driver.sleep(0.5 * 1000);
                        await webAppList.selectUnderPencilMenu('Delete');
                        driver.sleep(0.5 * 1000);
                        await driver.untilIsVisible(webAppDialog.ButtonArr);
                        driver.sleep(0.5 * 1000);
                        await webAppDialog.selectDialogBoxByText('Delete');
                        await webAppDialog.isSpinnerDone();
                        driver.sleep(2 * 1000);
                        await webAppHeader.goHome();
                        await webAppHomePage.isSpinnerDone();
                    } catch (error) {
                        console.error(error);
                        if (await driver.untilIsVisible(webAppList.NoActivitiesFound_Text)) {
                            console.info('List is EMPTY - no activities found');
                        }
                    }
                });
            });
        });
    });

    async function startNewSalesOrderTransaction(nameOfAccount: string): Promise<string> {
        await webAppHeader.goHome();
        await webAppHomePage.isSpinnerDone();
        await webAppHomePage.click(webAppHomePage.MainHomePageBtn);
        driver.sleep(1 * 1000);
        await webAppHeader.isSpinnerDone();
        await webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
        driver.sleep(0.5 * 1000);
        await webAppHeader.click(webAppTopBar.DoneBtn);
        await webAppHeader.isSpinnerDone();
        if (await webAppHeader.safeUntilIsVisible(webAppDialog.Dialog, 5000)) {
            driver.sleep(0.5 * 1000);
            await webAppDialog.selectDialogBoxBeforeNewOrder();
        }
        driver.sleep(0.5 * 1000);
        await webAppHeader.isSpinnerDone();
        await driver.untilIsVisible(orderPage.Cart_Button);
        const trnUUID = await (await driver.findElement(orderPage.TransactionUUID)).getText();
        driver.sleep(0.5 * 1000);
        return trnUUID;
    }

    async function getItemTSAs(nameOfItem: string): Promise<PriceTsaFields> {
        const PriceBaseUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceBaseUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceBaseUnitPriceAfter1_Value = await (
            await driver.findElement(PriceBaseUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);
        const PriceDiscountUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceDiscountUnitPriceAfter1_Value = await (
            await driver.findElement(PriceDiscountUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter1_Value: `, PriceDiscountUnitPriceAfter1_Value);
        const PriceGroupDiscountUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceGroupDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceGroupDiscountUnitPriceAfter1_Value = await (
            await driver.findElement(PriceGroupDiscountUnitPriceAfter1_Selector)
        ).getText();
        console.info(
            `${nameOfItem} PriceGroupDiscountUnitPriceAfter1_Value: `,
            PriceGroupDiscountUnitPriceAfter1_Value,
        );
        const PriceManualLineUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceManualLineUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceManualLineUnitPriceAfter1_Value = await (
            await driver.findElement(PriceManualLineUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceManualLineUnitPriceAfter1_Value: `, PriceManualLineUnitPriceAfter1_Value);
        const PriceTaxUnitPriceAfter1_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceTaxUnitPriceAfter1_Value = await (
            await driver.findElement(PriceTaxUnitPriceAfter1_Selector)
        ).getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter1_Value: `, PriceTaxUnitPriceAfter1_Value);
        const NPMCalcMessage_Selector = orderPage.getSelectorOfCustomFieldByItemName(
            'NPMCalcMessage_Value',
            nameOfItem,
        );
        const NPMCalcMessage_Value = await (await driver.findElement(NPMCalcMessage_Selector)).getText();
        console.info(`${nameOfItem} NPMCalcMessage_Value: `, NPMCalcMessage_Value);
        driver.sleep(1.5 * 1000);
        return {
            PriceBaseUnitPriceAfter1: Number(PriceBaseUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceDiscountUnitPriceAfter1: Number(PriceDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceGroupDiscountUnitPriceAfter1: Number(PriceGroupDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceManualLineUnitPriceAfter1: Number(PriceManualLineUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceTaxUnitPriceAfter1: Number(PriceTaxUnitPriceAfter1_Value.split(' ')[1].trim()),
            NPMCalcMessage: JSON.parse(NPMCalcMessage_Value),
        };
    }

    async function searchInOrderCenter(nameOfItem: string): Promise<void> {
        const searchInput = await driver.findElement(orderPage.Search_Input);
        await searchInput.clear();
        driver.sleep(0.25 * 1000);
        await searchInput.sendKeys(nameOfItem);
        await orderPage.isSpinnerDone();
        await driver.click(orderPage.Search_Magnifier_Button);
        await orderPage.isSpinnerDone();
        await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
    }

    async function changeSelectedQuantityOfSpecificItem(
        uomValue: 'Each' | 'Case',
        nameOfItem: string,
        quantityOfItem: number,
    ): Promise<void> {
        const itemContainer = await driver.findElement(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
        driver.sleep(0.25 * 1000);
        let itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        if ((await itemUomValue.getText()) !== uomValue) {
            await driver.click(orderPage.UnitOfMeasure_Selector_Value);
            driver.sleep(0.5 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(1 * 1000);
            await itemContainer.click();
            driver.sleep(1.5 * 1000);
            itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        }
        driver.sleep(0.25 * 1000);
        expect(await itemUomValue.getText()).equals(uomValue);
        const uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldByItemName('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        await itemContainer.click();
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.1 * 1000);
        }
        driver.sleep(0.25 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        driver.sleep(0.25 * 1000);
        await itemContainer.click();
        driver.sleep(0.5 * 1000);
        const numberByUOM = await uomXnumber.getAttribute('title');
        expect(Number(numberByUOM)).equals(quantityOfItem);
        driver.sleep(1 * 1000);
        const numberOfUnits = await (
            await driver.findElement(orderPage.ItemQuantity_NumberOfUnits_Readonly)
        ).getAttribute('title');
        driver.sleep(0.5 * 1000);
        switch (uomValue) {
            case 'Each':
                expect(numberOfUnits).equals(numberByUOM);
                break;
            case 'Case':
                expect(Number(numberOfUnits)).equals(Number(numberByUOM) * 6);
                break;
            default:
                break;
        }
        driver.sleep(0.25 * 1000);
        await itemContainer.click();
    }

    async function clearOrderCenterSearch(): Promise<void> {
        await driver.click(orderPage.Search_X_Button);
        driver.sleep(0.1 * 1000);
        await orderPage.isSpinnerDone();
    }
}
