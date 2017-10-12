function onCamera({hardware}, {offset}) {
    hardware.cameraServos[0].to(90 + 90 * offset.x);
    hardware.cameraServos[1].to(90 + 90 * offset.y);
}

module.exports = onCamera;