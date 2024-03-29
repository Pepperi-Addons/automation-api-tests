import { DebugServer } from '@pepperi-addons/debug-server';
import config from '../addon.config.json';

const dir = __dirname;
export const server = new DebugServer({
    addonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
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
