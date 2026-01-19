/**
 * Creates a basic character
 *
 * @author Roman Bureacov
 */
class character {
    constructor(game, image) {
        Object.assign(this, { game, image });
        this.spritesheet = new Spritesheet(this.image, 3, 14);

        this.position = {x: 0, y: 0};
        this.scale = {x: 2, y: 2};
        this.dx = 0;

        this.states = Object.freeze({
            MOVE : "move ",
            ATTACK : "attack ",
            IDLE : "idle ",
        });

        this.direction = Object.freeze({
            LEFT : "left ",
            RIGHT : "right ",
        });

        this.state = this.states.IDLE;
        this.facing = this.direction.RIGHT;


        this.setupAnimation();
        this.setupKeymap();
    }

    setupAnimation() {
        this.animations = {
            [this.states.MOVE + this.direction.RIGHT] : new Animator(
                this.spritesheet,
                [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5] ],
                0.25),
            [this.states.MOVE + this.direction.LEFT]: new Animator(
                this.spritesheet,
                [ [1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8] ],
                0.25
            ),
            [this.states.IDLE + this.direction.RIGHT]: new Animator(
                this.spritesheet,
                [ [0, 0] ],
                1
                ),
            [this.states.IDLE + this.direction.LEFT]: new Animator(
                this.spritesheet,
                [ [0, 13] ],
                1
            ),
            [this.states.ATTACK + this.direction.RIGHT]: new Animator(
                this.spritesheet,
                [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6] ],
                0.25,
                false,
                () => {
                    this.state = this.states.IDLE;
                    this.facing = this.direction.RIGHT;
                }
            ),
            [this.states.ATTACK + this.direction.LEFT]: new Animator(
                this.spritesheet,
                [ [2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7] ],
                0.25,
                false,
                () => {
                    this.state = this.states.IDLE;
                    this.facing = this.direction.LEFT;
                }
            ),
        };

        this.currentAnimation = this.animations[this.animationName()];
    }

    setupKeymap() {
        this.keymap = {

        }
    }

    move(dx) {
        this.state = this.states.MOVE;
        this.dx = dx;
        this.facing = dx < 0 ? this.direction.LEFT : this.direction.RIGHT;
    }

    swing() {
        this.state = this.states.ATTACK;
    }

    draw(context) {
        let anim = this.animations[this.animationName()];

        // are we switching animations?
        if (anim !== this.currentAnimation) this.currentAnimation.reset();

        (this.currentAnimation = anim).draw(
            this.game.clockTick,
            context,
            this.position.x, this.position.y,
            this.scale.x, this.scale.y);
    }

    animationName() {
        return this.state + this.facing;
    }

    update() {
        ({
            [this.states.ATTACK] : () => {

            },
            [this.states.MOVE] : () => {
                if (this.dx !== 0) {
                    this.position.x += this.dx;
                    this.dx = 0;
                } else this.state = this.states.IDLE;
            }
        })[this.state]?.();
    }
}