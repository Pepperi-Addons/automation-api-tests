import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { v4 as newUuid } from 'uuid';
import { ScriptConfigObj, ScriptParams } from '../pom/addons/ScriptPicker';

chai.use(promised);

export async function ScriptPickerTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    let driver: Browser;

    const scriptsArray: string[] = [
        `async function main(data){
        return data.number;
    }
     module.exports = {main}`,
        `async function main(data)  { //30b6f9c5-5cdf-430a-bf82-c7aa9821d8d9
        const get = pepperi.api.transactions.get({
             key: { UUID: data.UUID },
             fields: ["InternalID", "UUID"]
        });
          return get;
        };
        module.exports = {main}`,
        `async function main(data)  { 
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
        module.exports = {main}`
    ];

    const scriptParamArray: any[] = [{
        Name: "number",
        Params: {
            Type: 'Integer',
            DefaultValue: 5
        }
    },
    {
        Name: "UUID",
        Params: {
            Type: 'String',
            DefaultValue: '508d815b-b5e1-4cf5-bca1-743f7d008cbf'
        }
    },
    [
        {
            Name: "x",
            Params: {
                Type: 'Integer',
                DefaultValue: 1
            }
        },
        {
            Name: "y",
            Params: {
                Type: 'Integer',
                DefaultValue: 2
            }
        }
    ]];

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.4.13'],
        CloudWatch: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
        Scripts: ['9f3b727c-e88c-4311-8ec4-3857bc8621f3', '0.0.100'],
    };

    const chnageVersionResponseArr = await generalService.changeVersion(varPass, testData, false);
    const isInstalledArr = await generalService.areAddonsInstalled(testData);

    //#endregion Upgrade script dependencies

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

        describe('Scripts Test Setup', () => {
            it('Posting Scripts Via API', async function () {
                for (let index = 0; index < scriptsArray.length; index++) {
                    const uuid = newUuid();
                    const scriptName = `Script_Test_${generalService.generateRandomString(7)}`;
                    const scriptDesc = `${scriptName}_${generalService.generateRandomString(3)}`;
                    const scriptCode = scriptsArray[index];
                    let scriptParam = {};
                    if (Array.isArray(scriptParamArray[index])) {
                        debugger;
                        for (let index1 = 0; index1 < scriptParamArray[index].length; index1++) {
                            const paramName = scriptParamArray[index][index1].Name;
                            const paramType = scriptParamArray[index][index1].Params.Type;
                            const paramVal = scriptParamArray[index][index1].Params.DefaultValue;
                            scriptParam[`${paramName}`] = {
                                Type: paramType,
                                DefaultValue: paramVal
                            };
                        }
                    } else {
                        const paramName = scriptParamArray[index].Name;
                        const paramType = scriptParamArray[index].Params.Type;
                        const paramVal = scriptParamArray[index].Params.DefaultValue;
                        scriptParam[`${paramName}`] = {
                            Type: paramType,
                            DefaultValue: paramVal
                        }
                    }
                    const scriptToPost: ScriptConfigObj = {
                        Key: uuid,
                        Hidden: false,
                        Name: scriptName,
                        Description: scriptDesc,
                        Code: scriptCode,
                        Parameters: scriptParam,
                    };
                    const scriptResponse = await generalService.fetchStatus(
                        'https://papi.pepperi.com/V1.0/addons/api/9f3b727c-e88c-4311-8ec4-3857bc8621f3/api/scripts',
                        {
                            method: 'POST',
                            body: JSON.stringify(scriptToPost),
                        },
                    );
                    debugger;
                    expect(scriptResponse.Ok).to.equal(true);
                    expect(scriptResponse.Status).to.equal(200);
                    expect(scriptResponse.Body.Key).to.equal(uuid);
                    expect(scriptResponse.Body.Code).to.equal(scriptCode);
                    expect(scriptResponse.Body.Description).to.equal(scriptDesc);
                    expect(scriptResponse.Body.Hidden).to.equal(false);
                    expect(scriptResponse.Body.Name).to.equal(scriptName);
                    expect(scriptResponse.Body.Parameters).to.deep.equal(scriptParam);
                    debugger;
                }
            });
        });
    });
}
//2. return a trans get script:
/*
async function main(data)  { //30b6f9c5-5cdf-430a-bf82-c7aa9821d8d9
const get = pepperi.api.transactions.get({
     key: { UUID: data.UUID },
     fields: ["InternalID", "UUID"]
});
  return get;
};
module.exports = {main}
*/

//3. pop UI things as dialog etc:
/*
async function main(data)  { 
    const res = await client.alert("alert", "putin is douchebag");
         const confirm = await client.confirm(
          "confirm",
          "putin is a huylo"
        );
        const showDialog = await client.showDialog({
          title: "showDialog",
          content: "putin pashul nahuy dibilnaya tvar",
          actions: [
            { title: "not cool putin", value: 1 },
            { title: "really not cool putin", value: 2 },
            { title: "putin is a boomer 3", value: 3 },
            { title: "putin is a boomer 4", value: 4 },
            { title: "putin is a boomer 5", value: 5 }, 
          ],
        });
    console.log(confirm);
        console.log(showDialog)

    if (res)
    {
        const mySum = data.xxxx+data.y;
        return data.myText +mySum + data.myText2;
    }
    else 
    {
        const myMul = data.xxxx*data.y;
        return data.myText +myMul + data.myText2;
    }						
}
module.exports = {main}
*/
