import { By } from 'selenium-webdriver';
import { AddonPage } from '../../pom/addons/base/AddonPage';

export class NeltPerformance extends AddonPage {
    public Home: By = By.css('[data-qa="systemHome"]');
    public HamburgerMenuButtonAtHome: By = By.css('[data-qa="systemMenu"]');
    public Iframe: By = By.xpath('//iframe');
    public WebappIframe: By = By.xpath('//iframe[@id="webappiframe"]');
    public WebappIframe_closeButton: By = By.xpath(
        '//div[contains(@class,"mat-dialog-title")]//pep-icon[@name="system_close"]/ancestor::button',
    );
    public HomeMenuDropdown: By = By.xpath('//div[@role="menu"]');
    public pageGrandTotal: By = By.xpath("//span[@class='value']"); //order page
    public blankSpaceOnScreenToClick: By = By.xpath("//div[contains(@class,'total-items-container')]"); //order page
    public SubmitToCart: By = By.css('[data-qa=cartButton]'); //order
    public ChangeViewButton: By = By.xpath("//mat-icon[@title='Change View']");
    public ViewTypeOption: By = By.xpath(`//span[text()='|textToFill|']`);
    public KupciButtonAtHome: By = By.xpath('//button[@id="mainButton"]');
    public FirstAccountInList: By = By.xpath('//virtual-scroller//fieldset//span[@id="Name"]');
    public AccountDashboard_PlusButton: By = By.xpath('//list-menu[@data-qa="secondMenu"]//button');
    public AccountDashboard_BurgerMenu: By = By.xpath('//list-menu[@data-qa="firstMenu"]//button');
    public Image_Label: By = By.xpath(`//pep-list//label[@id="Image"]`);
    public ListNumberOfResults: By = By.xpath(`//list-total//span[contains(@class,"bold number")]`);
    public PepList: By = By.xpath(`//pep-list`);
    public ListRow: By = By.xpath(`//pep-list//virtual-scroller//fieldset[contains(@class,"table-row-fieldset")]`);
    public Search_Input: By = By.xpath('//input[@id="searchInput"]');
    public Search_Magnifier_Button: By = By.xpath('//search//pep-icon[@name="system_search"]');
    public Search_X_Button: By = By.xpath('//search//pep-icon[@name="system_close"]');
    public TransactionID: By = By.id('WrntyID');
    public TransactionUUID: By = By.id('UUID');
    public Cart_Button: By = By.xpath('//button[@data-qa="cartButton"]');
    public ContinueOrdering_Button: By = By.xpath('//button[@data-qa="Continue ordering"]');
    public VisitFlow_visits_container: By = By.xpath('//div[contains(@class,"visits-container")]');
    public VisitFlow_visits_selection: By = By.xpath('//div[contains(@class,"visit-selection")]');
    public VisitFlow_selection_header: By = By.xpath(
        '//div[contains(@class,"visit-selection")]/div[contains(@class,"header")]',
    );
    public VisitFlow_singleVisit_container: By = By.xpath('//div[contains(@class,"visit-container")]');
    public VisitFlow_singleVisit_step: By = By.xpath('//div[contains(@class,"group-steps")]//pep-button');
    public VisitFlow_StartButton: By = By.xpath('//div[contains(@class,"group-steps")]//pep-button');
    public DatePicker_container: By = By.xpath('//mat-datetimepicker-content');
    public DatePicker_highlightedDate: By = By.xpath(
        `${this.DatePicker_container.value}//td[@role="button"][contains(@class,"active")]`,
    );
    public PepMainArea: By = By.xpath('//div[contains(@class,"pep-main-area")]');
    public AccountDetails_component: By = By.xpath('//acc-details');
    public MatGridList: By = By.xpath(`${this.PepMainArea.value}//mat-grid-list`);
    public TopBarContainer: By = By.xpath('//div[contains(@class,"top-bar-container")]');
    public TopBar_LeftContainer: By = By.xpath(`${this.TopBarContainer.value}//div[contains(@class,"left-container")]`);
    public TopBar_RightContainer: By = By.xpath(
        `${this.TopBarContainer.value}//div[contains(@class,"right-container")]`,
    );
    public TopBar_Left_CancelButtton: By = By.xpath(
        `${this.TopBar_LeftContainer.value}//button[@data-qa="cancelButton"]`,
    );
    public TopBar_Right_DoneButtton: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="Done"]`,
    );
    public TopBar_Right_EndButtton: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="End"]`,
    );
    public TopBar_Right_StartButtton: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="Start"]`,
    );
    public Information_popup: By = By.xpath(
        '//mat-dialog-container//div[contains(@id,"mat-dialog-title-")]/span[contains(text(),"Information")]',
    );
    public PepDialog_message: By = By.xpath('//mat-dialog-container//pep-dialog/div[2]/div');
    public PepDialog_Cancel_button: By = By.xpath(
        '//mat-dialog-container//pep-dialog/div[3]//span[contains(text(),"Cancel")]/parent::button',
    );
    public PepDialog_Continue_button: By = By.xpath(
        '//mat-dialog-container//pep-dialog/div[3]//span[contains(text(),"Continue")]/parent::button',
    );

    // Specific selectors for Nelt //
    public Kartica_kupca_results_number: By = By.xpath('//div[contains(@class,"topBar")]//b[@id="results"]');
    public Kartica_kupca_table_cell: By = By.xpath('//table//tbody//td[contains(@class,"table-td-container")]');
    public Datum_ekstenzije_od_DateField: By = By.xpath('//input[@id="TSACreditLimitDateFrom"]');
    public Broj_dana_trajanja_ekstenzije_Field: By = By.xpath(
        '//mat-label[contains(@title,"Broj ")]/ancestor::pep-textbox//mat-form-field//input',
    );
    public Razlog_povecanja_DropdownOptionsField: By = By.xpath('//mat-select[@id="TSAReason"]');
    public Razlog_povecanja_OptionsList: By = By.xpath('//div[@role="listbox"]');
    public Razlog_povecanja_OptionThatContainsWhiteSpace: By = By.xpath(
        `${this.Razlog_povecanja_OptionsList.value}//mat-option[contains(@id,"mat-option-")][contains(@title," ")]`,
    );
    public OrderCatalogItem: By = By.xpath('//span[@id="Description"]/ancestor::mat-grid-list');
    public OrderCenterItem_OrderButton: By = By.xpath(
        '//pep-list//virtual-scroller//pep-form//mat-grid-list[contains(@class,"card")]//button[@id="TSAAOQMQuantity1"][@title="Order"]',
    );
    public OrderCenterItem_OrderButton_GridLineView: By = By.xpath(
        '//pep-list//virtual-scroller//pep-form//button[@id="TSAAOQMQuantity1"][@title="Order"]',
    );
    public OrderCenterItem_QuantitySelector_GridLineView: By = By.xpath(
        '//pep-list//virtual-scroller//pep-form//input[@id="TSAAOQMQuantity1"]',
    );
    public InsightsLoaded_Indication_Chart: By = By.xpath(
        '//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]',
    );
    public InsightsLoaded_Indication_ChartGraph: By = By.xpath(
        `//*[local-name()='g'][contains(@class,"apexcharts-series")]/*[local-name()='path']`,
    );
    public InsightsLoaded_Indication_Chart_SVG: By = By.xpath(
        `//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]//*[local-name()='svg']/*[local-name()='text']`,
    );
    public InsightsLoaded_Indication_Chart_SVGtext: By = By.xpath(
        `//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]//*[local-name()='svg']/*[local-name()='text'][contains(text(),"")]`,
    );
    public InsightsLoaded_Indication_Table: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//tbody//tr//td',
    );
    public InsightsLoaded_Indication_Table_Header: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//thead//tr//td[contains(text(),"")]',
    );
    public InsightsLoaded_Indication_Table_Header_Target: By = By.xpath(
        '//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//thead//tr//td[contains(text(),"Target")]',
    );
    public InsightsLoaded_Indication_GalleryCard: By = By.xpath(
        `//gallery-card//*[local-name()='svg']/*[local-name()='text']`,
    );
    public InsightsLoaded_Indication_GalleryCard_text: By = By.xpath(
        `//gallery-card//*[local-name()='svg']/*[local-name()='text']`,
    );
    // public InsightsLoaded_Indication_GalleryCard_text: By = By.xpath(
    //     `//gallery-card//*[local-name()='svg']/*[local-name()='text'][contains(text(),"")]`,
    // );
    public ResourceView_Indication_TableHeader_Label_Category: By = By.xpath(
        `//pep-list//fieldset[contains(@class,"table-header-fieldset")]//fieldset//label[@id="category"]`,
    );
    public ResourceView_Indication_TableHeader_Label_returnYTD: By = By.xpath(
        `//pep-list//fieldset[contains(@class,"table-header-fieldset")]//fieldset//label[@id="returnYTD"]`,
    );

    public getSelectorOfHomeHamburgerMenuItemByName(name: string) {
        return By.xpath(`//span[contains(text(),"${name}")]/parent::button[@role="menuitem"]`);
    }

    public getSelectorOfAccountHyperlinkByName(name: string) {
        return By.xpath(`//virtual-scroller//fieldset//span[@id="Name"][@title="${name}"]`);
    }

    public getSelectorOfAccountHyperlinkByID(id: number) {
        return By.xpath(
            `//virtual-scroller//fieldset//span[@id="ExternalID"][@title="${id}"]/ancestor::fieldset//pep-internal-button/a`,
        );
    }

    public getSelectorOfAccountDashboardPlusButtonMenuItemByName(name: string) {
        return By.xpath(`//button[@title="${name}"]`);
    }

    public getSelectorOfAccountDashboardHamburgerMenuItemByName(name: string) {
        return By.xpath(`//button[@title="${name}"]`);
    }

    public getSelectorOfOrderCatalogByName(name: string) {
        return By.xpath(`//span[@id="Description"][@title="${name}"]/ancestor::mat-grid-list`);
    }

    public getSelectorOfOrderCenterSideBarTreeItemByName(name: string) {
        return By.xpath(`//mat-tree//span[contains(text(),"${name}")]/ancestor::mat-tree-node`);
    }

    public getSelectorOfInsightsGalleryCardByText(text?: string) {
        return By.xpath(
            `//gallery-card//*[local-name()='svg']/*[local-name()='text'][contains(text(),"${text || ''}")]`,
        );
    }

    public getSelectorOfInsightsTableHeaderdByText(text?: string) {
        return By.xpath(
            `//pep-remote-loader-element//table-element-00000000-0000-0000-0000-0da1a0de41e5//thead//tr//td[contains(text(),"${
                text || ''
            }")]`,
        );
    }

    public getSelectorOfSmartFilterFieldByName(name?: string) {
        return By.xpath(`//pep-smart-filters//span[@title="${name}"]/ancestor::mat-expansion-panel`);
    }

    public getSelectorOfVisitFlowAtMultipleVisitsSelectionByText(text: string) {
        return By.xpath(`//div[contains(@class,"visit-selection")]//span[@title="${text}"]/ancestor::button`);
    }

    public getSelectorOfVisitGroupByText(text: string) {
        return By.xpath(`//div[contains(@class,"flow-groups")]//span[@title="${text}"]/ancestor::button`);
    }

    public getSelectorOfVisitStepByText(text: string) {
        return By.xpath(`//div[contains(@class,"group-steps")]//span[contains(@title,"${text}")]/ancestor::button`);
    }
}
