import { AddonPage, WebAppSettingsSidePanel } from "..";
import { AddonLoadCondition } from "./base/AddonPage";

export class NgxLibComponents extends AddonPage {

    /**
     *
     * 
     */
    public async gotoNgxAddon(): Promise<void> {
        const webAppSettingsSidePanel = new WebAppSettingsSidePanel(this.browser);
        await webAppSettingsSidePanel.selectSettingsByID('NGX-Lib-Automation');
        await this.browser.click(webAppSettingsSidePanel.ObjectEditorNGX);
        this.browser.sleep(2000);
        await this.isSpinnerDone();
        return;
    }
}