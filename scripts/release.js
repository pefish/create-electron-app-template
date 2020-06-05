
process.on('unhandledRejection', err => {
  throw err;
});

const spawn = require('cross-spawn');
const fs = require('fs');
const os = require('os')
const packageData = require('../package.json')
const electronVersion = packageData.devDependencies.electron.substr(1)
// 检查prod.yaml文件
const prodYamlExist = fs.existsSync("./config/prod.yaml")
if (!prodYamlExist) {
  console.error("请先配置 prod.yaml!!!")
  return
}

spawn.sync('yarn', ["build"], {
  stdio: 'inherit',
});

spawn.sync('electron-rebuild', ["-a", "x64"], {
  stdio: 'inherit',
  env: {
    ...process.env,
    DEBUG: "*",
  }
});

// 检查操作系统
const platform = os.platform()

if (platform === "darwin") {
  spawn.sync('yarn', [
    `electron-packager`,
    `./`,
    `--platform=mas`,
    `--arch=x64`,
    `--electron-version=${electronVersion}`,
    `--out=./release`,
    `--overwrite`,
    `--ignore=\"(.git|yarn.lock|tsconfig.json)\"`,
    `--ignore=\"^/src\"`,
    `--ignore=\"^/client\"`,
    `--icon=icon.icns`
  ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_electron_mirror: "https://npm.taobao.org/mirrors/electron/",
        npm_config_electron_custom_dir: electronVersion,
        DEBUG: "*",
      }
    });
} else if (platform === "win32") {
  spawn.sync('yarn', [
    `electron-packager`,
    `./`,
    `--platform=win32`,
    `--arch=x64`,
    `--electron-version=${electronVersion}`,
    `--out=./release`,
    `--version-string.CompanyName=PEFISH`,
    `--overwrite`,
    `--ignore=\"(.git|yarn.lock|tsconfig.json)\"`,
    `--ignore=\"^/src\"`,
    `--ignore=\"^/client\"`,
    `--icon=icon.ico`
  ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        npm_config_electron_mirror: "https://npm.taobao.org/mirrors/electron/",
        npm_config_electron_custom_dir: electronVersion,
        DEBUG: "*",
      }
    });
} else {
  console.error(`不支持的平台: ${platform}`)
  return
}

console.log("done!!!")
