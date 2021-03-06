import Conveyor from './conveyor';
import {type Direction, components, invert} from '../direction';
import {overlap} from '../geometry';
import {type Sprite} from '../objects';
import {Fixture} from '../objects';

export default class Lever extends Fixture {
    conveyors: Array<Conveyor>;

    constructor(x: number, y: number, direction: Direction, conveyors: Array<Conveyor>) {
        super(x, y, direction);
        this.conveyors = conveyors;
    }

    toggle() {
        console.log(this.direction);
        this.direction = invert(this.direction);
        for (let conveyor of this.conveyors) {
            conveyor.reverse();
        }
    }

    update(sprite: Sprite) {
        if (overlap(sprite, this)) {
            const offset = components(this.direction);
            if (overlap(sprite, { x: this.x + offset.x / 2, y: this.y + offset.y / 2 })) {
                this.toggle();
            }
        }
    }
}
