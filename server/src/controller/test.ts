
export default class Pkey {

  async test (args) {
    const { test } = args 
    globalThis.logger.info(`这是测试`)
    return {
      params: args,
    }
  }
}
