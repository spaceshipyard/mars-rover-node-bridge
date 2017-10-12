function onCamera({hardware}, {offset}) {
    console.log('camera', offset, hardware.cameraServos);
}

module.exports = onCamera;