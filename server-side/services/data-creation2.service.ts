import { Client } from '@pepperi-addons/debug-server/dist';
import { AddonDataScheme } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import * as fs from 'fs';

export interface Resource {
    scheme: AddonDataScheme;
    count: number;
    urlToResource?: string;
}

export class DataCreation2 {
    constructor(private client: Client) { }
    generalService = new GeneralService(this.client);

    // resourceList: Resource[] = [
    //     {
    //         scheme: { Name: 'users', Fields: { ExternalID: { Type: 'String' }, Email: { Type: 'String' } } },
    //         count: 5,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: { Name: 'accounts', Fields: { ExternalID: { Type: 'String' }, Name: { Type: 'String' } } },
    //         count: 30000,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: { Name: 'items', Fields: { MainCategoryID: { Type: 'String' }, ExternalID: { Type: 'String' } } },
    //         count: 3000,
    //         urlToResource: '',
    //     },
    //     { scheme: { Name: 'Divisions', Fields: { code: { Type: 'String' } } }, count: 2, urlToResource: '' },
    //     { scheme: { Name: 'Companies', Fields: { code: { Type: 'String' } } }, count: 2, urlToResource: '' },
    //     {
    //         scheme: {
    //             Name: 'UserInfo',
    //             Fields: {
    //                 usersRef: { Type: 'Resource' },
    //                 divisionsRef: { Type: 'Resource' },
    //                 companiesRef: { Type: 'Resource' },
    //             },
    //         },
    //         count: 5,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: { Name: 'AccountData1', Fields: { accountsRef: { Type: 'Resource' }, value1: { Type: 'String' } } },
    //         count: 30000,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: {
    //             Name: 'DivisionData1',
    //             Fields: { divisionsRef: { Type: 'Resource' }, value1: { Type: 'String' } },
    //         },
    //         count: 2,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: {
    //             Name: 'Data2XRef',
    //             Fields: {
    //                 divisionsRef: { Type: 'Resource' },
    //                 companiesRef: { Type: 'Resource' },
    //                 value1: { Type: 'String' },
    //                 value2: { Type: 'String' },
    //             },
    //         },
    //         count: 4,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: {
    //             Name: 'DataX3Ref',
    //             Fields: {
    //                 accountsRef: { Type: 'Resource' },
    //                 divisionsRef: { Type: 'Resource' },
    //                 companiesRef: { Type: 'Resource' },
    //                 value1: { Type: 'String' },
    //                 value2: { Type: 'String' },
    //             },
    //         },
    //         count: 120000,
    //         urlToResource: '',
    //     },
    //     { scheme: { Name: 'Lists', Fields: { Code: { Type: 'String' } } }, count: 6000 },
    //     {
    //         scheme: { Name: 'ListItems', Fields: { listsRef: { Type: 'Resource' }, itemsRef: { Type: 'Resource' } } },
    //         count: 100000,
    //         urlToResource: '',
    //     },
    //     {
    //         scheme: {
    //             Name: 'AccountLists',
    //             Fields: {
    //                 divisionsRef: { Type: 'Resource' },
    //                 companiesRef: { Type: 'Resource' },
    //                 accountsRef: { Type: 'Resource' },
    //                 listsRef: { Type: 'Resource' },
    //             },
    //         },
    //         count: 120000,
    //         urlToResource: '',
    //     },
    // ];

    async createData() {
        const resourceCreator = new ResourceCreation();
        await resourceCreator.execute();
    }
}
class ResourceCreation {
    users = 5;
    accounts = 30000;
    items = 3000;
    divisions = 2;
    companies = 2;
    userInfo = 5;
    lists = 6000;
    constructor() { }
    async execute(): Promise<void> {
        // this.createUsers(this.users);
        // this.createAccounts(this.accounts);
        // this.createItems(this.items);
        // this.createDivisons(this.divisions);
        // this.createCompanies(this.companies);
        // this.createUserInfo(this.userInfo);
        // this.createAccountData1(this.accounts);
        // this.createDivisionData1(this.divisions);
        // this.createData2XRef1(this.divisions * this.companies);
        // this.createDataX3Ref1(this.accounts * this.divisions * this.companies);
        // this.createLists(this.lists);
        // this.createListItems(this.lists * this.items);
        // this.createAccountLists(this.divisions * this.companies * this.accounts * 15);
        this.createListsValue(this.lists, "first");
    }

    // private async genrateTempFile(tempFileName, data) {
    //     let generateRespnse;
    //     //generate temp files
    //     try {
    //         generateRespnse = await this.mgr.generalService.fetchStatus(
    //             '/addons/api/00000000-0000-0000-0000-0000000f11e5/api/temporary_file',
    //             {
    //                 method: 'POST',
    //                 body: JSON.stringify({}),
    //             },
    //         );
    //     } catch (error) {
    //         throw new Error(
    //             `Error: generating the temp file calling: /api/temporary_file -> ${(error as any).message}`,
    //         );
    //     }
    //     //convert string data to buffer
    //     const buffer = Buffer.from(data, 'utf-8');
    //     const uploadToTempResponse = await this.uploadFileToTempUrl(buffer, generateRespnse.Body.PutURL);
    //     if (uploadToTempResponse.status !== 200) {
    //         // throw new Error(
    //         //     `Error: generating the temp file calling: /api/temporary_file -> ${(error as any).message}`,
    //         // );
    //     }
    //     //save the URL to get file on mgr
    //     const res = this.mgr.resourceList.find(
    //         (resource) => resource.scheme.Name.toLocaleLowerCase() === tempFileName.toLocaleLowerCase(),
    //     );
    //     (res as any).urlToResource = generateRespnse.Body.TemporaryFileURL;
    // }

    private async genrateFile(tempFileName, data) {
        try {
            fs.writeFileSync(`./nelt_csv_data/${tempFileName}.csv`, data, 'utf-8');
        } catch (error) {
            throw new Error(`Error: ${(error as any).message}`);
        }
    }

    private createUsers(howManyDataRows: number) {
        const headers = "ExternalID,Email";
        const runningDataExID = "users_index";
        const runningDataEmail = "usersindex@pep.com";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataExID.replace('index', index.toString())},`;
            strData += `${runningDataEmail.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Users", strData);
    }

    private createAccounts(howManyDataRows: number) {
        const headers = "ExternalID,Name";
        const runningDataExID = "accounts_index";
        const runningDataName = "accounts_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataExID.replace('index', index.toString())},`;
            strData += `${runningDataName.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Accounts", strData);
    }

    private createItems(howManyDataRows: number) {
        const headers = "MainCategoryID,ExternalID";
        const runningDataMainCat = "items_0";
        const runningDataExID = "items_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataMainCat},`;
            strData += `${runningDataExID.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Items", strData);
    }

    private createDivisons(howManyDataRows: number) {
        const headers = "code";
        const runningDataCode = "division_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataCode.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Divisons", strData);
    }

    private createCompanies(howManyDataRows: number) {
        const headers = "code";
        const runningDataCode = "company_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataCode.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Companies", strData);
    }

    private createUserInfo(howManyDataRows: number) {
        const headers = "userRef#ExternalID,divisionRef,companyRef";
        const runningDataUsers = "users_index";
        const runningDataDivision = "division_index";
        const runningDataCompany = "company_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataUsers.replace('index', index.toString())},`;
            if (index >= this.divisions) {
                strData += `${runningDataDivision.replace('index', (index % this.divisions).toString())},`;
            } else {
                strData += `${runningDataDivision.replace('index', index.toString())},`;
            }
            if (index >= this.companies) {
                strData += `${runningDataCompany.replace('index', (index % this.companies).toString())}\n`;
            } else {
                strData += `${runningDataCompany.replace('index', index.toString())}\n`;
            }
        }
        this.genrateFile("UserInfo", strData);
    }

    private createAccountData1(howManyDataRows: number) {
        const headers = "accountRef#ExternalID,value1";
        const runningDataAccount = "accounts_index";
        const runningDataBasicValue = "value_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            if (index >= this.accounts) {
                strData += `${runningDataAccount.replace('index', (index % this.accounts).toString())},`;
            } else {
                strData += `${runningDataAccount.replace('index', index.toString())},`;
            }
            strData += `${runningDataBasicValue.replace('index', index.toString())}\n`;
        }
        this.genrateFile("AccountData1", strData);
    }

    private createDivisionData1(howManyDataRows: number) {
        const headers = "divisionRef,value1";
        const runningDataDivision = "division_index";
        const runningDataBasicValue = "value_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            if (index >= this.divisions) {
                strData += `${runningDataDivision.replace('index', (index % this.divisions).toString())},`;
            } else {
                strData += `${runningDataDivision.replace('index', index.toString())},`;
            }
            strData += `${runningDataBasicValue.replace('index', index.toString())}\n`;
        }
        this.genrateFile("DivisionData1", strData);
    }

    private createData2XRef1(howManyDataRows: number) {
        console.log(howManyDataRows);
        const headers = "divisionRef,companyRef,value1,value2";
        const runningDataDivision = "division_index";
        const runningDataCompany = "company_index";
        const runningDataBasicValue1 = "value1_index";
        const runningDataBasicValue2 = "value2_index";
        let strData = "";
        strData += headers + "\n";
        let runningCounter = 0;
        for (let index = 0; index < this.divisions; index++) {
            const div = runningDataDivision.replace('index', index.toString());
            for (let index = 0; index < this.companies; index++) {
                const comp = runningDataCompany.replace('index', index.toString());
                const value1 = runningDataBasicValue1.replace('index', runningCounter.toString());
                const value2 = runningDataBasicValue2.replace('index', runningCounter.toString());
                runningCounter++;
                strData += `${div},${comp},${value1},${value2}\n`;
            }
        }
        this.genrateFile("Data2XRef1", strData);
    }

    private createDataX3Ref1(howManyDataRows: number) {
        console.log(howManyDataRows);
        const headers = "accountRef#ExternalID,divisionRef,companyRef,value1,value2";
        const runningDataAccount = "accounts_index";
        const runningDataDivision = "division_index";
        const runningDataCompany = "company_index";
        const runningDataBasicValue1 = "value1_index";
        const runningDataBasicValue2 = "value2_index";
        let strData = "";
        strData += headers + "\n";
        let runningCounter = 0;
        let howMuchEnteries = 0;
        let flag = false;
        for (let index1 = 0; index1 < this.accounts; index1++) {
            const acc = runningDataAccount.replace('index', index1.toString());
            for (let index2 = 0; index2 < this.divisions; index2++) {
                const div = runningDataDivision.replace('index', index2.toString());
                for (let index3 = 0; index3 < this.companies; index3++) {
                    const comp = runningDataCompany.replace('index', index3.toString());
                    const value1 = runningDataBasicValue1.replace('index', runningCounter.toString());
                    const value2 = runningDataBasicValue2.replace('index', runningCounter.toString());
                    runningCounter++;
                    strData += `${acc},${div},${comp},${value1},${value2}\n`;
                    howMuchEnteries++;
                    if (howMuchEnteries >= howManyDataRows / 2 && !flag) {
                        this.genrateFile("DataX3Ref1_1", strData);
                        strData = "";
                        strData += headers + "\n";
                        flag = true;
                    }
                }
            }
        }
        this.genrateFile("DataX3Ref1_2", strData);
    }

    private createLists(howManyDataRows: number) {
        console.log(howManyDataRows);
        const headers = "code";
        const runningDataCode = "list_index";
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataCode.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Lists", strData);
    }

    private createListsValue(howManyDataRows: number, value: string) {
        console.log(howManyDataRows);
        const headers = "code,value1";
        const runningDataCode = "list_index";
        const runningDataBasicValue1 = `${value}_index`;
        let strData = "";
        strData += headers + "\n";
        for (let index = 0; index < howManyDataRows; index++) {
            strData += `${runningDataCode.replace('index', index.toString())},`;
            strData += `${runningDataBasicValue1.replace('index', index.toString())}\n`;
        }
        this.genrateFile("Lists_Val", strData);
    }

    private createListItems(howManyDataRows: number) {
        console.log(howManyDataRows);
        const headers = "listRef,ItemRef";
        const runningDatalist = "list_index";
        const runningDataItems = "items_index#ExternalID";
        let latestItemIndex = 0;
        let strData = "";
        strData += headers + "\n";
        for (let index1 = 0; index1 < this.lists; index1++) {
            const list = runningDatalist.replace("index", index1.toString());
            for (let index2 = 0; index2 < 15; index2++) {
                const item = runningDataItems.replace("index", latestItemIndex.toString());
                latestItemIndex++;
                if (latestItemIndex === this.items) {
                    latestItemIndex = 0;
                }
                strData += `${list},${item}\n`;
            }
        }
        this.genrateFile("ListItems", strData);
    }

    private createAccountLists(howManyDataRows: number) {
        console.log(howManyDataRows);
        const headers = "divisionRef,companyRef,accountRef#ExternalID,listRef";
        const runningDataAccount = "accounts_index";
        const runningDataDivision = "division_index";
        const runningDataCompany = "company_index";
        const runningDataList = "list_index";
        let latestItemIndex = 0;
        let strData = "";
        strData += headers + "\n";
        let howMuchEnteries = 0;
        let index12 = 0;
        //1. division
        for (let index1 = 0; index1 < this.divisions; index1++) {
            const div = runningDataDivision.replace("index", index1.toString());
            //2. company
            for (let index2 = 0; index2 < this.companies; index2++) {
                const comp = runningDataCompany.replace("index", index2.toString());
                //3. account
                for (let index3 = 0; index3 < this.accounts; index3++) {
                    const acc = runningDataAccount.replace("index", index3.toString());
                    //4. lists split to 15
                    for (let index4 = 0; index4 < 15; index4++) {
                        const list = runningDataList.replace("index", latestItemIndex.toString());
                        latestItemIndex++;
                        if (latestItemIndex === this.items) {
                            latestItemIndex = 0;
                        }
                        strData += `${div},${comp},${acc},${list}\n`;
                        howMuchEnteries++;
                        if (howMuchEnteries >= 100000) {
                            this.genrateFile(`AccountLists_${index12}`, strData);
                            index12++;
                            strData = "";
                            strData += headers + "\n";
                            howMuchEnteries = 0;
                        }
                    }
                }
            }
        }
        // this.genrateFile("AccountLists_2", strData);
    }
}
