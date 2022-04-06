import { By } from 'selenium-webdriver';
import { Browser } from '../../../utilities/browser';
import { Page } from '../../base/Page';
import { TableObjectData } from '../../../model/TableObjectData';
import config from '../../../../config';
import { WebAppPage } from '../../base/WebAppPage';

export type TableRowData = TableObjectData<string, string | null>;
//TODO: Create abstract class 'PepList' and have 'PepListTable' inherit it.
export class PepListTable extends Page {
    
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    /**
     * Readonly locator for list's parent container.
     */
    public static readonly ListContainer: By = By.css('pep-list');

    /**
     * Readonly locator for all headers in table.
     */
    public static readonly Headers: By = By.css(
        `${PepListTable.ListContainer.value} fieldset.table-header-fieldset > fieldset label`,
    );

    /**
     * Gets a header element locator by id.
     * @param headerId The header's specific id.
     * @returns The header element's locator.
     */
    public static getHeader(headerId: string): By {
        return By.css(PepListTable.Headers.value + '#' + headerId);
    }

    /**
     * Readonly locator for all loaded rows in table.
     */
    public static readonly Rows: By = By.css(
        `${PepListTable.ListContainer.value} > virtual-scroller.table-body div.table-row`,
    );

    /**
     * Gets a cell element locator by its row index and header id.
     * @param rowIndex The row's index relative to the currently loaded rows.
     * @param headerId The cell's specific header id.
     * @returns The cell element's locator.
     */
    public static getRowCell(rowIndex: number, headerId: string): By {
        return By.css(`${PepListTable.Rows.value}:nth-child(${rowIndex}) #${headerId}`);
    }

    /**
     * Gets a cell element locator by value.
     * @param cellValue Value of the element's 'title' attribute.
     * @param headerId An optional parameter to limit the cell value's header id.
     * @returns The cell element's locator.
     */
    public static getRowCellByValue(cellValue: string, headerId?: string): By {
        return headerId
            ? By.css(`${PepListTable.Rows.value} #${headerId}[title='${cellValue}']`)
            : By.css(`${PepListTable.Rows.value} [title='${cellValue}']`);
    }

    /**
     * Gets the number of all displayed headers.
     * @returns The count of displayed headers.
     */
    public async displayedHeadersCount(): Promise<number> {
        const headerElements = await this.browser.findElements(PepListTable.Headers);
        return headerElements.filter(async (element) => await element.isDisplayed()).length;
    }

    /**
     * Gets the number of all displayed rows.
     * @returns The count of displayed rows.
     */
    public async displayedRowsCount(): Promise<number> {
        const rowElements = await this.browser.findElements(PepListTable.Rows);
        return rowElements.filter(async (element) => await element.isDisplayed()).length;
    }

    /**
     * Gets a list of all non-empty header ids in the table list.
     */
    public async getHeaderIds(): Promise<string[]> {
        const numOfHeaders: number = await this.displayedHeadersCount();
        const headerIds: string[] = [];
        for (let headerIndex = 0; headerIndex < numOfHeaders; headerIndex++) {
            const id = await this.browser.getElementAttribute(
                By.css(`${PepListTable.Headers.value}[${headerIndex}]`),
                'id',
            );
            if (id && id !== '') {
                headerIds.push(id);
            }
        }
        return headerIds;
    }

    /**
     * Gets the currently loaded row's data.
     * @param rowIndex The row's index relative to the currently loaded rows.
     * @param headerIds An optional list of header ids to retrieve values for. If not supplied, retrieves values for all found header ids (see {@link getHeaderIds}).
     * @returns A {@link TableObjectData} object of header ids as keys.
     */
    public async getRowData(rowIndex: number, headerIds?: string[]): Promise<TableRowData> {
        headerIds = headerIds ?? (await this.getHeaderIds());
        const rowData: TableRowData = {};
        headerIds.forEach(
            async (headerId) =>
                await this.browser
                    .getElementAttribute(PepListTable.getRowCell(rowIndex, headerId), 'title')
                    .then((cellValue) => (rowData[headerId] = cellValue)),
        );
        return rowData;
    }

    /**
     * Gets the currently loaded rows' data.
     * @param headerIds The required header IDs of the TableRowData if supplied, otherwise finds all header IDs to populate the table with.
     * @returns A {@link TableObjectData} array
     */
    public async getLoadedTableData(headerIds?: string[]): Promise<TableRowData[]> {
        const displayedRows: number = await this.displayedRowsCount();
        const promises: Promise<TableRowData>[] = [];
        const tableData: Array<TableRowData> = [];
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
            //Check if it gets a snapshot of rowIndex within the 'then' or if it takes the current value when promise is resolved.
            promises[rowIndex] = this.getRowData(rowIndex, headerIds).then(
                (rowData) => (tableData[rowIndex] = rowData),
            );
        }
        Promise.all(promises);
        return tableData;
    }

    /**
     * Enters a row's editor by clicking its link in the list.
     * @param cellValue The displayed text value.
     * @param headerId An optional parameter to limit the clicking to a specific header id.
     */
    public async enterRowLinkByValue(cellValue: string, headerId?: string): Promise<void> {
        await this.browser.click(PepListTable.getRowCellByValue(cellValue, headerId));
        await this.browser.waitForLoading(WebAppPage.LoadingSpinner);
        return;
    }

    //TODO: Method to extract the complete table data, not just the currently loaded one.
    // public async getTableData(headerIds?: string[]) : Promise<Set<TableRowData>>
}
