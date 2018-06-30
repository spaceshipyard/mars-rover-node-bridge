const adb = require('adbkit')
const _ = require('lodash')
const client = adb.createClient()

const handleCmd = ({cmd, params}) => {
  console.log('make a call', cmd, params, params.participants)

  client.listDevices().then(deives => _.first(deives)).then(device => {
    return client.startActivity(device.id, {
      'action': 'android.intent.action.VIEW',
      'data': `skype:${params.participants}?call&video=${params.video}`,
      // FLAG_ACTIVITY_NEW_TASK 268435456
      // FLAG_ACTIVITY_CLEAR_TOP 67108864
      'flags': 268435456 | 67108864
    })
  }).catch(function (err) {
    console.error('Something went wrong:', err.stack)
  })
}

module.exports = handleCmd
