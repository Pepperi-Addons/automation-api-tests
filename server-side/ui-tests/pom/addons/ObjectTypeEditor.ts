import { expect } from 'chai';
import addContext from 'mochawesome/addContext';
import { By, Key, Locator } from 'selenium-webdriver';
import { AddonPage, WebAppDialog, WebAppHeader, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import GeneralService, { ConsoleColors } from '../../../services/general.service';
import { ImportExportATDService } from '../../../services/import-export-atd.service';
import { ObjectsService } from '../../../services/objects.service';
import { AddonLoadCondition, SelectOption, SelectPostAction } from './base/AddonPage';
import { v4 as uuidv4 } from 'uuid';

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

export class ObjectTypeEditor extends AddonPage {
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

    //evgeny::field editing btn
    public FieldEditingBtn: Locator = By.xpath("//td[@title='|textToFill|']/..//span[contains(@class,'editPenIcon')]");
    //evgeny::view arrow icon
    public viewArrowIcon: Locator = By.xpath(
        "//div[@id='formContTemplate']//h3[contains(@class,'ui-accordion-header')]//span[contains(@class,'ui-icon')]",
    );

    public async selectPostAction(actionName: SelectPostAction): Promise<void> {
        //?
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
        //remain
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
        this.browser.sleep(2500);
        await this.browser.sendKeys(webAppDialog.EditorTextAreaInput, description + Key.TAB);
        await webAppDialog.selectDialogBoxByText('Save');

        const webAppList = new WebAppList(this.browser);

        //If not in new ATD, try to remove ATD and recreate new ATD
        try {
            //TODO: fix this for stage new behavior of error popup and refresh after
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
        //remain
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
        //remain
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
        //remain
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
        expect(await this.browser.untilIsVisible(this.AddonContainerATDEditorFieldsAddCustomArr, 125000)).to.be.true;
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
        await this.browser.click(this.EditScriptBtn);
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
    public async editATDCalculatedFieldScript(
        //remain
        fieldObj: Field,
        locatorForFieldType: Locator,
        nameOfFieldToEdit: string,
        scriptParam?: string,
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
        await this.browser.sleep(2000);
        expect(await this.isEditorTabVisible('DataCustomization')).to.be.true;

        //Validate Editor Page Loaded
        await this.browser.sleep(7500);
        expect(await this.browser.untilIsVisible(this.AddonContainerATDEditorFieldsAddCustomArr, 75000)).to.be.true;
        await this.browser.click(locatorForFieldType);
        const injectedFieldEditingBtn = this.FieldEditingBtn.valueOf()
            ['value'].slice()
            .replace('|textToFill|', nameOfFieldToEdit);
        await this.browser.click(By.xpath(injectedFieldEditingBtn));
        await this.browser.sleep(2000);
        await this.browser.click(this.EditScriptBtn);
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
    public async addFieldToATD(viewType: string, viewName: string): Promise<void> {
        //remain
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
        const arrowsArr = await this.browser.findElements(this.viewArrowIcon);
        for (let index = 0; index < buttonsArr.length; index++) {
            const element = buttonsArr[index];
            const childElementSpan = arrowsArr[index];
            const spanClasses = await childElementSpan.getAttribute('class');
            if ((await element.getText()).includes(viewType) && spanClasses.includes('downArrowIcon')) {
                await element.click();
                break;
            }
        }
        const selectedBtn = Object.assign({}, this.AddonContainerATDEditorAddViewBtn);
        selectedBtn['value'] = `${selectedBtn['value'].replace(
            'VIEW_PLACE_HOLDER',
            viewName,
        )}/..//div[contains(@class, "plusIcon")]`;
        try {
            await this.browser.click(selectedBtn);
        } catch (error) {
            console.log(`%c${viewName} is already added and has no '+' button`, ConsoleColors.PageMessage);
        }
        await this.browser.switchToDefaultContent();
        await this.selectTabByText('General');
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
        //keep for now
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
}
