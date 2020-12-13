import { Injectable, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

//@ts-ignore
import { UserService } from 'pepperi-user-service';

import jwt from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddonApiService {
    papiBaseURL = ''
    addonData: any = {}

    constructor(
        private userService: UserService,
        private httpClient: HttpClient
    ) {
        const parsedToken = jwt(this.userService.getUserToken());
        this.papiBaseURL = parsedToken['pepperi.baseurl']
    }

    getAddonApiBaseURL(): string {
        // const dev = (this.userService.getAddonStaticFolder() as string).indexOf('localhost') > -1;
        const dev = false;
        return dev ? "http://localhost:4400" : `${this.papiBaseURL}/addons/api/async/${this.addonData.Addon.UUID}`;//async added
    }

    getAddonStaticFolderURL(): string {
        return this.userService.getAddonStaticFolder();
    }

    getApiEndpoint(url, sync?) {
        const options = {
            'headers': {
                'Authorization': 'Bearer ' + this.userService.getUserToken()
            }
        };
        if (sync) {
            return this.httpClient.get(this.getAddonApiBaseURL().replace("/async/", "/") + url, options);
        } else {
            return this.httpClient.get(this.getAddonApiBaseURL() + url, options);
        }
    }

    get(url) {
        const options = {
            'headers': {
                'Authorization': 'Bearer ' + this.userService.getUserToken()
            }
        };
        return this.httpClient.get(this.papiBaseURL + url, options);
    }

    getTestsList() {
        return "all, sanity, test_data, file_storage, data_views, data_views_positive, data_views_negative, fields, sync, sync_big_data, sync_clean, objects, audit_logs";
    }
}
