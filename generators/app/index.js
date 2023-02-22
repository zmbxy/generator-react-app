"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp"); // 创建目录

module.exports = class extends Generator {
  // 接收用户输入
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the hunky-dory ${chalk.red("generator-wt-cra")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your project name?",
        default: "wt-app"
      },
      {
        type: "input",
        name: "homepage",
        message: "Your project homepage?",
        default: "/"
      },
      {
        type: "input",
        name: "repository",
        message: "Your project git repository?",
        default: ""
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  // 创建项目目录
  default() {
    mkdirp(this.props.name);
    const dstRoot = this.destinationPath(this.props.name);
    this.destinationRoot(dstRoot);
    this.env.options.nodePackageManager = "yarn";
    this.env.cwd = dstRoot;
  }

  // 写文件
  writing() {
    this.fs.copy(this.templatePath("**"), this.destinationRoot());
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      {
        name: this.props.name,
        repository: this.props.repository,
        homepage: this.props.homepage
      }
    );
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { name: this.props.name }
    );
  }

  // 安装依赖
  install() {
    this.yarnInstall();
  }
};
