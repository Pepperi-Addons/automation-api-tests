import { By } from 'selenium-webdriver';
import { WebAppPage } from './Pages/base/WebAppPage';

export class ResourceListBlock extends WebAppPage {
    /* selectors for Resource Views Blocks */
    public pepRemoteLoaderElement: By = By.xpath('//pep-remote-loader-element');
    public PagesElementContainerByUUID: By = By.xpath('//pages-element-50062e0c-9967-4ed4-9102-f2bc50602d41');
    public dataViewerBlockTableHeader: By = By.xpath(
        '//fieldset[contains(@class, "table-header-fieldset")] //fieldset',
    );
    public dataViewerBlockTableColumnTitle: By = By.xpath(`${this.dataViewerBlockTableHeader.value}/div`);
}
