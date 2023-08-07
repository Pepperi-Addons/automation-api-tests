import { By } from 'selenium-webdriver';
import { AddonPage } from '../../..';
import { expect } from 'chai';

export class StorybookComponent extends AddonPage {
    public IframeElement: By = By.xpath(`//iframe`);
    public MainExample_content: By = By.xpath(`//div[contains(@id,'#placeholder')]//div[contains(@id,'#placeholder')]`);
    public MainHeader: By = By.xpath(`//h1[contains(@class,'title')]`);
    public InputsRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="inputs"]/ancestor::tr/following-sibling::tr`,
    );
    public OutputRow: By = By.xpath(
        `//div[contains(@class,"css")]//table//tbody//span[text()="outputs"]/ancestor::tr/following-sibling::tr`,
    );
    public InputTitle: By = By.xpath(`${this.InputsRow.value}/td[1]/span`);
    public OutputTitle: By = By.xpath(`${this.OutputRow.value}/td[1]/span`);

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
        // debugger
        const propertiesIndex = cleanedFromOutputs_inputTitles.findIndex((element) => {
            return element === 'properties';
        });
        console.info('propertiesIndex: ', propertiesIndex);
        // debugger
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
        return outputTitles;
    }
}
