"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const package_json_1 = __importDefault(require("../../package.json"));
const cocos_main_1 = __importDefault(require("../platform/cocos/cocos_main"));
const path_1 = __importDefault(require("path"));
// const build_1 = __importDefault(require("../../core/build"));

/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
exports.methods = {
  open_panel() {
    Editor.Panel.open(package_json_1.default.name);
  },
  open_build() {
    console.log(package_json_1.default);
    Editor.Panel.open("super-html.build_panel");
  },
  build_game() {
    //收到构建当前项目super-html,为了方便在build内资源压缩后 重新构建项目
    var s_input_dir = Editor.Project.path || Editor.projectPath;
    s_input_dir = path_1.default.join(s_input_dir, "build/web-mobile");
    console.log("构建项目目录:[%s]", s_input_dir);
    new cocos_main_1.default(Editor.App.version, s_input_dir);
  },
};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
exports.load = function () {};
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
exports.unload = function () {};
