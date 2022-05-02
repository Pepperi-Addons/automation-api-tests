import { By } from 'selenium-webdriver';
import { AddonPage } from '..';

export class Promotion extends AddonPage {
    //Promotion Locators
    public EditPromotionBtn: By = By.css('a[role="button"]');
    public PromotionDetailsBtn: By = By.css('[title="Promotion details"]');
    public PromotionEditBtn: By = By.css('#screen2_packageDetails_Tiers [title="Edit"]:not(.hide)');
    public PromotionEditDialogClose: By = By.css('.show .modal-dialog .close');
}
