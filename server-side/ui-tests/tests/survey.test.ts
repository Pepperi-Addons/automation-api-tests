import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { WebAppHomePage, WebAppLoginPage } from '../pom';
import { SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';

chai.use(promised);

export async function SurveyTests(email: string, password: string) {
    //varPass: string, client: Client
    // const generalService = new GeneralService(client);
    let driver: Browser;

    // const templateToCreate: SurveyTemplate = {
    //     Name: 'first',
    //     Active: true,
    //     Key: '',
    //     Description: 'first',
    //     Sections: [
    //         {
    //             Key: '',
    //             Title: 'first section',
    //             Questions: [
    //                 {
    //                     Name: 'firstQ',
    //                     Key: '',
    //                     Title: 'firstQ',
    //                     Type: 'Short Text',
    //                 },
    //             ],
    //         },
    //     ],
    // };

    //TODO: add dependency installation for this
    // await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    // const testData = {
    //     'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.4.13'],
    //     Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
    //     'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
    //     Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', '0.0.100'],
    // };

    // const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    // const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade script dependencies

    describe('Scripts Tests Suit', async function () {
        // describe('Prerequisites Addons for Scripts Tests', () => {
        //     //Test Data
        //     //Scripts
        //     isInstalledArr.forEach((isInstalled, index) => {
        //         it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
        //             expect(isInstalled).to.be.true;
        //         });
        //     });
        //     for (const addonName in testData) {
        //         const addonUUID = testData[addonName][0];
        //         const version = testData[addonName][1];
        //         const varLatestVersion = chnageVersionResponseArr[addonName][2];
        //         const changeType = chnageVersionResponseArr[addonName][3];
        //         describe(`Test Data: ${addonName}`, () => {
        //             it(`${changeType} To Latest Version That Start With: ${version ? version : 'any'}`, () => {
        //                 if (chnageVersionResponseArr[addonName][4] == 'Failure') {
        //                     expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
        //                 } else {
        //                     expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
        //                 }
        //             });
        //             it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
        //                 await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
        //                     .eventually.to.have.property('Version')
        //                     .a('string')
        //                     .that.is.equal(varLatestVersion);
        //             });
        //         });
        //     }
        // });

        describe('Configuring Survey', () => {
            this.retries(0);

            before(async function () {
                driver = await Browser.initiateChrome();
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.collectEndTestData(this);
            });
            it('Create A Survey Template', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const surveyService = new SurveyTemplateBuilder(driver);
                const isSurveyBuilderSettingsShown = await surveyService.enterSurveyBuilderSettingsPage();
                expect(isSurveyBuilderSettingsShown).to.equal(true);
                const isSurveyBuilderPageShown = await surveyService.enterSurveyBuilderActualBuilder();
                expect(isSurveyBuilderPageShown).to.equal(true);
                await surveyService.configureTheSurveyTemplate('first', 'first d', [
                    {
                        Title: 'text',
                        Key: '',
                        Questions: [
                            { Name: '', Key: '', Title: 'why god why', Type: 'Short Text' },
                            { Name: '', Key: '', Title: 'why god why', Type: 'Long Text' },
                        ],
                    },
                    {
                        Title: 'numbers',
                        Key: '',
                        Questions: [
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Number' },
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Decimal' },
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Currency' },
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Date' },
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Date Time' },
                            { Name: '', Key: '', Title: 'what have i done', Type: 'Percentage' },
                        ],
                    },
                ]);
            });

            it('Data Cleansing', async function () {
                //TODO
            });
        });
    });
}
