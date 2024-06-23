export class PricingData07 {
    public testItemsValues = {
        DeliveryDate: {
            Frag007: {
                ItemPrice: 28.25,
                NPMCalcMessage: {
                    CurrentDate: {
                        baseline: [
                            {
                                Name: 'Base',
                                Base: 0,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 60, Amount: 0 }],
                                New: 0,
                                Amount: 0,
                            },
                        ],
                        '1 Each': [
                            {
                                Name: 'Base',
                                Base: 28.25,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 60, Amount: 31.75 }],
                                New: 60,
                                Amount: 31.75,
                            },
                        ],
                        '2 Each': [
                            {
                                Name: 'Base',
                                Base: 56.5,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 60, Amount: 63.5 }],
                                New: 120,
                                Amount: 63.5,
                            },
                            {
                                Name: 'Discount',
                                Base: 120,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -20, Amount: -24 }],
                                New: 96,
                                Amount: -24,
                            },
                        ],
                        '3 Each': [
                            {
                                Name: 'Base',
                                Base: 84.75,
                                Conditions: [{ Name: 'ZBASE_A001', Type: 'S', Value: 60, Amount: 95.25 }],
                                New: 180,
                                Amount: 95.25,
                            },
                            {
                                Name: 'Discount',
                                Base: 180,
                                Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -20, Amount: -36 }],
                                New: 144,
                                Amount: -36,
                            },
                        ],
                    },
                    OtherAcc: {
                        baseline: [],
                        '1 Each': [],
                        '2 Each': [],
                        '3 Each': [],
                    },
                },
                PriceBaseUnitPriceAfter1: {
                    CurrentDate: {
                        cart: {
                            baseline: 60.0,
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 50.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                    OtherAcc: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 26.25,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                },
                PriceDiscountUnitPriceAfter1: {
                    CurrentDate: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                    OtherAcc: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                },
                PriceGroupDiscountUnitPriceAfter1: {
                    CurrentDate: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                    OtherAcc: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                },
                PriceManualLineUnitPriceAfter1: {
                    CurrentDate: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                    OtherAcc: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                },
                PriceTaxUnitPriceAfter1: {
                    CurrentDate: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                    OtherAcc: {
                        cart: {
                            '1 Each': 10.0,
                            '2 Each': 10.0,
                            '3 Each': 10.0,
                        },
                        baseline: 60.0,
                        '1 Each': 10.0,
                        '2 Each': 10.0,
                        '3 Each': 10.0,
                    },
                },
            },
        },
    };
}
