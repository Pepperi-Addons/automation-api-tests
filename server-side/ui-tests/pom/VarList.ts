import { By } from "selenium-webdriver";
import { WebAppTopBar } from "./Components/WebAppTopBar";
import { AddonPage } from "./addons/base/AddonPage";
import { WebAppList } from "./WebAppList";

export class VarList extends WebAppList {

    public IdRowTitle = By.xpath('//*[contains(text(),"DistributorID")]');//temp


}
