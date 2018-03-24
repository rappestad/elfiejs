# elfiejs
Control your ELFIE drone using NodeJS

## Prerequisites
- An [ELFIE](https://www.firstquadcopter.com/reviews/jjrc-h37-elfie-quadcopter-review/) drone (or similar)
- Ability to connect to the drone's wireless network
- [NodeJS](https://nodejs.org/en/) version 8 or later

## Getting started
1. Install the program and print the help
```sh
npm install -g elfiejs
elfiejs -h
```

2. Connect your computer to your drone's wireless network.

3. Run elfiejs and follow the instructions printed to the console
```sh
elfiejs
```

## How does it work?
Running elfiejs will launch a local web server which hosts a browser
application. The app will capture your keyboard and send the keystrokes
to the server part, which in turn will control the ELFIE drone. Make
sure that your computer is connected to your drone's wireless network
before running elfiejs.

## Acknowledgements
Thank you to [3demax](https://github.com/3demax) for their project
[elfie](https://github.com/3demax/elfie) written in Python, which
heavily inspired elfiejs.

Thank you to [@AJunyentFerre](https://twitter.com/AJunyentFerre) for
making this possible by [reverse-engineering a similar drone](https://hackaday.io/project/19680-controlling-a-jjrc-h37-elfie-quad-from-a-pc).