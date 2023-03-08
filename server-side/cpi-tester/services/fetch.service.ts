import fetch from "node-fetch";
import { LOGGING_PREFIX } from "shared-cpi-automation";

export default class FetchService
{
	/**
    Makes a POST request to the specified URL with the given body and headers.
    @param {string} url - The URL to send the POST request to.
    @param {any} [body] - The request body, in JSON format.
    @param {{[key: string]: string}} [headers={}] - Additional headers to include in the request.
    @returns {Promise<any>} A Promise that resolves to the JSON response from the server.
    @throws {Error} When the response cannot be parsed as JSON or an error occurs while making the request.
    */
	async post(url: string, body?: any, headers?:{[key: string]: string}): Promise<any>
	{
		const bodyStr = JSON.stringify(body);
		const mergedHeaders = {
			...headers,
			"Content-Type": "application/json",
		};
		const fetchResult = await fetch(url, {
			method: "POST",
			body: bodyStr,
			headers: mergedHeaders,
		});

		const buff = await fetchResult.arrayBuffer().then(Buffer.from);

		try
		{
			return JSON.parse(buff.toString());
		}
		catch (err) 
		{
			throw new Error(`${LOGGING_PREFIX} Failed to POST: ${err instanceof Error ? err.message : "Unknown error occurred."}`);
		}
	}
}
