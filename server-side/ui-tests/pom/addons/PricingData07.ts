export class PricingData07 {
    // will be used for packages test
    public testItemsValues = {
        Packages: {
            Hair001: {
                ItemPrice: 44.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 200, Amount: 0, Uom: ['BOX'] },
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 50, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 10, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                        '1 Each': [],
                        '5 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 250.0, // 50.0 * 5
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -75.0,
                                    },
                                ],
                                New: 175.0,
                                Amount: -75.0,
                            },
                        ],
                        '3 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 600.0, // 200.0 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -180.0,
                                    },
                                ],
                                New: 420.0,
                                Amount: -180.0,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '5 Each': [],
                        '3 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 132.75, // 44.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -19.9125,
                                    },
                                ],
                                New: 112.8375,
                                Amount: -19.9125,
                            },
                        ],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '5 Case': 50.0,
                        '3 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '5 Case': 44.25,
                        '3 Box': 44.25,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '5 Case': 50.0,
                        '3 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '5 Case': 44.25,
                        '3 Box': 44.25,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '5 Case': 50.0,
                        '3 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '5 Case': 44.25,
                        '3 Box': 44.25,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '5 Case': 50.0,
                        '3 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '5 Case': 44.25,
                        '3 Box': 44.25,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '5 Case': 50.0,
                        '3 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '5 Case': 44.25,
                        '3 Box': 44.25,
                    },
                },
            },
        },
    };
}
