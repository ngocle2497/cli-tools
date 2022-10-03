import path from "path";

export const DEFAULT_ANDROID_FLAVOR = "main";
export const DEFAULT_ICON_IOS = "AppIcon";
export const DEFAULT_IOS_SOURCE = "./ios";
export const DEFAULT_ANDROID_SOURCE = "./android";
export const DEFAULT_PLATFORM = ["android", "ios"];
export const LIST_PLATFORM = ["android", "ios", "ipad", "all"];

export const ANDROID_PLAY_STORE_SIZE = 512;

export const resAndroidDir = (flavor: string = "main") =>
  `app/src/${flavor}/res`;
export const IC_LAUNCHER = "ic_launcher";

export function findXcodeProject(
  files: Array<string>
): { name: string; isWorkspace: boolean } | null {
  const sortedFiles = files.sort();
  for (let i = sortedFiles.length - 1; i >= 0; i--) {
    const fileName = files[i];
    const ext = path.extname(fileName);

    if (ext === ".xcworkspace") {
      return {
        name: fileName,
        isWorkspace: true,
      };
    }
    if (ext === ".xcodeproj") {
      return {
        name: fileName,
        isWorkspace: false,
      };
    }
  }

  return null;
}
