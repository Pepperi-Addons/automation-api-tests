import { Browser } from '../../utilities/browser';
import { By } from 'selenium-webdriver';
import { Page } from './base/Page';

export class IpaasClientTaskPage extends Page {
    constructor(browser: Browser) {
        super(browser, 'https://integration.pepperi.com/mgr/PluginSettings/ClientTask?TaskId=97043');
    }
    public TopBar_List: By = By.xpath(`//span[@id="PluginSettingsMenuDiv"]/ul`);
    //span[@id="PluginSettingsMenuDiv"]/ul//span[contains(text(),"Webhook Tasks")]/ancestor::li
    //span[contains(text(),"Trigger Job - Test Dataflows")]/parent::a/parent::span/parent::div
    //ul[@role="tablist"]//span[contains(text(),"Settings")]/parent::li
    //div[@id="clientTaskMainSettingsWrapper"]//table//span[contains(text(),"Test Dataflows DO NOT TOUCH")]/following-sibling::span
    //table//span[contains(text(),"Tasks")]
    //span[text()="Test ASYNC Task"]/following-sibling::span[2]
    //span[@id="RunTaskButton"]//following-sibling::span
    //div[@id="taskLogsGrid"]/table//div[contains(text(),"Test ASYNC Task")]/parent::td/following-sibling::td[text() = "Task completed successfully"]
    public OpenNewTab_TestScript_DoNotTouch: By = By.xpath(
        `//div[@id="clientTaskMainSettingsWrapper"]//table//span[contains(text(),"Test Dataflows DO NOT TOUCH")]/following-sibling::span`,
    );

    public Run_Task_Button: By = By.xpath(`//span[@id="RunTaskButton"]`);

    public async getSelectorOfSuccessfullyComplitedByTaskName(name: string): Promise<By> {
        return By.xpath(
            `//div[@id="taskLogsGrid"]/table//div[contains(text(),"${name}")]/parent::td/following-sibling::td[text() = "Task completed successfully"]`,
        );
    }

    public async getSelectorOfTopBarListElementByText(text: string): Promise<By> {
        return By.xpath(`${this.TopBar_List.value}//span[contains(text(),"${text}")]/ancestor::li`);
    }

    public async getSelectorOfWebhookDropdownElementByText(text: string): Promise<By> {
        return By.xpath(`//span[contains(text(),"${text}")]/parent::a/parent::span/parent::div`);
    }

    public async getSelectorOfTabListElementByText(text: string): Promise<By> {
        return By.xpath(`//ul[@role="tablist"]//span[contains(text(),"${text}")]/parent::li`);
    }

    public async getSelectorOfScheduledJobsTabListElementByText(text: string): Promise<By> {
        return By.xpath(`//table//span[contains(text(),"${text}")]`);
    }

    public async getSelectorOfOpenNewTabButtonByTaskName(name: string): Promise<By> {
        return By.xpath(`//span[text()="${name}"]/following-sibling::span[2]`);
    }
}
