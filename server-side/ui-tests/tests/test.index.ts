import GeneralService, { TesterFunctions } from '../../services/general.service';
import fetch from 'node-fetch';
import jwt_decode from 'jwt-decode';
import fs from 'fs';
import { describe, it, run } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { TestDataTest } from '../../api-tests/test-service/test_data';
import { Client } from '@pepperi-addons/debug-server';
import { LoginTest } from './login';
import { OrdersTest } from './orders';

chai.use(promised);

const email = process.env.npm_config_user_email as string;
const pass = process.env.npm_config_user_pass as string;
const varPass = process.env.npm_config_var_pass as string;

(async () => {
    const client = await initiateTester();

    const generalService = new GeneralService(client);

    await TestDataTest(generalService, { describe, expect, it } as TesterFunctions);

    await upgradeDependenciesTests(generalService, varPass);

    await LoginTest(email, pass);

    await OrdersTest(email, pass, client);

    run();
})();

async function initiateTester(): Promise<Client> {
    const urlencoded = new URLSearchParams();
    urlencoded.append('username', email);
    urlencoded.append('password', pass);
    urlencoded.append('scope', 'pepperi.apint pepperi.wacd offline_access');
    urlencoded.append('grant_type', 'password');
    urlencoded.append('client_id', 'ios.com.wrnty.peppery');

    const getToken = await fetch('https://idp.sandbox.pepperi.com/connect/token', { method: 'POST', body: urlencoded })
        .then((res) => res.text())
        .then((res) => (res ? JSON.parse(res) : ''));

    return createClient(getToken.access_token);
}

function createClient(authorization) {
    if (!authorization) {
        throw new Error('unauthorized');
    }
    const token = authorization.replace('Bearer ', '') || '';
    const parsedToken = jwt_decode(token);
    const [sk, AddonUUID] = getSecret();
    return {
        AddonUUID: AddonUUID,
        AddonSecretKey: sk,
        BaseURL: parsedToken['pepperi.baseurl'],
        OAuthAccessToken: token,
        AssetsBaseUrl: 'http://localhost:4400/publish/assets',
        Retry: () => {
            return;
        },
    };
}

function getSecret() {
    const addonUUID = JSON.parse(fs.readFileSync('../addon.config.json', { encoding: 'utf8', flag: 'r' }))['AddonUUID'];
    const sk = fs.readFileSync('../var_sk', { encoding: 'utf8', flag: 'r' });
    return [addonUUID, sk];
}

async function upgradeDependenciesTests(generalService: GeneralService, varPass) {
    const testData = {
        'API Testing Framework': ['eb26afcd-3cf2-482e-9ab1-b53c41a6adbe', ''],
        'Services Framework': ['00000000-0000-0000-0000-000000000a91', '9.5'],
        'Cross Platforms API': ['00000000-0000-0000-0000-000000abcdef', '9.'],
        'WebApp API Framework': ['00000000-0000-0000-0000-0000003eba91', '16.6'],
        'WebApp Platform': ['00000000-0000-0000-1234-000000000b2b', '16.60'],
        'Settings Framework': ['354c5123-a7d0-4f52-8fce-3cf1ebc95314', '9.5'],
        'Addons Manager': ['bd629d5f-a7b4-4d03-9e7c-67865a6d82a9', '0.'],
        'Data Views API': ['484e7f22-796a-45f8-9082-12a734bac4e8', '1.'],
        ADAL: ['00000000-0000-0000-0000-00000000ada1', '1.'],
        'Pepperi Notification Service': ['00000000-0000-0000-0000-000000040fa9', ''],
        relations: ['5ac7d8c3-0249-4805-8ce9-af4aecd77794', ''],
        'Object Types Editor': ['04de9428-8658-4bf7-8171-b59f6327bbf1', ''],
    };
    const isInstalledArr = await generalService.areAddonsInstalled(testData);
    const chnageVersionResponseArr = await generalService.chnageVersion(varPass, testData, true);

    //Services Framework, Cross Platforms API, WebApp Platform, Addons Manager, Data Views API, Settings Framework, ADAL
    describe('Upgrade Dependencies Addons', () => {
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
            describe(`${addonName}`, () => {
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
}
