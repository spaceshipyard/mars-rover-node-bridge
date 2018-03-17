const assert = require('assert');
const sinon = require('sinon');
const five = require('johnny-five');
const bluebird = require('bluebird');
const { configureArduinoChannel } = require('../arduino/arduino-bridge');
const EventEmitter = require('events');

describe('arduino-bridge', () => {
    const sandbox = sinon.createSandbox();
    let mockBoard;
    let boardEventEmmiter = new EventEmitter();
    const swithBoardToReadyState = () => {
        boardEventEmmiter.emit('ready');
    };
    const anyCmdHandler = sinon.spy();
    const anyCmdKey = 'anyKey';
    const anyControlModules = [{ setup: (_, registerCmd) => registerCmd(anyCmdKey, anyCmdHandler) }];

    before(() => {
        mockBoard = {
            on: (key, listener) => boardEventEmmiter.on(key, listener)
        };
        sandbox.stub(five, 'Board').value(function () { return mockBoard; });
    });

    after(() => {
        sandbox.restore();
    });

    it('should provide sendcmd handler throught configure function', () => {
        //when
        const sendCmd = configureArduinoChannel(anyControlModules)

        //then
        assert.ok(sendCmd);
    });

    it('should sendcmd if board is on', bluebird.coroutine(function *() {
        //given
        const cmdHandler = sinon.spy();
        const cmdParams = 'expected params'
        const cmdKey = 'fakeCmdKey';
        const cmdSetup = (_, registerCmd) => registerCmd(cmdKey, cmdHandler);
        const sendCmd = configureArduinoChannel([{ setup:cmdSetup }]);
        swithBoardToReadyState();

        //when
        sendCmd({cmd:cmdKey, params:cmdParams});

        //then
        assert(cmdHandler.calledOnce);
        assert(cmdHandler.withArgs(cmdParams).calledOnce);
    }));
})