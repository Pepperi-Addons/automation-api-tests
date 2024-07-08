import { describe, it, before, after, afterEach } from 'mocha';
import { Client } from '@pepperi-addons/debug-server';
import GeneralService from '../../../../services/general.service';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import addContext from 'mochawesome/addContext';
import { Browser } from '../../../utilities/browser';
import {
    WebAppAPI,
    WebAppDialog,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppLoginPage,
    WebAppTopBar,
} from '../../../pom';
import { ObjectsService } from '../../../../services';
import { OrderPage } from '../../../pom/Pages/OrderPage';
import { PricingService } from '../../../../services/pricing.service';
import { PricingData06 } from '../../../pom/addons/PricingData06';
import { UserDefinedTableRow } from '@pepperi-addons/papi-sdk';
import PricingRules from '../../../pom/addons/PricingRules';
import E2EUtils from '../../../utilities/e2e_utils';
import { PricingDataNoUom } from '../../../pom/addons/PricingDataNoUom';

chai.use(promised);

export async function PricingMultipleValuesTests(
    email: string,
    password: string,
    client: Client,
    specialTestData?: 'noUom',
) {
    /*
________________________ 
_________________ Brief:
 
* Pricing Multiple Values
* at the account level there are multiple contracts definitions (field "PricingContracts" on account Edit)  
* each contract would have UDT rules applying to it
* 
* under the same condition ('ZDM1' || 'ZDM2' || 'ZDM3') - the contract that offers the best deal would be chosen.
*  for example between rule 'ZDM3@A006@Contract1' and rule 'ZDM3@A006@Contract2' - contract2 should be chosen since it offers 15% discount versus 5% of contract1
*   important - for a rule of the type of "applied on all UOMs" - both of the multiple calculation fields "PriceMultiAfter1" & "PriceMultiAfter2" will be afected!
* 
* 
* IMPORTANT! 
* after a conversation with Lihi (she explored it with Eyal Rozenberg) - different UOMs are NOT supported! (and no plan for it any time soon) 11/3/24
* XXX when different UOMs are definted - the choise between contracts would be per each UOM separately
* XXX for example between rule 'ZDM2@A007@Contract1@Facial Cosmetics', rule 'ZDM2@A007@Contract2@Facial Cosmetics' and rule 'ZDM2@A007@Contract3@Facial Cosmetics' :
* XXX   EA UOM  - contract3 should be chosen (but it applies only on Acc01), otherwise contart2 would be chosen
* XXX   CS UOM  - contract1 should be chosen at all accounts 
* XXX   BOX UOM - for 2 units: contart3 at Acc01, contract2 for other account | from 3 units and above: contract1 for all accounts
* 
* the test agenda is to ...
______________________________________ 
_________________ The Relevant Blocks:
            
. 'MultipleValuesAccount' -> ['ZDM3']
. 'MultipleValuesCategory' -> ['ZDM2']
. 'MultipleValuesItem' -> ['ZDM1']
. 'MultipleValues' -> ['ZDM1', 'ZDM2']

_________________ 
_________________ The Relevant Conditions:
            
. 'ZDM1' -> ['A010', 'A008']
. 'ZDM2' -> ['A007']
. 'ZDM3' -> ['A009', 'A006']

_________________ 
_________________ The Relevant Tables:
    
. 'A006' -> ['TransactionAccountTSAPricingContracts']
. 'A007' -> ['TransactionAccountTSAPricingContracts', 'ItemMainCategory']
. 'A008' -> ['TransactionAccountTSAPricingContracts', 'ItemExternalID']
. 'A009' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts']
. 'A010' -> ['TransactionAccountExternalID', 'TransactionAccountTSAPricingContracts', 'ItemExternalID']

________________________________ 
____________ The Relevant Rules:
 
. 'ZDM3@A006@Contract1':
    '[[true,"1555891200000","2534022144999","1","","ZDM3_A006 Contract1_ALL_UOMS",[[10,"D",5,"%"]],"EA"]]',

. 'ZDM3@A006@Contract2':
    '[[true,"1555891200000","2534022144999","1","","ZDM3_A006 Contract2_ALL_UOMS",[[10,"D",15,"%"]],"EA"]]',

. 'ZDM3@A009@Acc01@Contract1':
    '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract1_ALL_UOMS",[[10,"D",10,"%"]],"EA"]]',

. 'ZDM3@A009@Acc01@Contract2':
    '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract2_ALL_UOMS",[[10,"D",20,"%"]],"EA"]]',

. 'ZDM3@A009@Acc01@Contract3':
    '[[true,"1555891200000","2534022144999","1","","ZDM3_A009 Account_Contract3_ALL_UOMS",[[10,"D",30,"%"]],"EA"]]',

. 'ZDM2@A007@Contract1@Facial Cosmetics':
    '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract1",[[5,"D",5,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract1",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract1",[[3,"D",5,"%"],[6,"D",15,"%"]],"BOX","BOX"]]',

. 'ZDM2@A007@Contract2@Facial Cosmetics':
    '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract2",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",30,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract2",[[5,"D",10,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract2",[[2,"D",2,"%"]],"BOX","BOX"]]',

. 'ZDM2@A007@Contract3@Facial Cosmetics':
    '[[true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_EA_Contract3",[[2,"D",10,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_CS_Contract3",[[5,"D",5,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM2_A007 Category_BOX_Contract3",[[2,"D",5,"%"]],"BOX","BOX"]]',

. 'ZDM1@A008@Contract1@MaLi38':
    '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_EA_Contract1",[[5,"D",5,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_CS_Contract1",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",25,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_BOX_Contract1",[[3,"D",5,"%"],[6,"D",10,"%"]],"BOX","BOX"]]',

. 'ZDM1@A008@Contract2@MaLi38':
    '[[true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_EA_Contract2",[[2,"D",5,"%"],[5,"D",10,"%"],[10,"D",50,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_CS_Contract2",[[5,"D",5,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A008 Item_BOX_Contract2",[[6,"D",15,"%"]],"BOX","BOX"]]',

. 'ZDM1@A010@Acc01@Contract1@MaLi38':
    '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_EA_Contract1",[[2,"D",5,"%"],[5,"D",20,"%"],[10,"D",25,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_CS_Contract1",[[4,"D",4,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_BOX_Contract1",[[2,"D",2,"%"]],"BOX","BOX"]]',

. 'ZDM1@A010@Acc01@Contract3@MaLi38':
    '[[true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_EA_Contract3",[[10,"D",5,"%"]],"EA","EA"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_CS_Contract3",[[4,"D",15,"%"]],"CS","CS"],
      [true,"1555891200000","2534022144999","1","1","ZDM1_A010 Account_Item_BOX_Contract3",[[3,"D",25,"%"]],"BOX","BOX"]]',

______________________________ 
____________ Order Of Actions:
           
   1. Looping over accounts
 
       2. At Order Center: Looping over items
 
           2.1. Looping over states of Eachs
           ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Multiple[multipleValuesTestItem][priceField][account][multipleValuesTestState]['expectedValue'] )

           2.2. Looping over states of Cases
           ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Multiple[multipleValuesTestItem][priceField][account][multipleValuesTestState]['expectedValue'] )

           2.3. Looping over states of Boxs
           ----> retrieving pricing fields values from UI and comparing to expected data ( pricingData.testItemsValues.Multiple[multipleValuesTestItem][priceField][account][multipleValuesTestState]['expectedValue'] )
 
       3. At Cart: Looping over items
       ----> same check as at order center (just for the last state that OC got to)
 
_____________________________________________________________________________________________________________________________________________________________ 
_____________________________________________________________________________________________________________________________________________________________ 
*/
    const dateTime = new Date();
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    const pricingData = specialTestData === 'noUom' ? new PricingDataNoUom() : new PricingData06();
    const pricingRules = new PricingRules();
    const baseUrl = `https://${client.BaseURL.includes('staging') ? 'app.sandbox.pepperi.com' : 'app.pepperi.com'}`;
    const udtFirstTableName = 'PPM_Values';
    // const udtSecondTableName = 'PPM_AccountValues';

    const installedPricingVersion = (await generalService.getInstalledAddons()).find(
        (addon) => addon.Addon.Name == 'Pricing',
    )?.Version;

    // const installedPricingVersionShort = installedPricingVersion?.split('.')[1];
    console.info('Installed Pricing Version: ', JSON.stringify(installedPricingVersion, null, 2));

    const ppmValues_content =
        specialTestData === 'noUom'
            ? {
                  ...pricingRules[udtFirstTableName].features05noUom,
                  ...pricingRules[udtFirstTableName].features06noUom,
              }
            : {
                  ...pricingRules[udtFirstTableName].features05,
                  ...pricingRules[udtFirstTableName].features06,
              };

    let driver: Browser;
    let pricingService: PricingService;
    let webAppAPI: WebAppAPI;
    let webAppLoginPage: WebAppLoginPage;
    let webAppHomePage: WebAppHomePage;
    let webAppHeader: WebAppHeader;
    let webAppList: WebAppList;
    let webAppTopBar: WebAppTopBar;
    let webAppDialog: WebAppDialog;
    let orderPage: OrderPage;
    let e2eutils: E2EUtils;
    let transactionUUID_Acc01: string;
    let transactionUUID_OtherAcc: string;
    let accountName: string;
    let duration: string;
    let base64ImageComponent;
    let ppmValues: UserDefinedTableRow[];

    const testAccounts = ['Acc01', 'OtherAcc'];
    const multipleValuesTestItems_outOfCategory = ['Shampoo Three'];
    // const multipleValuesTestItems = ['MaFa25', 'MaLi37', 'MaLi38'];
    const multipleValuesTestStates_each = [
        'baseline',
        '1 Each',
        '2 Each',
        '1 Each',
        '3 Each',
        '2 Each',
        '5 Each',
        '9 Each',
        '5 Each',
        '10 Each',
        '11 Each',
        '10 Each',
    ];
    const multipleValuesTestStates_case = [
        '1 Case',
        '2 Case',
        '1 Case',
        '4 Case',
        '2 Case',
        '5 Case',
        '4 Case',
        '9 Case',
        '5 Case',
        '10 Case',
        '11 Case',
        '10 Case',
    ];
    const multipleValuesTestStates_box = [
        '1 Box',
        '2 Box',
        '1 Box',
        '3 Box',
        '5 Box',
        '3 Box',
        '6 Box',
        '5 Box',
        '7 Box',
        '6 Box',
        '10 Box',
    ];
    const priceMultiFields = [
        'PriceMultiAfter1',
        'PriceMultiAfter2',
        'PriceMultiAccountAfter1',
        'PriceMultiAccountAfter2',
        'PriceMultiCategoryAfter1',
        'PriceMultiCategoryAfter2',
        'PriceMultiItemAfter1',
        'PriceMultiItemAfter2',
    ];

    if (!installedPricingVersion?.startsWith('0.5')) {
        describe(`Pricing ** Multiple Values ** UI tests  - ${
            client.BaseURL.includes('staging') ? 'STAGE' : client.BaseURL.includes('eu') ? 'EU' : 'PROD'
        } | Ver ${installedPricingVersion} | Date Time: ${dateTime}`, function () {
            before(async function () {
                driver = await Browser.initiateChrome();
                webAppAPI = new WebAppAPI(driver, client);
                webAppLoginPage = new WebAppLoginPage(driver);
                webAppHomePage = new WebAppHomePage(driver);
                webAppHeader = new WebAppHeader(driver);
                webAppList = new WebAppList(driver);
                webAppTopBar = new WebAppTopBar(driver);
                webAppDialog = new WebAppDialog(driver);
                orderPage = new OrderPage(driver);
                e2eutils = new E2EUtils(driver);
                pricingService = new PricingService(
                    driver,
                    webAppLoginPage,
                    webAppHomePage,
                    webAppHeader,
                    webAppList,
                    webAppTopBar,
                    webAppDialog,
                    orderPage,
                );
            });

            after(async function () {
                await driver.quit();
            });

            afterEach(async function () {
                driver.sleep(500);
                await webAppHomePage.isDialogOnHomePAge(this);
                await webAppHomePage.collectEndTestData(this);
            });

            it('Login', async function () {
                await webAppLoginPage.login(email, password);
                base64ImageComponent = await driver.saveScreenshots();
                addContext(this, {
                    title: `At Home Page`,
                    value: 'data:image/png;base64,' + base64ImageComponent,
                });
            });

            it('Manual Resync', async function () {
                await e2eutils.performManualResync.bind(this)(client, driver);
            });

            it('If Error popup appear - close it', async function () {
                await driver.refresh();
                const accessToken = await webAppAPI.getAccessToken();
                await webAppAPI.pollForResyncResponse(accessToken, 100);
                try {
                    await webAppHomePage.isDialogOnHomePAge(this);
                } catch (error) {
                    console.error(error);
                } finally {
                    await driver.navigate(`${baseUrl}/HomePage`);
                }
                await webAppAPI.pollForResyncResponse(accessToken);
            });

            it('get UDT Values (PPM_Values)', async function () {
                ppmValues = await objectsService.getUDT({ where: "MapDataExternalID='PPM_Values'", page_size: -1 });
                console.info('PPM_Values Length: ', JSON.stringify(ppmValues.length, null, 2));
            });

            it('validating "PPM_Values" via API', async function () {
                const expectedPPMValuesLength =
                    Object.keys(ppmValues_content).length + pricingRules.dummyPPM_Values_length;
                console.info(
                    'EXPECTED: Object.keys(ppmValues_content).length + dummyPPM_ValuesKeys.length: ',
                    expectedPPMValuesLength,
                    'ACTUAL: ppmValues.length: ',
                    ppmValues.length,
                );
                addContext(this, {
                    title: `PPM Values Length`,
                    value: `ACTUAL: ${ppmValues.length} \nEXPECTED: ${expectedPPMValuesLength}`,
                });
                expect(ppmValues.length).equals(expectedPPMValuesLength);
                Object.keys(ppmValues_content).forEach((mainKey) => {
                    console.info('mainKey: ', mainKey);
                    const matchingRowOfppmValues = ppmValues.find((tableRow) => {
                        if (tableRow.MainKey === mainKey) {
                            return tableRow;
                        }
                    });
                    console.info('EXPECTED: ppmValues_content[mainKey]: ', ppmValues_content[mainKey]);
                    matchingRowOfppmValues &&
                        console.info('ACTUAL: matchingRowOfppmValues: ', matchingRowOfppmValues['Values'][0]);
                    matchingRowOfppmValues &&
                        addContext(this, {
                            title: `PPM Key "${mainKey}"`,
                            value: `ACTUAL  : ${matchingRowOfppmValues['Values'][0]} \nEXPECTED: ${ppmValues_content[mainKey]}`,
                        });
                    matchingRowOfppmValues &&
                        expect(ppmValues_content[mainKey]).equals(
                            client.BaseURL.includes('staging')
                                ? matchingRowOfppmValues['Values'].join()
                                : matchingRowOfppmValues['Values'][0],
                        );
                });
            });

            testAccounts.forEach((account) => {
                describe(`ACCOUNT "${account == 'Acc01' ? 'My Store' : 'Account for order scenarios'}"`, function () {
                    afterEach(async function () {
                        driver.sleep(500);
                        await webAppHomePage.isDialogOnHomePAge(this);
                        await webAppHomePage.collectEndTestData(this);
                    });

                    it('Creating new transaction', async function () {
                        switch (account) {
                            case 'Acc01':
                                accountName = 'My Store';
                                transactionUUID_Acc01 = await pricingService.startNewSalesOrderTransaction(accountName);
                                console.info('transactionUUID_Acc01:', transactionUUID_Acc01);
                                break;

                            default:
                                accountName = 'Account for order scenarios';
                                transactionUUID_OtherAcc = await pricingService.startNewSalesOrderTransaction(
                                    accountName,
                                );
                                console.info('transactionUUID_OtherAcc:', transactionUUID_OtherAcc);
                                break;
                        }
                        await orderPage.changeOrderCenterPageView('Line View');
                    });

                    it(`PERFORMANCE: making sure Sales Order Loading Duration is acceptable`, async function () {
                        let limit: number;
                        switch (true) {
                            case installedPricingVersion?.startsWith('0.5'):
                            case installedPricingVersion?.startsWith('0.6'):
                                limit = 650;
                                break;

                            default:
                                limit = 600;
                                break;
                        }
                        duration = await (await driver.findElement(orderPage.Duration_Span)).getAttribute('title');
                        console.info(`DURATION at Sales Order Load: ${duration}`);
                        addContext(this, {
                            title: `Sales Order - Loading Time, Version ${installedPricingVersion}`,
                            value: `Duration: ${duration} ms (limit: ${limit})`,
                        });
                        const duration_num = Number(duration);
                        expect(typeof duration_num).equals('number');
                        expect(duration_num).to.be.below(limit);
                    });

                    describe('Multiple Values (Out Of Category Item)', function () {
                        afterEach(async function () {
                            driver.sleep(500);
                            await webAppHomePage.isDialogOnHomePAge(this);
                            await webAppHomePage.collectEndTestData(this);
                        });

                        multipleValuesTestItems_outOfCategory.forEach((multipleValuesTestItem) => {
                            describe(`Item: ***${multipleValuesTestItem}`, function () {
                                afterEach(async function () {
                                    driver.sleep(500);
                                    await webAppHomePage.isDialogOnHomePAge(this);
                                    await webAppHomePage.collectEndTestData(this);
                                });

                                describe('ORDER CENTER', function () {
                                    afterEach(async function () {
                                        driver.sleep(500);
                                        await webAppHomePage.isDialogOnHomePAge(this);
                                        await webAppHomePage.collectEndTestData(this);
                                    });

                                    it(`Looking for "${multipleValuesTestItem}" using the search box`, async function () {
                                        await pricingService.searchInOrderCenter.bind(this)(
                                            multipleValuesTestItem,
                                            driver,
                                        );
                                        driver.sleep(1 * 1000);
                                    });

                                    [
                                        multipleValuesTestStates_each,
                                        multipleValuesTestStates_case,
                                        multipleValuesTestStates_box,
                                    ].forEach((uomStatesVeriable, index) => {
                                        describe(`${index == 0 ? 'Each' : index == 1 ? 'Case' : 'Box'}`, function () {
                                            afterEach(async function () {
                                                driver.sleep(500);
                                                await webAppHomePage.isDialogOnHomePAge(this);
                                                await webAppHomePage.collectEndTestData(this);
                                            });

                                            index == 1 &&
                                                it('Setting AOQM2 to 0', async function () {
                                                    await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                        this,
                                                    )('Each' + '&Totals', multipleValuesTestItem, 0, driver, '2');
                                                    driver.sleep(0.1 * 1000);
                                                });

                                            uomStatesVeriable.forEach((multipleValuesTestState) => {
                                                it(`Checking "${multipleValuesTestState}"`, async function () {
                                                    if (multipleValuesTestState != 'baseline') {
                                                        const splitedStateArgs = multipleValuesTestState.split(' ');
                                                        const chosenUom = splitedStateArgs[1];
                                                        const amount = Number(splitedStateArgs[0]);
                                                        addContext(this, {
                                                            title: `State Args`,
                                                            value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                                                        });
                                                        await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                                                            this,
                                                        )(
                                                            chosenUom,
                                                            multipleValuesTestItem,
                                                            amount,
                                                            driver,
                                                            chosenUom === 'Each' ? '2' : undefined,
                                                        );
                                                    }
                                                    const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                                        'OrderCenter',
                                                        multipleValuesTestItem,
                                                    );

                                                    const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                                                        'OrderCenter',
                                                        multipleValuesTestItem,
                                                    );
                                                    console.info(
                                                        `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                                                        NPMCalcMessage,
                                                    );
                                                    addContext(this, {
                                                        title: `NPM Calc Message:`,
                                                        value: `NPMCalcMessage: ${JSON.stringify(
                                                            NPMCalcMessage,
                                                            null,
                                                            2,
                                                        )}`,
                                                    });

                                                    expect(typeof priceMultiTSAs).equals('object');
                                                    expect(Object.keys(priceMultiTSAs)).to.eql(priceMultiFields);
                                                    priceMultiFields.forEach((priceField) => {
                                                        const fieldValue = priceMultiTSAs[priceField];
                                                        const expectedFieldValue =
                                                            pricingData.testItemsValues.Multiple[
                                                                multipleValuesTestItem
                                                            ][priceField][account][multipleValuesTestState][
                                                                'expectedValue'
                                                            ];
                                                        const expectedRules =
                                                            pricingData.testItemsValues.Multiple[
                                                                multipleValuesTestItem
                                                            ][priceField][account][multipleValuesTestState]['rules'];
                                                        expectedRules.forEach((expectedRule) => {
                                                            const udtKey = expectedRule
                                                                .split(`' ->`)[0]
                                                                .replace(`'`, '');
                                                            const udtRuleValueObj: UserDefinedTableRow | undefined =
                                                                ppmValues.find((listing) => {
                                                                    if (listing.MainKey === udtKey) return listing;
                                                                });
                                                            console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                        \nExpected Rule: ${expectedRule}
                                                        \nUDT Rule: ${udtKey}: ${
                                                                udtRuleValueObj
                                                                    ? udtRuleValueObj['Values']
                                                                    : 'Key not found'
                                                            }`);
                                                            addContext(this, {
                                                                title: `${priceField}`,
                                                                value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                                                            \nExpected Rule: ${expectedRule}
                                                            \nUDT Rule: ${udtKey}: ${
                                                                    udtRuleValueObj
                                                                        ? udtRuleValueObj['Values']
                                                                        : 'Key not found'
                                                                }`,
                                                            });
                                                        });
                                                    });

                                                    const expectedPriceMultiAfter1 =
                                                        pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                                                            'PriceMultiAfter1'
                                                        ][account][multipleValuesTestState]['expectedValue'];
                                                    const expectedPriceMultiAfter2 =
                                                        pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                                                            'PriceMultiAfter2'
                                                        ][account][multipleValuesTestState]['expectedValue'];
                                                    const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                                                    const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];
                                                    expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                                                    expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);
                                                    driver.sleep(0.2 * 1000);
                                                });
                                            });
                                        });
                                    });
                                });

                                describe('CART', function () {
                                    afterEach(async function () {
                                        driver.sleep(500);
                                        await webAppHomePage.isDialogOnHomePAge(this);
                                        await webAppHomePage.collectEndTestData(this);
                                    });

                                    it('entering and verifying being in cart', async function () {
                                        await driver.click(orderPage.Cart_Button);
                                        await orderPage.isSpinnerDone();
                                        driver.sleep(1 * 1000);
                                        await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                                    });

                                    it(`switch to 'Lines View'`, async function () {
                                        await orderPage.changeCartView('Lines');
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `After "Line View" was selected`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                    });

                                    it('verifying that the sum total of items in the cart is correct', async function () {
                                        const numberOfItemsInCart = multipleValuesTestItems_outOfCategory.length;
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `At Cart`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                        const itemsInCart = await (
                                            await driver.findElement(orderPage.Cart_Headline_Results_Number)
                                        ).getText();
                                        driver.sleep(0.2 * 1000);
                                        addContext(this, {
                                            title: `Number of Items in Cart`,
                                            value: `form UI: ${itemsInCart} , expected: ${numberOfItemsInCart}`,
                                        });
                                        expect(Number(itemsInCart)).to.equal(numberOfItemsInCart);
                                        driver.sleep(1 * 1000);
                                    });

                                    multipleValuesTestItems_outOfCategory.forEach((multipleValuesTestCartItem) => {
                                        it(`checking item "${multipleValuesTestCartItem}"`, async function () {
                                            const state = '10 Box';
                                            const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                                                'Cart',
                                                multipleValuesTestCartItem,
                                                undefined,
                                                undefined,
                                                'LinesView',
                                            );
                                            priceMultiFields.forEach((priceField) => {
                                                const expectedValue =
                                                    pricingData.testItemsValues.Multiple[multipleValuesTestCartItem][
                                                        priceField
                                                    ][account][state]['expectedValue'];
                                                const expectedRule =
                                                    pricingData.testItemsValues.Multiple[multipleValuesTestCartItem][
                                                        priceField
                                                    ][account][state]['rules'];
                                                addContext(this, {
                                                    title: `TSA field "${priceField}" Values`,
                                                    value: `Form UI: ${priceMultiTSAs[priceField]} , Expected Value: ${expectedValue}\nExpected Rule: ${expectedRule}`,
                                                });
                                                // expect(priceTSAs[priceField]).equals(expectedValue);
                                            });
                                            driver.sleep(1 * 1000);
                                        });
                                    });

                                    it('Click "Continue ordering" button', async function () {
                                        await driver.click(orderPage.Cart_ContinueOrdering_Button);
                                        await orderPage.isSpinnerDone();
                                        await orderPage.changeOrderCenterPageView('Line View');
                                        await orderPage.isSpinnerDone();
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `After "Line View" was selected`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                        await driver.untilIsVisible(orderPage.getSelectorOfItemInOrderCenterByName(''));
                                        driver.sleep(1 * 1000);
                                        base64ImageComponent = await driver.saveScreenshots();
                                        addContext(this, {
                                            title: `Order Center - Loaded`,
                                            value: 'data:image/png;base64,' + base64ImageComponent,
                                        });
                                    });
                                });
                            });
                        });
                    });

                    // describe('Multiple Values (Category Items)', function () {
                    //     it('Navigating to "Facial Cosmetics" at Sidebar', async function () {
                    //         await driver.untilIsVisible(orderPage.OrderCenter_SideMenu_BeautyMakeUp);
                    //         await driver.click(
                    //             orderPage.getSelectorOfSidebarSectionInOrderCenterByName('Facial Cosmetics'),
                    //         );
                    //         driver.sleep(0.1 * 1000);
                    //     });
                    //     multipleValuesTestItems.forEach((multipleValuesTestItem) => {
                    //         describe(`Item: ***${multipleValuesTestItem}`, function () {
                    //             describe('ORDER CENTER', function () {
                    //                 it(`Looking for "${multipleValuesTestItem}" using the search box`, async function () {
                    //                     await pricingService.searchInOrderCenter.bind(this)(
                    //                         multipleValuesTestItem,
                    //                         driver,
                    //                     );
                    //                     driver.sleep(1 * 1000);
                    //                 });
                    //                 describe('Each', function () {
                    //                     multipleValuesTestStates_each.forEach((multipleValuesTestState) => {
                    //                         it(`Checking "${multipleValuesTestState}"`, async function () {
                    //                             if (multipleValuesTestState != 'baseline') {
                    //                                 const splitedStateArgs = multipleValuesTestState.split(' ');
                    //                                 const chosenUom = splitedStateArgs[1];
                    //                                 const amount = Number(splitedStateArgs[0]);
                    //                                 addContext(this, {
                    //                                     title: `State Args`,
                    //                                     value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                    //                                 });
                    //                                 await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                    //                                     this,
                    //                                 )(
                    //                                     chosenUom,
                    //                                     multipleValuesTestItem,
                    //                                     amount,
                    //                                     driver,
                    //                                     chosenUom === 'Each' ? '2' : undefined,
                    //                                 );
                    //                             }
                    //                             const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );

                    //                             const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );
                    //                             console.info(
                    //                                 `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                    //                                 NPMCalcMessage,
                    //                             );
                    //                             addContext(this, {
                    //                                 title: `NPM Calc Message:`,
                    //                                 value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                    //                             });

                    //                             expect(typeof priceMultiTSAs).equals('object');
                    //                             expect(Object.keys(priceMultiTSAs)).to.eql(priceMultiFields);
                    //                             priceMultiFields.forEach((priceField) => {
                    //                                 const fieldValue = priceMultiTSAs[priceField];
                    //                                 const expectedFieldValue =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['expectedValue'];
                    //                                 const expectedRules =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['rules'];
                    //                                 expectedRules.forEach((expectedRule) => {
                    //                                     const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                    //                                     const udtRuleValueObj: UserDefinedTableRow | undefined =
                    //                                         ppmValues.find((listing) => {
                    //                                             if (listing.MainKey === udtKey) return listing;
                    //                                         });
                    //                                     console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                     \nExpected Rule: ${expectedRule}
                    //                                     \nUDT Rule: ${udtKey}: ${
                    //                                         udtRuleValueObj
                    //                                             ? udtRuleValueObj['Values']
                    //                                             : 'Key not found'
                    //                                     }`);
                    //                                     addContext(this, {
                    //                                         title: `${priceField}`,
                    //                                         value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                         \nExpected Rule: ${expectedRule}
                    //                                         \nUDT Rule: ${udtKey}: ${
                    //                                             udtRuleValueObj
                    //                                                 ? udtRuleValueObj['Values']
                    //                                                 : 'Key not found'
                    //                                         }`,
                    //                                     });
                    //                                 });
                    //                             });
                    //                             // For now this section is not relevant see remark on top 11/3/24:
                    //                             // const expectedPriceMultiAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                    //                             // const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];

                    //                             // expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                    //                             // expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);

                    //                             // NOT WORKING AS EXPECTED:
                    //                             // const expectedPriceMultiAccountAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAccountAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAccountAfter1 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter1'];
                    //                             // const actualPriceMultiAccountAfter2 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter2'];

                    //                             // expect(actualPriceMultiAccountAfter1).equals(
                    //                             //     expectedPriceMultiAccountAfter1,
                    //                             // );
                    //                             // expect(actualPriceMultiAccountAfter2).equals(
                    //                             //     expectedPriceMultiAccountAfter2,
                    //                             // );
                    //                             driver.sleep(0.2 * 1000);
                    //                         });
                    //                     });
                    //                 });
                    //                 describe('Case', function () {
                    //                     multipleValuesTestStates_case.forEach((multipleValuesTestState) => {
                    //                         it(`Checking "${multipleValuesTestState}"`, async function () {
                    //                             const splitedStateArgs = multipleValuesTestState.split(' ');
                    //                             const chosenUom = splitedStateArgs[1];
                    //                             const amount = Number(splitedStateArgs[0]);
                    //                             addContext(this, {
                    //                                 title: `State Args`,
                    //                                 value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                    //                             });
                    //                             await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                    //                                 this,
                    //                             )(chosenUom + '&Totals', multipleValuesTestItem, amount, driver);
                    //                             const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );
                    //                             console.info(
                    //                                 `${multipleValuesTestItem} ${multipleValuesTestState} priceMultiTSAs:`,
                    //                                 priceMultiTSAs,
                    //                             );

                    //                             const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );
                    //                             console.info(
                    //                                 `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                    //                                 NPMCalcMessage,
                    //                             );
                    //                             addContext(this, {
                    //                                 title: `NPM Calc Message:`,
                    //                                 value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                    //                             });

                    //                             expect(typeof priceMultiTSAs).equals('object');
                    //                             expect(Object.keys(priceMultiTSAs)).to.eql(priceMultiFields);
                    //                             priceMultiFields.forEach((priceField) => {
                    //                                 const fieldValue = priceMultiTSAs[priceField];
                    //                                 const expectedFieldValue =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['expectedValue'];
                    //                                 const expectedRules =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['rules'];
                    //                                 expectedRules.forEach((expectedRule) => {
                    //                                     const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                    //                                     const udtRuleValueObj: UserDefinedTableRow | undefined =
                    //                                         ppmValues.find((listing) => {
                    //                                             if (listing.MainKey === udtKey) return listing;
                    //                                         });
                    //                                     console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                         \nExpected Rule: ${expectedRule}
                    //                                         \nUDT Rule: ${udtKey}: ${
                    //                                         udtRuleValueObj
                    //                                             ? udtRuleValueObj['Values']
                    //                                             : 'Key not found'
                    //                                     }`);
                    //                                     addContext(this, {
                    //                                         title: `${priceField}`,
                    //                                         value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                             \nExpected Rule: ${expectedRule}
                    //                                             \nUDT Rule: ${udtKey}: ${
                    //                                             udtRuleValueObj
                    //                                                 ? udtRuleValueObj['Values']
                    //                                                 : 'Key not found'
                    //                                         }`,
                    //                                     });
                    //                                 });
                    //                             });
                    //                             // For now this section is not relevant see remark on top 11/3/24:
                    //                             // const expectedPriceMultiAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                    //                             // const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];

                    //                             // expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                    //                             // expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);

                    //                             // NOT WORKING AS EXPECTED:
                    //                             // const expectedPriceMultiAccountAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAccountAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAccountAfter1 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter1'];
                    //                             // const actualPriceMultiAccountAfter2 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter2'];

                    //                             // expect(actualPriceMultiAccountAfter1).equals(
                    //                             //     expectedPriceMultiAccountAfter1,
                    //                             // );
                    //                             // expect(actualPriceMultiAccountAfter2).equals(
                    //                             //     expectedPriceMultiAccountAfter2,
                    //                             // );
                    //                             driver.sleep(0.2 * 1000);
                    //                         });
                    //                     });
                    //                 });
                    //                 describe('Box', function () {
                    //                     multipleValuesTestStates_box.forEach((multipleValuesTestState) => {
                    //                         it(`Checking "${multipleValuesTestState}"`, async function () {
                    //                             const splitedStateArgs = multipleValuesTestState.split(' ');
                    //                             const chosenUom = splitedStateArgs[1];
                    //                             const amount = Number(splitedStateArgs[0]);
                    //                             addContext(this, {
                    //                                 title: `State Args`,
                    //                                 value: `Chosen UOM: ${chosenUom}, Amount: ${amount}`,
                    //                             });
                    //                             await pricingService.changeSelectedQuantityOfSpecificItemInOrderCenter.bind(
                    //                                 this,
                    //                             )(chosenUom + '&Totals', multipleValuesTestItem, amount, driver);
                    //                             const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );
                    //                             console.info(
                    //                                 `${multipleValuesTestItem} ${multipleValuesTestState} priceMultiTSAs:`,
                    //                                 priceMultiTSAs,
                    //                             );

                    //                             const NPMCalcMessage = await pricingService.getItemNPMCalcMessage(
                    //                                 'OrderCenter',
                    //                                 multipleValuesTestItem,
                    //                             );
                    //                             console.info(
                    //                                 `${multipleValuesTestItem} ${multipleValuesTestState} NPMCalcMessage:`,
                    //                                 NPMCalcMessage,
                    //                             );
                    //                             addContext(this, {
                    //                                 title: `NPM Calc Message:`,
                    //                                 value: `NPMCalcMessage: ${JSON.stringify(NPMCalcMessage, null, 2)}`,
                    //                             });

                    //                             expect(typeof priceMultiTSAs).equals('object');
                    //                             expect(Object.keys(priceMultiTSAs)).to.eql(priceMultiFields);
                    //                             priceMultiFields.forEach((priceField) => {
                    //                                 const fieldValue = priceMultiTSAs[priceField];
                    //                                 const expectedFieldValue =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['expectedValue'];
                    //                                 const expectedRules =
                    //                                     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                                         priceField
                    //                                     ][account][multipleValuesTestState]['rules'];
                    //                                 expectedRules.forEach((expectedRule) => {
                    //                                     const udtKey = expectedRule.split(`' ->`)[0].replace(`'`, '');
                    //                                     const udtRuleValueObj: UserDefinedTableRow | undefined =
                    //                                         ppmValues.find((listing) => {
                    //                                             if (listing.MainKey === udtKey) return listing;
                    //                                         });
                    //                                     console.info(`Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                         \nExpected Rule: ${expectedRule}
                    //                                         \nUDT Rule: ${udtKey}: ${
                    //                                         udtRuleValueObj
                    //                                             ? udtRuleValueObj['Values']
                    //                                             : 'Key not found'
                    //                                     }`);
                    //                                     addContext(this, {
                    //                                         title: `${priceField}`,
                    //                                         value: `Field Value from UI: ${fieldValue}, Expected Field Value from Data: ${expectedFieldValue}
                    //                                             \nExpected Rule: ${expectedRule}
                    //                                             \nUDT Rule: ${udtKey}: ${
                    //                                             udtRuleValueObj
                    //                                                 ? udtRuleValueObj['Values']
                    //                                                 : 'Key not found'
                    //                                         }`,
                    //                                     });
                    //                                 });
                    //                             });
                    //                             // For now this section is not relevant see remark on top 11/3/24:
                    //                             // const expectedPriceMultiAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAfter1 = priceMultiTSAs['PriceMultiAfter1'];
                    //                             // const actualPriceMultiAfter2 = priceMultiTSAs['PriceMultiAfter2'];

                    //                             // expect(actualPriceMultiAfter1).equals(expectedPriceMultiAfter1);
                    //                             // expect(actualPriceMultiAfter2).equals(expectedPriceMultiAfter2);

                    //                             // NOT WORKING AS EXPECTED:
                    //                             // const expectedPriceMultiAccountAfter1 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter1'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const expectedPriceMultiAccountAfter2 =
                    //                             //     pricingData.testItemsValues.Multiple[multipleValuesTestItem][
                    //                             //         'PriceMultiAccountAfter2'
                    //                             //     ][account][multipleValuesTestState]['expectedValue'];
                    //                             // const actualPriceMultiAccountAfter1 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter1'];
                    //                             // const actualPriceMultiAccountAfter2 =
                    //                             //     priceMultiTSAs['PriceMultiAccountAfter2'];

                    //                             // expect(actualPriceMultiAccountAfter1).equals(
                    //                             //     expectedPriceMultiAccountAfter1,
                    //                             // );
                    //                             // expect(actualPriceMultiAccountAfter2).equals(
                    //                             //     expectedPriceMultiAccountAfter2,
                    //                             // );
                    //                             driver.sleep(0.2 * 1000);
                    //                         });
                    //                     });
                    //                 });
                    //             });
                    //         });
                    //     });

                    //     describe('CART', function () {
                    //         it('entering and verifying being in cart', async function () {
                    //             await driver.click(orderPage.Cart_Button);
                    //             await orderPage.isSpinnerDone();
                    //             driver.sleep(1 * 1000);
                    //             await driver.untilIsVisible(orderPage.Cart_ContinueOrdering_Button);
                    //         });
                    //         it(`switch to 'Lines View'`, async function () {
                    //             await orderPage.changeCartView('Lines');
                    //             base64ImageComponent = await driver.saveScreenshots();
                    //             addContext(this, {
                    //                 title: `After "Line View" was selected`,
                    //                 value: 'data:image/png;base64,' + base64ImageComponent,
                    //             });
                    //         });
                    //         it('verifying that the sum total of items in the cart is correct', async function () {
                    //             const numberOfItemsInCart =
                    //                 multipleValuesTestItems_outOfCategory.length + multipleValuesTestItems.length;
                    //             base64ImageComponent = await driver.saveScreenshots();
                    //             addContext(this, {
                    //                 title: `At Cart`,
                    //                 value: 'data:image/png;base64,' + base64ImageComponent,
                    //             });
                    //             const itemsInCart = await (
                    //                 await driver.findElement(orderPage.Cart_Headline_Results_Number)
                    //             ).getText();
                    //             driver.sleep(0.2 * 1000);
                    //             addContext(this, {
                    //                 title: `Number of Items in Cart`,
                    //                 value: `form UI: ${itemsInCart} , expected: ${numberOfItemsInCart}`,
                    //             });
                    //             expect(Number(itemsInCart)).to.equal(numberOfItemsInCart);
                    //             driver.sleep(1 * 1000);
                    //         });
                    //         it(`filtering cart using smart filter Item External ID`, async function () {
                    //             await driver.click(orderPage.Cart_SmartFilter_ItemExternalID);
                    //             driver.sleep(0.3 * 1000);
                    //             multipleValuesTestItems.forEach(async (partialValueTestCartItem) => {
                    //                 await driver.click(
                    //                     orderPage.getSelectorOfCheckboxOfSmartFilterItemExternalIdAtCartByText(
                    //                         partialValueTestCartItem,
                    //                     ),
                    //                 );
                    //                 driver.sleep(0.3 * 1000);
                    //             });
                    //             await driver.untilIsVisible(orderPage.Cart_SmartFilter_ApplyButton);
                    //             await driver.click(orderPage.Cart_SmartFilter_ApplyButton);
                    //             await orderPage.isSpinnerDone();
                    //             driver.sleep(2 * 1000);
                    //             const itemsInCart = await (
                    //                 await driver.findElement(orderPage.Cart_Headline_Results_Number)
                    //             ).getText();
                    //             driver.sleep(0.2 * 1000);
                    //             base64ImageComponent = await driver.saveScreenshots();
                    //             addContext(this, {
                    //                 title: `After Smart Filter Activated`,
                    //                 value: 'data:image/png;base64,' + base64ImageComponent,
                    //             });
                    //             addContext(this, {
                    //                 title: `After Smart Filter - Number of Items in Cart`,
                    //                 value: `form UI: ${itemsInCart} , expected: ${multipleValuesTestItems.length}`,
                    //             });
                    //             expect(Number(itemsInCart)).to.equal(multipleValuesTestItems.length);
                    //         });
                    //         multipleValuesTestItems.forEach((multipleValuesTestCartItem) => {
                    //             it(`checking item "${multipleValuesTestCartItem}"`, async function () {
                    //                 const state = '10 Box';
                    //                 const priceMultiTSAs = await pricingService.getTSAsOfMultiPerItem(
                    //                     'Cart',
                    //                     multipleValuesTestCartItem,
                    //                     undefined,
                    //                     undefined,
                    //                     'LinesView',
                    //                 );
                    //                 priceMultiFields.forEach((priceField) => {
                    //                     const expectedValue =
                    //                         pricingData.testItemsValues.Multiple[multipleValuesTestCartItem][
                    //                             priceField
                    //                         ][account][state]['expectedValue'];
                    //                     const expectedRule =
                    //                         pricingData.testItemsValues.Multiple[multipleValuesTestCartItem][
                    //                             priceField
                    //                         ][account][state]['rules'];
                    //                     addContext(this, {
                    //                         title: `TSA field "${priceField}" Values`,
                    //                         value: `Form UI: ${priceMultiTSAs[priceField]} , Expected Value: ${expectedValue}\nExpected Rule: ${expectedRule}`,
                    //                     });

                    //                     // NOT WORKING AS EXPECTED:
                    //                     // For now the only correct value fields are of Account (where the rules are applied to all UOMs and not separate) 11/3/24:
                    //                     // switch (priceField) {
                    //                     //     case 'PriceMultiAccountAfter1':
                    //                     //     case 'PriceMultiAccountAfter2':
                    //                     //         expect(priceMultiTSAs[priceField]).equals(expectedValue);
                    //                     //         break;

                    //                     //     default:
                    //                     //         break;
                    //                     // }
                    //                 });
                    //                 driver.sleep(1 * 1000);
                    //             });
                    //         });
                    //     });
                    // });
                });
            });

            describe('Cleanup', function () {
                afterEach(async function () {
                    driver.sleep(500);
                    await webAppHomePage.isDialogOnHomePAge(this);
                    await webAppHomePage.collectEndTestData(this);
                });

                it('deleting all Activities', async function () {
                    await webAppHeader.goHome();
                    await webAppHomePage.isSpinnerDone();
                    await webAppHomePage.clickOnBtn('Activities');
                    await webAppHomePage.isSpinnerDone();
                    driver.sleep(0.1 * 1000);
                    try {
                        await webAppList.checkAllListElements();
                        driver.sleep(0.1 * 1000);
                        await webAppList.clickOnListActionsButton();
                        driver.sleep(0.1 * 1000);
                        await webAppList.selectUnderPencilMenu('Delete');
                        driver.sleep(0.1 * 1000);
                        await driver.untilIsVisible(webAppDialog.ButtonArr);
                        driver.sleep(0.1 * 1000);
                        await webAppDialog.selectDialogBoxByText('Delete');
                        await webAppDialog.isSpinnerDone();
                        driver.sleep(0.1 * 1000);
                        await webAppHeader.goHome();
                        await webAppHomePage.isSpinnerDone();
                    } catch (error) {
                        console.error(error);
                        if (await driver.untilIsVisible(webAppList.NoActivitiesFound_Text)) {
                            console.info('List is EMPTY - no activities found');
                        }
                    }
                });
            });
        });
    }
}
