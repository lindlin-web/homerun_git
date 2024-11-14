"use strict";
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fsUtil = __importDefault(require("../core/platform"));
const const_1 = require("../core/const");
/**
 * 微信试玩小游戏
 */
class WxPlayAble {
  hasWeChatObj() {
    var s_input_dir = Editor.Project.path || Editor.projectPath;
    let buildProjUrl = path_1.default.join(s_input_dir, "build");
    let isExists = fsUtil.default.isExists(buildProjUrl);
    if (!isExists) {
      fsUtil.default.showMessage("warn", "未找到微信工程，请先构建微信项目");
    }
    let files = fsUtil.default.get_dir_all_file(buildProjUrl);
    let hasWechatObj = false;
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      if (element.indexOf("wechatgame") >= 0) {
        hasWechatObj = true;
        break;
      }
    }
    if (!hasWechatObj) {
      fsUtil.default.showMessage("warn", "未找到微信工程，请先构建微信项目");
      Editor.Message.request("builder", "open");
    }
  }
}
exports.default = new WxPlayAble();
