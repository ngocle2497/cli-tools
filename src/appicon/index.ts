import chalk from "chalk";
import fs from "fs-extra";
import { error, log } from "../tools/logger";
import { run as runAndroid } from "./android";
import { DEFAULT_ANDROID_SOURCE, DEFAULT_IOS_SOURCE } from "./constants";
import { run as runIos } from "./ios";
import { Options } from "./type";
const pkgJson = require("../../package.json");

const run = async (options: Options) => {
  if (!fs.existsSync(options.source)) {
    error("Please input valid image source");
    return;
  }
  // check ios folder if select platform
  if (options.platform.includes("all") || options.platform.includes("ios")) {
    const iosSource = options.iosSource || DEFAULT_IOS_SOURCE;
    if (!fs.existsSync(iosSource)) {
      error("The ios folder not exist");
      return;
    }
    log(chalk.green.bold("IOS \n"));
    await runIos(options);
  }
  if (
    options.platform.includes("all") ||
    options.platform.includes("android")
  ) {
    const androidSource = options.androidSource || DEFAULT_ANDROID_SOURCE;
    if (!fs.existsSync(androidSource)) {
      error("The android folder not exist");
      return;
    }
    log(chalk.green.bold("Android \n"));
    await runAndroid(options);
  }
  log(`\n✅  Done! Thanks for using ${pkgJson.name} appicon.`);
};
export { run };
