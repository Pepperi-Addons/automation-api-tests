import { PageLayout } from '@pepperi-addons/papi-sdk';
import { PageSectionClassArray } from './page-section-array.class';

export class PageLayoutClass implements PageLayout {
    Sections: PageSectionClassArray;
    VerticalSpacing?: 'sm' | 'md' | 'lg' | undefined;
    HorizontalSpacing?: 'sm' | 'md' | 'lg' | undefined;
    SectionsGap?: 'sm' | 'md' | 'lg' | undefined;
    ColumnsGap?: 'sm' | 'md' | 'lg' | undefined;
    MaxWidth?: number | undefined;

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
