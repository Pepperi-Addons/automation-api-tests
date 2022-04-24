import { Browser } from '../../../utilities/browser';
import { PepListTable } from '../../Components/GenericList/PepListTable';
import { TableObjectData } from '../../../model/TableObjectData';
import { AddonPage } from '../base/AddonPage';
import { PageEditor } from './PageEditor';
import { PageListHeaders } from './PageListColumnHeaders';
import { PepSearch } from '../../Components/PepSearch';
import { By } from 'selenium-webdriver';
import { WebAppPage } from '../../Pages/base/WebAppPage';

export type PageRowData = TableObjectData<PageListHeaders, string | null | undefined>;

export class PagesList extends AddonPage {
    private pagesList: PepListTable;
    private search: PepSearch;
    constructor(browser: Browser) {
        super(browser);
        this.pagesList = new PepListTable(this.browser);
        this.search = new PepSearch(this.browser);
        this.search.setParentContainer(By.xpath('//pep-page-layout//pep-generic-list'));
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
        await this.pagesList.enterRowLinkByValue(pageName, 'Name');
        return new PageEditor(this.browser);
    }

    public async searchAndEditPage(pageName: string): Promise<PageEditor> {
        await this.search.performSearch(pageName);
        await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
        return this.editPage(pageName);
    }
}
