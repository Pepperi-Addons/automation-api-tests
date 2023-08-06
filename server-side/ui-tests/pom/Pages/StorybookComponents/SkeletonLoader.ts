import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class SkeletonLoader extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesSkeletonLoaderComponentFound(): Promise<void> {
        await this.doesComponentFound('skeleton-loader', 'Skeleton loader');
    }
}
