export class BasePage {
    constructor() {
        this.Blocks = [];
        this.Layout = new BasePageLayout();
        this.Hidden = false;
        this.Key = "";
    }
    public Layout: BasePageLayout;
    public Hidden: boolean;
    public Key: string;
    public Name?: string;
    public Description?: string;
    public Blocks;
}

export class BasePageLayout {
    constructor() {
        this.Sections = [];
        this.ColumnsGap = 'md';
        this.SectionsGap = 'md';
        this.HorizontalSpacing = 'md';
        this.VerticalSpacing = 'md';
        this.MaxWidth = 0;
    }
    public ColumnsGap: string;
    public SectionsGap: string;
    public HorizontalSpacing: string;
    public VerticalSpacing: string;
    public MaxWidth: number;
    public Sections;
}

export class BasePageBlock {
    constructor() {
        this.Key = "";
        this.Relation = new BaseBlockRelation();
    }
    public Key: string;
    public Relation: BaseBlockRelation;
    public Configuration;
}

export class BaseBlockRelation {
    constructor() {
        this.Type = "NgComponent";
        this.SubType = "NG14";
        this.RelationName = "PageBlock";
        this.AddonRelativeURL = "";
        this.AddonUUID = "";
        this.ModuleName = "";
        this.ComponentName = "";
        this.Name = "";
    }
    public Type: string;
    public SubType: string;
    public RelationName: string;
    public AddonRelativeURL: string;
    public AddonUUID: string;
    public ModuleName: string;
    public ComponentName: string;
    public Name: string;
}

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
        selectedView?: { selectedViewUUID: string; selectedViewName: string },
    ) {
        this.Key = blockKey;
        this.Relation = new ResourceListBlockRelation(blockResource);
        switch (blockResource) {
            case 'DataViewerBlock':
                if (selectedView) {
                    this.Configuration = new ResourceListBlockConfiguration(
                        blockResource,
                        collectionName,
                        '',
                        selectedView,
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

export class ResourceListBlockRelation extends BaseBlockRelation {
    constructor(resourceOfBlock: string) {
        super();
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
}

export class ResourceListLayout extends BasePageLayout {
    constructor(listOfSectionsKeyBlocklist: { sectionKey: string; listOfBlockKeys: string[] }[]) {
        super();
        listOfSectionsKeyBlocklist.forEach((sectionKeyBlocklist) => {
            this.Sections.push(
                new ResourceListLayoutSection(sectionKeyBlocklist.sectionKey, sectionKeyBlocklist.listOfBlockKeys),
            );
        });
    }

    public Sections: ResourceListLayoutSection[] = [];
}

export class ResourceListLayoutSection {
    constructor(sectionKey: string, blockKeysList: string[]) {
        this.Key = sectionKey;
        blockKeysList.forEach((blockKey) => {
            this.Columns.push(new PageLayoutSectionColumn(blockKey));
        });
    }
    public Hide = [];
    public Columns: PageLayoutSectionColumn[] = [];
    public Key: string;
}

export class PageLayoutSectionColumn {
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

export class VisitFlowBlock {
    public Configuration: VisitFlowBlockConfiguration = new VisitFlowBlockConfiguration();
    public Key: string = "aed9174b-9c01-6fba-982f-67a19e80e124";
    public Relation: VisitFlowBlockRelation = new VisitFlowBlockRelation();
}

export class VisitFlowBlockConfiguration {
    public Resource: string = "VisitFlow";
    public Data: VisitFlowBlockConfigurationData = new VisitFlowBlockConfigurationData();
}

export class VisitFlowBlockConfigurationData {
    public resourceName: string = "VisitFlows";
}

export class VisitFlowBlockRelation extends BaseBlockRelation {
    constructor() {
        super();
        this.AddonRelativeURL = "file_2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e";
        this.AddonUUID = "2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e";
        this.ModuleName = "BlockModule";
        this.ComponentName = "BlockComponent";
        this.Name = "VisitFlow";
    }
}

export class VisitFlowBlockColumn {
    public BlockContainer = {
        BlockKey: "aed9174b-9c01-6fba-982f-67a19e80e124"
    }
}

export class VisitFlowBlockStructurePage extends BasePage {
    constructor(pageKey:string, pageName? : string, pageDescription? : string) {
        super();
        this.Key = pageKey;
        pageName? this.Name = pageName : null;
        pageDescription ? this.Description = pageDescription : null; 
    }
}