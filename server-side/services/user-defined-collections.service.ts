import { PapiClient, FindOptions, SchemeFieldType, DataViewFieldType } from '@pepperi-addons/papi-sdk';
import { DataViewBaseField, UpsertUdcGridDataView } from '../ui-tests/blueprints/DataViewBlueprints';
import {
    ArrayOfPrimitiveTypeUdcField,
    BodyToUpsertUdcWithFields,
    PrimitiveTypeUdcField,
} from '../ui-tests/blueprints/UdcBlueprints';
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
    isArray?: boolean;
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
        const response = await this.generalService.fetchStatus(
            `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName}`,
            {
                method: 'POST',
                body: JSON.stringify(field),
            },
        );
        return response;
    }

    async EditCollection(
        collecitonName: string,
        udcFields: UdcField[],
        desc?: string,
        collectionType?,
        isOnlineOnly?: boolean,
        documentKeys?: UdcField[],
    ) {
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
                Type: field.isArray === true ? 'Array' : field.Type,
                OptionalValues: optionalValues.length > 0 ? optionalValues : [],
                Items: {
                    Type: field.isArray ? field.Type : 'String',
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
                Type: field.isArray ? 'TextBox' : this.resolveUIType(field.Type),
            };
            arrayOfViews.push(uiControlUDCFields);
            arrayOfColumns.push({
                Width: 10,
            });
        }
        const DocumentKey = {};
        if (documentKeys) {
            DocumentKey['Fields'] = [];
            for (let index = 0; index < documentKeys.length; index++) {
                const keyField = documentKeys[index];
                DocumentKey['Fields'].push(keyField.Name);
            }
            DocumentKey['Delimiter'] = '@';
            DocumentKey['Type'] = 'Composite';
        } else {
            DocumentKey['Fields'] = [];
            DocumentKey['Delimiter'] = '@';
            DocumentKey['Type'] = 'AutoGenerate';
        }
        const bodyToSendCollection = {
            Name: collecitonName,
            DocumentKey,
            Fields,
            ListView: {
                Type: 'Grid',
                Fields: arrayOfViews,
                Columns: arrayOfColumns,
            },
            SyncData: {
                Sync: isOnlineOnly === true ? false : true,
                SyncFieldLevel: false,
            },
            GenericResource: true,
            Description: desc ? desc : '', //not mandatory
        };
        if (collectionType) {
            bodyToSendCollection['Type'] = collectionType;
        }
        //1. create scheme with all required data
        const udcCreateResponse = await this.generalService.fetchStatus(
            '/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes',
            {
                method: 'POST',
                body: JSON.stringify(bodyToSendCollection),
            },
        );
        return udcCreateResponse;
    }

    async getAllObjectFromCollection(collectionName, page?, maxPageSize?) {
        const body = { Page: page ? page : 1, MaxPageSize: maxPageSize ? maxPageSize : 100, IncludeCount: true };
        const response = await this.generalService.fetchStatus(
            `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/search?resource_name=${collectionName}`,
            {
                method: 'POST',
                body: JSON.stringify(body),
            },
        );
        return { objects: response.Body.Objects, count: response.Body.Count };
    }

    async hideObjectInACollection(collectionName, key) {
        const body = { Key: key, Hidden: true };
        const response = await this.generalService.fetchStatus(
            `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/documents?name=${collectionName}`,
            {
                method: 'POST',
                body: JSON.stringify(body),
            },
        );
        return response;
    }

    async hideCollection(collectionName) {
        const body = { Name: collectionName, Hidden: true };
        const response = await this.generalService.fetchStatus(
            `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/schemes`,
            {
                method: 'POST',
                body: JSON.stringify(body),
            },
        );
        return response;
    }

    resolveUIType(fieldType) {
        switch (fieldType) {
            case 'String':
            case 'ContainedResource':
            case 'Resource':
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

    async createUDCWithFields(
        collecitonName: string,
        udcFields: UdcField[],
        desc?: string,
        collectionType?,
        isOnlineOnly?: boolean,
        documentKeys?: UdcField[],
    ) {
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
                Type: field.isArray === true ? 'Array' : field.Type,
                OptionalValues: optionalValues.length > 0 ? optionalValues : [],
                Items: {
                    Type: field.isArray ? field.Type : 'String',
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
                Type: field.isArray ? 'TextBox' : this.resolveUIType(field.Type),
            };
            arrayOfViews.push(uiControlUDCFields);
            arrayOfColumns.push({
                Width: 10,
            });
        }
        const DocumentKey = {};
        if (documentKeys) {
            DocumentKey['Fields'] = [];
            for (let index = 0; index < documentKeys.length; index++) {
                const keyField = documentKeys[index];
                DocumentKey['Fields'].push(keyField.Name);
            }
            DocumentKey['Delimiter'] = '@';
            DocumentKey['Type'] = 'Composite';
        } else {
            DocumentKey['Fields'] = [];
            DocumentKey['Delimiter'] = '@';
            DocumentKey['Type'] = 'AutoGenerate';
        }
        const bodyToSendCollection = {
            Name: collecitonName,
            DocumentKey,
            Fields,
            ListView: {
                Type: 'Grid',
                Fields: arrayOfViews,
                Columns: arrayOfColumns,
            },
            SyncData: {
                Sync: isOnlineOnly === true ? false : true,
                SyncFieldLevel: false,
            },
            GenericResource: true,
            Description: desc ? desc : '', //not mandatory
        };
        if (collectionType) {
            bodyToSendCollection['Type'] = collectionType;
        }
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
        this.generalService.sleep(6000);
        const udcGetResponse = await this.generalService.fetchStatus(`/user_defined_collections/schemes?page_size=-1`);
        const createdCollection = udcGetResponse.Body.filter((collection) => collection.Name === collecitonName);
        if (createdCollection.length < 1) {
            console.log(`Cant Find Collection: ${collecitonName} inside UDC after Upserting`);
            udcGetResponse['Fail'] = `Cant Find Collection: ${collecitonName} inside UDC after Upserting`;
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
                        `UDC Returned Wrong Value: ${
                            udcUpsertItemResponse[udcUpsertItemResponse.length - 1].Body[field.Name]
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

    async upsertUDC(bodyObj, path: 'create' | 'schemes') {
        return await this.generalService.fetchStatus(`/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/${path}`, {
            method: 'POST',
            body: JSON.stringify(bodyObj),
        });
    }

    async upsertValuesToCollection(valuesObj, collectionName) {
        return await this.generalService.fetchStatus(
            `/addons/api/122c0e9d-c240-4865-b446-f37ece866c22/api/create?collection_name=${collectionName}`,
            {
                method: 'POST',
                body: JSON.stringify(valuesObj),
            },
        );
    }

    prepareDataForUdcCreation(collectionData: {
        nameOfCollection: string;
        fieldsOfCollection: {
            classType: 'Primitive' | 'Array' | 'Contained' | 'Resource';
            fieldName: string;
            fieldType?: SchemeFieldType;
            indexed?: boolean;
            mandatory?: boolean;
            fieldDescription?: string;
            dataViewType?: DataViewFieldType;
            readonly?: boolean;
        }[];
        descriptionOfCollection?: string;
        syncDefinitionOfCollection?: { Sync: boolean; SyncFieldLevel?: boolean };
        typeOfCollection?:
            | 'data'
            | 'meta_data'
            | 'indexed_data'
            | 'index'
            | 'shared_index'
            | 'pfs'
            | 'contained'
            | 'papi'
            | 'abstract';
    }) {
        const collectionFields = {};
        const udcListViewFields = collectionData.fieldsOfCollection.map((schemeField) => {
            switch (schemeField.classType) {
                case 'Primitive':
                    collectionFields[schemeField.fieldName] = new PrimitiveTypeUdcField(
                        schemeField.fieldDescription ? schemeField.fieldDescription : '',
                        schemeField.hasOwnProperty('mandatory') ? schemeField.mandatory : false,
                        schemeField.fieldType ? schemeField.fieldType : 'String',
                        schemeField.hasOwnProperty('indexed') ? schemeField.indexed : false,
                    );
                    break;
                case 'Array':
                    collectionFields[schemeField.fieldName] = new ArrayOfPrimitiveTypeUdcField(
                        schemeField.fieldDescription ? schemeField.fieldDescription : '',
                        schemeField.hasOwnProperty('mandatory') ? schemeField.mandatory : false,
                        schemeField.fieldType
                            ? schemeField.fieldType !== 'String'
                                ? schemeField.fieldType !== 'Integer'
                                    ? schemeField.fieldType !== 'Double'
                                        ? undefined
                                        : schemeField.fieldType
                                    : schemeField.fieldType
                                : schemeField.fieldType
                            : undefined,
                    );
                    break;

                default:
                    break;
            }
            return new DataViewBaseField(
                schemeField.fieldName,
                schemeField.dataViewType ? schemeField.dataViewType : 'TextBox',
                schemeField.hasOwnProperty('mandatory') ? schemeField.mandatory : false,
                schemeField.hasOwnProperty('readonly') ? schemeField.readonly : true,
            );
        });
        const udcListView = new UpsertUdcGridDataView(udcListViewFields);
        const bodyOfCollectionWithFields = new BodyToUpsertUdcWithFields(
            collectionData.nameOfCollection,
            collectionFields,
            udcListView,
            collectionData.descriptionOfCollection ? collectionData.descriptionOfCollection : undefined,
            collectionData.syncDefinitionOfCollection ? collectionData.syncDefinitionOfCollection : undefined,
            collectionData.typeOfCollection ? collectionData.typeOfCollection : undefined,
        );

        return bodyOfCollectionWithFields;
    }
}
