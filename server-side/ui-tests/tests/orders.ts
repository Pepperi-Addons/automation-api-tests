import { Browser } from '../utilities/browser';
import { describe, it, beforeEach, afterEach, before, after } from 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import {
    WebAppLoginPage,
    WebAppHeader,
    WebAppHomePage,
    WebAppList,
    WebAppTopBar,
    WebAppDialog,
    WebAppTransaction,
} from '../pom/index';
import addContext from 'mochawesome/addContext';
import GeneralService from '../../services/general.service';
import { ObjectsService } from './../../services/objects.service';
import { Client } from '@pepperi-addons/debug-server';
import { Account, Catalog, Transaction } from '@pepperi-addons/papi-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Key } from 'selenium-webdriver';

chai.use(promised);

export async function OrdersTest(email: string, password: string, client: Client) {
    const generalService = new GeneralService(client);
    const objectsService = new ObjectsService(generalService);
    let driver: Browser;

    describe('Orders UI Tests Suit (New Browser per test (it) scenarios)', async function () {
        this.retries(1);

        beforeEach(async function () {
            driver = new Browser('chrome');
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                console.log('Test Failed');
                driver.sleep(6006);
                const consoleLogs = await driver.getConsoleLogs();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                addContext(this, {
                    title: 'Console Logs',
                    value: consoleLogs,
                });
            }
            await driver.quit();
        });

        it('Order The Most Expensive Three Items and validate with API', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);

            //StartOrder
            const webAppHomePage = new WebAppHomePage(driver);
            await webAppHomePage.click(webAppHomePage.Main);

            //Get to Items
            const webAppList = new WebAppList(driver);
            await webAppList.clickOnFromListRowWebElement();
            const webAppTopBar = new WebAppTopBar(driver);
            await webAppTopBar.click(webAppTopBar.DoneBtn);

            //wait one sec before cliking on catalog, to prevent click on other screen
            console.log('Change to Catalog Cards List');
            driver.sleep(1000);
            await webAppList.click(webAppList.CardListElements);

            //Validating new order
            const webAppDialog = new WebAppDialog(driver);
            await webAppDialog.selectDialogBoxBeforeNewOrder();

            //Sorting items by price
            await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeViewButton, 'Grid View');
            await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

            //This sleep is mandaroy while the list is re-sorting after the sorting click
            console.log('Sorting List');
            driver.sleep(3000);
            const cartItems = await driver.findElements(webAppList.CartListElements);
            let topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
            let secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());

            //Verify that matrix is sorted as expected
            if (topPrice < secondPrice) {
                await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

                //This sleep is mandaroy while the list is re-sorting after the sorting click
                console.log('Sorting List');
                driver.sleep(3000);
                const cartItems = await driver.findElements(webAppList.CartListElements);
                topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
                secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());
            }

            addContext(this, {
                title: `The two top items after the sort`,
                value: [topPrice, secondPrice],
            });

            expect(topPrice).to.be.above(secondPrice);

            const cartMatrix: string[][] = await webAppList.getCartListGridlineAsMatrix();
            //console.table(cartMatrix);
            const sorteCartMatrixByPrice = cartMatrix.sort(compareArrayByPriceInDollar);
            //console.table(sorteCartMatrixByPrice);
            for (let i = 0; i < cartMatrix.length; i++) {
                expect(cartMatrix[i]).to.equal(sorteCartMatrixByPrice[i]);
                // console.log(cartMatrix[i], sorteCartMatrixByPrice[i]);
            }

            addContext(this, {
                title: `The items from the UI (soreted by price)`,
                value: sorteCartMatrixByPrice,
            });

            const totalPrice =
                webAppList.getPriceFromArray(sorteCartMatrixByPrice[0]) +
                webAppList.getPriceFromArray(sorteCartMatrixByPrice[1]) +
                webAppList.getPriceFromArray(sorteCartMatrixByPrice[2]);

            //Adding most expensive items to cart
            for (let i = 0; i < 3; i++) {
                await webAppList.sendKeys(webAppTopBar.SearchFieldInput, sorteCartMatrixByPrice[i][1] + Key.ENTER);
                //Make sure ATD finish to load after search
                await webAppList.isSpinnerDone();
                await webAppList.sendKysToInputListRowWebElement(0, 1);
                const base64Image = await driver.saveScreenshots();
                addContext(this, {
                    title: `Image of order item number: ${i}`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                console.log('Ordering Items');
                driver.sleep(500);
            }

            await webAppList.click(webAppTopBar.CartViewBtn);
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

            expect(lastTransaction[0].GrandTotal).to.equal(totalPrice);

            //Adding information that is probably important to the test report
            Object.keys(lastTransactionLines[0]).forEach(
                (key) => lastTransactionLines[0][key] == null && delete lastTransactionLines[0][key],
            );
            Object.keys(lastTransactionLines[1]).forEach(
                (key) => lastTransactionLines[1][key] == null && delete lastTransactionLines[1][key],
            );
            Object.keys(lastTransactionLines[2]).forEach(
                (key) => lastTransactionLines[2][key] == null && delete lastTransactionLines[2][key],
            );

            addContext(this, {
                title: `Last transaction lines from API`,
                value: lastTransactionLines,
            });

            //Validating what are the 3 most expensive items via the API are the same as from the UI and ending the tests
            const threeMostExpnsiveItems = await objectsService.getItems({ page_size: 3, order_by: 'Price DESC' });
            const PriceOfMostExpensiveItems = threeMostExpnsiveItems.reduce(
                (total, item) => total + Number(item.Price),
                0,
            );

            expect(PriceOfMostExpensiveItems).to.equal(totalPrice);
            const webAppHeader = new WebAppHeader(driver);
            await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;

            const testDataTransaction = await objectsService.deleteTransaction(Number(lastTransaction[0].InternalID));
            expect(testDataTransaction).to.be.true;
        });
    });

    describe('Orders UI Tests Suit (One browser per suite (describe) scenarios)', async function () {
        let accountId;
        let catalogId;
        let activityTypeId;
        let transactionId;
        let transactionUUID;

        this.retries(1);

        before(async function () {
            driver = new Browser('chrome');
        });

        after(async function () {
            await driver.quit();
        });

        afterEach(async function () {
            if (this.currentTest.state != 'passed') {
                const base64Image = await driver.saveScreenshots();
                const url = await driver.getCurrentUrl();
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                console.log('Test Failed');
                driver.sleep(6006);
                const consoleLogs = await driver.getConsoleLogs();
                addContext(this, {
                    title: 'URL',
                    value: url,
                });
                addContext(this, {
                    title: `Image`,
                    value: 'data:image/png;base64,' + base64Image,
                });
                addContext(this, {
                    title: 'Console Logs',
                    value: consoleLogs,
                });
            }
        });

        it('Create WebApp Seasion', async function () {
            const webAppLoginPage = new WebAppLoginPage(driver);
            await webAppLoginPage.login(email, password);
        });

        it('Create Account And Get Catalog', async function () {
            const newAccount: Account = await objectsService.createAccount({
                ExternalID: 'Account for orders scenarios',
                Discount: 0,
            });
            accountId = newAccount.InternalID;

            const catalogsArr: Catalog[] = await objectsService.getCatalogs({ page_size: 1 });
            catalogId = catalogsArr[0].InternalID;

            const transactionArr: Transaction[] = await objectsService.getTransaction({
                where: `Type LIKE '%Sales Order%'`,
                page_size: 1,
            });
            activityTypeId = transactionArr[0].ActivityTypeID as number;
        });

        const testDataDiscountPercentage = [0, 5, 10, 20, 50, 75, 100, 200];
        for (let index = 0; index < testDataDiscountPercentage.length; index++) {
            const discount = testDataDiscountPercentage[index];
            describe(`${discount}% Discount Suit`, async function () {
                it(`Create Transaction With API With ${discount}% Discount`, async function () {
                    const testDataTransaction: Transaction = await objectsService.createTransaction({
                        ActivityTypeID: activityTypeId,
                        UUID: uuidv4(),
                        Status: 1,
                        DiscountPercentage: discount,
                        Account: {
                            Data: {
                                InternalID: accountId,
                            },
                        },
                        Catalog: {
                            Data: {
                                InternalID: catalogId,
                            },
                        },
                    });
                    transactionId = testDataTransaction.InternalID;
                    transactionUUID = testDataTransaction.UUID;
                });

                it(`Order The Most Expensive Three Items And Validate ${discount}% Discount`, async function () {
                    const webAppLoginPage = new WebAppTransaction(driver, transactionUUID);
                    await webAppLoginPage.navigate();

                    //Sorting items by price
                    const webAppList = new WebAppList(driver);
                    const webAppTopBar = new WebAppTopBar(driver);
                    await webAppTopBar.selectFromMenuByText(webAppTopBar.ChangeViewButton, 'Grid View');
                    await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

                    //This sleep is mandaroy while the list is re-sorting after the sorting click
                    console.log('Sorting List');
                    driver.sleep(3000);
                    const cartItems = await driver.findElements(webAppList.CartListElements);
                    let topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
                    let secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());

                    //Verify that matrix is sorted as expected
                    if (topPrice < secondPrice) {
                        await webAppList.click(webAppList.CartListGridLineHeaderItemPrice);

                        //This sleep is mandaroy while the list is re-sorting after the sorting click
                        console.log('Sorting List');
                        driver.sleep(3000);
                        const cartItems = await driver.findElements(webAppList.CartListElements);
                        topPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[0].getText());
                        secondPrice = webAppList.getPriceFromLineOfMatrix(await cartItems[1].getText());
                    }

                    addContext(this, {
                        title: `The two top items after the sort`,
                        value: [topPrice, secondPrice],
                    });

                    expect(topPrice).to.be.above(secondPrice);

                    const cartMatrix: string[][] = await webAppList.getCartListGridlineAsMatrix();
                    //console.table(cartMatrix);
                    const sorteCartMatrixByPrice = cartMatrix.sort(compareArrayByPriceInDollar);
                    //console.table(sorteCartMatrixByPrice);
                    for (let i = 0; i < cartMatrix.length; i++) {
                        expect(cartMatrix[i]).to.equal(sorteCartMatrixByPrice[i]);
                        // console.log(cartMatrix[i], sorteCartMatrixByPrice[i]);
                    }

                    addContext(this, {
                        title: `The items from the UI (soreted by price)`,
                        value: sorteCartMatrixByPrice,
                    });

                    const totalPrice =
                        webAppList.getPriceFromArray(sorteCartMatrixByPrice[0]) +
                        webAppList.getPriceFromArray(sorteCartMatrixByPrice[1]) +
                        webAppList.getPriceFromArray(sorteCartMatrixByPrice[2]);
                    //Adding most expensive items to cart
                    for (let i = 0; i < 3; i++) {
                        await webAppList.sendKeys(
                            webAppTopBar.SearchFieldInput,
                            sorteCartMatrixByPrice[i][1] + Key.ENTER,
                        );
                        //Make sure ATD finish to load after search
                        await webAppList.isSpinnerDone();
                        await webAppList.sendKysToInputListRowWebElement(0, 1);
                    }

                    await webAppList.click(webAppTopBar.CartViewBtn);
                    await webAppList.click(webAppTopBar.CartSumbitBtn);

                    const webAppHomePage = new WebAppHomePage(driver);
                    await webAppHomePage.isDialogOnHomePAge(this);

                    //Validating transaction created via the API
                    let lastTransaction;
                    let loopCounter = 20;
                    do {
                        lastTransaction = await objectsService.getTransaction({
                            order_by: 'ModificationDateTime DESC',
                        });
                        if (lastTransaction[0].Status != 2) {
                            generalService.sleep(2000);
                        }
                        loopCounter--;
                    } while (lastTransaction[0].Status != 2 && loopCounter > 0);

                    addContext(this, {
                        title: `Last transaction lines total price from API`,
                        value: lastTransaction[0].GrandTotal,
                    });

                    //Validating price after discount
                    expect(Number(lastTransaction[0].GrandTotal).toFixed(4)).to.equal(
                        (totalPrice - (totalPrice / 100) * discount).toFixed(4),
                    );

                    //Validating what are the 3 most expensive items via the API are the same as from the UI and ending the tests
                    const threeMostExpnsiveItems = await objectsService.getItems({
                        page_size: 3,
                        order_by: 'Price DESC',
                    });
                    const PriceOfMostExpensiveItems = threeMostExpnsiveItems.reduce(
                        (total, item) => total + Number(item.Price),
                        0,
                    );

                    //Validate the correct price of the items from the API and end the test
                    expect(PriceOfMostExpensiveItems).to.equal(totalPrice);

                    const webAppHeader = new WebAppHeader(driver);
                    await expect(webAppHeader.untilIsVisible(webAppHeader.CompanyLogo)).eventually.to.be.true;
                });

                it('Delete Transaction', async function () {
                    const testDataTransaction = await objectsService.deleteTransaction(transactionId);
                    expect(testDataTransaction).to.be.true;
                });
            });
        }
    });
}

const compareArrayByPriceInDollar = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (!a[i].includes('$')) {
            continue;
        }
        const priceA = Number(a[i].substring(1));
        const priceB = Number(b[i].substring(1));
        if (priceA > priceB) {
            return -1;
        } else if (priceA < priceB) {
            return 1;
        }
    }
    return 0;
};
