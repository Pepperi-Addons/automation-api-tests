import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Page } from './base/Page';
import { StoryBookInpus } from './StoryBookInputs';

export class StoryBookPage extends Page {
    public inputs: StoryBookInpus;
    public ChooseBuildDropDown: By = By.xpath(`//span[@role='button' and @trigger='click']`);
    public LatestBuildDropDownOption: By = By.xpath(
        `(//span[@role='presentation']//span[contains(text(),'Build')])[1]`,
    );
    public ViewStoryBookButton: By = By.xpath(`//span[contains(text(),'View Storybook')]`);
    public GenericComponentButton: By = By.xpath(`//button[contains(@data-item-id,"{placeholder}")]`);
    public GenericFolderById: By = By.xpath(`//button[@id="components-{placeholder}"]`);
    public GenericAbstractButton: By = By.xpath(`//a[contains(@data-item-id,"{placeholder}")]`);

    public CanvasTab: By = By.xpath(`//button[contains(text(),"Canvas")]`);
    public BorderRadiusContainer: By = By.xpath(`//storybook-border-radius`);
    public BorderRadiusInnerContainer: By = By.xpath(`//storybook-border-radius/div/div`);
    public BorderRadiusSM: By = By.xpath(`//storybook-border-radius/div/div/div[1]`);
    public BorderRadiusMD: By = By.xpath(`//storybook-border-radius/div/div/div[2]`);
    public BorderRadiusL: By = By.xpath(`//storybook-border-radius/div/div/div[3]`);
    public BorderRadiusXL: By = By.xpath(`//storybook-border-radius/div/div/div[4]`);
    public StorybookIframe: By = By.css('iframe#storybook-preview-iframe');

    constructor(browser: Browser) {
        super(browser, 'https://www.chromatic.com/library?appId=60ae3e9eff8e4c003b2f90d4&branch=master');
        this.inputs = new StoryBookInpus(browser);
    }

    public async navigateToStoryBook(): Promise<void> {
        return await this.browser.navigate(super.url);
    }

    public async chooseLatestBuild(): Promise<void> {
        //should change the branch too?
        //1. open drop down component
        await this.browser.click(this.ChooseBuildDropDown);
        //2. choose latest build
        await this.browser.click(this.LatestBuildDropDownOption);
        this.browser.sleep(5000);
    }

    public async enterTableOfContents() {
        // enter storybook
        await this.browser.click(this.ViewStoryBookButton);
        await this.browser.switchToOtherTab(1);
        this.browser.sleep(2 * 1000);
    }

    public async chooseComponent(
        componentName:
            | 'attachment'
            | 'button'
            | 'checkbox'
            | 'chips'
            | 'color-picker'
            | 'date-time'
            | 'draggable-items'
            | 'group-buttons'
            | 'icon'
            | 'image'
            | 'image-filmstrip'
            | 'link'
            | 'menu'
            | 'quantity-selector' // written like that so 'select' won't be chosen (DO NOT change to 'quantity-selector'!)
            | 'rich-html-textarea' // written like that so 'textarea' won't be chosen (DO NOT change to 'rich-html-textarea'!)
            | 'search'
            | 'select-panel' // written like that so 'select' won't be chosen (DO NOT change to 'select-panel'!)
            | 'select'
            | 'separator'
            | 'signature'
            | 'skeleton-loader'
            | 'slider'
            | 'textarea'
            | 'textbox'
            | 'colors'
            | 'typography',
    ): Promise<void> {
        // choose component by name
        let xpathQueryForComponent: string;
        if (componentName === 'textarea' || componentName === 'select') {
            xpathQueryForComponent = this.GenericFolderById.valueOf()['value'].replace('{placeholder}', componentName);
        } else {
            xpathQueryForComponent = this.GenericComponentButton.valueOf()['value'].replace(
                '{placeholder}',
                componentName,
            );
        }
        await this.browser.click(By.xpath(xpathQueryForComponent));
        this.browser.sleep(5000);
    }

    public async chooseAbstract(
        abstractName:
            | 'border-radius'
            | 'breakpoints'
            | 'shadows'
            | 'spacing'
            | 'states'
            | 'z-index'
            | 'query-builder'
            | 'smart-filters'
            | 'dialog',
    ): Promise<void> {
        // choose abstract by name
        const xpathQueryForComponent: string = this.GenericAbstractButton.valueOf()['value'].replace(
            '{placeholder}',
            abstractName,
        );
        await this.browser.click(By.xpath(xpathQueryForComponent));
        this.browser.sleep(5000);
    }
}
