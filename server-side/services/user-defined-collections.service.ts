import { PapiClient, FindOptions } from '@pepperi-addons/papi-sdk';
import GeneralService from './general.service';

export interface UdcField {
    Name: string;
    Description?: string;
    Mandatory: boolean;
    Type: 'String' | 'Bool' | 'Integer' | 'Double' | 'DateTime' | 'Resource' | 'ContainedResource';
    OptionalValues?: string[];
    Indexed?: boolean;
    Value?: string | boolean | number | Date | unknown;
    Resource?: string;
    AdddonUID?: string;
}

const UserDefinedCollectionsUUID = '122c0e9d-c240-4865-b446-f37ece866c22';

export class UDCService {
    papiClient: PapiClient;
    generalService: GeneralService;
    uuid: string;
    sk: any;

    constructor(public service: GeneralService) {
        this.papiClient = service.papiClient;
        this.generalService = service;
        this.uuid = UserDefinedCollectionsUUID;
    }

    postScheme(body: any) {
        return this.papiClient.userDefinedCollections.schemes.upsert(body);
    }

    getSchemes(options?: FindOptions) {
        return this.papiClient.userDefinedCollections.schemes.find(options);
    }

    postDocument(collectionName, body) {
        return this.papiClient.userDefinedCollections.documents(collectionName).upsert(body);
    }

    getDocuments(collectionName, options?: FindOptions) {
        return this.papiClient.userDefinedCollections.documents(collectionName).find(options);
    }

    async getCollectionFromADAL(collection, varKey: string) {
        if (!this.sk) {
            this.sk = await this.generalService.getSecretKey(this.uuid, varKey);
        }
        return await this.generalService
            .fetchStatus(`/addons/data/${this.uuid}/${collection}`, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': this.uuid,
                    'X-Pepperi-SecretKey': this.sk,
                },
            })
            .then((res) => res.Body);
    }

    async removeCollectionFromADAL(collection, varKey: string) {
        if (!this.sk) {
            this.sk = await this.generalService.getSecretKey(this.uuid, varKey);
        }
        return await this.generalService
            .fetchStatus(`/addons/data/${this.uuid}/${collection}/purge`, {
                method: 'GET',
                headers: {
                    'X-Pepperi-OwnerID': this.uuid,
                    'X-Pepperi-SecretKey': this.sk,
                },
            })
            .then((res) => res.Body);
    }

    async sendDataToField(collectionName, field) {
        const response = await this.generalService.fetchStatus(`/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName}`, {
            method: "POST",
            body: JSON.stringify(field)
        });
        // debugger;
        return response;
    }

    async getAllObjectFromCollection(collectionName) {
        const body = { "Page": 1, "MaxPageSize": 100, "IncludeCount": true };
        const response = await this.generalService.fetchStatus(`/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/search?resource_name=${collectionName}`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        return response.Body.Objects;
    }

    async hideObjectInACollection(collectionName, key) {
        const body = { Key: key, Hidden: true };
        const response = await this.generalService.fetchStatus(`/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=${collectionName}`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        return response;
    }

    async hideCollection(collectionName) {
        const body = { Name: collectionName, "Hidden": true };
        const response = await this.generalService.fetchStatus(`/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes`, {
            method: "POST",
            body: JSON.stringify(body)
        });
        return response;
    }

    resolveUIType(fieldType) {
        switch (fieldType) {
            case 'String':
            case 'ContainedResource':
                return 'TextBox';
            case 'Bool':
                return 'Boolean';
            case 'Integer':
                return 'NumberInteger';
            case 'Double':
                return 'NumberReal';
            case 'DateTime':
                return 'DateAndTime';
        }
    }

    async createUDCWithFields(collecitonName: string, udcFields: UdcField[], desc?: string) {
        const Fields = {};
        for (let index = 0; index < udcFields.length; index++) {
            const field = udcFields[index];
            const optionalValues: string[] = [];
            if (field.Type === 'String' && field.OptionalValues) {
                for (let index = 0; index < field.OptionalValues.length; index++) {
                    optionalValues.push(field.OptionalValues[index]);
                }
            }
            Fields[field.Name] = {
                Description: field.Description ? field.Description : '',
                Mandatory: field.Mandatory,
                Type: field.Type,
                OptionalValues: optionalValues.length > 0 ? optionalValues : [],
                Items: {
                    //always the same
                    Type: 'String',
                    Mandatory: false,
                    Description: '',
                },
                Resource: field.Resource ? field.Resource : '',
                AddonUUID: field.AdddonUID ? field.AdddonUID : '',
                Indexed: field.Indexed ? field.Indexed : false,
            };
            // debugger;
        }
        const arrayOfViews: any[] = [];
        const arrayOfColumns: any[] = [];
        for (let index = 0; index < udcFields.length; index++) {
            let uiControlUDCFields = {};
            const field = udcFields[index];
            uiControlUDCFields = {
                FieldID: field.Name,
                Mandatory: field.Mandatory,
                ReadOnly: true,
                Title: field.Name,
                Type: this.resolveUIType(field.Type)
            };
            arrayOfViews.push(uiControlUDCFields);
            arrayOfColumns.push({
                Width: 10,
            });
        }
        const bodyToSendCollection = {
            Name: collecitonName,
            DocumentKey: {
                Delimiter: '@',
                Type: 'AutoGenerate',
                Fields: [],
            },
            Fields,
            ListView: {
                Type: 'Grid',
                Fields: arrayOfViews,
                Columns: arrayOfColumns,
            },
            SyncData: {
                Sync: true,
                SyncFieldLevel: false,
            },
            GenericResource: true,
            Description: desc ? desc : '', //not mandatory
        };
        //1. create scheme with all required data
        const udcCreateResponse = await this.generalService.fetchStatus(
            '/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create',
            {
                method: 'POST',
                body: JSON.stringify(bodyToSendCollection),
            },
        );
        //2. test that the collection was created correctly
        if (udcCreateResponse.Ok !== true) {
            console.log(`UDC Returned Error OK: ${udcCreateResponse.Ok}`);
            udcCreateResponse['Fail'] = udcCreateResponse.Body.fault.faultstring;
            return udcCreateResponse;
        }
        if (udcCreateResponse.Status !== 200) {
            console.log(`UDC Returned Error Status: ${udcCreateResponse.Status}`);
            udcCreateResponse['Fail'] = udcCreateResponse.Body.fault.faultstring;

            return udcCreateResponse;
        }
        if (udcCreateResponse.Body.Name.trim() !== collecitonName) {
            console.log(`UDC Returned Wrong Name: ${udcCreateResponse.Body.Name} instaed of: ${collecitonName}`);
            udcCreateResponse['Fail'] = udcCreateResponse.Body.fault.faultstring;
            return udcCreateResponse;
        }
        //3. test we can find the collection
        const udcGetResponse = await this.generalService.fetchStatus('/user_defined_collections/schemes?where=');
        const createdCollection = udcGetResponse.Body.filter((collection) => collection.Name === collecitonName);
        if (createdCollection.length < 1) {
            console.log(`Cant Find Collection: ${collecitonName} inside UDC after Upserting`);
            return udcGetResponse;
        }
        const udcUpsertItemResponse: any[] = [];
        //3. upsert all items
        for (let index = 0; index < udcFields.length; index++) {
            const field: UdcField = udcFields[index];
            if (field.Value) {
                const bodyToSendField = {};
                bodyToSendField[field.Name] = field.Value;
                udcUpsertItemResponse.push(
                    await this.generalService.fetchStatus(
                        `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collecitonName}`,
                        {
                            method: 'POST',
                            body: JSON.stringify(bodyToSendField),
                        },
                    ),
                );
                if (udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Ok !== true) {
                    console.log(`UDC Returned Error OK: ${udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Ok}`);
                    udcUpsertItemResponse[udcUpsertItemResponse.length - 1]['Fail'] =
                        udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body.fault.faultstring;
                    return udcUpsertItemResponse[udcUpsertItemResponse.length - 1];
                }
                if (udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Status !== 200) {
                    console.log(
                        `UDC Returned Error Status: ${udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Status}`,
                    );
                    udcUpsertItemResponse[udcUpsertItemResponse.length - 1]['Fail'] =
                        udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body.fault.faultstring;
                    return udcUpsertItemResponse[udcUpsertItemResponse.length - 1];
                }
                if (udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body[field.Name] !== field.Value) {
                    console.log(
                        `UDC Returned Wrong Value: ${udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body[field.Name]
                        } instaed of: ${field.Value}`,
                    );
                    udcUpsertItemResponse[udcUpsertItemResponse.length - 1]['Fail'] =
                        udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body.fault.faultstring;
                    return udcUpsertItemResponse[udcUpsertItemResponse.length - 1];
                }
            }
        }
        //4. test all items are upserted
        const udcWithFieldGetResponse = await this.generalService.fetchStatus(
            `/user_defined_collections/schemes/${collecitonName}`,
        );
        if (udcWithFieldGetResponse.Ok !== true) {
            console.log(`UDC Returned Error OK: ${udcCreateResponse.Ok}`);
            udcCreateResponse['Fail'] = udcWithFieldGetResponse.Body.fault.faultstring;
            return udcCreateResponse;
        }
        if (udcWithFieldGetResponse.Status !== 200) {
            console.log(`UDC Returned Error Status: ${udcCreateResponse.Status}`);
            udcCreateResponse['Fail'] = udcWithFieldGetResponse.Body.fault.faultstring;
            return udcCreateResponse;
        }
        for (let index = 0; index < udcFields.length; index++) {
            const field: UdcField = udcFields[index];
            if (!udcWithFieldGetResponse.Body.Fields[field.Name]) {
                console.log(`the upserted field: ${field.Name} is not found in ${collecitonName} collection`);
                udcWithFieldGetResponse['Fail'] = udcWithFieldGetResponse.Body.fault.faultstring;
                return udcWithFieldGetResponse;
            }
        }
        return udcWithFieldGetResponse.Body.Fields;
    }
}
