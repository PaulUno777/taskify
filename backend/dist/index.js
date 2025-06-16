"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const data_source_1 = require("./config/data-source");
async function main() {
    try {
        data_source_1.AppDataSource.initialize()
            .then(() => {
            console.log("= = = Data Source initialized = = =\n");
            app_1.default.listen(config_1.config.port, () => {
                console.log(`Server started on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode.`);
            });
        })
            .catch((err) => console.error(err));
    }
    catch (err) {
        console.error("Startup Error!", err);
        process.exit(1);
    }
}
main();
