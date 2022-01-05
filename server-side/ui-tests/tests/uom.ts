import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { WebAppLoginPage } from '../pom/index';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { Item } from '@pepperi-addons/papi-sdk';

chai.use(promised);

//npm run ui-show-report --server=prod --chrome_headless=false --user_email='UOM_UI@pepperitest.com' --user_pass='Aa1234567' --var_pass='Basic dmFyM0BwZXBwZXJpLmNvbTpQZXAxMjNRYXc='

export async function UomTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    describe('Basic UI Tests Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.collectEndTestData(this);
            await driver.quit();
        });

        //#region Upgrade cpi-node & UOM
        const testData = {
            ADAL: ['00000000-0000-0000-0000-00000000ada1', ''],
        };
        const isInstalledArr = await generalService.areAddonsInstalled(testData);
        const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
        //#endregion Upgrade cpi-node & UOM

        describe('UOM Tests Suites', () => {
            describe('Prerequisites Addon for UOM Tests', () => {
                //Test Data
                //UOM
                it('Validate That All The Needed Addons Installed', async () => {
                    isInstalledArr.forEach((isInstalled) => {
                        expect(isInstalled).to.be.true;
                    });
                });

                for (const addonName in testData) {
                    const addonUUID = testData[addonName][0];
                    const version = testData[addonName][1];
                    const varLatestVersion = chnageVersionResponseArr[addonName][2];
                    const changeType = chnageVersionResponseArr[addonName][3];
                    describe(`Test Data: ${addonName}`, () => {
                        it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
                            if (chnageVersionResponseArr[addonName][4] == 'Failure') {
                                expect(chnageVersionResponseArr[addonName][5]).to.include(
                                    'is already working on version',
                                );
                            } else {
                                expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                            }
                        });

                        it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                            await expect(
                                generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get(),
                            )
                                .eventually.to.have.property('Version')
                                .a('string')
                                .that.is.equal(varLatestVersion);
                        });
                    });
                }
            });
            it('Post items', async function () {
                const itemToPush: Item = {
                    "ExternalID": "7",
                    "MainCategoryID": "NOT uom item",
                    "Name": "uom testing item 1",
                    "Price": 1.0
                };
                objectsService.postItem(itemToPush);
            });
            
            it('Login', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
            });
        });


    });
}
//TODO: first phase
//1.uom + cpi node are installed
//2.item creation using API
//3.UOM types creation using API
//4.ATD creation -> field seteup (allowed values + item config)
//5.ATD attachment to homescreen
