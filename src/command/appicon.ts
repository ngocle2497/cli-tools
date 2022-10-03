import { Command, Option } from "commander";
import { run } from "../appicon";
import {
  DEFAULT_ANDROID_FLAVOR,
  DEFAULT_ANDROID_SOURCE,
  DEFAULT_ICON_IOS,
  DEFAULT_IOS_SOURCE,
  DEFAULT_PLATFORM,
  LIST_PLATFORM,
} from "../appicon/constants";

const appIconSetup = (program: Command) => {
  program
    .command("appicon")
    .description("Gen app icon for android/ios")
    .addOption(
      new Option("-p, --platform [platform...]", "Default: all.")
        .choices(LIST_PLATFORM)
        .default(DEFAULT_PLATFORM)
    )
    .addOption(
      new Option("-s, --source <string>", "Source image for icon (1024x1024)")
    )
    .addOption(
      new Option(
        "-f, --flavor <string>",
        "[Android only] Select flavor android"
      ).default(DEFAULT_ANDROID_FLAVOR)
    )
    .addOption(
      new Option(
        "-icn, --ios-icon-name <string>",
        "[IOS only] Custom AppIcon Image name"
      ).default(DEFAULT_ICON_IOS)
    )
    .addOption(
      new Option(
        "-ar, --android-source <string>",
        "Path to android source"
      ).default(DEFAULT_ANDROID_SOURCE)
    )
    .addOption(
      new Option("-is, --ios-source <string>", "Path to ios source").default(
        DEFAULT_IOS_SOURCE
      )
    )
    .action(run);
};
export { appIconSetup };
