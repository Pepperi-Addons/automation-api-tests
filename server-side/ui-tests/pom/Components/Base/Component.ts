import { Browser } from '../../../utilities/browser';
import addContext from 'mochawesome/addContext';
import fs from 'fs';
import path from 'path';
import { ConsoleColors } from '../../../../services/general.service';

export abstract class Component {
    public constructor(protected browser: Browser) {}

    /**
     *
     * @param that Should be the "this" of the mocha test, this will help connect data from this function to test reports
     */
    public async collectEndTestData(that): Promise<void> {
        if (that.currentTest.state != 'passed') {
            console.log('%cTest Failed', ConsoleColors.Error);
            const imagePath = `${__dirname.split('server-side')[0]}server-side\\api-tests\\test-data\\Error_Image.jpg`;
            const file = fs.readFileSync(path.resolve(imagePath));
            let base64Image = file.toString('base64');
            let url = 'Error In Getting URL';
            let consoleLogs = ['Error In Console Logs'];
            try {
                base64Image = await this.browser.saveScreenshots();
            } catch (error) {
                console.log(`%cError in collectEndTestData saveScreenshots: ${error}`, ConsoleColors.Error);
            }
            try {
                url = await this.browser.getCurrentUrl();
            } catch (error) {
                console.log(`%cError in collectEndTestData getCurrentUrl: ${error}`, ConsoleColors.Error);
            }
            try {
                //Wait for all the logs to be printed (this usually take more then 3 seconds)
                this.browser.sleep(6006);
                consoleLogs = await this.browser.getConsoleLogs();
            } catch (error) {
                console.log(`%cError in collectEndTestData getConsoleLogs: ${error}`, ConsoleColors.Error);
            }
            addContext(that, {
                title: 'URL',
                value: url,
            });
            addContext(that, {
                title: `Image`,
                value: 'data:image/png;base64,' + base64Image,
            });
            addContext(that, {
                title: 'Console Logs',
                value: consoleLogs,
            });
        } else if (that.currentTest.state == 'passed') {
            console.log('%cTest Passed', ConsoleColors.Success);
        } else {
            console.log(`%cTest Ended With State: ${that.currentTest.state}`, ConsoleColors.Information);
        }
        return;
    }
}
