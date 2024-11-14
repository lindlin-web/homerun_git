"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(exports, "__esModule", { value: !0 });
const package_json_1 = __importDefault(require("../package.json"));
const libs_util_1 = __importDefault(require("./logic/LibsUtil.js"));
function load() {}
function unload() {}
exports.methods = {
  openPanel() {
    Editor.Panel.open(package_json_1.default.name);
  },
  showWxAblePanel() {
    Editor.Panel.open("playable-ext.WxPlayAble");
  },
  insertLibs() {},
};
