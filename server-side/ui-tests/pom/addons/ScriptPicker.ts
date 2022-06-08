import { expect } from 'chai';
import { By, Key, WebElement } from 'selenium-webdriver';
import { AddonPage } from './base/AddonPage';
import { WebAppDialog, WebAppHeader, WebAppHomePage, WebAppList, WebAppSettingsSidePanel, WebAppTopBar } from '..';
import { OrderPage } from '../Pages/OrderPage';
import { AddonLoadCondition } from './base/AddonPage';
import { ObjectTypeEditor } from './ObjectTypeEditor';

export interface ScriptConfigObj {
    Key: string;
    Hidden: boolean;
    CreationDateTime?: string;
    ModificationDateTime?: string;
    Name: string;
    Description: string;
    Code: string;
    Parameters: any;
}

export interface ScriptParams {
    Name: string;
    Params: ScriptInternalParam;
}

interface ScriptInternalParam {
    Type: 'Integer' | 'Double' | 'String' | 'Boolean' | 'None';
    DefaultValue?: any;
}

export class ScriptPicker extends AddonPage {
    public UomHeader: By = By.xpath("//h1[contains(text(),'UOM')]");

    public async configureUomDataFields(...dataFieldNames: string[]): Promise<void> { }
}
