import util from 'util'

export function withGlobalLoading() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        this.commonStore.globalLoading = true
        return await fun.apply(this, args)
      } catch (err) {
        alert(util.inspect(err, false, 10))
        throw err
      } finally {
        this.commonStore.globalLoading = false
      }
    }

    return descriptor
  }
}
