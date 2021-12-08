import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService, { TesterFunctions } from '../../services/general.service';
import { WebAppLoginPage, WebAppHomePage } from '../pom/index';
import { LoremIpsum } from 'lorem-ipsum';
import { DistributorService } from '../../services/distributor.service';
import { TestDataTest } from '../../api-tests/test-service/test_data';

chai.use(promised);

export interface ClientObject {
    Email: string;
    Password: string;
}

export async function CreateDistributorTest(
    email: string,
    password: string,
    generalService: GeneralService,
    varPass: string,
) {
    let driver: Browser;

    describe('Create Distributor Test Suit', async function () {
        this.retries(0);
        const clientArr: ClientObject[] = [];
        const varGeneralService = Object.assign({}, generalService);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.collectEndTestData(this);
            await driver.quit();
        });


        // await TestDataTest(varGeneralService, { describe, expect, it } as TesterFunctions);

        it(`Start Test Server Time And Date: ${generalService.getServer()} ${generalService.getTime()} ${generalService.getDate()}`, () => {
            expect(generalService.getDate().length == 10 && generalService.getTime().length == 8).to.be.true;
        });

        it(`Login To New Distributor`, async function () {
            const distributorService = new DistributorService(generalService, { body: { varKey: varPass } });

            const lorem = new LoremIpsum({});
            const distributorFirstName = lorem.generateWords(1);
            const distributorLastName = lorem.generateWords(1);
            const distributorEmail = `${distributorFirstName}.${distributorLastName}@$pepperitest.com`;
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

            clientArr.push({ Email: distributorEmail, Password: distributorPassword });

            console.log(newDistributor.Status, newDistributor.Body.Text, newDistributor.Body.fault.faultstring);

            expect(newDistributor.Status).to.equal(200);

            const adminClient = await generalService.initiateTester(clientArr[0].Email, clientArr[0].Password);
            const adminService = new GeneralService(adminClient);
            const adminAddons = await adminService.getAddons();

            expect(adminAddons.length).to.be.above(5);

            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(clientArr[0].Email, clientArr[0].Password);
        });
    });
}
