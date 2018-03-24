import { Socket, createSocket } from 'dgram'

type Command = '' | 'start' | 'stop'

export class Drone {
  private client: Socket
  private message = ''

  private IP = '172.16.10.1'
  private PORT = 8895

  constructor () {
    this.client = createSocket('udp4')
    this.idle()

    setInterval(() => {
      this.sendMessage(this.message)
    }, 50)
  }

  idle () {
    this.message = this.getIdleMessage()
  }

  start () {
    this.message = this.generateMessage({ command: 'start' })
  }

  stop () {
    this.message = this.generateMessage({ command: 'stop' })
  }

  setState (throttle: number, roll: number, pitch: number, yaw: number) {
    this.message = this.generateMessage({ throttle, roll, pitch, yaw })
  }

  private generateMessage (
    {
      roll: roll = 0,
      yaw: yaw = 0,
      pitch: pitch = 0,
      throttle: throttle = 0,
      command: command = '' as Command,
      holdAltitude: holdAltitude = true,
      headless: headless = false
    } = {}
  ) {
    if (!holdAltitude) {
      if (throttle < 0) {
        throttle = 0
      }
      throttle = throttle * 2 - 1
    }

    const flightInput = [roll, pitch, throttle, yaw].map(this.denormalize)
    flightInput.push(this.commandToNumber(command))

    const checksum = flightInput.reduce((a, b) => a ^ b, 0)
    flightInput.push(checksum)

    return ['66', ...flightInput.map(this.decToHex), '99'].join('')
  }

  private commandToNumber (command: Command) {
    const commandMap = {
      '': 0,
      'start': 1,
      'stop': 4
    }
    return commandMap[command]
  }

  private getIdleMessage () {
    return '6680800180008199'
  }

  private denormalize (value: number) {
    return Math.ceil((value + 1) * 127.5)
  }

  private decToHex (val: number) {
    return (val + 0x100).toString(16).substr(-2)
  }

  private sendMessage (message: string) {
    const messageBuffer = Buffer.from(message, 'hex')
    this.client.send(messageBuffer, this.PORT, this.IP)
  }
}
