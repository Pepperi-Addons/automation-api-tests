import {
    DataViewScreenSize,
    PageBlockContainer,
    PageSection,
    PageSectionColumn,
    SplitType,
} from '@pepperi-addons/papi-sdk';

export class PageSectionClass implements PageSection {
    Key: string;
    Name?: string;
    Height?: number;
    Columns: PageSectionColumn[] = [{}];
    Split?: SplitType;
    Hide?: DataViewScreenSize[];

    /**
     * Initializes a new AutomationSection instance
     * @param sections elements to add to the array.
     */
    constructor(key: string, split?: SplitType) {
        this.Key = key;
        this.changeSplit(split);
    }

    /**
     * Initializes a new AutomationSection instance from a PageSection object
     * @param sections elements to add to the array.
     */
    static fromPageSection(pageSection: PageSection): PageSectionClass {
        const automationSection: PageSectionClass = new PageSectionClass(pageSection.Key, pageSection.Split);
        for (const propName in pageSection) {
            if (propName !== 'Split' && propName !== 'Columns') {
                automationSection[propName] = pageSection[propName];
            }
        }
        return automationSection;
    }

    /**
     * Adds a PageBlock reference to the section in the provided column. Returns the modified PageSectionColumn.
     * @param blockKey PageBlock key to reference.
     * @param column The column in which to display the block. Left-most position is 0.
     * @param hide Hides this block when on specific views.
     */
    addBlock(blockKey: string, column = 0, hide?: DataViewScreenSize[]): PageSectionColumn {
        const blockContainer: PageBlockContainer = hide
            ? {
                  BlockKey: blockKey,
                  Hide: hide,
              }
            : { BlockKey: blockKey };

        this.Columns[column] = { BlockContainer: blockContainer };
        return this.Columns[column];
    }

    /**
     * Removes a PageSectionColumn based on its container's BlockKey from the section. If successful returns the deleted element, otherwise undefined.
     * @param blockKey PageBlock key to reference.
     */
    removeBlock(blockKey: string): PageSectionColumn {
        const columns: PageSectionColumn[] = this.Columns.filter(
            (column) => column?.BlockContainer?.BlockKey === blockKey,
        );
        if (columns.length > 1) {
            throw new Error(`BlockKey '${blockKey}' found in multiple columns`);
        }
        const columnIndex: number = this.Columns.findIndex((column) => column?.BlockContainer?.BlockKey === blockKey);
        return this.Columns.splice(columnIndex, 1, {})[0];
    }

    /**
     * Change a section's 'Split' property, adjusting the number of Columns accordingly.
     * @param split SplitType options for the section, undefined for a single column.
     */
    changeSplit(split: SplitType | undefined) {
        this.Split = split;
        this.changeColumnsBySplit(this.Split);
    }

    private changeColumnsBySplit(split?: SplitType | undefined) {
        const columns: PageSectionColumn[] = [];
        const columnNumber: number = split?.split('/')?.length ?? 1;
        if (columnNumber <= 0) {
            throw new Error('Number of columns cannot be lesser than or equal to zero');
        }
        for (let i = 0; i < columnNumber - 1; i++) {
            const sectionColumn: PageSectionColumn = this.Columns[i] ? this.Columns[i] : {};
            columns.push(sectionColumn);
        }
        this.Columns = columns;
    }
}
