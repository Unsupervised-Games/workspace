#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/pipelines/capacitorPipeline.ts
import { createHash } from "crypto";
import { existsSync } from "fs";
import { dirname, join as join3 } from "path";
import { fileURLToPath } from "url";
import { execa as execa3, ExecaError as ExecaError2 } from "execa";
import fse3 from "fs-extra";

// src/utils/log.ts
import pc from "picocolors";
var PREFIX = pc.cyan("[Packager]");
function info(message) {
  console.log(`${PREFIX} ${message}`);
}
function success(message) {
  console.log(`${PREFIX} ${pc.green(message)}`);
}
function warn(message) {
  console.warn(`${PREFIX} ${pc.yellow(message)}`);
}
function error(message) {
  console.error(`${PREFIX} ${pc.red(message)}`);
}

// src/backends/nextWebBackend.ts
import { join } from "path";
import { execa, ExecaError } from "execa";
import fse from "fs-extra";
var nextWebBackend = {
  id: "next-web",
  async dev(ctx) {
    await runNextDev(ctx.appDir);
  },
  async build(ctx) {
    await cleanCaches(ctx.appDir);
    await runNextBuild(ctx.appDir);
    await verifyAndRouteOutput(ctx.appDir, ctx.target);
  }
};
async function cleanCaches(appDir) {
  info("Cleaning previous build artifacts (.next/, out/)\u2026");
  await Promise.all([
    fse.remove(join(appDir, ".next")),
    fse.remove(join(appDir, "out"))
  ]);
}
async function runNextBuild(appDir) {
  info("Building Next.js static export\u2026");
  try {
    await execa("npx", ["next", "build"], {
      cwd: appDir,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production"
      }
    });
    success("Next.js build complete.");
  } catch {
    error("Next.js build failed.");
    process.exit(1);
  }
}
async function runNextDev(appDir) {
  info("Starting Next.js dev server\u2026");
  try {
    await execa("npx", ["next", "dev"], {
      cwd: appDir,
      stdio: "inherit"
    });
  } catch (cause) {
    if (cause instanceof ExecaError && (cause.isCanceled || cause.signal)) {
      return;
    }
    error("Next dev exited with error.");
    if (cause instanceof Error) error(cause.message);
    process.exit(1);
  }
}
async function verifyAndRouteOutput(appDir, target) {
  const outPath = join(appDir, "out");
  if (!await fse.pathExists(outPath)) {
    error(
      `Expected static export at ${outPath} but none was found. Make sure \`output: 'export'\` is set in next.config.js.`
    );
    process.exit(1);
  }
  switch (target) {
    case "web":
      success("Web build complete. Static assets ready in ./out/");
      return;
    case "tauri":
      success("Web build complete. Tauri bundling will continue from ./out/.");
      return;
    case "ios":
    case "android":
      success(
        `Web build complete. Capacitor (${target}) bundling will continue from ./out/.`
      );
      return;
    default:
      success("Web build complete. Static assets ready in ./out/");
      return;
  }
}

// src/preflight/forge.ts
import { join as join2 } from "path";
import { execa as execa2 } from "execa";
import fse2 from "fs-extra";
function declaresForgeScript(pkg) {
  if (typeof pkg !== "object" || pkg === null) return false;
  const scripts = pkg.scripts;
  if (typeof scripts !== "object" || scripts === null) return false;
  const forge = scripts.forge;
  return typeof forge === "string" && forge.trim().length > 0;
}
function appHasForgeStep(appDir) {
  try {
    const pkg = fse2.readJsonSync(join2(appDir, "package.json"));
    return declaresForgeScript(pkg);
  } catch {
    return true;
  }
}
async function runForge(appDir) {
  if (!appHasForgeStep(appDir)) {
    info("Pre-flight: no `forge` script in package.json \u2014 skipping asset pipeline.");
    return;
  }
  info("Pre-flight: running @unsupervised/forge\u2026");
  try {
    await execa2("npm", ["run", "forge"], {
      cwd: appDir,
      stdio: "inherit"
      // execa handles `.cmd` extension auto-resolution on Windows
      // — no `cross-env` shim required.
    });
    success("Forge complete.");
  } catch {
    error("Pre-flight Forge failed. Aborting build.");
    process.exit(1);
  }
}
function startForgeWatcher(appDir) {
  if (!appHasForgeStep(appDir)) return null;
  info("Starting forge watcher (assets-raw/ \u2192 public/)\u2026");
  return execa2("npm", ["run", "forge", "--", "--watch"], {
    cwd: appDir,
    stdio: "inherit",
    // Don't let a watcher crash crash the dev server. We surface its output
    // via stdio:inherit so the developer sees the failure, but we don't
    // propagate the exit code into the packager — next dev keeps running on
    // the previous valid assets.ts.
    reject: false
  });
}

// src/pipelines/webPipeline.ts
async function runWebPipeline(args) {
  if (args.mode === "dev") {
    await runForge(args.appDir);
    const watcher = startForgeWatcher(args.appDir);
    try {
      await nextWebBackend.dev({ appDir: args.appDir, target: args.target });
    } finally {
      watcher?.kill("SIGTERM");
    }
    return;
  }
  await runForge(args.appDir);
  await nextWebBackend.build({ appDir: args.appDir, target: args.target });
}

// src/pipelines/capacitorPipeline.ts
var DEFAULT_BACKGROUND_HEX = "#0b1020";
async function runCapacitorPipeline(args) {
  const cacheDir = join3(args.appDir, ".capacitor");
  if (args.invocation.mode === "dev") {
    await runCapacitorDev(args.appDir);
    return;
  }
  const platform = args.invocation.platform;
  await assertHostSupports(platform);
  await synthesizeScaffold(args.appDir, cacheDir);
  await installShellDeps(cacheDir);
  await ensureAssets(args.appDir, cacheDir);
  info("Building static frontend before Capacitor packaging\u2026");
  await runWebPipeline({ appDir: args.appDir, mode: "build", target: platform });
  await copyWebOutputToShell(args.appDir, cacheDir);
  await ensurePlatform(cacheDir, platform);
  await runCapSync(cacheDir, platform);
  if (platform === "ios") {
    await runIosBuild(cacheDir);
  } else {
    await runAndroidBuild(cacheDir);
  }
  await reportBundleOutputs(cacheDir, platform);
}
function deriveCapacitorAppConfig(pkg, override = {}) {
  const baseName = pkg.name ?? "game";
  const projectName = sanitizeProjectName(baseName);
  const appName = override.appName ?? humanizeAppName(baseName);
  const defaultAppId = `com.atelier.${sanitizeAppIdSegment(baseName)}`;
  return {
    appId: override.appId ?? defaultAppId,
    appName,
    version: pkg.version ?? "0.0.0",
    projectName,
    backgroundHex: override.backgroundHex ?? DEFAULT_BACKGROUND_HEX
  };
}
function assertValidAppId(appId) {
  if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(appId)) {
    throw new Error(
      `[@unsupervised/packager] Invalid Capacitor appId "${appId}". appId must be reverse-DNS (e.g. "com.studio.my-game"), each segment starting with a letter and containing only letters / digits / underscores. Set 'appId' in <app>/capacitor.config.json to override.`
    );
  }
}
function sanitizeProjectName(name) {
  const lowered = name.replace(/^@[^/]+\//, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const stripped = lowered.replace(/^[^a-z]+/, "");
  const fallback = stripped || "game";
  return fallback.slice(0, 214);
}
function sanitizeAppIdSegment(name) {
  let s = name.replace(/^@[^/]+\//, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  if (s.length === 0 || /^[0-9]/.test(s)) s = `app_${s}`;
  return s;
}
function humanizeAppName(name) {
  return name.replace(/^@[^/]+\//, "").replace(/^_+/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
async function synthesizeScaffold(appDir, cacheDir) {
  info("Synthesizing Capacitor scaffold into .capacitor/\u2026");
  const config = await readAppConfig(appDir);
  assertValidAppId(config.appId);
  const templateDir = locateTemplateDir();
  await fse3.ensureDir(cacheDir);
  await writeTemplated(
    join3(templateDir, "capacitor.config.json.tpl"),
    join3(cacheDir, "capacitor.config.json"),
    config
  );
  await writeTemplated(
    join3(templateDir, "package.json.tpl"),
    join3(cacheDir, "package.json"),
    config
  );
  await fse3.copy(
    join3(templateDir, "gitignore.tpl"),
    join3(cacheDir, ".gitignore")
  );
}
async function readAppConfig(appDir) {
  const pkg = await fse3.readJSON(
    join3(appDir, "package.json")
  );
  const overridePath = join3(appDir, "capacitor.config.json");
  let override = {};
  if (await fse3.pathExists(overridePath)) {
    info("Merging capacitor.config.json overrides.");
    override = await fse3.readJSON(overridePath);
  }
  return deriveCapacitorAppConfig(pkg, override);
}
function locateTemplateDir() {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [
    join3(here, "..", "..", "capacitor-template"),
    join3(here, "..", "capacitor-template")
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `[@unsupervised/packager] Could not locate capacitor-template/ relative to ${here}.`
  );
}
async function writeTemplated(src, dest, config) {
  const tpl = await fse3.readFile(src, "utf8");
  const substituted = tpl.replace(/\{\{APP_ID\}\}/g, escapeForJson(config.appId)).replace(/\{\{APP_NAME\}\}/g, escapeForJson(config.appName)).replace(/\{\{PROJECT_NAME\}\}/g, escapeForJson(config.projectName)).replace(/\{\{VERSION\}\}/g, escapeForJson(config.version)).replace(/\{\{BACKGROUND_HEX\}\}/g, escapeForJson(config.backgroundHex));
  await fse3.writeFile(dest, substituted, "utf8");
}
function escapeForJson(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
var SHELL_INSTALL_MARKER = ".shell-deps-installed";
async function installShellDeps(cacheDir) {
  const marker = join3(cacheDir, "node_modules", SHELL_INSTALL_MARKER);
  const lockfile = join3(cacheDir, "package-lock.json");
  const pkgManifest = join3(cacheDir, "package.json");
  if (await fse3.pathExists(marker)) {
    const [manifestStat, markerStat] = await Promise.all([
      fse3.stat(pkgManifest),
      fse3.stat(marker)
    ]);
    if (manifestStat.mtimeMs <= markerStat.mtimeMs) {
      return;
    }
    info("Capacitor shell manifest changed \u2014 reinstalling deps.");
  } else {
    info("Installing Capacitor shell dependencies (first-build only)\u2026");
  }
  try {
    await execa3("npm", ["install", "--silent", "--no-audit", "--no-fund"], {
      cwd: cacheDir,
      stdio: "inherit"
    });
    await fse3.ensureFile(marker);
    await fse3.writeFile(marker, (/* @__PURE__ */ new Date()).toISOString(), "utf8");
    if (await fse3.pathExists(lockfile)) {
    }
    success("Capacitor shell dependencies installed.");
  } catch {
    error("npm install inside .capacitor/ failed.");
    process.exit(1);
  }
}
async function ensureAssets(appDir, cacheDir) {
  const templateDir = locateTemplateDir();
  const sourceIcon = await pickSourceIcon(appDir, templateDir);
  const assetsDir = join3(cacheDir, "assets");
  const hashFile = join3(assetsDir, ".source-hash");
  await fse3.ensureDir(assetsDir);
  const sourceHash = await hashFileContents(sourceIcon);
  const cachedHash = await fse3.pathExists(hashFile) ? await fse3.readFile(hashFile, "utf8") : "";
  const stagedIcon = join3(assetsDir, "icon-only.png");
  await fse3.copy(sourceIcon, stagedIcon);
  if (cachedHash !== sourceHash) {
    await fse3.writeFile(hashFile, sourceHash, "utf8");
  }
}
async function runCapacitorAssetsGenerate(cacheDir, platform) {
  info(`Generating ${platform} icons via @capacitor/assets\u2026`);
  try {
    await execa3(
      "npx",
      ["capacitor-assets", "generate", platform === "ios" ? "--ios" : "--android"],
      { cwd: cacheDir, stdio: "inherit" }
    );
    success("Asset generation complete.");
  } catch (cause) {
    warn("Asset generation failed; continuing with default icons.");
    if (cause instanceof Error) warn(cause.message);
  }
}
async function pickSourceIcon(appDir, templateDir) {
  const override = join3(appDir, "public", "app-icon.png");
  if (await fse3.pathExists(override)) return override;
  return join3(templateDir, "icons", "icon.png");
}
async function hashFileContents(path) {
  const buf = await fse3.readFile(path);
  return createHash("sha256").update(buf).digest("hex");
}
async function copyWebOutputToShell(appDir, cacheDir) {
  const src = join3(appDir, "out");
  const dest = join3(cacheDir, "www");
  if (!await fse3.pathExists(src)) {
    error(
      `Expected static export at ${src} but none was found. The web pipeline didn't produce an \`out/\` directory.`
    );
    process.exit(1);
  }
  info(`Copying web bundle: ${src} \u2192 ${dest}`);
  await fse3.remove(dest);
  await fse3.copy(src, dest);
}
async function ensurePlatform(cacheDir, platform) {
  const platformDir = join3(cacheDir, platform);
  if (await fse3.pathExists(platformDir)) {
    return;
  }
  info(`Adding Capacitor platform (${platform}) \u2014 first-build only\u2026`);
  try {
    await execa3("npx", ["cap", "add", platform], {
      cwd: cacheDir,
      stdio: "inherit"
    });
    success(`Platform ${platform} added.`);
  } catch {
    error(`\`cap add ${platform}\` failed.`);
    process.exit(1);
  }
}
async function runCapSync(cacheDir, platform) {
  info(`Running cap sync ${platform} (copy web + update native deps)\u2026`);
  try {
    await execa3("npx", ["cap", "sync", platform], {
      cwd: cacheDir,
      stdio: "inherit"
    });
    success(`cap sync ${platform} complete.`);
  } catch {
    error(`\`cap sync ${platform}\` failed.`);
    process.exit(1);
  }
  await runCapacitorAssetsGenerate(cacheDir, platform);
  try {
    await execa3("npx", ["cap", "copy", platform], {
      cwd: cacheDir,
      stdio: "inherit"
    });
  } catch {
  }
}
async function runIosBuild(cacheDir) {
  const iosDir = join3(cacheDir, "ios", "App");
  const workspace = join3(iosDir, "App.xcworkspace");
  if (!await fse3.pathExists(workspace)) {
    error(
      `Expected Xcode workspace at ${workspace}. Was \`cap add ios\` successful?`
    );
    process.exit(1);
  }
  info("Building iOS Simulator binary via xcodebuild\u2026");
  try {
    await execa3(
      "xcodebuild",
      [
        "-workspace",
        "App.xcworkspace",
        "-scheme",
        "App",
        "-configuration",
        "Release",
        "-sdk",
        "iphonesimulator",
        "-derivedDataPath",
        "build",
        "CODE_SIGNING_ALLOWED=NO"
      ],
      { cwd: iosDir, stdio: "inherit" }
    );
    success("iOS Simulator build complete.");
  } catch (cause) {
    error("xcodebuild failed.");
    if (cause instanceof ExecaError2 && cause.code === "ENOENT") {
      error(
        "Xcode Command Line Tools not found. Install with: xcode-select --install"
      );
    }
    process.exit(1);
  }
}
async function runAndroidBuild(cacheDir) {
  const androidDir = join3(cacheDir, "android");
  const gradlew = join3(androidDir, "gradlew");
  if (!await fse3.pathExists(gradlew)) {
    error(
      `Expected Gradle wrapper at ${gradlew}. Was \`cap add android\` successful?`
    );
    process.exit(1);
  }
  info("Building Android debug APK via ./gradlew assembleDebug\u2026");
  try {
    await execa3("./gradlew", ["assembleDebug"], {
      cwd: androidDir,
      stdio: "inherit"
    });
    success("Android debug APK build complete.");
  } catch (cause) {
    error("Gradle build failed.");
    if (cause instanceof ExecaError2 && cause.code === "ENOENT") {
      error(
        "gradlew not executable or missing. Try `chmod +x .capacitor/android/gradlew` if the file exists."
      );
    }
    error(
      "Make sure JDK 17 + Android SDK are installed and ANDROID_HOME is set."
    );
    process.exit(1);
  }
}
async function reportBundleOutputs(cacheDir, platform) {
  if (platform === "ios") {
    const productsDir = join3(
      cacheDir,
      "ios",
      "App",
      "build",
      "Build",
      "Products",
      "Release-iphonesimulator"
    );
    if (await fse3.pathExists(productsDir)) {
      info(`iOS Simulator build artifacts: ${productsDir}`);
      info(
        `  App bundle: ${join3(productsDir, "App.app")}`
      );
      info(
        "Open the Xcode workspace at .capacitor/ios/App/App.xcworkspace to configure signing + archive for App Store submission."
      );
    } else {
      warn(`Expected build output at ${productsDir} but none was found.`);
    }
    return;
  }
  const apkDir = join3(
    cacheDir,
    "android",
    "app",
    "build",
    "outputs",
    "apk",
    "debug"
  );
  if (await fse3.pathExists(apkDir)) {
    info(`Android debug APK: ${apkDir}`);
    info(
      "For Play Store release: configure a release signing config + run `./gradlew bundleRelease` to produce an `.aab`."
    );
  } else {
    warn(`Expected APK output at ${apkDir} but none was found.`);
  }
}
async function runCapacitorDev(appDir) {
  info(
    "Capacitor dev mode runs the web pipeline. Test on mobile via:\n  \u2022 PWA \u2014 open http://<your-local-ip>:3000 in mobile Safari / Chrome (Add to Home Screen).\n  \u2022 Native debug \u2014 in another terminal: `pnpm build:ios` or `pnpm build:android`.\n  \u2022 Live-reload-to-simulator is not wired in v1."
  );
  await runWebPipeline({ appDir, mode: "dev", target: "capacitor" });
}
async function assertHostSupports(platform) {
  if (platform === "ios" && process.platform !== "darwin") {
    error(
      `iOS builds require macOS. Current host: ${process.platform}. Use a Mac or a macOS CI runner. The Android target works on Linux + Windows + macOS.`
    );
    process.exit(1);
  }
  return Promise.resolve();
}

// src/backends/nativeBackend.ts
import { join as join5 } from "path";
import { execa as execa4 } from "execa";
import fse5 from "fs-extra";

// src/target/readTarget.ts
import { join as join4 } from "path";
import fse4 from "fs-extra";
function descriptorPath(appDir) {
  return join4(appDir, ".atelier", "target.json");
}
function readRaw(appDir) {
  const path = descriptorPath(appDir);
  if (!fse4.existsSync(path)) return null;
  return fse4.readJsonSync(path);
}
function resolveBuildBackendId(appDir) {
  const raw = readRaw(appDir);
  const backend = raw?.buildBackend;
  if (backend === void 0 || backend === null) return "next-web";
  if (backend === "next-web" || backend === "native") return backend;
  throw new Error(
    `Invalid buildBackend "${String(backend)}" in ${descriptorPath(appDir)}. Expected 'next-web' or 'native'.`
  );
}
function readTargetDescriptor(appDir) {
  const raw = readRaw(appDir);
  const target = { buildBackend: resolveBuildBackendId(appDir) };
  const build = raw?.build;
  if (build !== void 0 && build !== null) {
    const command = build.command;
    if (typeof command !== "string" || command.length === 0) {
      throw new Error(
        `target.json "build" requires a non-empty "command" (${descriptorPath(appDir)}).`
      );
    }
    const artifact = build.artifact;
    target.build = {
      command,
      ...typeof artifact === "string" ? { artifact } : {}
    };
  }
  const run = raw?.run;
  if (run !== void 0 && run !== null) {
    const command = run.command;
    if (typeof command !== "string" || command.length === 0) {
      throw new Error(
        `target.json "run" requires a non-empty "command" (${descriptorPath(appDir)}).`
      );
    }
    const qa = run.qa;
    target.run = { command, ...typeof qa === "string" ? { qa } : {} };
  }
  return target;
}

// src/backends/nativeBackend.ts
var nativeBackend = {
  id: "native",
  async dev(ctx) {
    await runBuild(ctx.appDir);
    const { run } = readTargetDescriptor(ctx.appDir);
    if (run === void 0) {
      info('No "run" command in target.json \u2014 built only (nothing to launch).');
      return;
    }
    await runCommand(ctx.appDir, run.command, "Launching game");
  },
  async build(ctx) {
    await runBuild(ctx.appDir);
  }
};
async function runBuild(appDir) {
  const { build } = readTargetDescriptor(appDir);
  if (build === void 0) {
    error(
      `The 'native' build backend requires a "build" command in .atelier/target.json (e.g. { "build": { "command": "cargo build --release", "artifact": "target/release/game" } }).`
    );
    process.exit(1);
  }
  await runCommand(appDir, build.command, "Native build");
  if (build.artifact !== void 0) {
    const artifactPath = join5(appDir, build.artifact);
    if (!await fse5.pathExists(artifactPath)) {
      error(
        `Native build finished but the declared artifact was not found at ${artifactPath}. Check the "artifact" path in .atelier/target.json.`
      );
      process.exit(1);
    }
    success(`Native build complete. Artifact at ${build.artifact}.`);
    return;
  }
  success("Native build complete.");
}
async function runCommand(appDir, command, label) {
  info(`${label}: ${command}`);
  try {
    await execa4(command, {
      cwd: appDir,
      stdio: "inherit",
      shell: true
    });
  } catch {
    error(`${label} failed: \`${command}\`. See its output above.`);
    process.exit(1);
  }
}

// src/pipelines/nativePipeline.ts
async function runNativePipeline(args) {
  await runForge(args.appDir);
  const ctx = { appDir: args.appDir, target: "native" };
  if (args.mode === "dev") {
    await nativeBackend.dev(ctx);
  } else {
    await nativeBackend.build(ctx);
  }
}

// src/pipelines/tauriPipeline.ts
import { createHash as createHash2 } from "crypto";
import { createRequire } from "module";
import { dirname as dirname2, join as join6 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { execa as execa5, ExecaError as ExecaError3 } from "execa";
import fse6 from "fs-extra";
var require2 = createRequire(import.meta.url);
var DEFAULT_WINDOW_WIDTH = 1280;
var DEFAULT_WINDOW_HEIGHT = 800;
async function runTauriPipeline(args) {
  const cacheDir = join6(args.appDir, ".tauri");
  const config = await readAppConfig2(args.appDir);
  await synthesizeScaffold2(args.appDir, cacheDir, config);
  await ensureIcons(args.appDir, cacheDir);
  const features = cargoFeaturesForConfig(config);
  if (args.mode === "dev") {
    await runTauriDev(args.appDir, cacheDir, features);
    return;
  }
  await runTauriBuild(args.appDir, cacheDir, features);
}
function cargoFeaturesForConfig(config) {
  const features = [];
  if (config.keychain === true) features.push("keychain");
  return features;
}
async function synthesizeScaffold2(appDir, cacheDir, config) {
  info("Synthesizing Tauri scaffold into .tauri/\u2026");
  const templateDir = locateTemplateDir2();
  await fse6.ensureDir(cacheDir);
  await fse6.ensureDir(join6(cacheDir, "src"));
  await fse6.ensureDir(join6(cacheDir, "capabilities"));
  await fse6.ensureDir(join6(cacheDir, "icons"));
  await writeTemplated2(
    join6(templateDir, "Cargo.toml.tpl"),
    join6(cacheDir, "Cargo.toml"),
    config
  );
  await writeTemplated2(
    join6(templateDir, "tauri.conf.json.tpl"),
    join6(cacheDir, "tauri.conf.json"),
    config
  );
  await fse6.copy(join6(templateDir, "src", "main.rs"), join6(cacheDir, "src", "main.rs"));
  await fse6.copy(
    join6(templateDir, "src", "qa_bridge.rs"),
    join6(cacheDir, "src", "qa_bridge.rs")
  );
  await fse6.copy(
    join6(templateDir, "src", "keychain.rs"),
    join6(cacheDir, "src", "keychain.rs")
  );
  await fse6.copy(join6(templateDir, "build.rs"), join6(cacheDir, "build.rs"));
  await fse6.copy(
    join6(templateDir, "capabilities", "default.json"),
    join6(cacheDir, "capabilities", "default.json")
  );
  await fse6.copy(
    join6(templateDir, "permissions"),
    join6(cacheDir, "permissions")
  );
  await copyAppCapabilityOverrides(appDir, cacheDir);
  await fse6.copy(join6(templateDir, "gitignore.tpl"), join6(cacheDir, ".gitignore"));
}
async function copyAppCapabilityOverrides(appDir, cacheDir) {
  const overrideDir = join6(appDir, "tauri-capabilities");
  if (!await fse6.pathExists(overrideDir)) return;
  const dirents = await fse6.readdir(overrideDir, { withFileTypes: true });
  let copied = 0;
  for (const dirent of dirents) {
    if (!dirent.isFile() || !dirent.name.endsWith(".json")) continue;
    await fse6.copy(
      join6(overrideDir, dirent.name),
      join6(cacheDir, "capabilities", dirent.name)
    );
    copied += 1;
  }
  if (copied > 0) {
    info(
      `Merged ${copied} app capabilit${copied === 1 ? "y" : "ies"} from tauri-capabilities/.`
    );
  }
}
function locateTemplateDir2() {
  const here = dirname2(fileURLToPath2(import.meta.url));
  for (const candidate of [
    join6(here, "..", "..", "tauri-template"),
    join6(here, "..", "tauri-template")
  ]) {
    if (fse6.existsSync(candidate)) return candidate;
  }
  throw new Error(
    `[@unsupervised/packager] Could not locate tauri-template/ relative to ${here}.`
  );
}
async function readAppConfig2(appDir) {
  const pkgJson = await fse6.readJSON(join6(appDir, "package.json"));
  const baseName = pkgJson.name ?? "game";
  const productName = humanize(baseName);
  const crateName = sanitizeCrateName(baseName);
  const version = pkgJson.version ?? "0.0.0";
  const description = pkgJson.description ?? `A game built with the Atelier engine`;
  const defaults = {
    productName,
    identifier: `com.atelier.${crateName.replace(/_/g, "-")}`,
    version,
    crateName,
    title: productName,
    width: DEFAULT_WINDOW_WIDTH,
    height: DEFAULT_WINDOW_HEIGHT,
    shortDescription: description.slice(0, 80),
    longDescription: description,
    deepLinkSchemes: [],
    keychain: false
  };
  const overridePath = join6(appDir, "tauri.config.json");
  if (await fse6.pathExists(overridePath)) {
    info("Merging tauri.config.json overrides.");
    const override = await fse6.readJSON(overridePath);
    return { ...defaults, ...override };
  }
  return defaults;
}
function sanitizeCrateName(name) {
  let sanitized = name.replace(/^@[^/]+\//, "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "");
  if (/^[0-9]/.test(sanitized)) sanitized = `app_${sanitized}`;
  return sanitized || "game";
}
function humanize(name) {
  return name.replace(/^@[^/]+\//, "").replace(/^_+/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function applyTemplateSubstitutions(tpl, config) {
  return tpl.replace(/\{\{CRATE_NAME\}\}/g, config.crateName).replace(/\{\{PRODUCT_NAME\}\}/g, escapeForJson2(config.productName)).replace(/\{\{IDENTIFIER\}\}/g, config.identifier).replace(/\{\{VERSION\}\}/g, config.version).replace(/\{\{TITLE\}\}/g, escapeForJson2(config.title)).replace(/\{\{WIDTH\}\}/g, String(config.width)).replace(/\{\{HEIGHT\}\}/g, String(config.height)).replace(/\{\{SHORT_DESCRIPTION\}\}/g, escapeForJson2(config.shortDescription)).replace(/\{\{LONG_DESCRIPTION\}\}/g, escapeForJson2(config.longDescription)).replace(/\{\{TITLE_BAR_STYLE\}\}/g, config.titleBarStyle ?? "Visible").replace(/\{\{HIDDEN_TITLE\}\}/g, String(config.hiddenTitle ?? false)).replace(/\{\{FULLSCREEN\}\}/g, String(config.fullscreen ?? false)).replace(/\{\{MAXIMIZED\}\}/g, String(config.fullscreen === true ? false : config.maximized ?? false)).replace(/\{\{DEV_PORT\}\}/g, String(config.devPort ?? 3e3)).replace(/\{\{NEXT_DEV_FLAGS\}\}/g, config.noTurbo === true ? " --webpack" : "").replace(/\{\{DEEP_LINK_SCHEMES_JSON\}\}/g, JSON.stringify(config.deepLinkSchemes ?? []));
}
async function writeTemplated2(src, dest, config) {
  const tpl = await fse6.readFile(src, "utf8");
  await fse6.writeFile(dest, applyTemplateSubstitutions(tpl, config), "utf8");
}
function escapeForJson2(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
async function ensureIcons(appDir, cacheDir) {
  const templateDir = locateTemplateDir2();
  const sourceIcon = await pickSourceIcon2(appDir, templateDir);
  const iconsDir = join6(cacheDir, "icons");
  const hashFile = join6(iconsDir, ".source-hash");
  const sourceHash = await hashFileContents2(sourceIcon);
  const cachedHash = await fse6.pathExists(hashFile) ? await fse6.readFile(hashFile, "utf8") : "";
  const platformIcons = [
    join6(iconsDir, "32x32.png"),
    join6(iconsDir, "128x128.png"),
    join6(iconsDir, "128x128@2x.png"),
    join6(iconsDir, "icon.icns"),
    join6(iconsDir, "icon.ico")
  ];
  const allPresent = await Promise.all(platformIcons.map((p) => fse6.pathExists(p)));
  if (cachedHash === sourceHash && allPresent.every(Boolean)) {
    return;
  }
  const stagedSource = join6(iconsDir, "icon.png");
  await fse6.copy(sourceIcon, stagedSource);
  info("Generating platform-specific icons via `tauri icon`\u2026");
  try {
    await execa5(resolveTauriCli(), ["icon", stagedSource, "--output", iconsDir], {
      cwd: cacheDir,
      stdio: "inherit"
    });
    await fse6.writeFile(hashFile, sourceHash, "utf8");
    success("Icons generated.");
  } catch (cause) {
    error("`tauri icon` failed.");
    if (cause instanceof Error) error(cause.message);
    process.exit(1);
  }
}
async function pickSourceIcon2(appDir, templateDir) {
  const appOverride = join6(appDir, "public", "app-icon.png");
  if (await fse6.pathExists(appOverride)) return appOverride;
  return join6(templateDir, "icons", "icon.png");
}
async function hashFileContents2(path) {
  const buf = await fse6.readFile(path);
  return createHash2("sha256").update(buf).digest("hex");
}
async function runTauriDev(appDir, cacheDir, features) {
  await runForge(appDir);
  const watcher = startForgeWatcher(appDir);
  try {
    info("Starting Tauri dev (next dev \u2192 webview)\u2026");
    await execa5(
      resolveTauriCli(),
      ["dev", "--config", join6(cacheDir, "tauri.conf.json"), ...featureArgs(features)],
      {
        cwd: cacheDir,
        stdio: "inherit"
      }
    );
  } catch (cause) {
    if (cause instanceof ExecaError3 && (cause.isCanceled || cause.signal)) {
      return;
    }
    error("Tauri dev exited with error.");
    if (cause instanceof Error) error(cause.message);
    process.exit(1);
  } finally {
    watcher?.kill("SIGTERM");
  }
}
async function runTauriBuild(appDir, cacheDir, features) {
  info("Building static frontend before Tauri bundling\u2026");
  await runWebPipeline({ appDir, mode: "build", target: "web" });
  info("Bundling Tauri desktop binary (cargo + platform toolchain)\u2026");
  try {
    await execa5(
      resolveTauriCli(),
      ["build", "--config", join6(cacheDir, "tauri.conf.json"), ...featureArgs(features)],
      {
        cwd: cacheDir,
        stdio: "inherit"
      }
    );
    success("Tauri build complete.");
  } catch (cause) {
    error("Tauri build failed.");
    if (cause instanceof Error) error(cause.message);
    process.exit(1);
  }
  await reportBundleOutputs2(cacheDir);
}
async function reportBundleOutputs2(cacheDir) {
  const bundleRoot = join6(cacheDir, "target", "release", "bundle");
  if (!await fse6.pathExists(bundleRoot)) {
    warn(
      `Expected bundle output at ${bundleRoot} but none was found. The tauri CLI may have logged the failure above.`
    );
    return;
  }
  const platforms = await fse6.readdir(bundleRoot);
  if (platforms.length === 0) {
    warn("Bundle directory exists but is empty.");
    return;
  }
  info(`Bundle output: ${bundleRoot}`);
  for (const platform of platforms) {
    info(`  ${platform}/`);
  }
}
function featureArgs(features) {
  return features.length > 0 ? ["--features", features.join(",")] : [];
}
function resolveTauriCli() {
  try {
    const cliPkgPath = require2.resolve("@tauri-apps/cli/package.json");
    const cliPkg = require2(cliPkgPath);
    const cliDir = dirname2(cliPkgPath);
    const binRel = typeof cliPkg.bin === "string" ? cliPkg.bin : cliPkg.bin?.tauri;
    if (!binRel) {
      throw new Error("@tauri-apps/cli has no `bin.tauri` entry.");
    }
    return join6(cliDir, binRel);
  } catch (cause) {
    error("Could not resolve @tauri-apps/cli.");
    error("Make sure @unsupervised/packager was installed with its dependencies (re-run `pnpm install`).");
    if (cause instanceof Error) error(cause.message);
    process.exit(1);
  }
}

// src/cli.ts
var DEV_TARGETS = ["web", "tauri", "capacitor"];
var BUILD_TARGETS = ["web", "tauri", "ios", "android"];
var program = new Command();
program.name("packager").description(
  "Universal build orchestrator: runs forge, then Next.js, then routes the static bundle to the requested target shell."
).version("0.0.0");
program.command("dev").description("Run the dev server with the requested target wrapper.").option(
  "--target <target>",
  `dev target (${DEV_TARGETS.join(" | ")})`,
  "web"
).action(async (opts) => {
  if (resolveBuildBackendId(process.cwd()) === "native") {
    await runNativePipeline({ appDir: process.cwd(), mode: "dev" });
    return;
  }
  if (!isOneOf(opts.target, DEV_TARGETS)) {
    error(
      `Invalid --target "${opts.target}". Choose one of: ${DEV_TARGETS.join(", ")}.`
    );
    process.exit(1);
  }
  if (opts.target === "tauri") {
    await runTauriPipeline({ appDir: process.cwd(), mode: "dev" });
    return;
  }
  if (opts.target === "capacitor") {
    await runCapacitorPipeline({
      appDir: process.cwd(),
      invocation: { mode: "dev" }
    });
    return;
  }
  await runWebPipeline({
    appDir: process.cwd(),
    mode: "dev",
    target: opts.target
  });
});
program.command("build").description("Run a production build for the requested target.").option(
  "--target <target>",
  `build target (${BUILD_TARGETS.join(" | ")})`,
  "web"
).action(async (opts) => {
  if (resolveBuildBackendId(process.cwd()) === "native") {
    await runNativePipeline({ appDir: process.cwd(), mode: "build" });
    return;
  }
  if (!isOneOf(opts.target, BUILD_TARGETS)) {
    error(
      `Invalid --target "${opts.target}". Choose one of: ${BUILD_TARGETS.join(", ")}.`
    );
    process.exit(1);
  }
  if (opts.target === "tauri") {
    await runTauriPipeline({ appDir: process.cwd(), mode: "build" });
    return;
  }
  if (opts.target === "ios" || opts.target === "android") {
    await runCapacitorPipeline({
      appDir: process.cwd(),
      invocation: { mode: "build", platform: opts.target }
    });
    return;
  }
  await runWebPipeline({
    appDir: process.cwd(),
    mode: "build",
    target: opts.target
  });
});
program.parseAsync(process.argv).catch((cause) => {
  error(cause instanceof Error ? cause.stack ?? cause.message : String(cause));
  process.exit(1);
});
function isOneOf(value, candidates) {
  return candidates.includes(value);
}
//# sourceMappingURL=cli.js.map