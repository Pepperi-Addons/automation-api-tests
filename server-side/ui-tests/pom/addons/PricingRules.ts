export default class PricingRules {
    public tableName = 'PPM_Values';
    public dummyPPM_Values_length = 49999;

    public version05 = {
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
        'ZBASE@A005@dummyItem': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A005",[[0,"S",100,"P"]]]]',
    };

    public version06 = {
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
        'ZDM3@A006@Contract1':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A006 Contract1_EA_CS_BOX",[[10,"D",5,"%"]],"EA"]]',
        'ZDM3@A006@Contract2':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A006 Contract2_EA_CS_BOX",[[10,"D",15,"%"]],"EA"]]',
        'ZDM2@A007@Contract1@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract1",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract1",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract1",[[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]]',
        'ZDM2@A007@Contract2@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract2",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract2",[[5,"D",10,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract2",[[2,"D",2,"%"]],"BOX","BOX"]]',
        'ZDM2@A007@Contract3@Facial Cosmetics':
            '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract3",[[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",30,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract3",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract3",[[2,"D",5,"%"]],"BOX","BOX"]]',
        'ZDM1@A008@Contract1@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_EA_Contract1",[[5,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_CS_Contract1",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_BOX_Contract1",[[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]]',
        'ZDM1@A008@Contract2@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_EA_Contract2",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_CS_Contract2",[[5,"D",5,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_BOX_Contract2",[[6,"D",15,"%"]],"BOX","BOX"]]',
        'ZDM3@A009@Acc01@Contract1':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract1_EA_CS_BOX",[[10,"D",10,"%"]],"EA"]]',
        'ZDM3@A009@Acc01@Contract2':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract2_EA_CS_BOX",[[10,"D",20,"%"]],"EA"]]',
        'ZDM3@A009@Acc01@Contract3':
            '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract3_EA_CS_BOX",[[10,"D",30,"%"]],"EA"]]',
        'ZDM1@A010@Acc01@Contract1@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_EA_Contract1",[[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_CS_Contract1",[[4,"D",4,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_BOX_Contract1",[[2,"D",2,"%"]],"BOX","BOX"]]',
        'ZDM1@A010@Acc01@Contract3@MaLi38':
            '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_EA_Contract3",[[10,"D",5,"%"]],"EA","EA"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_CS_Contract3",[[4,"D",15,"%"]],"CS","CS"],[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_BOX_Contract3",[[3,"D",25,"%"]],"BOX","BOX"]]',
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

    public version07 = {
        'ZBASE@A002@Acc01@Frag005': '[[true,"1555891200000","2534022144999","1","1","ZBASE_A002",[[0,"S",10,"P"]]]]',
    };
}
