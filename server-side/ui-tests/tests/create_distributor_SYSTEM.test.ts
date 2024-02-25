import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService, { ConsoleColors } from '../../services/general.service';
import { WebAppLoginPage, WebAppHomePage } from '../pom/index';
import { LoremIpsum } from 'lorem-ipsum';
import { DistributorService } from '../../services/distributor.service';
import { By } from 'selenium-webdriver';

chai.use(promised);

export interface ClientObject {
    Email: string;
    Password: string;
}

export async function CreateDistributorSystemTests(
    generalService: GeneralService,
    varPass: string,
    varPassEU?: string,
    userName?,
    pass?,
) {
    let driver: Browser;

    describe('Create Distributor Test Suit', async function () {
        const clientArr: ClientObject[] = [];
        describe('Test Data', async function () {
            it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
                expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
            });
        });

        describe('Initiation Steps', async function () {
            this.retries(0);

            beforeEach(async function () {
                driver = await Browser.initiateChrome();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
                await driver.close();
                await driver.quit();
            });

            it(`Login To New Distributor`, async function () {
                let password = varPass;
                if (varPassEU) {
                    password = varPassEU;
                }
                const distributorService = new DistributorService(generalService, password);
                let distributorFirstName;
                let distributorLastName;
                let distributorEmail;
                let distributorCompany;
                let distributorPassword;
                if (userName && pass) {
                    distributorFirstName = `QA_${userName}`;
                    distributorLastName = userName;
                    distributorEmail = `${userName}@pepperitest.com`;
                    distributorCompany = 'QA';
                    distributorPassword = pass;
                    console.log(`creating user with email: ${distributorEmail}`);
                    clientArr.push({ Email: distributorEmail, Password: distributorPassword });
                } else {
                    const lorem = new LoremIpsum({});
                    distributorFirstName = lorem.generateWords(1);
                    distributorLastName = lorem.generateWords(1);
                    distributorEmail = `${
                        distributorFirstName + (Math.random() * 10000000000).toString().substring(0, 4)
                    }.${distributorLastName}@pepperitest.com`;
                    distributorCompany = lorem.generateWords(3);
                    const lettersGenerator = lorem.generateWords(1).substring(0, 2);
                    distributorPassword =
                        lettersGenerator[0].toUpperCase() +
                        lettersGenerator[1] +
                        (Math.random() * 10000000000).toString().substring(0, 6);

                    clientArr.push({ Email: distributorEmail, Password: distributorPassword });
                }
                const newDistributor = await distributorService.createDistributor({
                    FirstName: distributorFirstName,
                    LastName: distributorLastName,
                    Email: distributorEmail,
                    Company: distributorCompany,
                    Password: distributorPassword,
                });
                if (
                    typeof newDistributor.Ok == 'undefined' &&
                    typeof newDistributor.Status == 'undefined' &&
                    typeof newDistributor.Headers == 'undefined' &&
                    varPassEU
                ) {
                    console.log('%cBug exist for this response: (DI-19118)', ConsoleColors.BugSkipped);
                    console.log('%cVAR - Create Distributor - The API call never return', ConsoleColors.BugSkipped);
                    generalService.sleep(1000 * 75 * 1);
                    const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                    const adminService = new GeneralService(adminClient);
                    const systemAddons = await adminService.fetchStatus('/addons?page_size=-1&where=Type LIKE 1');
                    expect(systemAddons.Body.length).to.be.above(10);
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await webAppLoginPage.signIn(clientArr[0].Email, clientArr[0].Password);
                    const webAppHomePage = new WebAppHomePage(driver);
                    let tryCounter = 0;
                    let isHomePageLoaded = false;
                    do {
                        isHomePageLoaded = await webAppHomePage.safeUntilIsVisible(
                            webAppHomePage.MainHomePageBtn,
                            90000,
                        );
                        if (!isHomePageLoaded) {
                            tryCounter++;
                            await driver.refresh();
                            generalService.sleep(1000 * 5 * 1);
                            const isErrorPresented = await webAppHomePage.safeUntilIsVisible(
                                By.xpath('//span[contains(text(),"Error")]'),
                            );
                            if (isErrorPresented) {
                                await driver.refresh();
                            }
                        }
                    } while (!isHomePageLoaded && tryCounter < 15);
                    await expect(webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn, 90000)).eventually.to.be
                        .true;
                    const adminAddons = await adminService.getInstalledAddons();
                    expect(adminAddons.length).to.be.above(10);
                }
                //(DI-19116):
                if (
                    newDistributor.Status === 500 &&
                    newDistributor.Body.Text.includes(
                        'The requested URL was rejected. Please consult with your administrator',
                    )
                ) {
                    generalService.sleep(1000 * 75 * 1);
                    const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                    const adminService = new GeneralService(adminClient);
                    const systemAddons = await adminService.fetchStatus('/addons?page_size=-1&where=Type LIKE 1');
                    expect(systemAddons.Body.length).to.be.above(10);
                    const webAppLoginPage = new WebAppLoginPage(driver);
                    await webAppLoginPage.navigate();
                    await webAppLoginPage.signIn(clientArr[0].Email, clientArr[0].Password);
                    const webAppHomePage = new WebAppHomePage(driver);
                    let tryCounter = 0;
                    let isHomePageLoaded = false;
                    do {
                        isHomePageLoaded = await webAppHomePage.safeUntilIsVisible(
                            webAppHomePage.MainHomePageBtn,
                            90000,
                        );
                        if (!isHomePageLoaded) {
                            tryCounter++;
                            await driver.refresh();
                            generalService.sleep(1000 * 5 * 1);
                            const isErrorPresented = await webAppHomePage.safeUntilIsVisible(
                                By.xpath('//span[contains(text(),"Error")]'),
                            );
                            if (isErrorPresented) {
                                await driver.refresh();
                            }
                        }
                    } while (!isHomePageLoaded && tryCounter < 15);
                    await expect(webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn, 90000)).eventually.to.be
                        .true;
                    const adminAddons = await adminService.getInstalledAddons();
                    expect(adminAddons.length).to.be.above(10);
                } else {
                    expect(newDistributor.Status).to.equal(200);
                    //TODO: Remove this when bug will be solved (DI-19115)
                    try {
                        expect(newDistributor.Body.Status.ID, JSON.stringify(newDistributor.Body.AuditInfo)).to.equal(
                            1,
                        );
                    } catch (error) {
                        if (typeof newDistributor.Body.AuditInfo.ErrorMessage === 'string') {
                            if (
                                newDistributor.Body.Status.ID == 0 &&
                                newDistributor.Body.AuditInfo.ErrorMessage.includes(
                                    'Failed to install the following addons',
                                )
                            ) {
                                console.log('%cBug exist for this response: (DI-19115)', ConsoleColors.BugSkipped);
                                console.log(JSON.parse(newDistributor.Body.AuditInfo.ResultObject));
                            } else {
                                throw new Error(
                                    `Status.ID: ${newDistributor.Status.ID}, AuditInfo.ErrorMessage: ${newDistributor.Body.AuditInfo.ErrorMessage}`,
                                );
                            }
                        } else {
                            throw new Error(
                                `Error Without Error Message: Status.ID: ${newDistributor.Status.ID}, Response Body: ${newDistributor.Body}`,
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
                    await expect(webAppHomePage.untilIsVisible(webAppHomePage.MainHomePageBtn, 90000)).eventually.to.be
                        .true;
                }
            });
        });
    });
}
