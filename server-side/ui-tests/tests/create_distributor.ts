import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import { WebAppLoginPage, WebAppHomePage } from '../pom/index';
import { LoremIpsum } from 'lorem-ipsum';
import { DistributorService } from '../../services/distributor.service';

chai.use(promised);

export interface ClientObject {
    Email: string;
    Password: string;
}

export async function CreateDistributorTest(generalService: GeneralService, varPass: string) {
    let driver: Browser;

    describe('Create Distributor Test Suit', async function () {
        describe('Test Data', async function () {
            it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
                expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
            });
        });

        describe('Scenarios', async function () {
            this.retries(0);
            const clientArr: ClientObject[] = [];

            beforeEach(async function () {
                driver = new Browser('chrome');
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
                await driver.quit();
            });

            it(`Login To New Distributor`, async function () {
                const distributorService = new DistributorService(generalService, { body: { varKey: varPass } });

                const lorem = new LoremIpsum({});
                const distributorFirstName = lorem.generateWords(1);
                const distributorLastName = lorem.generateWords(1);
                const distributorEmail = `${distributorFirstName}.${distributorLastName}@pepperitest.com`;
                const distributorCompany = lorem.generateWords(3);
                const lettersGenerator = lorem.generateWords(1).substring(0, 2);
                const distributorPassword =
                    lettersGenerator[0].toUpperCase() +
                    lettersGenerator[1] +
                    (Math.random() * 10000000000).toString().substring(0, 6);

                const newDistributor = await distributorService.createDistributor({
                    FirstName: distributorFirstName,
                    LastName: distributorLastName,
                    Email: distributorEmail,
                    Company: distributorCompany,
                    Password: distributorPassword,
                });

                expect(newDistributor.Status).to.equal(200);
                expect(newDistributor.Body.Status.ID).to.equal(1);
                expect(newDistributor.Body.DistributorUUID).to.have.lengthOf(36);

                const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
                const adminService = new GeneralService(adminClient);
                const adminAddons = await adminService.getAddons();

                expect(adminAddons.length).to.be.above(10);

                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.navigate();
                await webAppLoginPage.signIn(clientArr[0].Email, clientArr[0].Password);
                const webAppHomePage = new WebAppHomePage(driver);
                await expect(webAppHomePage.untilIsVisible(webAppHomePage.Main, 90000)).eventually.to.be.true;
            });
        });
    });
}
