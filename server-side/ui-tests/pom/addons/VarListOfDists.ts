import { By } from "selenium-webdriver";
import { AddonPage } from "./base/AddonPage";

export class VarListOfDists extends AddonPage {

    public IdRowTitle = By.xpath('//*[contains(text(),"DistributorID")]');

}
