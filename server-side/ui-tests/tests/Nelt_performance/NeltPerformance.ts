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
    public OptionsList: By = By.xpath('//div[@role="listbox"]');
    public VisitFlow_visits_container: By = By.xpath('//div[contains(@class,"visits-container")]');
    public VisitFlow_visits_selection: By = By.xpath('//div[contains(@class,"visit-selection")]');
    public VisitFlow_selection_header: By = By.xpath(
        '//div[contains(@class,"visit-selection")]/div[contains(@class,"header")]',
    );
    public VisitFlow_singleVisit_container: By = By.xpath('//div[contains(@class,"visit-container")]');
    public VisitFlow_singleVisit_step: By = By.xpath('//div[contains(@class,"group-steps")]//pep-button');
    public VisitFlow_StartButton: By = By.xpath('//div[contains(@class,"group-steps")]//pep-button');
    public VisitFlow_GroupButton_End_disabled: By = By.xpath(
        '//visit-details//div[contains(@class,"flow-groups")]//button[@data-qa="Kraj posete"][@disabled="true"]',
    );
    public VisitFlow_StartEnd_Form_indication: By = By.xpath('//div[@title="The Main Activity for the visit flow"]');
    public DatePicker_container: By = By.xpath('//mat-datetimepicker-content');
    public DatePicker_highlightedDate: By = By.xpath(
        `${this.DatePicker_container.value}//td[@role="button"][contains(@class,"active")]`,
    );
    public OrderItem_single_details: By = By.xpath('//virtual-scroller//mat-grid-list');
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
    public TopBar_Right_StartButtton_disabled: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="Start"][@disabled="true"]`,
    );
    public TopBar_Right_SubmitButtton_atCart: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="Submit"]`,
    );

    public TopBar_Right_PutOnHoldButtton_atCart: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[contains(@data-qa,"n Hold")]`,
    );

    public TopBar_Right_SendButtton_atCart: By = By.xpath(
        `${this.TopBar_RightContainer.value}//app-workflow//button[@data-qa="Send"]`,
    );

    public Information_popup: By = By.xpath(
        '//mat-dialog-container//div[contains(@id,"mat-dialog-title-")]/span[contains(text(),"Information")]',
    );
    public PepDialog: By = By.xpath('//mat-dialog-container//pep-dialog');
    public PepDialog_title: By = By.xpath(`${this.PepDialog.value}//div[contains(@id,"mat-dialog-title-")]/span`);
    public PepDialog_message: By = By.xpath(`${this.PepDialog.value}//div[contains(@class,"mat-dialog-content")]/div`);
    public PepDialog_buttonsContainer: By = By.xpath(
        `${this.PepDialog.value}//div[contains(@class,"mat-dialog-actions")]/div`,
    );
    public PepDialog_Cancel_button: By = By.xpath(
        '//mat-dialog-container//pep-dialog/div[3]//span[contains(text(),"Cancel")]/parent::button',
    );
    public PepDialog_Continue_button: By = By.xpath(
        '//mat-dialog-container//pep-dialog/div[3]//span[contains(text(),"Continue")]/parent::button',
    );

    // Specific selectors for Nelt //
    public NeltLogo_Home: By = By.xpath('//pepperi-header//nav//a[@id="navImgLogo"]');
    public Istek_roka_SpecificItem_DateSelect: By = By.xpath(
        '//pep-date//span[contains(@title,"Istek roka")]/parent::div',
    );
    public Ekstenzija_KL_bold_title: By = By.xpath('//mat-grid-tile//span[contains(@class,"block-with-text body-md")]');
    public Kartica_kupca_results_number: By = By.xpath('//div[contains(@class,"topBar")]//b[@id="results"]');
    public Kartica_kupca_table_cell: By = By.xpath('//table//tbody//td[contains(@class,"table-td-container")]');
    public Datum_ekstenzije_od_DateField: By = By.xpath('//input[@id="TSACreditLimitDateFrom"]');
    public Broj_dana_trajanja_ekstenzije_Field: By = By.xpath(
        '//mat-label[contains(@title,"Broj ")]/ancestor::pep-textbox//mat-form-field//input',
    );
    public Razlog_povrata_selectButton: By = By.xpath('//span[@id="TSAReturnReasonSelector"]/ancestor::pep-select/div');
    public Razlog_povecanja_DropdownOptionsField: By = By.xpath('//mat-select[@id="TSAReason"]');

    public Razlog_povecanja_OptionThatContainsWhiteSpace: By = By.xpath(
        `${this.OptionsList.value}//mat-option[contains(@id,"mat-option-")][contains(@title," ")]`,
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
    public InsightsLoaded_Indication_Chart_CanvasSVG: By = By.xpath(
        `//pep-remote-loader-element//benchmark-chart-element-00000000-0000-0000-0000-0da1a0de41e5//div[@id="canvas"]//*[local-name()='svg']`,
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

    public SmartFilter_Principal_Nestle_label: By = By.xpath(
        `//span[contains(text(),"Nestle")]/ancestor::label[contains(@class,"mat-checkbox-layout")]`,
    );
    public SmartFilter_Principal_Nestle_checkbox: By = By.xpath(
        `${this.SmartFilter_Principal_Nestle_label.value}//input[contains(@id,"mat-checkbox-")]/parent::span`,
    );
    public SmartFilter_Principal_Nestle_input_checked: By = By.xpath(
        `${this.SmartFilter_Principal_Nestle_label.value}//input[contains(@id,"mat-checkbox-")][@aria-checked="true"]`,
    );
    public SmartFilter_Principal_Nestle_num: By = By.xpath(
        `${this.SmartFilter_Principal_Nestle_label.value}//span[contains(@class,"mat-checkbox-label")]/div[contains(@class,"title")]/span[2]`,
    );
    public SmartFilter_Principal_ApplyButton: By = By.xpath(
        `${this.SmartFilter_Principal_Nestle_label.value}//span[contains(@class,"mat-checkbox-label")]/div[contains(@class,"title")]/span[2]`,
    );

    public getPepDialogButtonByText(text: string) {
        return By.xpath(`${this.PepDialog_buttonsContainer.value}//span[contains(text(),"${text}")]/parent::button`);
    }

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
        return By.xpath(`//pep-smart-filters//span[@title="${name || ''}"]/ancestor::mat-expansion-panel`);
    }

    public getSelectorOfSmartFilterInnerFieldDropdownByName(filterName?: string, dropdownName?: string) {
        return By.xpath(
            `//span[@title="${filterName || ''}"]/ancestor::mat-expansion-panel//mat-label[contains(text(),"${
                dropdownName || ''
            }")]/ancestor::pep-select/mat-form-field/div/div`,
        );
    }

    public getSelectorOfSmartFilterButtonByName(filterName?: string, buttonText?: string) {
        return By.xpath(
            `//span[@title="${
                filterName || ''
            }"]/ancestor::mat-expansion-panel//pep-filter-actions//button[contains(text(),"${buttonText || ''}")]`,
        );
    }

    public getSelectorOfVisitFlowAtMultipleVisitsSelectionByText(text: string) {
        return By.xpath(`//div[contains(@class,"visit-selection")]//span[contains(@title,"${text}")]/ancestor::button`);
    }

    public getSelectorOfVisitGroupByText(text: string) {
        return By.xpath(`//div[contains(@class,"flow-groups")]//span[contains(@title,"${text}")]/ancestor::button`);
    }

    public getSelectorOfVisitStepByText(text: string) {
        return By.xpath(`//div[contains(@class,"group-steps")]//span[contains(@title,"${text}")]/ancestor::button`);
    }

    public getSelectorOfOrderCenterItemQuantitySelectorGridLineViewByIndex(index: number) {
        return By.xpath(`//pep-list//virtual-scroller/div[2]/div[${index}]//pep-form//input[@id="TSAAOQMQuantity1"]`);
    }

    public getSelectorOfOrderCenterItemOrderButtonGridLineViewByIndex(index: number) {
        return By.xpath(
            `//pep-list//virtual-scroller/div[2]/div[${index}]//pep-form//button[@id="TSAAOQMQuantity1"][@title="Order"]`,
        );
    }

    public getSelectorOfSpecificOrderCenterItemDateSelectByIndex(index: number) {
        return By.xpath(
            `//pep-list//virtual-scroller/div[2]/div[${index}]//pep-date//span[contains(@title,"Istek roka")]/parent::div`,
        );
    }

    public getSelectorOfSpecificOrderCenterItemExpiryDateByIndex(index: number) {
        return By.xpath(`//pep-list//virtual-scroller/div[2]/div[${index}]//pep-date//span[@id="TSAExpiryDate"]`);
    }

    public getSelectorOfMatOptionByText(text: string) {
        return By.xpath(`//span[contains(text(),"${text}")]/parent::mat-option`);
    }
}
