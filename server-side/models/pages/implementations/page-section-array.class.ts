import { PageSection } from '@pepperi-addons/papi-sdk';
import { PageSectionClass } from '../index';

export class PageSectionClassArray extends Array<PageSectionClass> {
    constructor(sections?: Array<PageSectionClass>) {
        super(...(sections || []));
    }

    static fromPageSections(pageSections?: Array<PageSection>) {
        const sections: Array<PageSectionClass> = [];
        pageSections?.forEach((_pageSection) => sections.push(PageSectionClass.fromPageSection(_pageSection)));
        return new PageSectionClassArray(sections);
    }

    private validateNotEmpty() {
        if (this.length <= 0) {
            throw new Error('AutomationSections array is empty');
        }
    }

    /**
     * Appends a section to the end of the AutomationSection array. Returns the added section in the array.
     * @param section to add to the array.
     */
    add(section: PageSection | PageSectionClass): PageSectionClass {
        let sectionIndex: number;
        if (section instanceof PageSectionClass) {
            sectionIndex = this.push(section) - 1;
        } else {
            sectionIndex = this.push(PageSectionClass.fromPageSection(section)) - 1;
        }
        return this[sectionIndex];
    }

    /**
     * Appends multiple sections to the end of the AutomationSection array.
     * @param sections elements to add to the array.
     */
    addMany(...sections: Array<PageSection | PageSectionClass>): void {
        sections.forEach((_section) => this.add(_section));
    }

    /**
     * Removes elements from the array.
     * @param sections elements to remove from the array.
     */
    remove(...sections: PageSection[]): void {
        this.validateNotEmpty();
        sections.forEach((_automationSection) => {
            const index = this.findIndex((_section) => JSON.stringify(_section) === JSON.stringify(_automationSection));
            this.removeByIndex(index);
        });
    }

    /**
     * Attempts to remove an element from the array. Returns true if removed successfully.
     * @param section AutomationSection element to remove from the array.
     */
    tryRemove(section: PageSection): boolean {
        try {
            this.remove(section);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Removes an element by index from the array. Returns the removed element.
     * @param index position of the element in the array to remove.
     */
    removeByIndex(index: number): PageSectionClass {
        if (!this?.[index]) {
            throw new Error(`Index '${index}' does not exist in the array`);
        }
        const deletedBlock: PageSectionClass = this.splice(index, 1)[0];
        return deletedBlock;
    }

    findByKey(key: string): PageSectionClass | undefined {
        return this.find((section) => section?.Key === key);
    }

    findByBlockKey(blockKey: string): PageSectionClass | undefined {
        return this.find((_section) =>
            _section.Columns.find((_column) => _column.BlockContainer?.BlockKey === blockKey),
        );
    }

    findBySection(section: PageSection): PageSectionClass | undefined {
        return this.find((_section) => JSON.stringify(_section) === JSON.stringify(section));
    }
}
