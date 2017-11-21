const defaults = {

}

export default class DomainController {
  constructor (options) {
    this.options = { ...defaults, ...options }
  }
}
