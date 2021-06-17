module.exports = function override(config, env) {
  // console.log("env", env)
  if (env !== "development") {
    config.target = 'electron-renderer'
  }
  return config;
}