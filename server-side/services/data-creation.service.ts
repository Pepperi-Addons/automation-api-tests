import { Client } from '@pepperi-addons/debug-server/dist';
import { AddonDataScheme, SchemeField } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';
import fetch, { RequestInit, Response } from "node-fetch";



export interface Resource {
    scheme: AddonDataScheme;
    count: number;
    urlToResource?: string;
}

export class DataCreation {
    constructor(private client: Client) { }
    // userSavedData: string[] = [];
    // accountsSavedData: string[] = [];
    // companySavedData: string[] = [];
    // divisonSavedData: string[] = [];
    // listSavedData: string[] = [];
    // itemsSavedData: string[] = [];
    generalService = new GeneralService(this.client);

    resourceList: Resource[] = [
        { scheme: { Name: 'users', Fields: { ExternalID: { Type: 'String' }, Email: { Type: 'String' } } }, count: 5, urlToResource: "" },
        { scheme: { Name: 'accounts', Fields: { ExternalID: { Type: 'String' } } }, count: 30000, urlToResource: "" },
        {
            scheme: { Name: 'items', Fields: { MainCategoryID: { Type: 'String' }, ExternalID: { Type: 'String' } } },
            count: 3000, urlToResource: ""
        },
        { scheme: { Name: 'Divisions', Fields: { code: { Type: 'String' } } }, count: 2, urlToResource: "" },
        { scheme: { Name: 'Companies', Fields: { code: { Type: 'String' } } }, count: 2, urlToResource: "" },
        {
            scheme: {
                Name: 'UserInfo',
                Fields: {
                    usersRef: { Type: 'Resource' },
                    divisionsRef: { Type: 'Resource' },
                    companiesRef: { Type: 'Resource' },
                },
            },
            count: 5, urlToResource: ""
        },
        {
            scheme: { Name: 'AccountData1', Fields: { accountsRef: { Type: 'Resource' }, value1: { Type: 'String' } } },
            count: 30000, urlToResource: ""
        },
        {
            scheme: {
                Name: 'DivisionData1',
                Fields: { divisionsRef: { Type: 'Resource' }, value1: { Type: 'String' } },
            },
            count: 2,
            urlToResource: ""
        },
        {
            scheme: {
                Name: 'Data2XRef',
                Fields: {
                    divisionsRef: { Type: 'Resource' },
                    companiesRef: { Type: 'String' },
                    value1: { Type: 'String' },
                    value2: { Type: 'String' },
                },
            },
            count: 4,
            urlToResource: ""
        },
        {
            scheme: {
                Name: 'DataX3Ref',
                Fields: {
                    accountsRef: { Type: 'Resource' },
                    divisionsRef: { Type: 'String' },
                    companiesRef: { Type: 'String' },
                    value1: { Type: 'String' },
                    value2: { Type: 'String' },
                },
            },
            count: 120000,
            urlToResource: ""
        },
        { scheme: { Name: 'Lists', Fields: { Code: { Type: 'String' } } }, count: 6000 },
        {
            scheme: { Name: 'ListItems', Fields: { listsRef: { Type: 'Resource' }, itemsRef: { Type: 'Resource' } } },
            count: 100000,
            urlToResource: ""
        },
        {
            scheme: {
                Name: 'AccountLists',
                Fields: {
                    divisionsRef: { Type: 'Resource' },
                    companiesRef: { Type: 'Resource' },
                    accountsRef: { Type: 'Resource' },
                    listsRef: { Type: 'Resource' },
                },
            },
            count: 120000,
            urlToResource: ""
        },
    ];

    async createData() {
        for (let index = 0; index < this.resourceList.length; index++) {
            const resource = this.resourceList[index];
            const resourceCreator = new ResourceCreation(resource, this);
            await resourceCreator.execute();
        }
    }
}
class ResourceCreation {
    constructor(private resource: Resource, private mgr: DataCreation) { }
    async execute(): Promise<void> {
        //promise should be string
        // get fields and create csv header
        const fields = this.getFields();
        const schemeFieldsAsCsvHeader = fields.join(',');
        // loop generate lines
        let csvLines;
        try {
            csvLines = this.generateData(fields, this.resource.scheme.Name, this.resource.scheme.Fields as any);
        } catch (error) {
            debugger;
        }
        if (csvLines.charAt(csvLines.length - 1) === "\n") {
            let position = csvLines.length;
            csvLines = csvLines.substring(0, position - 1) + csvLines.substring(position, csvLines.length);
        }
        if (csvLines.charAt(csvLines.length - 1) === ",") {
            let position = csvLines.length;
            csvLines = csvLines.substring(0, position - 1) + csvLines.substring(position, csvLines.length);
        }
        const csvData = `${schemeFieldsAsCsvHeader}\n${csvLines}`;
        console.log(`${this.resource.scheme.Name}-->${csvData}`);
        await this.genrateTempFile(this.resource.scheme.Name, csvData);
    }

    private async genrateTempFile(tempFileName, data) {
        let generateRespnse;
        //generate temp files
        try {
            generateRespnse = await this.mgr.generalService.fetchStatus(
                '/addons/api/00000000-0000-0000-0000-0000000f11e5/api/temporary_file',
                {
                    method: 'POST',
                    body: JSON.stringify({}),
                },
            );
        } catch (error) {
            debugger;
        }
        //convert string data to buffer
        const buffer = Buffer.from(data, 'utf-8');
        const uploadToTempResponse = await this.uploadFileToTempUrl(buffer, generateRespnse.Body.PutURL);
        if (uploadToTempResponse.status === 200) {
            const y = await (await fetch(generateRespnse.Body.TemporaryFileURL)).text();
            // console.log(`temp response: ${y}`);
        }
        //save the URL to get file on mgr
        const res = this.mgr.resourceList.find((resource) => resource.scheme.Name.toLocaleLowerCase() === tempFileName.toLocaleLowerCase());
        (res as any).urlToResource = generateRespnse.Body.TemporaryFileURL;
    }

    private getFields() {
        const data: string[] = [];
        for (const [key] of Object.entries(this.resource.scheme.Fields as any)) {
            data.push(key);
        }
        return data;
    }

    private generateData(fields, resourceName, schemeFields: { [key: string]: SchemeField }) {
        const csvLines: string[] = [];
        //running on the 'count' of the resource to create sufficent qty of items
        for (let index = 0; index < this.resource.count; index++) {
            //filling all needed properties by the number of 'columns' in CSV
            for (let index1 = 0; index1 < fields.length; index1++) {
                const isRef = Object.entries(schemeFields)[index1][1].Type === 'Resource';
                if (isRef) {
                    // debugger;
                    csvLines.push(this.generateRefField(index, index1) + ',');
                } else {
                    csvLines.push(this.generateField(resourceName, index) + `,`);
                }
            }
            if (csvLines.length - 1 >= 0) csvLines[csvLines.length - 1] += '\n';
        }
        // this.handleSavingData(this.resource.scheme.Name, csvLines);
        return csvLines.join('');
    }

    private async uploadFileToTempUrl(buffer: Buffer, putURL: string): Promise<Response> {
        const requestOptions: RequestInit = {
            method: 'PUT',
            body: buffer,
            headers: {
                "Content-Length": buffer.length.toString()
            }
        };
        return await fetch(putURL, requestOptions);
    }

    // private generateLine(name, index, isRef, index1) {
    //     // if (isRef) {
    //     //     //cutting the string to 'know' which resource is referanced
    //     //     const whichRef = Object.entries(this.resource.scheme.Fields as any)[index1][0].replace('Ref', '');
    //     //     //loading the already created resource data to refereance
    //     //     const savedData = this.handleLoadingData(whichRef);
    //     //     //in case we need to re-run on the list as its not big enough
    //     //     while (index >= (savedData as any).length) {
    //     //         index = index - (savedData as any).length;
    //     //     }
    //     //     //parse and return the data
    //     //     let dataToReturn = (savedData as any)[index];
    //     //     dataToReturn = dataToReturn.replace(',', '');
    //     //     dataToReturn = dataToReturn.replace('\n', '');
    //     //     return dataToReturn;
    //     // } else {
    //     //     return `${name}_${index}`;
    //     // }
    // }

    private generateField(name, index) {
        return `${name.toLocaleLowerCase()}_${index}`;
    }

    private generateRefField(index, index1) {
        //cutting the string to 'know' which resource is referanced
        const whichRef = Object.entries(this.resource.scheme.Fields as any)[index1][0].replace('Ref', '');
        //get the spesific resource
        const res = this.mgr.resourceList.find((resource) => resource.scheme.Name.toLocaleLowerCase() === whichRef);
        // debugger;
        //in case we need to re-run on the list as its not big enough
        if (index >= (res as any).count) {
            index = index % (res as any).count;
        }
        return this.generateField((res as any).scheme.Name.toLocaleLowerCase(), index);
    }

    // private handleSavingData(name: string, csvLines: string[]) {
    //     switch (name) {
    //         case 'users':
    //             this.mgr.userSavedData = csvLines;
    //             break;
    //         case 'accounts':
    //             this.mgr.accountsSavedData = csvLines;
    //             break;
    //         case 'Companies':
    //             this.mgr.companySavedData = csvLines;
    //             break;
    //         case 'Divisions':
    //             this.mgr.divisonSavedData = csvLines;
    //             break;
    //         case 'Lists':
    //             this.mgr.listSavedData = csvLines;
    //             break;
    //         case 'items':
    //             this.mgr.itemsSavedData = csvLines;
    //             break;
    //     }
    // }

    // private handleLoadingData(name: string) {
    //     switch (name.toLocaleLowerCase()) {
    //         case 'user':
    //             return this.mgr.userSavedData;
    //         case 'account':
    //             return this.mgr.accountsSavedData;
    //         case 'company':
    //             return this.mgr.companySavedData;
    //         case 'division':
    //             return this.mgr.divisonSavedData;
    //         case 'list':
    //             return this.mgr.listSavedData;
    //         case 'item':
    //             return this.mgr.itemsSavedData;
    //     }
    // }
}
