const print = (...args) => {
  console.log(...['status:'].concat(args))
}

module.exports = () => ({
  onArduinoConnection: (connected) => {
    print('arduino connection', connected)
  },
  onDispatcherConnection: (connected) => {
    print('dispatcher connection', connected)
  },
  onDispatcherData: () => {
    print('onDispatcherData')
  },
  onArduinoData: () => {
    print('onArduinoData')
  }
})
