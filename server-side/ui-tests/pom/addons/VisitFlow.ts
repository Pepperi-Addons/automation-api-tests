import { By } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';

export class VisitFlow extends AddonPage {
    // *general selectors for Visit Flow*
    public VisitFlow_Content: By = By.xpath('//visit-details');
    public VisitFlow_Groups_Content: By = By.xpath('//div[contains(@class,"flow-groups")]');
    public VisitFlow_GroupButton_Start: By = this.getSelectorOfVisitFlowGroupButtonByName('Start'); //By.xpath('//visit-details//div[contains(@class,"flow-groups")]//pep-button//button[@data-qa="Start"]');
    public VisitFlow_GroupButton_Orders: By = this.getSelectorOfVisitFlowGroupButtonByName('Orders');
    public VisitFlow_GroupButton_End: By = this.getSelectorOfVisitFlowGroupButtonByName('End'); 
    public VisitFlow_Steps_Content: By = By.xpath('//div[contains(@class,"group-steps")]');
    public VisitFlow_StepButton_StartVisit: By = this.getSelectorOfVisitFlowStepButtonByName('Start Visit'); //By.xpath('//visit-details//div[contains(@class,"group-steps")]//pep-button//button[@data-qa="Start Visit"]');
    public VisitFlow_StepButton_SalesOrder: By = this.getSelectorOfVisitFlowStepButtonByName('Sales Order'); 
    public VisitFlow_StepButton_EndVisit: By = this.getSelectorOfVisitFlowStepButtonByName('End Visit');

    // Visit Flow Main Activity
    public VisitFlowMainActivity_FormPage_Header_CancelButton: By = By.xpath('//button[@data-qa="cancelButton"]');
    public VisitFlowMainActivity_FormPage_Header_SubmitButton: By = By.xpath('//button[@data-qa="Done"]');
    public VisitFlowMainActivity_FormPage_FormContent: By = By.xpath('//div[contains(@class,"pep-page-main-layout")]//div[contains(@class,"pep-main-area")]//div[contains(@class,"form-view")]');
    public VisitFlowMainActivity_FormPage_SubjectInput: By = By.xpath('//textarea[@id="TSASubject"]');
    public VisitFlowMainActivity_FormPage_VisitSummaryInput: By = By.xpath('//input[@id="TSASummary"]');
    
    // Main Activity "Cancel" Popup Dialog 
    public VisitFlowMainActivity_CancelDialog_Notice_Headline: By = By.xpath('//mat-dialog-container//span[contains(@class,"dialog-title")]');
    public VisitFlowMainActivity_CancelDialog_MessageText: By = By.xpath('//mat-dialog-container//div[contains(@class,"mat-dialog-content")]');
    public VisitFlowMainActivity_CancelDialog_SaveChanges_Button: By = this.getSelectorOfVisitFlowCancelDialogButtonByText('Save changes') //By.xpath('//mat-dialog-container//span[contains(text(),"Save changes")]/parent::button');
    public VisitFlowMainActivity_CancelDialog_DiscardChanges_Button: By = this.getSelectorOfVisitFlowCancelDialogButtonByText('Discard changes') //By.xpath('//mat-dialog-container//span[contains(text(),"Discard changes")]/parent::button');
    
    // Account Page - will be moved later
    public FirstAccountInList: By = By.xpath('//virtual-scroller//fieldset//span[@id="Name"]');
    public AccountHomePage_HamburgerMenu_Button: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button');
    public AccountHomePage_HamburgerMenu_Content: By = By.xpath('//div[contains(@id,"cdk-overlay-")]');
    public AccountHomePage_HamburgerMenu_VisitFlowSlug: By = By.xpath('//div[contains(@id,"cdk-overlay-")]//button[@title="VisitFlow"]');

    // Orders Choose Catalog Dialog - will be moved later
    public VisitFlow_OrdersChooseCatalogDialog_Content: By = By.xpath('//mat-dialog-container//div[contains(@class,"mat-dialog-content")]//selection-list//div[contains(@class,"pep-page-main-layout")]');
    public VisitFlow_OrdersChooseCatalogDialog_FirstCatalogInList_RadioButton: By = By.xpath('//mat-radio-button//span[contains(@class,"mat-radio-container")]');
    public VisitFlow_OrdersChooseCatalogDialog_SelectedCatalog_RadioButton: By = By.xpath('//mat-radio-button[contains(@class,"mat-radio-checked")]');
    public VisitFlow_OrdersChooseCatalogDialog_DoneButton: By = By.xpath('//button[@data-qa="done"]');

    // Catalog
    public VisitFlow_DefaultCatalog_OrderButton: By = By.xpath('//span[contains(text(),"Order")]/parent::span/parent::button');
    public VisitFlow_DefaultCatalog_CartButton: By = By.xpath('//button[@data-qa="cartButton"]');
    public VisitFlow_DefaultCatalog_SubmitButton: By = By.xpath('//button[@data-qa="Submit"]');

    public getSelectorOfVisitFlowGroupButtonByName(name: string) {
        return By.xpath(`//visit-details//div[contains(@class,"flow-groups")]//pep-button//button[@data-qa="${name}"]`);
    }

    public getSelectorOfVisitFlowStepButtonByName(name: string) {
        return By.xpath(`//visit-details//div[contains(@class,"group-steps")]//pep-button//button[@data-qa="${name}"]`);
    }

    public getSelectorOfVisitFlowCancelDialogButtonByText(text: string) {
        return By.xpath(`//mat-dialog-container//span[contains(text(),"${text}")]/parent::button`);
    }
}