import { By } from 'selenium-webdriver';
import { AddonPage } from '../../..';
import { expect } from 'chai';

export class StorybookComponent extends AddonPage {
    public IframeElement: By = By.xpath(`//iframe`);
    public DocsDiv: By = By.xpath(`//div[contains(@class, 'sbdoc')]`);
    public MainExample_BigBoxDiv: By = By.xpath(`//div[@id="anchor--components-{placeholder}--story-1"]`);
    public MainExample_content: By = By.xpath(`//div[contains(@id,'#placeholder')]//div[contains(@id,'#placeholder')]`);
    public MainHeader: By = By.xpath(`//h1[contains(@class,'title')]`);
    public ResetControlsButton: By = By.xpath(`//button[@title="Reset controls"]`);
    public InputsRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="inputs"]/ancestor::tr/following-sibling::tr`,
    );
    public OutputRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="outputs"]/ancestor::tr/following-sibling::tr`,
    );
    public MethodRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="methods"]/ancestor::tr/following-sibling::tr`,
    );
    public PropertyRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="properties"]/ancestor::tr/following-sibling::tr`,
    );
    public InputTitle: By = By.xpath(`${this.InputsRow.value}/td[1]/span`);
    public OutputTitle: By = By.xpath(`${this.OutputRow.value}/td[1]/span`);
    public MethodTitle: By = By.xpath(`${this.MethodRow.value}/td[1]/span`);
    public PropertyTitle: By = By.xpath(`${this.PropertyRow.value}/td[1]/span`);

    public async getMainExampleContentSelecor(componentText: string): Promise<By> {
        return By.xpath(`//div[contains(@id,'anchor')]//div[contains(@id,'${componentText}')]`);
    }

    public async getInputRowSelectorByName(inputTitle: string): Promise<By> {
        return By.xpath(`${this.InputTitle.value}[text()='${inputTitle}']`);
    }

    public async isCorrectMainExampleShown(componentText: string): Promise<boolean> {
        return (
            (await this.browser.isElementLocated(await this.getMainExampleContentSelecor(componentText))) &&
            (await this.browser.isElementVisible(await this.getMainExampleContentSelecor(componentText)))
        );
    }

    public async getHeaderText(): Promise<string> {
        const header = await this.browser.findElement(this.MainHeader);
        return (await header.getText()).trim();
    }

    public async doesComponentFound(componentString: string, expectedHeader: string): Promise<void> {
        await this.browser.switchTo(this.IframeElement);
        const header = await this.getHeaderText();
        const correctMainExample = await this.isCorrectMainExampleShown(componentString);
        expect(header).equals(expectedHeader);
        expect(correctMainExample).to.be.true;
    }

    public async getInputsTitles(): Promise<string[]> {
        const inputTitlesElements = await this.browser.findElements(this.InputTitle);
        const inputTitles = await Promise.all(
            inputTitlesElements.map(async (titleElement) => {
                return await titleElement.getText();
            }),
        );
        const outputsIndex = inputTitles.findIndex((element) => {
            return element === 'OUTPUTS';
        });
        console.info('outputsIndex: ', outputsIndex);
        const cleanedFromOutputs_inputTitles = outputsIndex !== -1 ? inputTitles.splice(0, outputsIndex) : inputTitles;
        const propertiesIndex = cleanedFromOutputs_inputTitles.findIndex((element) => {
            return element === 'PROPERTIES';
        });
        console.info('propertiesIndex: ', propertiesIndex);
        const cleanedFromProperties_inputTitles =
            propertiesIndex !== -1
                ? cleanedFromOutputs_inputTitles.splice(0, propertiesIndex)
                : cleanedFromOutputs_inputTitles;
        return cleanedFromProperties_inputTitles;
    }

    public async getOutputsTitles(): Promise<string[]> {
        const outputTitlesElements = await this.browser.findElements(this.OutputTitle);
        const outputTitles = await Promise.all(
            outputTitlesElements.map(async (titleElement) => {
                return await titleElement.getText();
            }),
        );
        const methodsIndex = outputTitles.findIndex((element) => {
            return element === 'METHODS';
        });
        const cleanedFromMethods_outputTitles =
            methodsIndex !== -1 ? outputTitles.splice(0, methodsIndex) : outputTitles;
        return cleanedFromMethods_outputTitles;
    }

    public async getMethodsTitles(): Promise<string[]> {
        const methodsTitlesElements = await this.browser.findElements(this.MethodTitle);
        const methodsTitles = await Promise.all(
            methodsTitlesElements.map(async (titleElement) => {
                return await titleElement.getText();
            }),
        );
        return methodsTitles;
    }

    public async getPropertiesTitles(): Promise<string[]> {
        const propertiesTitlesElements = await this.browser.findElements(this.PropertyTitle);
        const propertiesTitles = await Promise.all(
            propertiesTitlesElements.map(async (titleElement) => {
                return await titleElement.getText();
            }),
        );
        const outputsIndex = propertiesTitles.findIndex((element) => {
            return element === 'OUTPUTS';
        });
        console.info('outputsIndex: ', outputsIndex);
        const cleanedFromOutputs_propertiesTitles =
            outputsIndex !== -1 ? propertiesTitles.splice(0, outputsIndex) : propertiesTitles;
        return cleanedFromOutputs_propertiesTitles;
    }
}
