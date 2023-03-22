import { Client } from "@pepperi-addons/debug-server/dist";
import { AddonDataScheme, SchemeField } from "@pepperi-addons/papi-sdk";
import GeneralService from "./general.service";

interface Resource {
    scheme: AddonDataScheme;
    count: number;
}

//await data.send(division);
export class DataCreation {
    constructor(private client: Client) {
    }
    userSavedData: string[] = [];
    accountsSavedData: string[] = [];
    companySavedData: string[] = [];
    divisonSavedData: string[] = [];
    listSavedData: string[] = [];
    itemsSavedData: string[] = [];
    generalService = new GeneralService(this.client);

    resourceList: Resource[] = [
        { scheme: { Name: "users", Fields: { "ExternalID": { Type: "String" }, "Email": { Type: "String" } } }, count: 5 },
        { scheme: { Name: "accounts", Fields: { "ExternalID": { Type: "String" } } }, count: 30000 },
        { scheme: { Name: "items", Fields: { "MainCategoryID": { Type: "String" }, "ExternalID": { Type: "String" } } }, count: 3000 },
        { scheme: { Name: "Divisions", Fields: { "code": { Type: "String" } } }, count: 2 },
        { scheme: { Name: "Companies", Fields: { "code": { Type: "String" } } }, count: 2 },
        { scheme: { Name: "UserInfo", Fields: { "userRef": { Type: "Resource" }, "divisionRef": { Type: "Resource" }, "companyRef": { Type: "Resource" } } }, count: 5 },
        { scheme: { Name: "AccountData1", Fields: { "AccountRef": { Type: "Resource" }, "Value1": { Type: "String" } } }, count: 30000 },
        { scheme: { Name: "DivisionData1", Fields: { "DivisionRef": { Type: "Resource" }, "Value1": { Type: "String" } } }, count: 2 },
        { scheme: { Name: "Data2XRef", Fields: { "DivisionRef": { Type: "Resource" }, "CompanyRef": { Type: "String" }, "Value1": { Type: "String" }, "Value2": { Type: "String" } } }, count: 4 },
        { scheme: { Name: "DataX3Ref", Fields: { "AccountRef": { Type: "Resource" }, "DivisionRef": { Type: "String" }, "CompanyRef": { Type: "String" }, "Value1": { Type: "String" }, "Value2": { Type: "String" } } }, count: 120000 },
        { scheme: { Name: "Lists", Fields: { "Code": { Type: "String" } } }, count: 6000 },
        { scheme: { Name: "ListItems", Fields: { "ListRef": { Type: "Resource" }, "ItemRef": { Type: "Resource" }, } }, count: 100000 },
        { scheme: { Name: "AccountLists", Fields: { "DivisionRef": { Type: "Resource" }, "CompanyRef": { Type: "Resource" }, "AccountRef": { Type: "Resource" }, "ListRef": { Type: "Resource" } } }, count: 120000 },
    ];

    createData() {
        this.resourceList.forEach(async resource => {
            const resourceCreator = new ResourceCreation(resource, this);
            await resourceCreator.execute();
            debugger;
        });
    }
}
class ResourceCreation {

    constructor(private resource: Resource, private mgr: DataCreation) {
    }
    async execute(): Promise<void> { //promise should be string 
        // get fields and create csv header
        const fields = this.getFields();
        const schemeFieldsAsCsvHeader = fields.join(",");
        if (this.resource.scheme.Name === "ListItems") {
            debugger;
        }
        // loop generate lines 
        let csvLines;
        try {
            csvLines = this.generateData(fields, this.resource.scheme.Name, this.resource.scheme.Fields!);
        } catch (error) {
            debugger;
        }
        let csvData = `${schemeFieldsAsCsvHeader}\n${csvLines}`;
        console.log(`${this.resource.scheme.Name}-->${csvData}`)
        // await this.genrateTempFile(this.resource.scheme.Name + "Temp", csvData);

    }

    private async genrateTempFile(tempFileName, data) {//TODO
        await this.mgr.generalService.fetchStatus('/addons/pfs/temporary_file', {
            method: "POST",

        });
    }

    private getFields() {
        const data: string[] = [];
        for (const [key, _] of Object.entries(this.resource.scheme.Fields!)) {
            data.push(key);
        }
        return data;
    }


    private generateData(fields, resourceName, schemeFields: { [key: string]: SchemeField }) {
        let csvLines: string[] = [];
        for (let index = 0; index < this.resource.count; index++) {
            for (let index1 = 0; index1 < fields.length; index1++) {
                const isRef = Object.entries(schemeFields)[index1][1].Type === "Resource";
                csvLines.push(this.generateLine(resourceName, index, isRef, index1) + `,`);
            }
            // if (csvLines.length - 2 >= 0)
            //     csvLines[csvLines.length - 2] += ",";
            if (csvLines.length - 1 >= 0)
                csvLines[csvLines.length - 1] += "\n";
        }
        this.handleSavingData(this.resource.scheme.Name, csvLines);
        return csvLines.join("");
    }

    private generateLine(name, index, isRef, index1) {
        if (isRef) {
            const whichRef = Object.entries(this.resource.scheme.Fields!)[index1][0].replace("Ref", "");
            const savedData = this.handleLoadingData(whichRef);
            if (index >= savedData!.length) {
                let indexN = 0;
                let dataToReturn = savedData![indexN];
                dataToReturn = dataToReturn.replace(",", "");
                dataToReturn = dataToReturn.replace("\n", "");
                return dataToReturn;
            } else {
                let dataToReturn = savedData![index];
                dataToReturn = dataToReturn.replace(",", "");
                dataToReturn = dataToReturn.replace("\n", "");
                return dataToReturn;
            }
        } else {
            return `${name}_${index}`;
        }
    }

    private handleSavingData(name: string, csvLines: string[]) {
        switch (name) {
            case "users":
                this.mgr.userSavedData = csvLines;
                break;
            case "accounts":
                this.mgr.accountsSavedData = csvLines;
                break;
            case "Companies":
                this.mgr.companySavedData = csvLines;
                break;
            case "Divisions":
                this.mgr.divisonSavedData = csvLines;
                break;
            case "Lists":
                this.mgr.listSavedData = csvLines;
                break;
            case "items":
                this.mgr.itemsSavedData = csvLines;
                break;
        }
    }

    private handleLoadingData(name: string) {
        switch (name.toLocaleLowerCase()) {
            case "user":
                return this.mgr.userSavedData;
            case "account":
                return this.mgr.accountsSavedData;
            case "company":
                return this.mgr.companySavedData;
            case "division":
                return this.mgr.divisonSavedData;
            case "list":
                return this.mgr.listSavedData;
            case "item":
                return this.mgr.itemsSavedData;
        }
    }


}



    // aa: AddonDataScheme;
    // users: number;
    // accounts: number;
    // items: number;
    // divisions: number;
    // companies: number;
    // userInfo: number;
    // accData1: number;
    // dviData1: number;
    // data1: number;
    // data2: number;
    // lists: number;
    // listItems: number;
    // accLists: number;

    // userDataCSV: string;
    // accDataCSV: string;
    // itemDataCSV: string;

// usersExIdPrefix = "user_";
    // usersEmailFormat = "users_x@pep.com";
    // accsExIdPrefix = "account_";
    // itemExIdPrefix = "item_";
    // itemMainCatPrefix = "mainCat_1";

    // constructor(users: number, accounts: number, items: number, divisions: number, companies: number, lists: number, listItems: number) {
    //     this.users = users;
    //     this.accounts = accounts;
    //     this.items = items;
    //     this.divisions = divisions;
    //     this.companies = companies;
    //     this.userInfo = this.users;
    //     this.accData1 = this.accounts;
    //     this.dviData1 = this.divisions;
    //     this.data1 = this.divisions * this.companies;
    //     this.data2 = this.accounts * this.divisions * this.companies;
    //     this.lists = lists;
    //     this.listItems = listItems;
    //     this.accLists = this.accounts * this.divisions * this.companies;
    //     this.userDataCSV = this.createUsersData();
    //     this.accDataCSV = this.createAccountsData();
    //     this.itemDataCSV = this.createItemsData();
    // }

    // createUsersData() {
    //     let userDataToReturn = "ExternalID,Email\n";
    //     for (let index = 0; index < this.users; index++) {
    //         userDataToReturn += this.usersExIdPrefix + (index + 1) + ",";
    //         userDataToReturn += this.usersEmailFormat.replace('x', (index + 1).toString());
    //         userDataToReturn += "\n";
    //     }
    //     return userDataToReturn;
    // }

    // createAccountsData() {
    //     let accDataToReturn = "ExternalID\n";
    //     for (let index = 0; index < this.accounts; index++) {
    //         accDataToReturn += this.accsExIdPrefix + (index + 1) + ",";
    //         accDataToReturn += "\n";
    //     }
    //     return accDataToReturn;
    // }

    // createItemsData() {
    //     let itemDataToReturn = "MainCategoryID,ExternalID\n";
    //     for (let index = 0; index < this.items; index++) {
    //         itemDataToReturn += this.itemMainCatPrefix + ",";
    //         itemDataToReturn += this.itemExIdPrefix + (index + 1) + ",";
    //         itemDataToReturn += "\n";
    //     }
    //     return itemDataToReturn;
    // }

// }


