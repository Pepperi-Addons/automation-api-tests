import { Browser } from '../../../utilities/browser';
import { Page } from '../../Pages/base/Page';
import config from '../../../../config';
import { By, WebElement, Key } from 'selenium-webdriver';
import { WebAppHeader } from '../../WebAppHeader';
import { WebAppHomePage, WebAppList, WebAppSettingsSidePanel } from '../../index';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { OrderPageItem } from '../../Pages/OrderPage';
import { ConsoleColors } from '../../../../services/general.service';
import { PepperiStatus } from '../../Enumerations/PepperiStatus';

chai.use(promised);

export enum AddonLoadCondition {
    Footer,
    Content,
}

export class AddonPage extends Page {
    public Header: WebAppHeader;
    constructor(protected browser: Browser) {
        super(browser, `${config.baseUrl}`);
        this.Header = new WebAppHeader(browser);
    }

    public AddonContainerTopButton: By = By.css('.addon-page-container button');
    public AddonContainerTitle: By = By.css('.addon-page-container [title]');
    public AddonContainerTabs: By = By.css('.pep-main-area [role="tablist"] [role="tab"]');
    public AddonContainerTablistXpath: By = By.xpath(
        './/div[@class="pep-main-area"] //div[@role="tablist"] //div[@role="tab"]',
    );
    public AddonContainerTabsContent: By = By.css('#addNewOrderTypesCont');
    public AddonContainerIframe: By = By.css('iframe#myFrame');
    public AddonContainerHiddenTabs: By = By.css('.ui-tabs-hide');
    public AddonContainerFooterDisplay: By = By.css('#FotterCont[style="display: block;"]');
    public AddonContainerContentDisplay: By = By.css('#content [style*="display: block"]');

    public AddonContainerActionsRadioBtn: By = By.xpath('//div[contains(@class,"choose")] //input[@type="radio"]');
    public AddonContainerEditorTrashBtn: By = By.xpath(
        `//div[@class="lb-title "][contains(@title,"ATD_PLACE_HOLDER")]/../*[contains(@class, 'trashCanIcon')]`,
    );
    public MatOptionDropBox: By = By.xpath(`//span[@class='mat-option-text' and text()='|textToFill|']`);

    public AddonContainerEditAdmin: By = By.css('span[title="Admin"]+.editPenIcon');
    public AddonContainerEditorSave: By = By.css('.save');

    //Catalog Section Locators
    public EditCatalogBtn: By = By.css('.editPenIcon');
    public ItemsTitleBtn: By = By.xpath("//li[@title='Items']");
    public CategoryExpender: By = By.xpath("//span[@class='dynatree-expander']");
    public CategoryListItem: By = By.xpath(
        "//ul//li[@class='dynatree-lastsib']//ul//li//span//a[text()='|textToFill|']/preceding-sibling::span[@class='dynatree-checkbox']",
    );
    public CategoryListItemCheckBox: By = By.xpath("//a[text()='|textToFill|']/..");
    public CategoryListOKBtn: By = By.xpath("//div[contains(text(),'OK')]");

    //cart page --->>> may have to be moved
    public WholeOrderPrice: By = By.xpath("//span[@id='GrandTotal']");
    public ItemQtyBtItemCode: By = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//pep-quantity-selector//input",
    );
    public TotalUnitPrice: By = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//span[@id='TotalUnitsPriceAfterDiscount']",
    );
    public OrderDeatilsMenu: By = By.css("[data-qa='firstMenu']");
    public SubmitOrderCartBtn: By = By.css("[data-qa='Submit']");
    public OrderDetailsBtn: By = By.xpath("//span[text()=' Order Details ']");
    public IdElementOfOrder: By = By.xpath("//input[@name='WrntyID']");

    //views page
    public RepViewEditIcon: By = By.xpath("//span[contains(@class,'editPenIcon')]");

    //UI control page
    public SaveUIControlBtn: By = By.xpath("//div[contains(@class,'save') and text()='Save']");
    public TrashIconListOfAllUIElements: By = By.xpath("//span[contains(@class,'lb-close trashCanIcon')]");
    public TextSearchBox: By = By.xpath("//input[@id='txtSearchBankFields']");

    //custom field adding page
    public FieldAddingTitle: By = By.xpath("//h3[text()='Add Custom Field']");
    public CalculatedFieldCheckBox: By = By.xpath("//input[@value='CalculatedField']");
    public TextInputElements: By = By.xpath("//input[@type='text' and @class='field textbox long roundCorner']");
    public EditScriptBtn: By = By.xpath("//a[@name='edit']");
    public SaveFieldBtn: By = By.xpath("//div[@name='save']");
    public FeildTypeButton: By = By.xpath("//h3[@title='|textToFill|']//..");

    //script adding page
    public ScriptEditingTitle: By = By.xpath("//span[contains(text(),'Available Fields')]");
    public AvailibaleFieldsBtn: By = By.xpath(
        "//button[@class='fr md-primary md-fab md-mini default-color md-button md-ink-ripple']",
    );
    public ScriptParamSpan: By = By.xpath("//span[text()='|textToFill|']/../..");
    public SubmitScriptBtn: By = By.xpath("//div[@class='save allButtons grnbtn roundCorner  fl ng-binding']");
    public ItemFieldsSection: By = By.xpath("(//div[@class='dc-header' and text()='Item Fields'])[2]");
    public ScriptParamCheckBox: By = By.xpath("(//td[@title='|textToFill|'])[2]/preceding-sibling::td");
    public SaveParamBtn: By = By.xpath("//div[text()='Save' and @tabindex=0]");
    public FirstLineInCodeInput: By = By.css('.CodeMirror  .CodeMirror-code > pre');
    public CodeInputSection: By = By.css('.CodeMirror  > div:nth-child(1) > textarea');

    //TODO:activitys page --> has to be moved
    public OrderIdTextElement: By = By.xpath(`//span[@id='Type' and text()='|textToFill|']/../../div//a//span`);

    public async selectTabByText(tabText: string): Promise<void> {
        const selectedTab = Object.assign({}, this.AddonContainerTablistXpath);
        selectedTab['value'] += ` [contains(., '${tabText}')]`;
        await this.browser.click(selectedTab);
        return;
    }

    public async isEditorTabVisible(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerTabsContent);
        selectedTab['value'] += ` #${tabID}`;
        return await this.browser.untilIsVisible(selectedTab, waitUntil);
    }

    public async isEditorHiddenTabExist(tabID: string, waitUntil = 15000): Promise<boolean> {
        const selectedTab = Object.assign({}, this.AddonContainerHiddenTabs);
        selectedTab['value'] += `#${tabID}`;
        const hiddenEl = await this.browser.findElement(selectedTab, waitUntil, false);
        if (hiddenEl instanceof WebElement) {
            return true;
        }
        return false;
    }

    public async isAddonFullyLoaded(addonLoadCondition: AddonLoadCondition): Promise<boolean> {
        if (addonLoadCondition == AddonLoadCondition.Footer) {
            this.browser.sleep(2500);
            await this.browser.untilIsVisible(this.AddonContainerFooterDisplay, 65000);
        } else {
            this.browser.sleep(2500);
            await this.browser.untilIsVisible(this.AddonContainerContentDisplay, 65000);
        }
        console.log('%cValidate Addon Loaded', ConsoleColors.PageMessage);
        let bodySize = 0;
        let loadingCounter = 0;
        do {
            let htmlBody = await this.browser.findElement(this.HtmlBody);
            bodySize = (await htmlBody.getAttribute('innerHTML')).length;
            this.browser.sleep(1000 + loadingCounter);
            htmlBody = await this.browser.findElement(this.HtmlBody);
            if ((await htmlBody.getAttribute('innerHTML')).length == bodySize) {
                bodySize = -1;
            } else {
                loadingCounter++;
            }
        } while (bodySize != -1);
        return true;
    }

    public async selectDropBoxByOption(locator: By, option: PepperiStatus): Promise<void> {
        const selectedBox = Object.assign({}, locator);
        selectedBox['value'] += ` option[value='${option}']`;
        await this.browser.click(selectedBox);
        return;
    }

    public async selectDropBoxByString(locator: By, option: string, index?: number): Promise<void> {
        await this.browser.sleep(3000);
        if (index !== undefined) {
            await this.browser.click(locator, index);
        } else {
            await this.browser.click(locator);
        }
        await this.browser.sleep(3000);
        const matOptionWithStringInjected: string = this.MatOptionDropBox.valueOf()
            ['value'].slice()
            .replace('|textToFill|', option);
        await this.browser.click(By.xpath(matOptionWithStringInjected));
        await this.browser.sleep(3000);
        return;
    }

    /**
     *
     * @param itemKesyUomItems list of all item keys you want included in the catalog
     * @param itemKeyNonUomItems
     */
    public async selectCatalogItemsByCategory(...itemKesyUomItems: string[]): Promise<void> {
        //keep for now
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Settings);
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Catalogs');
        await this.browser.click(webAppSettingsSidePanel.CatalogsSection);
        await this.isSpinnerDone();
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Content);
        await this.browser.click(this.EditCatalogBtn);
        await this.browser.click(this.ItemsTitleBtn);
        await this.browser.click(this.CategoryExpender);
        for (let i = 0; i < itemKesyUomItems.length; i++) {
            const itemCheckBox: string = this.CategoryListItemCheckBox.valueOf()
                ['value'].slice()
                .replace('|textToFill|', itemKesyUomItems[i]);
            const itemCheckBoxElement = await this.browser.findElement(By.xpath(itemCheckBox));
            const checkBoxClassAtt = await itemCheckBoxElement.getAttribute('class');
            if (!checkBoxClassAtt.includes('selected')) {
                await this.browser.click(By.xpath(itemCheckBox));
            }
        }
        await this.browser.click(this.CategoryListOKBtn);
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
    }

    //UI view configuration functions
    public async deleteAllFieldFromUIControl(): Promise<void> {
        const deleteBtnsList = await this.browser.findElements(this.TrashIconListOfAllUIElements);
        for (let i = 0; i < deleteBtnsList.length; i++) {
            await this.browser.click(this.TrashIconListOfAllUIElements);
            this.browser.sleep(1000);
        }
    }

    public async setFieldsInUIControl(...nameToSearch: string[]): Promise<void> {
        for (let i = 0; i < nameToSearch.length; i++) {
            await this.browser.sendKeys(this.TextSearchBox, nameToSearch[i] + Key.ENTER);
            this.browser.sleep(1500);
        }
    }

    /**
     * checking all items in order page
     * @returns the id of the order submitted as string
     */
    public async testCartItems(wholePageExpectedPrice: string, ...itemsToValidate: OrderPageItem[]): Promise<void> {
        expect(await (await this.browser.findElement(this.WholeOrderPrice)).getAttribute('title')).to.equal(
            wholePageExpectedPrice,
        );
        for (let i = 0; i < itemsToValidate.length; i++) {
            expect(await (await this.browser.findElement(itemsToValidate[i].qty)).getAttribute('title')).to.equal(
                itemsToValidate[i].expectedQty,
            );
            expect(
                await (await this.browser.findElement(itemsToValidate[i].totalUnitPrice)).getAttribute('title'),
            ).to.equal(itemsToValidate[i].expectedUnitPrice);
        }
    }

    public async getLastOrderIdFromActivitiesByATDName(nameOfATD: string): Promise<string> {
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.clickOnBtn('Activities');
        await this.browser.sleep(1500);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        await webAppList.validateListRowElements();
        const xpathQueryForATDId: string = this.OrderIdTextElement.valueOf()
            ['value'].slice()
            .replace('|textToFill|', nameOfATD);
        const orderId: string = (await (await this.browser.findElement(By.xpath(xpathQueryForATDId))).getText()).trim();
        const webAppHome = new WebAppHomePage(this.browser);
        await webAppHome.returnToHomePage();
        return orderId;
    }

    public async submitOrder(): Promise<void> {
        await this.browser.sleep(1000);
        await this.browser.click(this.SubmitOrderCartBtn);
        await this.isSpinnerDone();
        const homePage = new WebAppHomePage(this.browser);
        await expect(homePage.untilIsVisible(homePage.MainHomePageBtn, 90000)).eventually.to.be.true;
    }
}
