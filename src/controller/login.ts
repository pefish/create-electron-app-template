import TimeUtil from "@pefish/js-util-time";

export default class Config {

  async login (args) {
    if (args.username !== "pefish" || args.password !== "pefish") {
      throw new Error("login failed")
    }
    await TimeUtil.sleep(3000)
    return true
  }
}
