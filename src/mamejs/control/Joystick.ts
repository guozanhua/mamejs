/// <reference path="../model/IControls.ts" />

namespace mamejs.control {
  export class Joystick {
    static axes = [['left', 'right'], ['up', 'down']]

    // maps IControl keys as string like this control[button]
    static keyMap = ['button1', 'button2', 'button3', 'button4', 'button5', 'button6', null, null, 'coin', 'start']

    private pressed = {}
    private loopId: number

    private customKeyMap: Array<string>

    constructor(private gamepad: Gamepad, private control: IControl) {}

    public connect() {
      if (!this.isConnected()) {
        let loop = () => {
          let gamepad = this.getGamepad()

          // handles axis press / release
          Joystick.axes.forEach((axe: Array<string>, index: number): void => {
            try {
              if (gamepad.axes[index] === -1 || gamepad.axes[index] === 1) {
                this.keyPress(gamepad.axes[index] === -1 ? axe[0] : axe[1])
              } else if (this.pressed[axe[0]] || this.pressed[axe[1]]) {
                this.keyRelease(this.pressed[axe[0]] ? axe[0] : axe[1])
              }
            } catch (e) {} // prevent exception when disconnect
          })

          // handle key press/release
          this.getKeyMap().forEach((bt: string, index: number): void => {
            if (bt) {
              try {
                if (gamepad.buttons[index].pressed) {
                  this.keyPress(bt)
                } else if (this.pressed[bt]) {
                  this.keyRelease(bt)
                }
              } catch (e) {} // prevent exception when disconnect
            }
          })

          this.loopId = requestAnimationFrame(loop)
        }

        loop()
      }
    }

    public disconnect() {
      cancelAnimationFrame(this.loopId)
      this.loopId = null
    }

    public isConnected(): boolean {
      return !!this.loopId
    }

    public getGamepad(): Gamepad {
      return navigator.getGamepads()[this.gamepad.index]
    }

    public setControl(control: IControl): void {
      this.control = control
    }

    public getControl(): IControl {
      return this.control
    }

    public getKeyMap(): Array<string> {
      return this.customKeyMap || Joystick.keyMap
    }

    public setKeyMap(keyMap: Array<string>) {
      this.customKeyMap = keyMap
    }

    private keyPress(key: string) {
      this.pressed[key] = true
      this.control[key].press()
    }

    private keyRelease(key: string) {
      this.pressed[key] = false
      this.control[key].release()
    }
  }
}