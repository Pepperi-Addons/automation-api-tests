import { By, Key } from 'selenium-webdriver';
import { AddonPage } from '../../..';
import { expect } from 'chai';

export class StorybookComponent extends AddonPage {
    public IframeElement: By = By.xpath(`//iframe`);
    public DocsDiv: By = By.xpath(`//div[contains(@class, 'sbdoc')]`);
    public MainExample_BigBoxDiv: By = By.xpath(`//div[@id="anchor--components-{placeholder}--story-1"]`);
    public MainExample_content: By = By.xpath(`//div[contains(@id,'#placeholder')]//div[contains(@id,'#placeholder')]`);
    public MainHeader: By = By.xpath(`//h1[contains(@class,'title')]`);
    public MandatoryIcon: By = By.xpath(`//pep-icon[@name="system_must"]`);
    public PepTitle: By = By.xpath(`//pep-field-title`);
    public PepCheckboxContainer: By = By.xpath(`//div[contains(@class,'pep-checkbox-container')]`);
    public PepChipsAlignmentElement: By = By.xpath(`//pep-field-title/div`);
    public PepSeparatorContainer: By = By.xpath(`//pep-separator//div[@title="Separator"]`);
    public ResetControlsButton: By = By.xpath(`//button[@title="Reset controls"]`);
    public Inputs_mainTableRow: By = By.xpath('//tr[contains(@title," inputs items")]');
    public Outputs_mainTableRow: By = By.xpath('//tr[contains(@title," outputs items")]');
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
    public LabelTxtAlign: By = By.xpath(`//div[contains(@id,'{placeholder}')]//pep-field-title//div`);
    public OutputDefaultValue_byOutputName: By = By.xpath(
        `//span[text()="{placeholder}"]/parent::td/following-sibling::td[2]/span`,
    );
    public RowSpanControlInput: By = By.xpath(`//input[@id="control-rowSpan"]`);

    public async getMainExampleContentSelecor(componentText: string): Promise<By> {
        return By.xpath(`//div[contains(@id,'anchor')]//div[contains(@id,'${componentText}')]`);
    }

    public async getInputRowSelectorByName(inputTitle: string): Promise<By> {
        return By.xpath(`${this.InputTitle.value}[text()='${inputTitle}']`);
    }

    public async getOutputRowSelectorByName(outputTitle: string): Promise<By> {
        return By.xpath(`${this.OutputTitle.value}[text()='${outputTitle}']`);
    }

    public async getMethodRowSelectorByName(methodTitle: string): Promise<By> {
        return By.xpath(`${this.MethodTitle.value}[text()='${methodTitle}']`);
    }

    public async getPropertyRowSelectorByName(propertyTitle: string): Promise<By> {
        return By.xpath(`${this.PropertyTitle.value}[text()='${propertyTitle}']`);
    }

    public async getSelectorOfOutputDefaultValueByName(outputName: string): Promise<By> {
        return By.xpath(`//span[text()="${outputName}"]/parent::td/following-sibling::td[2]/span`);
    }

    public async getSelectorOfOutputControlByName(outputName: string): Promise<By> {
        return By.xpath(`//span[text()="${outputName}"]/parent::td/following-sibling::td[3]//textarea`);
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

    public async getTxtAlignmentByComponent(component: string) {
        let selector;
        let txtAlignVal;
        switch (component) {
            case 'checkbox':
                selector = By.xpath(
                    `${this.MainExample_BigBoxDiv.value.replace('{placeholder}', component)}${
                        this.PepCheckboxContainer.value
                    }`,
                );
                const txtAlignElement = await this.browser.findElement(selector);
                const txtAlignElementClasses = await txtAlignElement.getAttribute('class');
                txtAlignVal = txtAlignElementClasses.split('one-row')[1].split('-alignment')[0].trim();
                break;
            case 'separator':
                selector = By.xpath(
                    `${this.MainExample_BigBoxDiv.value.replace('{placeholder}', component)}${
                        this.PepSeparatorContainer.value
                    }`,
                );
                const sepTxtAlignElement = await this.browser.findElement(selector);
                const sepTxtAlignElementClasses = await sepTxtAlignElement.getAttribute('class');
                txtAlignVal = sepTxtAlignElementClasses.split('align-')[1].split(' ')[0].trim();
                break;

            default:
                selector = By.xpath(this.LabelTxtAlign.value.replace('{placeholder}', component));
                const txtAlignComp = await this.browser.findElement(selector);
                txtAlignVal = (await txtAlignComp.getAttribute('style')).split(':')[1];
                break;
        }
        return txtAlignVal;
    }

    public async changeRowSpanControl(toNum: number): Promise<void> {
        await this.browser.sendKeys(this.RowSpanControlInput, Key.CONTROL + 'a' + Key.DELETE);
        await this.browser.sendKeys(this.RowSpanControlInput, toNum + Key.ENTER);
        this.browser.sleep(1 * 1000);
    }
}
