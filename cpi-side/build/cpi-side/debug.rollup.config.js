"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const addon_config_json_1 = __importDefault(require("../addon.config.json"));
const path_1 = __importDefault(require("path"));
exports.default = addon_config_json_1.default.PublishConfig.CPISide.map(endpoint => {
    return {
        input: endpoint,
        output: [
            {
                dir: '../publish',
                format: 'cjs',
                sourcemap: 'inline',
                sourcemapExcludeSources: true,
                sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
                    // will replace relative paths with absolute paths
                    return path_1.default.resolve(path_1.default.dirname(sourcemapPath), relativeSourcePath);
                },
            }
        ],
        external: [],
        plugins: [
            (0, rollup_plugin_typescript2_1.default)({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "es2015",
                        declaration: false,
                    }
                },
                include: ['**/*.ts']
            }),
            (0, plugin_node_resolve_1.default)(),
            (0, plugin_commonjs_1.default)(),
            (0, plugin_json_1.default)()
        ]
    };
});
//# sourceMappingURL=debug.rollup.config.js.map