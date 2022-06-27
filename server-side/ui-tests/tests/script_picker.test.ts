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

chai.use(promised);

export async function ScriptPickerTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    const scriptsTestData: ScriptConfigObj[] = [
        {
            Key: '',
            Hidden: false,
            Name: 'Script_Return_Number',
            Description: '',
            Code: `async function main(data){
                return data.number;
            }
             module.exports = {main};`,
            Parameters: [
                {
                    Name: 'number',
                    Params: {
                        Type: 'Integer',
                        DefaultValue: '5',
                    },
                },
            ],
        },
        {
            Key: '',
            Hidden: false,
            Name: 'Script_Get_Trans',
            Description: '',
            Code: `async function main(data)  { 
            const get = pepperi.api.transactions.get({
                 key: { UUID: data.UUID },
                 fields: ["InternalID", "UUID"]
            });
              return get;
            };
            module.exports = {main};`,
            Parameters: [
                {
                    Name: 'UUID',
                    Params: {
                        Type: 'String',
                        DefaultValue: '508d815b-b5e1-4cf5-bca1-743f7d008cbf',
                    },
                },
            ],
        },
        {
            Key: '',
            Hidden: false,
            Name: 'Script_Modal',
            Description: '',
            Code: `async function main(data)  { 
            const res = await client.alert("alert", "first alert");
                 const confirm = await client.confirm(
                  "confirm",
                  "confirm client"
                );
                const showDialog = await client.showDialog({
                  title: "showDialog",
                  content: "dialog content",
                  actions: [
                    { title: "action 1", value: 1 },
                    { title: "action 2", value: 2 },
                    { title: "action 3", value: 3 },
                  ],
                });
            console.log("alert confirmed:"+confirm);
            console.log("dialog option:"+showDialog);

            if (res)
            {
                return data.x;
            }
            else 
            {
                return data.y;
            }						
        }
        module.exports = {main}`,
            Parameters: [
                {
                    Name: 'x',
                    Params: {
                        Type: 'Integer',
                        DefaultValue: '8',
                    },
                },
                {
                    Name: 'y',
                    Params: {
                        Type: 'String',
                        DefaultValue: 'abc',
                    },
                },
            ],
        },
    ];

    const scriptResults: any[] = [
        {
            Name: 'Script_Return_Number',
            DeafultResult: '5',
            NewValue: ['8'],
            ChangedResult: '8',
        },
        {
            Name: 'Script_Get_Trans',
            DeafultResult:
                '{"success":true,"object":{"InternalID":290607961,"UUID":"508d815b-b5e1-4cf5-bca1-743f7d008cbf"}}',
            NewValue: ['82b42b50-742b-475d-b1b8-fe5716bbaef7'],
            ChangedResult:
                '{"success":true,"object":{"InternalID":287697865,"UUID":"82b42b50-742b-475d-b1b8-fe5716bbaef7"}}', //for UUID:
        },
        {
            Name: 'Script_Modal',
            DeafultResult: 'abc',
            NewValue: ['5', 'xyz'],
            ChangedResult: 'xyz',
        },
    ];

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.4.13'],
        Logs: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', '0.0.100'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    // #endregion Upgrade script dependencies

    describe('Scripts Tests Suit', async function () {
        describe('Prerequisites Addons for Scripts Tests', () => {
            //Test Data
            //Scripts
            isInstalledArr.forEach((isInstalled, index) => {
                it(`Validate That Needed Addon Is Installed: ${Object.keys(testData)[index]}`, () => {
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
                            expect(chnageVersionResponseArr[addonName][5]).to.include('is already working on version');
                        } else {
                            expect(chnageVersionResponseArr[addonName][4]).to.include('Success');
                        }
                    });
                    it(`Latest Version Is Installed ${varLatestVersion}`, async () => {
                        await expect(generalService.papiClient.addons.installedAddons.addonUUID(`${addonUUID}`).get())
                            .eventually.to.have.property('Version')
                            .a('string')
                            .that.is.equal(varLatestVersion);
                    });
                });
            }
        });

        describe('Scripts Test', () => {
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
            it('Set Up & API Test: Data Cleansing - Validating No Scripts Are Currently Saved On Dist', async function () {
                let allScriptsOnDist = await generalService.fetchStatus(
                    'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                    {
                        method: 'GET',
                    },
                );
                const allScriptsHidden: any[] = [];
                for (let index = 0; index < allScriptsOnDist.Body.length; index++) {
                    allScriptsOnDist.Body[index].Hidden = true;
                    allScriptsHidden.push(allScriptsOnDist.Body[index]);
                }
                for (let index = 0; index < allScriptsHidden.length; index++) {
                    const scriptResponse = await generalService.fetchStatus(
                        'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                        {
                            method: 'POST',
                            body: JSON.stringify(allScriptsHidden[index]),
                        },
                    );
                    expect(scriptResponse.Ok).to.equal(true);
                    expect(scriptResponse.Status).to.equal(200);
                    expect(scriptResponse.Body.Key).to.equal(allScriptsHidden[index].Key);
                    expect(scriptResponse.Body.Code).to.equal(allScriptsHidden[index].Code);
                    expect(scriptResponse.Body.Description).to.equal(allScriptsHidden[index].Description);
                    expect(scriptResponse.Body.Hidden).to.equal(true);
                    expect(scriptResponse.Body.Name).to.equal(allScriptsHidden[index].Name);
                    expect(scriptResponse.Body.Parameters).to.deep.equal(allScriptsHidden[index].Parameters);
                }
                allScriptsOnDist = await generalService.fetchStatus(
                    'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                    {
                        method: 'GET',
                    },
                );
                expect(allScriptsOnDist.Body.length).to.equal(0);
            });
            it('Set Up & API Test: Posting Test Scripts Via API', async function () {
                for (let index = 0; index < scriptsTestData.length; index++) {
                    scriptsTestData[index].Key = newUuid();
                    const paramObj = {};
                    for (let index1 = 0; index1 < scriptsTestData[index].Parameters.length; index1++) {
                        paramObj[scriptsTestData[index].Parameters[index1].Name] = {
                            Type: scriptsTestData[index].Parameters[index1].Params.Type,
                            DefaultValue: scriptsTestData[index].Parameters[index1].Params.DefaultValue,
                        };
                    }
                    const scriptToPost: ScriptConfigObj = {
                        Key: scriptsTestData[index].Key,
                        Hidden: false,
                        Name: scriptsTestData[index].Name,
                        Description: scriptsTestData[index].Description,
                        Code: scriptsTestData[index].Code,
                        Parameters: paramObj,
                    };
                    const scriptResponse = await generalService.fetchStatus(
                        'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                        {
                            method: 'POST',
                            body: JSON.stringify(scriptToPost),
                        },
                    );
                    expect(scriptResponse.Ok).to.equal(true);
                    expect(scriptResponse.Status).to.equal(200);
                    expect(scriptResponse.Body.Key).to.equal(scriptsTestData[index].Key);
                    expect(scriptResponse.Body.Code).to.equal(scriptsTestData[index].Code);
                    expect(scriptResponse.Body.Description).to.equal(scriptsTestData[index].Description);
                    expect(scriptResponse.Body.Hidden).to.equal(false);
                    expect(scriptResponse.Body.Name).to.equal(scriptsTestData[index].Name);
                    expect(scriptResponse.Body.Parameters).to.deep.equal(paramObj);
                }
                // debugger;
            });
            //TODO:1. validate code shown in UI
            it('UI Test: Enter Scripts Editor & Picker And Validate All Scripts Are Found With Correct Params', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.manualResync(client);
                const webAppHeader = new WebAppHeader(driver);
                await webAppHeader.openSettings();
                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Configuration');
                await driver.click(webAppSettingsSidePanel.ScriptsEditor);
                const scriptEditor = new ScriptEditor(driver);
                await scriptEditor.validateMainPageIsLoaded();
                const webAppList = new WebAppList(driver);
                //1. testing the outter UI editor to see correct number of Scripts + names
                const numOfResults = await webAppList.getNumOfElementsTitle();
                expect(parseInt(numOfResults)).to.equal(scriptsTestData.length); //testing lists qty title
                const allListElems = await webAppList.getListElementsAsArray();
                expect(allListElems.length).to.equal(scriptsTestData.length); //num of elements in the list itself
                //testing names of scripts
                const allListElemsText = await webAppList.getAllListElementsTextValue();
                const pushedScriptNames = scriptsTestData.map((elem) => elem.Name);
                pushedScriptNames.push('None'); //including 'none' which is a 'system type'
                allListElemsText.forEach((element) => {
                    expect(element.trim()).to.be.oneOf(pushedScriptNames);
                });
                //BUG: starts here
                //2. testing the script picker modal
                //entering script picker modal using UI
                // await scriptEditor.enterPickerModal();
                // //testing qty of scripts in the picker
                // const allScriptOptions = await scriptEditor.returnAllScriptPickerScriptNames();
                // expect(allScriptOptions.length).to.equal(scriptsTestData.length + 1);//already including 'none' from before which is a 'system type'
                // //testing all script names in the picker
                // allScriptOptions.forEach(element => {
                //     expect(element.trim()).to.be.oneOf(pushedScriptNames);//including 'none' which is a 'system type'
                // });
                // await scriptEditor.clickDropDownByText('None');
                //BUG:ends here
                for (let index = 0; index < allListElemsText.length; index++) {
                    if (index > 0) {
                        await driver.refresh();
                        await scriptEditor.validateMainPageIsLoaded();
                    }
                    const scriptName = (await webAppList.getAllListElementTextValueByIndex(index)).trim();
                    const currentScript = scriptsTestData.filter((elem) => elem.Name === scriptName)[0];
                    await webAppList.clickOnCheckBoxByElementIndex(index);
                    await scriptEditor.openDebugger();
                    const base64Image = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Script Picker Editor For ${currentScript.Name} Script`,
                        value: 'data:image/png;base64,' + base64Image,
                    });
                    //testing correct UUID found in URL
                    const currentURL = await driver.getCurrentUrl();
                    expect(currentURL).to.include(currentScript.Key);
                    //testing params names are valid
                    const UIparamNames = await scriptEditor.getDebuggerParamNames();
                    currentScript.Parameters.forEach((param) => expect(param.Name).to.be.oneOf(UIparamNames));
                    //testing param values are valid
                    const paramValueElems = await scriptEditor.getParamValues(
                        currentScript.Parameters.map((param) => param.Name),
                    );
                    currentScript.Parameters.forEach((param) =>
                        expect(param.Params.DefaultValue.toString()).to.be.oneOf(paramValueElems),
                    );
                    //run as default - validate defult result
                    const currentScriptResult = scriptResults.filter((result) => result.Name === scriptName)[0];
                    if (scriptName === 'Script_Modal') {
                        //the modal script is more complex - pops UI dialog and returns logs + result
                        //testing UI dialogs
                        await handleModalScenario(scriptEditor, driver, currentScriptResult, true);
                        await scriptEditor.setParamStaticValue(currentScript.Parameters, currentScriptResult.NewValue);
                        await handleModalScenario(scriptEditor, driver, currentScriptResult, false);
                    } else {
                        //simple case of scripts returning data only
                        let scriptRunResult = await scriptEditor.runScriptAndGetResult();
                        expect(currentScriptResult.DeafultResult).to.be.equal(scriptRunResult);
                        await scriptEditor.setParamStaticValue(currentScript.Parameters, currentScriptResult.NewValue);
                        scriptRunResult = await scriptEditor.runScriptAndGetResult();
                        expect(currentScriptResult.ChangedResult).to.be.equal(scriptRunResult);
                    }
                    await scriptEditor.goBackToScriptList();
                    //validate script list is loaded
                    await scriptEditor.validateMainPageIsLoaded();
                    await driver.refresh(); //refresh the page to see checkbox
                    await scriptEditor.validateMainPageIsLoaded(); //validate the page is loaded and can be used
                    //change params and see changed in API
                    await scriptEditor.enterEditor(index);
                    await scriptEditor.editParam(index, currentScript.Parameters, currentScriptResult.NewValue);
                    await webAppHomePage.returnToHomePage();
                    await webAppHomePage.manualResync(client);
                    const allScriptsOnDist = await generalService.fetchStatus(
                        'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                        {
                            method: 'GET',
                        },
                    );
                    const currentScriptFromAPI = allScriptsOnDist.Body.filter(
                        (script) => script.Key === currentScript.Key,
                    )[0];
                    for (let index = 0; index < currentScript.Parameters.length; index++) {
                        expect(
                            currentScriptFromAPI.Parameters[currentScript.Parameters[index].Name].DefaultValue,
                        ).to.equal(currentScriptResult.NewValue[index]);
                    }
                    await webAppHeader.openSettings();
                    await webAppSettingsSidePanel.selectSettingsByID('Configuration');
                    await driver.click(webAppSettingsSidePanel.ScriptsEditor);
                    await scriptEditor.validateMainPageIsLoaded();
                }
            });
            it('Data Cleansing - Deleting All Added Scripts', async function () {
                let allScriptsOnDist = await generalService.fetchStatus(
                    'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                    {
                        method: 'GET',
                    },
                );
                const allScriptsHidden: any[] = [];
                for (let index = 0; index < allScriptsOnDist.Body.length; index++) {
                    allScriptsOnDist.Body[index].Hidden = true;
                    allScriptsHidden.push(allScriptsOnDist.Body[index]);
                }
                for (let index = 0; index < allScriptsHidden.length; index++) {
                    const scriptResponse = await generalService.fetchStatus(
                        'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                        {
                            method: 'POST',
                            body: JSON.stringify(allScriptsHidden[index]),
                        },
                    );
                    expect(scriptResponse.Ok).to.equal(true);
                    expect(scriptResponse.Status).to.equal(200);
                    expect(scriptResponse.Body.Key).to.equal(allScriptsHidden[index].Key);
                    expect(scriptResponse.Body.Code).to.equal(allScriptsHidden[index].Code);
                    expect(scriptResponse.Body.Description).to.equal(allScriptsHidden[index].Description);
                    expect(scriptResponse.Body.Hidden).to.equal(true);
                    expect(scriptResponse.Body.Name).to.equal(allScriptsHidden[index].Name);
                    expect(scriptResponse.Body.Parameters).to.deep.equal(allScriptsHidden[index].Parameters);
                }
                allScriptsOnDist = await generalService.fetchStatus(
                    'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                    {
                        method: 'GET',
                    },
                );
                expect(allScriptsOnDist.Body.length).to.equal(0);
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
