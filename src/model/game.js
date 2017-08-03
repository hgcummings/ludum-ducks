import levels from './levels';
import initPlayerModel from './player';
import Duck from './movable/duck';

export const tick = 125;
export const tickFrequency = 0.008;

export default (levelId: number) => {
    const level = levels[levelId];
    let lastUpdate = 0;
    const self = {
        level: level,
        player: initPlayerModel(level),
        ducks: [],
        score: 0,
        over: false,
        update: (gameTime: number) => {
            self.player.update(gameTime);

            if (self.player.power <= 0) {
                self.over = true;
                return;
            }

            if (Math.floor(gameTime / tick) > Math.floor(lastUpdate / tick)) {
                const nextTick = lastUpdate + tick - (lastUpdate % tick);
                for (let time = nextTick; time <= gameTime; time += tick) {
                    const tickNumber = time / tick;

                    for (let lever of level.fixtures.levers) {
                        lever.update(self.player);
                    }

                    for (let i = self.ducks.length - 1; i >=0; --i) {
                        const duck = self.ducks[i];
                        duck.update(gameTime);

                        if (duck.z <= -1) {
                            self.ducks.splice(i, 1);
                        }

                        if (duck.x <= -1 || duck.y <= -1 || duck.x >= level.width || duck.y >= level.height) {
                            self.ducks.splice(i, 1);

                            if (duck.isValid()) {
                                self.score++;
                            }
                        }
                    }

                    for (let conveyor of level.fixtures.conveyors) {
                        conveyor.update(self);
                    }

                    for (let outlet of level.fixtures.outlets) {
                        outlet.update(self, tickNumber);
                    }

                    for (let press of level.fixtures.presses) {
                        press.update(self, tickNumber);
                    }

                    for (let painter of level.fixtures.painters) {
                        painter.update(self, tickNumber);
                    }

                    for (let printer of level.fixtures.printers) {
                        printer.update(self, tickNumber);
                    }

                    for (let pusher of level.fixtures.pushers) {
                        pusher.update(self, tickNumber);
                    }

                    for (let turntable of level.fixtures.turntables) {
                        turntable.update(self, tickNumber);
                    }

                    for (let checker of level.fixtures.checkers) {
                        checker.update(self, tickNumber);
                    }
                }

                lastUpdate = gameTime;
            }
        }
    }

    return self;
}
