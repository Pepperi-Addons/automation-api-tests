import {
    Collection,
    CollectionField,
    DocumentKey,
    GridDataView,
    SchemeField,
    SchemeFieldType,
} from '@pepperi-addons/papi-sdk';

export class BodyToUpsertUdcWithFields implements Collection {
    constructor(
        collectionName: string,
        collectionFields: { [key: string]: CollectionField },
        listView: GridDataView,
        collectionDescription?: string,
        syncData?: { Sync: boolean; SyncFieldLevel?: boolean },
        type?:
            | 'data'
            | 'meta_data'
            | 'indexed_data'
            | 'index'
            | 'shared_index'
            | 'pfs'
            | 'contained'
            | 'papi'
            | 'abstract',
    ) {
        this.Name = collectionName;
        this.Description = collectionDescription ? collectionDescription : '';
        this.DocumentKey = {
            Delimiter: '@',
            Type: 'AutoGenerate',
            Fields: [],
        };
        this.Fields = collectionFields;
        this.ListView = listView;
        this.GenericResource = true;
        this.SyncData = syncData ? syncData : { Sync: true, SyncFieldLevel: false };
        this.UserDefined = true;
        this.Type = type ? type : 'data';
        this.Hidden = false;
        this.AddonUUID = '122c0e9d-c240-4865-b446-f37ece866c22';
    }
    public Name: string;
    public Description: string;
    public DocumentKey: DocumentKey;
    public Fields: {
        [key: string]: CollectionField;
    };
    public ListView: GridDataView;
    public SyncData: { Sync: boolean; SyncFieldLevel?: boolean };
    public GenericResource: boolean;
    public UserDefined?: boolean;
    public Type?:
        | 'data'
        | 'meta_data'
        | 'indexed_data'
        | 'index'
        | 'shared_index'
        | 'pfs'
        | 'contained'
        | 'papi'
        | 'abstract';
    public Hidden?: boolean;
    public AddonUUID?: string;
}

export class BaseUdcField implements CollectionField {
    constructor(
        description: string,
        mandatory = false,
        type: SchemeFieldType = 'String',
        optionalValues?: string[],
        items?: CollectionField,
        resource?: string,
        addonUUID?: string,
        indexed?: boolean,
        indexedFields?: { [key: string]: SchemeField },
        keyword?: boolean,
        sync?: boolean,
        unique?: boolean,
        fields?: { [key: string]: CollectionField },
    ) {
        this.Description = description;
        this.Mandatory = mandatory;
        this.Type = type;
        if (optionalValues?.length) {
            this.OptionalValues = optionalValues;
        }
        if (items) {
            this.Items = items;
        }
        if (resource) {
            this.Resource = resource;
        }
        if (addonUUID) {
            this.AddonUUID = addonUUID;
        }
        if (indexed) {
            this.Indexed = indexed;
        }
        if (indexedFields) {
            this.IndexedFields = indexedFields;
        }
        if (keyword) {
            this.Keyword = keyword;
        }
        if (sync) {
            this.Sync = sync;
        }
        if (unique) {
            this.Unique = unique;
        }
        if (fields) {
            this.Fields = fields;
        }
    }
    public Description: string;
    public Mandatory: boolean;
    public Type: SchemeFieldType;
    public OptionalValues?: string[];
    public Items?: CollectionField;
    public Resource?: string;
    public AddonUUID?: string;
    public Indexed?: boolean;
    public IndexedFields?: {
        [key: string]: SchemeField;
    };
    public Keyword?: boolean;
    public Sync?: boolean;
    public Unique?: boolean;
    public Fields?: {
        [key: string]: CollectionField;
    };
}

export class PrimitiveTypeUdcField extends BaseUdcField {
    constructor(description = '', mandatory = false, type: SchemeFieldType = 'String', indexed?: boolean) {
        super(description, mandatory, type, undefined, undefined, undefined, undefined, indexed ? indexed : undefined);
    }

    public ApplySystemFilter?: boolean | undefined;
}

export class ArrayOfPrimitiveTypeUdcField extends BaseUdcField {
    constructor(description = '', mandatory = false, type: 'String' | 'Integer' | 'Double' = 'String') {
        super(description, mandatory, type, undefined, undefined, undefined, undefined, false);
        this.Type = 'Array';
        this.Items = new PrimitiveTypeUdcField('', false, type);
    }
}

export class ResourceUdcField extends BaseUdcField {
    constructor(
        resource: string,
        description = '',
        mandatory = false,
        type: SchemeFieldType = 'Resource',
        optionalValues?: string[],
        items?: CollectionField,
        addonUUID?: string,
        indexed?: boolean,
        indexedFields?: { [key: string]: SchemeField },
        keyword?: boolean,
        sync?: boolean,
        unique?: boolean,
        fields?: { [key: string]: CollectionField },
    ) {
        super(
            description,
            mandatory,
            type,
            optionalValues ? optionalValues : undefined,
            items ? items : undefined,
            resource,
            addonUUID ? addonUUID : undefined,
            indexed ? indexed : undefined,
            indexedFields ? indexedFields : undefined,
            keyword ? keyword : undefined,
            sync ? sync : undefined,
            unique ? unique : undefined,
            fields ? fields : undefined,
        );
        this.Type = 'Resource';
    }
}
