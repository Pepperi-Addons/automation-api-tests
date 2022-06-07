import { Browser } from '../utilities/browser';
import { describe, it, afterEach, beforeEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService, { FetchStatusResponse } from '../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { ObjectsService } from '../../services/objects.service';
import { v4 as newUuid } from 'uuid';

chai.use(promised);

export async function ScriptPickerTests(email: string, password: string, varPass: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    await generalService.baseAddonVersionsInstallation(varPass);
    //#region Upgrade script dependencies
    const testData = {
        'cpi-node': ['bb6ee826-1c6b-4a11-9758-40a46acb69c5', '0.4.13'],
        CloudWatch: ['7eb366b8-ce3b-4417-aec6-ea128c660b8a', ''],
        'Usage Monitor': ['00000000-0000-0000-0000-000000005a9e', ''],
        Scripts: ['32aab23f-69dc-4b9e-8aa8-e392fd40c454', '0.0.95'],
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
                const uuid = newUuid();
                debugger;
            });
        });
    });
}


//1. return a number script:
/*
async function main(data){
    return data.number;
}
module.exports = {main}
*/

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


