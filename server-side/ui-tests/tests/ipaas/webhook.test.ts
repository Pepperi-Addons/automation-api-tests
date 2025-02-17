import promised from 'chai-as-promised';
import chai from 'chai';
import {
    describe,
    it,
    // afterEach,
    before,
    after,
} from 'mocha';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../utilities/browser';
import { IpaasLoginPage } from '../../pom/Pages/IpaasLogin';
import { IpaasPage } from '../../pom/Pages/Ipaas';
import { IpaasClientTaskPage } from '../../pom/Pages/iPaasClientTask';

chai.use(promised);

/** Description **/
/* The Basic UI Test Flow for iPass 
    to run the test on PROD:
    npm run ui-show-report --server=prod --chrome_headless=false --user_email='webapp.qa@pepperitest.com' --user_pass='Aa123456' --var_pass='VarQA@pepperitest.com:8n@V5X' --tests='IpaasWebhook' --ipaas_email='ipaas.automation@qatest.com' --ipaas_pass='3V=xin:J1J@7'
*/
export async function IPaasWebhookTests(email: string, password: string) {
    const dateTime = new Date();

    let driver: Browser;
    let iPaasLoginPage: IpaasLoginPage;
    let iPaasPage: IpaasPage;
    let iPaasClientTaskPage: IpaasClientTaskPage;

    describe(`iPaaS WEBHOOK Test Suite | ${dateTime}`, async () => {
        describe('UI Tests', async () => {
            before(async function () {
                driver = await Browser.initiateChrome();
                iPaasLoginPage = new IpaasLoginPage(driver);
                iPaasPage = new IpaasPage(driver);
                iPaasClientTaskPage = new IpaasClientTaskPage(driver);
            });

            after(async function () {
                await driver.quit();
            });

            it('Login', async function () {
                // await driver.navigate('https://integration.pepperi.com/mgr');
                await iPaasLoginPage.navigateToLoginPage();
                driver.sleep(1 * 1000);
                let screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Login Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
                await iPaasLoginPage.performLogin(email, password);
                driver.sleep(1 * 1000);
                screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After Login Page`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Transaction Logs" at Top Menu', async function () {
                await iPaasPage.clickButtonAtTopMenuByText('Transaction Logs');
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Transaction Logs" button clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Search" at Top Menu', async function () {
                await iPaasPage.clickButtonAtTopMenuByText('Search');
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Search" button clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Client Tasks" on SearchBy List', async function () {
                await driver.click(await iPaasPage.getSelectorOfSearchByDropListItemByText('Client Tasks'));
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Client Task" button clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Task Details" on SearchBy Client Task lst', async function () {
                await driver.click(await iPaasPage.getSearchByDropListSubPropertyByText('Task Details'));
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Task Details" choosed from drop down`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Enter "DO NOT TOUCH" to TaskName field', async function () {
                await driver.sendKeys(iPaasPage.TaskName_textField, 'DO NOT TOUCH' + '\n');
                driver.sleep(1 * 1000);
                //await driver.sendKeys(Key.RETURN);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Task Name" field filled`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Select Task Type.."', async function () {
                await driver.click(iPaasPage.TaskType_dropList);
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Select Task Type" list button clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Enter "Webhook" to Task Type field', async function () {
                await driver.sendKeys(iPaasPage.TaskType_webook_from_dropList, 'Webhook' + '\n');
                driver.sleep(1 * 1000);
                //await driver.sendKeys(Key.RETURN);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Webhook" choosed from Task Type drop down`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Search" button on Task Details', async function () {
                await driver.click(iPaasPage.TaskDetails_search_button);
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Search" button on TaskDetails clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Open" button on DataFlows test', async function () {
                //debugger;
                await driver.click(iPaasPage.TaskDetails_open_button_triger_job_test);
                driver.sleep(1 * 1000);
                await driver.switchToOtherTab(1);
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Open" button on TaskDetails search results (Trigger Job - Test Dataflows) clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Webhook Tasks" on TopBar List', async function () {
                await driver.click(await iPaasClientTaskPage.getSelectorOfTopBarListElementByText('Webhook Tasks'));
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Webhook Tasks" TopBar element clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Trigger Job - Test Dataflows" on TopBar List', async function () {
                //debugger;
                await driver.click(
                    await iPaasClientTaskPage.getSelectorOfWebhookDropdownElementByText('Trigger Job - Test Dataflows'),
                );
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Trigger Job - Test Dataflows" Whebook dropdown element selected`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Settings" on Trigger Job Tab List', async function () {
                await driver.click(await iPaasClientTaskPage.getSelectorOfTabListElementByText('Settings'));
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Settings" TabList element clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "DO NOT TOUCH" button that opens script in a new tab', async function () {
                //debugger;
                await driver.click(iPaasClientTaskPage.OpenNewTab_TestScript_DoNotTouch);
                driver.sleep(1 * 1000);
                await driver.switchToOtherTab(2);
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "DO NOT TOUCH" button clicked a new tab opened`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            it('Click "Tasks" on Scheduled Jobs Tab List', async function () {
                await driver.click(await iPaasClientTaskPage.getSelectorOfScheduledJobsTabListElementByText('Tasks'));
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Tasks" TabList element clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });

            ['Test ASYNC Task', 'Test SQL task', 'Test JS Task', 'Test LISTENER Task', 'Trigger Test Webhook'].forEach(
                (task) => {
                    describe(`Run "${task}"`, async () => {
                        it(`Click "${task}" on Scheduled Jobs table`, async function () {
                            await driver.click(await iPaasClientTaskPage.getSelectorOfOpenNewTabButtonByTaskName(task));
                            driver.sleep(1 * 1000);
                            await driver.switchToOtherTab(3);
                            driver.sleep(1 * 1000);
                            const screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After table element clicked`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                        });

                        it('Click "Run Task Button"', async function () {
                            driver.sleep(2 * 1000);
                            await driver.click(await iPaasClientTaskPage.Run_Task_Button);
                            driver.sleep(1 * 1000);
                            await driver.switchToOtherTab(4);
                            const screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After "Run Task Button" element clicked`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                        });

                        it('Verify "Task completed successfully" message is displayed', async function () {
                            await driver.findElement(
                                await iPaasClientTaskPage.getSelectorOfSuccessfullyComplitedByTaskName(task),
                            );
                            driver.sleep(1 * 1000);
                            await driver.switchToOtherTab(4);
                            const screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `Verify "Task completed successfully"`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                        });

                        it('Close Tab', async function () {
                            await driver.close(); // closes new tab
                            driver.sleep(1 * 1000);
                            await driver.switchToOtherTab(3);
                            const screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After new TAB closed`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                        });

                        it('Close Tab', async function () {
                            await driver.close(); // closes new tab
                            driver.sleep(1 * 1000);
                            await driver.switchToOtherTab(2);
                            const screenShot = await driver.saveScreenshots();
                            addContext(this, {
                                title: `After new TAB closed`,
                                value: 'data:image/png;base64,' + screenShot,
                            });
                        });
                    });
                },
            );

            // it('', async function () {});
            // it('', async function () {});
            // it('', async function () {});
        });
    });
}
