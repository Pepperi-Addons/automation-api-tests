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
                expect(lastTransaction[0].GrandTotal).to.equal(172.5);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(6);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(172.5);
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(172.5);
                expect(lastTransactionLines[0].TSAPPIItemPromotionPromotionCode).to.equal('5kitPP');
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'When buying 5 kits, get another kit for free',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(34.5);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(34.5);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(5);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('MaFa24');
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(34.5);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal('5kitPP');
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'When buying 5 kits, get another kit for free',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(34.5);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal('MaFa24');
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });
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
                expect(lastTransaction[0].GrandTotal).to.equal(33.75);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(2);
                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].TSAPPIItemPromotionPromotionCode).to.equal('1Plus1PP');
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'Get Eyeliner for free when you buy Skin Perfector',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(33.75);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(33.75);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('MakeUp006');
                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(15.95);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal('1Plus1PP');
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'Get Eyeliner for free when you buy Skin Perfector',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(15.95);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(1);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal('MakeUp019');
                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });
                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });
        });

        describe('Advanced Scenarios', function () {
            //Beauty Make Up
            //MakeUp002 Fruit Lipgloss
            //Discounts for ordering more then prince of items
            //250 6
            //500 2
            //1000 26
            //1300 same X 10

            // Hand Cosmetics
            //Promotion Order Test
            //Discounts for ordering items over set price
            //MaNa22
            //100 - 5%
            //200 - 20
            //300 - MaNa23
            //Free Item
            //Order items in 400 - You get to select one free item //Hair4You
            //Coconut Oil GelHair002

            //Promotion Package Test
            //Frag006 Kiss//Great Perfumes
            //4 - 4%
            //6 + 21
            //10 + 1 New Order - Frag011 Azure
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

                const promotionsArr = [11, 12, 15, 19, 20, 21, 25, 30, 31];
                const dataFromCartObj = {};
                for (let index = 0; index < promotionsArr.length; index++) {
                    await webAppTransaction.changeItemInCart(this, promotionsArr[index], true);
                    const cart = await webAPI.getCartItemSearch(accessToken, catalogUUID);
                    dataFromCartObj[index] = [];
                    for (let j = 0; j < cart.Rows.length; j++) {
                        for (let i = 0; i < cart.Rows[j].Fields.length; i++) {
                            const fieldName = cart.Rows[j].Fields[i].ApiName;
                            const fieldContent = cart.Rows[j].Fields[i].FormattedValue;
                            if (
                                fieldName == 'ItemExternalID' ||
                                fieldName == 'ItemMainCategory' ||
                                fieldName == 'UnitPrice' ||
                                fieldName == 'UnitDiscountPercentage' ||
                                fieldName == 'UnitPriceAfterDiscount' ||
                                fieldName == 'UnitsQuantity' ||
                                fieldName == 'TSATotalPriceBefore' ||
                                fieldName == 'TotalUnitsPriceAfterDiscount' ||
                                fieldName == 'TransactionTSAPPIOrderPromotionNextDiscount' ||
                                fieldName == 'TransactionTSAPPIOrderPromotionPromotionCode' ||
                                fieldName == 'TransactionTSAPPIOrderPromotionReason' ||
                                fieldName == 'TransactionTSAPPIOrderPromotionReasonReference' ||
                                fieldName == 'TransactionTSAPPIOrderPromotionTrigger'
                            ) {
                                dataFromCartObj[index].push([fieldName, fieldContent]);
                            }
                        }
                    }
                    // ItemExternalID
                    expect(dataFromCartObj[index][0][1]).to.equal('Shampoo Three');
                    // ItemMainCategory
                    expect(dataFromCartObj[index][1][1]).to.equal('Paul Pitchell');
                    // TSATotalPriceBefore (UnitPrice * UnitsQuantity)
                    expect(dataFromCartObj[index][6][1]).to.include(
                        (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        ),
                    );
                    // TransactionTSAPPIOrderPromotionNextDiscount
                    expect(dataFromCartObj[index][8][1]).to.equal(
                        '💲💲💲 Buy 100$ Discounts for ordering items over set price to get 5% off',
                    );
                    // TransactionTSAPPIOrderPromotionPromotionCode
                    expect(dataFromCartObj[index][9][1]).to.equal('');
                    // TransactionTSAPPIOrderPromotionReason
                    expect(dataFromCartObj[index][10][1]).to.equal('');
                    // TransactionTSAPPIOrderPromotionReasonReference
                    expect(dataFromCartObj[index][11][1]).to.equal('{"AppliedRules":[]}');
                    //TransactionTSAPPIOrderPromotionTrigger
                    expect(dataFromCartObj[index][12][1]).to.equal('');
                    if (promotionsArr[index] < 12) {
                        // UnitDiscountPercentage
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        // UnitPriceAfterDiscount
                        expect(dataFromCartObj[index][4][1]).to.equal('$36.95');
                        // TotalUnitsPriceAfterDiscount
                        expect(dataFromCartObj[index][7][1]).to.equal('$406.45');
                    } else if (promotionsArr[index] < 20) {
                        // UnitDiscountPercentage
                        expect(dataFromCartObj[index][3][1]).to.equal('3%');
                        // UnitPriceAfterDiscount
                        expect(dataFromCartObj[index][4][1]).to.equal('$35.84');
                        // TotalUnitsPriceAfterDiscount (UnitPriceAfterDiscount * UnitsQuantity)
                        expect(dataFromCartObj[index][7][1]).to.include(
                            (dataFromCartObj[index][4][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
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
                    } else {
                        expect(dataFromCartObj[index][3][1]).to.equal('0%');
                        expect(dataFromCartObj[index][4][1]).to.equal('$36.95');
                        expect(dataFromCartObj[index][6][1]).to.include(
                            (dataFromCartObj[index][2][1].substring(1) * dataFromCartObj[index][5][1]).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            ),
                        );
                        expect(dataFromCartObj[index][6][1]).to.equal(dataFromCartObj[index][7][1]);
                        expect(dataFromCartObj[index][13][1]).to.equal('Spring Loaded Frizz-Fighting Conditioner');
                        expect(dataFromCartObj[index][14][1]).to.equal('Paul Pitchell');
                        expect(dataFromCartObj[index][15][1]).to.equal('$27.00');
                        expect(dataFromCartObj[index][16][1]).to.equal('100%');
                        expect(dataFromCartObj[index][17][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][18][1]).to.equal('8');
                        expect(dataFromCartObj[index][19][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][20][1]).to.equal('$0.00');
                        expect(dataFromCartObj[index][21][1]).to.equal(
                            '💲💲💲 Buy 100$ Discounts for ordering items over set price to get 5% off',
                        );
                        expect(dataFromCartObj[index][22][1]).to.equal('');
                        expect(dataFromCartObj[index][23][1]).to.equal('');
                        expect(dataFromCartObj[index][24][1]).to.equal('{"AppliedRules":[]}');
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

                expect(lastTransaction[0].GrandTotal).to.equal(1145.45);
                expect(lastTransaction[0].QuantitiesTotal).to.equal(39);

                expect(lastTransactionLines[0].TotalUnitsPriceAfterDiscount).to.equal(1145.45);
                expect(lastTransactionLines[0].TotalUnitsPriceBeforeDiscount).to.equal(1145.45);
                expect(lastTransactionLines[0].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering amount of items',
                );
                expect(lastTransactionLines[0].UnitDiscountPercentage).to.equal(0);
                expect(lastTransactionLines[0].UnitPrice).to.equal(36.95);
                expect(lastTransactionLines[0].UnitPriceAfterDiscount).to.equal(36.95);
                expect(lastTransactionLines[0].UnitsQuantity).to.equal(31);
                expect(lastTransactionLines[0].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[0].Item?.Data?.ExternalID).to.equal('Shampoo Three');

                expect(lastTransactionLines[1].TotalUnitsPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].TotalUnitsPriceBeforeDiscount).to.equal(216);
                expect(lastTransactionLines[1].TSAPPIItemPromotionPromotionCode).to.equal(
                    lastTransactionLines[0].TSAPPIItemPromotionPromotionCode,
                );
                expect(lastTransactionLines[1].TSAPPIItemPromotionReason).to.equal(
                    'Discounts for ordering amount of items',
                );
                expect(lastTransactionLines[1].UnitDiscountPercentage).to.equal(100);
                expect(lastTransactionLines[1].UnitPrice).to.equal(27);
                expect(lastTransactionLines[1].UnitPriceAfterDiscount).to.equal(0);
                expect(lastTransactionLines[1].UnitsQuantity).to.equal(8);
                expect(lastTransactionLines[1].TSAPPIItemPromotionNextDiscount).to.be.null;
                expect(lastTransactionLines[1].Item?.Data?.ExternalID).to.equal(
                    'Spring Loaded Frizz-Fighting Conditioner',
                );

                addContext(this, {
                    title: `Last transaction lines from API`,
                    value: lastTransactionLines,
                });

                const webAppHeader = new WebAppHeader(driver);
                await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

                const testDataTransaction = await objectsService.deleteTransaction(
                    Number(lastTransaction[0].InternalID),
                );
                expect(testDataTransaction).to.be.true;
            });
        });
    });
}
