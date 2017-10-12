function calcLeftSpeedRation(x) {
    return x > 0 ? 1 + x : x + 1;
}

function calcRightSpeedRatio(x) {
    return x < 0 ? 1 + -x : 1 - x;
}

function onDirectionCmd({hardware}, { offset, magnitude }) {
    console.log('offset', offset);
    
    const {leftMotor, rightMotor} = hardware;

    const leftSpeedRatio = calcLeftSpeedRation(offset.x);
    const rightSpeedRatio = calcRightSpeedRatio(offset.x);
    const leftSpeed = Math.floor(255 * magnitude * leftSpeedRatio);
    const rightSpeed = Math.floor(255 * magnitude * rightSpeedRatio);

    console.log(leftSpeed, rightSpeed);

    if (offset.y > 0) {
        leftMotor.forward(leftSpeed);
        rightMotor.forward(rightSpeed);
    } else {

        leftMotor.reverse(leftSpeed);
        rightMotor.reverse(rightSpeed);
    }
}

module.exports = { onDirectionCmd, calcRightSpeedRatio, calcLeftSpeedRation };