export default class PricingConfiguration {
    public version05 = {
        PPM_General: {
            QuantityCriteriaField: 'UnitsQuantity',
            PriceCriteriaField: 'TSATotalLinePrice',
            CalcDateField: '',
            UOM: {
                ConfigurationField: 'TSAUOMConfig',
                AllowedUomsField: 'TSAUOMAllowedUOMs',
                Fields: [
                    {
                        Type: 'TSAAOQMUOM1',
                        Quantity: 'TSAAOQMQuantity1',
                    },
                    {
                        Type: 'TSAAOQMUOM2',
                        Quantity: 'TSAAOQMQuantity2',
                    },
                ],
            },
        },
        PPM_CalcProcedures: [
            {
                Key: 'Proc1',
                Blocks: [
                    {
                        Key: 'Base',
                        ConditionsOrder: ['ZBASE'],
                        InitialPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                        CalculatedOfPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                    },
                    {
                        Key: 'Discount',
                        ConditionsOrder: ['ZDS1', 'ZDS2', 'ZDS3'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'GroupDiscount',
                        Group: true,
                        ExclusionRules: [
                            {
                                Condition: 'ZGD1',
                                ExcludeConditions: ['ZGD2'],
                            },
                        ],
                        ConditionsOrder: ['ZGD1', 'ZGD2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'ManualLine',
                        ConditionsOrder: [],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        UserManual: {
                            ValueField: 'TSAUserLineDiscount',
                        },
                    },
                    {
                        Key: 'Tax',
                        ConditionsOrder: ['MTAX'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                    },
                ],
                CalculatedItemFields: [
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                    },
                    {
                        Name: 'TSAPriceGroupDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'GroupDiscount',
                        },
                    },
                    {
                        Name: 'TSAPriceManualLineUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                    },
                ],
                AdditionalItemPricing: {
                    BasedOnBlock: 'Base',
                    ContinueCalcFromBlock: 'Tax',
                },
            },
        ],
        PPM_Conditions: [
            {
                Key: 'ZBASE',
                Name: 'ZBASE',
                TablesSearchOrder: ['A002', 'A001', 'A003'],
            },
            {
                Key: 'ZDS1',
                Name: 'ZDS1',
                TablesSearchOrder: ['A001', 'A002', 'A003'],
            },
            {
                Key: 'ZDS2',
                Name: 'ZDS2',
                TablesSearchOrder: ['A002'],
            },
            {
                Key: 'ZDS3',
                Name: 'ZDS3',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZGD1',
                Name: 'ZGD1',
                TablesSearchOrder: ['A002', 'A003'],
            },
            {
                Key: 'ZGD2',
                Name: 'ZGD2',
                TablesSearchOrder: ['A004', 'A003', 'A002'],
            },
            {
                Key: 'MTAX',
                Name: 'MTAX',
                TablesSearchOrder: ['A002', 'A004'],
            },
        ],
        PPM_Tables: [
            {
                Key: 'A001',
                KeyFields: ['ItemExternalID'],
            },
            {
                Key: 'A002',
                KeyFields: ['TransactionAccountExternalID', 'ItemExternalID'],
            },
            {
                Key: 'A003',
                KeyFields: ['TransactionAccountExternalID', 'ItemMainCategory'],
            },
            {
                Key: 'A004',
                KeyFields: ['TransactionAccountExternalID'],
            },
            {
                Key: 'A005',
                KeyFields: ['ItemMainCategory'],
            },
        ],
    };

    public version06 = {
        PPM_General: {
            QuantityCriteriaField: 'UnitsQuantity',
            PriceCriteriaField: 'TSATotalLinePrice',
            CalcDateField: 'TransactionTSAPricingDate',
            UOM: {
                ConfigurationField: 'TSAUOMConfig',
                AllowedUomsField: 'TSAUOMAllowedUOMs',
                Fields: [
                    {
                        Type: 'TSAAOQMUOM1',
                        Quantity: 'TSAAOQMQuantity1',
                    },
                    {
                        Type: 'TSAAOQMUOM2',
                        Quantity: 'TSAAOQMQuantity2',
                    },
                ],
            },
            MultipleValuesKeyFields: ['TransactionAccountTSAPricingContracts'],
        },
        PPM_CalcProcedures: [
            {
                Key: 'Proc1',
                Blocks: [
                    {
                        Key: 'Base',
                        ConditionsOrder: ['ZBASE'],
                        InitialPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                        CalculatedOfPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                    },
                    {
                        Key: 'Discount',
                        ConditionsOrder: ['ZDS1', 'ZDS2', 'ZDS3'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'Discount2',
                        ConditionsOrder: ['ZDS4', 'ZDS5', 'ZDS6', 'ZDS7'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'GroupDiscount',
                        Group: true,
                        ExclusionRules: [
                            {
                                Condition: 'ZGD1',
                                ExcludeConditions: ['ZGD2'],
                            },
                        ],
                        ConditionsOrder: ['ZGD1', 'ZGD2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'ManualLine',
                        ConditionsOrder: [],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        UserManual: {
                            ValueField: 'TSAUserLineDiscount',
                        },
                    },
                    {
                        Key: 'Tax',
                        ConditionsOrder: ['MTAX'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                    },
                    {
                        Key: 'MultipleValuesGeneral',
                        ConditionsOrder: ['ZDM3'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    // {
                    //     Key: 'MultipleValuesCategory',
                    //     ConditionsOrder: ['ZDM3'],
                    //     InitialPrice: {
                    //         Type: 'Block',
                    //         Name: 'MultipleValuesGeneral',
                    //     },
                    //     CalculatedOfPrice: {
                    //         Type: 'Block',
                    //         Name: 'MultipleValuesGeneral',
                    //     },
                    // },
                    // {
                    //     Key: 'MultipleValuesSpecificItem',
                    //     ConditionsOrder: ['ZDM1'],
                    //     InitialPrice: {
                    //         Type: 'Block',
                    //         Name: 'MultipleValuesCategory',
                    //     },
                    //     CalculatedOfPrice: {
                    //         Type: 'Block',
                    //         Name: 'MultipleValuesCategory',
                    //     },
                    // },
                    {
                        Key: 'MultipleValues',
                        ConditionsOrder: ['ZDM1', 'ZDM2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'MultipleValuesGeneral',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'MultipleValuesGeneral',
                        },
                    },
                    {
                        Key: 'PartialValue',
                        ConditionsOrder: ['ZDH1'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                ],
                ExclusionRules: [
                    {
                        Condition: 'ZDS1',
                        ExcludeConditions: ['ZDS4'],
                    },
                    {
                        Condition: 'ZDS6',
                        ExcludeConditions: ['ZDS7'],
                    },
                ],
                CalculatedItemFields: [
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceGroupDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'GroupDiscount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceManualLineUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscount2UnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount2',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPricePartial',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'PartialValue',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotal',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalPercent',
                        Type: '%',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                ],
                AdditionalItemPricing: {
                    BasedOnBlock: 'Base',
                    ContinueCalcFromBlock: 'Tax',
                },
            },
        ],
        PPM_Conditions: [
            {
                Key: 'ZBASE',
                Name: 'ZBASE Setting Initial Values',
                TablesSearchOrder: ['A002', 'A001', 'A003', 'A005', 'A004'],
            },
            {
                Key: 'ZDS1',
                Name: 'ZDS1 Discount',
                TablesSearchOrder: ['A001', 'A002', 'A003'],
            },
            {
                Key: 'ZDS2',
                Name: 'ZDS2 Discount',
                TablesSearchOrder: ['A002'],
            },
            {
                Key: 'ZDS3',
                Name: 'ZDS3 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS4',
                Name: 'ZDS4 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS5',
                Name: 'ZDS5 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS6',
                Name: 'ZDS6 Discount',
                TablesSearchOrder: ['A003', 'A004', 'A001'],
            },
            {
                Key: 'ZDS7',
                Name: 'ZDS7 Discount',
                TablesSearchOrder: ['A002', 'A004', 'A005'],
            },
            {
                Key: 'ZGD1',
                Name: 'ZGD1 Group Rules Discount',
                TablesSearchOrder: ['A002', 'A003'],
            },
            {
                Key: 'ZGD2',
                Name: 'ZGD2 Group Rules Discount',
                TablesSearchOrder: ['A004', 'A003', 'A002'],
            },
            {
                Key: 'MTAX',
                Name: 'MTAX',
                TablesSearchOrder: ['A002', 'A004'],
            },
            {
                Key: 'ZDM1',
                Name: 'ZDM1 Best Out Of Multiple Options Discount For Specific Item',
                TablesSearchOrder: ['A010', 'A008'],
            },
            {
                Key: 'ZDM2',
                Name: 'ZDM2 Best Out Of Multiple Options Discount For Category',
                TablesSearchOrder: ['A007'],
            },
            {
                Key: 'ZDM3',
                Name: 'ZDM3 Best Out Of Multiple Options Discount',
                TablesSearchOrder: ['A009', 'A006'],
            },
            {
                Key: 'ZDH1',
                Name: 'ZDH1 Hierarchy Discount',
                TablesSearchOrder: [
                    { Name: 'A011' },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 7 }] },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 4 }] },
                ],
            },
        ],
        PPM_Tables: [
            {
                Key: 'A001',
                KeyFields: ['ItemExternalID'],
            },
            {
                Key: 'A002',
                KeyFields: ['TransactionAccountExternalID', 'ItemExternalID'],
            },
            {
                Key: 'A003',
                KeyFields: ['TransactionAccountExternalID', 'ItemMainCategory'],
            },
            {
                Key: 'A004',
                KeyFields: ['TransactionAccountExternalID'],
            },
            {
                Key: 'A005',
                KeyFields: ['ItemMainCategory'],
            },
            {
                Key: 'A006',
                KeyFields: ['TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A007',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemMainCategory'],
            },
            {
                Key: 'A008',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A009',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A010',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A011',
                KeyFields: ['TransactionAccountTSAPricingHierarchy', 'ItemExternalID'],
            },
        ],
    };

    public version07 = {
        PPM_General: {
            QuantityCriteriaField: 'UnitsQuantity',
            PriceCriteriaField: 'TSATotalLinePrice',
            TotalPriceCriteria: { Type: 'Field', Name: 'TSATotalLinePrice' },
            CalcDateField: 'TransactionTSAPricingDate',
            UOM: {
                ConfigurationField: 'TSAUOMConfig',
                AllowedUomsField: 'TSAUOMAllowedUOMs',
                Fields: [
                    {
                        Type: 'TSAAOQMUOM1',
                        Quantity: 'TSAAOQMQuantity1',
                    },
                    {
                        Type: 'TSAAOQMUOM2',
                        Quantity: 'TSAAOQMQuantity2',
                    },
                ],
            },
            MultipleValuesKeyFields: ['TransactionAccountTSAPricingContracts'],
        },
        PPM_CalcProcedures: [
            {
                Key: 'Proc1',
                Blocks: [
                    {
                        Key: 'Base',
                        ConditionsOrder: ['ZBASE'],
                        InitialPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                        CalculatedOfPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                    },
                    {
                        Key: 'Discount',
                        ConditionsOrder: ['ZDS1', 'ZDS2', 'ZDS3'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'Discount2',
                        ConditionsOrder: ['ZDS4', 'ZDS5', 'ZDS6', 'ZDS7'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'GroupDiscount',
                        Group: true,
                        ExclusionRules: [
                            {
                                Condition: 'ZGD1',
                                ExcludeConditions: ['ZGD2'],
                            },
                        ],
                        ConditionsOrder: ['ZGD1', 'ZGD2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'ManualLine',
                        ConditionsOrder: [],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        UserManual: {
                            ValueField: 'TSAUserLineDiscount',
                        },
                    },
                    {
                        Key: 'Tax',
                        ConditionsOrder: ['MTAX'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                    },
                    {
                        Key: 'MultipleValues',
                        ConditionsOrder: ['ZDM3', 'ZDM1', 'ZDM2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'PartialValue',
                        ConditionsOrder: ['ZDH1'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                ],
                ExclusionRules: [
                    {
                        Condition: 'ZDS1',
                        ExcludeConditions: ['ZDS4'],
                    },
                    {
                        Condition: 'ZDS6',
                        ExcludeConditions: ['ZDS7'],
                    },
                ],
                CalculatedItemFields: [
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceGroupDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'GroupDiscount',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceManualLineUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscount2UnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount2',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPricePartial',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'PartialValue',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotal',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalPercent',
                        Type: '%',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Unit',
                            UomIndex: 1,
                        },
                    },
                ],
                AdditionalItemPricing: {
                    BasedOnBlock: 'Base',
                    ContinueCalcFromBlock: 'Tax',
                },
            },
        ],
        PPM_Conditions: [
            {
                Key: 'ZBASE',
                Name: 'ZBASE Setting Initial Values',
                TablesSearchOrder: ['A002', 'A001', 'A003', 'A005', 'A004'],
            },
            {
                Key: 'ZDS1',
                Name: 'ZDS1 Discount',
                TablesSearchOrder: ['A001', 'A002', 'A003'],
            },
            {
                Key: 'ZDS2',
                Name: 'ZDS2 Discount',
                TablesSearchOrder: ['A002'],
            },
            {
                Key: 'ZDS3',
                Name: 'ZDS3 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS4',
                Name: 'ZDS4 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS5',
                Name: 'ZDS5 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS6',
                Name: 'ZDS6 Discount',
                TablesSearchOrder: ['A003', 'A004', 'A001'],
            },
            {
                Key: 'ZDS7',
                Name: 'ZDS7 Discount',
                TablesSearchOrder: ['A002', 'A004', 'A005'],
            },
            {
                Key: 'ZGD1',
                Name: 'ZGD1 Group Rules Discount',
                TablesSearchOrder: ['A002', 'A003'],
            },
            {
                Key: 'ZGD2',
                Name: 'ZGD2 Group Rules Discount',
                TablesSearchOrder: ['A004', 'A003', 'A002'],
            },
            {
                Key: 'MTAX',
                Name: 'MTAX',
                TablesSearchOrder: ['A002', 'A004'],
            },
            {
                Key: 'ZDM1',
                Name: 'ZDM1 Best Out Of Multiple Options Discount For Specific Item',
                TablesSearchOrder: ['A010', 'A008'],
            },
            {
                Key: 'ZDM2',
                Name: 'ZDM2 Best Out Of Multiple Options Discount For Category',
                TablesSearchOrder: ['A007'],
            },
            {
                Key: 'ZDM3',
                Name: 'ZDM3 Best Out Of Multiple Options Discount',
                TablesSearchOrder: ['A009', 'A006'],
            },
            {
                Key: 'ZDH1',
                Name: 'ZDH1 Hierarchy Discount',
                TablesSearchOrder: [
                    { Name: 'A011' },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 7 }] },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 4 }] },
                ],
            },
        ],
        PPM_Tables: [
            {
                Key: 'A001',
                KeyFields: ['ItemExternalID'],
            },
            {
                Key: 'A002',
                KeyFields: ['TransactionAccountExternalID', 'ItemExternalID'],
            },
            {
                Key: 'A003',
                KeyFields: ['TransactionAccountExternalID', 'ItemMainCategory'],
            },
            {
                Key: 'A004',
                KeyFields: ['TransactionAccountExternalID'],
            },
            {
                Key: 'A005',
                KeyFields: ['ItemMainCategory'],
            },
            {
                Key: 'A006',
                KeyFields: ['TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A007',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemMainCategory'],
            },
            {
                Key: 'A008',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A009',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A010',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A011',
                KeyFields: ['TransactionAccountTSAPricingHierarchy', 'ItemExternalID'],
            },
        ],
    };
<<<<<<< HEAD

    public version07for05data = {
        PPM_General: {
            QuantityCriteriaField: 'UnitsQuantity',
            PriceCriteriaField: 'TSATotalLinePrice',
            TotalPriceCriteria: { Type: 'Field', Name: 'TSATotalLinePrice' },
            CalcDateField: 'TransactionTSAPricingDate',
            UOM: {
                ConfigurationField: 'TSAUOMConfig',
                AllowedUomsField: 'TSAUOMAllowedUOMs',
                Fields: [
                    {
                        Type: 'TSAAOQMUOM1',
                        Quantity: 'TSAAOQMQuantity1',
                    },
                    {
                        Type: 'TSAAOQMUOM2',
                        Quantity: 'TSAAOQMQuantity2',
                    },
                ],
            },
            MultipleValuesKeyFields: ['TransactionAccountTSAPricingContracts'],
        },
        PPM_CalcProcedures: [
            {
                Key: 'Proc1',
                Blocks: [
                    {
                        Key: 'Base',
                        ConditionsOrder: ['ZBASE'],
                        InitialPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                        CalculatedOfPrice: {
                            Type: 'Field',
                            Name: 'UnitPrice',
                        },
                    },
                    {
                        Key: 'Discount',
                        ConditionsOrder: ['ZDS1', 'ZDS2', 'ZDS3'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'Discount2',
                        ConditionsOrder: ['ZDS4', 'ZDS5', 'ZDS6', 'ZDS7'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'GroupDiscount',
                        Group: true,
                        ExclusionRules: [
                            {
                                Condition: 'ZGD1',
                                ExcludeConditions: ['ZGD2'],
                            },
                        ],
                        ConditionsOrder: ['ZGD1', 'ZGD2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'ManualLine',
                        ConditionsOrder: [],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        UserManual: {
                            ValueField: 'TSAUserLineDiscount',
                        },
                    },
                    {
                        Key: 'Tax',
                        ConditionsOrder: ['MTAX'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                    },
                    {
                        Key: 'MultipleValues',
                        ConditionsOrder: ['ZDM3', 'ZDM1', 'ZDM2'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                    {
                        Key: 'PartialValue',
                        ConditionsOrder: ['ZDH1'],
                        InitialPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        CalculatedOfPrice: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                    },
                ],
                ExclusionRules: [
                    {
                        Condition: 'ZDS1',
                        ExcludeConditions: ['ZDS4'],
                    },
                    {
                        Condition: 'ZDS6',
                        ExcludeConditions: ['ZDS7'],
                    },
                ],
                CalculatedItemFields: [
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceBaseUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscountUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceGroupDiscountUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'GroupDiscount',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceManualLineUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'ManualLine',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitPriceAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceDiscount2UnitPriceAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Discount2',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter1',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                    {
                        Name: 'TSAPriceMultiAfter2',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'MultipleValues',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPricePartial',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'PartialValue',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 2,
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotal',
                        Type: '=',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalPercent',
                        Type: '%',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxTotalDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Total',
                        },
                    },
                    {
                        Name: 'TSAPriceTaxUnitDiff',
                        Type: '-',
                        Operand1: {
                            Type: 'Block',
                            Name: 'Tax',
                        },
                        Operand2: {
                            Type: 'Block',
                            Name: 'Base',
                        },
                        BlockPriceField: {
                            Type: 'Single',
                            UomIndex: 1,
                        },
                    },
                ],
                AdditionalItemPricing: {
                    BasedOnBlock: 'Base',
                    ContinueCalcFromBlock: 'Tax',
                },
            },
        ],
        PPM_Conditions: [
            {
                Key: 'ZBASE',
                Name: 'ZBASE Setting Initial Values',
                TablesSearchOrder: ['A002', 'A001', 'A003', 'A005', 'A004'],
            },
            {
                Key: 'ZDS1',
                Name: 'ZDS1 Discount',
                TablesSearchOrder: ['A001', 'A002', 'A003'],
            },
            {
                Key: 'ZDS2',
                Name: 'ZDS2 Discount',
                TablesSearchOrder: ['A002'],
            },
            {
                Key: 'ZDS3',
                Name: 'ZDS3 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS4',
                Name: 'ZDS4 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS5',
                Name: 'ZDS5 Discount',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS6',
                Name: 'ZDS6 Discount',
                TablesSearchOrder: ['A003', 'A004', 'A001'],
            },
            {
                Key: 'ZDS7',
                Name: 'ZDS7 Discount',
                TablesSearchOrder: ['A002', 'A004', 'A005'],
            },
            {
                Key: 'ZGD1',
                Name: 'ZGD1 Group Rules Discount',
                TablesSearchOrder: ['A002', 'A003'],
            },
            {
                Key: 'ZGD2',
                Name: 'ZGD2 Group Rules Discount',
                TablesSearchOrder: ['A004', 'A003', 'A002'],
            },
            {
                Key: 'MTAX',
                Name: 'MTAX',
                TablesSearchOrder: ['A002', 'A004'],
            },
            {
                Key: 'ZDM1',
                Name: 'ZDM1 Best Out Of Multiple Options Discount For Specific Item',
                TablesSearchOrder: ['A010', 'A008'],
            },
            {
                Key: 'ZDM2',
                Name: 'ZDM2 Best Out Of Multiple Options Discount For Category',
                TablesSearchOrder: ['A007'],
            },
            {
                Key: 'ZDM3',
                Name: 'ZDM3 Best Out Of Multiple Options Discount',
                TablesSearchOrder: ['A009', 'A006'],
            },
            {
                Key: 'ZDH1',
                Name: 'ZDH1 Hierarchy Discount',
                TablesSearchOrder: [
                    { Name: 'A011' },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 7 }] },
                    { Name: 'A011', Keys: [{ Name: 'TransactionAccountTSAPricingHierarchy', Split: 4 }] },
                ],
            },
        ],
        PPM_Tables: [
            {
                Key: 'A001',
                KeyFields: ['ItemExternalID'],
            },
            {
                Key: 'A002',
                KeyFields: ['TransactionAccountExternalID', 'ItemExternalID'],
            },
            {
                Key: 'A003',
                KeyFields: ['TransactionAccountExternalID', 'ItemMainCategory'],
            },
            {
                Key: 'A004',
                KeyFields: ['TransactionAccountExternalID'],
            },
            {
                Key: 'A005',
                KeyFields: ['ItemMainCategory'],
            },
            {
                Key: 'A006',
                KeyFields: ['TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A007',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemMainCategory'],
            },
            {
                Key: 'A008',
                KeyFields: ['TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A009',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts'],
            },
            {
                Key: 'A010',
                KeyFields: ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID'],
            },
            {
                Key: 'A011',
                KeyFields: ['TransactionAccountTSAPricingHierarchy', 'ItemExternalID'],
            },
        ],
    };
}
=======
}
>>>>>>> parent of 85c3ba54 (added configuration of 0.7 for 0.5 data, added callings for pricing operations at test.index)
