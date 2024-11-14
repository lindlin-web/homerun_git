"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
Object.defineProperty(exports, "__esModule", { value: !0 });
const fsUtil = __importDefault(require("../core/platform"));

class LibsUtil {
  constructor() {
    console.log("libs consructor");
  }

  insertlibs() {
    var s_input_dir = Editor.Project.path || Editor.projectPath;
    let temp_path = `${s_input_dir}\\${"extensions\\playable-ext\\temp"}`;
    let libs_tem_path = `${temp_path}\\${"libs"}`;
    let libs_toLibs_path = `${this.editor_path}\\${"libs"}`;
    let libs_to_path = libs_tem_path.replace(libs_tem_path, libs_toLibs_path);

    console.log("--------insertLibs----------");
    console.log(libs_to_path);
    console.log(libs_to_path);
    fsUtil.default.copyDir(libs_tem_path, libs_to_path);
    let libs_adapter_path = `${temp_path}\\${"Adpater"}`;
    let libs_toAdapter_path = `${this.editor_path}\\${"Adpater"}`;
    let adapter_to_path = libs_adapter_path.replace(libs_adapter_path, libs_toAdapter_path);
    console.log("--------insertLibs-1---------");
    console.log(libs_adapter_path);
    console.log(adapter_to_path);
    fsUtil.default.copyDir(libs_adapter_path, adapter_to_path);
    // for (let index = 0; index < files.length; index++) {
    //   const element = files[index];
    //   const stat = fs.statSync(fromFullPath);
    //   console.log(stat);
    //   let fromDir = element;
    //   console.log(element);
    //   let toDir = element.replace(temp_path, this.editor_path);
    //   // fsUtil.default.copyDir(fromDir, toDir);
    // }
  }

  importAdapter() {
    var s_input_dir = Editor.Project.path || Editor.projectPath;
    this.editor_path = `${s_input_dir}/${"assets"}`;
    this.libs_path = `${this.editor_path}/${"libs"}`;
    let isExists = fsUtil.default.isExists(this.libs_path);
    if (isExists) {
      fsUtil.default.showMessage("warn", "当前目录已存在");
      // console.warn("当前目录已存在");
      return;
    }
    this.insertlibs();
  }
}
exports.default = LibsUtil;
