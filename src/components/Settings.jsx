import React, { PureComponent } from 'react'

export default class Settings extends PureComponent {
  render () {
    return [
      <h1>General</h1>,
      <form>
        <div>
          <label>
            <div>Default Project</div>
            <select disabled>
              <option value='none'>No default</option>
              <option value='default'>Global default</option>
              <option value='service'>Last Used by service</option>
              <option value='url'>Last used by URL</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <div>Set default</div>
            <input type='text' />
          </label>
        </div>
      </form>
    ]
  }
}
