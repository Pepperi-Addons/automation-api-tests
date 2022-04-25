import { By, Key } from "selenium-webdriver";
import { Page } from "../../pom/Pages/base/Page";
import { Browser } from "../../utilities/browser";
import config from '../../../config';
import { Metric, query, Filter } from "../../pom/addons/Blocks/PageTester/ChartTester.block";


export class AddQueryDialog extends Page {
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public formFields: By = By.css('pep-dialog mat-form-field');
    public inputElements: By = By.css('pep-dialog mat-form-field input');
    public addFilterBtn: By = By.css('[data-qa="Add Filter"]');
    public addQueryBtn: By = By.xpath('//button[contains(text(),"Add")]');

    public async waitUntilLoaded() {
        let inputElemClass = "";
        let tries = 0;
        do {
            this.browser.sleep(1000);
            const inputElem = await this.browser.findElement(this.inputElements);
            inputElemClass = await inputElem.getAttribute("class");
            tries++;
        } while (!inputElemClass.includes("ng-valid") && tries < 20);
        if (!inputElemClass.includes("ng-valid")) {
            throw ("inputs of edit query are not loaded");
        }
    }

    public async setQuery(queryToUse: query, data?: string) {
        await this.setName(queryToUse.Name);
        await this.setResource(queryToUse.Resource);
        await this.setMetric(queryToUse.Metric);
        await this.setFilter(queryToUse.Filter, queryToUse.Metric.Aggregator === "Count");
    }

    private async setName(name: string) {
        await this.browser.click(this.inputElements, 0);
        await this.browser.sendKeys(this.inputElements, name + Key.ENTER, 0);
    }

    private async setResource(resource: "all_activities" | "transaction_lines") {
        await this.browser.click(this.formFields, 1);
        const resSelector: By = By.xpath(`//mat-option[@title="${resource}"]`)
        this.browser.sleep(200);
        await this.browser.click(resSelector);
        this.browser.sleep(200);
    }


    private async setMetric(metric: Metric) {
        await this.browser.click(this.formFields, 3);
        const aggSelector: By = By.xpath(`//mat-option[@title="${metric.Aggregator}"]`);
        this.browser.sleep(200);
        await this.browser.click(aggSelector);
        this.browser.sleep(200);
        if (metric.Aggregator !== "Count") {
            await this.browser.click(this.formFields, 4);
            const aggFieldSelector: By = By.xpath(`//mat-option[@title="${metric.AggregatedField}"]`);
            this.browser.sleep(200);
            await this.browser.click(aggFieldSelector);
            this.browser.sleep(200);
        }
    }

    private async setFilter(filter: Filter, isCount: Boolean) {
        await this.browser.click(this.formFields, isCount ? 9 : 10);
        const accFilterSelector: By = By.xpath(`//mat-option[@title="${filter.AccountFilter}"]`);
        this.browser.sleep(200);
        await this.browser.click(accFilterSelector);
        await this.browser.click(this.formFields, isCount ? 10 : 11);
        const userFilterSelector: By = By.xpath(`//mat-option[@title="${filter.UserFilter}"]`);
        this.browser.sleep(200);
        await this.browser.click(userFilterSelector);

        if (filter.PepFilter) {
            await this.browser.click(this.addFilterBtn);
            await this.browser.click(this.formFields, isCount ? 11 : 12);
            const filterBySelector: By = By.xpath(`//mat-option[@title="${filter.PepFilter.first}"]`);
            this.browser.sleep(200);
            await this.browser.click(filterBySelector);
            await this.browser.click(this.formFields, isCount ? 12 : 13);
            const filterOptSelector: By = By.xpath(`//mat-option[@title="${filter.PepFilter.second}"]`);
            this.browser.sleep(200);
            if(filter.PepFilter.third){
                await this.browser.click(filterOptSelector);
                await this.browser.click(this.inputElements, 4);
                await this.browser.sendKeys(this.inputElements, filter.PepFilter.third, 4);
            }
        }
        await this.browser.click(this.addQueryBtn);
    }
}