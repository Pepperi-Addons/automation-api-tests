import { Browser } from '../utilities/browser';
import { describe, it, afterEach, before, after } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { v4 as newUuid } from 'uuid';
import { ScriptConfigObj, ScriptEditor } from '../pom/addons/ScriptPicker';
import {
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppSettingsSidePanel,
} from '../pom';
import addContext from 'mochawesome/addContext';
import { SurveyTemplate, SurveyTemplateBuilder } from '../pom/addons/SurveyTemplateBuilder';

chai.use(promised);

export async function SurveyTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    const templateToCreate: SurveyTemplate = {
        Name: "first",
        Active: true,
        Key: '',
        Description: 'first',
        Sections: [{
            Key: "",
            Title: "first section",
            Questions: [{
                Name: "firstQ",
                Key: "",
                Title: "firstQ",
                Type: 'Short Text'
            }]
        }],

    };

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
                await surveyService.configureTheSurveyTemplate("first", "first d",
                 [{ Title: "text", Key: "", Questions: [{ Name: "", Key: "", Title: "why god why", Type: "Short Text" },{ Name: "", Key: "", Title: "why god why", Type: "Long Text" }] },
                  { Title: "numbers", Key: "", Questions: [{ Name: "", Key: "", Title: "what have i done", Type: 'Number' },{ Name: "", Key: "", Title: "what have i done", Type: 'Decimal' }] }]);
            });

            it('Data Cleansing', async function () {
                //TODO
            });
        });
    });
}

async function handleModalScenario(scriptEditor, driver, currentScriptResult, isDeafult: boolean) {
    //the modal script is more complex - pops UI dialog and returns logs + result
    //testing UI dialogs
    await scriptEditor.runScriptAndGetResult(false);
    const webAppDialog = new WebAppDialog(driver);
    await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
    let titleTxt = await (await driver.findElement(webAppDialog.Title)).getText();
    expect(titleTxt).to.include('alert');
    let contentTxt = await (await driver.findElement(webAppDialog.Content)).getText();
    expect(contentTxt).to.include('first alert');
    await driver.click(scriptEditor.DialogOkBtn);
    driver.sleep(3000);
    await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
    titleTxt = await (await driver.findElement(webAppDialog.Title)).getText();
    expect(titleTxt).to.include('confirm');
    contentTxt = await (await driver.findElement(webAppDialog.Content)).getText();
    expect(contentTxt).to.include('confirm client');
    await driver.click(scriptEditor.DialogOkBtn, 0); //in this case first index is the 'ok' btn
    driver.sleep(3000);
    await expect(webAppDialog.untilIsVisible(webAppDialog.Title, 90000)).eventually.to.be.true;
    titleTxt = await (await driver.findElement(webAppDialog.Title)).getText();
    expect(titleTxt).to.include('showDialog');
    contentTxt = await (await driver.findElement(webAppDialog.Content)).getText();
    expect(contentTxt).to.include('dialog content');
    await driver.click(scriptEditor.DialogOkBtn, 1); //in this case second index is the 'action 2' button
    driver.sleep(3000);
    //validating result
    const scriptResult = await scriptEditor.getResult();
    expect(isDeafult ? currentScriptResult.DeafultResult : currentScriptResult.ChangedResult).to.be.equal(scriptResult);
    //validating logs output based on actions performed
    const logsResult = await scriptEditor.getLogTxtData();
    expect(logsResult).to.include('alert confirmed:true');
    expect(logsResult).to.include('dialog option:2');
}
