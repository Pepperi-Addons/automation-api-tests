import {
    Collection,
    CollectionField,
    DocumentKey,
    GridDataView,
    SchemeField,
    SchemeFieldType,
} from '@pepperi-addons/papi-sdk';
import { UpsertUdcGridDataView } from './DataViewBlueprints';

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
        this.AddonUUID = '122c0e9d-c240-4865-b446-f37ece866c22'; // UDC addon UUID
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

export class BodyToUpsertExtendedUdc implements Collection {
    constructor(
        collectionName: string,
        collectionDescription?: string,
        syncData?: { Sync: boolean; SyncFieldLevel?: boolean },
        inherits?: 'pricing_table' | 'survey_templates' | 'surveys' | '', // TOBE expended upon need
    ) {
        this.Name = collectionName;
        this.Description = collectionDescription ? collectionDescription : '';
        this.DocumentKey = {
            Delimiter: '@',
            Type: 'AutoGenerate',
            Fields: [],
        };
        this.Fields = {};
        this.ListView = new UpsertUdcGridDataView([]);
        this.GenericResource = true;
        this.SyncData = syncData ? syncData : { Sync: false };
        this.Extends = inherits == 'pricing_table' ? { AddonUUID: this.PricingUUID, Name: inherits } : undefined;
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
    public Extends?: { AddonUUID: string; Name: string } | undefined;

    private PricingUUID = 'adb3c829-110c-4706-9168-40fba9c0eb52';
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
        applySystemFilter?: boolean,
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
        if (applySystemFilter) {
            this.ApplySystemFilter = applySystemFilter;
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
    public ApplySystemFilter?: boolean;
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
        applySystemFilter?: boolean,
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
            applySystemFilter ? applySystemFilter : false,
        );
        this.Type = 'Resource';
    }
}

export class ContainedArrayUdcField extends BaseUdcField {
    constructor(
        resource: string,
        description = '',
        mandatory = false,
        itemsDescription = '',
        itemsMandatory?: boolean,
        itemsOptionalValues?: string[],
        itemsIndexed?: boolean,
        itemsIndexedFields?: { [key: string]: SchemeField },
        optionalValues?: string[],
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
            'Array', // type
            optionalValues ? optionalValues : undefined,
            new BaseUdcField( // items
                itemsDescription,
                itemsMandatory,
                'ContainedResource', // type
                itemsOptionalValues,
                undefined, // items
                resource,
                addonUUID,
                itemsIndexed,
                itemsIndexedFields,
            ),
            resource,
            addonUUID ? addonUUID : undefined,
            indexed ? indexed : undefined,
            indexedFields ? indexedFields : undefined,
            keyword ? keyword : undefined,
            sync ? sync : undefined,
            unique ? unique : undefined,
            fields ? fields : undefined,
        );
        this.Type = 'Array';
    }
}
