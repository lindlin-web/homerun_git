"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
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
    (0, path_1.join)(__dirname, "../../../static/template/default/WxAblePanel.html"),
    "utf-8"
  ),
  style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, "../../../static/style/default/index.css"), "utf-8"),
  $: { app: "#app", divName: "#divName" },
  methods: {},
  ready() {
    console.log(this.$.divName);
  },
  beforeClose() {},
  close() {},
});
