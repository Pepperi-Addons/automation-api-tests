import {
    BaseFormDataViewField,
    DataViewColumn,
    DataViewContext,
    DataViewFieldLayout,
    DataViewFieldStyle,
    DataViewFieldType,
    DataViewRow,
    FormDataView,
    GridDataView,
    GridDataViewColumn,
    GridDataViewField,
    MenuDataView,
    MenuDataViewField,
} from '@pepperi-addons/papi-sdk';

export class UpsertResourceFields {
    constructor(uuID: string) {
        let uUid = uuID;
        if (uUid.length) {
            do {
                uUid = uUid.replace('-', '');
            } while (uUid.indexOf('-') !== -1);
        }
        this.EditorViewUUID = uUid;
    }
    public Context: DataViewContext = {
        Name: '',
        ScreenSize: 'Tablet',
        Profile: {
            Name: 'Rep',
        },
    };
    protected EditorViewUUID: string;
}

export class UpsertResourceFieldsToEditor extends UpsertResourceFields implements FormDataView {
    constructor(editorUUID: string, fields?: BaseFormDataViewField[]) {
        super(editorUUID);
        this.Context.Name = `GV_${this.EditorViewUUID}_Editor`;
        this.Type = 'Form';
        if (fields) {
            this.Fields = fields;
        }
    }
    public Type: 'Form';
    public Fields?: BaseFormDataViewField[];
    public Rows?: DataViewRow[];
    public Columns?: DataViewColumn[];
}

export class UpsertResourceFieldsToView extends UpsertResourceFields implements GridDataView {
    constructor(viewUUID: string, fields?: GridDataViewField[]) {
        super(viewUUID);
        this.Context.Name = `GV_${this.EditorViewUUID}_View`;
        this.Type = 'Grid';
        if (fields) {
            this.Fields = fields;
            this.Columns = [];
            for (const field of fields) {
                this.Columns.push({ Width: 10 });
                console.info(`field: ${field}`);
            }
        }
    }
    public Type: 'Grid';
    public Fields?: GridDataViewField[];
    public FrozenColumnsCount?: number;
    public MinimumColumnWidth?: number;
    public Columns?: GridDataViewColumn[];
}

export class DataFieldForEditorView implements BaseFormDataViewField {
    constructor(
        fieldID: string,
        type: DataViewFieldType = 'TextBox',
        mandatory: boolean,
        readonly: boolean,
        index: number,
        layout: DataViewFieldLayout = {
            Origin: {
                X: 0,
                Y: index,
            },
            Size: {
                Width: 1,
                Height: 1,
            },
        },
        style?: DataViewFieldStyle,
    ) {
        this.FieldID = fieldID;
        this.Type = type;
        this.Title = fieldID;
        this.Mandatory = mandatory;
        this.ReadOnly = readonly;
        if (layout) {
            this.Layout = layout;
        }
        if (style) {
            this.Style = style;
        }
    }
    public FieldID: string;
    public Type: DataViewFieldType;
    public Title: string;
    public Mandatory: boolean;
    public ReadOnly: boolean;
    public Layout?: DataViewFieldLayout;
    public Style?: DataViewFieldStyle = {
        Alignment: {
            Vertical: 'Center',
            Horizontal: 'Stretch',
        },
    };
}

export class UpsertFieldsToMenuDataView implements MenuDataView {
    constructor(fields?: MenuDataViewField[]) {
        this.Type = 'Menu';
        if (fields) {
            this.Fields = fields;
        }
    }

    public Type: 'Menu';
    public Fields?: MenuDataViewField[];
    public Context: DataViewContext = {
        Name: '',
        ScreenSize: 'Tablet',
        Profile: {
            Name: 'Rep',
        },
    };
}

export class UpsertFieldsToMappedSlugs extends UpsertFieldsToMenuDataView {
    constructor(fields: MenuDataViewField[]) {
        super(fields);
        this.Context.Name = 'Slugs';
    }
}

export class SlugField implements MenuDataViewField {
    constructor(slugName: string, slugUUID: string) {
        this.FieldID = slugName;
        this.Title = slugUUID;
    }
    public FieldID: string;
    public Title: string;
}
