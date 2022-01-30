import { By, Locator } from 'selenium-webdriver';
import { AddonPage } from '..';

export class Promotion extends AddonPage {
    //Promotion Locators
    public EditPromotionBtn: Locator = By.css('a[role="button"]');
    public PromotionDetailsBtn: Locator = By.css('[title="Promotion details"]');
    public PromotionEditBtn: Locator = By.css('#screen2_packageDetails_Tiers [title="Edit"]:not(.hide)');
    public PromotionEditDialogClose: Locator = By.css('.show .modal-dialog .close');
}
