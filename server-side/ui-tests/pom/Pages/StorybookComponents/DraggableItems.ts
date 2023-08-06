import { By } from 'selenium-webdriver';
import { StorybookComponent } from './Base/StorybookComponent';

export class DraggableItems extends StorybookComponent {
    public ModalOKBtn: By = By.xpath(`//span[contains(text(),'Ok')]`);

    public async doesDraggableItemsComponentFound(): Promise<void> {
        await this.doesComponentFound('draggable-items', 'Draggable items');
    }
}
