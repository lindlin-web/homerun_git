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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
class platform {
  /** 获得目录下多种格式文件 */
  get_dir_all_file_ext(s_dir_path, filter_extname_set, b_filter) {
    let files = [];
    let dir_list = fs.readdirSync(s_dir_path);
    dir_list.forEach((file) => {
      let file_path = path_1.default.join(s_dir_path, file);
      if (fs.statSync(file_path).isDirectory()) {
        files = files.concat(this.get_dir_all_file_ext(file_path, filter_extname_set, b_filter));
      } else {
        let file_ext = path_1.default.extname(file_path);
        if (b_filter == filter_extname_set.has(file_ext)) {
          files.push(file_path);
        }
      }
    });
    return files;
  }
  /** 获得目录下文件的后缀名 */
  get_dir_all_file_ext_name(dir) {
    let files = [];
    let dir_list = fs.readdirSync(dir);
    dir_list.forEach((file) => {
      let file_path = path_1.default.join(dir, file);
      if (fs.statSync(file_path).isDirectory()) {
        files = files.concat(this.get_dir_all_file_ext_name(file_path));
      } else {
        let file_ext = path_1.default.extname(file_path);
        files.push(file_ext);
      }
    });
    return files;
  }

  copyDir(fromDir, toDir) {
    if (!fromDir || !toDir || fromDir == toDir) {
      return Promise.reject(new Error(`参数无效：${fromDir} - ${toDir}`));
    }
    return new Promise((resolve, reject) => {
      !fs.existsSync(toDir) && fs.mkdirSync(toDir, { recursive: true });
      const task = [];
      this.readFileSync(fromDir, toDir, (fromFullPath, toFullPath, stat) => {
        task.push({
          fromFullPath,
          toFullPath,
          stat,
        });
      });
      Promise.all(task.map((k) => this.loopCopyFilePromise(k)))
        .then(() => {
          return resolve();
        })
        .catch((e) => reject(e));
    });
  }

  readFileSync(fromDir, toDir, cb) {
    const fileList = fs.readdirSync(fromDir);
    fileList.forEach((name) => {
      console.log(fromDir, name);
      const fromFullPath = path_1.default.join(fromDir, name);
      const toFullPath = path_1.default.join(toDir, name);
      const stat = fs.statSync(fromFullPath);
      if (stat.isDirectory()) {
        !fs.existsSync(toFullPath) && fs.mkdirSync(toFullPath, { recursive: true });
        this.readFileSync(fromFullPath, toFullPath, cb);
      }
      if (stat.isFile()) {
        cb(fromFullPath, toFullPath, stat);
      }
    });
  }

  loopCopyFilePromise(args) {
    const { fromFullPath, toFullPath, stat } = args;
    if (stat.size > 10000) {
      return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(fromFullPath),
          writeStream = fs.createWriteStream(toFullPath);
        readStream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        fs.copyFile(fromFullPath, toFullPath, (err) => {
          err ? reject() : resolve();
        });
      });
    }
  }

  isExists(s_dir_path) {
    return fs.existsSync(s_dir_path);
  }

  // 安全的创建文件夹
  mkdirSync(s_dir_path) {
    // 判断文件夹是否存在
    if (fs.existsSync(s_dir_path)) {
      return;
    }
    // 递归创建父目录
    const s_parent_dir = path_1.default.dirname(s_dir_path);
    if (!fs.existsSync(s_parent_dir)) {
      this.mkdirSync(s_parent_dir);
    }
    // 创建文件夹
    fs.mkdirSync(s_dir_path);
    // console.log(`mkdirSync ${s_dir_path} created successfully.`);
  }
  //安全的写入文件
  writeFileSync(s_path, content) {
    const s_parent_dir = path_1.default.dirname(s_path);
    this.mkdirSync(s_parent_dir);
    fs.writeFileSync(s_path, content);
  }
  /** 获取目录下所有文件 */
  get_dir_all_file(dir) {
    let files = [];
    let dir_list = fs.readdirSync(dir);
    dir_list.forEach((file) => {
      let file_path = path_1.default.join(dir, file);
      if (fs.statSync(file_path).isDirectory()) {
        files = files.concat(this.get_dir_all_file(file_path));
      } else {
        files.push(file_path);
      }
    });
    return files;
  }
  join(...p) {
    return path_1.default.join(...p);
  }
  extname(p) {
    return path_1.default.extname(p);
  }
  async showMessage(type, title, message) {
    const config = {
      title: type,
      detail: message,
    };
    const code = await Editor.Dialog[type](`${title}`, config);
    console.log(code);
  }
}
exports.default = new platform();
