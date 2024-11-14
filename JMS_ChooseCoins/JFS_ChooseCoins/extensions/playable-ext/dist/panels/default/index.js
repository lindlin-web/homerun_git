"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
const libs_util_1 = __importDefault(require("../../logic/LibsUtil"));
const fs_extra_1 = require("fs-extra");
const WxPlayAble_1 = __importDefault(require("../../logic/WxPlayAble"));
const path_1 = require("path");
module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log("show");
    },
    hide() {
      console.log("hide");
    },
  },
  template: (0, fs_extra_1.readFileSync)(
    (0, path_1.join)(__dirname, "../../../static/template/default/index.html"),
    "utf-8"
  ),
  style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, "../../../static/style/default/index.css"), "utf-8"),
  $: { app: "#app", btnLibs: "#btnLibs", btnSuperhtml: "#btnSuperhtml", btnWxPlayAble: "#btnWxPlayAble" },
  methods: {
    importAdapter() {
      new libs_util_1.default().importAdapter();
    },
    btnSuperHtml() {
      Editor.Message.send("super-html", "open-super-html");
    },
    showWeChatObj() {
      Editor.Message.send("playable-ext", "showWxAble");
    },
  },
  ready() {
    this.$.app && (this.$.app.innerHTML = "MiniGameExt");
    this.$.btnLibs.innerHTML = Editor.I18n.t("playable-ext.libs_import");
    this.$.btnSuperhtml.innerHTML = Editor.I18n.t("super-html.super_html");
    this.$.btnWxPlayAble.innerHTML = Editor.I18n.t("playable-ext.wx_playable");
    this.$.btnLibs.addEventListener("click", () => {
      this.importAdapter();
    });
    this.$.btnSuperhtml.addEventListener("click", () => {
      this.btnSuperHtml();
    });
    this.$.btnWxPlayAble.addEventListener("click", () => {
      this.showWeChatObj();
    });
  },
  beforeClose() {},
  close() {},
});
