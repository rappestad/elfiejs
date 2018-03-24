"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = require("dgram");
class Drone {
    constructor() {
        this.message = '';
        this.IP = '172.16.10.1';
        this.PORT = 8895;
        this.client = dgram_1.createSocket('udp4');
        this.idle();
        setInterval(() => {
            this.sendMessage(this.message);
        }, 50);
    }
    idle() {
        this.message = this.getIdleMessage();
    }
    start() {
        this.message = this.generateMessage({ command: 'start' });
    }
    stop() {
        this.message = this.generateMessage({ command: 'stop' });
    }
    setState(throttle, roll, pitch, yaw) {
        this.message = this.generateMessage({ throttle, roll, pitch, yaw });
    }
    generateMessage({ roll: roll = 0, yaw: yaw = 0, pitch: pitch = 0, throttle: throttle = 0, command: command = '', holdAltitude: holdAltitude = true, headless: headless = false } = {}) {
        if (!holdAltitude) {
            if (throttle < 0) {
                throttle = 0;
            }
            throttle = throttle * 2 - 1;
        }
        const flightInput = [roll, pitch, throttle, yaw].map(this.denormalize);
        flightInput.push(this.commandToNumber(command));
        const checksum = flightInput.reduce((a, b) => a ^ b, 0);
        flightInput.push(checksum);
        return ['66', ...flightInput.map(this.decToHex), '99'].join('');
    }
    commandToNumber(command) {
        const commandMap = {
            '': 0,
            'start': 1,
            'stop': 4
        };
        return commandMap[command];
    }
    getIdleMessage() {
        return '6680800180008199';
    }
    denormalize(value) {
        return Math.ceil((value + 1) * 127.5);
    }
    decToHex(val) {
        return (val + 0x100).toString(16).substr(-2);
    }
    sendMessage(message) {
        const messageBuffer = Buffer.from(message, 'hex');
        this.client.send(messageBuffer, this.PORT, this.IP);
    }
}
exports.Drone = Drone;
