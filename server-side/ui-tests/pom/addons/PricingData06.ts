export class PricingData06 {
    public testItemsValues = {
        Uom: {
            Hair001: {
                // UOMs
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
                        '2 Each': [],
                        '4 Each': [],
                        '5 Each': [],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 190.0, // 10.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -57.0,
                                    },
                                ],
                                New: 133.0,
                                Amount: -57.0,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 10.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 100.0, // 50.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -30.0,
                                    },
                                ],
                                New: 70.0,
                                Amount: -30.0,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 50.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                        ],
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
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 950.0, // 50.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -285.0,
                                    },
                                ],
                                New: 665.0,
                                Amount: -285.0,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1000.0, // 50.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -300.0,
                                    },
                                ],
                                New: 700.0,
                                Amount: -300.0,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 200.0 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 400.0, // 200.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -120.0,
                                    },
                                ],
                                New: 280.0,
                                Amount: -120.0,
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
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 800.0, // 200.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -240.0,
                                    },
                                ],
                                New: 560.0,
                                Amount: -240.0,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '4 Each': [],
                        '5 Each': [],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 840.75, // 44.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -126.1125,
                                    },
                                ],
                                New: 714.6375,
                                Amount: -126.1125,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 885.0, // 44.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -132.75,
                                    },
                                ],
                                New: 752.25,
                                Amount: -132.75,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 88.5, // 44.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -13.275,
                                    },
                                ],
                                New: 75.225,
                                Amount: -13.275,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 177.0, // 44.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -26.55,
                                    },
                                ],
                                New: 150.45,
                                Amount: -26.55,
                            },
                        ],
                        '5 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 221.25, // 44.25 * 5
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -33.1875,
                                    },
                                ],
                                New: 188.0625,
                                Amount: -33.1875,
                            },
                        ],
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 840.75, // 44.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -126.1125,
                                    },
                                ],
                                New: 714.6375,
                                Amount: -126.1125,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 885.0, // 44.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -132.75,
                                    },
                                ],
                                New: 752.25,
                                Amount: -132.75,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 44.25, // 44.25 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -6.6375,
                                    },
                                ],
                                New: 37.6125,
                                Amount: -6.6375,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 88.5, // 44.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -13.275,
                                    },
                                ],
                                New: 75.225,
                                Amount: -13.275,
                            },
                        ],
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
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 177.0, // 44.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -26.55,
                                    },
                                ],
                                New: 150.45,
                                Amount: -26.55,
                            },
                        ],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '2 Each': 44.25,
                        '4 Each': 44.25,
                        '5 Each': 44.25,
                        '19 Each': 44.25,
                        '20 Each': 44.25,
                        '1 Case': 44.25,
                        '2 Case': 44.25,
                        '4 Case': 44.25,
                        '5 Case': 44.25,
                        '19 Case': 44.25,
                        '20 Case': 44.25,
                        '1 Box': 44.25,
                        '2 Box': 44.25,
                        '3 Box': 44.25,
                        '4 Box': 44.25,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '2 Each': 44.25,
                        '4 Each': 44.25,
                        '5 Each': 44.25,
                        '19 Each': 44.25,
                        '20 Each': 44.25,
                        '1 Case': 44.25,
                        '2 Case': 44.25,
                        '4 Case': 44.25,
                        '5 Case': 44.25,
                        '19 Case': 44.25,
                        '20 Case': 44.25,
                        '1 Box': 44.25,
                        '2 Box': 44.25,
                        '3 Box': 44.25,
                        '4 Box': 44.25,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '2 Each': 44.25,
                        '4 Each': 44.25,
                        '5 Each': 44.25,
                        '19 Each': 44.25,
                        '20 Each': 44.25,
                        '1 Case': 44.25,
                        '2 Case': 44.25,
                        '4 Case': 44.25,
                        '5 Case': 44.25,
                        '19 Case': 44.25,
                        '20 Case': 44.25,
                        '1 Box': 44.25,
                        '2 Box': 44.25,
                        '3 Box': 44.25,
                        '4 Box': 44.25,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '2 Each': 44.25,
                        '4 Each': 44.25,
                        '5 Each': 44.25,
                        '19 Each': 44.25,
                        '20 Each': 44.25,
                        '1 Case': 44.25,
                        '2 Case': 44.25,
                        '4 Case': 44.25,
                        '5 Case': 44.25,
                        '19 Case': 44.25,
                        '20 Case': 44.25,
                        '1 Box': 44.25,
                        '2 Box': 44.25,
                        '3 Box': 44.25,
                        '4 Box': 44.25,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 44.25,
                        '1 Each': 44.25,
                        '2 Each': 44.25,
                        '4 Each': 44.25,
                        '5 Each': 44.25,
                        '19 Each': 44.25,
                        '20 Each': 44.25,
                        '1 Case': 44.25,
                        '2 Case': 44.25,
                        '4 Case': 44.25,
                        '5 Case': 44.25,
                        '19 Case': 44.25,
                        '20 Case': 44.25,
                        '1 Box': 44.25,
                        '2 Box': 44.25,
                        '3 Box': 44.25,
                        '4 Box': 44.25,
                    },
                },
            },
            Hair002: {
                // UOMs
                ItemPrice: 45.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 50, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 10, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                        '1 Each': [],
                        '2 Each': [
                            {
                                Name: 'Discount',
                                Base: 20,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -0.4 }],
                                New: 19.6,
                                Amount: -0.4,
                            },
                        ],
                        '4 Each': [
                            {
                                Name: 'Discount',
                                Base: 40,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -0.8 }],
                                New: 39.2,
                                Amount: -0.8,
                            },
                        ],
                        '5 Each': [
                            {
                                Name: 'Discount',
                                Base: 50,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -2.5 }],
                                New: 47.5,
                                Amount: -2.5,
                            },
                        ],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 190.0, // 10.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -57.0,
                                    },
                                ],
                                New: 133.0,
                                Amount: -57.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 190,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -9.5 }],
                                New: 180.5,
                                Amount: -9.5,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 10.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -20 }],
                                New: 180,
                                Amount: -20,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 100.0, // 50.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -30.0,
                                    },
                                ],
                                New: 70.0,
                                Amount: -30.0,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 50.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -30, Uom: ['CS'] }],
                                New: 170,
                                Amount: -30,
                            },
                        ],
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
                            {
                                Name: 'Discount',
                                Base: 250,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -37.5, Uom: ['CS'] }],
                                New: 212.5,
                                Amount: -37.5,
                            },
                        ],
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 950.0, // 50.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -285.0,
                                    },
                                ],
                                New: 665.0,
                                Amount: -285.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 950,
                                Conditions: [
                                    { Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -142.5, Uom: ['CS'] },
                                ],
                                New: 807.5,
                                Amount: -142.5,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1000.0, // 50.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -300.0,
                                    },
                                ],
                                New: 700.0,
                                Amount: -300.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 1000,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -150, Uom: ['CS'] }],
                                New: 850,
                                Amount: -150,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 200.0 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 400.0, // 200.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -120.0,
                                    },
                                ],
                                New: 280.0,
                                Amount: -120.0,
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
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 800.0, // 200.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -240.0,
                                    },
                                ],
                                New: 560.0,
                                Amount: -240.0,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [
                            {
                                Name: 'Discount',
                                Base: 20,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -0.4 }],
                                New: 19.6,
                                Amount: -0.4,
                            },
                        ],
                        '4 Each': [
                            {
                                Name: 'Discount',
                                Base: 40,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -0.8 }],
                                New: 39.2,
                                Amount: -0.8,
                            },
                        ],
                        '5 Each': [
                            {
                                Name: 'Discount',
                                Base: 50,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -2.5 }],
                                New: 47.5,
                                Amount: -2.5,
                            },
                        ],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 859.75, // 45.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -128.9625,
                                    },
                                ],
                                New: 730.7875,
                                Amount: -128.9625,
                            },
                            {
                                Name: 'Discount',
                                Base: 190,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -9.5 }],
                                New: 180.5,
                                Amount: -9.5,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 905.0, // 45.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -135.75,
                                    },
                                ],
                                New: 769.25,
                                Amount: -135.75,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -20 }],
                                New: 180,
                                Amount: -20,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 90.5, // 45.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -13.575,
                                    },
                                ],
                                New: 76.925,
                                Amount: -13.575,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 181.0, // 45.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -27.15,
                                    },
                                ],
                                New: 153.85,
                                Amount: -27.15,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -30, Uom: ['CS'] }],
                                New: 170,
                                Amount: -30,
                            },
                        ],
                        '5 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 226.25, // 45.25 * 5
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -33.9375,
                                    },
                                ],
                                New: 192.3125,
                                Amount: -33.9375,
                            },
                            {
                                Name: 'Discount',
                                Base: 250,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -37.5, Uom: ['CS'] }],
                                New: 212.5,
                                Amount: -37.5,
                            },
                        ],
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 859.75, // 45.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -128.9625,
                                    },
                                ],
                                New: 730.7875,
                                Amount: -128.9625,
                            },
                            {
                                Name: 'Discount',
                                Base: 950,
                                Conditions: [
                                    { Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -142.5, Uom: ['CS'] },
                                ],
                                New: 807.5,
                                Amount: -142.5,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 905.0, // 45.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -135.75,
                                    },
                                ],
                                New: 769.25,
                                Amount: -135.75,
                            },
                            {
                                Name: 'Discount',
                                Base: 1000,
                                Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -150, Uom: ['CS'] }],
                                New: 850,
                                Amount: -150,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 45.25, // 45.25 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -6.7875,
                                    },
                                ],
                                New: 38.4625,
                                Amount: -6.7875,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 90.5, // 45.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -13.575,
                                    },
                                ],
                                New: 76.925,
                                Amount: -13.575,
                            },
                        ],
                        '3 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 135.75, // 45.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -20.3625,
                                    },
                                ],
                                New: 115.3875,
                                Amount: -20.3625,
                            },
                        ],
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 181.0, // 45.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -27.15,
                                    },
                                ],
                                New: 153.85,
                                Amount: -27.15,
                            },
                        ],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 45.25,
                        '1 Each': 45.25,
                        '2 Each': 45.25,
                        '4 Each': 45.25,
                        '5 Each': 45.25,
                        '19 Each': 45.25,
                        '20 Each': 45.25,
                        '1 Case': 45.25,
                        '2 Case': 45.25,
                        '4 Case': 45.25,
                        '5 Case': 45.25,
                        '19 Case': 45.25,
                        '20 Case': 45.25,
                        '1 Box': 45.25,
                        '2 Box': 45.25,
                        '3 Box': 45.25,
                        '4 Box': 45.25,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0 * 0.98,
                        '4 Each': 10.0 * 0.98,
                        '5 Each': 10.0 * 0.95,
                        '19 Each': 10.0 * 0.95,
                        '20 Each': 10.0 * 0.9,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0 - 7.5,
                        '5 Case': 50.0 - 7.5,
                        '19 Case': 50.0 - 7.5,
                        '20 Case': 50.0 - 7.5,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 45.25,
                        '1 Each': 45.25,
                        '2 Each': 44.34,
                        '4 Each': 44.34,
                        '5 Each': 42.98,
                        '19 Each': 42.98,
                        '20 Each': 40.72,
                        '1 Case': 45.25,
                        '2 Case': 45.25,
                        '4 Case': 45.25 - 7.5,
                        '5 Case': 45.25 - 7.5,
                        '19 Case': 45.25 - 7.5,
                        '20 Case': 45.25 - 7.5,
                        '1 Box': 45.25,
                        '2 Box': 45.25,
                        '3 Box': 45.25,
                        '4 Box': 45.25,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 45.25,
                        '1 Each': 45.25,
                        '2 Each': 45.25,
                        '4 Each': 45.25,
                        '5 Each': 45.25,
                        '19 Each': 45.25,
                        '20 Each': 45.25,
                        '1 Case': 45.25,
                        '2 Case': 45.25,
                        '4 Case': 45.25,
                        '5 Case': 45.25,
                        '19 Case': 45.25,
                        '20 Case': 45.25,
                        '1 Box': 45.25,
                        '2 Box': 45.25,
                        '3 Box': 45.25,
                        '4 Box': 45.25,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0 * 0.98,
                        '4 Each': 10.0 * 0.98,
                        '5 Each': 10.0 * 0.95,
                        '19 Each': 10.0 * 0.95,
                        '20 Each': 10.0 * 0.9,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0 - 7.5,
                        '5 Case': 50.0 - 7.5,
                        '19 Case': 50.0 - 7.5,
                        '20 Case': 50.0 - 7.5,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 45.25,
                        '1 Each': 45.25,
                        '2 Each': 44.34,
                        '4 Each': 44.34,
                        '5 Each': 42.98,
                        '19 Each': 42.98,
                        '20 Each': 40.72,
                        '1 Case': 45.25,
                        '2 Case': 45.25,
                        '4 Case': 45.25 - 7.5,
                        '5 Case': 45.25 - 7.5,
                        '19 Case': 45.25 - 7.5,
                        '20 Case': 45.25 - 7.5,
                        '1 Box': 45.25,
                        '2 Box': 45.25,
                        '3 Box': 45.25,
                        '4 Box': 45.25,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0 * 0.98,
                        '4 Each': 10.0 * 0.98,
                        '5 Each': 10.0 * 0.95,
                        '19 Each': 10.0 * 0.95,
                        '20 Each': 10.0 * 0.9,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0 - 7.5,
                        '5 Case': 50.0 - 7.5,
                        '19 Case': 50.0 - 7.5,
                        '20 Case': 50.0 - 7.5,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 45.25,
                        '1 Each': 45.25,
                        '2 Each': 44.34,
                        '4 Each': 44.34,
                        '5 Each': 42.98,
                        '19 Each': 42.98,
                        '20 Each': 40.72,
                        '1 Case': 45.25,
                        '2 Case': 45.25,
                        '4 Case': 45.25 - 7.5,
                        '5 Case': 45.25 - 7.5,
                        '19 Case': 45.25 - 7.5,
                        '20 Case': 45.25 - 7.5,
                        '1 Box': 45.25,
                        '2 Box': 45.25,
                        '3 Box': 45.25,
                        '4 Box': 45.25,
                    },
                },
            },
            Hair012: {
                // UOMs
                ItemPrice: 55.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 50, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A003', Type: 'S', Value: 10, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                        '1 Each': [],
                        '2 Each': [],
                        '4 Each': [],
                        '5 Each': [
                            {
                                Name: 'Discount',
                                Base: 50,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                                New: 50,
                                Amount: 0,
                            },
                        ],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 190.0, // 10.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -57.0,
                                    },
                                ],
                                New: 133.0,
                                Amount: -57.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 190,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 3, Amount: 3 }],
                                New: 190,
                                Amount: 0,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 10.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                                New: 200,
                                Amount: 0,
                            },
                        ],
                        '1 Case': [
                            {
                                Name: 'Discount',
                                Base: 50,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                                New: 50,
                                Amount: 0,
                            },
                        ],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 100.0, // 50.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -30.0,
                                    },
                                ],
                                New: 70.0,
                                Amount: -30.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 100,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 2, Amount: 2 }],
                                New: 100,
                                Amount: 0,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 50.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 200,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                                New: 200,
                                Amount: 0,
                            },
                        ],
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
                            {
                                Name: 'Discount',
                                Base: 250,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                                New: 250,
                                Amount: 0,
                            },
                        ],
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 950.0, // 50.0 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -285.0,
                                    },
                                ],
                                New: 665.0,
                                Amount: -285.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 950,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 5, Amount: 5 }],
                                New: 950,
                                Amount: 0,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1000.0, // 50.0 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -300.0,
                                    },
                                ],
                                New: 700.0,
                                Amount: -300.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 1000,
                                Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 6, Amount: 6 }],
                                New: 1000,
                                Amount: 0,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 200.0, // 200.0 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -60.0,
                                    },
                                ],
                                New: 140.0,
                                Amount: -60.0,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 400.0, // 200.0 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -120.0,
                                    },
                                ],
                                New: 280.0,
                                Amount: -120.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 400,
                                Conditions: [
                                    { Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1, Uom: ['BOX'] },
                                ],
                                New: 400,
                                Amount: 0,
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
                            {
                                Name: 'Discount',
                                Base: 600,
                                Conditions: [
                                    { Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1, Uom: ['BOX'] },
                                ],
                                New: 600,
                                Amount: 0,
                            },
                        ],
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 800.0, // 200.0 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -240.0,
                                    },
                                ],
                                New: 560.0,
                                Amount: -240.0,
                            },
                            {
                                Name: 'Discount',
                                Base: 800,
                                Conditions: [
                                    { Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1, Uom: ['BOX'] },
                                ],
                                New: 800,
                                Amount: 0,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '4 Each': [],
                        '5 Each': [],
                        '19 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1049.75, // 55.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -157.4625,
                                    },
                                ],
                                New: 892.2875,
                                Amount: -157.4625,
                            },
                        ],
                        '20 Each': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1105.0, // 55.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -165.75,
                                    },
                                ],
                                New: 939.25,
                                Amount: -165.75,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 110.5, // 55.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -16.575,
                                    },
                                ],
                                New: 93.925,
                                Amount: -16.575,
                            },
                        ],
                        '4 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 221.0, // 55.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -33.15,
                                    },
                                ],
                                New: 187.85,
                                Amount: -33.15,
                            },
                        ],
                        '5 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 276.25, // 55.25 * 5
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -41.4375,
                                    },
                                ],
                                New: 234.8125,
                                Amount: -41.4375,
                            },
                        ],
                        '19 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1049.75, // 55.25 * 19
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -157.4625,
                                    },
                                ],
                                New: 892.2875,
                                Amount: -157.4625,
                            },
                        ],
                        '20 Case': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 1105.0, // 55.25 * 20
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -165.75,
                                    },
                                ],
                                New: 939.25,
                                Amount: -165.75,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 55.25, // 55.25 * 1
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -8.2875,
                                    },
                                ],
                                New: 46.9625,
                                Amount: -8.2875,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 110.5, // 55.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -16.575,
                                    },
                                ],
                                New: 93.925,
                                Amount: -16.575,
                            },
                        ],
                        '3 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 165.75, // 55.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -24.8625,
                                    },
                                ],
                                New: 140.8875,
                                Amount: -24.8625,
                            },
                        ],
                        '4 Box': [
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 221.0, // 55.25 * 4
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -33.15,
                                    },
                                ],
                                New: 187.85,
                                Amount: -33.15,
                            },
                        ],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 55.25,
                        '1 Each': 55.25,
                        '2 Each': 55.25,
                        '4 Each': 55.25,
                        '5 Each': 55.25,
                        '19 Each': 55.25,
                        '20 Each': 55.25,
                        '1 Case': 55.25,
                        '2 Case': 55.25,
                        '4 Case': 55.25,
                        '5 Case': 55.25,
                        '19 Case': 55.25,
                        '20 Case': 55.25,
                        '1 Box': 55.25,
                        '2 Box': 55.25,
                        '3 Box': 55.25,
                        '4 Box': 55.25,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 55.25,
                        '1 Each': 55.25,
                        '2 Each': 55.25,
                        '4 Each': 55.25,
                        '5 Each': 55.25,
                        '19 Each': 55.25,
                        '20 Each': 55.25,
                        '1 Case': 55.25,
                        '2 Case': 55.25,
                        '4 Case': 55.25,
                        '5 Case': 55.25,
                        '19 Case': 55.25,
                        '20 Case': 55.25,
                        '1 Box': 55.25,
                        '2 Box': 55.25,
                        '3 Box': 55.25,
                        '4 Box': 55.25,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 55.25,
                        '1 Each': 55.25,
                        '2 Each': 55.25,
                        '4 Each': 55.25,
                        '5 Each': 55.25,
                        '19 Each': 55.25,
                        '20 Each': 55.25,
                        '1 Case': 55.25,
                        '2 Case': 55.25,
                        '4 Case': 55.25,
                        '5 Case': 55.25,
                        '19 Case': 55.25,
                        '20 Case': 55.25,
                        '1 Box': 55.25,
                        '2 Box': 55.25,
                        '3 Box': 55.25,
                        '4 Box': 55.25,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 55.25,
                        '1 Each': 55.25,
                        '2 Each': 55.25,
                        '4 Each': 55.25,
                        '5 Each': 55.25,
                        '19 Each': 55.25,
                        '20 Each': 55.25,
                        '1 Case': 55.25,
                        '2 Case': 55.25,
                        '4 Case': 55.25,
                        '5 Case': 55.25,
                        '19 Case': 55.25,
                        '20 Case': 55.25,
                        '1 Box': 55.25,
                        '2 Box': 55.25,
                        '3 Box': 55.25,
                        '4 Box': 55.25,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '4 Each': 10.0,
                        '5 Each': 10.0,
                        '19 Each': 10.0,
                        '20 Each': 10.0,
                        '1 Case': 50.0,
                        '2 Case': 50.0,
                        '4 Case': 50.0,
                        '5 Case': 50.0,
                        '19 Case': 50.0,
                        '20 Case': 50.0,
                        '1 Box': 200.0,
                        '2 Box': 200.0,
                        '3 Box': 200.0,
                        '4 Box': 200.0,
                    },
                    OtherAcc: {
                        baseline: 55.25,
                        '1 Each': 55.25,
                        '2 Each': 55.25,
                        '4 Each': 55.25,
                        '5 Each': 55.25,
                        '19 Each': 55.25,
                        '20 Each': 55.25,
                        '1 Case': 55.25,
                        '2 Case': 55.25,
                        '4 Case': 55.25,
                        '5 Case': 55.25,
                        '19 Case': 55.25,
                        '20 Case': 55.25,
                        '1 Box': 55.25,
                        '2 Box': 55.25,
                        '3 Box': 55.25,
                        '4 Box': 55.25,
                    },
                },
            },
            MaFa24: {
                // UOMs - additional item just for Acc01
                ItemPrice: 34.5,
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        cart: 34.5,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        cart: 0.0,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        cart: 0.0,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        cart: 0.0,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        cart: 0.0,
                    },
                },
            },
            Drug0009: {
                ItemPrice: 38.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [
                            {
                                Name: 'Base',
                                Base: 38.25,
                                Conditions: [
                                    {
                                        Name: 'ZBASE_A003',
                                        Type: 'S',
                                        Value: 30,
                                        Amount: 141.75,
                                    },
                                ],
                                New: 180,
                                Amount: 141.75,
                            },
                        ],
                        '1 Fraction': [
                            {
                                Name: 'Base',
                                Base: 38.25,
                                Conditions: [{ Name: 'ZBASE_A003', Type: 'S', Value: 30, Amount: -17.25 }],
                                New: 21,
                                Amount: -17.25,
                            },
                        ],
                        '2 Fraction': [
                            {
                                Name: 'Base',
                                Base: 38.25,
                                Conditions: [{ Name: 'ZBASE_A003', Type: 'S', Value: 30, Amount: -17.25 }],
                                New: 21,
                                Amount: -17.25,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Fraction': [],
                        '2 Fraction': [],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    Acc01: {
                        baseline: 180.0,
                        '1 Fraction': 21.0,
                        '2 Fraction': 21.0,
                    },
                    OtherAcc: {
                        baseline: 38.25,
                        '1 Fraction': 38.25,
                        '2 Fraction': 38.25,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 180.0,
                        '1 Fraction': 21.0,
                        '2 Fraction': 21.0,
                    },
                    OtherAcc: {
                        baseline: 38.25,
                        '1 Fraction': 38.25,
                        '2 Fraction': 38.25,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        baseline: 180.0,
                        '1 Fraction': 21.0,
                        '2 Fraction': 21.0,
                    },
                    OtherAcc: {
                        baseline: 38.25,
                        '1 Fraction': 38.25,
                        '2 Fraction': 38.25,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    Acc01: {
                        baseline: 180.0,
                        '1 Fraction': 21.0,
                        '2 Fraction': 21.0,
                    },
                    OtherAcc: {
                        baseline: 38.25,
                        '1 Fraction': 38.25,
                        '2 Fraction': 38.25,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    Acc01: {
                        baseline: 180.0,
                        '1 Fraction': 21.0,
                        '2 Fraction': 21.0,
                    },
                    OtherAcc: {
                        baseline: 38.25,
                        '1 Fraction': 38.25,
                        '2 Fraction': 38.25,
                    },
                },
            },
        },
        Totals: {
            MaNa142: {
                ItemPrice: 37.75,
                Acc01: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0, // 40.0 * 0 + 8.0 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0, // Math.round((40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 48.0, // 40.0 * 1 + 8.0 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 1 + 8.0 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 1)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 3,
                        uom2: 'Box',
                        qty2: 4,
                        unitQuantity: 114, // 3 * 6 + 4 * 24,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 760.0, // 40.0 * 3 + 160.0 * 4,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 3 + 160.0 * 4 - (40.0 * 3 + 160.0 * 4) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 3 + 160.0 * 4) / (40.0 * 3 + 160.0 * 4)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 160.0,
                        PriceDiscountUnitPriceAfter2: 160.0,
                        PriceTaxUnitPriceAfter2: 160.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 266,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 6, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 160, Amount: 488, Uom: ['BOX'] },
                                ],
                                New: 760,
                                Amount: 494,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 760,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -228 }],
                                New: 532,
                                Amount: -228,
                            },
                        ],
                    },
                },
                OtherAcc: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0.0, // 40.0 * 0 + 8.0 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 48.0, // 40.0 * 1 + 8.0 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 1 + 8.0 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 1)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 3,
                        uom2: 'Box',
                        qty2: 4,
                        unitQuantity: 114, // 3 * 6 + 4 * 24,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 760.0, // 40.0 * 3 + 160.0 * 4,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 3 + 160.0 * 4 - (40.0 * 3 + 160.0 * 4) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 3 + 160.0 * 4) / (40.0 * 3 + 160.0 * 4)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 160.0,
                        PriceDiscountUnitPriceAfter2: 160.0,
                        PriceTaxUnitPriceAfter2: 160.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 266,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 6, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 160, Amount: 488, Uom: ['BOX'] },
                                ],
                                New: 760,
                                Amount: 494,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 760,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -228 }],
                                New: 532,
                                Amount: -228,
                            },
                        ],
                    },
                },
            },
            MaNa23: {
                ItemPrice: 40.25,
                Acc01: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0.0, // 48.0 * 0 + 9.6 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((48.0 * 0 + 9.6 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 8.0, // Math.floor((48.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 48.0, // PriceBaseUnitPriceAfter1 * 1.2 (Tax 20%) -> 40.0 * 1.2 -> 48.0
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 9.6, // PriceBaseUnitPriceAfter2 * 1.2 (Tax 20%) -> 8.0 * 1.2 -> 9.6
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                            {
                                Name: 'Tax',
                                Base: 0,
                                Conditions: [{ Name: 'MTAX_A002', Type: '%', Value: 20, Amount: 0 }],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 57.6, // 48.0 * 1 + 9.6 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 9.6, // Math.round((48.0 * 1 + 9.6 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 16.66, // Math.floor(((1 - (40.0 * 1 + 8.0 * 1) / (48.0 * 1 + 9.6 * 1)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 8.0, // Math.floor((48.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 48.0, // PriceBaseUnitPriceAfter1 * 1.2 (Tax 20%) -> 40.0 * 1.2 -> 48.0
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 9.6, // PriceBaseUnitPriceAfter2 * 1.2 (Tax 20%) -> 8.0 * 1.2 -> 9.6
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 80.5,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: -0.25, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -32.25, Uom: ['EA'] },
                                ],
                                New: 48,
                                Amount: -32.5,
                            },
                            {
                                Name: 'Tax',
                                Base: 48,
                                Conditions: [{ Name: 'MTAX_A002', Type: '%', Value: 20, Amount: 9.6 }],
                                New: 57.6,
                                Amount: 9.6,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 2,
                        uom2: 'Each',
                        qty2: 3,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 124.8, // 48.0 * 2 + 9.6 * 3,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 20.8, // Math.round((48.0 * 2 + 9.6 * 3 - (40.0 * 2 + 8.0 * 3) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 16.66, // Math.floor(((1 - (40.0 * 2 + 8.0 * 3) / (48.0 * 2 + 9.6 * 3)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 8.0, // Math.floor((48.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 48.0, // PriceBaseUnitPriceAfter1 * 1.2 (Tax 20%) -> 40.0 * 1.2 -> 48.0
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 9.6, // PriceBaseUnitPriceAfter2 * 1.2 (Tax 20%) -> 8.0 * 1.2 -> 9.6
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 201.25,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: -0.5, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -96.75, Uom: ['EA'] },
                                ],
                                New: 104,
                                Amount: -97.25,
                            },
                            {
                                Name: 'Tax',
                                Base: 104,
                                Conditions: [{ Name: 'MTAX_A002', Type: '%', Value: 20, Amount: 20.8 }],
                                New: 124.8,
                                Amount: 20.8,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 104,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -31.2 }],
                                New: 72.8,
                                Amount: -31.2,
                            },
                        ],
                    },
                },
                OtherAcc: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0.0, // 40.0 * 0 + 8.0 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 48.0, // 40.0 * 1 + 8.0 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 1 + 8.0 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 1)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 80.5,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: -0.25, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -32.25, Uom: ['EA'] },
                                ],
                                New: 48,
                                Amount: -32.5,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 2,
                        uom2: 'Each',
                        qty2: 3,
                        unitQuantity: 15, // 6 * 2 + 1 * 3
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 104.0, // 40.0 * 2 + 8.0 * 3,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 2 + 8.0 * 3 - (40.0 * 2 + 8.0 * 3) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // Math.floor(((1 - (40.0 * 2 + 8.0 * 3) / (40.0 * 2 + 8.0 * 3)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // /// // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 201.25,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: -0.5, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -96.75, Uom: ['EA'] },
                                ],
                                New: 104,
                                Amount: -97.25,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 104,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -31.2 }],
                                New: 72.8,
                                Amount: -31.2,
                            },
                        ],
                    },
                },
            },
            MaNa18: {
                ItemPrice: 39.0,
                Acc01: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0.0, // 40.0 * 0 + 8.0 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // /// // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 6 * 1 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 47.6, // 40.0 * 1 + 8.0 * 0.95 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: -0.4, // Math.round((40.0 * 1 + 8.0 * 0.95 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: -0.84, // Math.round((1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 0.95 * 1) + Number.EPSILON) * 10000,) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 7.6, // 8.0 * 0.95,
                        PriceTaxUnitPriceAfter2: 7.6, // 8.0 * 0.95,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 78,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 1, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -31, Uom: ['EA'] },
                                ],
                                New: 48,
                                Amount: -30,
                            },
                            {
                                Name: 'Discount',
                                Base: 48,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -0.4, Uom: ['EA'] }],
                                New: 47.6,
                                Amount: -0.4,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 3,
                        uom2: 'Box',
                        qty2: 4,
                        unitQuantity: 114, // 3 * 6 + 4 * 24,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 735.2, // 40.0 * 0.9 * 3 + 160.0 * 0.98 * 4,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: -24.8, // Math.round((40.0 * 0.9 * 3 + 160.0 * 0.98 * 4 - (40.0 * 3 + 160.0 * 4) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: -3.37, // Math.round(((1 - (40.0 * 3 + 160.0 * 4) / (40.0 * 0.9 * 3 + 160.0 * 0.98 * 4)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: -4.0, // Math.floor((40.0 * 0.9 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceTaxUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 160.0,
                        PriceDiscountUnitPriceAfter2: 156.8, // 160.0 * 0.98,
                        PriceTaxUnitPriceAfter2: 156.8, // 160.0 * 0.98,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 273,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 3, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 160, Amount: 484, Uom: ['BOX'] },
                                ],
                                New: 760,
                                Amount: 487,
                            },
                            {
                                Name: 'Discount',
                                Base: 760,
                                Conditions: [
                                    { Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -12, Uom: ['CS'] },
                                    { Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -12.8, Uom: ['BOX'] },
                                ],
                                New: 735.2,
                                Amount: -24.8,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 760,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -228 }],
                                New: 532,
                                Amount: -228,
                            },
                        ],
                    },
                },
                OtherAcc: {
                    baseline: {
                        uom1: 'Case',
                        qty1: 0,
                        uom2: 'Each',
                        qty2: 0,
                        unitQuantity: 0,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 0.0, // 40.0 * 0 + 8.0 * 0,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: 0.0, // Math.round((40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: 0.0, // (1 - 0.0 / 0.0) * 100
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 8.0,
                        PriceTaxUnitPriceAfter2: 8.0,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 0, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: 0, Uom: ['EA'] },
                                ],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    state1: {
                        uom1: 'Case',
                        qty1: 1,
                        uom2: 'Each',
                        qty2: 1,
                        unitQuantity: 7, // 1 * 6 + 1 * 1
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 47.6, // 40.0 * 1 + 8.0 * 0.95 * 1,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: -0.4, // Math.round((40.0 * 1 + 8.0 * 0.95 * 1 - (40.0 * 1 + 8.0 * 1) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100
                        // // (1 - (operand2 / operand1)) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: -0.84, // Math.round(((1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 0.95 * 1)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: 0.0, // Math.floor((40.0 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 40.0,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 40.0,
                        PriceTaxUnitPriceAfter1: 40.0,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 8.0,
                        PriceDiscountUnitPriceAfter2: 7.6, // 8.0 * 0.95,
                        PriceTaxUnitPriceAfter2: 7.6, // 8.0 * 0.95,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 78,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 1, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 8, Amount: -31, Uom: ['EA'] },
                                ],
                                New: 48,
                                Amount: -30,
                            },
                            {
                                Name: 'Discount',
                                Base: 48,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -0.4, Uom: ['EA'] }],
                                New: 47.6,
                                Amount: -0.4,
                            },
                        ],
                    },
                    state2: {
                        uom1: 'Case',
                        qty1: 3,
                        uom2: 'Box',
                        qty2: 4,
                        unitQuantity: 114, // 3 * 6 + 4 * 24,
                        // PriceTaxTotal = PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                        PriceTaxTotal: 735.2, // 40.0 * 0.9 * 3 + 160.0 * 0.98 * 4,
                        // PriceTaxTotalDiff = TaxTotal - BaseTotal
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalDiff: -24.8, // Math.round((40.0 * 0.9 * 3 + 160.0 * 0.98 * 4 - (40.0 * 3 + 160.0 * 4) + Number.EPSILON) * 100) / 100,
                        // PriceTaxTotalPercent = (1 - (BaseTotal / TaxTotal)) * 100 || (1 - (operand2 / operand1)) * 100
                        // // operand1 -> Block=Tax , operand2 -> Block=Base
                        PriceTaxTotalPercent: -3.37, // Math.round(((1 - (40.0 * 3 + 160.0 * 4) / (40.0 * 0.9 * 3 + 160.0 * 0.98 * 4)) * 100 + Number.EPSILON) * 100) / 100,
                        // PriceTaxUnitDiff = PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1
                        // // operand1 - operand2 || operand1 -> Block=Tax , operand2 -> Block=Base
                        // // // by units , UomIndex = 1
                        PriceTaxUnitDiff: -4.0, //Math.floor((40.0 * 0.9 - 40.0 + Number.EPSILON) * 100) / 100,
                        PriceBaseUnitPriceAfter1: 40.0,
                        PriceDiscountUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceGroupDiscountUnitPriceAfter1: 40.0,
                        PriceManualLineUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceTaxUnitPriceAfter1: 36.0, // 40.0 * 0.9,
                        PriceDiscount2UnitPriceAfter1: 40.0,
                        PriceBaseUnitPriceAfter2: 160.0,
                        PriceDiscountUnitPriceAfter2: 156.8, // 160.0 * 0.98,
                        PriceTaxUnitPriceAfter2: 156.8, // 160.0 * 0.98,
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 273,
                                Conditions: [
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 40, Amount: 3, Uom: ['CS'] },
                                    { Name: 'ZBASE_A005', Type: 'S', Value: 160, Amount: 484, Uom: ['BOX'] },
                                ],
                                New: 760,
                                Amount: 487,
                            },
                            {
                                Name: 'Discount',
                                Base: 760,
                                Conditions: [
                                    { Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -12, Uom: ['CS'] },
                                    { Name: 'ZDS1_A001', Type: '%', Value: -2, Amount: -12.8, Uom: ['BOX'] },
                                ],
                                New: 735.2,
                                Amount: -24.8,
                            },
                            {
                                Name: 'MultipleValuesAccount',
                                Base: 760,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -114 }],
                                New: 646,
                                Amount: -114,
                            },
                        ],
                    },
                },
            },
        },
        Exclusion: {
            'PMS-03-FBC6_l_2': {
                ItemPrice: 50.25,
                Acc01: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 600.0, // base is 100 each and at baseline the presented value is of case - meaning 100 * 6
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 0 }],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 10.0, // base (100) - discount2 (10)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12562.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12437.5 }],
                                New: 25000,
                                Amount: 12437.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25000,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2500 }],
                                New: 22500,
                                Amount: -2500,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25000,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7500 }],
                                New: 17500,
                                Amount: -7500,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 10.0, // base (100) - discount2 (10)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12713.25,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12586.75 }],
                                New: 25300,
                                Amount: 12586.75,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25300,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2530 }],
                                New: 22770,
                                Amount: -2530,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25300,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7590 }],
                                New: 17710,
                                Amount: -7590,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 10.0, // base (100) - discount2 (10)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12813.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12686.25 }],
                                New: 25500,
                                Amount: 12686.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25500,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2550 }],
                                New: 22950,
                                Amount: -2550,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25500,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7650 }],
                                New: 17850,
                                Amount: -7650,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 40.0 - 25.0, // base (100) - discount2 (40 + 25)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 13065,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12935 }],
                                New: 26000,
                                Amount: 12935,
                            },
                            {
                                Name: 'Discount2',
                                Base: 26000,
                                Conditions: [
                                    { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -10400 },
                                    { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -6500 },
                                ],
                                New: 9100,
                                Amount: -16900,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 26000,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7800 }],
                                New: 18200,
                                Amount: -7800,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 20.0, // base (100) - discount2 (20)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 13818.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 13681.25 }],
                                New: 27500,
                                Amount: 13681.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27500,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -5500 },
                                    // { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -11000 },
                                    // { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -6875 },
                                ],
                                New: 22000,
                                Amount: -5500,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27500,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -8250 }],
                                New: 19250,
                                Amount: -8250,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 60.0, // base (600) - discount2 (10% = 60)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2110.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 23089.5 }],
                                New: 25200,
                                Amount: 23089.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25200,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2520 }],
                                New: 22680,
                                Amount: -2520,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25200,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7560 }],
                                New: 17640,
                                Amount: -7560,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 60.0, // base (600) - discount2 (10% = 60)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2160.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 23639.25 }],
                                New: 25800,
                                Amount: 23639.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25800,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2580 }],
                                New: 23220,
                                Amount: -2580,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25800,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -7740 }],
                                New: 18060,
                                Amount: -7740,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 240.0 - 150.0, // base (600) - discount2 (40% = 240 + 25% = 150)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2261.25,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 24738.75 }],
                                New: 27000,
                                Amount: 24738.75,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27000,
                                Conditions: [
                                    { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -10800 },
                                    { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -6750 },
                                ],
                                New: 9450,
                                Amount: -17550,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27000,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -8100 }],
                                New: 18900,
                                Amount: -8100,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 120.0, // base (600) - discount2 (20% = 120)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2311.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 25288.5 }],
                                New: 27600,
                                Amount: 25288.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27600,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -5520 },
                                    // { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -11040 },
                                    // { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -6900 },
                                ],
                                New: 22080,
                                Amount: -5520,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27600,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -8280 }],
                                New: 19320,
                                Amount: -8280,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0, // base (100) box do not have it's own UOM so it present the Each UOM
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 502.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 497.5 }],
                                New: 1000,
                                Amount: 497.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1000,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -300 }],
                                New: 700,
                                Amount: -300,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 40.0 - 25.0, // base (100) - discount2 (40 + 25)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 552.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 547.25 }],
                                New: 1100,
                                Amount: 547.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1100,
                                Conditions: [
                                    { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -440 },
                                    { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -275 },
                                ],
                                New: 385,
                                Amount: -715,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1100,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -330 }],
                                New: 770,
                                Amount: -330,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 20.0, // base (100) - discount2 (20)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 603,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 597 }],
                                New: 1200,
                                Amount: 597,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1200,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -240 },
                                    // { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -480 },
                                    // { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -300 },
                                ],
                                New: 960,
                                Amount: -240,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1200,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -360 }],
                                New: 840,
                                Amount: -360,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 80.0, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 603,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 597 }],
                                New: 1200,
                                Amount: 597,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1200,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -240 },
                                    // { Name: 'ZDS6_A003', Type: '%', Value: -40, Amount: -480 },
                                    // { Name: 'ZDS7_A002', Type: '%', Value: -25, Amount: -300 },
                                ],
                                New: 960,
                                Amount: -240,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1200,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -360 }],
                                New: 840,
                                Amount: -360,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
                OtherAcc: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 600.0, // base is 100 each and at baseline the presented value is of case - meaning 100 * 6
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 0 }],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 10.0, // base (100) - discount2 (10)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12562.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12437.5 }],
                                New: 25000,
                                Amount: 12437.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25000,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2500 }],
                                New: 22500,
                                Amount: -2500,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25000,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3750 }],
                                New: 21250,
                                Amount: -3750,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 10.0, // base (100) - discount2 (10)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12713.25,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12586.75 }],
                                New: 25300,
                                Amount: 12586.75,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25300,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2530 }],
                                New: 22770,
                                Amount: -2530,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25300,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3795 }],
                                New: 21505,
                                Amount: -3795,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 15.0, // base (100) - discount2 (15)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 12813.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12686.25 }],
                                New: 25500,
                                Amount: 12686.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25500,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -3825 }],
                                New: 21675,
                                Amount: -3825,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25500,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3825 }],
                                New: 21675,
                                Amount: -3825,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 15.0, // base (100) - discount2 (15)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 13065,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 12935 }],
                                New: 26000,
                                Amount: 12935,
                            },
                            {
                                Name: 'Discount2',
                                Base: 26000,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -3900 }],
                                New: 22100,
                                Amount: -3900,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 26000,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3900 }],
                                New: 22100,
                                Amount: -3900,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 20.0, // base (100) - discount2 (20)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 13818.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 13681.25 }],
                                New: 27500,
                                Amount: 13681.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27500,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -5500 },
                                    // { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -4125 },
                                ],
                                New: 22000,
                                Amount: -5500,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27500,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -4125 }],
                                New: 23375,
                                Amount: -4125,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 60.0, // base (600) - discount2 (10% = 60)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2110.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 23089.5 }],
                                New: 25200,
                                Amount: 23089.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25200,
                                Conditions: [{ Name: 'ZDS7_A005', Type: '%', Value: -10, Amount: -2520 }],
                                New: 22680,
                                Amount: -2520,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25200,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3780 }],
                                New: 21420,
                                Amount: -3780,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 90.0, // base (600) - discount2 (15% = 90)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2160.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 23639.25 }],
                                New: 25800,
                                Amount: 23639.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 25800,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -3870 }],
                                New: 21930,
                                Amount: -3870,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 25800,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -3870 }],
                                New: 21930,
                                Amount: -3870,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 90.0, // base (600) - discount2 (15% = 90)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2261.25,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 24738.75 }],
                                New: 27000,
                                Amount: 24738.75,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27000,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -4050 }],
                                New: 22950,
                                Amount: -4050,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27000,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -4050 }],
                                New: 22950,
                                Amount: -4050,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 600.0 - 120.0, // base (600) - discount2 (20% = 120)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 2311.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 25288.5 }],
                                New: 27600,
                                Amount: 25288.5,
                            },
                            {
                                Name: 'Discount2',
                                Base: 27600,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -5520 },
                                    // { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -4140 },
                                ],
                                New: 22080,
                                Amount: -5520,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 27600,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -4140 }],
                                New: 23460,
                                Amount: -4140,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0, // base (100) box do not have it's own UOM so it present the Each UOM
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 502.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 497.5 }],
                                New: 1000,
                                Amount: 497.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1000,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -150 }],
                                New: 850,
                                Amount: -150,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 15.0, // base (100) - discount2 (15)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 552.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 547.25 }],
                                New: 1100,
                                Amount: 547.25,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1100,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -165 }],
                                New: 935,
                                Amount: -165,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1100,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -165 }],
                                New: 935,
                                Amount: -165,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 100.0 - 20.0, // base (100) - discount2 (20)
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 603,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 597 }],
                                New: 1200,
                                Amount: 597,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1200,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -240 },
                                    // { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -180 },
                                ],
                                New: 960,
                                Amount: -240,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1200,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -180 }],
                                New: 1020,
                                Amount: -180,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 80.0, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Base',
                                Base: 603,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 100, Amount: 597 }],
                                New: 1200,
                                Amount: 597,
                            },
                            {
                                Name: 'Discount2',
                                Base: 1200,
                                Conditions: [
                                    { Name: 'ZDS4_A001', Type: '%', Value: -20, Amount: -240 },
                                    // { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -180 },
                                ],
                                New: 960,
                                Amount: -240,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1200,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -180 }],
                                New: 1020,
                                Amount: -180,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
            },
            MaLi36: {
                ItemPrice: 36.75,
                Acc01: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no set is applied - initial item price
                        NPMCalcMessage: [],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9187.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2756.25 }],
                                New: 6431.25,
                                Amount: -2756.25,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9187.5,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -459.375 }],
                                New: 8728.125,
                                Amount: -459.375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 6431.25,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -321.5625 }],
                                New: 6109.7,
                                Amount: -321.55,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9297.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2789.325 }],
                                New: 6508.425,
                                Amount: -2789.325,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9297.75,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -464.8875 }],
                                New: 8832.8625,
                                Amount: -464.8875,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 6508.425,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -325.4213 }],
                                New: 6183.0164,
                                Amount: -325.4086,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9371.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2811.375 }],
                                New: 6559.875,
                                Amount: -2811.375,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9371.25,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -468.5625 }],
                                New: 8902.6875,
                                Amount: -468.5625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 6559.875,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -327.9938 }],
                                New: 6231.894,
                                Amount: -327.981,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 9555,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -3822 }],
                                New: 5733,
                                Amount: -3822,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9555,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2866.5 }],
                                New: 6688.5,
                                Amount: -2866.5,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9555,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -477.75 }],
                                New: 9077.25,
                                Amount: -477.75,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 6688.5,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -334.425 }],
                                New: 6354.088,
                                Amount: -334.412,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -4042.5 }],
                                New: 6063.75,
                                Amount: -4042.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -3031.875 }],
                                New: 7074.375,
                                Amount: -3031.875,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -505.3125 }],
                                New: 9600.9375,
                                Amount: -505.3125,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 7074.375,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -353.7188 }],
                                New: 6720.67,
                                Amount: -353.705,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1543.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -463.05 }],
                                New: 1080.45,
                                Amount: -463.05,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1543.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -385.875, Uom: ['CS'] },
                                ],
                                New: 1157.625,
                                Amount: -385.875,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1080.45,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -270.1125, Uom: ['CS'] },
                                ],
                                New: 810.3396,
                                Amount: -270.1104,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1580.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -474.075 }],
                                New: 1106.175,
                                Amount: -474.075,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1580.25,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -395.0625, Uom: ['CS'] },
                                ],
                                New: 1185.1875,
                                Amount: -395.0625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1106.175,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -276.5438, Uom: ['CS'] },
                                ],
                                New: 829.6334,
                                Amount: -276.5416,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1653.75,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -661.5 }],
                                New: 992.25,
                                Amount: -661.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1653.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -496.125 }],
                                New: 1157.625,
                                Amount: -496.125,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1653.75,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -413.4375, Uom: ['CS'] },
                                ],
                                New: 1240.3125,
                                Amount: -413.4375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1157.625,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -289.4063, Uom: ['CS'] },
                                ],
                                New: 868.221,
                                Amount: -289.404,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1690.5,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -676.2 }],
                                New: 1014.3,
                                Amount: -676.2,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1690.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -507.15 }],
                                New: 1183.35,
                                Amount: -507.15,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1690.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -422.625, Uom: ['CS'] },
                                ],
                                New: 1267.875,
                                Amount: -422.625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1183.35,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -295.8375, Uom: ['CS'] },
                                ],
                                New: 887.5148,
                                Amount: -295.8352,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 367.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -110.25 }],
                                New: 257.25,
                                Amount: -110.25,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 367.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -55.125, Uom: ['BOX'] },
                                ],
                                New: 312.375,
                                Amount: -55.125,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 257.25,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -38.5875, Uom: ['BOX'] },
                                ],
                                New: 218.663,
                                Amount: -38.587,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 404.25,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -161.7 }],
                                New: 242.55,
                                Amount: -161.7,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 404.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -121.275 }],
                                New: 282.975,
                                Amount: -121.275,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 404.25,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -60.6375, Uom: ['BOX'] },
                                ],
                                New: 343.6125,
                                Amount: -60.6375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 282.975,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -42.4463, Uom: ['BOX'] },
                                ],
                                New: 240.5293,
                                Amount: -42.4457,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 441,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -176.4 }],
                                New: 264.6,
                                Amount: -176.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 441,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -132.3 }],
                                New: 308.7,
                                Amount: -132.3,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 441,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -66.15, Uom: ['BOX'] },
                                ],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 308.7,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -46.305, Uom: ['BOX'] },
                                ],
                                New: 262.3956,
                                Amount: -46.3044,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 22.05, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 441,
                                Conditions: [{ Name: 'ZDS6_A004', Type: '%', Value: -40, Amount: -176.4 }],
                                New: 264.6,
                                Amount: -176.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 441,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -132.3 }],
                                New: 308.7,
                                Amount: -132.3,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 441,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -66.15, Uom: ['BOX'] },
                                ],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 308.7,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -46.305, Uom: ['BOX'] },
                                ],
                                New: 262.3956,
                                Amount: -46.3044,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
                OtherAcc: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no set is applied - initial item price
                        NPMCalcMessage: [],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9187.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1378.125 }],
                                New: 7809.375,
                                Amount: -1378.125,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9187.5,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -459.375 }],
                                New: 8728.125,
                                Amount: -459.375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 7809.375,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -390.4688 }],
                                New: 7418.9,
                                Amount: -390.475,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9297.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1394.6625 }],
                                New: 7903.0875,
                                Amount: -1394.6625,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9297.75,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -464.8875 }],
                                New: 8832.8625,
                                Amount: -464.8875,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 7903.0875,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -395.1544 }],
                                New: 7507.9268,
                                Amount: -395.1607,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 31.23, // 36.75 * 0.85 = 31.2375 (15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 9371.25,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -1405.6875 }],
                                New: 7965.5625,
                                Amount: -1405.6875,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9371.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1405.6875 }],
                                New: 7965.5625,
                                Amount: -1405.6875,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9371.25,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -468.5625 }],
                                New: 8902.6875,
                                Amount: -468.5625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 7965.5625,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -398.2781 }],
                                New: 7567.278,
                                Amount: -398.2845,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 9555,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -3822 }],
                                New: 5733,
                                Amount: -3822,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 9555,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1433.25 }],
                                New: 8121.75,
                                Amount: -1433.25,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 9555,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -477.75 }],
                                New: 9077.25,
                                Amount: -477.75,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 8121.75,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -406.0875 }],
                                New: 7715.656,
                                Amount: -406.094,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -4042.5 }],
                                New: 6063.75,
                                Amount: -4042.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1515.9375 }],
                                New: 8590.3125,
                                Amount: -1515.9375,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 10106.25,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -505.3125 }],
                                New: 9600.9375,
                                Amount: -505.3125,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 8590.3125,
                                Conditions: [{ Name: 'ZDM2_A007', Type: '%', Value: -5, Amount: -429.5156 }],
                                New: 8160.79,
                                Amount: -429.5225,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1543.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -231.525 }],
                                New: 1311.975,
                                Amount: -231.525,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1543.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -385.875, Uom: ['CS'] },
                                ],
                                New: 1157.625,
                                Amount: -385.875,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1311.975,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -327.9938, Uom: ['CS'] },
                                ],
                                New: 983.9802,
                                Amount: -327.9948,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 31.23, // 36.75 * 0.85 = 31.2375 (15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1580.25,
                                Conditions: [{ Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -237.0375 }],
                                New: 1343.2125,
                                Amount: -237.0375,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1580.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -237.0375 }],
                                New: 1343.2125,
                                Amount: -237.0375,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1580.25,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -395.0625, Uom: ['CS'] },
                                ],
                                New: 1185.1875,
                                Amount: -395.0625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1343.2125,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -335.8031, Uom: ['CS'] },
                                ],
                                New: 1007.4083,
                                Amount: -335.8042,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1653.75,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -661.5 }],
                                New: 992.25,
                                Amount: -661.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1653.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -248.0625 }],
                                New: 1405.6875,
                                Amount: -248.0625,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1653.75,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -413.4375, Uom: ['CS'] },
                                ],
                                New: 1240.3125,
                                Amount: -413.4375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1405.6875,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -351.4219, Uom: ['CS'] },
                                ],
                                New: 1054.2645,
                                Amount: -351.423,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1690.5,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -676.2 }],
                                New: 1014.3,
                                Amount: -676.2,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1690.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -253.575 }],
                                New: 1436.925,
                                Amount: -253.575,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 1690.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -422.625, Uom: ['CS'] },
                                ],
                                New: 1267.875,
                                Amount: -422.625,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 1436.925,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -25, Amount: -359.2313, Uom: ['CS'] },
                                ],
                                New: 1077.6926,
                                Amount: -359.2324,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 36.75, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 367.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -55.125 }],
                                New: 312.375,
                                Amount: -55.125,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 367.5,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -55.125, Uom: ['BOX'] },
                                ],
                                New: 312.375,
                                Amount: -55.125,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 312.375,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -46.8563, Uom: ['BOX'] },
                                ],
                                New: 265.519,
                                Amount: -46.856,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 404.25,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -161.7 }],
                                New: 242.55,
                                Amount: -161.7,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 404.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -60.6375 }],
                                New: 343.6125,
                                Amount: -60.6375,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 404.25,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -60.6375, Uom: ['BOX'] },
                                ],
                                New: 343.6125,
                                Amount: -60.6375,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 343.6125,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -51.5419, Uom: ['BOX'] },
                                ],
                                New: 292.0709,
                                Amount: -51.5416,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 22.05, // 36.75 * 0.6 = 22.05 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 441,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -176.4 }],
                                New: 264.6,
                                Amount: -176.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 441,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -66.15 }],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 441,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -66.15, Uom: ['BOX'] },
                                ],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 374.85,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -56.2275, Uom: ['BOX'] },
                                ],
                                New: 318.6228,
                                Amount: -56.2272,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 22.05, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 441,
                                Conditions: [{ Name: 'ZDS7_A002', Type: '%', Value: -40, Amount: -176.4 }],
                                New: 264.6,
                                Amount: -176.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 441,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -66.15 }],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValuesCategory', // do not affect calculation
                                Base: 441,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -66.15, Uom: ['BOX'] },
                                ],
                                New: 374.85,
                                Amount: -66.15,
                            },
                            {
                                Name: 'MultipleValues', // do not affect calculation
                                Base: 374.85,
                                Conditions: [
                                    { Name: 'ZDM2_A007', Type: '%', Value: -15, Amount: -56.2275, Uom: ['BOX'] },
                                ],
                                New: 318.6228,
                                Amount: -56.2272,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
            },
            Frag008: {
                ItemPrice: 29.25,
                Acc01: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no set is applied - initial item price
                        NPMCalcMessage: [],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7312.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2193.75 }],
                                New: 5118.75,
                                Amount: -2193.75,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 7312.5,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -2193.75 }],
                                New: 5118.75,
                                Amount: -2193.75,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7400.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2220.075 }],
                                New: 5180.175,
                                Amount: -2220.075,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 7400.25,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -2220.075 }],
                                New: 5180.175,
                                Amount: -2220.075,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 17.55, // 29.25 * 0.6 = 17.55 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 7458.75,
                                Conditions: [{ Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -2983.5 }],
                                New: 4475.25,
                                Amount: -2983.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7458.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2237.625 }],
                                New: 5221.125,
                                Amount: -2237.625,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 7458.75,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -2237.625 }],
                                New: 5221.125,
                                Amount: -2237.625,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 7605,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -3042 }],
                                New: 4563,
                                Amount: -3042,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7605,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2281.5 }],
                                New: 5323.5,
                                Amount: -2281.5,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 7605,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -2281.5 }],
                                New: 5323.5,
                                Amount: -2281.5,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 8043.75,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -3217.5 }],
                                New: 4826.25,
                                Amount: -3217.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 8043.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -2413.125 }],
                                New: 5630.625,
                                Amount: -2413.125,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 8043.75,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -2413.125 }],
                                New: 5630.625,
                                Amount: -2413.125,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1228.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -368.55 }],
                                New: 859.95,
                                Amount: -368.55,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 1228.5,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -368.55 }],
                                New: 859.95,
                                Amount: -368.55,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 17.55, // 29.25 * 0.6 = 17.55 (40% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1257.75,
                                Conditions: [{ Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -503.1 }],
                                New: 754.65,
                                Amount: -503.1,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1257.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -377.325 }],
                                New: 880.425,
                                Amount: -377.325,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 1257.75,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -377.325 }],
                                New: 880.425,
                                Amount: -377.325,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 1316.25,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -526.5 }],
                                New: 789.75,
                                Amount: -526.5,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1316.25,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -394.875 }],
                                New: 921.375,
                                Amount: -394.875,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 1316.25,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -394.875 }],
                                New: 921.375,
                                Amount: -394.875,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 1345.5,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -538.2 }],
                                New: 807.3,
                                Amount: -538.2,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1345.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -403.65 }],
                                New: 941.85,
                                Amount: -403.65,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 1345.5,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -403.65 }],
                                New: 941.85,
                                Amount: -403.65,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 292.5,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -87.75 }],
                                New: 204.75,
                                Amount: -87.75,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 292.5,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -87.75 }],
                                New: 204.75,
                                Amount: -87.75,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 321.75,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -128.7 }],
                                New: 193.05,
                                Amount: -128.7,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 321.75,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -96.525 }],
                                New: 225.225,
                                Amount: -96.525,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 321.75,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -96.525 }],
                                New: 225.225,
                                Amount: -96.525,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -140.4 }],
                                New: 210.6,
                                Amount: -140.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -105.3 }],
                                New: 245.7,
                                Amount: -105.3,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -105.3 }],
                                New: 245.7,
                                Amount: -105.3,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 29.25, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Discount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDS1_A002', Type: '%', Value: -40, Amount: -140.4 }],
                                New: 210.6,
                                Amount: -140.4,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDM3_A009', Type: '%', Value: -30, Amount: -105.3 }],
                                New: 245.7,
                                Amount: -105.3,
                            },
                            {
                                Name: 'PartialValue', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDH1_A011', Type: '%', Value: -30, Amount: -105.3 }],
                                New: 245.7,
                                Amount: -105.3,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
                OtherAcc: {
                    baseline: {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no set is applied - initial item price
                        NPMCalcMessage: [],
                    },
                    '250 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7312.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1096.875 }],
                                New: 6215.625,
                                Amount: -1096.875,
                            },
                        ],
                    },
                    '253 Each': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7400.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1110.0375 }],
                                New: 6290.2125,
                                Amount: -1110.0375,
                            },
                        ],
                    },
                    '255 Each': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 7458.75,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -2983.5 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -1118.8125 },
                                ],
                                New: 3356.4375,
                                Amount: -4102.3125,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7458.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1118.8125 }],
                                New: 6339.9375,
                                Amount: -1118.8125,
                            },
                        ],
                    },
                    '260 Each': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 7605,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -3042 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -1140.75 },
                                ],
                                New: 3422.25,
                                Amount: -4182.75,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 7605,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1140.75 }],
                                New: 6464.25,
                                Amount: -1140.75,
                            },
                        ],
                    },
                    '275 Each': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 8043.75,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -3217.5 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -1206.5625 },
                                ],
                                New: 3619.6875,
                                Amount: -4424.0625,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 8043.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -1206.5625 }],
                                New: 6837.1875,
                                Amount: -1206.5625,
                            },
                        ],
                    },
                    '42 Case': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1228.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -184.275 }],
                                New: 1044.225,
                                Amount: -184.275,
                            },
                        ],
                    },
                    '43 Case': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1257.75,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -503.1 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -188.6625 },
                                ],
                                New: 565.9875,
                                Amount: -691.7625,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1257.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -188.6625 }],
                                New: 1069.0875,
                                Amount: -188.6625,
                            },
                        ],
                    },
                    '45 Case': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1316.25,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -526.5 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -197.4375 },
                                ],
                                New: 592.3125,
                                Amount: -723.9375,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1316.25,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -197.4375 }],
                                New: 1118.8125,
                                Amount: -197.4375,
                            },
                        ],
                    },
                    '46 Case': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 1345.5,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -538.2 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -201.825 },
                                ],
                                New: 605.475,
                                Amount: -740.025,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 1345.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -201.825 }],
                                New: 1143.675,
                                Amount: -201.825,
                            },
                        ],
                    },
                    '10 Box': {
                        PriceDiscount2UnitPriceAfter1: 29.25, // no discount2
                        NPMCalcMessage: [
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 292.5,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -43.875 }],
                                New: 248.625,
                                Amount: -43.875,
                            },
                        ],
                    },
                    '11 Box': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 321.75,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -128.7 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -48.2625 },
                                ],
                                New: 144.7875,
                                Amount: -176.9625,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 321.75,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -48.2625 }],
                                New: 273.4875,
                                Amount: -48.2625,
                            },
                        ],
                    },
                    '12 Box': {
                        PriceDiscount2UnitPriceAfter1: 13.16, // 29.25 - (29.25 * 0.4) - (29.25 * 0.15) = 29.25 - 11.7 - 4.3875 = 13.1625 (40% + 15% discount2)
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 351,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -140.4 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -52.65 },
                                ],
                                New: 157.95,
                                Amount: -193.05,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -52.65 }],
                                New: 298.35,
                                Amount: -52.65,
                            },
                        ],
                    },
                    cart: {
                        PriceDiscount2UnitPriceAfter1: 13.16, // the value of 12 box
                        NPMCalcMessage: [
                            {
                                Name: 'Discount2',
                                Base: 351,
                                Conditions: [
                                    { Name: 'ZDS6_A001', Type: '%', Value: -40, Amount: -140.4 },
                                    { Name: 'ZDS7_A004', Type: '%', Value: -15, Amount: -52.65 },
                                ],
                                New: 157.95,
                                Amount: -193.05,
                            },
                            {
                                Name: 'MultipleValuesAccount', // do not affect calculation
                                Base: 351,
                                Conditions: [{ Name: 'ZDM3_A006', Type: '%', Value: -15, Amount: -52.65 }],
                                New: 298.35,
                                Amount: -52.65,
                            },
                        ],
                    },
                    Cart: 288, // amount of 12 boxes in units
                },
            },
        },
        Multiple: {
            'Shampoo Three': {
                // Multiple Values (not in 'Faicial Cosmetics' category)
                ItemPrice: 36.95,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '9 EA': [],
                        '10 EA': [],
                        '11 EA': [],
                    },
                    OtherAcc: {
                        baseline: [],
                        '9 EA': [],
                        '10 EA': [],
                        '11 EA': [],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PriceMultiAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '4 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '9 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '2 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '3 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '6 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '7 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '4 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '9 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '2 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '3 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '6 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '7 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '4 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '9 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '2 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '3 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '6 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '7 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 25.86,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 36.95 * 0.7 -> 25.86)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Each': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '4 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '9 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '11 Case': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '1 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '2 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '3 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '5 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '6 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '7 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                        '10 Box': {
                            expectedValue: 31.4,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 36.95 * 0.85 -> 31.40)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 36.95, rules: [`X`] },
                        '1 Each': { expectedValue: 36.95, rules: [`X`] },
                        '2 Each': { expectedValue: 36.95, rules: [`X`] },
                        '3 Each': { expectedValue: 36.95, rules: [`X`] },
                        '5 Each': { expectedValue: 36.95, rules: [`X`] },
                        '9 Each': { expectedValue: 36.95, rules: [`X`] },
                        '10 Each': { expectedValue: 36.95, rules: [`X`] },
                        '11 Each': { expectedValue: 36.95, rules: [`X`] },
                        '1 Case': { expectedValue: 36.95, rules: [`X`] },
                        '2 Case': { expectedValue: 36.95, rules: [`X`] },
                        '4 Case': { expectedValue: 36.95, rules: [`X`] },
                        '5 Case': { expectedValue: 36.95, rules: [`X`] },
                        '9 Case': { expectedValue: 36.95, rules: [`X`] },
                        '10 Case': { expectedValue: 36.95, rules: [`X`] },
                        '11 Case': { expectedValue: 36.95, rules: [`X`] },
                        '1 Box': { expectedValue: 36.95, rules: [`X`] },
                        '2 Box': { expectedValue: 36.95, rules: [`X`] },
                        '3 Box': { expectedValue: 36.95, rules: [`X`] },
                        '5 Box': { expectedValue: 36.95, rules: [`X`] },
                        '6 Box': { expectedValue: 36.95, rules: [`X`] },
                        '7 Box': { expectedValue: 36.95, rules: [`X`] },
                        '10 Box': { expectedValue: 36.95, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                Cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            MaFa25: {
                // Multiple Values
                ItemPrice: 34.75,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PriceMultiAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 56.0, // 80.0 - 24.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                            ],
                        },
                        '11 Each': {
                            expectedValue: 56.0, // 80.0 - 24.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                            ],
                        },
                        '1 Case': {
                            expectedValue: 56.0, // 80.0 - 24.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                            ],
                        },
                        '2 Case': {
                            expectedValue: 53.2, // 80.0 - 24.0 = 56.00 - 2.80 = 53.20
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 56.00 * 0.95 -> 53.20)`, // Category
                            ],
                        },
                        '4 Case': {
                            expectedValue: 53.2, // 80.0 - 24.0 = 56.00 - 2.80 = 53.20
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 56.00 * 0.95 -> 53.20)`, // Category
                            ],
                        },
                        '5 Case': {
                            expectedValue: 50.4, // 80.0 - 24.0 = 56.00 - 5.60 = 50.40
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 56.00 * 0.9 -> 50.40)`, // Category
                            ],
                        },
                        '9 Case': {
                            expectedValue: 50.4, // 80.0 - 24.0 = 56.00 - 5.60 = 50.40
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 56.00 * 0.9 -> 50.40)`, // Category
                            ],
                        },
                        '10 Case': {
                            expectedValue: 42.0, // 80.0 - 24.0 = 56.00 - 14.00 = 42.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 56.00 * 0.75 -> 42.00)`, // Category
                            ],
                        },
                        '11 Case': {
                            expectedValue: 42.0, // 80.0 - 24.0 => 56.00 - 14.00 = 42.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 56.00 * 0.75 -> 42.00)`, // Category
                            ],
                        },
                        '1 Box': {
                            expectedValue: 308.0, // 440.0 - 132.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                            ],
                        },
                        '2 Box': {
                            expectedValue: 292.6, // 440.00 - 132.00 => 308.00 - 15.40 = 292.60
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 308.00 * 0.95 -> 292.60)`, // Category
                            ],
                        },
                        '3 Box': {
                            expectedValue: 292.6, // 440.00 - 132.00 => 308.00 - 15.40 = 292.60
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 308.00 * 0.95 -> 292.60)`, // Category
                            ],
                        },
                        '5 Box': {
                            expectedValue: 292.6, // 440.00 - 132.00 => 308.00 - 15.40 = 292.60
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 308.00 * 0.95 -> 292.60)`, // Category
                            ],
                        },
                        '6 Box': {
                            expectedValue: 261.8, // 440.00 - 132.00 => 308.00 - 46.20 = 261.80
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 308.00 * 0.85 -> 261.80)`, // Category
                            ],
                        },
                        '7 Box': {
                            expectedValue: 261.8, // 440.00 - 132.00 => 308.00 - 46.20 = 261.80
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 308.00 * 0.85 -> 261.80)`, // Category
                            ],
                        },
                        '10 Box': {
                            expectedValue: 261.8, // 440.00 - 132.00 => 308.00 - 46.20 = 261.80
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 308.00 * 0.85 -> 261.80)`, // Category
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 68.0, // 80.00 - 12.00
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`], // Account
                        },
                        '11 Each': {
                            expectedValue: 68.0, // 80.00 - 12.00
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`], // Account
                        },
                        '1 Case': {
                            expectedValue: 68.0, // 80.00 - 12.00
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`], // Account
                        },
                        '2 Case': {
                            expectedValue: 64.6, // 80.00 - 12.00 => 68.00 - 3.40 = 64.60
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 68.00 * 0.95 -> 64.60)`, // Category
                            ],
                        },
                        '4 Case': {
                            expectedValue: 64.6, // 80.00 - 12.00 => 68.00 - 3.40 = 64.60
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 68.00 * 0.95 -> 64.60)`, // Category
                            ],
                        },
                        '5 Case': {
                            expectedValue: 61.2, // 80.00 - 12.00 => 68.00 - 6.80 = 61.20
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 68.00 * 0.9 -> 61.20)`, // Category
                            ],
                        },
                        '9 Case': {
                            expectedValue: 61.2, // 80.00 - 12.00 => 68.00 - 6.80 = 61.20
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 68.00 * 0.9 -> 61.20)`, // Category
                            ],
                        },
                        '10 Case': {
                            expectedValue: 51.0, // 80.00 - 12.00 => 68.00 - 17.00 = 51.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 68.00 * 0.75 -> 51.00)`, // Category
                            ],
                        },
                        '11 Case': {
                            expectedValue: 51.0, // 80.00 - 12.00 => 68.00 - 17.00 = 51.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 68.00 * 0.75 -> 51.00)`, // Category
                            ],
                        },
                        '1 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                            ],
                        },
                        '2 Box': {
                            expectedValue: 366.52, // 440.00 - 66.00 => 374.00 - 7.48 = 366.52
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 374.00 * 0.98 -> 366.52)`, // Category
                            ],
                        },
                        '3 Box': {
                            expectedValue: 355.3, // 440.00 - 66.00 => 374.00 - 18.7 = 355.30
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 374.00 * 0.95 -> 355.30)`, // Category
                            ],
                        },
                        '5 Box': {
                            expectedValue: 355.3, // 440.00 - 66.00 => 374.00 - 18.7 = 355.30
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 374.00 * 0.95 -> 355.30)`, // Category
                            ],
                        },
                        '6 Box': {
                            expectedValue: 317.9, // 440.00 - 66.00 => 374.00 - 56.1 = 317.90
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 374.00 * 0.85 -> 317.90)`, // Category
                            ],
                        },
                        '7 Box': {
                            expectedValue: 317.9, // 440.00 - 66.00 => 374.00 - 56.1 = 317.90
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 374.00 * 0.85 -> 317.90)`, // Category
                            ],
                        },
                        '10 Box': {
                            expectedValue: 317.9, // 440.00 - 66.00 => 374.00 - 56.1 = 317.90
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`, // Account
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 374.00 * 0.85 -> 317.90)`, // Category
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 18.0, // 20.00 - 2.00
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`, // Category
                            ],
                        },
                        '3 Each': {
                            expectedValue: 18.0, // 20.00 - 2.00
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`, // Category
                            ],
                        },
                        '5 Each': {
                            expectedValue: 16.0, // 20.00 - 4.00
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`, // Category
                            ],
                        },
                        '9 Each': {
                            expectedValue: 16.0, // 20.00 - 4.00
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`, // Category
                            ],
                        },
                        '10 Each': {
                            expectedValue: 9.8, // 20.0 - 6.0 => 14.00 - 4.20 = 9.80
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 14.00 * 0.7 -> 9.80)`, // Category
                            ],
                        },
                        '11 Each': {
                            expectedValue: 9.8, // 20.0 - 6.0 => 14.00 - 4.20 = 9.80
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 14.00 * 0.7 -> 9.80)`, // Category
                            ],
                        },
                        '1 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '2 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '4 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '5 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '9 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '10 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '11 Case': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '1 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '2 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '3 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '5 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '6 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '7 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                        '10 Box': {
                            expectedValue: 14.0, // 20.0 - 6.0
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.7 -> 14.00)`, // Account
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0, // 20.00 - 1.00
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`, // Category
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0, // 20.00 - 1.00
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`, // Category
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0, // 20.00 - 2.00
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`, // Category
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0, // 20.00 - 2.00
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`, // Category
                            ],
                        },
                        '10 Each': {
                            expectedValue: 11.9, // 20.0 - 3.0 => 17.00 - 5.10 = 11.90
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 17.00 * 0.7 -> 11.90)`, // Category
                            ],
                        },
                        '11 Each': {
                            expectedValue: 11.9, // 20.0 - 3.0 => 17.00 - 5.10 = 11.90
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 17.00 * 0.7 -> 11.90)`, // Category
                            ],
                        },
                        '1 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '2 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '4 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '5 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '9 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '10 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '11 Case': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '1 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '2 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '3 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '5 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '6 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '7 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                        '10 Box': {
                            expectedValue: 17.0, // 20.0 - 3.0
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`, // Account
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 80.0 - 24.0, // 56.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 440.0 - 132.0, // 308.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '11 Each': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '1 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '2 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '4 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '5 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '9 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '10 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '11 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '1 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 20.0 - 6.0, // 14.00
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '11 Each': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '1 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '2 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '4 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '5 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '9 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '10 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '11 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '1 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '2 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '3 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '5 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '6 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '7 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '10 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 431.2,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 440.00 * 0.98 -> 431.20)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': { expectedValue: 80.0, rules: [`X`] },
                        '4 Case': { expectedValue: 80.0, rules: [`X`] },
                        '5 Case': { expectedValue: 80.0, rules: [`X`] },
                        '9 Case': { expectedValue: 80.0, rules: [`X`] },
                        '10 Case': { expectedValue: 80.0, rules: [`X`] },
                        '11 Case': { expectedValue: 80.0, rules: [`X`] },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': { expectedValue: 440.0, rules: [`X`] },
                        '3 Box': { expectedValue: 440.0, rules: [`X`] },
                        '5 Box': { expectedValue: 440.0, rules: [`X`] },
                        '6 Box': { expectedValue: 440.0, rules: [`X`] },
                        '7 Box': { expectedValue: 440.0, rules: [`X`] },
                        '10 Box': { expectedValue: 440.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': { expectedValue: 80.0, rules: [`X`] },
                        '4 Case': { expectedValue: 80.0, rules: [`X`] },
                        '5 Case': { expectedValue: 80.0, rules: [`X`] },
                        '9 Case': { expectedValue: 80.0, rules: [`X`] },
                        '10 Case': { expectedValue: 80.0, rules: [`X`] },
                        '11 Case': { expectedValue: 80.0, rules: [`X`] },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': { expectedValue: 440.0, rules: [`X`] },
                        '3 Box': { expectedValue: 440.0, rules: [`X`] },
                        '5 Box': { expectedValue: 440.0, rules: [`X`] },
                        '6 Box': { expectedValue: 440.0, rules: [`X`] },
                        '7 Box': { expectedValue: 440.0, rules: [`X`] },
                        '10 Box': { expectedValue: 440.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': { expectedValue: 20.0, rules: [`X`] },
                        '11 Each': { expectedValue: 20.0, rules: [`X`] },
                        '1 Case': { expectedValue: 20.0, rules: [`X`] },
                        '2 Case': { expectedValue: 20.0, rules: [`X`] },
                        '4 Case': { expectedValue: 20.0, rules: [`X`] },
                        '5 Case': { expectedValue: 20.0, rules: [`X`] },
                        '9 Case': { expectedValue: 20.0, rules: [`X`] },
                        '10 Case': { expectedValue: 20.0, rules: [`X`] },
                        '11 Case': { expectedValue: 20.0, rules: [`X`] },
                        '1 Box': { expectedValue: 20.0, rules: [`X`] },
                        '2 Box': { expectedValue: 20.0, rules: [`X`] },
                        '3 Box': { expectedValue: 20.0, rules: [`X`] },
                        '5 Box': { expectedValue: 20.0, rules: [`X`] },
                        '6 Box': { expectedValue: 20.0, rules: [`X`] },
                        '7 Box': { expectedValue: 20.0, rules: [`X`] },
                        '10 Box': { expectedValue: 20.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': { expectedValue: 20.0, rules: [`X`] },
                        '11 Each': { expectedValue: 20.0, rules: [`X`] },
                        '1 Case': { expectedValue: 20.0, rules: [`X`] },
                        '2 Case': { expectedValue: 20.0, rules: [`X`] },
                        '4 Case': { expectedValue: 20.0, rules: [`X`] },
                        '5 Case': { expectedValue: 20.0, rules: [`X`] },
                        '9 Case': { expectedValue: 20.0, rules: [`X`] },
                        '10 Case': { expectedValue: 20.0, rules: [`X`] },
                        '11 Case': { expectedValue: 20.0, rules: [`X`] },
                        '1 Box': { expectedValue: 20.0, rules: [`X`] },
                        '2 Box': { expectedValue: 20.0, rules: [`X`] },
                        '3 Box': { expectedValue: 20.0, rules: [`X`] },
                        '5 Box': { expectedValue: 20.0, rules: [`X`] },
                        '6 Box': { expectedValue: 20.0, rules: [`X`] },
                        '7 Box': { expectedValue: 20.0, rules: [`X`] },
                        '10 Box': { expectedValue: 20.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                Cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            MaLi37: {
                // Multiple Values
                ItemPrice: 37.0,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PriceMultiAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 37.0 * 6, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 155.4,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 155.4,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 155.4,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 147.63,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 155.40 * 0.95 -> 147.63)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 132.09,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 155.40 * 0.85 -> 132.09)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 132.09,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 155.40 * 0.85 -> 132.09)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 132.09,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 155.40 * 0.85 -> 132.09)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 116.55,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 155.40 * 0.75 -> 116.55)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 116.55,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 6 * 0.7 -> 155.40)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 155.40 * 0.75 -> 116.55)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 37.0 * 24,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 590.52,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 621.60 * 0.95 -> 590.52)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 590.52,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 621.60 * 0.95 -> 590.52)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 590.52,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 621.60 * 0.95 -> 590.52)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 528.36,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 621.60 * 0.85 -> 528.36)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 528.36,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 621.60 * 0.85 -> 528.36)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 528.36,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 24 * 0.7 -> 621.60)`,
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 621.60 * 0.85 -> 528.36)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0 * 6, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 210.9,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 222.00 * 0.95)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 188.7,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 188.7,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 188.7,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 166.5,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 166.5,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                            ],
                        },
                        '1 Box': { expectedValue: 37.0 * 24, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 870.24,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 888.00 * 0.98)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 843.6,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 843.6,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 754.8,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 754.8,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 754.8,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 37.00 * 0.8)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 37.00 * 0.8)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7)`,
                            ],
                        },
                        '1 Case': { expectedValue: 14.0, rules: [`X`] },
                        '2 Case': { expectedValue: 14.0, rules: [`X`] },
                        '4 Case': { expectedValue: 14.0, rules: [`X`] },
                        '5 Case': { expectedValue: 14.0, rules: [`X`] },
                        '9 Case': { expectedValue: 14.0, rules: [`X`] },
                        '10 Case': { expectedValue: 14.0, rules: [`X`] },
                        '11 Case': { expectedValue: 14.0, rules: [`X`] },
                        '1 Box': { expectedValue: 14.0, rules: [`X`] },
                        '2 Box': { expectedValue: 14.0, rules: [`X`] },
                        '3 Box': { expectedValue: 14.0, rules: [`X`] },
                        '5 Box': { expectedValue: 14.0, rules: [`X`] },
                        '6 Box': { expectedValue: 14.0, rules: [`X`] },
                        '7 Box': { expectedValue: 14.0, rules: [`X`] },
                        '10 Box': { expectedValue: 14.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 37.00 * 0.95)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 37.00 * 0.95)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 15.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 37.00 * 0.75)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 15.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 37.00 * 0.75)`,
                            ],
                        },
                        '1 Case': { expectedValue: 15.0, rules: [`X`] },
                        '2 Case': { expectedValue: 15.0, rules: [`X`] },
                        '4 Case': { expectedValue: 15.0, rules: [`X`] },
                        '5 Case': { expectedValue: 15.0, rules: [`X`] },
                        '9 Case': { expectedValue: 15.0, rules: [`X`] },
                        '10 Case': { expectedValue: 15.0, rules: [`X`] },
                        '11 Case': { expectedValue: 15.0, rules: [`X`] },
                        '1 Box': { expectedValue: 15.0, rules: [`X`] },
                        '2 Box': { expectedValue: 15.0, rules: [`X`] },
                        '3 Box': { expectedValue: 15.0, rules: [`X`] },
                        '5 Box': { expectedValue: 15.0, rules: [`X`] },
                        '6 Box': { expectedValue: 15.0, rules: [`X`] },
                        '7 Box': { expectedValue: 15.0, rules: [`X`] },
                        '10 Box': { expectedValue: 15.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 37.0 - 5.55 - 11.1, // 20.35
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.15 -> -5.55)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.3 -> -11.10)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '11 Each': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '1 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '2 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '4 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '5 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '9 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '10 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '11 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '1 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '2 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '3 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '5 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '6 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '7 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '10 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '11 Each': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '1 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '2 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '4 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '5 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '9 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '10 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '11 Case': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '1 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '2 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '3 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '5 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '6 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '7 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                        '10 Box': {
                            expectedValue: 31.45,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 37.00 * 0.85 -> 31.45)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 27.75,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 37.00 * 0.75 -> 27.75)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 27.75,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 37.00 * 0.75 -> 27.75)`,
                            ],
                        },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 27.75,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 37.00 * 0.75 -> 27.75)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 27.75,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 37.00 * 0.75 -> 27.75)`,
                            ],
                        },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 36.26,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 37.00 * 0.98 -> 36.26)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 31.45,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 37.00 * 0.85 -> 31.45)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 29.6,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 37.00 * 0.8 -> 29.60)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 29.6,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 37.00 * 0.8 -> 29.60)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '1 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 35.15,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 37.00 * 0.95 -> 35.15)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 33.3,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9 -> 33.30)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 25.9,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7 -> 25.90)`,
                            ],
                        },
                        '1 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 25.9, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': { expectedValue: 37.0, rules: [`X`] },
                        '4 Case': { expectedValue: 37.0, rules: [`X`] },
                        '5 Case': { expectedValue: 37.0, rules: [`X`] },
                        '9 Case': { expectedValue: 37.0, rules: [`X`] },
                        '10 Case': { expectedValue: 37.0, rules: [`X`] },
                        '11 Case': { expectedValue: 37.0, rules: [`X`] },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': { expectedValue: 37.0, rules: [`X`] },
                        '3 Box': { expectedValue: 37.0, rules: [`X`] },
                        '5 Box': { expectedValue: 37.0, rules: [`X`] },
                        '6 Box': { expectedValue: 37.0, rules: [`X`] },
                        '7 Box': { expectedValue: 37.0, rules: [`X`] },
                        '10 Box': { expectedValue: 37.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': { expectedValue: 37.0, rules: [`X`] },
                        '4 Case': { expectedValue: 37.0, rules: [`X`] },
                        '5 Case': { expectedValue: 37.0, rules: [`X`] },
                        '9 Case': { expectedValue: 37.0, rules: [`X`] },
                        '10 Case': { expectedValue: 37.0, rules: [`X`] },
                        '11 Case': { expectedValue: 37.0, rules: [`X`] },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': { expectedValue: 37.0, rules: [`X`] },
                        '3 Box': { expectedValue: 37.0, rules: [`X`] },
                        '5 Box': { expectedValue: 37.0, rules: [`X`] },
                        '6 Box': { expectedValue: 37.0, rules: [`X`] },
                        '7 Box': { expectedValue: 37.0, rules: [`X`] },
                        '10 Box': { expectedValue: 37.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': { expectedValue: 37.0, rules: [`X`] },
                        '4 Case': { expectedValue: 37.0, rules: [`X`] },
                        '5 Case': { expectedValue: 37.0, rules: [`X`] },
                        '9 Case': { expectedValue: 37.0, rules: [`X`] },
                        '10 Case': { expectedValue: 37.0, rules: [`X`] },
                        '11 Case': { expectedValue: 37.0, rules: [`X`] },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': { expectedValue: 37.0, rules: [`X`] },
                        '3 Box': { expectedValue: 37.0, rules: [`X`] },
                        '5 Box': { expectedValue: 37.0, rules: [`X`] },
                        '6 Box': { expectedValue: 37.0, rules: [`X`] },
                        '7 Box': { expectedValue: 37.0, rules: [`X`] },
                        '10 Box': { expectedValue: 37.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 37.0, rules: [`X`] },
                        '1 Each': { expectedValue: 37.0, rules: [`X`] },
                        '2 Each': { expectedValue: 37.0, rules: [`X`] },
                        '3 Each': { expectedValue: 37.0, rules: [`X`] },
                        '5 Each': { expectedValue: 37.0, rules: [`X`] },
                        '9 Each': { expectedValue: 37.0, rules: [`X`] },
                        '10 Each': { expectedValue: 37.0, rules: [`X`] },
                        '11 Each': { expectedValue: 37.0, rules: [`X`] },
                        '1 Case': { expectedValue: 37.0, rules: [`X`] },
                        '2 Case': { expectedValue: 37.0, rules: [`X`] },
                        '4 Case': { expectedValue: 37.0, rules: [`X`] },
                        '5 Case': { expectedValue: 37.0, rules: [`X`] },
                        '9 Case': { expectedValue: 37.0, rules: [`X`] },
                        '10 Case': { expectedValue: 37.0, rules: [`X`] },
                        '11 Case': { expectedValue: 37.0, rules: [`X`] },
                        '1 Box': { expectedValue: 37.0, rules: [`X`] },
                        '2 Box': { expectedValue: 37.0, rules: [`X`] },
                        '3 Box': { expectedValue: 37.0, rules: [`X`] },
                        '5 Box': { expectedValue: 37.0, rules: [`X`] },
                        '6 Box': { expectedValue: 37.0, rules: [`X`] },
                        '7 Box': { expectedValue: 37.0, rules: [`X`] },
                        '10 Box': { expectedValue: 37.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                Cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            MaLi38: {
                // Multiple Values
                ItemPrice: 37.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                        '5 Each': [],
                        '9 Each': [],
                        '10 Each': [],
                        '11 Each': [],
                        '1 Case': [],
                        '2 Case': [],
                        '4 Case': [],
                        '5 Case': [],
                        '9 Case': [],
                        '10 Case': [],
                        '11 Case': [],
                        '1 Box': [],
                        '2 Box': [],
                        '3 Box': [],
                        '5 Box': [],
                        '6 Box': [],
                        '7 Box': [],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PriceMultiAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 56.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 56.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 56.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 53.2,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 56.00 * 0.95 -> 53.20)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 47.6,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 56.00 * 0.85 -> 47.60)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 47.6,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 56.00 * 0.85 -> 47.60)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 47.6,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 56.00 * 0.85 -> 47.60)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 42.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 56.00 * 0.75 -> 42.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 42.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.7 -> 56.00)`,
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 56.00 * 0.75 -> 42.00)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 308.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 301.84,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 308.00 * 0.98 -> 301.84)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 231.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 308.00 * 0.75 -> 231.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 231.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 308.00 * 0.75 -> 231.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 231.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 308.00 * 0.75 -> 231.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 231.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 308.00 * 0.75 -> 231.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 231.0,
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.7 -> 308.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 308.00 * 0.75 -> 231.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': { expectedValue: 440.0, rules: [`X`] },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                            ],
                        },
                        '1 Case': { expectedValue: 10.0, rules: [`X`] },
                        '2 Case': { expectedValue: 10.0, rules: [`X`] },
                        '4 Case': { expectedValue: 10.0, rules: [`X`] },
                        '5 Case': { expectedValue: 10.0, rules: [`X`] },
                        '9 Case': { expectedValue: 10.0, rules: [`X`] },
                        '10 Case': { expectedValue: 10.0, rules: [`X`] },
                        '11 Case': { expectedValue: 10.0, rules: [`X`] },
                        '1 Box': { expectedValue: 10.0, rules: [`X`] },
                        '2 Box': { expectedValue: 10.0, rules: [`X`] },
                        '3 Box': { expectedValue: 10.0, rules: [`X`] },
                        '5 Box': { expectedValue: 10.0, rules: [`X`] },
                        '6 Box': { expectedValue: 10.0, rules: [`X`] },
                        '7 Box': { expectedValue: 10.0, rules: [`X`] },
                        '10 Box': { expectedValue: 10.0, rules: [`X`] },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                            ],
                        },
                        '1 Case': { expectedValue: 10.0, rules: [`X`] },
                        '2 Case': { expectedValue: 10.0, rules: [`X`] },
                        '4 Case': { expectedValue: 10.0, rules: [`X`] },
                        '5 Case': { expectedValue: 10.0, rules: [`X`] },
                        '9 Case': { expectedValue: 10.0, rules: [`X`] },
                        '10 Case': { expectedValue: 10.0, rules: [`X`] },
                        '11 Case': { expectedValue: 10.0, rules: [`X`] },
                        '1 Box': { expectedValue: 10.0, rules: [`X`] },
                        '2 Box': { expectedValue: 10.0, rules: [`X`] },
                        '3 Box': { expectedValue: 10.0, rules: [`X`] },
                        '5 Box': { expectedValue: 10.0, rules: [`X`] },
                        '6 Box': { expectedValue: 10.0, rules: [`X`] },
                        '7 Box': { expectedValue: 10.0, rules: [`X`] },
                        '10 Box': { expectedValue: 10.0, rules: [`X`] },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 80.0 - 12.0 - 24.0, // 44.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.15 -> -12.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 80.00 * 0.3 -> -24.00)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 440.0 - 66.0 - 132.0, // 242.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 440.00 * 0.3 -> -132.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '11 Each': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '1 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '2 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '4 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '5 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '9 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '10 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '11 Case': {
                            expectedValue: 68.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 80.00 * 0.85 -> 68.00)`],
                        },
                        '1 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiAccountAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '1 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '2 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 20.0 - 3.0 - 6.0, // 11.00
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.15 -> -3.00)`,
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] (30% -> 20.00 * 0.3 -> -6.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': { expectedValue: 20.0, rules: [`X`] },
                        '3 Each': { expectedValue: 20.0, rules: [`X`] },
                        '5 Each': { expectedValue: 20.0, rules: [`X`] },
                        '9 Each': { expectedValue: 20.0, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '11 Each': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '1 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '2 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '4 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '5 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '9 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '10 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '11 Case': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '1 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '2 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '3 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '5 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '6 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '7 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                        '10 Box': {
                            expectedValue: 17.0,
                            rules: [`'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] (15% -> 20.00 * 0.85 -> 17.00)`],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 431.2,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 440.00 * 0.98 -> 431.20)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiCategoryAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 16.0,
                            rules: [
                                `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> 16.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 14.0,
                            rules: [
                                `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7 -> 14.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 14.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter1: {
                    Acc01: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 80.0 - 4.0, // 76.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.05 -> -4.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 80.0 - 4.0 - 12.0, // 64.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.05 -> -4.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.15 -> -12.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 80.0 - 8.0 - 12.0, // 60.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.1 -> -8.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.15 -> -12.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 80.0 - 8.0 - 12.0, // 60.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.1 -> -8.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.15 -> -12.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 80.0 - 20.0 - 12.0, // 48.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.25 -> -20.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.15 -> -12.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 80.0 - 20.0 - 12.0, // 48.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.25 -> -20.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.15 -> -12.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': {
                            expectedValue: 440.0 - 8.8, // 431.20
                            rules: [
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 440.00 * 0.02 -> -8.80)`,
                            ],
                        },
                        '3 Box': {
                            expectedValue: 440.0 - 22.0 - 110.0, // 308.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.05 -> -22.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.25 -> -110.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 440.0 - 22.0 - 110.0, // 308.00
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.05 -> -22.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.25 -> -110.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 440.0 - 66.0 - 110.0, // 264.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.25 -> -110.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 440.0 - 66.0 - 110.0, // 264.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.25 -> -110.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 440.0 - 66.0 - 110.0, // 264.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.15 -> -66.00)`,
                                `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.25 -> -110.00)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 80.0, rules: [`X`] },
                        '1 Each': { expectedValue: 80.0, rules: [`X`] },
                        '2 Each': { expectedValue: 80.0, rules: [`X`] },
                        '3 Each': { expectedValue: 80.0, rules: [`X`] },
                        '5 Each': { expectedValue: 80.0, rules: [`X`] },
                        '9 Each': { expectedValue: 80.0, rules: [`X`] },
                        '10 Each': { expectedValue: 80.0, rules: [`X`] },
                        '11 Each': { expectedValue: 80.0, rules: [`X`] },
                        '1 Case': { expectedValue: 80.0, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '4 Case': {
                            expectedValue: 76.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95 -> 76.00)`,
                            ],
                        },
                        '5 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '9 Case': {
                            expectedValue: 72.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9 -> 72.00)`,
                            ],
                        },
                        '10 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '11 Case': {
                            expectedValue: 60.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75 -> 60.00)`,
                            ],
                        },
                        '1 Box': { expectedValue: 440.0, rules: [`X`] },
                        '2 Box': { expectedValue: 440.0, rules: [`X`] },
                        '3 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '5 Box': {
                            expectedValue: 418.0,
                            rules: [
                                `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95 -> 418.00)`,
                            ],
                        },
                        '6 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '7 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                        '10 Box': {
                            expectedValue: 374.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85 -> 374.00)`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                PriceMultiItemAfter2: {
                    Acc01: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 20.0 - 1.0 - 1.0, // 18.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> -1.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> -1.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 20.0 - 1.0 - 1.0, // 18.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> -1.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> -1.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 20.0 - 2.0 - 4.0, // 14.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> -2.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> -4.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 20.0 - 2.0 - 4.0, // 14.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> -2.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8 -> -4.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 20.0 - 10.0 - 5.0, // 5.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5 -> -10.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 20.00 * 0.25 -> -5.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 20.0 - 10.0 - 5.0, // 5.00
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5 -> -10.00)`,
                                `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 20.00 * 0.25 -> -5.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 5.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 20.0, rules: [`X`] },
                        '1 Each': { expectedValue: 20.0, rules: [`X`] },
                        '2 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '3 Each': {
                            expectedValue: 19.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95 -> 19.00)`,
                            ],
                        },
                        '5 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '9 Each': {
                            expectedValue: 18.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9 -> 18.00)`,
                            ],
                        },
                        '10 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5 -> 10.00)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 10.0,
                            rules: [
                                `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5 -> 10.00)`,
                            ],
                        },
                        '1 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '4 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '9 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '11 Case': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '1 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '2 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '3 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '5 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '6 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '7 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                        '10 Box': { expectedValue: 10.0, rules: [`X`] }, // AOQM2 remains 10 Each
                    },
                    cart: {
                        Acc01: 1,
                        OtherAcc: 1,
                    },
                },
                Cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
        },
        Partial: {
            Frag006: {
                // Partial Value
                ItemPrice: 27.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 272.5,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -81.75,
                                    },
                                ],
                                New: 190.75,
                                Amount: -81.75,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 272.5,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -54.5 }],
                                New: 218,
                                Amount: -54.5,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 299.75,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -89.925,
                                    },
                                ],
                                New: 209.825,
                                Amount: -89.925,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 299.75,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -59.95 }],
                                New: 239.8,
                                Amount: -59.95,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 54.5,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -16.35,
                                    },
                                ],
                                New: 38.15,
                                Amount: -16.35,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 54.5,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -10.9 }],
                                New: 43.6,
                                Amount: -10.9,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 81.75,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -24.525,
                                    },
                                ],
                                New: 57.225,
                                Amount: -24.525,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 81.75,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -16.35 }],
                                New: 65.4,
                                Amount: -16.35,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 27.25,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -8.175,
                                    },
                                ],
                                New: 19.075,
                                Amount: -8.175,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 27.25,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -5.45 }],
                                New: 21.8,
                                Amount: -5.45,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 54.5,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -16.35,
                                    },
                                ],
                                New: 38.15,
                                Amount: -16.35,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 54.5,
                                Conditions: [{ Name: 'ZDH1_A011 (4 Letters)', Type: '%', Value: -20, Amount: -10.9 }],
                                New: 43.6,
                                Amount: -10.9,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 272.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -40.875 },
                                ],
                                New: 231.625,
                                Amount: -40.875,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 299.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -44.9625 },
                                ],
                                New: 254.7875,
                                Amount: -44.9625,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 54.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -8.175 },
                                ],
                                New: 46.325,
                                Amount: -8.175,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 81.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -12.2625 },
                                ],
                                New: 69.4875,
                                Amount: -12.2625,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 27.25,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -4.0875 },
                                ],
                                New: 23.1625,
                                Amount: -4.0875,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 54.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -8.175 },
                                ],
                                New: 46.325,
                                Amount: -8.175,
                            },
                        ],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PricePartial: {
                    Acc01: {
                        baseline: { expectedValue: 27.25, rules: [`X`] },
                        '0 Each': { expectedValue: 27.25, rules: [`X`] },
                        '9 Each': { expectedValue: 27.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                        '1 Case': { expectedValue: 27.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 21.8, // 27.25 - 5.45
                            rules: [
                                `'ZDM3@A009@Acc01@Contract3' -> [[10,"D",30,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000@Frag006' -> [[10,"D",20,"%"]],"EA"]] (20% -> - 27.25 * 0.2 -> -5.45)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 27.25, rules: [`X`] },
                        '0 Each': { expectedValue: 27.25, rules: [`X`] },
                        '9 Each': { expectedValue: 27.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 27.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 27.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 21.8, // field value
                        OtherAcc: 27.25, // field value
                    },
                },
                Cart: {
                    Acc01: 24, // total units
                    OtherAcc: 24, // total units
                },
            },
            Frag008: {
                // Partial Value
                ItemPrice: 29.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 292.5, // 29.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -87.75,
                                    },
                                ],
                                New: 204.75,
                                Amount: -87.75,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 292.5, // 29.25 * 10
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -87.75 }],
                                New: 204.75,
                                Amount: -87.75,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 321.75, // 29.25 * 11
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -96.525,
                                    },
                                ],
                                New: 225.225,
                                Amount: -96.525,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 321.75, // 29.25 * 11
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -96.525 }],
                                New: 225.225,
                                Amount: -96.525,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 58.5, // 29.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -17.55,
                                    },
                                ],
                                New: 40.95,
                                Amount: -17.55,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 58.5, // 29.25 * 2
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -17.55 }],
                                New: 40.95,
                                Amount: -17.55,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 87.75, // 29.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -26.325,
                                    },
                                ],
                                New: 61.425,
                                Amount: -26.325,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 87.75, // 29.25 * 3
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -26.325 }],
                                New: 61.425,
                                Amount: -26.325,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 29.25,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -8.775,
                                    },
                                ],
                                New: 20.475,
                                Amount: -8.775,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 29.25,
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -8.775 }],
                                New: 20.475,
                                Amount: -8.775,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 58.5, // 29.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -17.55,
                                    },
                                ],
                                New: 40.95,
                                Amount: -17.55,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 58.5, // 29.25 * 2
                                Conditions: [{ Name: 'ZDH1_A011 (7 Letters)', Type: '%', Value: -30, Amount: -17.55 }],
                                New: 40.95,
                                Amount: -17.55,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 292.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -43.875 },
                                ],
                                New: 248.625,
                                Amount: -43.875,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 321.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -48.2625 },
                                ],
                                New: 273.4875,
                                Amount: -48.2625,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 58.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -8.775 },
                                ],
                                New: 49.725,
                                Amount: -8.775,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 87.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -13.1625 },
                                ],
                                New: 74.5875,
                                Amount: -13.1625,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 29.25,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -4.3875 },
                                ],
                                New: 24.8625,
                                Amount: -4.3875,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 58.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -8.775 },
                                ],
                                New: 49.725,
                                Amount: -8.775,
                            },
                        ],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PricePartial: {
                    Acc01: {
                        baseline: { expectedValue: 29.25, rules: [`X`] },
                        '0 Each': { expectedValue: 29.25, rules: [`X`] },
                        '9 Each': { expectedValue: 29.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                        '1 Case': { expectedValue: 29.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 20.47, // 29.25 - 8.775
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@1000200@Frag008' -> [[10,"D",30,"%"]],"EA"]] (30% -> - 29.25 * 0.3 -> -8.775)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 29.25, rules: [`X`] },
                        '0 Each': { expectedValue: 29.25, rules: [`X`] },
                        '9 Each': { expectedValue: 29.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 29.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 29.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 20.47, // field value
                        OtherAcc: 29.25, // field value
                    },
                },
                Cart: {
                    Acc01: 24, // total units
                    OtherAcc: 24, // total units
                },
            },
            Frag009: {
                // Partial Value
                ItemPrice: 30.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 302.5, // 30.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -90.75,
                                    },
                                ],
                                New: 211.75,
                                Amount: -90.75,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 302.5, // 30.25 * 10
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -30.25 },
                                ],
                                New: 272.25,
                                Amount: -30.25,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 332.75, // 30.25 * 11
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -99.825,
                                    },
                                ],
                                New: 232.925,
                                Amount: -99.825,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 332.75, // 30.25 * 11
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -33.275 },
                                ],
                                New: 299.475,
                                Amount: -33.275,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 60.5, // 30.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -18.15,
                                    },
                                ],
                                New: 42.35,
                                Amount: -18.15,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 60.5, // 30.25 * 2
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -6.05 },
                                ],
                                New: 54.45,
                                Amount: -6.05,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 90.75, // 30.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -27.225,
                                    },
                                ],
                                New: 63.525,
                                Amount: -27.225,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 90.75, // 30.25 * 3
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -9.075 },
                                ],
                                New: 81.675,
                                Amount: -9.075,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 30.25,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -9.075,
                                    },
                                ],
                                New: 21.175,
                                Amount: -9.075,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 30.25,
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -3.025 },
                                ],
                                New: 27.225,
                                Amount: -3.025,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 60.5, // 30.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -18.15,
                                    },
                                ],
                                New: 42.35,
                                Amount: -18.15,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 60.5, // 30.25 * 2
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -6.05 },
                                ],
                                New: 54.45,
                                Amount: -6.05,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 302.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -45.375 },
                                ],
                                New: 257.125,
                                Amount: -43.875,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 332.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -49.9125 },
                                ],
                                New: 282.8375,
                                Amount: -49.9125,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 60.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -9.075 },
                                ],
                                New: 51.425,
                                Amount: -9.075,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 90.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -13.6125 },
                                ],
                                New: 77.1375,
                                Amount: -13.6125,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 30.25,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -4.5375 },
                                ],
                                New: 25.7125,
                                Amount: -4.5375,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 60.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -9.075 },
                                ],
                                New: 51.425,
                                Amount: -9.075,
                            },
                        ],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PricePartial: {
                    Acc01: {
                        baseline: { expectedValue: 30.25, rules: [`X`] },
                        '0 Each': { expectedValue: 30.25, rules: [`X`] },
                        '9 Each': { expectedValue: 30.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                        '1 Case': { expectedValue: 30.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 27.22, // 30.25 - 3.025
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag009' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 30.25 * 0.1 -> -3.025)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 30.25, rules: [`X`] },
                        '0 Each': { expectedValue: 30.25, rules: [`X`] },
                        '9 Each': { expectedValue: 30.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 30.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 30.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 27.22, // field value
                        OtherAcc: 30.25, // field value
                    },
                },
                Cart: {
                    Acc01: 24, // total units
                    OtherAcc: 24, // total units
                },
            },
            Frag011: {
                // Partial Value
                ItemPrice: 32.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 322.5, // 32.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -96.75,
                                    },
                                ],
                                New: 225.75,
                                Amount: -96.75,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 322.5, // 32.25 * 10
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -32.25 },
                                ],
                                New: 290.25,
                                Amount: -32.25,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 354.75, // 32.25 * 11
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -106.425,
                                    },
                                ],
                                New: 248.325,
                                Amount: -106.425,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 354.75, // 32.25 * 11
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -35.475 },
                                ],
                                New: 319.275,
                                Amount: -35.475,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 64.5, // 32.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -19.35,
                                    },
                                ],
                                New: 45.15,
                                Amount: -19.35,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 64.5, // 32.25 * 2
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -6.45 },
                                ],
                                New: 58.05,
                                Amount: -6.45,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 96.75, // 32.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -29.025,
                                    },
                                ],
                                New: 67.725,
                                Amount: -29.025,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 96.75, // 32.25 * 3
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -9.675 },
                                ],
                                New: 87.075,
                                Amount: -9.675,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 32.25,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -9.675,
                                    },
                                ],
                                New: 22.575,
                                Amount: -9.675,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 32.25,
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -3.225 },
                                ],
                                New: 29.025,
                                Amount: -3.225,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 64.5, // 32.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -19.35,
                                    },
                                ],
                                New: 45.15,
                                Amount: -19.35,
                            },
                            {
                                Name: 'PartialValue',
                                Base: 64.5, // 32.25 * 2
                                Conditions: [
                                    { Name: 'ZDH1_A011 (9 Letters - full)', Type: '%', Value: -10, Amount: -6.45 },
                                ],
                                New: 58.05,
                                Amount: -6.45,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 322.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -48.375 },
                                ],
                                New: 274.125,
                                Amount: -48.375,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 354.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -53.2125 },
                                ],
                                New: 301.5375,
                                Amount: -53.2125,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 64.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -9.675 },
                                ],
                                New: 54.825,
                                Amount: -9.675,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 96.75,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -14.5125 },
                                ],
                                New: 82.2375,
                                Amount: -14.5125,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 32.25,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -4.8375 },
                                ],
                                New: 27.4125,
                                Amount: -4.8375,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 64.5,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -9.675 },
                                ],
                                New: 54.825,
                                Amount: -9.675,
                            },
                        ],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PricePartial: {
                    Acc01: {
                        baseline: { expectedValue: 32.25, rules: [`X`] },
                        '0 Each': { expectedValue: 32.25, rules: [`X`] },
                        '9 Each': { expectedValue: 32.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                        '1 Case': { expectedValue: 32.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 29.02, // 32.25 - 3.225
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                                `'ZDH1@A011@100020030@Frag011' -> [[10,"D",10,"%"]],"EA"]] (10% -> - 32.25 * 0.1 -> -3.225)`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 32.25, rules: [`X`] },
                        '0 Each': { expectedValue: 32.25, rules: [`X`] },
                        '9 Each': { expectedValue: 32.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 32.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 32.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 29.02, // field value
                        OtherAcc: 32.25, // field value
                    },
                },
                Cart: {
                    Acc01: 24, // total units
                    OtherAcc: 24, // total units
                },
            },
            Frag021: {
                // Partial Value - control item (no rules apply)
                ItemPrice: 42.25,
                NPMCalcMessage: {
                    Acc01: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 422.5, // 42.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -126.75,
                                    },
                                ],
                                New: 295.75,
                                Amount: -126.75,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 422.5, // 42.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -126.75,
                                    },
                                ],
                                New: 295.75,
                                Amount: -126.75,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 84.5, // 42.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -25.35,
                                    },
                                ],
                                New: 59.15,
                                Amount: -25.35,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 126.75, // 42.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -38.025,
                                    },
                                ],
                                New: 88.725,
                                Amount: -38.025,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 42.25,
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009 Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -12.675,
                                    },
                                ],
                                New: 29.575,
                                Amount: -12.675,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 84.5, // 42.25 * 2
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -30,
                                        Amount: -25.35,
                                    },
                                ],
                                New: 59.15,
                                Amount: -25.35,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '0 Each': [],
                        '9 Each': [],
                        '10 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 422.5, // 42.25 * 10
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -63.375,
                                    },
                                ],
                                New: 359.125,
                                Amount: -63.375,
                            },
                        ],
                        '11 Each': [
                            {
                                Name: 'MultipleValues',
                                Base: 464.75, // 42.25 * 11
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A006 Contract2_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -69.7125,
                                    },
                                ],
                                New: 395.0375,
                                Amount: -69.7125,
                            },
                        ],
                        '1 Case': [],
                        '2 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 84.5, // 42.25 * 2
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -12.675 },
                                ],
                                New: 71.825,
                                Amount: -12.675,
                            },
                        ],
                        '3 Case': [
                            {
                                Name: 'MultipleValues',
                                Base: 126.75, // 42.25 * 3
                                Conditions: [
                                    {
                                        Name: 'ZDM3_A009  Account_Contract3_ALL_UOMS',
                                        Type: '%',
                                        Value: -15,
                                        Amount: -19.0125,
                                    },
                                ],
                                New: 107.7375,
                                Amount: -19.0125,
                            },
                        ],
                        '1 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 42.25,
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -6.3375 },
                                ],
                                New: 35.9125,
                                Amount: -6.3375,
                            },
                        ],
                        '2 Box': [
                            {
                                Name: 'MultipleValues',
                                Base: 84.5, // 42.25 * 2
                                Conditions: [
                                    { Name: 'ZDM3_A006 Contract2_ALL_UOMS', Type: '%', Value: -15, Amount: -12.675 },
                                ],
                                New: 71.825,
                                Amount: -12.675,
                            },
                        ],
                    },
                    cart: {
                        Acc01: [],
                        OtherAcc: [],
                    },
                },
                PricePartial: {
                    Acc01: {
                        baseline: { expectedValue: 42.25, rules: [`X`] },
                        '0 Each': { expectedValue: 42.25, rules: [`X`] },
                        '9 Each': { expectedValue: 42.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 42.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    OtherAcc: {
                        baseline: { expectedValue: 42.25, rules: [`X`] },
                        '0 Each': { expectedValue: 42.25, rules: [`X`] },
                        '9 Each': { expectedValue: 42.25, rules: [`X`] },
                        '10 Each': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '11 Each': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Case': { expectedValue: 42.25, rules: [`X`] },
                        '2 Case': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '3 Case': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '1 Box': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                        '2 Box': {
                            expectedValue: 42.25,
                            rules: [
                                `'ZDM3@A006@Contract2' -> [[10,"D",15,"%"]],"EA"]] || DO NOT affect Partial Value Calc`,
                            ],
                        },
                    },
                    cart: {
                        Acc01: 42.25, // field value
                        OtherAcc: 42.25, // field value
                    },
                },
                Cart: {
                    Acc01: 24, // total units
                    OtherAcc: 24, // total units
                },
            },
        },
    };
}
