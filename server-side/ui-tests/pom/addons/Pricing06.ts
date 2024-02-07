export class PricingData06 {
    public tableName = 'PPM_Values';
    public dummyPPM_Values_length = 49999;

    public config = {
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
                        Key: 'MultipleValues',
                        ConditionsOrder: ['ZDM1', 'ZDM2', 'ZDM3'],
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

    public documentsIn_PPM_Values = {
        'ZBASE@A002@Acc01@Frag005': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
        'ZBASE@A002@Acc01@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",22,"P"]]]]',
        'ZBASE@A001@ToBr56': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",50,"P"]]]]',
        'ZBASE@A001@Frag007':
            '[[true,"1555891200000","1704067200000","1","1","ZBASE_A001",[[0,"S",40,"P"]]],[true,"1704067200000","","1","1","ZBASE_A001",[[0,"S",60,"P"]]]]',
        'ZBASE@A001@Frag012': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]]]]',
        'ZBASE@A003@Acc01@Pharmacy': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",30,"P"]]]]',
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
        'ZDS4@A001@Frag007':
            '[[true,"1555891200000","1704067200000","1","1","ZDS4_A001",[[0,"D",10,"%"]]],[true,"1701388800000","","1","1","ZDS4_A001",[[0,"D",5,"%"]]]]',
        'ZDS5@A001@Frag007':
            '[[true,"1555891200000","1704067200000","1","1","ZDS5_A001",[[0,"D",10,"%"]]],[true,"1701388800000","","1","1","ZDS5_A001",[[0,"D",5,"%"]]]]',
        'ZBASE@A003@Acc01@Hair4You':
            '[[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",10,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",50,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A003",[[0,"S",200,"P"]],"BOX","BOX"]]',
        'ZDS1@A001@Hair002':
            '[[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[2,"D",2,"%"],[5,"D",5,"%"],[20,"D",10,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDS1_A001",[[4,"D",7.5,"P"]],"CS","CS"]]',
        'ZDS2@A002@Acc01@Hair012':
            '[[true,"1555891200000","2534022144999","1","","Free Goods",[[5,"D",100,"%","",1,"EA","Hair002",0],[20,"D",100,"%","",1,"CS","Hair012",0]],"EA","EA@CS"],[true,"1555891200000","2534022144999","1","","Free Goods",[[2,"D",100,"%","",1,"CS","Hair002",0],[4,"D",100,"%","",1,"CS","MaFa24",0]],"BOX","BOX"]]',
        'ZBASE@A005@Hand Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",8,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",40,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",160,"P"]],"BOX","BOX"]]',
        'ZBASE@A001@MaFa25':
            '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",80,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",440,"P"]],"BOX","BOX"]]',
        'ZBASE@A001@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",20,"P"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",80,"P"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZBASE_A001",[[0,"S",440,"P"]],"BOX","BOX"]]',
        'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
        'ZDM3@A006@Contract1': '[[true,"1555891200000","2534022144999","1","","ZDM3_A006",[[10,"D",5,"%"]],"EA"]]',
        'ZDM3@A006@Contract2': '[[true,"1555891200000","2534022144999","1","","ZDM3_A006",[[10,"D",15,"%"]],"EA"]]',
        'ZDM2@A007@Contract1@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]]',
        'ZDM2@A007@Contract2@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[5,"D",10,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",2,"%"]],"BOX","BOX"]]',
        'ZDM2@A007@Contract3@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007",[[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A007",[[2,"D",5,"%"]],"BOX","BOX"]]',
        'ZDM1@A008@Contract1@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]]',
        'ZDM1@A008@Contract2@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008",[[6,"D",15,"%"]],"BOX","BOX"]]',
        'ZDM3@A009@Acc01@Contract1':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009",[[10,"D",10,"%"]],"EA"]]',
        'ZDM3@A009@Acc01@Contract2':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009",[[10,"D",20,"%"]],"EA"]]',
        'ZDM3@A009@Acc01@Contract3':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009",[[10,"D",30,"%"]],"EA"]]',
        'ZDM1@A010@Acc01@Contract1@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[4,"D",4,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[2,"D",2,"%"]],"BOX","BOX"]]',
        'ZDM1@A010@Acc01@Contract3@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[10,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[4,"D",15,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010",[[3,"D",25,"%"]],"BOX","BOX"]]',
        'ZDH1@A011@1000@Frag006': '[[true,"1555891200000","2534022144999","1","","ZDH1_A011",[[10,"D",20,"%"]],"EA"]]',
        'ZDH1@A011@1000200@Frag008':
            '[[true,"1555891200000","2534022144999","1","","ZDH1_A011",[[10,"D",30,"%"]],"EA"]]',
        'ZDH1@A011@100020030@Frag009':
            '[[true,"1555891200000","2534022144999","1","","ZDH1_A011",[[10,"D",10,"%"]],"EA"]]',
        'ZDH1@A011@100020030@Frag011':
            '[[true,"1555891200000","2534022144999","1","","ZDH1_A011",[[10,"D",10,"%"]],"EA"]]',
        'ZDH1@A011@1000200@Frag011':
            '[[true,"1555891200000","2534022144999","1","","ZDH1_A011",[[10,"D",30,"%"]],"EA"]]',
    };

    public groupRulesItems_CartTest_details = {
        MakeUp001: {
            '1EA': {
                title: 'total of 11 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 26.73,
                        MakeUp002: 27.66,
                        MakeUp003: 22.44,
                        MakeUp006: 31.38,
                        MakeUp018: 13.9,
                        MakeUp019: 14.83,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
        MakeUp002: {
            '1EA': {
                title: 'total of 10 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 26.73,
                        MakeUp002: 27.66,
                        MakeUp003: 22.44,
                        MakeUp006: 31.38,
                        MakeUp018: 13.9,
                        MakeUp019: 14.83,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
        MakeUp003: {
            '1EA': {
                title: 'total of 11 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 26.73,
                        MakeUp002: 27.66,
                        MakeUp003: 22.44,
                        MakeUp006: 31.38,
                        MakeUp018: 13.9,
                        MakeUp019: 14.83,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
        MakeUp006: {
            '1EA': {
                title: 'total of 11 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 26.73,
                        MakeUp002: 27.66,
                        MakeUp003: 22.44,
                        MakeUp006: 31.38,
                        MakeUp018: 13.9,
                        MakeUp019: 14.83,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
        MakeUp018: {
            '1EA': {
                title: 'total of 10 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 26.73,
                        MakeUp002: 27.66,
                        MakeUp003: 22.44,
                        MakeUp006: 31.38,
                        MakeUp018: 13.9,
                        MakeUp019: 14.83,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
        MakeUp019: {
            '1EA': {
                title: 'total of 6 group items',
                PriceGroupDiscountUnitPriceAfter1: {
                    Acc01: {
                        MakeUp001: 27.88,
                        MakeUp002: 28.85,
                        MakeUp003: 29.82,
                        MakeUp006: 32.73,
                        MakeUp018: 14.5,
                        MakeUp019: 15.47,
                    },
                    OtherAcc: {
                        MakeUp001: 28.75,
                        MakeUp002: 29.75,
                        MakeUp003: 30.75,
                        MakeUp006: 33.75,
                        MakeUp018: 14.95,
                        MakeUp019: 15.95,
                    },
                },
            },
        },
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
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 27.75,
                    baseline: 27.75,
                    '1unit': 27.75,
                    '3units': 27.75,
                    '1case(6units)': 27.75,
                    '4cases(24units)': 27.75,
                },
                OtherAcc: {
                    cart: 27.75,
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
                    cart: 27.0,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
                OtherAcc: {
                    cart: 27.0,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 22.95,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    cart: 22.95,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 27.0,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
                OtherAcc: {
                    cart: 27.0,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27.0,
                    '1case(6units)': 27.0,
                    '4cases(24units)': 27.0,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 22.95,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    cart: 22.95,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 22.95,
                    baseline: 27.0,
                    '1unit': 27.0,
                    '3units': 27 * 0.95,
                    '1case(6units)': 27 * 0.9,
                    '4cases(24units)': 27 * 0.85,
                },
                OtherAcc: {
                    cart: 22.95,
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
                Acc01: {
                    cart: 6 * 10,
                    baseline: 6 * 10,
                    '1unit': 10,
                    '3units': 10,
                    '1case(6units)': 6 * 10,
                    '4cases(24units)': 6 * 10,
                },
                OtherAcc: {
                    cart: 26.25,
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 10,
                    baseline: 6 * 10,
                    '1unit': 10,
                    '3units': 10,
                    '1case(6units)': 6 * 10,
                    '4cases(24units)': 6 * 10,
                },
                OtherAcc: {
                    cart: 26.25,
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 10,
                    baseline: 6 * 10,
                    '1unit': 10,
                    '3units': 10,
                    '1case(6units)': 6 * 10,
                    '4cases(24units)': 6 * 10,
                },
                OtherAcc: {
                    cart: 26.25,
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 10,
                    baseline: 6 * 10,
                    '1unit': 10,
                    '3units': 10,
                    '1case(6units)': 6 * 10,
                    '4cases(24units)': 6 * 10,
                },
                OtherAcc: {
                    cart: 26.25,
                    baseline: 26.25,
                    '1unit': 26.25,
                    '3units': 26.25,
                    '1case(6units)': 26.25,
                    '4cases(24units)': 26.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 70.2,
                    baseline: 70.2,
                    '1unit': 11.7,
                    '3units': 11.7,
                    '1case(6units)': 70.2,
                    '4cases(24units)': 70.2,
                },
                OtherAcc: {
                    cart: 26.25,
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
                Acc01: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
                OtherAcc: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
                OtherAcc: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
                OtherAcc: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
                OtherAcc: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 140.4,
                    baseline: 140.4,
                    '1unit': 23.4,
                    '3units': 23.4,
                    '1case(6units)': 140.4,
                    '4cases(24units)': 140.4,
                },
                OtherAcc: {
                    cart: 6 * 20,
                    baseline: 6 * 20,
                    '1unit': 20,
                    '3units': 20,
                    '1case(6units)': 6 * 20,
                    '4cases(24units)': 6 * 20,
                },
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
                Acc01: {
                    cart: 22 * 6,
                    baseline: 22 * 6,
                    '1unit': 22,
                    '3units': 22,
                    '1case(6units)': 22 * 6,
                    '4cases(24units)': 22 * 6,
                },
                OtherAcc: {
                    cart: 50 * 6,
                    baseline: 50 * 6,
                    '1unit': 50,
                    '3units': 50,
                    '1case(6units)': 50 * 6,
                    '4cases(24units)': 50 * 6,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 22 * 6,
                    baseline: 22 * 6,
                    '1unit': 22,
                    '3units': 17.6,
                    '1case(6units)': 105.6,
                    '4cases(24units)': 105.6,
                },
                OtherAcc: {
                    cart: 40 * 6,
                    baseline: 50 * 6,
                    '1unit': 50,
                    '3units': 40,
                    '1case(6units)': 40 * 6,
                    '4cases(24units)': 40 * 6,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 22 * 6,
                    baseline: 22 * 6,
                    '1unit': 22,
                    '3units': 22,
                    '1case(6units)': 22 * 6,
                    '4cases(24units)': 22 * 6,
                },
                OtherAcc: {
                    cart: 50 * 6,
                    baseline: 50 * 6,
                    '1unit': 50,
                    '3units': 50,
                    '1case(6units)': 50 * 6,
                    '4cases(24units)': 50 * 6,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 22 * 6,
                    baseline: 22 * 6,
                    '1unit': 22,
                    '3units': 17.6,
                    '1case(6units)': 105.6,
                    '4cases(24units)': 105.6,
                },
                OtherAcc: {
                    cart: 40 * 6,
                    baseline: 50 * 6,
                    '1unit': 50,
                    '3units': 40,
                    '1case(6units)': 40 * 6,
                    '4cases(24units)': 40 * 6,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 22 * 6,
                    baseline: 22 * 6,
                    '1unit': 22,
                    '3units': 17.6,
                    '1case(6units)': 105.6,
                    '4cases(24units)': 105.6,
                },
                OtherAcc: {
                    cart: 40 * 6,
                    baseline: 50 * 6,
                    '1unit': 50,
                    '3units': 40,
                    '1case(6units)': 40 * 6,
                    '4cases(24units)': 40 * 6,
                },
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
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 30.25,
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 30.25,
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 30.25,
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 30.25,
                    baseline: 30.25,
                    '1unit': 30.25,
                    '3units': 30.25,
                    '1case(6units)': 30.25,
                    '4cases(24units)': 30.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 30.25,
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
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 32.25,
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 32.25,
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 32.25,
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 32.25,
                    baseline: 32.25,
                    '1unit': 32.25,
                    '3units': 32.25,
                    '1case(6units)': 32.25,
                    '4cases(24units)': 32.25,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '1unit': 30,
                    '3units': 30,
                    '1case(6units)': 30 * 6,
                    '4cases(24units)': 30 * 6,
                },
                OtherAcc: {
                    cart: 32.25,
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
                Acc01: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 29.25, Case: 29.25 * 6 },
                },
                OtherAcc: { cart: 29.25, baseline: 29.25, '5units': 29.25, '20units': 29.25, additional: 29.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 29.25,
                    baseline: 29.25,
                    '5units': 29.25,
                    '20units': 29.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
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
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '9case(54units)': 30 * 6,
                    '10cases(60units)': 30 * 6,
                    additional: { Each: 30, Case: 30 * 6 },
                },
                OtherAcc: {
                    cart: 31.25,
                    baseline: 31.25,
                    '9case(54units)': 31.25,
                    '10cases(60units)': 31.25,
                    additional: { Each: 31.25, Case: 31.25 * 6 },
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '9case(54units)': 30 * 6,
                    '10cases(60units)': 30 * 6,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 31.25,
                    baseline: 31.25,
                    '9case(54units)': 31.25,
                    '10cases(60units)': 31.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '9case(54units)': 30 * 6,
                    '10cases(60units)': 30 * 6,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 31.25,
                    baseline: 31.25,
                    '9case(54units)': 31.25,
                    '10cases(60units)': 31.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '9case(54units)': 30 * 6,
                    '10cases(60units)': 30 * 6,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 31.25,
                    baseline: 31.25,
                    '9case(54units)': 31.25,
                    '10cases(60units)': 31.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 30 * 6,
                    baseline: 30 * 6,
                    '9case(54units)': 30 * 6,
                    '10cases(60units)': 30 * 6,
                    additional: { Each: 0.0, Case: 0.0 },
                },
                OtherAcc: {
                    cart: 31.25,
                    baseline: 31.25,
                    '9case(54units)': 31.25,
                    '10cases(60units)': 31.25,
                    additional: { Each: 0.0, Case: 0.0 },
                },
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
                Acc01: { cart: 30 * 6, baseline: 30 * 6, '2case(12units)': 30 * 6, '3cases(18units)': 30 * 6 },
                OtherAcc: { cart: 33.25, baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 30 * 6, baseline: 30 * 6, '2case(12units)': 30 * 6, '3cases(18units)': 30 * 6 },
                OtherAcc: { cart: 33.25, baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 30 * 6, baseline: 30 * 6, '2case(12units)': 30 * 6, '3cases(18units)': 30 * 6 },
                OtherAcc: { cart: 33.25, baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 30 * 6, baseline: 30 * 6, '2case(12units)': 30 * 6, '3cases(18units)': 30 * 6 },
                OtherAcc: { cart: 33.25, baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 30 * 6, baseline: 30 * 6, '2case(12units)': 30 * 6, '3cases(18units)': 30 * 6 },
                OtherAcc: { cart: 33.25, baseline: 33.25, '2case(12units)': 33.25, '3cases(18units)': 33.25 },
            },
        },
        ToBr10: {
            // Additional item
            ItemPrice: 28.5,
            PriceBaseUnitPriceAfter1: {
                Acc01: { additional: { Each: 28.5, Case: 28.5 * 6 } },
                OtherAcc: { additional: { Each: null, Case: null } },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { additional: { Each: 0.0, Case: 0.0 } },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { additional: { Each: 0.0, Case: 0.0 } },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { additional: { Each: 0.0, Case: 0.0 } },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { additional: { Each: 0.0, Case: 0.0 } },
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
                    cart: 28.75,
                    '2unit': 28.75,
                    '3units': 28.75,
                    '6units': 28.75,
                    '7units': 28.75,
                    '11units': 28.75,
                    '12units': 28.75,
                },
                OtherAcc: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
                OtherAcc: {
                    cart: 28.75,
                    baseline: 28.75,
                    '1unit': 28.75,
                    '3units': 28.75,
                    '1case(6units)': 28.75,
                    '4cases(24units)': 28.75,
                },
            },
        },
        MakeUp001: {
            // Group Rules
            ItemPrice: 28.75,
            PriceBaseUnitPriceAfter1: {
                Acc01: { cart: 28.75, baseline: 28.75 },
                OtherAcc: { cart: 28.75, baseline: 28.75 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 28.75, baseline: 28.75 },
                OtherAcc: { cart: 28.75, baseline: 28.75 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 26.73, baseline: 26.73 },
                OtherAcc: { cart: 28.75, baseline: 28.75 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 28.75, baseline: 28.75 },
                OtherAcc: { cart: 28.75, baseline: 28.75 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 28.75, baseline: 28.75 },
                OtherAcc: { cart: 28.75, baseline: 28.75 },
            },
        },
        MakeUp002: {
            // Group Rules
            ItemPrice: 29.75,
            PriceBaseUnitPriceAfter1: {
                Acc01: { cart: 29.75, baseline: 29.75 },
                OtherAcc: { cart: 29.75, baseline: 29.75 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 29.75, baseline: 29.75 },
                OtherAcc: { cart: 29.75, baseline: 29.75 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 27.66, baseline: 27.66 },
                OtherAcc: { cart: 29.75, baseline: 29.75 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 29.75, baseline: 29.75 },
                OtherAcc: { cart: 29.75, baseline: 29.75 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 29.75, baseline: 29.75 },
                OtherAcc: { cart: 29.75, baseline: 29.75 },
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
                    cart: 30.75,
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
                    cart: 30.75,
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
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    cart: 22.44,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
                OtherAcc: {
                    cart: 30.75,
                    baseline: 30.75,
                    '1unit': 30.75,
                    '3units': 30.75,
                    '1case(6units)': 30.75,
                    '4cases(24units)': 30.75,
                },
            },
        },
        MakeUp006: {
            // Group Rules
            ItemPrice: 33.75,
            PriceBaseUnitPriceAfter1: {
                Acc01: { cart: 33.75, baseline: 33.75 },
                OtherAcc: { cart: 33.75, baseline: 33.75 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 33.75, baseline: 33.75 },
                OtherAcc: { cart: 33.75, baseline: 33.75 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 31.38, baseline: 31.38 },
                OtherAcc: { cart: 33.75, baseline: 33.75 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 33.75, baseline: 33.75 },
                OtherAcc: { cart: 33.75, baseline: 33.75 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 33.75, baseline: 33.75 },
                OtherAcc: { cart: 33.75, baseline: 33.75 },
            },
        },
        MakeUp018: {
            // Group Rules
            ItemPrice: 14.95,
            PriceBaseUnitPriceAfter1: {
                Acc01: { cart: 14.95, baseline: 14.95, additional: { Each: 14.95, Case: 14.95 * 6 } },
                OtherAcc: { cart: 14.95, baseline: 14.95, additional: { Each: null, Case: null } },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 14.95, baseline: 14.95, additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { cart: 14.95, baseline: 14.95 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 13.9, baseline: 13.9, additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { cart: 14.95, baseline: 14.95 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 14.95, baseline: 14.95, additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { cart: 14.95, baseline: 14.95 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 14.95, baseline: 14.95, additional: { Each: 0.0, Case: 0.0 } },
                OtherAcc: { cart: 14.95, baseline: 14.95 },
            },
        },
        MakeUp019: {
            // Group Rules
            ItemPrice: 15.95,
            PriceBaseUnitPriceAfter1: {
                Acc01: { cart: 15.95, baseline: 15.95 },
                OtherAcc: { cart: 15.95, baseline: 15.95 },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: { cart: 15.95, baseline: 15.95 },
                OtherAcc: { cart: 15.95, baseline: 15.95 },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: { cart: 14.83, baseline: 15.95 },
                OtherAcc: { cart: 15.95, baseline: 15.95 },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: { cart: 15.95, baseline: 15.95 },
                OtherAcc: { cart: 15.95, baseline: 15.95 },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: { cart: 15.95, baseline: 15.95 },
                OtherAcc: { cart: 15.95, baseline: 15.95 },
            },
        },
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
                    '19 Each': [],
                    '20 Each': [],
                    '1 Case': [],
                    '2 Case': [],
                    '4 Case': [],
                    '5 Case': [],
                    '19 Case': [],
                    '20 Case': [],
                    '1 Box': [],
                    '2 Box': [],
                    '3 Box': [],
                    '4 Box': [],
                },
                OtherAcc: {
                    baseline: [],
                    '1 Each': [],
                    '2 Each': [],
                    '4 Each': [],
                    '5 Each': [],
                    '19 Each': [],
                    '20 Each': [],
                    '1 Case': [],
                    '2 Case': [],
                    '4 Case': [],
                    '5 Case': [],
                    '19 Case': [],
                    '20 Case': [],
                    '1 Box': [],
                    '2 Box': [],
                    '3 Box': [],
                    '4 Box': [],
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
                            Name: 'Discount',
                            Base: 190,
                            Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -9.5 }],
                            New: 180.5,
                            Amount: -9.5,
                        },
                    ],
                    '20 Each': [
                        {
                            Name: 'Discount',
                            Base: 200,
                            Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -20 }],
                            New: 180,
                            Amount: -20,
                        },
                    ],
                    '1 Case': [],
                    '2 Case': [],
                    '4 Case': [
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
                            Name: 'Discount',
                            Base: 250,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -37.5, Uom: ['CS'] }],
                            New: 212.5,
                            Amount: -37.5,
                        },
                    ],
                    '19 Case': [
                        {
                            Name: 'Discount',
                            Base: 950,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -142.5, Uom: ['CS'] }],
                            New: 807.5,
                            Amount: -142.5,
                        },
                    ],
                    '20 Case': [
                        {
                            Name: 'Discount',
                            Base: 1000,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -150, Uom: ['CS'] }],
                            New: 850,
                            Amount: -150,
                        },
                    ],
                    '1 Box': [],
                    '2 Box': [],
                    '3 Box': [],
                    '4 Box': [],
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
                            Name: 'Discount',
                            Base: 190,
                            Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -5, Amount: -9.5 }],
                            New: 180.5,
                            Amount: -9.5,
                        },
                    ],
                    '20 Each': [
                        {
                            Name: 'Discount',
                            Base: 200,
                            Conditions: [{ Name: 'ZDS1_A001', Type: '%', Value: -10, Amount: -20 }],
                            New: 180,
                            Amount: -20,
                        },
                    ],
                    '1 Case': [],
                    '2 Case': [],
                    '4 Case': [
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
                            Name: 'Discount',
                            Base: 250,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -37.5, Uom: ['CS'] }],
                            New: 212.5,
                            Amount: -37.5,
                        },
                    ],
                    '19 Case': [
                        {
                            Name: 'Discount',
                            Base: 950,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -142.5, Uom: ['CS'] }],
                            New: 807.5,
                            Amount: -142.5,
                        },
                    ],
                    '20 Case': [
                        {
                            Name: 'Discount',
                            Base: 1000,
                            Conditions: [{ Name: 'ZDS1_A001', Type: 'P', Value: -7.5, Amount: -150, Uom: ['CS'] }],
                            New: 850,
                            Amount: -150,
                        },
                    ],
                    '1 Box': [],
                    '2 Box': [],
                    '3 Box': [],
                    '4 Box': [],
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
                            Name: 'Discount',
                            Base: 190,
                            Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 3, Amount: 3 }],
                            New: 190,
                            Amount: 0,
                        },
                    ],
                    '20 Each': [
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
                            Name: 'Discount',
                            Base: 100,
                            Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 2, Amount: 2 }],
                            New: 100,
                            Amount: 0,
                        },
                    ],
                    '4 Case': [
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
                            Name: 'Discount',
                            Base: 250,
                            Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 1, Amount: 1 }],
                            New: 250,
                            Amount: 0,
                        },
                    ],
                    '19 Case': [
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
                            Name: 'Discount',
                            Base: 1000,
                            Conditions: [{ Name: 'ZDS2_A002', Type: 'additionalItem', Value: 6, Amount: 6 }],
                            New: 1000,
                            Amount: 0,
                        },
                    ],
                    '1 Box': [],
                    '2 Box': [
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
                    '19 Each': [],
                    '20 Each': [],
                    '1 Case': [],
                    '2 Case': [],
                    '4 Case': [],
                    '5 Case': [],
                    '19 Case': [],
                    '20 Case': [],
                    '1 Box': [],
                    '2 Box': [],
                    '3 Box': [],
                    '4 Box': [],
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
        'Shampoo Three': {
            // Multiple Values (not in 'Faicial Cosmetics' category)
            ItemPrice: 55.25,
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
            PriceBaseUnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceGroupDiscountUnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceManualLineUnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceTaxUnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceDiscount2UnitPriceAfter1: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceBaseUnitPriceAfter2: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceDiscountUnitPriceAfter2: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceTaxUnitPriceAfter2: {
                Acc01: {
                    baseline: 50.0,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
                },
                OtherAcc: {
                    baseline: 55.25,
                    '9 EA': 55.25,
                    '10 EA': 55.25,
                    '11 EA': 55.25,
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
                    baseline: { expectedValue: 80.0, rule: `X` },
                    '1 Each': { expectedValue: 80.0, rule: `X` },
                    '2 Each': { expectedValue: 80.0, rule: `X` },
                    '3 Each': { expectedValue: 80.0, rule: `X` },
                    '5 Each': { expectedValue: 80.0, rule: `X` },
                    '9 Each': { expectedValue: 80.0, rule: `X` },
                    '10 Each': { expectedValue: 80.0, rule: `X` },
                    '11 Each': { expectedValue: 80.0, rule: `X` },
                    '1 Case': { expectedValue: 80.0, rule: `X` },
                    '2 Case': {
                        expectedValue: 76.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '5 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '9 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '10 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 440.0, rule: `X` },
                    '2 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '3 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '5 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '6 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                    '7 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                },
                OtherAcc: {
                    baseline: { expectedValue: 80.0, rule: `X` },
                    '1 Each': { expectedValue: 80.0, rule: `X` },
                    '2 Each': { expectedValue: 80.0, rule: `X` },
                    '3 Each': { expectedValue: 80.0, rule: `X` },
                    '5 Each': { expectedValue: 80.0, rule: `X` },
                    '9 Each': { expectedValue: 80.0, rule: `X` },
                    '10 Each': { expectedValue: 80.0, rule: `X` },
                    '11 Each': { expectedValue: 80.0, rule: `X` },
                    '1 Case': { expectedValue: 80.0, rule: `X` },
                    '2 Case': {
                        expectedValue: 76.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '5 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '9 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '10 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 440.0, rule: `X` },
                    '2 Box': {
                        expectedValue: 431.2,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 440.00 * 0.98)`,
                    },
                    '3 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '5 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '6 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                    '7 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceMultiAfter2: {
                Acc01: {
                    baseline: { expectedValue: 20.0, rule: `X` },
                    '1 Each': { expectedValue: 20.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '3 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '5 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                    },
                    '9 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                    },
                    '10 Each': {
                        expectedValue: 14.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7)`,
                    },
                    '11 Each': {
                        expectedValue: 14.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 20.00 * 0.7)`,
                    },
                    '1 Case': { expectedValue: 14.0, rule: `X` },
                    '2 Case': { expectedValue: 14.0, rule: `X` },
                    '4 Case': { expectedValue: 14.0, rule: `X` },
                    '5 Case': { expectedValue: 14.0, rule: `X` },
                    '9 Case': { expectedValue: 14.0, rule: `X` },
                    '10 Case': { expectedValue: 14.0, rule: `X` },
                    '11 Case': { expectedValue: 14.0, rule: `X` },
                    '1 Box': { expectedValue: 14.0, rule: `X` },
                    '2 Box': { expectedValue: 14.0, rule: `X` },
                    '3 Box': { expectedValue: 14.0, rule: `X` },
                    '5 Box': { expectedValue: 14.0, rule: `X` },
                    '6 Box': { expectedValue: 14.0, rule: `X` },
                    '7 Box': { expectedValue: 14.0, rule: `X` },
                },
                OtherAcc: {
                    baseline: { expectedValue: 20.0, rule: `X` },
                    '1 Each': { expectedValue: 20.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '3 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '5 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '9 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '10 Each': {
                        expectedValue: 15.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 20.00 * 0.75)`,
                    },
                    '11 Each': {
                        expectedValue: 15.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 20.00 * 0.75)`,
                    },
                    '1 Case': { expectedValue: 15.0, rule: `X` },
                    '2 Case': { expectedValue: 15.0, rule: `X` },
                    '4 Case': { expectedValue: 15.0, rule: `X` },
                    '5 Case': { expectedValue: 15.0, rule: `X` },
                    '9 Case': { expectedValue: 15.0, rule: `X` },
                    '10 Case': { expectedValue: 15.0, rule: `X` },
                    '11 Case': { expectedValue: 15.0, rule: `X` },
                    '1 Box': { expectedValue: 15.0, rule: `X` },
                    '2 Box': { expectedValue: 15.0, rule: `X` },
                    '3 Box': { expectedValue: 15.0, rule: `X` },
                    '5 Box': { expectedValue: 15.0, rule: `X` },
                    '6 Box': { expectedValue: 15.0, rule: `X` },
                    '7 Box': { expectedValue: 15.0, rule: `X` },
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
                    baseline: { expectedValue: 37.0, rule: `X` },
                    '1 Each': { expectedValue: 37.0, rule: `X` },
                    '2 Each': { expectedValue: 37.0, rule: `X` },
                    '3 Each': { expectedValue: 37.0, rule: `X` },
                    '5 Each': { expectedValue: 37.0, rule: `X` },
                    '9 Each': { expectedValue: 37.0, rule: `X` },
                    '10 Each': { expectedValue: 37.0, rule: `X` },
                    '11 Each': { expectedValue: 37.0, rule: `X` },
                    '1 Case': { expectedValue: 37.0 * 6, rule: `X` },
                    '2 Case': {
                        expectedValue: 210.9,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 222.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '5 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '9 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '10 Case': {
                        expectedValue: 166.5,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 166.5,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 37.0 * 24, rule: `X` },
                    '2 Box': {
                        expectedValue: 843.6,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",5,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                    },
                    '3 Box': {
                        expectedValue: 843.6,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                    },
                    '5 Box': {
                        expectedValue: 843.6,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                    },
                    '6 Box': {
                        expectedValue: 754.8,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                    },
                    '7 Box': {
                        expectedValue: 754.8,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                    },
                },
                OtherAcc: {
                    baseline: { expectedValue: 37.0, rule: `X` },
                    '1 Each': { expectedValue: 37.0, rule: `X` },
                    '2 Each': { expectedValue: 37.0, rule: `X` },
                    '3 Each': { expectedValue: 37.0, rule: `X` },
                    '5 Each': { expectedValue: 37.0, rule: `X` },
                    '9 Each': { expectedValue: 37.0, rule: `X` },
                    '10 Each': { expectedValue: 37.0, rule: `X` },
                    '11 Each': { expectedValue: 37.0, rule: `X` },
                    '1 Case': { expectedValue: 37.0 * 6, rule: `X` },
                    '2 Case': {
                        expectedValue: 210.9,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 222.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '5 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '9 Case': {
                        expectedValue: 188.7,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (15% -> 222.00 * 0.85)`,
                    },
                    '10 Case': {
                        expectedValue: 166.5,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 166.5,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 222.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 37.0 * 24, rule: `X` },
                    '2 Box': {
                        expectedValue: 870.24,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 888.00 * 0.98)`,
                    },
                    '3 Box': {
                        expectedValue: 843.6,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                    },
                    '5 Box': {
                        expectedValue: 843.6,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (5% -> 888.00 * 0.95)`,
                    },
                    '6 Box': {
                        expectedValue: 754.8,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                    },
                    '7 Box': {
                        expectedValue: 754.8,
                        rule: `'ZDM2@A007@Contract1@Facial Cosmetics' -> [[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 888.00 * 0.85)`,
                    },
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceMultiAfter2: {
                Acc01: {
                    baseline: { expectedValue: 37.0, rule: `X` },
                    '1 Each': { expectedValue: 37.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                    },
                    '3 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                    },
                    '5 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 37.00 * 0.8)`,
                    },
                    '9 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (20% -> 37.00 * 0.8)`,
                    },
                    '10 Each': {
                        expectedValue: 14.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7)`,
                    },
                    '11 Each': {
                        expectedValue: 14.0,
                        rule: `'ZDM2@A007@Contract3@Facial Cosmetics' -> [[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"] (30% -> 37.00 * 0.7)`,
                    },
                    '1 Case': { expectedValue: 14.0, rule: `X` },
                    '2 Case': { expectedValue: 14.0, rule: `X` },
                    '4 Case': { expectedValue: 14.0, rule: `X` },
                    '5 Case': { expectedValue: 14.0, rule: `X` },
                    '9 Case': { expectedValue: 14.0, rule: `X` },
                    '10 Case': { expectedValue: 14.0, rule: `X` },
                    '11 Case': { expectedValue: 14.0, rule: `X` },
                    '1 Box': { expectedValue: 14.0, rule: `X` },
                    '2 Box': { expectedValue: 14.0, rule: `X` },
                    '3 Box': { expectedValue: 14.0, rule: `X` },
                    '5 Box': { expectedValue: 14.0, rule: `X` },
                    '6 Box': { expectedValue: 14.0, rule: `X` },
                    '7 Box': { expectedValue: 14.0, rule: `X` },
                },
                OtherAcc: {
                    baseline: { expectedValue: 37.0, rule: `X` },
                    '1 Each': { expectedValue: 37.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 37.00 * 0.95)`,
                    },
                    '3 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 37.00 * 0.95)`,
                    },
                    '5 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                    },
                    '9 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (10% -> 37.00 * 0.9)`,
                    },
                    '10 Each': {
                        expectedValue: 15.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 37.00 * 0.75)`,
                    },
                    '11 Each': {
                        expectedValue: 15.0,
                        rule: `'ZDM2@A007@Contract2@Facial Cosmetics' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"] (25% -> 37.00 * 0.75)`,
                    },
                    '1 Case': { expectedValue: 15.0, rule: `X` },
                    '2 Case': { expectedValue: 15.0, rule: `X` },
                    '4 Case': { expectedValue: 15.0, rule: `X` },
                    '5 Case': { expectedValue: 15.0, rule: `X` },
                    '9 Case': { expectedValue: 15.0, rule: `X` },
                    '10 Case': { expectedValue: 15.0, rule: `X` },
                    '11 Case': { expectedValue: 15.0, rule: `X` },
                    '1 Box': { expectedValue: 15.0, rule: `X` },
                    '2 Box': { expectedValue: 15.0, rule: `X` },
                    '3 Box': { expectedValue: 15.0, rule: `X` },
                    '5 Box': { expectedValue: 15.0, rule: `X` },
                    '6 Box': { expectedValue: 15.0, rule: `X` },
                    '7 Box': { expectedValue: 15.0, rule: `X` },
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
                    baseline: { expectedValue: 80.0, rule: `X` },
                    '1 Each': { expectedValue: 80.0, rule: `X` },
                    '2 Each': { expectedValue: 80.0, rule: `X` },
                    '3 Each': { expectedValue: 80.0, rule: `X` },
                    '5 Each': { expectedValue: 80.0, rule: `X` },
                    '9 Each': { expectedValue: 80.0, rule: `X` },
                    '10 Each': { expectedValue: 80.0, rule: `X` },
                    '11 Each': { expectedValue: 80.0, rule: `X` },
                    '1 Case': { expectedValue: 80.0, rule: `X` },
                    '2 Case': {
                        expectedValue: 76.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '5 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '9 Case': {
                        expectedValue: 68.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[4,"D",15,"%"]],"CS","CS"] (15% -> 80.00 * 0.85)`,
                    },
                    '10 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 440.0, rule: `X` },
                    '2 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",2,"%"]],"BOX","BOX"]] (2% -> 440.00 * 0.98)`,
                    },
                    '3 Box': {
                        expectedValue: 330.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.75)`,
                    },
                    '5 Box': {
                        expectedValue: 330.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.75)`,
                    },
                    '6 Box': {
                        expectedValue: 330.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.75)`,
                    },
                    '7 Box': {
                        expectedValue: 330.0,
                        rule: `'ZDM1@A010@Acc01@Contract3@MaLi38' -> [[3,"D",25,"%"]],"BOX","BOX"]] (25% -> 440.00 * 0.75)`,
                    },
                },
                OtherAcc: {
                    baseline: { expectedValue: 80.0, rule: `X` },
                    '1 Each': { expectedValue: 80.0, rule: `X` },
                    '2 Each': { expectedValue: 80.0, rule: `X` },
                    '3 Each': { expectedValue: 80.0, rule: `X` },
                    '5 Each': { expectedValue: 80.0, rule: `X` },
                    '9 Each': { expectedValue: 80.0, rule: `X` },
                    '10 Each': { expectedValue: 80.0, rule: `X` },
                    '11 Each': { expectedValue: 80.0, rule: `X` },
                    '1 Case': { expectedValue: 80.0, rule: `X` },
                    '2 Case': {
                        expectedValue: 76.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                    },
                    '4 Case': {
                        expectedValue: 76.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (5% -> 80.00 * 0.95)`,
                    },
                    '5 Case': {
                        expectedValue: 72.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9)`,
                    },
                    '9 Case': {
                        expectedValue: 72.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (10% -> 80.00 * 0.9)`,
                    },
                    '10 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '11 Case': {
                        expectedValue: 60.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"] (25% -> 80.00 * 0.75)`,
                    },
                    '1 Box': { expectedValue: 440.0, rule: `X` },
                    '2 Box': { expectedValue: 440.0, rule: `X` },
                    '3 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '5 Box': {
                        expectedValue: 418.0,
                        rule: `'ZDM1@A008@Contract1@MaLi38' -> [[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]] (5% -> 440.00 * 0.95)`,
                    },
                    '6 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                    '7 Box': {
                        expectedValue: 374.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[6,"D",15,"%"]],"BOX","BOX"]] (15% -> 440.00 * 0.85)`,
                    },
                },
                cart: {
                    Acc01: 1,
                    OtherAcc: 1,
                },
            },
            PriceMultiAfter2: {
                Acc01: {
                    baseline: { expectedValue: 20.0, rule: `X` },
                    '1 Each': { expectedValue: 20.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '3 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '5 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                    },
                    '9 Each': {
                        expectedValue: 16.0,
                        rule: `'ZDM1@A010@Acc01@Contract1@MaLi38' -> [[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"] (20% -> 20.00 * 0.8)`,
                    },
                    '10 Each': {
                        expectedValue: 10.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                    },
                    '11 Each': {
                        expectedValue: 10.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                    },
                    '1 Case': { expectedValue: 10.0, rule: `X` },
                    '2 Case': { expectedValue: 10.0, rule: `X` },
                    '4 Case': { expectedValue: 10.0, rule: `X` },
                    '5 Case': { expectedValue: 10.0, rule: `X` },
                    '9 Case': { expectedValue: 10.0, rule: `X` },
                    '10 Case': { expectedValue: 10.0, rule: `X` },
                    '11 Case': { expectedValue: 10.0, rule: `X` },
                    '1 Box': { expectedValue: 10.0, rule: `X` },
                    '2 Box': { expectedValue: 10.0, rule: `X` },
                    '3 Box': { expectedValue: 10.0, rule: `X` },
                    '5 Box': { expectedValue: 10.0, rule: `X` },
                    '6 Box': { expectedValue: 10.0, rule: `X` },
                    '7 Box': { expectedValue: 10.0, rule: `X` },
                },
                OtherAcc: {
                    baseline: { expectedValue: 20.0, rule: `X` },
                    '1 Each': { expectedValue: 20.0, rule: `X` },
                    '2 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '3 Each': {
                        expectedValue: 19.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (5% -> 20.00 * 0.95)`,
                    },
                    '5 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '9 Each': {
                        expectedValue: 18.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (10% -> 20.00 * 0.9)`,
                    },
                    '10 Each': {
                        expectedValue: 10.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                    },
                    '11 Each': {
                        expectedValue: 10.0,
                        rule: `'ZDM1@A008@Contract2@MaLi38' -> [[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"] (50% -> 20.00 * 0.5)`,
                    },
                    '1 Case': { expectedValue: 10.0, rule: `X` },
                    '2 Case': { expectedValue: 10.0, rule: `X` },
                    '4 Case': { expectedValue: 10.0, rule: `X` },
                    '5 Case': { expectedValue: 10.0, rule: `X` },
                    '9 Case': { expectedValue: 10.0, rule: `X` },
                    '10 Case': { expectedValue: 10.0, rule: `X` },
                    '11 Case': { expectedValue: 10.0, rule: `X` },
                    '1 Box': { expectedValue: 10.0, rule: `X` },
                    '2 Box': { expectedValue: 10.0, rule: `X` },
                    '3 Box': { expectedValue: 10.0, rule: `X` },
                    '5 Box': { expectedValue: 10.0, rule: `X` },
                    '6 Box': { expectedValue: 10.0, rule: `X` },
                    '7 Box': { expectedValue: 10.0, rule: `X` },
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
        MaNa142: {
            // totals
            ItemPrice: 37.75,
            baseline: {
                uom1: 'Case',
                qty1: 0,
                uom2: 'Each',
                qty2: 0,
                unitQuantity: 0,
                PriceTaxTotal: 40.0 * 0 + 8.0 * 0, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - 40.0 / 40.0) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
                unitQuantity: 7,
                PriceTaxTotal: 40.0 * 1 + 8.0 * 1, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 1 + 8.0 * 1 - (40.0 * 1 + 8.0 * 1), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 1)) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
                unitQuantity: 3 * 6 + 4 * 24,
                PriceTaxTotal: 40.0 * 3 + 160.0 * 4, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 3 + 160.0 * 4 - (40.0 * 3 + 160.0 * 4), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - (40.0 * 3 + 160.0 * 4) / (40.0 * 3 + 160.0 * 4)) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
        },
        MaNa23: {
            // totals
            ItemPrice: 40.25,
            baseline: {
                uom1: 'Case',
                qty1: 0,
                uom2: 'Each',
                qty2: 0,
                unitQuantity: 0,
                PriceTaxTotal: 40.0 * 0 + 8.0 * 0, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 0 + 8.0 * 0 - (40.0 * 0 + 8.0 * 0), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - 40.0 / 40.0) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
                unitQuantity: 7,
                PriceTaxTotal: 40.0 * 1 + 8.0 * 1, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 1 + 8.0 * 1 - (40.0 * 1 + 8.0 * 1), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - (40.0 * 1 + 8.0 * 1) / (40.0 * 1 + 8.0 * 1)) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
                qty1: 2,
                uom2: 'Each',
                qty2: 3,
                unitQuantity: 7,
                PriceTaxTotal: 40.0 * 2 + 8.0 * 3, // PriceTaxUnitPriceAfter1 * qty1 + PriceTaxUnitPriceAfter2 * qty2
                PriceTaxTotalDiff: 40.0 * 2 + 8.0 * 3 - (40.0 * 2 + 8.0 * 3), // BaseTotal - TaxTotal || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxTotalPercent: (1 - (40.0 * 2 + 8.0 * 3) / (40.0 * 2 + 8.0 * 3)) * 100, // (1 - BaseTotal / TaxTotal) * 100 || (1 - operand2 / operand1) * 100 || operand1 -> Block=Tax , operand2 -> Block=Base
                PriceTaxUnitDiff: 40.0 - 40.0, // PriceTaxUnitPriceAfter1 - PriceBaseUnitPriceAfter1 || operand2 - operand1 || operand1 -> Block=Tax , operand2 -> Block=Base || by units , UomIndex = 1
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
        },
    };
}
