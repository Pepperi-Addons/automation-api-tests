"use strict";
exports.__esModule = true;
var debug_server_1 = require("@pepperi-addons/debug-server");
var addon_config_json_1 = require("../addon.config.json");
var dir = __dirname;
exports.server = new debug_server_1.DebugServer({
    addonUUID: 'eb26afcd-3cf2-482e-9ab1-b53c41a6adbe',
    apiDirectory: dir,
    port: addon_config_json_1["default"].DebugPort
});
// serve the plugin file locally
exports.server.addStaticFolder("/assets/plugins/" + addon_config_json_1["default"].AddonUUID + "/" + addon_config_json_1["default"].AddonVersion, process.cwd() + '/../publish/editors');
// serve the plugin assets locally
exports.server.addStaticFolder("/Addon/Public/" + addon_config_json_1["default"].AddonUUID + "/" + addon_config_json_1["default"].AddonVersion, process.cwd() + '/../publish/assets');
exports.server.addStaticFolder("/assets/plugins/" + addon_config_json_1["default"].AddonUUID + "/" + addon_config_json_1["default"].AddonVersion, process.cwd() + '/../publish/assets');
exports.server.start();
console.log('Open webapp at: ', addon_config_json_1["default"].WebappBaseUrl + "/settings/" + addon_config_json_1["default"].AddonUUID + "/" + addon_config_json_1["default"].DefaultEditor + "?dev=true");
