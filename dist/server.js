#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const drone_1 = require("./drone");
const drone = new drone_1.Drone();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(path_1.join(__dirname, '../public')));
app.get('/', function (req, res) {
    res.sendFile(path_1.join(__dirname, '../public/index.html'));
});
io.on('connection', function (socket) {
    drone.idle();
    socket.on('keys', (keys) => {
        if (keys.includes('p'))
            return drone.start();
        if (keys.includes('o'))
            return drone.stop();
        const force = 0.5;
        let throttle = 0;
        let roll = 0;
        let pitch = 0;
        let yaw = 0;
        if (keys.includes('w'))
            throttle += 1;
        if (keys.includes('s'))
            throttle -= 1;
        if (keys.includes('d'))
            roll += force;
        if (keys.includes('a'))
            roll -= force;
        if (keys.includes('ArrowUp'))
            pitch += force;
        if (keys.includes('ArrowDown'))
            pitch -= force;
        if (keys.includes('ArrowRight'))
            yaw += 1;
        if (keys.includes('ArrowLeft'))
            yaw -= 1;
        drone.setState(throttle, roll, pitch, yaw);
        io.emit('drone-state', { throttle, roll, pitch, yaw });
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
