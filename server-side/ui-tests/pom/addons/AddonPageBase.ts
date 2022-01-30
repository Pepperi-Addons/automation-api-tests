import { Browser } from '../../utilities/browser';
import { Page } from '../base/page';
import config from '../../../config';
import { Locator, By, WebElement, Key } from 'selenium-webdriver';
import { WebAppHeader } from '../WebAppHeader';
import { WebAppDialog, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '../index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../../services/general.service';
import { ObjectsService } from '../../../services/objects.service';
import { ImportExportATDService } from '../../../services/import-export-atd.service';
import { v4 as uuidv4 } from 'uuid';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { OrderPageItem } from '../OrderPage';

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

export class AddonPageBase extends Page {
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
    public FieldAddingTitle: Locator = By.xpath("//h3[text()='Add Custom Field']");
    public CalculatedFieldCheckBox: Locator = By.xpath("//input[@value='CalculatedField']");
    public TextInputElements: Locator = By.xpath("//input[@type='text' and @class='field textbox long roundCorner']");
    public EditFieldScriptBtn: Locator = By.xpath("//a[@name='edit']");
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
     * @param fieldObj Type that contain the field Label and JS formula if needed
     * @param isTransLine Optional variable to indicate whether the field about to be edited is a transaction line field
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
     * @param scriptParam Optional variable which indicates which script sys param should be added - if it is needed
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
        expect(await this.browser.untilIsVisible(this.AddonContainerATDEditorFieldsAddCustomArr, 105000)).to.be.true;
        if (isTransLine) {
            await this.browser.click(this.AddonContainerATDEditorFieldsAddCustomArr, 1);
        } else {
            await this.browser.click(this.AddonContainerATDEditorFieldsAddCustomArr, 0);
        }
        expect(await this.browser.untilIsVisible(this.FieldAddingTitle, 45000)).to.be.true;

        if (fieldType) {
            const xpathQueryForFieldTypeBtn: string = this.FeildTypeButton.valueOf()['value'].replace(
                '|textToFill|',
                fieldType,
            );
            await this.browser.click(By.xpath(xpathQueryForFieldTypeBtn));
        }

        await this.browser.click(this.CalculatedFieldCheckBox);
        await this.browser.sendKeys(this.TextInputElements, fieldObj.Label, 0);
        await this.browser.click(this.EditFieldScriptBtn);
        await this.browser.sleep(7800);
        expect(await this.browser.untilIsVisible(this.ScriptEditingTitle, 85000)).to.be.true;

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
        await this.browser.sendKeys(this.CodeInputSection, fieldObj.CalculatedRuleEngine?.JSFormula as string, 0, 6000);
        await this.browser.click(this.SubmitScriptBtn);
        await this.browser.click(this.SaveFieldBtn);
        expect(await this.browser.findElement(this.AddonContainerATDEditorFieldsAddCustomArr));
        return;
    }

    /**
     *
     * @param fieldObj Type that contains the field Label and optional JS formula
     * @param scriptParam Optional variable which indicates which script sys param should be added - if any
     * @returns
     */
    public async editATDCalculatedFieldScript(fieldObj: Field, scriptParam?: string): Promise<void> {
        //Wait for all Ifreames to load after the main Iframe finished before switching between freames.
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();

        await this.selectTabByText('Fields');
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        await this.browser.sleep(2000);
        expect(await this.isEditorTabVisible('DataCustomization')).to.be.true;

        //Validate Editor Page Loaded
        await this.browser.sleep(7500);
        expect(await this.browser.untilIsVisible(this.AddonContainerATDEditorFieldsAddCustomArr, 75000)).to.be.true;
        await this.browser.click(By.xpath("//div[text()='Custom Transaction line-item Fields']"));
        await this.browser.click(By.xpath("//td[@title='ItemConfig']/..//span[contains(@class,'editPenIcon')]"));
        await this.browser.sleep(2000);
        await this.browser.click(this.EditFieldScriptBtn);
        await this.browser.sleep(6800);
        expect(await this.browser.untilIsVisible(this.ScriptEditingTitle, 55000)).to.be.true;

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
        await this.browser.sendKeys(this.CodeInputSection, fieldObj.CalculatedRuleEngine?.JSFormula as string, 0, 6000);
        await this.browser.click(this.SubmitScriptBtn);
        await this.browser.click(this.SaveFieldBtn);
        await this.browser.sleep(10500);
        expect(await this.browser.findElement(this.AddonContainerATDEditorFieldsAddCustomArr));
        return;
    }

    /**
     *
     * @param viewName The name of the view group
     * @param viewType The name of the view
     * @param addingViewLocator Optinal variable - locator for adding a view button other than default 'plusIcon'
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
        await webAppHomePage.returnToHomePage();
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
        await webAppHomePage.returnToHomePage();
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
                const xpathQueryForList: string = this.CategoryListItem.valueOf()
                ['value'].slice()
                    .replace('|textToFill|', itemKesyUomItems[i]);
                const locatorForCategoryList: Locator = By.xpath(xpathQueryForList);
                await this.browser.click(locatorForCategoryList);
            }
        }
        await this.browser.click(this.CategoryListOKBtn);
        const webAppHomePage = new WebAppHomePage(this.browser);
        await webAppHomePage.returnToHomePage();
        return;
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

    public async setFieldsInUIControl(...nameToSearch: string[]): Promise<void> {
        for (let i = 0; i < nameToSearch.length; i++) {
            await this.setFieldToUIControl(nameToSearch[i]);
        }
    }

    public async setFieldToUIControl(nameToSearch: string): Promise<void> {
        await this.browser.sendKeys(By.xpath("//input[@id='txtSearchBankFields']"), nameToSearch + Key.ENTER);
        this.browser.sleep(1500);
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

    public async getOrderIdFromActivitys(nameOfATD: string): Promise<string> {
        await this.browser.click(By.xpath(`//button[@title='Activities']`));
        await this.browser.sleep(1500);
        const webAppList = new WebAppList(this.browser);
        await webAppList.isSpinnerDone();
        await webAppList.validateListRowElements();
        const orderId = (
            await (
                await this.browser.findElement(
                    By.xpath(`//span[@id='Type' and text()='${nameOfATD}']/../../div//a//span`),
                )
            ).getText()
        ).trim();
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

    public async EditItemConfigFeld(nameOfATD: string): Promise<void> {
        const webAppHeader = new WebAppHeader(this.browser);
        await this.browser.click(webAppHeader.Settings);
        await this.browser.sleep(1500);
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorTransactions);
        await this.isSpinnerDone();
        await this.browser.sleep(4000);
        await this.browser.click(
            By.xpath(
                `//span[@id='Name' and contains(text(),'${nameOfATD}')]/../../../../../preceding-sibling::mat-radio-button`,
            ),
        );
        await this.browser.sleep(1500);
        await this.browser.click(By.xpath("//div[@class='menu-container ng-tns-c144-2']"));
        await this.browser.sleep(3000);
        await this.browser.click(By.xpath("//button[@title='Edit']"));
        await this.browser.sleep(1500);
        await this.browser.switchTo(this.AddonContainerIframe);
        await this.isAddonFullyLoaded(AddonLoadCondition.Footer);
        expect(await this.isEditorHiddenTabExist('DataCustomization', 45000)).to.be.true;
        expect(await this.isEditorTabVisible('GeneralInfo')).to.be.true;
        await this.browser.switchToDefaultContent();
        await this.editATDCalculatedFieldScript({
            Label: 'ItemConfig',
            CalculatedRuleEngine: {
                JSFormula: `const res = [];

                    res.push(
                      {"UOMKey": "SIN", "Factor": 3, "Min": 2, "Case": 1, "Decimal": 0, "Negative":true},
                      {"UOMKey": "Bx", "Factor": 2, "Min": 1, "Case": 2, "Decimal": 3, "Negative":false},
                      {"UOMKey": "DOU", "Factor": 1, "Min": 10, "Case": 5, "Decimal": 1, "Negative":true}
                    );
                  
                  return JSON.stringify(res);`,
            },
        });
    }
}
