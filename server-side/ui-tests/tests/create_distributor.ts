import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService, { TesterFunctions } from '../../services/general.service';
import {
    WebAppLoginPage,
    WebAppHomePage,
    WebAppHeader,
    WebAppSettingsSidePanel,
    AddonPage,
    WebAppTopBar,
    WebAppList,
} from '../pom/index';
import { LoremIpsum } from 'lorem-ipsum';
import { DistributorService } from '../../services/distributor.service';
import { AddonLoadCondition } from '../pom/AddonPage';
import { TestDataTests } from '../../api-tests/test-service/test_data';
import { LoginTests, OrderTests } from '.';
import { replaceItemsTests, replaceUIControlsTests, upgradeDependenciesTests } from './test.index';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export interface ClientObject {
    Email: string;
    Password: string;
}

export async function CreateDistributorTests(generalService: GeneralService, varPass: string, varPassEU?: string) {
    let driver: Browser;

    describe('Create Distributor Test Suit', async function () {
        const clientArr: ClientObject[] = [];
        describe('Test Data', async function () {
            it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
                expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
            });
        });

        describe('Initiation Steps', async function () {
            this.retries(1);

            beforeEach(async function () {
                driver = new Browser('chrome');
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
                await driver.quit();
            });

            it(`Login To New Distributor`, async function () {
                let password = varPass;
                if (varPassEU) {
                    //TODO: This is a temp solution for var EU not working yet
                    // password = varPassEU;
                    password = `${Buffer.from(varPassEU.split(' ')[1], 'base64').toString()}`;
                }
                const distributorService = new DistributorService(generalService, password);

                const lorem = new LoremIpsum({});
                const distributorFirstName = lorem.generateWords(1);
                const distributorLastName = lorem.generateWords(1);
                const distributorEmail = `${
                    distributorFirstName + (Math.random() * 10000000000).toString().substring(0, 4)
                }.${distributorLastName}@pepperitest.com`;
                const distributorCompany = lorem.generateWords(3);
                const lettersGenerator = lorem.generateWords(1).substring(0, 2);
                const distributorPassword =
                    lettersGenerator[0].toUpperCase() +
                    lettersGenerator[1] +
                    (Math.random() * 10000000000).toString().substring(0, 6);

                clientArr.push({ Email: distributorEmail, Password: distributorPassword });

                const newDistributor = await distributorService.createDistributor({
                    FirstName: distributorFirstName,
                    LastName: distributorLastName,
                    Email: distributorEmail,
                    Company: distributorCompany,
                    Password: distributorPassword,
                });

                expect(newDistributor.Status).to.equal(200);
                //TODO: Remove this when bug will be solved (DI-19115)
                try {
                    expect(newDistributor.Body.Status.ID, JSON.stringify(newDistributor.Body.AuditInfo)).to.equal(1);
                } catch (error) {
                    if (
                        newDistributor.Body.Status.ID == 0 &&
                        newDistributor.Body.AuditInfo.ErrorMessage.includes('Failed to install the following addons')
                    ) {
                        console.log('Bug exist for this response: (DI-19115)');
                        console.log(JSON.parse(newDistributor.Body.AuditInfo.ResultObject));
                    } else {
                        throw new Error(
                            `Status.ID: ${newDistributor.Status.ID}, AuditInfo.ErrorMessage: ${newDistributor.Body.AuditInfo.ErrorMessage}`,
                        );
                    }
                }
                expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);

                const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                const adminService = new GeneralService(adminClient);
                const systemAddons = await adminService.fetchStatus('/addons?page_size=-1&where=Type LIKE 1');
                const adminAddons = await adminService.getInstalledAddons();

                expect(systemAddons.Body.length).to.be.above(10);
                expect(adminAddons.length).to.be.above(10);

                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.navigate();
                await webAppLoginPage.signIn(clientArr[0].Email, clientArr[0].Password);

                const webAppHomePage = new WebAppHomePage(driver);
                await expect(webAppHomePage.untilIsVisible(webAppHomePage.Main, 90000)).eventually.to.be.true;
            });
        });

        describe('Scenarios', async function () {
            this.retries(1);

            beforeEach(async function () {
                driver = new Browser('chrome');
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
                await driver.quit();
            });

            it(`Prepare New Distributor To Reset`, async function () {
                const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                const adminService = new GeneralService(adminClient);

                //Add test data of the new distributor
                const isInstalledArr = await adminService.areAddonsInstalled({
                    'Automated Jobs': ['fcb7ced2-4c81-4705-9f2b-89310d45e6c7', ''],
                    'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''],
                    'Item Trade Promotions': ['b5c00007-0941-44ab-9f0e-5da2773f2f04', ''],
                    'Order Trade Promotions': ['375425f5-cd2f-4372-bb88-6ff878f40630', ''],
                    'Package Trade Promotions': ['90b11a55-b36d-48f1-88dc-6d8e06d08286', ''],
                    'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.65.34'], //16.60.38 //16.60
                });

                isInstalledArr.forEach((isInstalled) => {
                    expect(isInstalled).to.be.true;
                });

                await TestDataTests(adminService, { describe, expect, it } as TesterFunctions, {
                    IsAllAddons: true,
                    IsUUID: true,
                });

                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.navigate();
                await webAppLoginPage.signIn(clientArr[0].Email, clientArr[0].Password);

                const webAppHomePage = new WebAppHomePage(driver);
                await expect(webAppHomePage.untilIsVisible(webAppHomePage.Main, 90000)).eventually.to.be.true;

                //Change image
                const webAppHeader = new WebAppHeader(driver);
                await driver.click(webAppHeader.Settings);

                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Branded App');
                await driver.click(webAppSettingsSidePanel.BrandedAppBranding);

                const addonPage = new AddonPage(driver);
                await driver.switchTo(addonPage.AddonContainerIframe);
                await addonPage.isAddonFullyLoaded(AddonLoadCondition.Content);

                const fileLocation = `${
                    __dirname.split('server-side')[0]
                }server-side\\api-tests\\test-data\\Temp_Distributor.jpg`;
                await (
                    await driver.findElements(addonPage.BrandedAppUploadInputArr, undefined, false)
                )[1].sendKeys(fileLocation);

                console.log('wait for new company logo to load');
                driver.sleep(5000);

                await driver.switchToDefaultContent();
                await driver.click(webAppHeader.Home);

                const homePageUrl = await driver.getCurrentUrl();
                await webAppLoginPage.loginDeepLink(homePageUrl, clientArr[0].Email, clientArr[0].Password);

                //Added needed UIControls
                await driver.click(webAppHeader.Settings);
                await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
                await driver.click(webAppSettingsSidePanel.ObjectEditorTransactions);

                const webAppTopBar = new WebAppTopBar(driver);
                await driver.sendKeys(webAppTopBar.EditorSearchField, 'Sales Order' + Key.ENTER);

                const webAppList = new WebAppList(driver);
                await webAppList.clickOnLinkFromListRowWebElement();

                await addonPage.editATDView('Footer', 'Expanded Cart Footer View');

                await driver.switchToDefaultContent();

                console.log('Wait for ATD View to update before move to settings');
                driver.sleep(1000);

                await driver.click(webAppHeader.Settings);
                await driver.click(webAppSettingsSidePanel.ObjectEditorTransactions);

                await driver.sendKeys(webAppTopBar.EditorSearchField, 'Sales Order' + Key.ENTER);

                console.log('Wait for ATD list to update before trying to edit ATD');
                driver.sleep(1000);

                await webAppList.clickOnLinkFromListRowWebElement();

                await addonPage.editATDView('Transaction Details', 'Order Banner');
            });

            describe(`Reset New Distributor`, async function () {
                it(`Initiate Tests: Replace UI Controls, Replace Items, Upgrade Dependencies`, async function () {
                    const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                    const adminService = new GeneralService(adminClient);

                    //Reset the needed UI Controls for the UI tests.
                    await replaceUIControlsTests(adminService);

                    //Verify all items exist or replace them
                    await replaceItemsTests(adminService);

                    await upgradeDependenciesTests(adminService, varPass);
                });
            });

            describe(`Sanity New Distributor`, async function () {
                it(`Initiate Tests: Test Data, Login, Order`, async function () {
                    const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                    const adminService = new GeneralService(adminClient);

                    //Add test data of the new distributor just for testing
                    await TestDataTests(adminService, { describe, expect, it } as TesterFunctions, {
                        IsAllAddons: true,
                        IsUUID: true,
                    });

                    await LoginTests(clientArr[0].Email, clientArr[0].Password);

                    await OrderTests(clientArr[0].Email, clientArr[0].Password, adminClient);
                });
            });
        });
    });
}
