import fs from "fs-extra";
import sharp from "sharp";
import { AndroidConfigOptions, AndroidGenIconArg } from "./type";

import path from "path";
import { log } from "../tools/logger";
import {
  ANDROID_PLAY_STORE_SIZE,
  IC_LAUNCHER,
  resAndroidDir,
} from "./constants";
import { iconSourceSet } from "./template/android/data";

const genMipmapIcon = async ({
  coverSize,
  iconSize,
  borderRadius,
  sourceIcon,
  destIcon,
  padding,
  resDir,
}: AndroidGenIconArg) => {
  const svgImage = `
  <svg>
  <rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${borderRadius}" ry="${borderRadius}"/>
  </svg>
  `;
  const rect = Buffer.from(svgImage);
  const { data: rectImage } = await sharp(rect).toBuffer({
    resolveWithObject: true,
  });
  const { data: iconData } = await sharp(sourceIcon)
    .resize(iconSize, iconSize)
    .composite([{ input: rectImage, blend: "dest-in" }])
    .toBuffer({ resolveWithObject: true });
  const iconPath = path.resolve(resDir, destIcon);
  await sharp({
    create: {
      width: coverSize,
      height: coverSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: iconData,
        top: padding,
        left: padding,
      },
    ])
    .toFile(iconPath)
    .then(() => {
      log("✨ " + iconPath);
    });
};

const run = async (config: AndroidConfigOptions) => {
  const { androidSource, flavor, platform, source } = config;

  const resDir = path.resolve(androidSource, resAndroidDir(flavor));

  for (const [key, icon] of Object.entries(iconSourceSet)) {
    const mipmapPath = path.resolve(resDir, key);
    fs.ensureDirSync(mipmapPath);
    await genMipmapIcon({
      coverSize: icon.coverSize,
      borderRadius: icon.iconCircleRadius,
      iconSize: icon.iconCircleSize,
      padding: icon.paddingCircle,
      sourceIcon: source,
      destIcon: `${IC_LAUNCHER}_round.png`,
      resDir: mipmapPath,
    });
    await genMipmapIcon({
      coverSize: icon.forceGroundCoverSize,
      borderRadius: 0,
      iconSize: icon.forceGroundIconSize,
      padding: icon.paddingForceGround,
      sourceIcon: source,
      destIcon: `${IC_LAUNCHER}_foreground.png`,
      resDir: mipmapPath,
    });
    await genMipmapIcon({
      coverSize: icon.coverSize,
      borderRadius: icon.iconSquareRadius,
      iconSize: icon.iconSquareSize,
      padding: icon.paddingSquare,
      sourceIcon: source,
      destIcon: `${IC_LAUNCHER}.png`,
      resDir: mipmapPath,
    });
  }

  const flavorDir = path.resolve(androidSource, resAndroidDir(flavor), "../");
  await genMipmapIcon({
    coverSize: ANDROID_PLAY_STORE_SIZE,
    borderRadius: 0,
    iconSize: ANDROID_PLAY_STORE_SIZE,
    padding: 0,
    sourceIcon: source,
    destIcon: `${IC_LAUNCHER}-playstore.png`,
    resDir: flavorDir,
  });
};
export { run };
