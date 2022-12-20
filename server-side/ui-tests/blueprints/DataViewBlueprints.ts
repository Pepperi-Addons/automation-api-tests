import { BaseFormDataViewField, DataViewColumn, DataViewContext, DataViewFieldLayout, DataViewFieldStyle, DataViewFieldType, DataViewRow, DataViewType, GridDataViewColumn, GridDataViewField } from '@pepperi-addons/papi-sdk';

export class UpsertResourceFields {
    constructor(uuID: string) {
        let uUid = uuID;
        if (uUid.length) {
            do {
                uUid = uUid.replace("-", "");
            } while (uUid.indexOf("-") !== -1);
        }
        this.EditorViewUUID = uUid
    }
    public Context: DataViewContext = {
        Name: "",
        ScreenSize: "Tablet",
        Profile: {
            Name: "Rep"
        }
    };
    protected EditorViewUUID: string;
}

export class UpsertResourceFieldsToEditor extends UpsertResourceFields {
    constructor(editorUUID: string, fields?: BaseFormDataViewField[]) {
        super(editorUUID);
        this.Context.Name = `GV_${this.EditorViewUUID}_Editor`
        if (fields) {
            this.Fields = fields;
        }
    }
    public Type: DataViewType = 'Form';
    public Fields?: BaseFormDataViewField[];
    public Rows?: DataViewRow[];
    public Columns?: DataViewColumn[];
}

export class UpsertResourceFieldsToView extends UpsertResourceFields {
    constructor(viewUUID: string, fields?: GridDataViewField[]) {
        super(viewUUID);
        this.Context.Name = `GV_${this.EditorViewUUID}_View`
        if (fields) {
            this.Fields = fields;
            this.Columns = [];
            for (let field of fields) {
                this.Columns.push({Width: 10});
            }
        }
    }
    public Type: DataViewType = 'Grid';
    public Fields?: GridDataViewField[];
    public FrozenColumnsCount?: number;
    public MinimumColumnWidth?: number;
    public Columns?: GridDataViewColumn[];
}

export class FormDataFieldForEditorView {
    constructor(
        fieldID: string,
        type: DataViewFieldType = "TextBox",
        mandatory: boolean,
        readonly: boolean,
        index: number,
        layout: DataViewFieldLayout = {
            Origin: {
                X: 0,
                Y: index
            },
            Size: {
                Width: 1,
                Height: 1
            }
        },
        style?: DataViewFieldStyle
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
            Vertical: "Center",
            Horizontal: "Stretch"
        }
    };
}