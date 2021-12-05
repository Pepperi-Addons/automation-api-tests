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
    WebAppTransaction,
    WebAppAPI,
    WebAppDialog,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { ObjectsService } from '../../services/objects.service';
import { Client } from '@pepperi-addons/debug-server';

chai.use(promised);

export async function PromotionTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    describe('Promotion Tests Suit', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.collectEndTestData(this);
            await driver.quit();
        });

        describe('Basic Scenarios', function () {
            it('Order Five Items - Get One Free', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');
                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);
                await webAppTransaction.addItemToCart(this, 'MaFa24', 5, true);
                console.log('Ordering Items');
                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);
                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.isSpinnerDone();
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);
                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 20;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);
                const lastTransactionLines = await objectsService.getTransactionLines({
                    where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                });
                addContext(this, {
                    title: `Last transaction lines total price from API`,
                    value: lastTransaction[0].GrandTotal,
                });
                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                expect(lastTransaction[0].SubTotal).to.equal(172.5);
                expect(lastTransaction[0].GrandTotal).to.equal(172.5);
                expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(172.5);
                expect(lastTransaction[0].ItemsCount).to.equal(2);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(6);
                expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(172.5);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(172.5);
                expect(lastTransactionLines[0].TSAPPIItemPromotionPromotionCode).to.equal('5kitPP');
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'When buying 5 kits, get another kit for free',
                );
                expect(lastTransactionLines[0].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"5","CurrentValue":5}]}',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(34.5);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(34.5);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(5);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('MaFa24');
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(34.5);
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal('5kitPP');
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'When buying 5 kits, get another kit for free',
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"5","CurrentValue":5}]}',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(34.5);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal('MaFa24');

                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });

            it('Order One Item - Get Anohther Item Free', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);
                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');
                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);
                await webAppTransaction.addItemToCart(this, 'MakeUp006', 1, true);
                console.log('Ordering Items');
                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);
                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.isSpinnerDone();
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);
                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 20;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);
                const lastTransactionLines = await objectsService.getTransactionLines({
                    where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                });
                addContext(this, {
                    title: `Last transaction lines total price from API`,
                    value: lastTransaction[0].GrandTotal,
                });
                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                expect(lastTransaction[0].SubTotal).to.equal(33.75);
                expect(lastTransaction[0].GrandTotal).to.equal(33.75);
                expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(33.75);
                expect(lastTransaction[0].ItemsCount).to.equal(2);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(2);
                expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].TSAPPIItemPromotionPromotionCode).to.equal('1Plus1PP');
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'Get Eyeliner for free when you buy Skin Perfector',
                );
                expect(lastTransactionLines[0].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"1","CurrentValue":1}]}',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(33.75);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('MakeUp006');
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(15.95);
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal('1Plus1PP');
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'Get Eyeliner for free when you buy Skin Perfector',
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"1","CurrentValue":1}]}',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(15.95);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal('MakeUp019');
                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });
        });

        describe('Advanced Scenarios', function () {
            it('Items - Discounts For Ordering Amount Of Items', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');

                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);

                await webAppTransaction.addItemToCart(this, 'Shampoo Three', 1, true);

                const webAPI = new WebAppAPI(driver, client);
                const accessToken = await webAPI.getAccessToken();

                //Get Catalog from Cart
                const cartURL = await driver.getCurrentUrl();
                const catalogUUID = cartURL.split(/[/'|'?']/)[5];

                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);

                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.isSpinnerDone();

                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Promo Steps: [11, 12*, 15, 19, 20*, 21, 25*, 30*, 31]; //The marked with "*" are the set promotion steps
                const promotionsArr = [11, 12, 15, 19, 20, 21, 25, 30, 31];
                const dataFromCartObj = {};
                for (let index = 0; index < promotionsArr.length; index++) {
                    await webAppTransaction.changeItemInCart(this, promotionsArr[index], true);
                    const dataFromCartWebAPI = await GetDataFromCartWebAPI(webAPI, accessToken, catalogUUID);
                    dataFromCartObj[index] = dataFromCartWebAPI;

                    expect(dataFromCartObj[index][0][1]).to.equal('Shampoo Three');
                    expect(dataFromCartObj[index][1][1]).to.equal('Paul Pitchell');
                    expect(dataFromCartObj[index][6][1]).to.include(
                        (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    expect(dataFromCartObj[index][12][1]).to.equal('Discounts for ordering amount of items');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 7][1]).to.equal('false');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 6][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 5][1]).to.equal(
                        '💲💲💲 Buy 100$ Discounts for ordering items over set price to get 5% off',
                    );
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 4][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 3][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 2][1]).to.equal(
                        '{"AppliedRules":[]}',
                    );
                    if (promotionsArr[index] < 12) {
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$36.95');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1]).to.include('💲💲💲');
                        expect(dataFromCartObj[index][10][1]).to.equal('');
                        expect(dataFromCartObj[index][11][1]).to.equal('{"AppliedRules":[]}');
                    } else if (promotionsArr[index] < 20) {
                        expect(dataFromCartObj[index][3][1]).to.equal('3%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$35.84');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include(' more to get $2 off');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal('Discounts for ordering amount of items');
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"12"');
                    } else if (promotionsArr[index] < 25) {
                        expect(dataFromCartObj[index][3][1]).to.equal('5.41%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$34.95');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include(' more to get $23 off');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal('Discounts for ordering amount of items');
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"20"');
                    } else if (promotionsArr[index] < 30) {
                        expect(dataFromCartObj[index][3][1]).to.equal('37.75%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$23.00');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include(' more to get 8 additional items');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal('Discounts for ordering amount of items');
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"25"');
                    } else {
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$36.95');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][6][1]).to.equal(dataFromCartObj[index][7][1]);
                        expect(dataFromCartObj[index][8][1]).to.include('');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal('Discounts for ordering amount of items');

                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"30"');
                        expect(dataFromCartObj[index][13][1]).to.equal('Spring Loaded Frizz-Fighting Conditioner');
                        expect(dataFromCartObj[index][14][1]).to.equal('Paul Pitchell');
                        expect(dataFromCartObj[index][15][1]).to.equal('$27.00');
                        expect(dataFromCartObj[index][16][1]).to.equal('100%');
                        expect(dataFromCartObj[index][17][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][18][1]).to.equal('8');
                        expect(dataFromCartObj[index][19][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][20][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][21][1]).to.equal('');
                        expect(dataFromCartObj[index][22][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][23][1]).to.equal('Discounts for ordering amount of items');
                        expect(dataFromCartObj[index][24][1]).to.include('"MinTotal":"30"');
                        expect(dataFromCartObj[index][25][1]).to.equal('');
                    }
                }

                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);

                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 20;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                const lastTransactionLines = await objectsService.getTransactionLines({
                    where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                });

                addContext(this, {
                    title: `Last transaction lines total price from API`,
                    value: lastTransaction[0].GrandTotal,
                });
                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                expect(lastTransaction[0].SubTotal).to.equal(1361.45);
                expect(lastTransaction[0].GrandTotal).to.equal(1145.45);
                expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(1145.45);
                expect(lastTransaction[0].ItemsCount).to.equal(2);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(39);
                expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(1145.45);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(1145.45);
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering amount of items',
                );
                expect(lastTransactionLines[0].TSAPPIItemPromotionReasonReference).to.include('"MinTotal":"30"');
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(36.95);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(36.95);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(31);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('Shampoo Three');

                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(216);
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal(
                    lastTransactionLines[0].TSAPPIItemPromotionPromotionCode,
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering amount of items',
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReasonReference).to.include('"MinTotal":"30"');
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(27);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(8);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal(
                    'Spring Loaded Frizz-Fighting Conditioner',
                );

                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });

            it('Items - Discounts For Ordering More Then Prince Of Items', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');

                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);

                await webAppTransaction.addItemToCart(this, 'MakeUp002', 1, true);

                const webAPI = new WebAppAPI(driver, client);
                const accessToken = await webAPI.getAccessToken();

                //Get Catalog from Cart
                const cartURL = await driver.getCurrentUrl();
                const catalogUUID = cartURL.split(/[/'|'?']/)[5];

                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);

                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.isSpinnerDone();

                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Promo Steps: [8, 9*, 11, 16, 17*, 33, 34*, 44*, 45]; //The marked with "*" are the set promotion steps
                const promotionsArr = [8, 9, 11, 16, 17, 33, 34, 44, 45];
                const dataFromCartObj = {};
                for (let index = 0; index < promotionsArr.length; index++) {
                    await webAppTransaction.changeItemInCart(this, promotionsArr[index], true);
                    const dataFromCartWebAPI = await GetDataFromCartWebAPI(webAPI, accessToken, catalogUUID);
                    dataFromCartObj[index] = dataFromCartWebAPI;

                    expect(dataFromCartObj[index][0][1]).to.equal('MakeUp002');
                    expect(dataFromCartObj[index][1][1]).to.equal('Beauty Make Up');
                    expect(dataFromCartObj[index][6][1]).to.include(
                        (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    expect(dataFromCartObj[index][12][1]).to.equal('Discounts for ordering more then prince of items');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 7][1]).to.equal('false');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 6][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 5][1]).to.equal(
                        '💲💲💲 Buy 100$ Discounts for ordering items over set price to get 5% off',
                    );
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 4][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 3][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 2][1]).to.equal(
                        '{"AppliedRules":[]}',
                    );
                    if (promotionsArr[index] < 9) {
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$29.75');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1]).to.include('💲💲💲');
                        expect(dataFromCartObj[index][10][1]).to.equal('');
                        expect(dataFromCartObj[index][11][1]).to.equal('{"AppliedRules":[]}');
                    } else if (promotionsArr[index] < 17) {
                        expect(dataFromCartObj[index][3][1]).to.equal('6%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$27.97');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy $')
                            .and.include(' more to get $2 off');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal(
                            'Discounts for ordering more then prince of items',
                        );
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"250"');
                    } else if (promotionsArr[index] < 34) {
                        expect(dataFromCartObj[index][3][1]).to.equal('6.72%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$27.75');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy $')
                            .and.include(' more to get $26 off');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal(
                            'Discounts for ordering more then prince of items',
                        );
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"500"');
                    } else if (promotionsArr[index] < 44) {
                        expect(dataFromCartObj[index][3][1]).to.equal('12.61%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$26.00');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][8][1])
                            .to.include('💲💲💲 Buy $')
                            .and.include(' more to get 10 additional items');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal(
                            'Discounts for ordering more then prince of items',
                        );
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"1000"');
                    } else {
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$29.75');
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][6][1]).to.equal(dataFromCartObj[index][7][1]);
                        expect(dataFromCartObj[index][8][1]).to.include('');
                        expect(dataFromCartObj[index][9][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][10][1]).to.equal(
                            'Discounts for ordering more then prince of items',
                        );
                        expect(dataFromCartObj[index][11][1]).to.include('"MinTotal":"1300"');
                        expect(dataFromCartObj[index][13][1]).to.equal('MakeUp002');
                        expect(dataFromCartObj[index][14][1]).to.equal('Beauty Make Up');
                        expect(dataFromCartObj[index][15][1]).to.equal('$29.75');
                        expect(dataFromCartObj[index][16][1]).to.equal('100%');
                        expect(dataFromCartObj[index][17][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][18][1]).to.equal('10');
                        expect(dataFromCartObj[index][19][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][20][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][21][1]).to.equal('');
                        expect(dataFromCartObj[index][22][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][23][1]).to.equal(
                            'Discounts for ordering more then prince of items',
                        );
                        expect(dataFromCartObj[index][24][1]).to.include('"MinTotal":"1300"');
                        expect(dataFromCartObj[index][25][1]).to.equal('');
                    }
                }

                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);

                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 20;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                const lastTransactionLines = await objectsService.getTransactionLines({
                    where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                });

                addContext(this, {
                    title: `Last transaction lines total price from API`,
                    value: lastTransaction[0].GrandTotal,
                });
                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                expect(lastTransaction[0].SubTotal).to.equal(1636.25);
                expect(lastTransaction[0].GrandTotal).to.equal(1338.75);
                expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(1338.75);
                expect(lastTransaction[0].ItemsCount).to.equal(2);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(55);
                expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(1338.75);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(1338.75);
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering more then prince of items',
                );
                expect(lastTransactionLines[0].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"1300","CurrentValue":1338.75}]}',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(29.75);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(29.75);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(45);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('MakeUp002');

                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(297.5);
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal(
                    lastTransactionLines[0].TSAPPIItemPromotionPromotionCode,
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering more then prince of items',
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReasonReference).to.include(
                    '"MinTotal":"1300","CurrentValue":1338.75}]}',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(29.75);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(10);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal('MakeUp002');

                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });

            it('Order - Discounts For An Order Over Set Price', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');

                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);

                await webAppTransaction.addItemToCart(this, 'MaNa23', 1, true);

                const webAPI = new WebAppAPI(driver, client);
                const accessToken = await webAPI.getAccessToken();

                //Get Catalog from Cart
                const cartURL = await driver.getCurrentUrl();
                const catalogUUID = cartURL.split(/[/'|'?']/)[5];

                const webAppList = new WebAppList(driver);
                const webAppTopBar = new WebAppTopBar(driver);

                await webAppList.click(webAppTopBar.CartViewBtn);
                await webAppList.isSpinnerDone();

                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Promo Steps: [2, 3*, 4, 5*, 6, 7, 8*, 9, 10*, 11]; //The marked with "*" are the set promotion steps
                const promotionsArr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                const dataFromCartObj = {};
                for (let index = 0; index < promotionsArr.length; index++) {
                    await webAppTransaction.changeItemInCart(this, promotionsArr[index], true);
                    const dataFromCartWebAPI = await GetDataFromCartWebAPI(webAPI, accessToken, catalogUUID);
                    dataFromCartObj[index] = dataFromCartWebAPI;

                    const cart = await webAPI.getCart(accessToken, catalogUUID);
                    const cartTotalFormatted = cart.CloseFooter.Data.Fields[0].FormattedValue;

                    expect(dataFromCartObj[index][0][1]).to.equal('MaNa23');
                    expect(dataFromCartObj[index][1][1]).to.equal('Hand Cosmetics');
                    expect(dataFromCartObj[index][2][1]).to.equal('$40.25');
                    expect(dataFromCartObj[index][3][1]).to.equal('0%');
                    expect(dataFromCartObj[index][4][1]).to.equal('$40.25');
                    expect(dataFromCartObj[index][6][1]).to.include(
                        (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    expect(dataFromCartObj[index][7][1]).to.include(
                        (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    expect(dataFromCartObj[index][8][1]).to.include('');
                    expect(dataFromCartObj[index][9][1]).to.include('');
                    expect(dataFromCartObj[index][10][1]).to.include('');
                    expect(dataFromCartObj[index][11][1]).to.equal('{"AppliedRules":[]}');
                    expect(dataFromCartObj[index][12][1]).to.equal('');
                    expect(dataFromCartObj[index][dataFromCartObj[index].length - 1][1]).to.include(
                        (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    if (promotionsArr[index] < 3) {
                        expect(dataFromCartObj[index][13][1]).to.equal('false');
                        expect(dataFromCartObj[index][14][1]).to.equal('');
                        expect(dataFromCartObj[index][15][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include('$ more Discounts for ordering items over set price to get 5% off');
                        expect(dataFromCartObj[index][16][1]).to.equal('');
                        expect(dataFromCartObj[index][17][1]).to.equal('');
                        expect(dataFromCartObj[index][18][1]).to.equal('{"AppliedRules":[]}');
                        expect(dataFromCartObj[index][19][1]).to.equal(dataFromCartObj[index][6][1]);
                        expect(dataFromCartObj[index][19][1]).to.equal(cartTotalFormatted);
                    } else if (promotionsArr[index] < 5) {
                        expect(dataFromCartObj[index][13][1]).to.equal('false');
                        expect(dataFromCartObj[index][14][1]).to.equal('');
                        expect(dataFromCartObj[index][15][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include('$ more Discounts for ordering items over set price to get $20 off');
                        expect(dataFromCartObj[index][16][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][17][1]).to.equal('Discounts for ordering items over set price');
                        expect(dataFromCartObj[index][18][1]).to.include('"MinTotal":"100"');
                        expect(dataFromCartObj[index][19][1]).to.equal(dataFromCartObj[index][6][1]);
                        expect(dataFromCartObj[index][19][1]).to.not.equal(cartTotalFormatted);
                    } else if (promotionsArr[index] < 8) {
                        expect(dataFromCartObj[index][13][1]).to.equal('false');
                        expect(dataFromCartObj[index][14][1]).to.equal('');
                        expect(dataFromCartObj[index][15][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include(
                                '$ more Discounts for ordering items over set price to get an additional item',
                            );
                        expect(dataFromCartObj[index][16][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][17][1]).to.equal('Discounts for ordering items over set price');
                        expect(dataFromCartObj[index][18][1]).to.include('"MinTotal":"200"');
                        expect(dataFromCartObj[index][19][1]).to.equal(dataFromCartObj[index][6][1]);
                        expect(dataFromCartObj[index][19][1]).to.not.equal(cartTotalFormatted);
                    } else if (promotionsArr[index] < 10) {
                        expect(dataFromCartObj[index][13][1]).to.equal('MaNa23');
                        expect(dataFromCartObj[index][14][1]).to.equal('Hand Cosmetics');
                        expect(dataFromCartObj[index][15][1]).to.equal('$40.25');
                        expect(dataFromCartObj[index][16][1]).to.equal('100%');
                        expect(dataFromCartObj[index][17][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][18][1]).to.equal('1');
                        expect(dataFromCartObj[index][19][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][20][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][26][1]).to.equal('false');
                        expect(dataFromCartObj[index][27][1]).to.equal('');
                        expect(dataFromCartObj[index][28][1])
                            .to.include('💲💲💲 Buy ')
                            .and.include(
                                '$ more Discounts for ordering items over set price to get additional user selected items',
                            );
                        expect(dataFromCartObj[index][29][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][30][1]).to.equal('Discounts for ordering items over set price');
                        expect(dataFromCartObj[index][31][1]).to.include('"MinTotal":"300"');
                        expect(dataFromCartObj[index][32][1]).to.equal(dataFromCartObj[index][6][1]);
                        expect(dataFromCartObj[index][32][1]).to.equal(cartTotalFormatted);
                    } else {
                        expect(dataFromCartObj[index][13][1]).to.equal('true');
                        expect(dataFromCartObj[index][14][1]).to.include('PPI_OrderPromotion');
                        expect(dataFromCartObj[index][15][1]).to.equal('');
                        expect(dataFromCartObj[index][16][1]).to.have.lengthOf.above(1);
                        expect(dataFromCartObj[index][17][1]).to.equal('Discounts for ordering items over set price');
                        expect(dataFromCartObj[index][18][1]).to.include('"MinTotal":"400"');
                        expect(dataFromCartObj[index][19][1]).to.equal(dataFromCartObj[index][6][1]);
                        expect(dataFromCartObj[index][19][1]).to.equal(cartTotalFormatted);
                    }
                }

                await webAppList.click(webAppTopBar.CartSumbitBtn);
                await webAppHomePage.isDialogOnHomePAge(this);

                const webAppDialog = new WebAppDialog(driver);
                await webAppDialog.selectDialogBox('OK');

                await webAppTransaction.addItemToCart(this, 'Hair002', 1, true);

                console.log('Ordering Items');
                await webAppList.isSpinnerDone();
                const base64ImageSecondTransaction = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart Of Promotion ATD`,
                    value: 'data:image/png;base64,' + base64ImageSecondTransaction,
                });
                await webAppList.click(webAppTopBar.CartDoneBtn);

                await webAppHomePage.isDialogOnHomePAge(this);

                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 20;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                const lastTransactionLines = await objectsService.getTransactionLines({
                    where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                });

                addContext(this, {
                    title: `Last transaction lines total price from API`,
                    value: lastTransaction[0].GrandTotal,
                });
                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                expect(lastTransaction[0].SubTotal).to.equal(488);
                expect(lastTransaction[0].GrandTotal).to.equal(488);
                expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(488);
                expect(lastTransaction[0].ItemsCount).to.equal(3);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(12);
                expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.true;
                expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseItemExternalID).to.include(
                    'PPI_OrderPromotion',
                );
                expect(lastTransaction[0].TSAPPIOrderPromotionPromotionCode).to.have.lengthOf.above(1);
                expect(lastTransaction[0].TSAPPIOrderPromotionReason).to.be.equal(
                    'Discounts for ordering items over set price',
                );
                expect(lastTransaction[0].TSAPPIOrderPromotionReasonReference).to.include('"MinTotal":"400"');
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(442.75);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(442.75);
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.be.null;
                expect(lastTransactionLines[0].TSAPPIItemPromotionReasonReference).to.equal('{"AppliedRules":[]}');
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(40.25);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(40.25);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(11);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.include('MaNa23');
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(0);
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.be.null;
                expect(lastTransactionLines[1].TSAPPIItemPromotionReasonReference).to.be.null;
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[1].UnitPrice).to.equal(0);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(0);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].TSAPPIOrderPromotionPromotionCode).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.include('PPI_OrderPromotion');
                expect(lastTransactionLines[2].TotalUnitsPriceBeforeDiscount).to.equal(45.25);
                expect(lastTransactionLines[2].TotalUnitsPriceAfterDiscount).to.equal(45.25);
                expect(lastTransactionLines[2].TSAPPIItemPromotionReason).to.be.null;
                expect(lastTransactionLines[2].TSAPPIItemPromotionReasonReference).to.be.null;
                expect(lastTransactionLines[2].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[2].UnitPrice).to.equal(45.25);
                expect(lastTransactionLines[2].UnitPriceAfterDiscount).to.equal(45.25);
                expect(lastTransactionLines[2].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[2].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[2].TSAPPIOrderPromotionPromotionCode).to.include('PPI_OrderPromotion');
                expect(lastTransactionLines[2].Item?.Data?.ExternalID).to.equal('Hair002');

                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });

            it('Package - Discounts For Ordering Quantity From Package (Negative)', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                const webAppHomePage = new WebAppHomePage(driver);
                await webAppHomePage.initiateSalesActivity('Promotion Test');

                //Create new transaction from the UI
                const itemsScopeURL = await driver.getCurrentUrl();
                const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                const webAppTransaction = new WebAppTransaction(driver, transactionUUID);

                await webAppTransaction.addItemToCart(this, 'Promotion Package Test', -1, true);

                console.log('Wait for item list to refresh after promotion package selected');
                driver.sleep(1000);

                const webAppList = new WebAppList(driver);
                await webAppList.isSpinnerDone();

                await webAppTransaction.addItemToCart(this, 'Frag011', 1, true);

                const webAppTopBar = new WebAppTopBar(driver);

                await webAppList.click(webAppTopBar.CartDoneBtn);

                const webAppDialog = new WebAppDialog(driver);

                const dialogBoxMessage = await webAppDialog.getDialogBoxText();

                expect(dialogBoxMessage).to.equal('Please select 3 more items');

                await webAppDialog.selectDialogBox('OK');

                console.log('Wait for items to update after dialog box closed');
                await driver.sleep(1000);

                await webAppList.isSpinnerDone();

                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Cart With Promotions`,
                    value: 'data:image/png;base64,' + base64Image,
                });

                //Promo Steps: [3, 4*, 5, 6*, 8, 9, 10*, 11]; //The marked with "*" are the set promotion steps
                const promotionsArr = [3, 5, 8, 9, 11];
                for (let index = 0; index < promotionsArr.length; index++) {
                    await webAppTransaction.addItemToCart(this, 'Frag011', promotionsArr[index], true);
                    await webAppList.click(webAppTopBar.CartDoneBtn);

                    console.log('Wait for item list to update after done was clicked');
                    await driver.sleep(1000);

                    await webAppList.isSpinnerDone();

                    const base64ImageInCart = await driver.saveScreenshots();
                    addContext(this, {
                        title: `Cart With Promotions (Negative: ${promotionsArr[index]})`,
                        value: 'data:image/png;base64,' + base64ImageInCart,
                    });

                    if (promotionsArr[index] == 3) {
                        const dialogBoxMessage = await webAppDialog.getDialogBoxText();
                        expect(dialogBoxMessage).to.equal('Please select an additional item');
                    } else if (promotionsArr[index] == 5) {
                        const dialogBoxMessage = await webAppDialog.getDialogBoxText();
                        expect(dialogBoxMessage).to.equal('Please select an additional item or remove one item');
                    } else if (promotionsArr[index] == 8) {
                        const dialogBoxMessage = await webAppDialog.getDialogBoxText();
                        expect(dialogBoxMessage).to.equal('Please select 2 more items or remove 2 items');
                    } else if (promotionsArr[index] == 9) {
                        const dialogBoxMessage = await webAppDialog.getDialogBoxText();
                        expect(dialogBoxMessage).to.equal('Please select an additional item or remove 3 items');
                    } else if (promotionsArr[index] == 11) {
                        const dialogBoxMessage = await webAppDialog.getDialogBoxText();
                        expect(dialogBoxMessage).to.equal('You have chosen too many items. Please remove one item');
                    }

                    if (promotionsArr[index] != 4 || promotionsArr[index] != 6 || promotionsArr[index] != 10) {
                        await webAppDialog.selectDialogBox('OK');

                        console.log('Wait for items to update after dialog box closed');
                        await driver.sleep(1000);
                        await webAppList.isSpinnerDone();
                        continue;
                    }
                }

                //Validating transaction created via the API
                let lastTransaction;
                let loopCounter = 5;
                do {
                    lastTransaction = await objectsService.getTransaction({
                        order_by: 'ModificationDateTime DESC',
                    });
                    if (lastTransaction[0].Status != 2) {
                        console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                        generalService.sleep(2000);
                    }
                    loopCounter--;
                } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                addContext(this, {
                    title: `Last transaction from API`,
                    value: lastTransaction[0],
                });

                expect(lastTransaction[0].StatusName).to.equal('InCreation');

                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });

            it('Package - Discounts For Ordering Quantity From Package', async function () {
                const webAppLoginPage = new WebAppLoginPage(driver);
                await webAppLoginPage.login(email, password);

                //Promo Steps: [3, 4*, 5, 6*, 8, 9, 10*, 11]; //The marked with "*" are the set promotion steps
                const promotionsArr = [4, 6, 10];
                for (let index = 0; index < promotionsArr.length; index++) {
                    const webAppHomePage = new WebAppHomePage(driver);
                    await webAppHomePage.initiateSalesActivity('Promotion Test');

                    //Create new transaction from the UI
                    const itemsScopeURL = await driver.getCurrentUrl();
                    const transactionUUID = itemsScopeURL.split(/[/'|'?']/)[5];
                    const webAppTransaction = new WebAppTransaction(driver, transactionUUID);

                    await webAppTransaction.addItemToCart(this, 'Promotion Package Test', -1, true);

                    console.log('Wait for item list to refresh after promotion package selected');
                    driver.sleep(1000);

                    const webAppList = new WebAppList(driver);
                    await webAppList.isSpinnerDone();

                    await webAppTransaction.addItemToCart(this, 'Frag011', 1, true);

                    const webAppTopBar = new WebAppTopBar(driver);

                    await webAppList.click(webAppTopBar.CartDoneBtn);

                    const webAppDialog = new WebAppDialog(driver);

                    const dialogBoxMessage = await webAppDialog.getDialogBoxText();

                    expect(dialogBoxMessage).to.equal('Please select 3 more items');

                    await webAppDialog.selectDialogBox('OK');

                    console.log('Wait for items to update after dialog box closed');
                    await driver.sleep(1000);

                    await webAppList.isSpinnerDone();

                    await webAppTransaction.addItemToCart(this, 'Frag011', promotionsArr[index], true);
                    await webAppList.click(webAppTopBar.CartDoneBtn);

                    console.log('Wait for item list to update after done was clicked');
                    await driver.sleep(1000);

                    await webAppList.isSpinnerDone();

                    if (promotionsArr[index] != 10) {
                        await webAppList.click(webAppTopBar.CartViewBtn);

                        await webAppList.isSpinnerDone();

                        const base64ImageInCart = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Cart With Promotions, Package Amount: ${promotionsArr[index]}`,
                            value: 'data:image/png;base64,' + base64ImageInCart,
                        });

                        await webAppList.click(webAppTopBar.CartSumbitBtn);
                    } else if (promotionsArr[index] == 10) {
                        await webAppTransaction.addItemToCart(this, 'Frag011', 1, true);

                        console.log('Ordering Items');
                        await webAppList.isSpinnerDone();
                        const base64ImageSecondTransaction = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Cart Of Promotion ATD`,
                            value: 'data:image/png;base64,' + base64ImageSecondTransaction,
                        });
                        await webAppList.click(webAppTopBar.CartDoneBtn);
                        await webAppList.click(webAppTopBar.CartViewBtn);

                        await webAppList.isSpinnerDone();

                        const base64ImageInCart = await driver.saveScreenshots();
                        addContext(this, {
                            title: `Cart With Promotions, Package Amount: ${promotionsArr[index]}`,
                            value: 'data:image/png;base64,' + base64ImageInCart,
                        });

                        await webAppList.click(webAppTopBar.CartSumbitBtn);
                    }
                    await webAppHomePage.isDialogOnHomePAge(this);
                    await webAppDialog.selectDialogBox('OK');

                    const webAppHeader = new WebAppHeader(driver);
                    await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

                    //Validating transaction created via the API
                    let lastTransaction;
                    let loopCounter = 20;
                    do {
                        lastTransaction = await objectsService.getTransaction({
                            order_by: 'ModificationDateTime DESC',
                        });
                        if (lastTransaction[0].Status != 2) {
                            console.log(`Transaction StatusName Was: ${lastTransaction[0].StatusName}`);
                            generalService.sleep(2000);
                        }
                        loopCounter--;
                    } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                    const lastTransactionLines = await objectsService.getTransactionLines({
                        where: `Transaction.InternalID=${lastTransaction[0].InternalID}`,
                    });

                    addContext(this, {
                        title: `Last transaction lines total price from API - Package Amount: ${promotionsArr[index]}`,
                        value: lastTransaction[0].GrandTotal,
                    });
                    addContext(this, {
                        title: `Last transaction from API - Package Amount: ${promotionsArr[index]}`,
                        value: lastTransaction[0],
                    });
                    addContext(this, {
                        title: `Last transaction lines from API - Package Amount: ${promotionsArr[index]}`,
                        value: lastTransactionLines,
                    });

                    if (promotionsArr[index] == 4) {
                        expect(lastTransaction[0].SubTotal).to.equal(129);
                        expect(lastTransaction[0].GrandTotal).to.equal(123.84);
                        expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(123.84);
                        expect(lastTransaction[0].ItemsCount).to.equal(2);
                        expect(lastTransaction[0].QuantitiesTotal).to.equal(5);
                        expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                        expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionIsPackage).to.be.true;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionShowPackageItem).to.be.true;
                        expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.include('PPI_');
                        expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(0);
                        expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[0].UnitsQuantity).to.equal(1);
                        expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                        expect(lastTransactionLines[0].UnitPrice).to.equal(0);
                        expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.include('Frag011');
                        expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(129);
                        expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(123.84);
                        expect(lastTransactionLines[1].UnitsQuantity).to.equal(4);
                        expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(4);
                        expect(lastTransactionLines[1].UnitPrice).to.equal(32.25);
                        expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(30.96);
                    }
                    if (promotionsArr[index] == 6) {
                        expect(lastTransaction[0].SubTotal).to.equal(193.5);
                        expect(lastTransaction[0].GrandTotal).to.equal(172.5052);
                        expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(172.5052);
                        expect(lastTransaction[0].ItemsCount).to.equal(2);
                        expect(lastTransaction[0].QuantitiesTotal).to.equal(7);
                        expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                        expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionIsPackage).to.be.true;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionShowPackageItem).to.be.true;
                        expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.include('PPI_');
                        expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(0);
                        expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[0].UnitsQuantity).to.equal(1);
                        expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                        expect(lastTransactionLines[0].UnitPrice).to.equal(0);
                        expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.include('Frag011');
                        expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(193.5);
                        expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(172.50525);
                        expect(lastTransactionLines[1].UnitsQuantity).to.equal(6);
                        expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(10.85);
                        expect(lastTransactionLines[1].UnitPrice).to.equal(32.25);
                        expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(28.750875);
                    }
                    if (promotionsArr[index] == 10) {
                        expect(lastTransaction[0].SubTotal).to.equal(354.75);
                        expect(lastTransaction[0].GrandTotal).to.equal(322.5);
                        expect(lastTransaction[0].SubTotalAfterItemsDiscount).to.equal(322.5);
                        expect(lastTransaction[0].ItemsCount).to.equal(3);
                        expect(lastTransaction[0].QuantitiesTotal).to.equal(12);
                        expect(lastTransaction[0].TSAPPIOrderPromotionNextDiscount).to.be.null;
                        expect(lastTransaction[0].TSAPPIOrderPromotionAdditionalPhaseShouldStart).to.be.false;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionIsPackage).to.be.true;
                        expect(lastTransactionLines[0].TSAPPIPackagePromotionShowPackageItem).to.be.true;
                        expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.include('PPI_');
                        expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(0);
                        expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[0].UnitsQuantity).to.equal(1);
                        expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                        expect(lastTransactionLines[0].UnitPrice).to.equal(0);
                        expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.include('Frag011');
                        expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(32.25);
                        expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[1].UnitsQuantity).to.equal(1);
                        expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                        expect(lastTransactionLines[1].UnitPrice).to.equal(32.25);
                        expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                        expect(lastTransactionLines[2].Item?.Data?.ExternalID).to.include('Frag011');
                        expect(lastTransactionLines[2].TotalUnitsPriceBeforeDiscount).to.equal(322.5);
                        expect(lastTransactionLines[2].TotalUnitsPriceAfterDiscount).to.equal(322.5);
                        expect(lastTransactionLines[2].UnitsQuantity).to.equal(10);
                        expect(lastTransactionLines[2].UnitDiscountPercentage).to.equal(0);
                        expect(lastTransactionLines[2].UnitPrice).to.equal(32.25);
                        expect(lastTransactionLines[2].UnitPriceAfterDiscount).to.equal(32.25);
                    }

                    const testDataTransaction = await objectsService.deleteTransaction(
                        Number(lastTransaction[0].InternalID),
                    );
                    expect(testDataTransaction).to.be.true;
                }
            });
        });
    });
}
/**
 * 
 * @param webAPI
 * @param accessToken 
 * @param catalogUUID 
 * @param promotionsArr 
 * @returns Array 0:ItemExternalID, 1:ItemMainCategory, 2:UnitPrice, 3:UnitDiscountPercentage, 4:UnitPriceAfterDiscount,
5:UnitsQuantity, 6:TSATotalPriceBefore, 7:TotalUnitsPriceAfterDiscount, 8:TSAPPIItemPromotionNextDiscount,
9:TSAPPIItemPromotionPromotionCode, 10:TSAPPIItemPromotionReason, 11:TSAPPIItemPromotionReasonReference,
12:TSAPPIItemPromotionAppearsInPromotion, 13:TSAPPIOrderPromotionAdditionalPhaseShouldStart,
14:TSAPPIOrderPromotionAdditionalPhaseItemExternalID, 15:TSAPPIOrderPromotionNextDiscount,
16:TSAPPIOrderPromotionPromotionCode, 17:TSAPPIOrderPromotionReason, 18:TSAPPIOrderPromotionReasonReference,
19:SubTotalAfterItemsDiscount.
 */
async function GetDataFromCartWebAPI(webAPI, accessToken, catalogUUID) {
    const cart = await webAPI.getCart(accessToken, catalogUUID);
    const cartSmartSerch = await webAPI.getCartItemSearch(accessToken, catalogUUID);
    const dataFromCartArr: string[][] = [];
    for (let j = 0; j < cartSmartSerch.Rows.length; j++) {
        for (let i = 0; i < cartSmartSerch.Rows[j].Fields.length; i++) {
            const fieldName = cartSmartSerch.Rows[j].Fields[i].ApiName;
            const fieldContent = cartSmartSerch.Rows[j].Fields[i].FormattedValue;
            if (
                fieldName == 'ItemExternalID' ||
                fieldName == 'ItemMainCategory' ||
                fieldName == 'UnitPrice' ||
                fieldName == 'UnitDiscountPercentage' ||
                fieldName == 'UnitPriceAfterDiscount' ||
                fieldName == 'UnitsQuantity' ||
                fieldName == 'TSATotalPriceBefore' ||
                fieldName == 'TotalUnitsPriceAfterDiscount' ||
                fieldName == 'TSAPPIItemPromotionNextDiscount' ||
                fieldName == 'TSAPPIItemPromotionPromotionCode' ||
                fieldName == 'TSAPPIItemPromotionReason' ||
                fieldName == 'TSAPPIItemPromotionReasonReference' ||
                fieldName == 'TSAPPIItemPromotionAppearsInPromotions'
            ) {
                dataFromCartArr.push([fieldName, fieldContent]);
            }
        }
    }
    for (let i = 0; i < cart.OpenFooter.Data.Fields.length; i++) {
        const fieldName = cart.OpenFooter.Data.Fields[i].ApiName;
        const fieldContent = cart.OpenFooter.Data.Fields[i].FormattedValue;
        if (
            fieldName == 'TSAPPIOrderPromotionAdditionalPhaseShouldStart' ||
            fieldName == 'TSAPPIOrderPromotionAdditionalPhaseItemExternalID' ||
            fieldName == 'TSAPPIOrderPromotionNextDiscount' ||
            fieldName == 'TSAPPIOrderPromotionPromotionCode' ||
            fieldName == 'TSAPPIOrderPromotionReason' ||
            fieldName == 'TSAPPIOrderPromotionReasonReference' ||
            fieldName == 'SubTotalAfterItemsDiscount'
        ) {
            dataFromCartArr.push([fieldName, fieldContent]);
        }
    }
    return dataFromCartArr;
}
