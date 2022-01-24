import { Browser } from '../utilities/browser';
import { Page } from './base/page';
import config from '../../config';
import { Locator, By, WebElement, Key } from 'selenium-webdriver';
import { WebAppHeader } from './WebAppHeader';
import { WebAppDialog, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from './index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { ImportExportATDService } from '../../services/import-export-atd.service';
import { v4 as uuidv4 } from 'uuid';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

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

interface Field {
    CalculatedRuleEngine?: {
        JSFormula: string;
    };
    FieldID?: string;
    Label: string;
    Description?: string;
    UIType?: {
        ID: number;
        Name: string;
    };
    Type?: string;
    Format?: string;
    CalculatedOn?: {
        ID?: number;
        Name?: string;
    };
    Temporary?: boolean;
    [key: string]: any;
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

    //Object Types Editor Locators
    public AddonContainerATDEditorWorkflowFlowchartIndicator: Locator = By.css('span[name="flowchart"].disabled');
    public AddonContainerATDEditorWorkflowFlowchartEl: Locator = By.css('#mainFlowchart .flowchart-element');
    public AddonContainerATDEditorWorkflowFlowchartElDeleteBtn: Locator = By.css(
        '#mainFlowchart div[style*="display: block;"] .deleteProgram',
    );
    public AddonContainerATDEditorWorkflowFlowchartElEditBtn: Locator = By.css(
        '#mainFlowchart div[style*="display: block;"] .editProgram',
    );
    public AddonContainerATDEditorWorkflowFlowchartAddAction: Locator = By.css('.addAction');
    public AddonContainerActionsRadioBtn: Locator = By.xpath('//div[contains(@class,"choose")] //input[@type="radio"]');
    public AddonContainerATDEditorWorkflowFlowchartAddActionsSaveBtn: Locator = By.css(
        '#workflowV2 [name="chooseAction"] .save',
    );
    public AddonContainerATDEditorWorkflowFlowchartNewStepBtn: Locator = By.css('#newStep');
    public AddonContainerATDEditorWorkflowFlowchartransitionNameBtn: Locator = By.css('#transitionName');
    public AddonContainerATDEditorWorkflowFlowchartFromStatusBtn: Locator = By.css('#fromStatus');
    public AddonContainerATDEditorWorkflowFlowchartoStatusBtn: Locator = By.css('#toStatus');
    public AddonContainerATDEditorWorkflowFlowchartSaveBtn: Locator = By.css('#workflowV2 .add .save');
    public AddonContainerATDEditorWorkflowFlowchartCancelBtn: Locator = By.css('#workflowV2 .add .cancel');
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryOriginInventoryCB: Locator = By.css(
        '#originInventory input[type="checkbox"]',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryDestinationAccountCB: Locator = By.css(
        '#destinationAccount input[type="checkbox"]',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventorySaveBtn: Locator = By.css(
        '#workflowV2 #updateInventoryAction .save',
    );
    public AddonContainerATDEditorWorkflowFlowchartUpdateInventoryEditSaveBtn: Locator = By.css(
        '#workflowV2 [name="editStack"] .save',
    );

    //Editor Fields
    public AddonContainerATDEditorFieldsAddCustomArr: Locator = By.css('.allButtons.grnbtn.roundCorner.dc-add');
    public AddonContainerATDEditorTransactionFieldArr: Locator = By.css('[name="0"]');
    public AddonContainerATDEditorTransactionLineFieldArr: Locator = By.css('[name="1"]');
    public AddonContainerATDEditorEditFieldArr: Locator = By.xpath(`..//span[contains(@class, 'editPenIcon')]`);
    public AddonContainerATDEditorTransactionLineFieldEditFormula: Locator = By.css('[name="edit"]');
    public AddonContainerATDEditorTransactionLineFieldFormula: Locator = By.css('#formula textarea');
    public AddonContainerATDEditorTransactionLineFieldFormulaEditorSave: Locator = By.css('#footer .save');
    public AddonContainerATDEditorTransactionLineFieldSave: Locator = By.css('.footerSection [name="save"]');

    //Editor Views
    public AddonContainerATDEditorViewsAddCustom: Locator = By.css('.add-view.allButtons.grnbtn.roundCorner'); //No avilable in Stage - BO Config
    public AddonContainerATDEditorViewsOrderCenterViews: Locator = By.xpath(
        '//div[@id="formContTemplate"]//h3[contains(., "Order Center Views")]',
    );
    public AddonContainerATDEditorTransactionViewsArr: Locator = By.css('#formContTemplate .ui-accordion-header');
    public AddonContainerATDEditorAddViewBtn: Locator = By.xpath(`//div[contains(text(),"VIEW_PLACE_HOLDER")]`);

    //Settings Framework Locators
    public SettingsFrameworkEditAdmin: Locator = By.css('span[title="Admin"]+.editPenIcon');
    public SettingsFrameworkEditorSearch: Locator = By.css('#txtSearchBankFields');
    public SettingsFrameworkEditorSave: Locator = By.css('.save');
    public SettingsFrameworkEditorTrashBtn: Locator = By.xpath(
        `//div[@class="lb-title "][contains(@title,"ATD_PLACE_HOLDER")]/../*[contains(@class, 'trashCanIcon')]`,
    );

    //Catalog Section Locators
    public EditCatalogBtn: Locator = By.css('.editPenIcon');
    public ItemsTitleBtn: Locator = By.xpath("//li[@title='Items']");
    public CategoryExpender: Locator = By.xpath("//span[@class='dynatree-expander']");
    public CategoryListItem: Locator = By.xpath(
        "//ul//li[@class='dynatree-lastsib']//ul//li//span//a[text()='|textToFill|']/preceding-sibling::span[@class='dynatree-checkbox']",
    );
    public CategoryListItemCheckBox: Locator = By.xpath(
        "//ul//li[@class='dynatree-lastsib']//ul//li//span//a[text()='|textToFill|']/..",
    );
    public CategoryListOKBtn: Locator = By.xpath("//div[contains(text(),'OK')]");

    //UOM Addon Locators
    public uomHeader: Locator = By.xpath("//h1[contains(text(),'UOM')]");
    public uomInstalledHeader: Locator = By.xpath("//b[contains(text(),'Configuration Field')]");
    public uomInstallBtn: Locator = By.css("[data-qa='install']");
    public UomDropDownFields: Locator = By.xpath("(//div[contains(@class,'mat-select-arrow-wrapper')])");
    public UomSaveBtn: Locator = By.css("[data-qa='Save']");

    //UOM ATD Locators
    public readonly everyItemXpathPrefix: string = "//span[@title='|textToFill|']/../../../../../../..";
    public upperUOMType: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM1']`);
    public upperPlusButtonQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_plus']`);
    public upperMinusButtonQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_minus']`);
    public upperQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity1']`);
    public lowerUOMType: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM2']`);
    public lowerPlusButtonQty: Locator = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_plus'])[2]`);
    public lowerMinusButtonQty: Locator = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_minus'])[2]`);
    public lowerQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity2']`);
    public lowestQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@class='ellipsis']`);
    public itemGrandTotal: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@id='TransactionGrandTotal']`);
    public pageGrandTotal: Locator = By.xpath("//span[@class='value']");
    public blankSpaceOnScreenToClick: Locator = By.xpath("//div[contains(@class,'total-items-container')]");
    public SubmitToCart: Locator = By.css('[data-qa=cartButton]');

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

    //custom field adding page
    public fieldAddingTitle: Locator = By.xpath("//h3[text()='Add Custom Field']");
    public calculatedFieldCheckBox: Locator = By.xpath("//input[@value='CalculatedField']");
    public textInputElements: Locator = By.xpath("//input[@type='text' and @class='field textbox long roundCorner']");
    public editFieldScriptBtn: Locator = By.xpath("//a[@name='edit']");
    public saveFieldBtn: Locator = By.xpath("//div[@name='save']");
    public FeildTypeButton: Locator = By.xpath("//h3[@title='|textToFill|']//..");

    //script adding page
    public scriptEditingTitle: Locator = By.xpath("//span[contains(text(),'Available Fields')]");
    public AvailibaleFieldsBtn: Locator = By.xpath(
        "//button[@class='fr md-primary md-fab md-mini default-color md-button md-ink-ripple']",
    );
    public ScriptParamSpan: Locator = By.xpath("//span[text()='|textToFill|']/../..");
    public SubmitScriptBtn: Locator = By.xpath("//div[@class='save allButtons grnbtn roundCorner  fl ng-binding']");
    public ItemFieldsSection: Locator = By.xpath("(//div[@class='dc-header' and text()='Item Fields'])[2]");
    public ScriptParamCheckBox: Locator = By.xpath("(//td[@title='|textToFill|'])[2]/preceding-sibling::td");
    public SaveParamBtn: Locator = By.xpath("//div[text()='Save' and @tabindex=0]");
    public FirstLineInCodeInput: Locator = By.css(".CodeMirror  .CodeMirror-code > pre");
    public CodeInputSection: Locator = By.css('.CodeMirror  > div:nth-child(1) > textarea');

    //Branded App Locators
    public BrandedAppChangeCompanyLogo: Locator = By.id('btnChangeCompLogo');
    public BrandedAppUploadInputArr: Locator = By.css("input[type='file']");

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
        console.log('Validate Addon Loaded');
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
        await this.browser.click(By.xpath(`//span[@class='mat-option-text' and text()='${option}']`));
        await this.browser.sleep(3000);
        return;
    }

    public async selectPostAction(actionName: SelectPostAction): Promise<void> {
        const selectedTab = Object.assign({}, this.AddonContainerActionsRadioBtn);
        selectedTab['value'] = `.//li[@data-type='${actionName}'] ${selectedTab['value']}`;
        await this.browser.click(selectedTab);
        return;
    }

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     * @param generalService This function will use API to rename other existing ATD with same name
     * @param name Name of the new ATD
     * @param description Description of the new ATD
     */
    public async createNewATD(that, generalService: GeneralService, name: string, description: string): Promise<void> {
        const objectsService = new ObjectsService(generalService);
        const importExportATDService = new ImportExportATDService(generalService.papiClient);
        const webAppHeader = new WebAppHeader(this.browser);

        await this.browser.click(webAppHeader.Settings);

        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorTransactions);

        const webAppTopBar = new WebAppTopBar(this.browser);
        await this.browser.click(webAppTopBar.EditorAddBtn);

        const webAppDialog = new WebAppDialog(this.browser);
        await this.browser.sendKeys(webAppDialog.EditorTextBoxInput, name);
        await this.browser.sendKeys(webAppDialog.EditorTextAreaInput, description + Key.TAB);
        await webAppDialog.selectDialogBoxByText('Save');

        const webAppList = new WebAppList(this.browser);

        //If not in new ATD, try to remove ATD and recreate new ATD
        try {
            //Make sure the page finish to load after creating new ATD
            await this.isSpinnerDone();
            await this.browser.switchTo(this.AddonContainerIframe);
            await this.browser.switchToDefaultContent();
        } catch (error) {
            const isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
            if (isPupUP == `${name} already exists.`) {
                const base64Image = await this.browser.saveScreenshots();
                addContext(that, {
                    title: `This should never happen since this bug solved in Object Types Editor Version 1.0.14`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                addContext(that, {
                    title: `Known bug in Object Types Editor Version 1.0.8`,
                    value: 'https://pepperi.atlassian.net/browse/DI-18699',
                });
                await webAppDialog.selectDialogBox('Close');

                //Remove all the transactions of this ATD, or the UI will block the manual removal

                const transactionsToRemove = await objectsService.getTransaction({
                    where: `Type LIKE '%${name}%'`,
                });

                for (let index = 0; index < transactionsToRemove.length; index++) {
                    const isTransactionDeleted = await objectsService.deleteTransaction(
                        transactionsToRemove[index].InternalID as number,
                    );
                    expect(isTransactionDeleted).to.be.true;
                }

                //Rename the ATD and Remove it with UI Delete to Reproduce the bug from version 1.0.8
                const tempATDExternalID = `${name} ${uuidv4()}`;

                const atdToRemove = await generalService.getAllTypes({
                    where: `Name='${name}'`,
                    include_deleted: true,
                    page_size: -1,
                });

                await importExportATDService.postTransactionsATD({
                    ExternalID: tempATDExternalID,
                    InternalID: atdToRemove[0].InternalID,
                    UUID: atdToRemove[0].UUID,
                    Hidden: false,
                    Description: description,
                });

                //Wait after POST new ATD from the API before getting it in the UI
                console.log('ATD Updated by using the API');
                this.browser.sleep(4000);

                await this.browser.sendKeys(webAppTopBar.EditorSearchField, tempATDExternalID + Key.ENTER);

                await webAppList.clickOnFromListRowWebElement();

                await webAppTopBar.selectFromMenuByText(webAppTopBar.EditorEditBtn, 'Delete');

                //Make sure all loading is done after Delete
                await this.isSpinnerDone();

                let isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();

                expect(isPupUP).to.equal('Are you sure you want to proceed?');

                await webAppDialog.selectDialogBox('Continue');

                //Make sure all loading is done after Continue
                await this.isSpinnerDone();

                isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();

                expect(isPupUP).to.equal('Task Delete completed successfully.');

                await webAppDialog.selectDialogBox('Close');

                try {
                    //Wait after refresh for the ATD list to load before searching in list
                    await this.isSpinnerDone();
                    await this.browser.sendKeys(webAppTopBar.EditorSearchField, name + Key.ENTER);

                    await webAppList.clickOnFromListRowWebElement(0, 6000);
                    throw new Error('The list should be empty, this is a bug');
                } catch (error) {
                    if (error instanceof Error && error.message == 'The list should be empty, this is a bug') {
                        throw error;
                    }
                }

                //Try again to create new ATD after removed ATD with same name
                await this.browser.click(webAppTopBar.EditorAddBtn);
                await this.browser.sendKeys(webAppDialog.EditorTextBoxInput, name);
                await this.browser.sendKeys(webAppDialog.EditorTextAreaInput, description + Key.TAB);
                await webAppDialog.selectDialogBoxByText('Save');

                //Make sure the page finish to load after creating new ATD
                await this.isSpinnerDone();
                await this.browser.switchTo(this.AddonContainerIframe);
                await this.browser.switchToDefaultContent();
            }
        }
        return;
    }

    /**
     *
     * @param postAction Enum that can be used like this in a test: SelectPostAction.UpdateInventory;
     */
    public async editATDWorkflow(postAction: SelectPostAction): Promise<void> {
        switch (postAction) {
            case SelectPostAction.UpdateInventory:
                const webAppDialog = new WebAppDialog(this.browser);

                //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
                await this.browser.switchTo(this.AddonContainerIframe);
                await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
                expect(await this.isEditorHiddenTabExist('WorkflowV2', 45000)).to.be.true;
                expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
                await this.browser.switchToDefaultContent();

                await this.selectTabByText('Workflows');
                await this.browser.switchTo(this.AddonContainerIframe);
                await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
                expect(await this.isEditorTabVisible('WorkflowV2')).to.be.true;

                //Validate Editor Page Loaded
                expect(await this.browser.findElement(this.AddonContainerATDEditorWorkflowFlowchartIndicator));

                //Edit the Workflow
                //Clear
                const workflowElmentsLength = await (
                    await this.browser.findElements(this.AddonContainerATDEditorWorkflowFlowchartEl)
                ).length;

                for (let index = workflowElmentsLength - 1; index >= 0; index--) {
                    await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartEl, index);
                    await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartElDeleteBtn);
                    await this.browser.click(webAppDialog.IframeDialogApproveBtn);
                    console.log('Wait after removed flowchart element');
                    this.browser.sleep(500);
                    await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
                }

                //Add Steps
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartNewStepBtn);
                await this.browser.sendKeys(this.AddonContainerATDEditorWorkflowFlowchartransitionNameBtn, 'Create');
                await this.selectDropBoxByOption(
                    this.AddonContainerATDEditorWorkflowFlowchartFromStatusBtn,
                    SelectOption.New,
                );
                await this.selectDropBoxByOption(
                    this.AddonContainerATDEditorWorkflowFlowchartoStatusBtn,
                    SelectOption.InCreation,
                );
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartSaveBtn);

                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartNewStepBtn);
                await this.browser.sendKeys(this.AddonContainerATDEditorWorkflowFlowchartransitionNameBtn, 'Submit');
                await this.selectDropBoxByOption(
                    this.AddonContainerATDEditorWorkflowFlowchartFromStatusBtn,
                    SelectOption.InCreation,
                );
                await this.selectDropBoxByOption(
                    this.AddonContainerATDEditorWorkflowFlowchartoStatusBtn,
                    SelectOption.Submitted,
                );
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartSaveBtn);

                await this.isAddonFullyLoaded(AddonLoadCondition.Footer);

                //Edit Step
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartEl, 0);

                //Add Update Inventory
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartElEditBtn);
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartAddAction, 1);
                await this.selectPostAction(SelectPostAction.UpdateInventory);
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartAddActionsSaveBtn);

                //Config Update Inventory
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryOriginInventoryCB);
                await this.browser.click(
                    this.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryDestinationAccountCB,
                );
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartUpdateInventorySaveBtn);
                await this.browser.click(this.AddonContainerATDEditorWorkflowFlowchartUpdateInventoryEditSaveBtn);

                await this.browser.switchToDefaultContent();
                break;
            default:
                throw new Error('Method not implemented.');
        }
        return;
    }

    /**
     *
     * @param fieldType The name of the fields group
     * @param fieldObj Type that contain the field Label and Js formula if needed
     * @returns
     */
    public async editATDField(fieldType: string, fieldObj: Field, isTransLine = false): Promise<void> {
        //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();

        await this.selectTabByText('Fields');
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorTabVisible('DataCustomization')).to.be.true;

        //Validate Editor Page Loaded
        expect(await this.browser.findElement(this.AddonContainerATDEditorFieldsAddCustomArr));

        const locator: Locator = isTransLine
            ? this.AddonContainerATDEditorTransactionLineFieldArr
            : this.AddonContainerATDEditorTransactionFieldArr;
        const buttonsArr = await this.browser.findElements(locator);
        for (let index = 0; index < buttonsArr.length; index++) {
            const element = buttonsArr[index];
            if ((await element.getText()).includes(fieldType)) {
                await this.browser.click(locator, index);
                break;
            }
        }
        const selectedBtn = Object.assign({}, this.AddonContainerATDEditorEditFieldArr);
        selectedBtn['value'] = `//td[@title='${fieldObj.Label}']/${selectedBtn['value']}`;
        await this.browser.click(selectedBtn);

        await this.browser.click(this.AddonContainerATDEditorTransactionLineFieldEditFormula);
        await this.browser.sendKeys(
            this.AddonContainerATDEditorTransactionLineFieldFormula,
            fieldObj.CalculatedRuleEngine?.JSFormula as string,
            0,
            6000,
        );

        await this.browser.click(this.AddonContainerATDEditorTransactionLineFieldFormulaEditorSave);
        await this.browser.click(this.AddonContainerATDEditorTransactionLineFieldSave);

        return;
    }

    /**
     *
     * @param fieldType The name of the fields group
     * @param fieldObj Type that contains the field Label and optional JS formula
     * @param scriptParam Optional variable which indicates which script sys param should be added 
     * @param fieldType what is the added script param type on 'Add Custom Field' page
     * @returns
     */
    public async addATDCalculatedField(
        fieldObj: Field,
        isTransLine = false,
        scriptParam?: string,
        fieldType?: string,
    ): Promise<void> {

        //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();

        await this.selectTabByText('Fields');
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorTabVisible('DataCustomization')).to.be.true;

        //Validate Editor Page Loaded
        await this.browser.sleep(7500);
        expect(await this.browser.untilIsVisible(this.AddonContainerATDEditorFieldsAddCustomArr, 75000)).to.be.true;
        if (isTransLine) {
            await this.browser.click(this.AddonContainerATDEditorFieldsAddCustomArr, 1);
        } else {
            await this.browser.click(this.AddonContainerATDEditorFieldsAddCustomArr, 0);
        }
        expect(await this.browser.untilIsVisible(this.fieldAddingTitle, 45000)).to.be.true;

        if (fieldType) {
            const xpathQueryForFieldTypeBtn: string = this.FeildTypeButton.valueOf()['value'].replace(
                '|textToFill|',
                fieldType,
            );
            await this.browser.click(By.xpath(xpathQueryForFieldTypeBtn));
        }

        await this.browser.click(this.calculatedFieldCheckBox);
        await this.browser.sendKeys(this.textInputElements, fieldObj.Label, 0);
        await this.browser.click(this.editFieldScriptBtn);
        await this.browser.sleep(6800);
        expect(await this.browser.untilIsVisible(this.scriptEditingTitle, 55000)).to.be.true;

        if (scriptParam) {
            await this.browser.click(this.AvailibaleFieldsBtn);
            expect(await this.browser.untilIsVisible(this.ItemFieldsSection, 15000)).to.be.true;
            await this.browser.click(this.ItemFieldsSection);
            const xpathQueryForParamCheckBox: string = this.ScriptParamCheckBox.valueOf()['value'].replace(
                '|textToFill|',
                scriptParam,
            );
            await this.browser.click(By.xpath(xpathQueryForParamCheckBox));
            await this.browser.click(this.SaveParamBtn);
            const xpathQueryForParamSpan: string = this.ScriptParamSpan.valueOf()['value'].replace(
                '|textToFill|',
                scriptParam,
            );
            expect(await this.browser.untilIsVisible(By.xpath(xpathQueryForParamSpan), 15000)).to.be.true;
        }

        await this.browser.click(this.FirstLineInCodeInput);
        await this.browser.sendKeys(
            this.CodeInputSection,
            fieldObj.CalculatedRuleEngine?.JSFormula as string,
            0,
            6000,
        );
        await this.browser.click(this.SubmitScriptBtn);
        await this.browser.click(this.saveFieldBtn);
        expect(await this.browser.findElement(this.AddonContainerATDEditorFieldsAddCustomArr));
        return;
    }

    /**
     *
     * @param viewName The name of the view group
     * @param viewType The name of the view
     * @param addingViewLocator Optinal variable - locator for adding a view button
     * @returns
     */
    public async editATDView(viewType: string, viewName: string, addingViewLocator = 'plusIcon'): Promise<void> {
        //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();

        await this.selectTabByText('Views');
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorTabVisible('Layouts')).to.be.true;

        //Validate Editor Page Loaded
        expect(await this.browser.findElement(this.AddonContainerATDEditorViewsOrderCenterViews));

        const buttonsArr = await this.browser.findElements(this.AddonContainerATDEditorTransactionViewsArr);
        for (let index = 0; index < buttonsArr.length; index++) {
            const element = buttonsArr[index];
            if ((await element.getText()).includes(viewType)) {
                await element.click();
                break;
            }
        }

        const selectedBtn = Object.assign({}, this.AddonContainerATDEditorAddViewBtn);
        selectedBtn['value'] = `${selectedBtn['value'].replace(
            'VIEW_PLACE_HOLDER',
            viewName,
        )}/..//div[contains(@class, "${addingViewLocator}")]`;
        await this.browser.click(selectedBtn);
        return;
    }

    /**
     * 
     * @param activtiyName the name of ATD should be added to home screen
     * @returns 
     */
    public async addAdminHomePageButtons(activtiyName: string): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        await this.isSpinnerDone();
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Content);

        await this.browser.click(this.SettingsFrameworkEditAdmin);
        await this.browser.sendKeys(this.SettingsFrameworkEditorSearch, activtiyName + Key.ENTER);
        await this.browser.click(this.SettingsFrameworkEditorSave);

        await this.browser.switchToDefaultContent();
        const webAppHomePage = new WebAppHomePage(this.browser);
        webAppHomePage.returnToHomePage();
        return;
    }

    /**
     * 
     * @param activtiyName name of the ATD to delete 
     * @returns 
     */
    public async removeAdminHomePageButtons(activtiyName: string): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Company Profile');
        await this.browser.click(webAppSettingsSidePanel.SettingsFrameworkHomeButtons);

        await this.isSpinnerDone();
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Content);

        await this.browser.click(this.SettingsFrameworkEditAdmin);

        const buttonsLocator = Object.assign({}, this.SettingsFrameworkEditorTrashBtn);
        buttonsLocator['value'] = buttonsLocator['value'].replace('ATD_PLACE_HOLDER', activtiyName);

        let isRemovable;
        try {
            isRemovable = await this.browser.untilIsVisible(buttonsLocator);
        } catch (error) {
            console.log('No Button To Remove, Test Continue');
        }
        if (isRemovable) {
            const buttonsToRemove = await this.browser.findElements(buttonsLocator);
            for (let i = 0; i < buttonsToRemove.length; i++) {
                await this.browser.click(buttonsLocator);
            }
            await this.browser.click(this.SettingsFrameworkEditorSave);
        }

        const webAppHomePage = new WebAppHomePage(this.browser);
        webAppHomePage.returnToHomePage();
        return;
    }

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     * @param generalService This function will use API to rename other existing ATD with same name
     * @param description Description of the new ATD
     * @param name Name of the ATD
     * @param description Description of the new ATD
     */
    public async removeATD(generalService: GeneralService, name: string, description: string): Promise<void> {
        const objectsService = new ObjectsService(generalService);
        const importExportATDService = new ImportExportATDService(generalService.papiClient);

        //Remove the new ATD
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Settings);

        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorTransactions);

        //Remove all the transactions of this ATD, or the UI will block the manual removal
        const transactionsToRemoveInCleanup = await objectsService.getTransaction({
            where: `Type LIKE '%${name}%'`,
        });

        for (let index = 0; index < transactionsToRemoveInCleanup.length; index++) {
            const isTransactionDeleted = await objectsService.deleteTransaction(
                transactionsToRemoveInCleanup[index].InternalID as number,
            );
            expect(isTransactionDeleted).to.be.true;
        }

        //Rename the ATD and Remove it with UI Delete to Reproduce the bug from version 1.0.8
        const tempATDExternalIDInCleanup = `${name} ${uuidv4()}`;

        const atdToRemoveInCleanup = await generalService.getAllTypes({
            where: `Name='${name}'`,
            include_deleted: true,
            page_size: -1,
        });

        await importExportATDService.postTransactionsATD({
            ExternalID: tempATDExternalIDInCleanup,
            InternalID: atdToRemoveInCleanup[0].InternalID,
            UUID: atdToRemoveInCleanup[0].UUID,
            Hidden: false,
            Description: description,
        });

        //Wait after POST new ATD from the API before getting it in the UI
        console.log('ATD Updated by using the API');
        this.browser.sleep(4000);

        const webAppList = new WebAppList(this.browser);
        const webAppTopBar = new WebAppTopBar(this.browser);

        await this.browser.sendKeys(webAppTopBar.EditorSearchField, tempATDExternalIDInCleanup + Key.ENTER);

        await webAppList.clickOnFromListRowWebElement();

        await webAppTopBar.selectFromMenuByText(webAppTopBar.EditorEditBtn, 'Delete');

        //Make sure all loading is done after Delete
        await this.isSpinnerDone();

        const webAppDialog = new WebAppDialog(this.browser);
        let isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();

        expect(isPupUP).to.equal('Are you sure you want to proceed?');

        await webAppDialog.selectDialogBox('Continue');

        //Make sure all loading is done after Continue
        await this.isSpinnerDone();

        isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();

        expect(isPupUP).to.equal('Task Delete completed successfully.');

        await webAppDialog.selectDialogBox('Close');
        return;
    }

    /**
     *
     * @param itemKesyUomItems list of all item keys you want included in the catalog
     * @param itemKeyNonUomItems
     */
    public async selectCatalogItemsByCategory(...itemKesyUomItems: string[]): Promise<void> {
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
            let itemCheckBox: string = this.CategoryListItemCheckBox.valueOf()['value'].slice().replace(
                '|textToFill|',
                itemKesyUomItems[i],
            );
            let itemCheckBoxElement = await this.browser.findElement(By.xpath(itemCheckBox));
            let checkBoxClassAtt = await itemCheckBoxElement.getAttribute('class');
            if (!checkBoxClassAtt.includes('selected')) {
                const xpathQueryForList: string = this.CategoryListItem.valueOf()['value'].slice().replace(
                    '|textToFill|',
                    itemKesyUomItems[i],
                );
                const locatorForCategoryList: Locator = By.xpath(xpathQueryForList);
                await this.browser.click(locatorForCategoryList);
            }
        }
        await this.browser.click(this.CategoryListOKBtn);
        const webAppHomePage = new WebAppHomePage(this.browser);
        webAppHomePage.returnToHomePage();
        return;
    }

    //UOM section 

    /**
     *
     * configuration of UOM ATD for auto test
     */
    public async configUomATD(): Promise<void> {
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('Uom');
        //=>validate uom is loaded both if installed and if not
        expect(await this.browser.untilIsVisible(this.uomHeader, 15000)).to.be.true;
        //testing whether already installed - after loading anyway
        if (await (await this.browser.findElement(this.uomInstallBtn)).isDisplayed()) {
            await this.browser.click(this.uomInstallBtn);
            const webAppDialog = new WebAppDialog(this.browser);
            // text not finalized yet - once will be the test is relevant        
            // const isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
            // expect(isPupUP).to.equal('Are you sure you want to apply the module on the transaction?');
            await webAppDialog.selectDialogBox('ok');
            await this.isSpinnerDone();
        }
        expect(await this.browser.untilIsVisible(this.uomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
        await this.addATDCalculatedField(
            {
                Label: 'AllowedUomFieldsForTest', //name
                CalculatedRuleEngine: {
                    JSFormula:
                        "return ItemMainCategory==='uom item'?JSON.stringify(['Bx','SIN', 'DOU', 'TR', 'QU','PK','CS']):null;",
                },
            },
            true,
            'ItemMainCategory',
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        //**first testing phase will be performed w/o this feature - second whill test this only**
        await this.addATDCalculatedField(
            {
                Label: 'ItemConfig',
                CalculatedRuleEngine: {
                    JSFormula: `return null;`,
                },
            },
            true,
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        await this.addATDCalculatedField(
            {
                Label: 'UomValues',
                CalculatedRuleEngine: {
                    JSFormula: `return JSON.stringify(["Bx","SIN", "DOU", "TR", "QU","PK","CS"]);`,
                },
            },
            true,
        );
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
        await this.addATDCalculatedField(
            {
                Label: 'ConstInventory',
                CalculatedRuleEngine: {
                    JSFormula: `return 48;`,
                },
            },
            true,
            undefined,
            'Number',
        );
        await this.configUomFieldsAndMediumView();
        return;
    }

    /**
     * configure UOM ATD with previously created fields and configure the medium view of the UOM ATD for UI testing
     */
    public async configUomFieldsAndMediumView(): Promise<void> {
        await this.configureUomDataFields('AllowedUomFieldsForTest', 'ItemConfig', 'ConstInventory', 'Fix Quantity', 'Fix Quantity', 'Fix Quantity');
        await this.editATDView('Order Center Views', 'Medium Thumbnails View', 'editPenIcon');
        await this.browser.sleep(5500);
        await this.browser.click(this.RepViewEditIcon);
        await this.deleteAllFieldFromUIControl();
        await this.setFieldToUIControl('Item External ID');
        await this.setFieldToUIControl('Item Price');
        await this.setFieldToUIControl('AOQM_UOM1');
        await this.setFieldToUIControl('AOQM_QUANTITY1');
        await this.setFieldToUIControl('AOQM_UOM2');
        await this.setFieldToUIControl('AOQM_QUANTITY2');
        await this.setFieldToUIControl('UomValues');
        await this.setFieldToUIControl('ConstInventory');
        await this.setFieldToUIControl('Transaction Total Sum');
        await this.setFieldToUIControl('ItemConfig');
        await this.setFieldToUIControl('Item ID');
        await this.setFieldToUIControl('Unit Quantity');
        await this.browser.click(this.SaveUIControlBtn);
    }

    public async configureUomDataFields(...dataFieldNames: string[]): Promise<void> {
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('Uom');
        expect(await this.browser.untilIsVisible(this.uomHeader, 15000)).to.be.true;
        for (let i = 0; i < dataFieldNames.length; i++) {
            await this.selectDropBoxByString(this.UomDropDownFields, dataFieldNames[i], i);
            await this.isSpinnerDone();
            await this.browser.sleep(1500);
        }
        await this.browser.click(this.UomSaveBtn);
        const webAppDialog = new WebAppDialog(this.browser);
        const isPupUP = await (await this.browser.findElement(webAppDialog.Content)).getText();
        expect(isPupUP).to.equal('Configuration Saved successfully');
        await webAppDialog.selectDialogBox('Close');
        await this.isSpinnerDone();
        expect(await this.browser.untilIsVisible(this.uomInstalledHeader, 15000)).to.be.true;
        await this.selectTabByText('General');
    }


    //UI view configuration functions
    public async deleteAllFieldFromUIControl(): Promise<void> {
        const deleteBtnsList = await this.browser.findElements(
            By.xpath("//span[contains(@class,'lb-close trashCanIcon')]"),
        );
        for (let i = 0; i < deleteBtnsList.length; i++) {
            await this.browser.click(By.xpath("//span[contains(@class,'lb-close trashCanIcon')]"));
            await this.browser.sleep(1000);
        }
    }
    public async setFieldToUIControl(nameToSearch: string): Promise<void> {
        await this.browser.sendKeys(By.xpath("//input[@id='txtSearchBankFields']"), nameToSearch + Key.ENTER);
        this.browser.sleep(1500);
    }

    /**
     *  UI test of UOM items order 
     */
    public async testUomAtdUI(): Promise<void> {
        //1. regular item testing

        //1.1 add 48 items of regular qty - see 48 items are shown + correct price is presented
        let workingUomObject = new UomUIObject("1230");
        for (let i = 1; i < 49; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(i.toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 0.5).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 0.5).toString()).toFixed(2)}`,
            );
        }
        //1.2. try to add one more regular item - nothing should change
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$24.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$24.00');
        //1.3. lower qty to 35 - see price + amount changed everywhere correctly
        for (let i = 1; i < 14; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (48 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((48 - i).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat(((48 - i) * 0.5).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat(((48 - i) * 0.5).toString()).toFixed(2)}`,
            );
        }

        //1.4. zero the amount of the regular item - see everythins changed correctly
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '0');
        await this.browser.click(this.blankSpaceOnScreenToClick);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('0');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$0.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$0.00');

        //2. UOM item testing

        //2.1. Box & single
        workingUomObject = new UomUIObject("1231");
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Box');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        await this.browser.sleep(1500);
        //2.1.2. fill the order with boxes - the rest in singel items
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((i * 13).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 13).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((i * 13).toString()).toFixed(2)}`,
            );
        }
        //2.1.3. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('3');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('39');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$39.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$39.00');
        //2.1.4. filling the rest with single elements
        for (let i = 1; i < 10; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('3');
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((39 + i).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((39 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((39 + i).toString()).toFixed(2)}`,
            );
        }
        //2.1.5. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('9');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$48.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$48.00');
        //2.1.6. lowering box by 1 and adding 13 singles
        await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('2');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('35');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$35.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$35.00');
        for (let i = 1; i < 14; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                (9 + i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((35 + i).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((35 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((35 + i).toString()).toFixed(2)}`,
            );
        }
        //2.1.7. nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('2');
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('22');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$48.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$48.00');

        //2.2. Double & Single
        workingUomObject = new UomUIObject("1232");
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'double');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Single');
        await this.browser.sleep(1500);

        //2.2.1 fill the qty with double values
        for (let i = 1; i < 25; i++) {
            await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
            await this.browser.sleep(1200);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((i * 2).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((48 + i * 2).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((48 + i * 2).toString()).toFixed(2)}`,
            ); //
        }
        //2.2.2 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('24');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$96.00');
        //2.2.3 lowering the double qty by half
        for (let i = 1; i < 13; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (24 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (48 - i * 2).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((96 - i * 2).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((96 - i * 2).toString()).toFixed(2)}`,
            );
        }
        //2.2.4 filling the rest with single
        for (let i = 1; i < 25; i++) {
            await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('12');
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal(
                i.toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal((24 + i).toString());
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((72 + i).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((72 + i).toString()).toFixed(2)}`,
            );
        }
        //2.2.5 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('12');
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('24');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$96.00');
        //2.2.6 nothing changes as qty bigger than inventory
        await this.browser.click(workingUomObject.aoqmUom2PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('12');
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('24');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$96.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$96.00');

        //2.3. Pack & Double
        workingUomObject = new UomUIObject("1233");
        //set uom types to double in the upper field and single in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Pack');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'double');
        await this.browser.sleep(1500);

        //2.3.1 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 8 packs
        await this.browser.click(workingUomObject.aoqmUom1Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom1Qty, '20');
        await this.browser.click(this.blankSpaceOnScreenToClick);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('8');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$144.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$144.00');
        //2.3.2 lowering pack amount by 3
        for (let i = 1; i < 4; i++) {
            await this.browser.click(workingUomObject.aoqmUom1MinusQtyButton);
            await this.browser.sleep(1100);
            await this.isSpinnerDone();
            expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal(
                (8 - i).toString(),
            );
            expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal(
                (48 - i * 6).toString(),
            ); //
            expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal(
                `$${parseFloat((144 - i * 6).toString()).toFixed(2)}`,
            );
            expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal(
                `$${parseFloat((144 - i * 6).toString()).toFixed(2)}`,
            );
        }
        //2.3.3 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 9 double's
        await this.browser.click(workingUomObject.aoqmUom2Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom2Qty, '20');
        await this.browser.click(this.blankSpaceOnScreenToClick);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        //2.3.4 validating all values
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('5');
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('9');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('48');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$144.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$144.00');

        //2.4. Case & Box
        workingUomObject = new UomUIObject("1234");
        //set uom types to case in the upper field and box in lower
        await this.selectDropBoxByString(workingUomObject.aoqmUom1, 'Case');
        await this.browser.sleep(1500);
        await this.selectDropBoxByString(workingUomObject.aoqmUom2, 'Box');
        await this.browser.sleep(1500);

        //2.4.1 raise the case qty by 1 and check all values
        await this.browser.click(workingUomObject.aoqmUom1PlusQtyButton);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('1');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('24');
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$168.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$168.00');

        //2.4.2 filling the amount by sending keys with bigger qty then inventory permits - expecting to get 1 box
        await this.browser.click(workingUomObject.aoqmUom2Qty);
        await this.browser.sendKeys(workingUomObject.aoqmUom2Qty, '20');
        await this.browser.click(this.blankSpaceOnScreenToClick);
        await this.browser.sleep(1100);
        await this.isSpinnerDone();
        //2.4.3 valdating all values
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom1Qty)).getAttribute('title')).to.equal('1'); //
        expect(await (await this.browser.findElement(workingUomObject.aoqmUom2Qty)).getAttribute('title')).to.equal('1');
        expect(await (await this.browser.findElement(workingUomObject.wholeItemQty)).getText()).to.equal('37'); //
        expect(await (await this.browser.findElement(workingUomObject.itemGrandTotal)).getText()).to.equal('$181.00');
        expect(await (await this.browser.findElement(this.pageGrandTotal)).getText()).to.equal('$181.00');

        //3. UOM order test ended - submiting to cart
        await this.browser.click(this.SubmitToCart);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        await webAppList.validateListRowElements();
    }

    /**
     * checking all items in order page
     * @returns the id of the order submitted as string 
     */
    public async testUOMCartUI(): Promise<string> {
        expect(await (await this.browser.findElement(this.WholeOrderPrice)).getText()).to.equal('$181.00'.toString());
        //element 1234
        const qtyOf1234Element = this.ItemQtyBtItemCode.valueOf()['value'].slice().replace('|textToFill|', '1234');
        const priceOf1234Element = this.TotalUnitPrice.valueOf()['value'].slice().replace('|textToFill|', '1234');
        expect(await (await this.browser.findElement(By.xpath(qtyOf1234Element))).getAttribute('title')).to.equal(
            '37'.toString(),
        );
        expect(await (await this.browser.findElement(By.xpath(priceOf1234Element))).getAttribute('title')).to.equal(
            '$37.00'.toString(),
        );
        //element 1233
        const qtyOf1233Element = this.ItemQtyBtItemCode.valueOf()['value'].slice().replace('|textToFill|', '1233');
        const priceOf1233Element = this.TotalUnitPrice.valueOf()['value'].slice().replace('|textToFill|', '1233');
        expect(await (await this.browser.findElement(By.xpath(qtyOf1233Element))).getAttribute('title')).to.equal(
            '48'.toString(),
        );
        expect(await (await this.browser.findElement(By.xpath(priceOf1233Element))).getAttribute('title')).to.equal(
            '$48.00'.toString(),
        );
        //element 1232
        const qtyOf1232Element = this.ItemQtyBtItemCode.valueOf()['value'].slice().replace('|textToFill|', '1232');
        const priceOf1232Element = this.TotalUnitPrice.valueOf()['value'].slice().replace('|textToFill|', '1232');
        expect(await (await this.browser.findElement(By.xpath(qtyOf1232Element))).getAttribute('title')).to.equal(
            '48'.toString(),
        );
        expect(await (await this.browser.findElement(By.xpath(priceOf1232Element))).getAttribute('title')).to.equal(
            '$48.00'.toString(),
        );
        //element 1232
        const qtyOf1231Element = this.ItemQtyBtItemCode.valueOf()['value'].slice().replace('|textToFill|', '1231');
        const priceOf1231Element = this.TotalUnitPrice.valueOf()['value'].slice().replace('|textToFill|', '1231');
        expect(await (await this.browser.findElement(By.xpath(qtyOf1231Element))).getAttribute('title')).to.equal(
            '48'.toString(),
        );
        expect(await (await this.browser.findElement(By.xpath(priceOf1231Element))).getAttribute('title')).to.equal(
            '$48.00'.toString(),
        );

        return await this.getOrderIdFromCart();
    }

    public async getOrderIdFromCart(): Promise<string> {
        await this.browser.click(this.OrderDeatilsMenu);
        await this.browser.sleep(1500);
        await this.browser.click(this.OrderDetailsBtn);
        this.browser.sleep(1000);
        await this.isSpinnerDone();
        const idToReturn = await (
            await this.browser.findElement(this.IdElementOfOrder)
        ).getAttribute('title');
        await this.browser.click(By.css("[data-qa='cancelButton']"));
        this.browser.sleep(1000);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        return idToReturn;
    }

    public async submitOrder(): Promise<void> {
        await this.browser.sleep(1000);
        await this.browser.click(this.SubmitOrderCartBtn);
        await this.isSpinnerDone();
        const homePage = new WebAppHomePage(this.browser);
        await expect(homePage.untilIsVisible(homePage.Main, 90000)).eventually.to.be.true;
    }
}

class UomUIObject {
    public readonly everyItemXpathPrefix: string = "//span[@title='|textToFill|']/../../../../../../..";
    public aoqmUom1: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM1']`);
    public aoqmUom1PlusQtyButton: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_plus']`);
    public aoqmUom1MinusQtyButton: Locator = By.xpath(`${this.everyItemXpathPrefix}//pep-icon[@name='number_minus']`);
    public aoqmUom1Qty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity1']`);
    public aoqmUom2: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@title='AOQM_UOM2']`);
    public aoqmUom2PlusQtyButton: Locator = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_plus'])[2]`);
    public aoqmUom2MinusQtyButton: Locator = By.xpath(`(${this.everyItemXpathPrefix}//pep-icon[@name='number_minus'])[2]`);
    public aoqmUom2Qty: Locator = By.xpath(`${this.everyItemXpathPrefix}//input[@name='TSAAOQMQuantity2']`);
    public wholeItemQty: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@class='ellipsis']`);
    public itemGrandTotal: Locator = By.xpath(`${this.everyItemXpathPrefix}//span[@id='TransactionGrandTotal']`);
    public SubmitToCart: Locator = By.css('[data-qa=cartButton]');

    constructor(idOfWUomElement: string) {
        this.aoqmUom1PlusQtyButton.valueOf()['value'] = this.aoqmUom1PlusQtyButton.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1MinusQtyButton.valueOf()['value'] = this.aoqmUom1MinusQtyButton.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1Qty.valueOf()['value'] = this.aoqmUom1Qty.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2PlusQtyButton.valueOf()['value'] = this.aoqmUom2PlusQtyButton.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2Qty.valueOf()['value'] = this.aoqmUom2Qty.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.wholeItemQty.valueOf()['value'] = this.wholeItemQty.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.itemGrandTotal.valueOf()['value'] = this.itemGrandTotal.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom1.valueOf()['value'] = this.aoqmUom1.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
        this.aoqmUom2.valueOf()['value'] = this.aoqmUom2.valueOf()['value'].slice().replace('|textToFill|', idOfWUomElement);
    }
}