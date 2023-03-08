"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.load = void 0;
require("@pepperi-addons/cpi-node");
async function load(configuration) {
}
exports.load = load;
exports.router = Router();
exports.router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    });
});
//# sourceMappingURL=addon-cpi.js.map