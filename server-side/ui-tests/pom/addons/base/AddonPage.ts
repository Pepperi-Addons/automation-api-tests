import { Browser } from '../../../utilities/browser';
import { Page } from '../../base/page';
import config from '../../../../config';
import { Locator, By, WebElement, Key } from 'selenium-webdriver';
import { WebAppHeader } from '../../WebAppHeader';
import { WebAppHomePage, WebAppList, WebAppSettingsSidePanel } from '../../index';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { OrderPageItem } from '../../OrderPage';
import { ConsoleColors } from '../../../../services/general.service';

chai.use(promised);

export enum SelectOption {
    InCreation = 1,
    Submitted = 2,
    InProgress = 3,
    OnHold = 4,
    Cancelled = 5,
    Revised = 6,
    Closed = 7,
    WaitingForApproval = 9,
    ERP = 12,
    Invoice = 14,
    InPlanning = 16,
    Published = 17,
    InPayment = 18,
    Paid = 19,
    New = 1000,
}

export enum SelectPostAction {
    Alert = 15,
    CaptureDateAndTime = 26,
    CaptureGeolocation = 27,
    ExportFileToFTP = 23,
    ForceSync = 21,
    Notification = 13,
    OpenForm = 22,
    SendEmail = 1,
    CustomForm = 18,
    UpdateInventory = 28,
    Webhook = 2,
    OpenCampaign = 40,
    WebhookResultNotification = 9,
    Duplicate = 43,
    DuplicateForAnotherAccount = 48,
    PushNotification = 37,
    CalculateFieldFormula = 45,
}

export enum AddonLoadCondition {
    Footer,
    Content,
}

export class AddonPage extends Page {
    constructor(browser: Browser) {
        super(browser, `${config.baseUrl}`);
    }

    public AddonContainerTopButton: Locator = By.css('.addon-page-container button');
    public AddonContainerTitle: Locator = By.css('.addon-page-container [title]');
    public AddonContainerTabs: Locator = By.css('.pep-main-area [role="tablist"] [role="tab"]');
    public AddonContainerTablistXpath: Locator = By.xpath(
        './/div[@class="pep-main-area"] //div[@role="tablist"] //div[@role="tab"]',
    );
    public AddonContainerTabsContent: Locator = By.css('#addNewOrderTypesCont');
    public AddonContainerIframe: Locator = By.css('iframe#myFrame');
    public AddonContainerHiddenTabs: Locator = By.css('.ui-tabs-hide');
    public AddonContainerFooterDisplay: Locator = By.css('#FotterCont[style="display: block;"]');
    public AddonContainerContentDisplay: Locator = By.css('#content [style*="display: block"]');

    public AddonContainerActionsRadioBtn: Locator = By.xpath('//div[contains(@class,"choose")] //input[@type="radio"]');
    public AddonContainerEditorTrashBtn: Locator = By.xpath(
        `//div[@class="lb-title "][contains(@title,"ATD_PLACE_HOLDER")]/../*[contains(@class, 'trashCanIcon')]`,
    );
    public MatOptionDropBox: Locator = By.xpath(`//span[@class='mat-option-text' and text()='|textToFill|']`);

    public AddonContainerEditAdmin: Locator = By.css('span[title="Admin"]+.editPenIcon');
    public AddonContainerEditorSave: Locator = By.css('.save');

    //Catalog Section Locators
    public EditCatalogBtn: Locator = By.css('.editPenIcon');
    public ItemsTitleBtn: Locator = By.xpath("//li[@title='Items']");
    public CategoryExpender: Locator = By.xpath("//span[@class='dynatree-expander']");
    public CategoryListItem: Locator = By.xpath(
        "//ul//li[@class='dynatree-lastsib']//ul//li//span//a[text()='|textToFill|']/preceding-sibling::span[@class='dynatree-checkbox']",
    );
    public CategoryListItemCheckBox: Locator = By.xpath("//a[text()='|textToFill|']/..");
    public CategoryListOKBtn: Locator = By.xpath("//div[contains(text(),'OK')]");

    //cart page --->>> may have to be moved
    public WholeOrderPrice: Locator = By.xpath("//span[@id='GrandTotal']");
    public ItemQtyBtItemCode: Locator = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//pep-quantity-selector//input",
    );
    public TotalUnitPrice: Locator = By.xpath(
        "//span[@title='|textToFill|']/../../../../..//fieldset//span[@id='TotalUnitsPriceAfterDiscount']",
    );
    public OrderDeatilsMenu: Locator = By.css("[data-qa='firstMenu']");
    public SubmitOrderCartBtn: Locator = By.css("[data-qa='Submit']");
    public OrderDetailsBtn: Locator = By.xpath("//span[text()=' Order Details ']");
    public IdElementOfOrder: Locator = By.xpath("//input[@name='WrntyID']");

    //views page
    public RepViewEditIcon: Locator = By.xpath("//span[contains(@class,'editPenIcon')]");

    //UI control page
    public SaveUIControlBtn: Locator = By.xpath("//div[contains(@class,'save') and text()='Save']");
    public TrashIconListOfAllUIElements: Locator = By.xpath("//span[contains(@class,'lb-close trashCanIcon')]");
    public TextSearchBox: Locator = By.xpath("//input[@id='txtSearchBankFields']");

    //custom field adding page
    public FieldAddingTitle: Locator = By.xpath("//h3[text()='Add Custom Field']");
    public CalculatedFieldCheckBox: Locator = By.xpath("//input[@value='CalculatedField']");
    public TextInputElements: Locator = By.xpath("//input[@type='text' and @class='field textbox long roundCorner']");
    public EditScriptBtn: Locator = By.xpath("//a[@name='edit']");
    public SaveFieldBtn: Locator = By.xpath("//div[@name='save']");
    public FeildTypeButton: Locator = By.xpath("//h3[@title='|textToFill|']//..");

    //script adding page
    public ScriptEditingTitle: Locator = By.xpath("//span[contains(text(),'Available Fields')]");
    public AvailibaleFieldsBtn: Locator = By.xpath(
        "//button[@class='fr md-primary md-fab md-mini default-color md-button md-ink-ripple']",
    );
    public ScriptParamSpan: Locator = By.xpath("//span[text()='|textToFill|']/../..");
    public SubmitScriptBtn: Locator = By.xpath("//div[@class='save allButtons grnbtn roundCorner  fl ng-binding']");
    public ItemFieldsSection: Locator = By.xpath("(//div[@class='dc-header' and text()='Item Fields'])[2]");
    public ScriptParamCheckBox: Locator = By.xpath("(//td[@title='|textToFill|'])[2]/preceding-sibling::td");
    public SaveParamBtn: Locator = By.xpath("//div[text()='Save' and @tabindex=0]");
    public FirstLineInCodeInput: Locator = By.css('.CodeMirror  .CodeMirror-code > pre');
    public CodeInputSection: Locator = By.css('.CodeMirror  > div:nth-child(1) > textarea');

    //activitys page --> has to be moved
    public OrderIdTextElement: Locator = By.xpath(`//span[@id='Type' and text()='|textToFill|']/../../div//a//span`);

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
            await this.browser.untilIsVisible(this.AddonContainerFooterDisplay, 45000);
        } else {
            await this.browser.untilIsVisible(this.AddonContainerContentDisplay, 45000);
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

    public async selectDropBoxByOption(locator: Locator, option: SelectOption): Promise<void> {
        const selectedBox = Object.assign({}, locator);
        selectedBox['value'] += ` option[value='${option}']`;
        await this.browser.click(selectedBox);
        return;
    }

    public async selectDropBoxByString(locator: Locator, option: string, index?: number): Promise<void> {
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
        await expect(homePage.untilIsVisible(homePage.Main, 90000)).eventually.to.be.true;
    }
}
