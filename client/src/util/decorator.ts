import util from 'util'

export function withGlobalLoading() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        this.commonStore.globalLoading = true
        const result = await fun.apply(this, args)
        return result
      } catch (err) {
        alert(util.inspect(err, false, 10))
      } finally {
        this.commonStore.globalLoading = false
      }
    }

    return descriptor
  }
}
