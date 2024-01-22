import { Browser } from '../../utilities/browser';
import { describe, it } from 'mocha';
import addContext from 'mochawesome/addContext';
import { NeltPerformanceService } from './nelt-performance.service';
import { NeltPerformance } from './NeltPerformance';
import { Context } from 'vm';

export async function NavigationTests(
    this: Context,
    driver: Browser,
    neltPerfomanceService: NeltPerformanceService,
    neltPerformanceSelectors: NeltPerformance,
) {
    let base64ImageComponent;
    let timeInterval;

    describe('1. Home Screen --> Finansijski podaci', async () => {
        it('Navigating from Home Screen (through Burger Menu) to "Finansijski podaci"', async function () {
            await driver.click(neltPerformanceSelectors.HamburgerMenuButtonAtHome);
            await driver.untilIsVisible(neltPerformanceSelectors.HomeMenuDropdown);
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `Home Hamburger Menu Opened:`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
            // time measurment
            const Finansijski_podaci_opening = new Date().getTime();
            await driver.click(neltPerformanceSelectors.getSelectorOfHomeHamburgerMenuItemByName('Finansijski podaci'));
            await neltPerformanceSelectors.isSpinnerDone();
            // await driver.untilIsVisible(neltPerformanceSelectors.ListRow); // there is a bug with content loading for now 17/1/24
            const Finansijski_podaci_loaded = new Date().getTime();
            timeInterval = Finansijski_podaci_loaded - Finansijski_podaci_opening;
            console.info(
                'Finansijski_podaci_opening: ',
                Finansijski_podaci_opening,
                'Finansijski_podaci_loaded: ',
                Finansijski_podaci_loaded,
                'Time Interval: ',
                timeInterval,
            );
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `At "Finansijski podaci"`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
        });
        it(`Time Measured`, async function () {
            addContext(this, {
                title: `Time Interval for "Finansijski podaci" to load:`,
                value: `${timeInterval} ms`,
            });
            driver.sleep(0.5 * 1000);
        });
        it('Back to Home Screen', async function () {
            await neltPerfomanceService.goHome();
            await neltPerformanceSelectors.isSpinnerDone();
            driver.sleep(0.5 * 1000);
            base64ImageComponent = await driver.saveScreenshots();
            addContext(this, {
                title: `At Home Page`,
                value: 'data:image/png;base64,' + base64ImageComponent,
            });
        });
    });
}
