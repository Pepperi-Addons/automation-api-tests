export class PricingData {
    public config_05 = {
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
        ],
    };

    public config_06 = {
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
                    // {
                    //     Type: 'TSAAOQMUOM2',
                    //     Quantity: 'TSAAOQMQuantity2',
                    // },
                    {
                        Type: 'TransactionTSASingleUOMType',
                        Quantity: 'TransactionTSASingleUOMValue',
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
                            UomIndex: 2,
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
                            UomIndex: 2,
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
                            UomIndex: 2,
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
        ],
    };

    public config_06_expanded = {
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
                        ConditionsOrder: ['ZDS4', 'ZDS5'],
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
                ExclusionRules: [
                    {
                        Condition: 'ZDS1',
                        ExcludeConditions: ['ZDS4'],
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
                Key: 'ZDS4',
                Name: 'ZDS4',
                TablesSearchOrder: ['A001'],
            },
            {
                Key: 'ZDS5',
                Name: 'ZDS5',
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
        ],
    };

    public documentsIn_PPM_Values = {
        base: {
            'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
            'ZBASE@A002@Acc01@Frag005':
                '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
            'ZBASE@A002@Acc01@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",22,"P"]]]]',
            'ZBASE@A001@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",50,"P"]]]]',
            'ZBASE@A001@Frag007':
                '[[true,"1555891200000","1704067200000","1","1","ZBASE_A001",[[0,"S",40,"P"]]],[true,"1704067200000","","1","1","ZBASE_A001",[[0,"S",60,"P"]]]]',
            'ZBASE@A001@Frag012': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]]]]',
            'ZBASE@A003@Acc01@Pharmacy':
                '[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",30,"P"]]]]',
        },
        discount: {
            'ZDS1@A001@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]',
            'ZDS1@A001@Frag007': '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]',
            'ZDS1@A001@Drug0005': '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",20,"%"]]]]',
            'ZDS1@A001@Spring Loaded Frizz-Fighting Conditioner':
                '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",5,"%"],[5,"D",10,"%"],[20,"D",15,"%"]]]]',
            'ZDS2@A002@Acc01@ToBr55':
                '[[true,"1555891200000","2534022144999","1","","Free Goods",[[5,"D",100,"%","",1,"EA","ToBr10",0],[20,"D",100,"%","",1,"CS","ToBr55",0]],"EA"]]',
            'ZDS3@A001@Drug0002':
                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[10,"D",100,"%","",2,"CS","Drug0002",0]],"CS"]]',
            'ZDS3@A001@Drug0004':
                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[3,"D",100,"%","",2,"EA","Drug0002",0]],"CS"]]',
        },
        group: {
            'ZGD1@A002@Acc01@MakeUp003':
                '[[true,"1555891200000","2534022144999","1","","ZGD1_A002",[[10,"D",20,"%"]],"EA"]]',
            'ZGD1@A003@Acc01@Beauty Make Up':
                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[12,"D",100,"%","",1,"EA","MakeUp018",0]],"EA"]]',
            'ZGD2@A002@Acc01@MakeUp018':
                '[[true,"1555891200000","2534022144999","1","","additionalItem",[[2,"D",100,"%","",1,"EA","MakeUp018",0]],"EA"]]',
            'ZGD2@A003@Acc01@Beauty Make Up':
                '[[true,"1555891200000","2534022144999","1","","ZGD2_A003",[[3,"D",3,"%"],[7,"D",7,"%"]],"EA"]]',
        },
        tax: {
            'MTAX@A002@Acc01@Frag005': '[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',
            'MTAX@A002@Acc01@Frag012': '[[true,"1555891200000","2534022144999","1","1","MTAX_A002",[[0,"I",17,"%"]]]]',
        },
        date: {
            'ZDS4@A001@Frag007':
                '[[true,"1555891200000","1704067200000","1","1","ZDS4_A001",[[0,"D",10,"%"]]],[true,"1701388800000","","1","1","ZDS4_A001",[[0,"D",5,"%"]]]]',
            'ZDS5@A001@Frag007':
                '[[true,"1555891200000","1704067200000","1","1","ZDS5_A001",[[0,"D",10,"%"]]],[true,"1701388800000","","1","1","ZDS5_A001",[[0,"D",5,"%"]]]]',
        },
        uoms: {
            'ZBASE@A003@Acc01@Hair4You':
                '[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",10,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",50,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",200,"P"]],"BOX","BOX"]]',
            'ZDS1@A001@Hair002':
                '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",2,"%"],[5,"D",5,"%"],[20,"D",10,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[4,"D",7.5,"P"]],"CS","CS"]]',
            'ZDS2@A002@Acc01@Hair012':
                '[[true,"1555891200000","2534022144999","1","","Free Goods",[[5,"D",100,"%","",1,"EA","Hair002",0],[20,"D",100,"%","",1,"CS","Hair012",0]],"EA","EA@CS"],[true,"1555891200000","2534022144999","1","","Free Goods",[[2,"D",100,"%","",1,"CS","Hair002",0],[4,"D",100,"%","",1,"CS","MaFa24",0]],"BOX","BOX"]]',
        },
        totals: {
            'ZBASE@A005@Hand Cosmetics':
                '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",8,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",40,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",160,"P"]],"BOX","BOX"]]',
            'ZBASE@A001@MaLi38':
                '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",80,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",440,"P"]],"BOX","BOX"]]',
        },
        multi: {
            'ZDM1@A006@Contract1': '[[true,"1555891200000","2534022144999","1","","ZDM1_A006",[[10,"D",5,"%"]],"EA"]]',
            'ZDM1@A006@Contract2': '[[true,"1555891200000","2534022144999","1","","ZDM1_A006",[[10,"D",15,"%"]],"EA"]]',
            'ZDM1@A007@Contract1@Facial Cosmetics':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]]',
            'ZDM1@A007@Contract2@Facial Cosmetics':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"]],"BOX","BOX"]]',
            'ZDM1@A007@Contract3@Facial Cosmetics':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"]],"BOX","BOX"]]',
            'ZDM1@A008@Contract1@MaLi38':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]]',
            'ZDM1@A008@Contract2@MaLi38':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[2,"D",5,"%"]],"BOX","BOX"]]',
            'ZDM1@A009@Acc01@Contract1':
                '[[true,"1555891200000","2534022144999","1","","ZDM1_A009",[[10,"D",10,"%"]],"EA"]]',
            'ZDM1@A009@Acc01@Contract2':
                '[[true,"1555891200000","2534022144999","1","","ZDM1_A009",[[10,"D",20,"%"]],"EA"]]',
            'ZDM1@A009@Acc01@Contract3':
                '[[true,"1555891200000","2534022144999","1","","ZDM1_A009",[[10,"D",30,"%"]],"EA"]]',
            'ZDM1@A010@Acc01@Contract1@MaLi38':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[4,"D",4,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[2,"D",2,"%"]],"BOX","BOX"]]',
            'ZDM1@A010@Acc01@Contract3@MaLi38':
                '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[10,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[4,"D",15,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[2,"D",25,"%"]],"BOX","BOX"]]',
        },
        partial: {},
        exclusion: {},
    };
    public testItemsValues = {
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
}
