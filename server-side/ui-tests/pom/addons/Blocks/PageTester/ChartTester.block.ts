import { By } from 'selenium-webdriver';
import { AddQueryDialog } from '../../../../tests/Blocks/AddQueryDialog';
import { Browser } from '../../../../utilities/browser';
import { PageEditor } from '../../PageBuilder/PageEditor';
import { PageTesterBlockName } from './PageTesterBlockName.enum';
import { PageTesterSectionBlock } from './PageTesterSectionBlock.block';
import addContext from 'mochawesome/addContext';


export class ChartTester extends PageTesterSectionBlock {
    constructor(blockId: string, browser: Browser) {
        super(PageTesterBlockName.ChartsTester, blockId, browser);
    }
    public readonly titleCheckBox = By.xpath('//mat-checkbox[contains(@title,"Title")]//input');
    public readonly titleCheckBoxToClick = By.xpath('//mat-checkbox[contains(@title,"Title")]//span');
    public readonly titleInput = By.xpath('//pep-textbox//mat-form-field//div//input');
    public readonly titleCompo = By.css('.pep-border-bottom > label');
    public readonly addQueryBtn: By = By.xpath('//span[contains(text(),"Add")]');
    public readonly insideChartTitle: By = By.css('.apexcharts-svg > g > g > g > text > title');
    public readonly queryValueElement: By = By.css('g > g > path');

    public async setTitle(pageEditor: PageEditor, titleName: string) {
        const titleCheckBoxElem = await this.browser.findElement(this.titleCheckBox);
        const isChekboxChecked: Boolean = (await titleCheckBoxElem.getAttribute('aria-checked')).toLowerCase() === 'true';
        if (!isChekboxChecked) {
            await this.browser.click(this.titleCheckBoxToClick);
        }
        await this.browser.click(this.titleInput);
        await this.browser.sendKeys(this.titleInput, titleName);
        pageEditor.savePage();
    }

    public async isTitlePresented() {
        let titleElement;
        try {
            titleElement = await this.browser.findElement(this.titleCompo, 500);
        } catch (e) {
            return false;
        }
        return await titleElement.getText() === null;
    }

    public async untilIsVisible(selector: By, waitUntil = 15000): Promise<boolean> {
        return await this.browser.untilIsVisible(selector, waitUntil);
    }

    public async getTitle() {
        const titleText = await (await this.browser.findElement(this.titleCompo)).getText();
        return titleText;
    }

    public async loadBlock(pageEditor: PageEditor) {
        await this.editBlock();
        await pageEditor.goBack();
    }

    public async addQuery(queryToUse: query) {
        await this.browser.click(this.addQueryBtn);
        const queryDialog = new AddQueryDialog(this.browser);
        await queryDialog.waitUntilLoaded();
        await queryDialog.setQuery(queryToUse);
    }

    public async getDataPresentedInBlock(that: any) {
        this.browser.sleep(5000);
        const valueElem = await this.browser.findElement(this.queryValueElement);
        const valueData = await valueElem.getAttribute("val");
        const base64Image = await this.browser.saveScreenshots();
        addContext(that, {
            title: `data presented inside the chart`,
            value: 'data:image/png;base64,' + base64Image,
        });

        return valueData;
    }

    // public readonly BlockContainer = By.css(`static-tester[block-id='${this.blockId}']`);

    // public readonly TestText = By.css(`${this.BlockContainer.value} #testText textarea`);

    // public readonly BlockLoadBtn = By.css(`${this.BlockContainer.value} #blockLoadBtn`);

    // public readonly ApiCallBtn = By.css(`${this.BlockContainer.value} #apiCallBtn`);

    // public async getTestText(): Promise<string | null> {
    //     return await this.browser.getElementAttribute(this.TestText, 'title');
    // }

    // public async clickBlockLoadBtn(): Promise<void> {
    //     return await this.browser.click(this.BlockLoadBtn);
    // }

    // public async clickApiCallBtn(): Promise<void> {
    //     return await this.browser.click(this.ApiCallBtn);
    // }
}

//should be taken from SDK
export interface query {
    Name: string;
    Resource: "all_activities" | "transaction_lines";
    Metric: Metric;
    Filter: Filter;

}

export interface Metric {
    Aggregator: "Sum" | "Count" | "Average" | "Script" | "Count Distinct";
    AggregatedField?: string;
}

export interface Filter {
    AccountFilter: "All accounts" | "Accounts assigned to current user";
    UserFilter: "All users" | "Current user";
    PepFilter?: PepFilter;
}

interface PepFilter {
    first: any;
    second: any;
    third?: any;
}