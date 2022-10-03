/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { error, log } from "../tools/logger";
import { mergeArray } from "./common";
import { findXcodeProject } from "./constants";
import iosContents from "./template/ios/Contents.json";
import * as dataIOS from "./template/ios/data";
import { IOSConfigOptions } from "./type";

const run = async (config: IOSConfigOptions) => {
  // get list icon size and list icon json
  let iosIconsSize = [];
  let newImagesIos = [];
  if (
    config.platform.includes("all") ||
    (config.platform.includes("ipad") && config.platform.includes("ios"))
  ) {
    iosIconsSize = mergeArray(dataIOS.iPadIconsSize, dataIOS.iphoneIconsSize);
    newImagesIos = [
      ...dataIOS.iphoneIcons,
      ...dataIOS.iPadIcons,
      ...iosContents.images,
    ];
  } else if (config.platform.includes("ios")) {
    iosIconsSize = dataIOS.iphoneIconsSize;
    newImagesIos = [...dataIOS.iphoneIcons, ...iosContents.images];
  } else {
    newImagesIos = [...dataIOS.iPadIcons, ...iosContents.images];
    iosIconsSize = dataIOS.iPadIconsSize;
  }

  // get custom AppIcon Folder Name IOS
  const appIconFileName = `${config.iosIconName}.appiconset`;

  const xcodeproj = findXcodeProject(fs.readdirSync(config.iosSource));
  if (!xcodeproj) {
    error(
      "Xcode project folder not found. Are you sure this is a IOS project?"
    );
    return;
  }
  const iosSource = xcodeproj.name.replace(/\.(xcodeproj|xcworkspace)$/, "");
  const imagesXcAssetsPath = path.join(
    config.iosSource,
    iosSource,
    "Images.xcassets"
  );

  const appIconPath = path.resolve(imagesXcAssetsPath, `${appIconFileName}`);

  // remove prev app icon
  fs.removeSync(appIconPath);
  fs.ensureDirSync(appIconPath);
  for (const size of iosIconsSize) {
    const image = await sharp(config.source);
    const pathImage = path.resolve(appIconPath, `${size}.png`);
    await image
      .resize(size, size)
      .toFile(pathImage)
      .then((_) => {
        log("✨ " + pathImage);
      });
  }

  // overwrite Contents.json
  const contentsJsonPath = path.resolve(
    imagesXcAssetsPath,
    `${appIconFileName}`,
    "Contents.json"
  );
  //   fs.ensureDirSync(contentsJsonPath);
  await fs.writeJSONSync(contentsJsonPath, {
    ...iosContents,
    images: newImagesIos,
  });
};
export { run };
