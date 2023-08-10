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
    public GenericFolder: By = By.xpath(`//button[contains(@data-item-id,"{placeholder}")]`);
    public GenericFolderById: By = By.xpath(`//button[@id="components-{placeholder}"]`);
    public GenericSubFolder: By = By.xpath(`//a[contains(@data-item-id,"{placeholder}")]`);
    public GenericSubFolderById: By = By.xpath(`//a[contains(@id,"{placeholder}")]`);
    public GenericStoryHeaderDiv: By = By.xpath(`//div[contains(@id,"{placeholder}")]`);
    public GenericStoryHeaderById: By = By.xpath(`//h3[contains(@id,"{placeholder}")]`);

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

    public async chooseFolder(folderName: string): Promise<void> {
        // choose abstract by name
        const xpathQueryForComponent: string = this.GenericFolderById.valueOf()['value'].replace(
            '{placeholder}',
            folderName,
        );
        await this.browser.click(By.xpath(xpathQueryForComponent));
        this.browser.sleep(5000);
    }

    public async chooseSubFolder(subFolderName: string): Promise<void> {
        // choose abstract by name
        const xpathQueryForComponent: string = this.GenericSubFolderById.valueOf()['value'].replace(
            '{placeholder}',
            subFolderName,
        );
        // console.info('at chooseSubFolder -> xpathQueryForComponent: ', xpathQueryForComponent);
        await this.browser.click(By.xpath(xpathQueryForComponent));
        this.browser.sleep(5000);
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
            | 'quantity-selector'
            | 'query-builder'
            | 'rich-html-textarea'
            | 'search'
            | 'select-panel'
            | 'select'
            | 'separator'
            | 'signature'
            | 'skeleton-loader'
            | 'slider'
            | 'smart-filters'
            | 'textarea'
            | 'textbox',
    ): Promise<void> {
        // choose component by name
        // let xpathQueryForComponent: string;
        // if (componentName === 'textarea' || componentName === 'select') {
        //     xpathQueryForComponent = this.GenericFolderById.valueOf()['value'].replace('{placeholder}', componentName);
        // } else {
        //     xpathQueryForComponent = this.GenericComponentButton.valueOf()['value'].replace(
        //         '{placeholder}',
        //         componentName,
        //     );
        // }
        // await this.browser.click(By.xpath(xpathQueryForComponent));
        // this.browser.sleep(5000);
        switch (componentName) {
            case 'query-builder':
            case 'smart-filters':
                await this.chooseSubFolder(componentName);
                break;

            default:
                await this.chooseFolder(componentName);
                break;
        }
    }

    public async chooseAbstract(
        abstractName:
            | 'intro'
            | 'border-radius'
            | 'breakpoints'
            | 'colors'
            | 'shadows'
            | 'spacing'
            | 'states'
            | 'typography'
            | 'z-index',
    ): Promise<void> {
        // choose abstract by name
        // const xpathQueryForComponent: string = this.GenericSubFolder.valueOf()['value'].replace(
        //     '{placeholder}',
        //     abstractName,
        // );
        // await this.browser.click(By.xpath(xpathQueryForComponent));
        // this.browser.sleep(5000);
        switch (abstractName) {
            case 'intro':
            case 'colors':
            case 'typography':
                await this.chooseFolder(abstractName);
                break;

            default:
                await this.chooseSubFolder(abstractName);
                break;
        }
    }

    public async getStorySelectorByText(storyIndex: number, txt: string) {
        const selector =
            this.GenericStoryHeaderDiv.value.replace('{placeholder}', `--story-${storyIndex}`) +
            this.GenericStoryHeaderById.value.replace('{placeholder}', txt);
        console.info('at getStorySelectorByText -> selector: ', selector);
        return By.xpath(selector);
    }
}
