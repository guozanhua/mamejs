/// <reference path="../emloader/model/IEmloader.ts" />
/// <reference path="../emloader/model/IControls.ts" />
/// <reference path="model/IConfig.ts" />
/// <reference path="../emloader/controllers/Controllers.ts" />
/// <reference path="../emloader/Emloader.ts" />
/// <reference path="mame/ControllersMapping.ts" />
/// <reference path="mame/Mame.ts" />

namespace mamejs {

  export function load(url: string, container: HTMLElement): Promise<Mame> {
    return emloader.load(url, container).then((loader: emloader.IEmloader): Mame => {
      let mame = new Mame(loader)
      controllers.setKeyHandler(mame.keyHandler)

      return mame
    })
  }

  export function run(config: IConfig, container: HTMLElement): Promise<Mame> {
    return load(config.emulator, container).then(function(mame: Mame): Promise<Mame> {
      return mame.loadRoms(config.game.files).then(function() {
        return mame.runGame(config.game.driver, config.resolution).then(function(): Mame {
          return mame
        })
      })
    })
  }

  // register available controllers
  // need to transform them into array for emloader.Controllers constructor
  let controlsMapping: Array<emloader.IControlMapping> = Object.keys(ControllersMapping).map((mappingName: string) => {
    return ControllersMapping[mappingName]
  })

  export var controllers: emloader.Controllers = new emloader.Controllers(controlsMapping)
}
