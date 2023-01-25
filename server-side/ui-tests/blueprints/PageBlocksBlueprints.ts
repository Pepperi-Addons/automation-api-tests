export class ResourceListBasicViewerEditorBlocksStructurePage {
    constructor(
        pageKey: string,
        blockList: {
            blockKey: string;
            blockResource: string;
            collectionName: string;
            editorUUID?: string;
            selectedView?: { selectedViewUUID: string; selectedViewName: string };
        }[],
        listOfSectionsKeyBlocklist: { sectionKey: string; listOfBlockKeys: string[] }[],
    ) {
        this.Key = pageKey;
        blockList.forEach((block) => {
            if (block.editorUUID) {
                this.Blocks.push(
                    new ResourceListBlock(block.blockKey, block.blockResource, block.collectionName, block.editorUUID),
                );
            }
            if (block.selectedView) {
                this.Blocks.push(
                    new ResourceListBlock(
                        block.blockKey,
                        block.blockResource,
                        block.collectionName,
                        '',
                        block.selectedView,
                    ),
                );
            }
        });
        this.Layout = new ResourceListLayout(listOfSectionsKeyBlocklist);
    }
    public Blocks: ResourceListBlock[] = [];
    public Layout: ResourceListLayout;
    public Hidden = false;
    public Key: string;
    public Name?: string;
    public Description?: string;
}

export class ResourceListBlock {
    constructor(
        blockKey: string,
        blockResource: string,
        collectionName: string,
        editorUUID?: string,
        selecedView?: { selectedViewUUID: string; selectedViewName: string },
    ) {
        this.Key = blockKey;
        this.Relation = new ResourceListBlockRelation(blockResource);
        switch (blockResource) {
            case 'DataViewerBlock':
                if (selecedView) {
                    this.Configuration = new ResourceListBlockConfiguration(
                        blockResource,
                        collectionName,
                        '',
                        selecedView,
                    );
                }
                break;

            case 'DataConfigurationBlock':
                if (editorUUID) {
                    this.Configuration = new ResourceListBlockConfiguration(blockResource, collectionName, editorUUID);
                }
                break;

            default:
                this.Configuration = {};
                break;
        }
    }
    public Configuration: ResourceListBlockConfiguration | any;
    public Key: string;
    public Relation: ResourceListBlockRelation;
}

export class ResourceListBlockConfiguration {
    constructor(
        blockResource: string,
        collectionName: string,
        editorUUID?: string,
        selectedView?: { selectedViewUUID: string; selectedViewName: string },
    ) {
        this.Resource = blockResource;
        this.AddonUUID = '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3';

        switch (blockResource) {
            case 'DataViewerBlock':
                if (selectedView) {
                    this.Data = new ResourceListBlockConfigurationDataView(collectionName, selectedView);
                }
                break;

            case 'DataConfigurationBlock':
                if (editorUUID) {
                    this.Data = new ResourceListBlockConfigurationDataEditor(editorUUID, collectionName);
                }
                break;

            default:
                this.Data = {};
                break;
        }
    }
    public Resource: string;
    public Data: ResourceListBlockConfigurationDataView | ResourceListBlockConfigurationDataEditor | any;
    public AddonUUID: string;
}

export class ResourceListBlockConfigurationDataEditor {
    constructor(editorUUID: string, collectionName: string) {
        this.currentEditorKey = editorUUID;
        this.currentResourceName = collectionName;
    }
    public currentEditorKey: string;
    public currentResourceName: string;
}

export class ResourceListBlockConfigurationDataView {
    constructor(collectionName: string, selectedView: { selectedViewUUID: string; selectedViewName: string }) {
        this.resource = collectionName;
        this.viewsList.push(
            new ResourceListBlockConfigurationDataViewInViewsList(
                selectedView.selectedViewUUID,
                selectedView.selectedViewName,
            ),
        );
    }
    public resource: string;
    public viewsList: ResourceListBlockConfigurationDataViewInViewsList[] = [];
}

export class ResourceListBlockConfigurationDataViewInViewsList {
    constructor(selectedViewUUID: string, selectedViewName: string) {
        this.selectedView = new ViewID(selectedViewUUID, selectedViewName);
    }

    public id?: string;
    public title?: string;
    public selectedView: ViewID;
    public views?: ViewID[];
    public showContent = true;
}

export class ViewID {
    constructor(viewUUID: string, viewName: string) {
        this.key = viewUUID;
        this.value = viewName;
    }
    public value: string;
    public key: string;
}

export class ResourceListBlockRelation {
    constructor(resourceOfBlock: string) {
        this.Type = 'NgComponent';
        this.SubType = 'NG14';
        this.RelationName = 'PageBlock';
        this.AddonRelativeURL = 'file_0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3';
        this.AddonUUID = '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3';

        switch (resourceOfBlock) {
            case 'DataViewerBlock':
                this.ModuleName = 'BlockModule';
                this.ComponentName = 'BlockComponent';
                this.Name = 'DataViewerBlock';
                break;

            case 'DataConfigurationBlock':
                this.ModuleName = 'DataConfigurationBlockModule';
                this.ComponentName = 'DataConfigurationBlockComponent';
                this.Name = 'DataConfigurationBlock';
                break;

            default:
                this.ModuleName = '';
                this.ComponentName = '';
                this.Name = '';
                break;
        }
    }

    public Type: string;
    public SubType: string;
    public ModuleName: string;
    public RelationName: string;
    public ComponentName: string;
    public AddonRelativeURL: string;
    public AddonUUID: string;
    public Name: string;
}

export class ResourceListLayout {
    constructor(listOfSectionsKeyBlocklist: { sectionKey: string; listOfBlockKeys: string[] }[]) {
        listOfSectionsKeyBlocklist.forEach((sectionKeyBlocklist) => {
            this.Sections.push(
                new ResourceListLayoutSection(sectionKeyBlocklist.sectionKey, sectionKeyBlocklist.listOfBlockKeys),
            );
        });
    }
    public ColumnsGap = 'md';
    public SectionsGap = 'md';
    public HorizontalSpacing = 'md';
    public Sections: ResourceListLayoutSection[] = [];
    public VerticalSpacing = 'md';
    public MaxWidth = 0;
}

export class ResourceListLayoutSection {
    constructor(sectionKey: string, blockKeysList: string[]) {
        this.Key = sectionKey;
        blockKeysList.forEach((blockKey) => {
            this.Columns.push(new ResourceListLayoutSectionColumn(blockKey));
        });
    }
    public Hide = [];
    public Columns: ResourceListLayoutSectionColumn[] = [];
    public Key: string;
}

export class ResourceListLayoutSectionColumn {
    constructor(blockKey: string) {
        this.BlockContainer = new BlockID(blockKey);
    }
    public BlockContainer: BlockID;
}

export class BlockID {
    constructor(blockKey: string) {
        this.BlockKey = blockKey;
    }
    public BlockKey: string;
}
