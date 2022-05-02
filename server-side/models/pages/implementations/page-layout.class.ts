import { PageLayout, PageSizeType } from '@pepperi-addons/papi-sdk';
import { PageSectionClassArray } from '../index';

export class PageLayoutClass implements PageLayout {
    Sections: PageSectionClassArray;
    VerticalSpacing?: PageSizeType;
    HorizontalSpacing?: PageSizeType;
    SectionsGap?: PageSizeType;
    ColumnsGap?: PageSizeType;
    MaxWidth?: number;

    constructor(sections?: PageSectionClassArray) {
        this.Sections = sections ?? new PageSectionClassArray();
    }

    static fromLayout(pageLayout: PageLayout) {
        const autoSections: PageSectionClassArray = PageSectionClassArray.fromPageSections(pageLayout.Sections);
        const autoLayout: PageLayoutClass = new PageLayoutClass(autoSections);
        for (const propName in pageLayout) {
            if (propName !== 'Sections') {
                autoLayout[propName] = pageLayout[propName];
            }
        }
        return autoLayout;
    }
}
