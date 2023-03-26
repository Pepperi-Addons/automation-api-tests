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
    let batchUDTresponse;
    let transactionID: number;
    let transactionUUID: string;
    let transactionUUID_Acc01: string;
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let Acc01TransactionByUUID;
    let transactionInternalID;
    let initialPpmValues;
    let updatedUDTRowPOST;
    let item_forFreeGoods: string;
    let item_forGroupRules: string;
    let ToBr55priceTSAs_OC: PriceTsaFields;
    let Drug0002priceTSAs_OC: PriceTsaFields;
    let Drug0004priceTSAs_OC: PriceTsaFields;

    // const testAccounts = ['Acc01'];
    const testAccounts = ['Acc01', 'OtherAcc'];
    // const testStates = ['baseline', '3units', '4cases(24units)'];
    const testStates = ['baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'];
    // const testItems = ['Lipstick no.1', 'Spring Loaded Frizz-Fighting Conditioner', 'Frag005'];
    const testItems = [
        'Lipstick no.1',
        'Spring Loaded Frizz-Fighting Conditioner',
        'Frag005',
        'Frag012',
        'ToBr56',
        'Drug0001',
        'Drug0003',
    ];
    const itemsAddedToGetFreeGoods = ['ToBr55', 'Drug0002', 'Drug0004'];
    const freeGoodsReceived = {
        Acc01: [
            { ToBr55_5units: { freeItem: 'ToBr10', amount: 1 }, ToBr55_20units: { freeItem: 'ToBr55', amount: 1 * 6 } },
            { Drug0002_10cases: { freeItem: 'Drug0002', amount: 2 * 6 } },
            { Drug0004_3cases: { freeItem: 'Drug0002', amount: 2 } },
        ],
        OtherAcc: [
            { Drug0002_10cases: { freeItem: 'Drug0002', amount: 2 * 6 } },
            { Drug0004_3cases: { freeItem: 'Drug0002', amount: 2 } },
        ],
    };
    const priceFields = [
        'PriceBaseUnitPriceAfter1',
        'PriceDiscountUnitPriceAfter1',
        'PriceGroupDiscountUnitPriceAfter1',
        'PriceManualLineUnitPriceAfter1',
        'PriceTaxUnitPriceAfter1',
    ];
    const documentsIn_PPM_Values = {
        'ZBASE@A002@Acc01@Frag005': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
        'ZBASE@A002@Acc01@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",22,"P"]]]]',
        'ZBASE@A001@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",50,"P"]]]]',
        'ZBASE@A001@Frag012': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",20,"P"]]]]',
        'ZBASE@A003@Acc01@Pharmacy': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",30,"P"]]]]',
        'ZDS1@A001@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]',
        'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner':
            '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",5,"%"],[5,"D",10,"%"],[20,"D",15,"%"]]]]',
        'ZDS2@A002@Acc01@ToBr55':
            '[[true,"1555891200000","2534022144999","1","","Free Goods",[[5,"D",100,"%","",1,"EA","ToBr10",0],[20,"D",100,"%","",1,"CS","ToBr55",0]],"EA"]]',
        'ZDS3@A001@Drug0002':
            '[[true,"1555891200000","2534022144999","1","","additionalItem",[[10,"D",100,"%","",2,"CS","Drug0002",0]],"CS"]]',
        'ZDS3@A001@Drug0004':
            '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
        'ZGD1@A002@Acc01@MakeUp003':
            '[[true,"1555891200000","2534022144999","1","","ZGD1_A002",[[10,"D",20,"%"]],"EA"]]',
        'ZGD1@A003@Acc01@Beauty Make Up':
            '[[true,"1555891200000","2534022144999","1","","additionalItem",[[12,"D",100,"%","",1,"EA","MakeUp018",0]],"EA"]]',
        'ZGD2@A002@Acc01@MakeUp018':
            '[[true,"1555891200000","2534022144999","1","","additionalItem",[[2,"D",100,"%","",1,"EA","MakeUp018",0]],"EA"]]',
        'ZGD2@A003@Acc01@Beauty Make Up':
            '[[true,"1555891200000","2534022144999","1","","ZGD2_A003",[[3,"D",3,"%"],[7,"D",7,"%"]],"EA"]]',
        'MTAX@A002@Acc01@Frag005': '[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',
        'MTAX@A002@Acc01@Frag012': '[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',
    };
    const testItemsData_PPM_Values = {
        'Lipstick no.1': {
            ItemPrice: 27.75,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
        },
        'Spring Loaded Frizz-Fighting Conditioner': {
            ItemPrice: 27.0,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '1unit': [],
                    '3units': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                    '1case(6units)': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                    '4cases(24units)': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                    '1case(6units)': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                    '4cases(24units)': [
                        {
                            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '1',
                                    'ZDS1_A001',
                                    [
                                        [2, 'D', 5, '%'],
                                        [5, 'D', 10, '%'],
                                        [20, 'D', 15, '%'],
                                    ],
                                ],
                            ],
                        },
                    ],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
                OtherAcc: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
                OtherAcc: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
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
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '1case(6units)': 10, '4cases(24units)': 10 },
                OtherAcc: {
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '1case(6units)': 10, '4cases(24units)': 10 },
                OtherAcc: {
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '1case(6units)': 10, '4cases(24units)': 10 },
                OtherAcc: {
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 10, '1unit': 10, '3units': 10, '1case(6units)': 10, '4cases(24units)': 10 },
                OtherAcc: {
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 11.7,
                    '1unit': 11.7,
                    '3units': 11.7,
                    '1case(6units)': 11.7,
                    '4cases(24units)': 11.7,
                },
                OtherAcc: {
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
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
                    '1case(6units)': [],
                    '4cases(24units)': [],
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
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 23.4,
                    '1unit': 23.4,
                    '3units': 23.4,
                    '1case(6units)': 23.4,
                    '4cases(24units)': 23.4,
                },
                OtherAcc: { baseline: 20, '1unit': 20, '3units': 20, '1case(6units)': 20, '4cases(24units)': 20 },
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
                    '1case(6units)': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '4cases(24units)': [
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
                    '1case(6units)': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                    '4cases(24units)': [
                        {
                            'ZDS1@A001@ToBr56': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZDS1_A001', [[2, 'D', 20, '%']]],
                            ],
                        },
                    ],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 22, '1case(6units)': 22, '4cases(24units)': 22 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 50, '1case(6units)': 50, '4cases(24units)': 50 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '1case(6units)': 17.6, '4cases(24units)': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '1case(6units)': 40, '4cases(24units)': 40 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 22, '1case(6units)': 22, '4cases(24units)': 22 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 50, '1case(6units)': 50, '4cases(24units)': 50 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '1case(6units)': 17.6, '4cases(24units)': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '1case(6units)': 40, '4cases(24units)': 40 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 22, '1unit': 22, '3units': 17.6, '1case(6units)': 17.6, '4cases(24units)': 17.6 },
                OtherAcc: { baseline: 50, '1unit': 50, '3units': 40, '1case(6units)': 40, '4cases(24units)': 40 },
            },
        },
        Drug0001: {
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
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
        },
        Drug0003: {
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
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1unit': [],
                    '3units': [],
                    '1case(6units)': [],
                    '4cases(24units)': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '1unit': 30, '3units': 30, '1case(6units)': 30, '4cases(24units)': 30 },
                OtherAcc: {
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
        },
        ToBr55: {
            // Additional items rule
            ItemPrice: 29.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '5units': [
                        {
                            'ZDS2@A002@Acc01@ToBr55': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'Free Goods',
                                    [
                                        [5, 'D', 100, '%', '', 1, 'EA', 'ToBr10', 0],
                                        [20, 'D', 100, '%', '', 1, 'CS', 'ToBr55', 0],
                                    ],
                                    'EA',
                                ],
                            ],
                        },
                    ],
                    '20units': [
                        {
                            'ZDS2@A002@Acc01@ToBr55': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'Free Goods',
                                    [
                                        [5, 'D', 100, '%', '', 1, 'EA', 'ToBr10', 0],
                                        [20, 'D', 100, '%', '', 1, 'CS', 'ToBr55', 0],
                                    ],
                                    'EA',
                                ],
                            ],
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '5units': [],
                    '20units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 29.25 },
                OtherAcc: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 29.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
                OtherAcc: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
                OtherAcc: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
                OtherAcc: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
                OtherAcc: { baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 0.0 },
            },
        },
        Drug0002: {
            // Additional items rule
            ItemPrice: 31.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A003@Acc01@Pharmacy': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A003', [[0, 'S', 30, 'P']]],
                            ],
                        },
                    ],
                    '9case(54units)': [],
                    '10cases(60units)': [
                        {
                            'ZDS3@A001@Drug0002': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'additionalItem',
                                    [[10, 'D', 100, '%', '', 2, 'CS', 'Drug0002', 0]],
                                    'CS',
                                ],
                            ],
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '9case(54units)': [],
                    '10cases(60units)': [
                        {
                            'ZDS3@A001@Drug0002': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'additionalItem',
                                    [[10, 'D', 100, '%', '', 2, 'CS', 'Drug0002', 0]],
                                    'CS',
                                ],
                            ],
                        },
                    ],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '9case(54units)': 30, '10cases(60units)': 30, additional: 30 },
                OtherAcc: { baseline: 31.25, '9case(54units)': 31.25, '10cases(60units)': 31.25, additional: 31.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '9case(54units)': 30, '10cases(60units)': 30, additional: 0.0 },
                OtherAcc: { baseline: 31.25, '9case(54units)': 31.25, '10cases(60units)': 31.25, additional: 0.0 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '9case(54units)': 30, '10cases(60units)': 30, additional: 0.0 },
                OtherAcc: { baseline: 31.25, '9case(54units)': 31.25, '10cases(60units)': 31.25, additional: 0.0 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '9case(54units)': 30, '10cases(60units)': 30, additional: 0.0 },
                OtherAcc: { baseline: 31.25, '9case(54units)': 31.25, '10cases(60units)': 31.25, additional: 0.0 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '9case(54units)': 30, '10cases(60units)': 30, additional: 0.0 },
                OtherAcc: { baseline: 31.25, '9case(54units)': 31.25, '10cases(60units)': 31.25, additional: 0.0 },
            },
        },
        Drug0004: {
            // Additional items rule
            ItemPrice: 33.25,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [
                        {
                            'ZBASE@A003@Acc01@Pharmacy': [
                                [true, '1555891200000', '2534022144999', '1', '1', 'ZBASE_A003', [[0, 'S', 30, 'P']]],
                            ],
                        },
                    ],
                    '2case(12units)': [],
                    '3cases(18units)': [
                        {
                            'ZDS3@A001@Drug0004': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'additionalItem',
                                    [[3, 'D', 100, '%', '', 2, 'EA', 'Drug0002', 0]],
                                    'CS',
                                ],
                            ],
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '2case(12units)': [],
                    '3cases(18units)': [
                        {
                            'ZDS3@A001@Drug0004': [
                                [
                                    true,
                                    '1555891200000',
                                    '2534022144999',
                                    '1',
                                    '',
                                    'additionalItem',
                                    [[3, 'D', 100, '%', '', 2, 'EA', 'Drug0002', 0]],
                                    'CS',
                                ],
                            ],
                        },
                    ],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: { baseline: 30, '2case(12units)': 30, '3cases(18units)': 30 },
                OtherAcc: { baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '2case(12units)': 30, '3cases(18units)': 30 },
                OtherAcc: { baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { baseline: 30, '2case(12units)': 30, '3cases(18units)': 30 },
                OtherAcc: { baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { baseline: 30, '2case(12units)': 30, '3cases(18units)': 30 },
                OtherAcc: { baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { baseline: 30, '2case(12units)': 30, '3cases(18units)': 30 },
                OtherAcc: { baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
        },
        ToBr10: {
            // Additional item
            ItemPrice: 28.5,
            PriceBaseUnitPriceAfter1: {
                Acc01: { additional: 28.5 },
                OtherAcc: { additional: 28.5 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { additional: 0.0 },
                OtherAcc: { additional: 0.0 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { additional: 0.0 },
                OtherAcc: { additional: 0.0 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { additional: 0.0 },
                OtherAcc: { additional: 0.0 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { additional: 0.0 },
                OtherAcc: { additional: 0.0 },
            },
        },
        BeautyMakeUp: {
            // Group Rules
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '2unit': [],
                    '3units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 86.25,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -3, Amount: -2.5875 }],
                            New: 83.6625,
                            Amount: -2.5875000000000057,
                        },
                    ],
                    '6units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 172.5,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -3, Amount: -5.175 }],
                            New: 167.325,
                            Amount: -5.175000000000011,
                        },
                    ],
                    '7units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 201.25,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -7, Amount: -14.0875 }],
                            New: 187.1625,
                            Amount: -14.087500000000006,
                        },
                    ],
                    '11units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 316.25,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -7, Amount: -22.1375 }],
                            New: 294.1125,
                            Amount: -22.13749999999999,
                        },
                    ],
                    '12units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 345,
                            Conditions: [{ Name: 'ZGD1_A003', Type: 'additionalItem', Value: 1, Amount: 1 }],
                            New: 345,
                            Amount: 0,
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '2unit': [],
                    '3units': [],
                    '6units': [],
                    '7units': [],
                    '11units': [],
                    '12units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: {
                    baseline: 28.75,
                    '2unit': 28.75,
                    '3units': 28.75,
                    '6units': 28.75,
                    '7units': 28.75,
                    '11units': 28.75,
                    '12units': 28.75,
                },
                OtherAcc: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
        },
        MakeUp003: {
            // Group Rules
            ItemPrice: 30.75,
            NPMCalcMessage: {
                Acc01: {
                    baseline: [],
                    '3unit': [
                        {
                            Name: 'GroupDiscount',
                            Base: 92.25,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -3, Amount: -2.7675 }],
                            New: 89.4825,
                            Amount: -2.7674999999999983,
                        },
                    ],
                    '7units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 215.25,
                            Conditions: [{ Name: 'ZGD2_A003', Type: '%', Value: -7, Amount: -15.0675 }],
                            New: 200.1825,
                            Amount: -15.067499999999995,
                        },
                    ],
                    '10units': [
                        {
                            Name: 'GroupDiscount',
                            Base: 307.5,
                            Conditions: [{ Name: 'ZGD1_A002', Type: '%', Value: -20, Amount: -61.5 }],
                            New: 246,
                            Amount: -61.5,
                        },
                    ],
                },
                OtherAcc: {
                    baseline: [],
                    '3units': [],
                    '7units': [],
                    '10units': [],
                },
            },
            PriceBaseUnitPriceAfter1: {
                Acc01: {
                    baseline: 30.75,
                    '2unit': 30.75,
                    '3units': 30.75,
                    '6units': 30.75,
                    '7units': 30.75,
                    '9units': 30.75,
                    '10units': 30.75,
                    '11units': 30.75,
                    '12units': 30.75,
                },
                OtherAcc: {
                    baseline: 30.75,
                    '2unit': 30.75,
                    '3units': 30.75,
                    '6units': 30.75,
                    '7units': 30.75,
                    '9units': 30.75,
                    '10units': 30.75,
                    '11units': 30.75,
                    '12units': 30.75,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
        },
    };

    describe('Pricing Test Suite', async () => {
        describe('Data Prep', () => {
            it('inserting rules to the UDT "PPM_Values"', async () => {
                const tableName = 'PPM_Values';
                const dataToBatch: {
                    MapDataExternalID: string;
                    MainKey: string;
                    SecondaryKey: string;
                    Values: string[];
                }[] = [];
                Object.keys(documentsIn_PPM_Values).forEach((mainKey) => {
                    dataToBatch.push({
                        MapDataExternalID: tableName,
                        MainKey: mainKey,
                        SecondaryKey: '',
                        Values: [documentsIn_PPM_Values[mainKey]],
                    });
                });
                batchUDTresponse = await objectsService.postBatchUDT(dataToBatch);
                expect(batchUDTresponse).to.be.an('array').with.lengthOf(dataToBatch.length);
                batchUDTresponse.map((row) => {
                    expect(row).to.have.property('InternalID').that.is.above(0);
                    expect(row).to.have.property('UUID').that.equals('00000000-0000-0000-0000-000000000000');
                    expect(row).to.have.property('Status').that.equals('Insert');
                    expect(row).to.have.property('Message').that.equals('Row inserted.');
                    expect(row)
                        .to.have.property('URI')
                        .that.equals('/user_defined_tables/' + row.InternalID);
                });
            });
            it('get UDT Values (PPM_Values)', async () => {
                initialPpmValues = await objectsService.getUDT({ where: "MapDataExternalID='PPM_Values'" });
                console.info('PPM_Values: ', initialPpmValues);
            });
            it('validating "PPM_Values" via API', async () => {
                expect(initialPpmValues.length).equals(Object.keys(documentsIn_PPM_Values).length);
                initialPpmValues.forEach((tableRow) => {
                    expect(tableRow['Values'][0]).equals(documentsIn_PPM_Values[tableRow.MainKey]);
                });
            });
        });

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
                testAccounts.forEach((account) => {
                    describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, () => {
                        it('Creating new transaction', async () => {
                            switch (account) {
                                case 'Acc01':
                                    accountName = 'My Store';
                                    transactionUUID_Acc01 = await startNewSalesOrderTransaction(accountName);
                                    console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                                    transactionUUID = transactionUUID_Acc01;
                                    break;

                                default:
                                    accountName = 'Account for order scenarios';
                                    transactionUUID_OtherAcc = await startNewSalesOrderTransaction(accountName);
                                    console.info('transactionUUID_OtherAcc:', transactionUUID_OtherAcc);
                                    transactionUUID = transactionUUID_OtherAcc;
                                    break;
                            }
                        });

                        testStates.forEach((state) => {
                            describe(`ORDER CENTER "${state}"`, () => {
                                testItems.forEach((item) => {
                                    it(`checking item "${item}"`, async () => {
                                        await searchInOrderCenter(item);
                                        switch (
                                            state //'baseline', '1unit', '3units', '1case(6units)', '4cases(24units)'
                                        ) {
                                            case '1unit':
                                                await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                    'Each',
                                                    item,
                                                    1,
                                                );
                                                break;
                                            case '3units':
                                                await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                    'Each',
                                                    item,
                                                    3,
                                                );
                                                break;
                                            case '1case(6units)':
                                                await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                    'Case',
                                                    item,
                                                    1,
                                                );
                                                break;
                                            case '4cases(24units)':
                                                await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                    'Case',
                                                    item,
                                                    4,
                                                );
                                                break;

                                            default:
                                                break;
                                        }
                                        const priceTSAs = await getItemTSAs('OrderCenter', item);
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
                                        switch (state) {
                                            case 'baseline':
                                                expect(priceTSAs['NPMCalcMessage'].length).equals(
                                                    testItemsData_PPM_Values[item]['NPMCalcMessage'][account][state]
                                                        .length,
                                                );
                                                break;

                                            default:
                                                expect(priceTSAs['NPMCalcMessage'].length).equals(
                                                    testItemsData_PPM_Values[item]['NPMCalcMessage'][account][
                                                        'baseline'
                                                    ].length +
                                                        testItemsData_PPM_Values[item]['NPMCalcMessage'][account][state]
                                                            .length,
                                                );
                                                break;
                                        }
                                        priceFields.forEach((priceField) => {
                                            expect(priceTSAs[priceField]).equals(
                                                testItemsData_PPM_Values[item][priceField][account][state],
                                            );
                                        });
                                        driver.sleep(0.2 * 1000);
                                        await clearOrderCenterSearch();
                                    });
                                });
                            });

                            switch (state) {
                                case 'baseline':
                                    break;

                                default:
                                    describe(`CART "${state}"`, () => {
                                        it('enter cart', async () => {
                                            await driver.click(orderPage.Cart_Button);
                                            await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName(''));
                                            driver.sleep(1 * 1000);
                                        });
                                        it('verify that the sum total of items in the cart is correct', async () => {
                                            const itemsInCart = await (
                                                await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                            ).getText();
                                            driver.sleep(0.2 * 1000);
                                            expect(Number(itemsInCart)).to.equal(testItems.length);
                                            driver.sleep(1 * 1000);
                                        });
                                        testItems.forEach(async (item) => {
                                            it(`checking item "${item}"`, async () => {
                                                const priceTSAs = await getItemTSAs('Cart', item);
                                                console.info(`Cart ${item} priceTSAs:`, priceTSAs);

                                                priceFields.forEach((priceField) => {
                                                    expect(priceTSAs[priceField]).equals(
                                                        testItemsData_PPM_Values[item][priceField][account][state],
                                                    );
                                                });
                                            });
                                        });
                                        describe('back to Order Center', () => {
                                            it('Click "Continue ordering" button', async () => {
                                                await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                                await orderPage.isSpinnerDone();
                                                await driver.untilIsVisible(
                                                    orderPage.getSelectorOfItemInOrderCenterByName(''),
                                                );
                                                driver.sleep(1 * 1000);
                                            });
                                        });
                                    });
                                    break;
                            }
                        });

                        describe('Additional Items (Free Goods)', () => {
                            describe('ORDER CENTER', () => {
                                describe('item "ToBr55" - quantity that gets 1 item of "ToBr10" for free (from 5 units "Each") (only on "My store")', () => {
                                    ['4 Each', '5 Each', '20 Each'].forEach((unitAmount, index) => {
                                        it(`${unitAmount}`, async () => {
                                            item_forFreeGoods = 'ToBr55';
                                            const states = ['baseline', '5units', '20units'];
                                            switch (unitAmount) {
                                                case '4 Each':
                                                    driver.sleep(1 * 1000);
                                                    await searchInOrderCenter(item_forFreeGoods);
                                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                        'Each',
                                                        item_forFreeGoods,
                                                        4,
                                                    );
                                                    break;

                                                case '5 Each':
                                                    await driver.click(
                                                        orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                            item_forFreeGoods,
                                                        ),
                                                    );
                                                    driver.sleep(0.5 * 1000);
                                                    break;

                                                case '20 Each':
                                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                        'Each',
                                                        item_forFreeGoods,
                                                        20,
                                                    );
                                                    break;

                                                default:
                                                    break;
                                            }
                                            ToBr55priceTSAs_OC = await getItemTSAs('OrderCenter', item_forFreeGoods);
                                            console.info(`ToBr55priceTSAs_OC (${unitAmount}): `, ToBr55priceTSAs_OC);

                                            expect(typeof ToBr55priceTSAs_OC).equals('object');
                                            expect(Object.keys(ToBr55priceTSAs_OC)).to.eql([
                                                'PriceBaseUnitPriceAfter1',
                                                'PriceDiscountUnitPriceAfter1',
                                                'PriceGroupDiscountUnitPriceAfter1',
                                                'PriceManualLineUnitPriceAfter1',
                                                'PriceTaxUnitPriceAfter1',
                                                'NPMCalcMessage',
                                            ]);
                                            expect(ToBr55priceTSAs_OC.NPMCalcMessage.length).equals(
                                                testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][account][
                                                    'baseline'
                                                ].length +
                                                    testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][
                                                        account
                                                    ][states[index]].length,
                                            );
                                            priceFields.forEach((priceField) => {
                                                expect(ToBr55priceTSAs_OC[priceField]).equals(
                                                    testItemsData_PPM_Values[item_forFreeGoods][priceField][account][
                                                        states[index]
                                                    ],
                                                );
                                            });
                                            driver.sleep(0.2 * 1000);
                                        });
                                    });

                                    it('Back to 4 Each', async () => {
                                        await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                            'Each',
                                            item_forFreeGoods,
                                            4,
                                        );
                                        driver.sleep(0.5 * 1000);
                                        await clearOrderCenterSearch();
                                        driver.sleep(0.5 * 1000);
                                    });
                                });
                                describe('item "Drug0002" - quantity that gets 2 "Cases" of items for free (from 10 in "Case")', () => {
                                    ['9 Cases', '10 Cases'].forEach((unitAmount, index) => {
                                        it(`${unitAmount}`, async () => {
                                            item_forFreeGoods = 'Drug0002';
                                            const states = ['9case(54units)', '10cases(60units)'];
                                            switch (unitAmount) {
                                                case '9 Cases':
                                                    await searchInOrderCenter(item_forFreeGoods);
                                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                        'Case',
                                                        item_forFreeGoods,
                                                        9,
                                                    );
                                                    break;

                                                case '10 Cases':
                                                    await driver.click(
                                                        orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                            item_forFreeGoods,
                                                        ),
                                                    );
                                                    driver.sleep(0.5 * 1000);
                                                    break;

                                                default:
                                                    break;
                                            }
                                            Drug0002priceTSAs_OC = await getItemTSAs('OrderCenter', item_forFreeGoods);
                                            console.info(
                                                `Drug0002priceTSAs_OC (${unitAmount}): `,
                                                Drug0002priceTSAs_OC,
                                            );

                                            expect(typeof Drug0002priceTSAs_OC).equals('object');
                                            expect(Object.keys(Drug0002priceTSAs_OC)).to.eql([
                                                'PriceBaseUnitPriceAfter1',
                                                'PriceDiscountUnitPriceAfter1',
                                                'PriceGroupDiscountUnitPriceAfter1',
                                                'PriceManualLineUnitPriceAfter1',
                                                'PriceTaxUnitPriceAfter1',
                                                'NPMCalcMessage',
                                            ]);
                                            expect(Drug0002priceTSAs_OC['NPMCalcMessage'].length).equals(
                                                testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][account][
                                                    'baseline'
                                                ].length +
                                                    testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][
                                                        account
                                                    ][states[index]].length,
                                            );
                                            priceFields.forEach((priceField) => {
                                                expect(Drug0002priceTSAs_OC[priceField]).equals(
                                                    testItemsData_PPM_Values[item_forFreeGoods][priceField][account][
                                                        states[index]
                                                    ],
                                                );
                                            });
                                            driver.sleep(0.2 * 1000);
                                        });
                                    });

                                    it('Back to 9 Cases', async () => {
                                        await driver.click(
                                            orderPage.getSelectorOfItemQuantityMinusButtonInOrderCenterByName(
                                                item_forFreeGoods,
                                            ),
                                        );
                                        driver.sleep(0.5 * 1000);
                                        await clearOrderCenterSearch();
                                        driver.sleep(0.5 * 1000);
                                    });
                                });
                                describe('item "Drug0004" - quantity that gets 2 items (in "Each") of "Drug0002" for free (from 3 in "Case")', () => {
                                    ['2 Cases', '3 Cases'].forEach((unitAmount, index) => {
                                        it(`${unitAmount}`, async () => {
                                            item_forFreeGoods = 'Drug0004';
                                            const states = ['2case(12units)', '3cases(18units)'];
                                            switch (unitAmount) {
                                                case '2 Cases':
                                                    driver.sleep(1 * 1000);
                                                    await searchInOrderCenter(item_forFreeGoods);
                                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                                        'Case',
                                                        item_forFreeGoods,
                                                        2,
                                                    );
                                                    break;

                                                case '3 Cases':
                                                    await driver.click(
                                                        orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(
                                                            item_forFreeGoods,
                                                        ),
                                                    );
                                                    driver.sleep(0.5 * 1000);
                                                    break;

                                                default:
                                                    break;
                                            }
                                            Drug0004priceTSAs_OC = await getItemTSAs('OrderCenter', item_forFreeGoods);
                                            console.info(`Drug0004priceTSAs_OC (2 cases): `, Drug0004priceTSAs_OC);

                                            expect(typeof Drug0004priceTSAs_OC).equals('object');
                                            expect(Object.keys(Drug0004priceTSAs_OC)).to.eql([
                                                'PriceBaseUnitPriceAfter1',
                                                'PriceDiscountUnitPriceAfter1',
                                                'PriceGroupDiscountUnitPriceAfter1',
                                                'PriceManualLineUnitPriceAfter1',
                                                'PriceTaxUnitPriceAfter1',
                                                'NPMCalcMessage',
                                            ]);
                                            expect(Drug0004priceTSAs_OC['NPMCalcMessage'].length).equals(
                                                testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][account][
                                                    'baseline'
                                                ].length +
                                                    testItemsData_PPM_Values[item_forFreeGoods]['NPMCalcMessage'][
                                                        account
                                                    ][states[index]].length,
                                            );
                                            priceFields.forEach((priceField) => {
                                                expect(Drug0004priceTSAs_OC[priceField]).equals(
                                                    testItemsData_PPM_Values[item_forFreeGoods][priceField][account][
                                                        states[index]
                                                    ],
                                                );
                                            });
                                            driver.sleep(0.2 * 1000);
                                        });
                                    });

                                    it('Back to 2 Cases', async () => {
                                        await driver.click(
                                            orderPage.getSelectorOfItemQuantityMinusButtonInOrderCenterByName(
                                                item_forFreeGoods,
                                            ),
                                        );
                                        driver.sleep(0.5 * 1000);
                                        await clearOrderCenterSearch();
                                        driver.sleep(0.5 * 1000);
                                    });
                                });
                            });
                            describe('Transaction ID', () => {
                                it('getting the transaction ID through the UI', async () => {
                                    transactionID = Number(
                                        await (await driver.findElement(orderPage.TransactionID)).getAttribute('title'),
                                    );
                                });
                            });
                            describe('Transition and Validation', () => {
                                it('exiting the transaction without submission', async () => {
                                    await webAppHeader.goHome();
                                    await webAppHomePage.isSpinnerDone();
                                    await driver.untilIsVisible(webAppHomePage.MainHomePageBtn);
                                    driver.sleep(1 * 1000);
                                });
                                it('verifying transaction ID', async () => {
                                    console.info('transactionUUID:', transactionUUID);
                                    driver.sleep(0.1 * 1000);
                                    Acc01TransactionByUUID = await objectsService.getTransaction({
                                        where: `UUID='${transactionUUID}'`,
                                    });
                                    console.info('Acc01TransactionByUUID:', Acc01TransactionByUUID);
                                    driver.sleep(2 * 1000);
                                    transactionInternalID = Acc01TransactionByUUID[0].InternalID;
                                    driver.sleep(1 * 1000);
                                    console.info('transactionInternalID:', transactionInternalID);
                                    expect(Acc01TransactionByUUID).to.be.an('array').with.lengthOf(1);
                                    expect(transactionInternalID).to.be.a('number');
                                    expect(transactionInternalID).equals(transactionID);
                                });
                                it(`navigating to the account "${
                                    account == 'Acc01' ? 'My Store' : 'Account for order scenarios'
                                }"`, async () => {
                                    await webAppHomePage.clickOnBtn('Accounts');
                                    await webAppHeader.isSpinnerDone();
                                    driver.sleep(0.1 * 1000);
                                    await webAppList.clickOnFromListRowWebElementByName(accountName);
                                    await webAppList.isSpinnerDone();
                                    await webAppList.clickOnLinkFromListRowWebElementByText(`${accountName}`);
                                    await webAppList.isSpinnerDone();
                                });
                                it('checking the latest activity - type: Sales Order, status: In Creation', async () => {
                                    const latestActivityID = await (
                                        await driver.findElement(webAppList.Activities_TopActivityInList_ID)
                                    ).getAttribute('title');
                                    const latestActivityType = await (
                                        await driver.findElement(webAppList.Activities_TopActivityInList_Type)
                                    ).getAttribute('title');
                                    const latestActivityStatus = await (
                                        await driver.findElement(webAppList.Activities_TopActivityInList_Status)
                                    ).getAttribute('title');
                                    expect(latestActivityType).to.equal('Sales Order');
                                    expect(latestActivityStatus).to.equal('In Creation');
                                    expect(Number(latestActivityID)).to.equal(transactionInternalID);
                                });
                                it('entering the same transaction through activity list', async () => {
                                    await webAppList.clickOnLinkFromListRowWebElement();
                                    await webAppList.isSpinnerDone();
                                    await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                                    driver.sleep(0.1 * 1000);
                                });
                            });
                            describe('CART', () => {
                                it('verifying that the sum total of items in the cart is correct', async () => {
                                    await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName('')); // check to be in cart
                                    const itemsInCart = await (
                                        await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                    ).getText();
                                    driver.sleep(0.2 * 1000);
                                    expect(Number(itemsInCart)).to.equal(
                                        testItems.length + itemsAddedToGetFreeGoods.length,
                                    );
                                    driver.sleep(1 * 1000);
                                });
                                it('changing the amount of "ToBr55" to produce free goods', async () => {
                                    const item = 'ToBr55';
                                    await changeSelectedQuantityOfSpecificItemInCart('Each', item, 5);
                                    driver.sleep(0.2 * 1000);
                                });
                                it('changing the amount of "Drug0002" to produce free goods', async () => {
                                    const item = 'Drug0002';
                                    await changeSelectedQuantityOfSpecificItemInCart('Case', item, 10);
                                    driver.sleep(0.2 * 1000);
                                });
                                it('changing the amount of "Drug0004" to produce free goods', async () => {
                                    const item = 'Drug0004';
                                    await changeSelectedQuantityOfSpecificItemInCart('Case', item, 3);
                                    driver.sleep(0.2 * 1000);
                                });
                                it('verifying that the sum total of items after the free goods were received is correct', async () => {
                                    const itemsInCart = await (
                                        await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                    ).getText();
                                    driver.sleep(0.2 * 1000);
                                    expect(Number(itemsInCart)).to.equal(
                                        testItems.length +
                                            itemsAddedToGetFreeGoods.length +
                                            freeGoodsReceived[account].length,
                                    );
                                    driver.sleep(1 * 1000);
                                });
                                it('verifying the specific item "Drug0002" was added to the cart', async () => {
                                    const cartFreeItemElements = await driver.findElements(
                                        orderPage.getSelectorOfFreeItemInCartByName(''),
                                    );
                                    driver.sleep(0.3 * 1000);
                                    expect(cartFreeItemElements)
                                        .to.be.an('array')
                                        .with.lengthOf(freeGoodsReceived[account].length);
                                    const item = 'Drug0002';
                                    const Drug0002_itemsList = await driver.findElements(
                                        orderPage.getSelectorOfItemInCartByName(item),
                                    );
                                    driver.sleep(0.1 * 1000);
                                    expect(Drug0002_itemsList).to.be.an('array').with.lengthOf(3);
                                    const Drug0002_freeItems = await driver.findElements(
                                        orderPage.getSelectorOfFreeItemInCartByName(item),
                                    );
                                    expect(Drug0002_freeItems).to.be.an('array').with.lengthOf(2);

                                    Drug0002_freeItems.forEach(async (Drug0002_freeItem, index) => {
                                        expect(await Drug0002_freeItem.getAttribute('style')).to.equal(
                                            'background-color: rgb(165, 235, 255);',
                                        );

                                        const Drug0002_priceTSAsCart = await getItemTSAs('Cart', item, 'Free', index);
                                        priceFields.forEach((priceField) => {
                                            switch (priceField) {
                                                case 'PriceBaseUnitPriceAfter1':
                                                    expect(Drug0002_priceTSAsCart[priceField]).to.equal(
                                                        testItemsData_PPM_Values[item]['PriceBaseUnitPriceAfter1'][
                                                            account
                                                        ]['baseline'],
                                                    );
                                                    break;

                                                default:
                                                    expect(Drug0002_priceTSAsCart[priceField]).equals(0.0);
                                                    break;
                                            }
                                        });
                                    });
                                    driver.sleep(0.2 * 1000);
                                });
                                it('verify additional item "Drug0002" quantity is correct', async () => {
                                    const item = 'Drug0002';
                                    const numberOfUnits = await driver.findElements(
                                        orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                                    );
                                    const Drug0002_freeItem_numberOfUnits_fromDrug0004 = Number(
                                        await numberOfUnits[0].getAttribute('title'),
                                    );
                                    expect(Drug0002_freeItem_numberOfUnits_fromDrug0004).equals(2);

                                    const Drug0002_freeItem_numberOfUnits_fromDrug0002 = Number(
                                        await numberOfUnits[2].getAttribute('title'),
                                    );
                                    expect(Drug0002_freeItem_numberOfUnits_fromDrug0002).equals(12);
                                    // debugger
                                    const numberOfAOQM = await driver.findElements(
                                        orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                                    );
                                    const Drug0002_freeItem_numberOfAOQM = Number(
                                        await numberOfAOQM[0].getAttribute('title'),
                                    );
                                    expect(Drug0002_freeItem_numberOfAOQM).equals(2);
                                });
                                it('verifying the specific item "ToBr10" was added to the cart on account "My Store" and NOT added on other account', async () => {
                                    const item = 'ToBr10';
                                    switch (account) {
                                        case 'Acc01':
                                            const ToBr10_item = await driver.findElement(
                                                orderPage.getSelectorOfItemInCartByName(item),
                                            );
                                            expect(await ToBr10_item.getAttribute('style')).to.equal(
                                                'background-color: rgb(165, 235, 255);',
                                            );
                                            const ToBr10_priceTSAsCart = await getItemTSAs('Cart', item, 'Free');
                                            priceFields.forEach((priceField) => {
                                                switch (priceField) {
                                                    case 'PriceBaseUnitPriceAfter1':
                                                        expect(ToBr10_priceTSAsCart[priceField]).to.equal(
                                                            testItemsData_PPM_Values[item].ItemPrice,
                                                        );
                                                        break;

                                                    default:
                                                        expect(ToBr10_priceTSAsCart[priceField]).equals(0.0);
                                                        break;
                                                }
                                            });
                                            break;

                                        default:
                                            try {
                                                await driver.findElement(orderPage.getSelectorOfItemInCartByName(item));
                                            } catch (error) {
                                                const caughtError: any = error;
                                                expect(caughtError.message).to.equal(
                                                    `After wait time of: 15000, for selector of '//pep-textbox[@data-qa="ItemExternalID"]/span[contains(@title,"ToBr10")]/ancestor::fieldset/ancestor::fieldset', The test must end, The element is: undefined`,
                                                );
                                            }
                                            break;
                                    }
                                    driver.sleep(2 * 1000);
                                });
                                if (account === 'Acc01') {
                                    it('verify additional item "ToBr10" quantity is correct', async () => {
                                        const item = 'ToBr10';
                                        const numberOfUnits = await driver.findElements(
                                            orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                                        );
                                        const ToBr10_freeItem_numberOfUnits = Number(
                                            await numberOfUnits[0].getAttribute('title'),
                                        );
                                        expect(ToBr10_freeItem_numberOfUnits).equals(1);
                                        const numberOfAOQM = await driver.findElements(
                                            orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                                        );
                                        const ToBr10_freeItem_numberOfAOQM = Number(
                                            await numberOfAOQM[0].getAttribute('title'),
                                        );
                                        expect(ToBr10_freeItem_numberOfAOQM).equals(1);
                                    });
                                    it('increase quantity of item "ToBr55" over 20 units (Each) and see the additional item change to 1 case of "ToBr55"', async () => {
                                        const item = 'ToBr55';
                                        await changeSelectedQuantityOfSpecificItemInCart('Case', item, 4);
                                    });
                                    it('verify additional item type have changed', async () => {
                                        let item = 'ToBr55';
                                        const ToBr55_itemsList = await driver.findElements(
                                            orderPage.getSelectorOfItemInCartByName(item),
                                        );
                                        driver.sleep(0.1 * 1000);
                                        expect(ToBr55_itemsList).to.be.an('array').with.lengthOf(2);
                                        driver.sleep(0.1 * 1000);
                                        const ToBr55_freeItem = await driver.findElements(
                                            orderPage.getSelectorOfFreeItemInCartByName(item),
                                        );
                                        driver.sleep(0.1 * 1000);
                                        expect(ToBr55_freeItem).to.be.an('array').with.lengthOf(1);
                                        driver.sleep(0.1 * 1000);
                                        expect(await ToBr55_freeItem[0].getAttribute('style')).to.equal(
                                            'background-color: rgb(165, 235, 255);',
                                        );
                                        const ToBr55_priceTSAsCart = await getItemTSAs('Cart', item, 'Free');
                                        priceFields.forEach((priceField) => {
                                            switch (priceField) {
                                                case 'PriceBaseUnitPriceAfter1':
                                                    expect(ToBr55_priceTSAsCart[priceField]).to.equal(
                                                        testItemsData_PPM_Values[item].ItemPrice,
                                                    );
                                                    break;

                                                default:
                                                    expect(ToBr55_priceTSAsCart[priceField]).equals(0.0);
                                                    break;
                                            }
                                        });

                                        item = 'ToBr10';
                                        try {
                                            await driver.findElement(orderPage.getSelectorOfItemInCartByName(item));
                                        } catch (error) {
                                            const caughtError: any = error;
                                            expect(caughtError.message).to.equal(
                                                `After wait time of: 15000, for selector of '//pep-textbox[@data-qa="ItemExternalID"]/span[contains(@title,"ToBr10")]/ancestor::fieldset/ancestor::fieldset', The test must end, The element is: undefined`,
                                            );
                                        }
                                    });
                                    it('verify additional item "ToBr55" quantity have changed', async () => {
                                        const item = 'ToBr55';
                                        const numberOfUnits = await driver.findElements(
                                            orderPage.getSelectorOfNumberOfUnitsInCartByItemName(item),
                                        );
                                        const ToBr55_freeItem_numberOfUnits = Number(
                                            await numberOfUnits[1].getAttribute('title'),
                                        );
                                        expect(ToBr55_freeItem_numberOfUnits).equals(6);
                                        const numberOfAOQM = await driver.findElements(
                                            orderPage.getSelectorOfReadOnlyAoqmQuantityInCartByAdditionalItemName(item),
                                        );
                                        expect(numberOfAOQM).to.be.an('array').with.lengthOf(1);
                                        const ToBr55_freeItem_numberOfAOQM = Number(
                                            await numberOfAOQM[0].getAttribute('title'),
                                        );
                                        expect(ToBr55_freeItem_numberOfAOQM).equals(1);
                                    });
                                }
                                it('Click "Continue ordering" button', async () => {
                                    await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                    await orderPage.isSpinnerDone();
                                    await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                                    driver.sleep(0.2 * 1000);
                                });
                            });
                        });

                        describe('Group Rules', () => {
                            describe('ORDER CENTER', () => {
                                it('Adding Group Rules Items', async () => {
                                    await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                                    await driver.click(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                                    driver.sleep(0.1 * 1000);
                                });

                                ['MakeUp001', 'MakeUp002'].forEach((item) => {
                                    it(`Checking ${item} at Baseline`, async () => {
                                        const MakeUpItem_priceTSAsCart = await getItemTSAs('OrderCenter', item);
                                        driver.sleep(0.1 * 1000);
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                            .to.be.an('array')
                                            .with.lengthOf(0);
                                        driver.sleep(0.1 * 1000);
                                    });
                                });

                                ['MakeUp001', 'MakeUp002'].forEach((item) => {
                                    it(`Adding ${item} at quantity of 1 Each and Checking at Order Center`, async () => {
                                        driver.sleep(0.1 * 1000);
                                        const itemContainer = await driver.findElement(
                                            orderPage.getSelectorOfItemInOrderCenterByName(item),
                                        );
                                        let itemUomValue = await driver.findElement(
                                            orderPage.UnitOfMeasure_Selector_Value,
                                        );
                                        await driver.click(orderPage.UnitOfMeasure_Selector_Value);
                                        driver.sleep(0.2 * 1000);
                                        await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText('Each'));
                                        driver.sleep(0.2 * 1000);
                                        await itemContainer.click();
                                        driver.sleep(0.1 * 1000);
                                        itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
                                        driver.sleep(0.1 * 1000);
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(0.2 * 1000);
                                        expect(await itemUomValue.getText()).equals('Each');
                                        await driver.click(
                                            orderPage.getSelectorOfItemQuantityPlusButtonInOrderCenterByName(item),
                                        );
                                        const uomXnumber = await driver.findElement(
                                            orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
                                                'ItemQuantity_byUOM_InteractableNumber',
                                                item,
                                            ),
                                        );
                                        await itemContainer.click();
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(1 * 1000);
                                        const numberByUOM = await uomXnumber.getAttribute('title');
                                        driver.sleep(0.5 * 1000);
                                        expect(Number(numberByUOM)).equals(1);
                                        driver.sleep(0.1 * 1000);
                                        const MakeUpItem_priceTSAsCart = await getItemTSAs('OrderCenter', item);
                                        driver.sleep(0.2 * 1000);
                                        expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                            .to.be.an('array')
                                            .with.lengthOf(0);
                                        driver.sleep(0.1 * 1000);
                                    });
                                });

                                it('Adding "MakeUp003" at quantity of 1 Each and Checking at Order Center (3 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp003';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        1,
                                    );
                                    const MakeUp003_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                ['MakeUp001', 'MakeUp002'].forEach((item) => {
                                    it(`Checking ${item} after amount of 3 in the group at Order Center`, async () => {
                                        await searchInOrderCenter(item);
                                        const MakeUpItem_priceTSAsCart = await getItemTSAs('OrderCenter', item);
                                        driver.sleep(0.1 * 1000);
                                        switch (account) {
                                            case 'Acc01':
                                                expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                                    .to.be.an('array')
                                                    .with.lengthOf(1);
                                                expect(Object.keys(MakeUpItem_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                    'Name',
                                                    'Base',
                                                    'Conditions',
                                                    'New',
                                                    'Amount',
                                                ]);
                                                expect(MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                    testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01[
                                                        '3units'
                                                    ][0].Name,
                                                );
                                                expect(
                                                    Object.keys(
                                                        MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0],
                                                    ),
                                                ).eql(['Name', 'Type', 'Value', 'Amount']);
                                                expect(
                                                    MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                                ).equals(
                                                    testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01[
                                                        '3units'
                                                    ][0].Conditions[0].Name,
                                                );
                                                expect(
                                                    MakeUpItem_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                                ).equals(
                                                    testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01[
                                                        '3units'
                                                    ][0].Conditions[0].Type,
                                                );
                                                break;

                                            default:
                                                expect(MakeUpItem_priceTSAsCart.NPMCalcMessage)
                                                    .to.be.an('array')
                                                    .with.lengthOf(0);
                                                expect(Object.keys(MakeUpItem_priceTSAsCart.NPMCalcMessage)).eql(
                                                    testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc[
                                                        '3units'
                                                    ],
                                                );
                                                break;
                                        }
                                        driver.sleep(0.1 * 1000);
                                        await clearOrderCenterSearch();
                                        driver.sleep(5 * 1000);
                                    });
                                });

                                it('Adding "MakeUp018" at quantity of 1 Each and Checking at Order Center (4 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp018';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        1,
                                    );
                                    const MakeUp018_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Changing "MakeUp018" value to 2 Each and Checking at Order Center (5 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp018';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        2,
                                    );
                                    const MakeUp018_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp018_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['3units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp018_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp018_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['3units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Changing "MakeUp001" value to 2 Each and Checking at Order Center (6 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp001';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        2,
                                    );
                                    const MakeUp001_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp001_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp001_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['6units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp001_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp001_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['6units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Changing "MakeUp002" value to 2 Each and Checking at Order Center (7 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp002';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        2,
                                    );
                                    const MakeUp002_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['7units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Changing "MakeUp003" value to 5 Each and Checking at Order Center (11 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp003';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        5,
                                    );
                                    const MakeUp003_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp003_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['11units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc[
                                                    '11units'
                                                ],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Adding "MakeUp006" at quantity of 1 Each and Checking at Order Center (12 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp006';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        1,
                                    );
                                    const MakeUp006_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp006_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            expect(
                                                MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Value,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Value,
                                            );
                                            expect(
                                                MakeUp006_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Amount,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Amount,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp006_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp006_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc[
                                                    '12units'
                                                ],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Changing "MakeUp003" value to 10 Each and Checking at Order Center (additional item from singular rule)', async () => {
                                    item_forGroupRules = 'MakeUp003';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        10,
                                    );
                                    const MakeUp003_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0])).eql(
                                                Object.keys(
                                                    testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[
                                                        account
                                                    ]['10units'][0],
                                                ),
                                            );
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Name).eql(
                                                testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[account][
                                                    '10units'
                                                ][0].Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0]),
                                            ).eql(
                                                Object.keys(
                                                    testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[
                                                        account
                                                    ]['10units'][0].Conditions[0],
                                                ),
                                            );
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Name).eql(
                                                testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[account][
                                                    '10units'
                                                ][0].Conditions[0].Name,
                                            );
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Type).eql(
                                                testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[account][
                                                    '10units'
                                                ][0].Conditions[0].Type,
                                            );
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage[0].Conditions[0].Value).eql(
                                                testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[account][
                                                    '10units'
                                                ][0].Conditions[0].Value,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp003_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp003_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values[item_forGroupRules].NPMCalcMessage[account]
                                                    .baseline,
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Checking "MakeUp002" at Order Center (7 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp002';
                                    await searchInOrderCenter(item_forGroupRules);
                                    const MakeUp002_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp002_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['7units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp002_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp002_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc['7units'],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });

                                it('Adding "MakeUp019" at quantity of 5 Each and Checking at Order Center (12 units in group)', async () => {
                                    item_forGroupRules = 'MakeUp019';
                                    await searchInOrderCenter(item_forGroupRules);
                                    await changeSelectedQuantityOfSpecificItemInOrderCenter(
                                        'Each',
                                        item_forGroupRules,
                                        5,
                                    );
                                    const MakeUp019_priceTSAsCart = await getItemTSAs(
                                        'OrderCenter',
                                        item_forGroupRules,
                                    );
                                    driver.sleep(0.1 * 1000);
                                    switch (account) {
                                        case 'Acc01':
                                            expect(MakeUp019_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(1);
                                            expect(Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage[0])).eql([
                                                'Name',
                                                'Base',
                                                'Conditions',
                                                'New',
                                                'Amount',
                                            ]);
                                            expect(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Name']).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Name,
                                            );
                                            expect(
                                                Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0]),
                                            ).eql(['Name', 'Type', 'Value', 'Amount']);
                                            expect(
                                                MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Name,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Name,
                                            );
                                            expect(
                                                MakeUp019_priceTSAsCart.NPMCalcMessage[0]['Conditions'][0].Type,
                                            ).equals(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.Acc01['12units'][0]
                                                    .Conditions[0].Type,
                                            );
                                            break;

                                        default:
                                            expect(MakeUp019_priceTSAsCart.NPMCalcMessage)
                                                .to.be.an('array')
                                                .with.lengthOf(0);
                                            expect(Object.keys(MakeUp019_priceTSAsCart.NPMCalcMessage)).eql(
                                                testItemsData_PPM_Values.BeautyMakeUp.NPMCalcMessage.OtherAcc[
                                                    '12units'
                                                ],
                                            );
                                            break;
                                    }
                                    driver.sleep(0.1 * 1000);
                                    await clearOrderCenterSearch();
                                    driver.sleep(5 * 1000);
                                });
                            });

                            describe('CART', () => {
                                it('Entering Cart', async () => {
                                    await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                                    driver.sleep(0.1 * 1000);
                                    await driver.click(orderPage.Cart_Button);
                                    await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName(''));
                                    driver.sleep(0.1 * 1000);
                                });
                                it('Checking Cart', async () => {
                                    // TODO
                                    driver.sleep(1 * 1000);
                                });
                                it('Click "Submit" button', async () => {
                                    await orderPage.isSpinnerDone();
                                    await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName(''));
                                    await driver.click(orderPage.Cart_Submit_Button);
                                    driver.sleep(0.1 * 1000);
                                });
                            });
                        });

                        describe('Read Only', () => {
                            it('entering the same transaction post submission, checking the latest activity - type: Sales Order, status: Submitted', async () => {
                                await webAppList.isSpinnerDone();
                                await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_ID);
                                const latestActivityID = await (
                                    await driver.findElement(webAppList.Activities_TopActivityInList_ID)
                                ).getAttribute('title');
                                const latestActivityType = await (
                                    await driver.findElement(webAppList.Activities_TopActivityInList_Type)
                                ).getAttribute('title');
                                const latestActivityStatus = await (
                                    await driver.findElement(webAppList.Activities_TopActivityInList_Status)
                                ).getAttribute('title');
                                expect(latestActivityType).to.equal('Sales Order');
                                expect(latestActivityStatus).to.equal('Submitted');
                                expect(Number(latestActivityID)).to.equal(transactionInternalID);
                            });
                            it('changing values in "PPM_Values" UDT', async () => {
                                const tableName = 'PPM_Values';

                                updatedUDTRowPOST = await objectsService.postUDT({
                                    MapDataExternalID: tableName,
                                    MainKey: 'ZDS3@A001@Drug0004',
                                    SecondaryKey: '',
                                    Values: [
                                        '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"EA"]]',
                                    ],
                                });
                                expect(updatedUDTRowPOST).to.deep.include({
                                    MapDataExternalID: tableName,
                                    MainKey: 'ZDS3@A001@Drug0004',
                                    SecondaryKey: null,
                                    Values: [
                                        '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"EA"]]',
                                    ],
                                });
                                expect(updatedUDTRowPOST).to.have.property('CreationDateTime').that.contains('Z');
                                expect(updatedUDTRowPOST)
                                    .to.have.property('ModificationDateTime')
                                    .that.contains(new Date().toISOString().split('T')[0]);
                                expect(updatedUDTRowPOST).to.have.property('ModificationDateTime').that.contains('Z');
                                expect(updatedUDTRowPOST).to.have.property('Hidden').that.is.false;
                                expect(updatedUDTRowPOST).to.have.property('InternalID').that.is.above(0);
                            });
                            it('performing sync', async () => {
                                await webAppHeader.goHome();
                                driver.sleep(0.2 * 1000);
                                await webAppHomePage.isSpinnerDone();
                                await webAppHomePage.manualResync(client);
                            });
                            it('validating "PPM_Values" UDT values via API', async () => {
                                const tableName = 'PPM_Values';
                                const updatedUDT = await objectsService.getUDT({
                                    where: "MapDataExternalID='" + tableName + "'",
                                });
                                console.info('updatedUDT: ', updatedUDT);
                                expect(updatedUDT).to.be.an('array').with.lengthOf(initialPpmValues.length);
                                // Add verification tests
                            });
                            it(`navigating to the account "${
                                account == 'Acc01' ? 'My Store' : 'Account for order scenarios'
                            }"`, async () => {
                                await webAppHomePage.clickOnBtn('Accounts');
                                await webAppHeader.isSpinnerDone();
                                driver.sleep(0.1 * 1000);
                                await webAppList.clickOnFromListRowWebElementByName(accountName);
                                await webAppList.isSpinnerDone();
                                await webAppList.clickOnLinkFromListRowWebElementByText(`${accountName}`);
                                await webAppList.isSpinnerDone();
                            });
                            it('entering the same transaction through activity list', async () => {
                                await webAppList.untilIsVisible(webAppList.Activities_TopActivityInList_ID);
                                await webAppList.clickOnLinkFromListRowWebElement();
                                await webAppList.isSpinnerDone();
                                await driver.untilIsVisible(orderPage.getSelectorOfItemInCartByName(''));
                                try {
                                    await driver.findElement(orderPage.Cart_Submit_Button);
                                } catch (error) {
                                    const caughtError: any = error;
                                    expect(caughtError.message).to.equal(
                                        `After wait time of: 15000, for selector of '//button[@data-qa="Submit"]', The test must end, The element is: undefined`,
                                    );
                                }
                                try {
                                    await driver.findElement(orderPage.Cart_ContinueOrdering_Button);
                                } catch (error) {
                                    const caughtError: any = error;
                                    expect(caughtError.message).to.equal(
                                        `After wait time of: 15000, for selector of '//button[@data-qa="Continue ordering"]', The test must end, The element is: undefined`,
                                    );
                                }
                                driver.sleep(0.1 * 1000);
                            });
                            it('reverting values in "PPM_Values" UDT to the original values', async () => {
                                const tableName = 'PPM_Values';
                                updatedUDTRowPOST = await objectsService.postUDT({
                                    MapDataExternalID: tableName,
                                    MainKey: 'ZDS3@A001@Drug0004',
                                    SecondaryKey: '',
                                    Values: [
                                        '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
                                    ],
                                });
                                expect(updatedUDTRowPOST).to.deep.include({
                                    MapDataExternalID: tableName,
                                    MainKey: 'ZDS3@A001@Drug0004',
                                    SecondaryKey: null,
                                    Values: [
                                        '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
                                    ],
                                });
                                expect(updatedUDTRowPOST).to.have.property('CreationDateTime').that.contains('Z');
                                expect(updatedUDTRowPOST)
                                    .to.have.property('ModificationDateTime')
                                    .that.contains(new Date().toISOString().split('T')[0]);
                                expect(updatedUDTRowPOST).to.have.property('ModificationDateTime').that.contains('Z');
                                expect(updatedUDTRowPOST).to.have.property('Hidden').that.is.false;
                                expect(updatedUDTRowPOST).to.have.property('InternalID').that.is.above(0);
                            });
                            it('performing sync', async () => {
                                await webAppHeader.goHome();
                                driver.sleep(0.2 * 1000);
                                await webAppHomePage.isSpinnerDone();
                                await webAppHomePage.manualResync(client);
                            });
                            it('validating "PPM_Values" UDT values via API', async () => {
                                const ppmVluesEnd = await objectsService.getUDT({
                                    where: "MapDataExternalID='PPM_Values'",
                                });

                                expect(ppmVluesEnd.length).equals(initialPpmValues.length);
                                ppmVluesEnd.forEach((tableRow) => {
                                    const matchingInitialRow = initialPpmValues.find(
                                        (initialRow) => initialRow['MainKey'] === tableRow['MainKey'],
                                    );
                                    expect(tableRow['Values']).eql(matchingInitialRow['Values']);
                                });
                            });
                        });
                    });
                });
                describe('Return to HomePage', () => {
                    it('Go Home', async () => {
                        await webAppHeader.goHome();
                        driver.sleep(1 * 1000);
                    });
                });
            });

            describe('Cleanup', () => {
                it('Deleting all Activities', async () => {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Activities');
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.1 * 1000);
                    try {
                        await webAppList.checkAllListElements();
                        driver.sleep(0.1 * 1000);
                        await webAppList.clickOnPencilMenuButton();
                        driver.sleep(0.1 * 1000);
                        await webAppList.selectUnderPencilMenu('Delete');
                        driver.sleep(0.1 * 1000);
                        await driver.untilIsVisible(webAppDialog.ButtonArr);
                        driver.sleep(0.1 * 1000);
                        await webAppDialog.selectDialogBoxByText('Delete');
                        await webAppDialog.isSpinnerDone();
                        driver.sleep(0.1 * 1000);
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
        driver.sleep(0.1 * 1000);
        await webAppHeader.isSpinnerDone();
        await webAppList.clickOnFromListRowWebElementByName(nameOfAccount);
        driver.sleep(0.1 * 1000);
        await webAppHeader.click(webAppTopBar.DoneBtn);
        await webAppHeader.isSpinnerDone();
        if (await webAppHeader.safeUntilIsVisible(webAppDialog.Dialog, 5000)) {
            driver.sleep(0.1 * 1000);
            await webAppDialog.selectDialogBoxBeforeNewOrder();
        }
        driver.sleep(0.1 * 1000);
        await webAppHeader.isSpinnerDone();
        await driver.untilIsVisible(orderPage.Cart_Button);
        await driver.untilIsVisible(orderPage.TransactionUUID);
        const trnUUID = await (await driver.findElement(orderPage.TransactionUUID)).getText();
        driver.sleep(0.1 * 1000);
        return trnUUID;
    }

    async function getItemTSAs(
        at: 'OrderCenter' | 'Cart',
        nameOfItem: string,
        freeItem?: 'Free',
        locationInElementsArray?: number,
    ): Promise<PriceTsaFields> {
        const findSelectorOfItem = `getSelectorOfCustomFieldIn${at}By${freeItem ? freeItem : ''}ItemName`;
        let NPMCalcMessage_Value;
        const PriceBaseUnitPriceAfter1_Selector = orderPage[findSelectorOfItem](
            'PriceBaseUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceBaseUnitPriceAfter1_Values = await driver.findElements(PriceBaseUnitPriceAfter1_Selector);
        const PriceBaseUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceBaseUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceBaseUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceBaseUnitPriceAfter1_Value: `, PriceBaseUnitPriceAfter1_Value);

        const PriceDiscountUnitPriceAfter1_Selector = orderPage[findSelectorOfItem](
            'PriceDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceDiscountUnitPriceAfter1_Values = await driver.findElements(PriceDiscountUnitPriceAfter1_Selector);
        const PriceDiscountUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceDiscountUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceDiscountUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceDiscountUnitPriceAfter1_Value: `, PriceDiscountUnitPriceAfter1_Value);

        const PriceGroupDiscountUnitPriceAfter1_Selector = orderPage[findSelectorOfItem](
            'PriceGroupDiscountUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceGroupDiscountUnitPriceAfter1_Values = await driver.findElements(
            PriceGroupDiscountUnitPriceAfter1_Selector,
        );
        const PriceGroupDiscountUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceGroupDiscountUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceGroupDiscountUnitPriceAfter1_Values[0].getText();
        console.info(
            `${nameOfItem} PriceGroupDiscountUnitPriceAfter1_Value: `,
            PriceGroupDiscountUnitPriceAfter1_Value,
        );

        const PriceManualLineUnitPriceAfter1_Selector = orderPage[findSelectorOfItem](
            'PriceManualLineUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceManualLineUnitPriceAfter1_Values = await driver.findElements(
            PriceManualLineUnitPriceAfter1_Selector,
        );
        const PriceManualLineUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceManualLineUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceManualLineUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceManualLineUnitPriceAfter1_Value: `, PriceManualLineUnitPriceAfter1_Value);

        const PriceTaxUnitPriceAfter1_Selector = orderPage[findSelectorOfItem](
            'PriceTaxUnitPriceAfter1_Value',
            nameOfItem,
        );
        const PriceTaxUnitPriceAfter1_Values = await driver.findElements(PriceTaxUnitPriceAfter1_Selector);
        const PriceTaxUnitPriceAfter1_Value = locationInElementsArray
            ? await PriceTaxUnitPriceAfter1_Values[locationInElementsArray].getText()
            : await PriceTaxUnitPriceAfter1_Values[0].getText();
        console.info(`${nameOfItem} PriceTaxUnitPriceAfter1_Value: `, PriceTaxUnitPriceAfter1_Value);

        if (at === 'OrderCenter') {
            const NPMCalcMessage_Selector = orderPage[findSelectorOfItem]('NPMCalcMessage_Value', nameOfItem);
            NPMCalcMessage_Value = await (await driver.findElement(NPMCalcMessage_Selector)).getText();
            console.info(`${nameOfItem} NPMCalcMessage_Value: `, NPMCalcMessage_Value);
        }
        driver.sleep(0.1 * 1000);
        return {
            PriceBaseUnitPriceAfter1: Number(PriceBaseUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceDiscountUnitPriceAfter1: Number(PriceDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceGroupDiscountUnitPriceAfter1: Number(PriceGroupDiscountUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceManualLineUnitPriceAfter1: Number(PriceManualLineUnitPriceAfter1_Value.split(' ')[1].trim()),
            PriceTaxUnitPriceAfter1: Number(PriceTaxUnitPriceAfter1_Value.split(' ')[1].trim()),
            NPMCalcMessage: at === 'OrderCenter' ? JSON.parse(NPMCalcMessage_Value) : null,
        };
    }

    async function searchInOrderCenter(nameOfItem: string): Promise<void> {
        await orderPage.isSpinnerDone();
        const searchInput = await driver.findElement(orderPage.Search_Input);
        await searchInput.clear();
        driver.sleep(0.1 * 1000);
        await searchInput.sendKeys(nameOfItem);
        driver.sleep(0.5 * 1000);
        await driver.click(orderPage.HtmlBody);
        await driver.click(orderPage.Search_Magnifier_Button);
        driver.sleep(0.1 * 1000);
        await orderPage.isSpinnerDone();
        await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
    }

    async function changeSelectedQuantityOfSpecificItemInOrderCenter(
        uomValue: 'Each' | 'Case',
        nameOfItem: string,
        quantityOfItem: number,
    ): Promise<void> {
        const itemContainer = await driver.findElement(orderPage.getSelectorOfItemInOrderCenterByName(nameOfItem));
        driver.sleep(0.05 * 1000);
        let itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        if ((await itemUomValue.getText()) !== uomValue) {
            await driver.click(orderPage.UnitOfMeasure_Selector_Value);
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(0.1 * 1000);
            await itemContainer.click();
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(orderPage.UnitOfMeasure_Selector_Value);
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        expect(await itemUomValue.getText()).equals(uomValue);
        const uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInOrderCenterByItemName(
                'ItemQuantity_byUOM_InteractableNumber',
                nameOfItem,
            ),
        );
        await itemContainer.click();
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await itemContainer.click();
        driver.sleep(1 * 1000);
        const numberByUOM = await uomXnumber.getAttribute('title');
        driver.sleep(0.5 * 1000);
        await orderPage.isSpinnerDone();
        expect(Number(numberByUOM)).equals(quantityOfItem);
        driver.sleep(1 * 1000);
        const numberOfUnits = await (
            await driver.findElement(orderPage.ItemQuantity_NumberOfUnits_Readonly)
        ).getAttribute('title');
        driver.sleep(0.5 * 1000);
        await orderPage.isSpinnerDone();
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
        driver.sleep(0.05 * 1000);
        await itemContainer.click();
    }

    async function changeSelectedQuantityOfSpecificItemInCart(
        uomValue: 'Each' | 'Case',
        nameOfItem: string,
        quantityOfItem: number,
    ): Promise<void> {
        driver.sleep(0.05 * 1000);
        // debugger
        let itemUomValue = await driver.findElement(orderPage.getSelectorOfUomValueInCartByItemName(nameOfItem));
        if ((await itemUomValue.getText()) !== uomValue) {
            await itemUomValue.click();
            driver.sleep(0.05 * 1000);
            await driver.click(orderPage.getSelectorOfUnitOfMeasureOptionByText(uomValue));
            driver.sleep(0.1 * 1000);
            await driver.click(orderPage.HtmlBody);
            driver.sleep(0.1 * 1000);
            itemUomValue = await driver.findElement(orderPage.getSelectorOfUomValueInCartByItemName(nameOfItem));
        }
        driver.sleep(0.05 * 1000);
        await orderPage.isSpinnerDone();
        expect(await itemUomValue.getText()).equals(uomValue);
        let uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInCartByItemName('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        for (let i = 0; i < 6; i++) {
            await uomXnumber.sendKeys(Key.BACK_SPACE);
            driver.sleep(0.01 * 1000);
        }
        driver.sleep(0.05 * 1000);
        await uomXnumber.sendKeys(quantityOfItem);
        await orderPage.isSpinnerDone();
        driver.sleep(0.05 * 1000);
        await driver.click(orderPage.HtmlBody);
        driver.sleep(1 * 1000);
        uomXnumber = await driver.findElement(
            orderPage.getSelectorOfCustomFieldInCartByItemName('ItemQuantity_byUOM_InteractableNumber', nameOfItem),
        );
        driver.sleep(1 * 1000);
        await orderPage.isSpinnerDone();
        expect(Number(await uomXnumber.getAttribute('title'))).equals(quantityOfItem);
        driver.sleep(0.2 * 1000);
        const numberOfUnits = await driver.findElement(
            orderPage.getSelectorOfNumberOfUnitsInCartByItemName(nameOfItem),
        );
        driver.sleep(1 * 1000);
        switch (uomValue) {
            case 'Each':
                expect(Number(await numberOfUnits.getAttribute('title'))).equals(
                    Number(await uomXnumber.getAttribute('title')),
                );
                break;
            case 'Case':
                expect(Number(await numberOfUnits.getAttribute('title'))).equals(
                    Number(await uomXnumber.getAttribute('title')) * 6,
                );
                break;
            default:
                break;
        }
        await orderPage.isSpinnerDone();
        driver.sleep(0.1 * 1000);
    }

    async function clearOrderCenterSearch(): Promise<void> {
        await orderPage.isSpinnerDone();
        await driver.click(orderPage.Search_X_Button);
        driver.sleep(0.1 * 1000);
        await orderPage.isSpinnerDone();
    }
}
