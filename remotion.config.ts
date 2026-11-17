import { Config } from "@remotion/cli/config";
import fs from "node:fs";

// Cloud-Umgebung: vorinstallierten Headless-Chromium nutzen, falls vorhanden.
const base = "/opt/pw-browsers";
if (fs.existsSync(base)) {
  const dir = fs.readdirSync(base).find((d) => d.startsWith("chromium_headless_shell-"));
  if (dir) {
    Config.setBrowserExecutable(`${base}/${dir}/chrome-headless-shell-linux64/chrome-headless-shell`);
  }
}
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(240000);
