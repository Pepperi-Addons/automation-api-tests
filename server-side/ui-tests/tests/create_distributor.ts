import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import GeneralService from '../../services/general.service';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppTopBar,
    AddonPage,
    WebAppSettingsSidePanel,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import { Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { LoremIpsum } from 'lorem-ipsum';

chai.use(promised);

export async function CreateDistributorTest(
    email: string,
    password: string,
    generalService: GeneralService,
    varPass: string,
) {
    let driver: Browser;

    describe('Create Distributor Test Suit', async function () {
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

            console.log(distributorEmail, distributorPassword);

            debugger;
            const newDistributor = await generalService.fetchStatus(
                generalService['client'].BaseURL.replace('papi-eu', 'papi') +
                    `/var/distributors/create?firstName=${distributorFirstName}&lastName=${distributorLastName}&email=${distributorEmail}&company=${distributorCompany}&password=Qa789789}`,
                {
                    method: `POST`,
                    headers: {
                        Authorization: varPass,
                    },
                },
            );
            debugger;

            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);

            debugger;
        });
    });
}
