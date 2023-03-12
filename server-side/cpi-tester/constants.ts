export type ClientActionType =
    | 'Dialog'
    | 'GeoLocation'
    | 'HUD'
    | 'Modal'
    | 'Navigation'
    | 'Barcode'
    | 'UserEvent'
    | 'Finish';

/**
An interface representing a response from an event.
@property {string} ErrorCode - The error code of the event, if any.
@property {string} ErrorMessage - The error message of the event, if any.
@property {boolean} Success - A flag indicating whether the event was successful or not.
@property {ClientAction} Value - The value of the event, if any.
*/
export interface EventResponse {
    ErrorCode: string;
    ErrorMessage: string;
    Success: boolean;
    Value: ClientAction;
}

export interface EventResponseDialog extends EventResponse {
    Value: DialogClientAction;
}

export interface EventResponseGeoLocation extends EventResponse {
    Value: GeoLocationClientAction;
}
export interface EventResponseHud extends EventResponse {
    Value: HudClientAction;
}
export interface EventResponseModal extends EventResponse {
    Value: ModalClientAction;
}

export interface EventResponseUserEvent extends EventResponse {
    Value: UserActionData;
}

export interface EventResponseNavigation extends EventResponse {
    Value: NavigationClientAction;
}

/**
An interface representing an event callback.
@property {string} Callback - The callback UUID.
@property {string} Type - The type of the client action.
@property {Object} Data - (Optional) Additional data associated with the client action. This is an object where the key is a string and the value can be of any type.
*/
export interface ClientAction {
    Callback: string;
    Type: string;
    Data?: { [key: string]: any };
}

export interface DialogClientAction extends ClientAction {
    Data: {
        Title: string;
        Content: string;
        IsHtml: boolean;
        Actions: {
            Title: string;
            Key?: string;
        }[];
    };
}

export interface GeoLocationClientAction extends ClientAction {
    Data: {
        Accuracy: string;
        MaxWaitTime: number;
    };
}

export interface HudClientAction extends ClientAction {
    Data: {
        HUDKey?: string;
        State: string;
        Message?: string;
        CloseMessage?: string;
        CancelEventKey?: string;
        Interval?: number;
    };
}

export interface ModalClientAction extends ClientAction {
    Data: {
        AddonBlockName: string;
        HostObject: any;
        Title: string;
        AllowCancel: boolean;
    };
}

export interface UserActionData extends ClientAction {
    Data: {
        AddonBlockName: string;
        HostObject: any;
        Title: string;
        AllowCancel: boolean;
    };
}

export interface NavigationClientAction extends ClientAction {
    Data: {
        URL: string;
        History: string;
    };
}

export interface Event {
    EventKey: string;
    EventData: { [key: string]: any };
}

/**
 * Dialog action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/dialog.html
 */
export interface DialogActionExecutionResult extends Event {
    EventData: {
        SelectedAction: string;
        [key: string]: any;
    };
}

/**
 * GeoLocation action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/geo-location.html
 */
export interface GeoLocationActionExecutionResult extends Event {
    EventData: {
        Success: boolean;
        Longitude: number;
        Latitude: number;
        Accuracy: number;
        ErrorMessage?: '' | 'UnknownLocation' | 'AccessDenied' | 'Error';
        [key: string]: any;
    };
}

/**
 * HUD action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/hud.html
 */
export interface HUDActionExecutionResult extends Event {
    EventData: {
        Success: boolean;
        HUDKey?: string;
        [key: string]: any;
    };
}

/**
 * Navigation action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/navigation.html
 */
export interface NavigationActionExecutionResult extends Event {
    EventData: any;
}

/**
 * Scan barcode action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/scan-barcode.html
 */
export interface ScanBarcodeActionExecutionResult extends Event {
    EventData: {
        Success: boolean;
        Barcode: number;
        ErrorMessage: '' | 'UserCanceled' | 'AccessDenied';
        [key: string]: any;
    };
}

/**
 * Modal action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/modal.html
 */
export interface ModalActionExecutionResult extends Event {
    EventData: {
        Result: any;
        Canceled: boolean;
        [key: string]: any;
    };
}

export type UserEventExecutionResult = ModalActionExecutionResult;

/**
 * File Picker action execution result is defined here:
 * https://pepperi-addons.github.io/client-actions-docs/actions/file-picker.html
 */
export interface FilePickerActionExecutionResult extends Event {
    EventData: {
        Success: boolean;
        MimeType: string;
        /**
         * Either data URI or a URL link
         */
        URI: string;
        [key: string]: any;
    };
}
