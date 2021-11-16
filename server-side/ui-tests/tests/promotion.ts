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

            const testDataTransaction = await objectsService.deleteTransaction(Number(lastTransaction[0].InternalID));
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

            const testDataTransaction = await objectsService.deleteTransaction(Number(lastTransaction[0].InternalID));
            expect(testDataTransaction).to.be.true;
        });
    });
}
