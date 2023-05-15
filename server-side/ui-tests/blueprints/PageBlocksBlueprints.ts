import { v4 as newUuid } from 'uuid';

export interface SelectedView {
    collectionName: string;
    collectionID: string;
    selectedViewUUID: string;
    selectedViewName: string;
    selectedViewTitle?: string;
}

export class BasePage {
    constructor(pageKey: string) {
        this.Blocks = [];
        this.Layout = new BasePageLayout();
        this.Hidden = false;
        this.Key = pageKey;
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
    public Sections: BasePageLayoutSection[];
}

export class BasePageLayoutSection {
    constructor(sectionKey: string, addonsBlocksKeys?: string[]) {
        this.Key = sectionKey;
        this.Columns = [];
        if (addonsBlocksKeys) {
            addonsBlocksKeys.forEach((addonBlockKey) => {
                this.Columns.push(new BasePageLayoutSectionColumn(addonBlockKey));
            });
        } else {
            this.Columns.push({});
        }
    }
    public Key: string;
    public Columns: BasePageLayoutSectionColumn[];
}

export class BasePageLayoutSectionColumn {
    constructor(blockKey?: string) {
        this.BlockContainer = new BlockID(blockKey || newUuid());
    }
    public BlockContainer?: BlockID;
}

export class BlockID {
    constructor(blockKey: string) {
        this.BlockKey = blockKey;
    }
    public BlockKey: string;
}

export class BasePageBlock {
    constructor(addonBlockKey: string) {
        this.Key = addonBlockKey;
        this.Relation = new BaseBlockRelation();
    }
    public Key: string;
    public Relation: BaseBlockRelation;
    public Configuration;
}

export class BaseBlockRelation {
    constructor() {
        this.Type = 'NgComponent';
        this.SubType = 'NG14';
        this.RelationName = 'PageBlock';
        this.AddonRelativeURL = '';
        this.AddonUUID = '';
        this.ModuleName = '';
        this.ComponentName = '';
        this.Name = '';
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

export class BlockModuleRelation extends BaseBlockRelation {
    constructor(addonKey: string, blockRelationName: string) {
        super();
        this.AddonRelativeURL = `file_${addonKey}`;
        this.AddonUUID = addonKey;
        this.ModuleName = 'BlockModule';
        this.ComponentName = 'BlockComponent';
        this.Name = blockRelationName;
    }
}

export class BaseBlockConfiguration {
    constructor(resource: string, addonUUID: string) {
        this.Resource = resource;
        this.AddonUUID = addonUUID;
    }
    public Resource: string;
    public AddonUUID: string;
    public Data;
}

export class AddonBlockModule extends BasePageBlock {
    constructor(blockUUID: string, resourceAddonName: string, addonKey: string) {
        super(blockUUID);
        this.Configuration = new BaseBlockConfiguration(resourceAddonName, addonKey);
        this.Relation = new BlockModuleRelation(addonKey, resourceAddonName);
    }

    public Configuration: BaseBlockConfiguration;
    public Relation: BlockModuleRelation;
}

export class ResourceListBasicViewerEditorBlocksStructurePage {
    constructor(
        pageKey: string,
        blockList: {
            blockKey: string;
            blockResource: string;
            selectedEditor?: { collectionName: string; editorUUID: string };
            selectedViews?: {
                collectionName: string;
                collectionID: string;
                selectedViewUUID: string;
                selectedViewName: string;
            }[];
        }[],
        sectionDataList: { sectionKey: string; blockKeysForSectionColumns: string[] }[],
    ) {
        this.Key = pageKey;
        blockList.forEach((block) => {
            if (block.selectedEditor) {
                this.Blocks.push(
                    new ResourceViewEditorBlock(block.blockKey, block.blockResource, block.selectedEditor),
                );
            }
            if (block.selectedViews) {
                this.Blocks.push(
                    new ResourceViewEditorBlock(block.blockKey, block.blockResource, undefined, block.selectedViews),
                );
            }
        });
        this.Layout = new ResourceListLayout(sectionDataList);
    }
    public Blocks: ResourceViewEditorBlock[] = [];
    public Layout: ResourceListLayout;
    public Hidden = false;
    public Key: string;
    public Name?: string;
    public Description?: string;
}

export class ResourceViewEditorBlock {
    constructor(
        blockKey: string,
        blockResource: string,
        selectedEditor?: { collectionName: string; editorUUID: string },
        selectedViews?: {
            collectionName: string;
            collectionID: string;
            selectedViewUUID: string;
            selectedViewName: string;
        }[],
    ) {
        this.Key = blockKey;
        this.Relation = new ResourceListBlockRelation(blockResource);
        switch (blockResource) {
            case 'DataViewerBlock':
                if (selectedViews) {
                    this.Configuration = new ResourceListBlockConfiguration(blockResource, undefined, selectedViews);
                }
                break;

            case 'DataConfigurationBlock':
                if (selectedEditor) {
                    this.Configuration = new ResourceListBlockConfiguration(blockResource, selectedEditor);
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

export class ResourceListBlockConfiguration extends BaseBlockConfiguration {
    constructor(
        blockResource: 'DataViewerBlock' | 'DataConfigurationBlock',
        selectedEditor?: { collectionName: string; editorUUID: string },
        selectedViews?: {
            collectionName: string;
            collectionID: string;
            selectedViewUUID: string;
            selectedViewName: string;
        }[],
    ) {
        super(blockResource, '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3');

        switch (blockResource) {
            case 'DataViewerBlock':
                if (selectedViews) {
                    this.Data = new ResourceListBlockConfigurationDataView(selectedViews);
                }
                break;

            case 'DataConfigurationBlock':
                if (selectedEditor) {
                    this.Data = new ResourceListBlockConfigurationDataEditor(
                        selectedEditor.editorUUID,
                        selectedEditor.collectionName,
                    );
                }
                break;

            default:
                this.Data = {};
                break;
        }
    }
    public Data: ResourceListBlockConfigurationDataView | ResourceListBlockConfigurationDataEditor | any;
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
    constructor(selectedViews: SelectedView[]) {
        selectedViews.forEach((selectedView) => {
            this.viewsList.push(
                new ResourceListBlockConfigurationDataViewInViewsList(
                    selectedView.collectionName,
                    selectedView.collectionID,
                    selectedView.selectedViewUUID,
                    selectedView.selectedViewName,
                    selectedView.selectedViewTitle,
                ),
            );
        });
    }
    public viewsList: ResourceListBlockConfigurationDataViewInViewsList[] = [];
}

export class ResourceListBlockConfigurationDataViewInViewsList {
    constructor(
        collectionName: string,
        collectionID: string,
        selectedViewUUID: string,
        selectedViewName: string,
        selectedViewTitle?: string,
    ) {
        this.selectedResource = collectionName;
        this.id = collectionID;
        this.title = selectedViewTitle || 'Grid';
        this.views = [];
        this.showContent = true;
        this.selectedView = new ViewID(selectedViewUUID, selectedViewName);
    }

    public selectedResource: string;
    public id: string;
    public title?: string;
    public selectedView: ViewID;
    public views?: ViewID[];
    public showContent: boolean;
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
    constructor(sectionDataList: { sectionKey: string; blockKeysForSectionColumns: string[] }[]) {
        super();
        sectionDataList.forEach((sectionData) => {
            this.Sections.push(
                new ResourceListLayoutSection(sectionData.sectionKey, sectionData.blockKeysForSectionColumns),
            );
        });
    }

    public Sections: ResourceListLayoutSection[] = [];
}

export class ResourceListLayoutSection {
    constructor(sectionKey: string, blockKeysList: string[]) {
        this.Key = sectionKey;
        blockKeysList.forEach((blockKey) => {
            this.Columns.push(new BasePageLayoutSectionColumn(blockKey));
        });
    }
    public Hide = [];
    public Columns: BasePageLayoutSectionColumn[] = [];
    public Key: string;
}

export class ViewerBlock extends AddonBlockModule {
    constructor(
        selectedViews?: {
            collectionName: string;
            collectionID: string;
            selectedViewUUID: string;
            selectedViewName: string;
            selectedViewTitle?: string;
        }[],
    ) {
        const resource = 'DataViewerBlock';
        const addonID = '0e2ae61b-a26a-4c26-81fe-13bdd2e4aaa3';
        super(newUuid(), resource, addonID);
        this.Configuration = new BaseBlockConfiguration(resource, addonID);
        this.Configuration.Data = new ResourceListBlockConfigurationDataView(selectedViews || []);
    }
}

export class VisitFlowBlock extends AddonBlockModule {
    constructor(blockKey: string) {
        const addonName = 'VisitFlow';
        const addonID = '2b462e9e-16b5-4e7a-b1e6-9e2bfb61db7e';
        super(blockKey, addonName, addonID);
        this.Configuration = new BaseBlockConfiguration(addonName, addonID);
        this.Configuration.Data = {
            resourceName: 'VisitFlows',
        };
    }
}

export class VisitFlowPage extends BasePage {
    constructor(pageKey: string, blockKey: string, sectionKey: string, pageName?: string, pageDescription?: string) {
        // const blockUUID = '26755fdd-c5f0-10e6-8612-ab83dc94af0c';
        super(pageKey);
        this.Blocks = [new VisitFlowBlock(blockKey)];
        this.Layout.Sections = [new BasePageLayoutSection(sectionKey, [blockKey])];
        pageName ? (this.Name = pageName) : null;
        pageDescription ? (this.Description = pageDescription) : null;
    }
}
