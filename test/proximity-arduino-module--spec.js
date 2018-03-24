const assert = require('assert')
const {setup} = require('../arduino/control-modules/proximity')

/* global describe it before after */

describe('proximity', function () {
  let dispose

  before(() => {
    dispose = setup({
      five: {
        Proximity: function () {
          return {
            on: () => {
            }
          }
        }
      }
    })
  })

  after(() => {
    dispose && dispose()
  })

  it('should return dispose method', function () {
    assert.ok(dispose)
  })
})
