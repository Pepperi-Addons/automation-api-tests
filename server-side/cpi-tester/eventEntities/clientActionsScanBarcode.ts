import { ScanBarcodeActionExecutionResult } from "../constants";
import {EventResult}  from "./index";


export class ClientActionBarcodeScan extends EventResult 
{
	async setBarcode(barcode: number, success = true, errorMessage: "" | "UserCanceled" | "AccessDenied" = ""): Promise<EventResult>
	{
		const result: ScanBarcodeActionExecutionResult = {
			EventKey: this.data.Value.Callback,
			EventData: {
				Success: success,
				Barcode: barcode,
				ErrorMessage: errorMessage
			}
		};

		return await this.setResult(result);
	}

	public async setResult(resultToSet: ScanBarcodeActionExecutionResult): Promise<EventResult>;
	public async setResult(resultToSet: any): Promise<EventResult>;

	public async setResult(resultToSet: any): Promise<EventResult> 
	{
		return await super.setResult(resultToSet);
	}
}
