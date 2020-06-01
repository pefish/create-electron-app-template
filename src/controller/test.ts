
export default class Pkey {

  async test (args) {
    const { test } = args 
    globalThis.logger.info(`这是测试1`)
    return {
      params: args,
    }
  }
}
