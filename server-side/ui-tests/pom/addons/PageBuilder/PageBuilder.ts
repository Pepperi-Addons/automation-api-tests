import { By } from 'selenium-webdriver';
import { AddonPage } from '../base/AddonPage';

export class PageBuilder extends AddonPage {
    public PageBuilder_Title: By = By.xpath('//span[@title="Page Builder"]');
    public AddPage_Button: By = By.xpath('//span[@title="Add a Page"]/ancestor::pep-button');
    // Add a new Page
    public SelectPage_Title: By = By.xpath('//span[@title="Select a Page"]');
    public BlankTemplatePage: By = By.xpath('//*[text()="Blank"]/parent::div[contains(@class,"page-cube-inner")]');
    // Edit a Page
    public EditMenu_Button_Publish: By = this.getSelectorOfButtonAtEditPageByDataQa('Publish'); //By.xpath('//button[@data-qa="Publish"]');
    public EditMenu_Button_Save: By = this.getSelectorOfButtonAtEditPageByDataQa('Save'); //By.xpath('//button[@data-qa="Save"]');
    public EditMenu_Button_Preview: By = this.getSelectorOfButtonAtEditPageByDataQa('Preview'); //By.xpath('//button[@data-qa="Preview"]');
    public EditMenu_Button_Hamburger: By = By.xpath('//pep-menu //button[@mat-button]');
    public SideBar_ArrowBack_Button: By = By.xpath('//pep-button[contains(@class,"back-button")]');
    public SideBar_PageName_TextInput: By = By.xpath('//input[@type="text"][contains(@id,"mat-input-")]');
    public SideBar_PageDescription_Textarea: By = By.xpath('//textarea[contains(@id,"mat-input-")]');
    // Add Section
    public EditSideBar_AddSection_Button: By = this.getSelectorOfButtonAtEditPageByDataQa('Add Section'); //By.xpath('//button[@data-qa="Add Section"]');
    public Section_Frame: By = By.xpath('//div[contains(@id,"_column_")]');

    private getSelectorOfButtonAtEditPageByDataQa(title: string) {
        return By.xpath(`//button[@data-qa="${title}"]`);
    }
}
