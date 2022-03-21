import { Browser } from '../../../utilities/browser';
import { PepListTable } from '../../GenericList/PepListTable';
import { TableObjectData } from '../../../model/TableObjectData';
import { AddonPage } from '../base/AddonPage';
import { PageEditor } from './PageEditor';
import { PageListHeaders } from './PageListColumnHeaders';

// export type PageRowData = TableObjectData & {[headerId in PageListColumnHeaders]: string | null | undefined}

export type PageRowData = TableObjectData<PageListHeaders, string | null | undefined>; // & {[headerId in PageListColumnHeaders]: string | null | undefined}

export class PagesList extends AddonPage {
    private pagesList: PepListTable;

    constructor(browser: Browser) {
        super(browser);
        this.pagesList = new PepListTable(this.browser);
    }

    /**
     * Extracts the currently loaded rows data.
     * @param headerIds An optional list of header IDs to retrieve the values of. if not supplied, finds all header ids in {@link PageListColumnHeaders} to populate the table with.
     * @returns An array of {@link PageRowData}
     */
    public async getLoadedPagesList(headerIds?: PageListHeaders[]): Promise<PageRowData[]> {
        // return this.pagesList.getLoadedTableData(headerIds).then(tableData => {
        //     const pageTableData: PageRowData[] = [];
        //     tableData.forEach((pageRow, index) => {
        //         const propNames: Set<string> = new Set<string>(Object.keys(PageListColumnHeaders));
        //         for(const prop in pageRow){
        //             propNames.add(prop);
        //         }
        //         propNames.forEach(prop => pageTableData[index][prop] = pageRow[prop]);
        //     });
        //     return pageTableData;
        // });
        //TODO: 'as PageRowData[]' may not be sufficient, need to test.
        return this.pagesList.getLoadedTableData(headerIds).then((tableData) => tableData as PageRowData[]);
    }

    /**
     * Enters a page's editor by clicking its link in the list.
     * @param pageName The page's name.
     * @returns A new instance of {@link PageEditor}.
     */
    public async editPage(pageName: string): Promise<PageEditor> {
        return this.pagesList.enterRowLinkByValue(pageName, 'Name').then(() => new PageEditor(this.browser));
    }
}
