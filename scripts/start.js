
process.on('unhandledRejection', err => {
    throw err;
});

const fs = require('fs');
const spawn = require('cross-spawn');
const packageData = require('../package.json')

const clientModulesExist = fs.existsSync("./client/node_modules")
if (!clientModulesExist) {
    spawn.sync('yarn', [], { 
        stdio: 'inherit',
        cwd: './client',
        env: {
            ...process.env,
            npm_config_electron_mirror: "https://npm.taobao.org/mirrors/electron/",
            npm_config_electron_custom_dir: packageData.devDependencies.electron.substr(1),
        }
    });
}

const serverModulesExist = fs.existsSync("./node_modules")
if (!serverModulesExist) {
    spawn.sync('yarn', [], { 
        stdio: 'inherit',
        env: {
            ...process.env,
            npm_config_electron_mirror: "https://npm.taobao.org/mirrors/electron/",
            npm_config_electron_custom_dir: packageData.devDependencies.electron.substr(1),
        }
    });
}

spawn.sync('yarn', ['build-server'], { stdio: 'inherit' });

spawn.sync('electron', ['.'], { stdio: 'inherit' });

console.log("done!!!")

