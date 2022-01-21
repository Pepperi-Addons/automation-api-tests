import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
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

chai.use(promised);

export async function SecurityPolicyTests(email: string, password: string) {
    let driver: Browser;

    describe('Security Policy Test Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = await Browser.initiateChrome();
        });

        afterEach(async function () {
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.collectEndTestData(this);
            await driver.quit();
        });

        function testDataGetFromFileAtPath(pathOfFileToReadFrom): string {
            const file = fs.readFileSync(path.resolve(__dirname, pathOfFileToReadFrom));
            return file.toString();
        }

        const _TEST_DATA_TYPE_ARR = {
            dir: `dir c: \*.csv / s / b > c: \dor.txt`,
            jsRegex: `if (outpot.length > 200000) {
                outpot = outpot
                    .replace(/\s/g, '')
                    .replace(/,
                "fullFile": "" / g, '')
            };`,
            random: `return Math.random();`,
            date: `return new Date();`,
            query: `return "SELECT TOP 100 * FROM Wrnty.Account with(nolock) WHERE AccountID=" + AccountID;`,
            cSharp: `var cities = new Dictionary<string, string>()
            { { "UK", "London, Manchester, Birmingham" }, { "USA", "Chicago, New York, Washington" }, { "India", "Mumbai, New Delhi, Pune" } };
            //prints value of UK key
            Console.WriteLine(cities["UK"]);
            //prints value of USA key
            Console.WriteLine(cities["USA"]);
            // run-time exception: Key does not exist
            Console.WriteLine(cities["France"]);
            //use ContainsKey() to check for an unknown key
            if (cities.ContainsKey("France")) {
                Console.WriteLine(cities["France"]);
            }
            
            //use TryGetValue() to get a value of unknown key
            string result;
            if (cities.TryGetValue("France", out result)) {
                Console.WriteLine(result);
            }
            
            //use ElementAt() to retrieve key-value pair using index
            for (int i = 0; i < cities.Count; i++)
            {
                Console.WriteLine("Key: {0}, Value: {1}", cities.ElementAt(i).Key, cities.ElementAt(i).Value);
            }`,
            print: `console.log(UUID);`,
            promotionCode: `config.APINames["API_Discount_BreakBy_Price"] = "TSATotalPriceBefore";`,
            promotionFullScript: testDataGetFromFileAtPath(
                '../../api-tests/test-data/promotionScriptForSecurityPolicyTests.js',
            ),
        };

        for (const type in _TEST_DATA_TYPE_ARR) {
            it(`Validate Security Policy of ${type} argument (ITP-190)`, async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                const addonPage = new AddonPage(driver);

                //Remove the new ATD
                const webAppHeader = new WebAppHeader(driver);
                await driver.click(webAppHeader.Settings);

                const webAppSettingsSidePanel = new WebAppSettingsSidePanel(driver);
                await webAppSettingsSidePanel.selectSettingsByID('Sales Activities');
                await driver.click(webAppSettingsSidePanel.ObjectEditorTransactions);

                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);

                await driver.sendKeys(webAppTopBar.EditorSearchField, 'Promotion Test' + Key.ENTER);

                await webAppList.clickOnLinkFromListRowWebElement();

                await addonPage.editATDField('Custom Transaction Fields', {
                    Label: 'Security Policy Fields Test',
                    CalculatedRuleEngine: { JSFormula: _TEST_DATA_TYPE_ARR[type] },
                });

                //Validate Editor Page Loaded
                try {
                    //Let the fields refresh before trying to find
                    console.log('Wait for fields list to refresh after edit fields');
                    await driver.sleep(6000);
                    const isVisible = await driver.untilIsVisible(addonPage.AddonContainerATDEditorFieldsAddCustomArr);
                    expect(isVisible).to.be.true;
                } catch (error) {
                    addContext(this, {
                        title: `Security Policy Blocked This Code`,
                        value: _TEST_DATA_TYPE_ARR[type],
                    });
                    throw error;
                }
            });
        }
    });
}
