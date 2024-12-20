"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cocos_main_1 = __importDefault(require("../platform/cocos/cocos_main"));
exports.onAfterBuild = async function (options, result) {
    if (options.platform !== "web-mobile" && options.platform !== "web-desktop") {
        return;
    }

    try {
        new cocos_main_1.default(Editor.App.version, result.dest);
    }
    catch (error) {
        console.error(error);
    }
};
