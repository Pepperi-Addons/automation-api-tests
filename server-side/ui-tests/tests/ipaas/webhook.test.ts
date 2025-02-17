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
import { IpaasClientTaskPage } from '../../pom/Pages/IpaasClientTask';

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
                await driver.click(iPaasPage.TaskDetails_open_button_triger_job_test);
                driver.sleep(1 * 1000);
                const screenShot = await driver.saveScreenshots();
                addContext(this, {
                    title: `After "Open" button on TaskDetails derche results (Trigger Job - Test Dataflows) clicked`,
                    value: 'data:image/png;base64,' + screenShot,
                });
            });
            // it('', async function () {});
            // it('', async function () {});
            // it('', async function () {});
        });
    });
}
