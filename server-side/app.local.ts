import { DebugServer } from '@pepperi-addons/debug-server';
import config from '../addon.config.json';

//Skip SSL in Debug Mode
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0 as any;

const dir = __dirname;
const server = new DebugServer({
    addonUUID: process.env.AddonUUID,
    apiDirectory: dir,
    port: config.DebugPort,
});

// serve the plugin file locally
server.addStaticFolder(
    `/assets/plugins/${config.AddonUUID}/${config.AddonVersion}`,
    process.cwd() + '/../publish/editors',
);

// serve the plugin assets locally
server.addStaticFolder(
    `/Addon/Public/${config.AddonUUID}/${config.AddonVersion}`,
    process.cwd() + '/../publish/assets',
);
server.addStaticFolder(
    `/assets/plugins/${config.AddonUUID}/${config.AddonVersion}`,
    process.cwd() + '/../publish/assets',
);

server.start();

console.log(
    'Open webapp at: ',
    `${config.WebappBaseUrl}/settings/${config.AddonUUID}/${config.DefaultEditor}?dev=true`,
);
