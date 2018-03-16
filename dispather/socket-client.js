const { EVENT_DISPATCHER_CMD } = require('../events/event-keys');
const EventBus = require('../events/event-bus');

export function configureSocket() {

    socket.on('message', bluebird.coroutine(function* (msg) {
        console.log('inMsg', msg);
        try {
            EventBus.emit(DISEVENT_DISPATCHER_CMD, { cmdKey: msg.cmd, msg });
            socket.emit('msg:acknowledge', { msg: msg });
        } catch (error) {
            console.error(error);
            socket.emit('msg:rejected', { msg: msg, error: error })
        }

    }));

    socket.on('error', function (data) {
        console.error('error', data);
    });

    socket.on('connect', function () {
        console.log('connect');
    });

    socket.on('event', function (data) {
        console.log('event: ' + data);
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
    });

    socket.on('reconnecting', function () {
        console.log('reconnecting');
    });

    socket.on('reconnect_error', function (error) {
        console.log('reconnect_error ' + JSON.stringify(error));
    });

    socket.on('reconnect_failed', function () {
        console.log('reconnect_failed');
    });

    socket.on('welcome', ({ currRooms }) => {
        console.log("welcome", currRooms);
        socket.emit('join', { roomName: targetRoom });
    });

    socket.on('join', ({ roomName }) => {

        console.log('join', roomName);
    });

    socket.on('memberJoined', ({ clientId }) => {
        console.log('memberJoined', clientId);
    });


}