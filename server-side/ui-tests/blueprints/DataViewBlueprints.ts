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
                console.info(`field: ${JSON.stringify(field, null, 2)}`);
            }
        }
    }
    public Type: 'Grid';
    public Fields?: GridDataViewField[];
    public FrozenColumnsCount?: number;
    public MinimumColumnWidth?: number;
    public Columns?: GridDataViewColumn[];
}

export class UpsertResourceFieldsToMenuDataView extends UpsertResourceFields implements MenuDataView {
    constructor(
        viewUUID: string,
        context: 'Menu' | 'LineMenu' | 'SmartSearch' | 'Search',
        fields?: MenuDataViewField[],
    ) {
        super(viewUUID);
        this.Context.Name = `GV_${this.EditorViewUUID}_${context}`;
        this.Type = 'Menu';
        if (fields) {
            this.Fields = fields;
            // this.Columns = [];
            // for (const field of fields) {
            //     this.Columns.push({ Width: 10 });
            //     console.info(`field: ${field}`);
            // }
        }
    }
    public Type: 'Menu';
    public Fields?: MenuDataViewField[];
    public FrozenColumnsCount?: number;
    public MinimumColumnWidth?: number;
    public Columns?: DataViewColumn[];
}

export class UpsertResourceFieldsToViewMenu extends UpsertResourceFieldsToMenuDataView {
    constructor(viewUUID: string, fields?: MenuDataViewField[]) {
        super(viewUUID, 'Menu', fields);
    }
}

export class UpsertResourceFieldsToViewLineMenu extends UpsertResourceFieldsToMenuDataView {
    constructor(viewUUID: string, fields?: MenuDataViewField[]) {
        super(viewUUID, 'LineMenu', fields);
    }
}

export class UpsertResourceFieldsToViewSmartSearch extends UpsertResourceFieldsToMenuDataView {
    constructor(viewUUID: string, fields?: MenuDataViewField[]) {
        super(viewUUID, 'SmartSearch', fields);
    }
}

export class UpsertResourceFieldsToViewSearch extends UpsertResourceFieldsToMenuDataView {
    constructor(viewUUID: string, fields?: MenuDataViewField[]) {
        super(viewUUID, 'Search', fields);
    }
}

export class UpsertUdcGridDataView implements GridDataView {
    constructor(listOfFields: GridDataViewField[]) {
        this.Type = 'Grid';
        this.Context = {
            ScreenSize: 'Landscape',
            Profile: {},
            Name: '',
        };
        this.Fields = [];
        this.Columns = [];
        if (listOfFields.length) {
            this.Fields = listOfFields;
            for (const field of listOfFields) {
                this.Columns.push({ Width: 10 });
                console.info(`field: ${field}`);
            }
        }
    }
    public Context?: DataViewContext;
    public Type: 'Grid';
    public Fields?: GridDataViewField[];
    public Columns?: GridDataViewColumn[];
}

export class DataViewBaseField implements GridDataViewField {
    constructor(
        fieldName: string,
        type: DataViewFieldType = 'TextBox',
        title = '',
        mandatory = false,
        readonly = true,
    ) {
        this.FieldID = fieldName;
        this.Type = type;
        this.Title = title || fieldName;
        this.Mandatory = mandatory;
        this.ReadOnly = readonly;
    }
    public FieldID: string;
    public Type: DataViewFieldType;
    public Title: string;
    public Mandatory: boolean;
    public ReadOnly: boolean;
}

export class DataFieldForEditorView extends DataViewBaseField implements BaseFormDataViewField {
    constructor(
        fieldID: string,
        type: DataViewFieldType = 'TextBox',
        title: string,
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
        super(fieldID, type, title, mandatory, readonly);

        if (layout) {
            this.Layout = layout;
        }
        if (style) {
            this.Style = style;
        }
    }

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
    constructor(slugPath: string, pageUUID: string) {
        this.FieldID = slugPath;
        this.Title = pageUUID;
    }
    public FieldID: string;
    public Title: string;
}

export class ViewMenuTypeField implements MenuDataViewField {
    constructor(fieldName: string) {
        this.FieldID = fieldName;
        this.Title = fieldName;
    }
    public FieldID: string;
    public Title: string;
}
