class AwesomeCharacter extends Character {
    constructor(game, image) {
        super(game, image);

        this.states = Object.freeze({
            MOVE : "move ",
            ATTACK : "attack ",
            IDLE : "idle ",
        });

        this.state = this.states.IDLE;
        this.facing = Character.DIRECTION.RIGHT;

        this.setupAnimation();
        this.setupKeymap();
    }

    setupAnimation() {
        this.animations = {
            [this.states.MOVE + Character.DIRECTION.RIGHT] : new Animator(
                this.spritesheet,
                [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5] ],
                1),
            [this.states.MOVE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [1, 13], [1, 12], [1, 11], [1, 10], [1, 9], [1, 8] ],
                1
            ),
            [this.states.IDLE + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [ [0, 0] ],
                1
            ),
            [this.states.IDLE + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [0, 13] ],
                1
            ),
            [this.states.ATTACK + Character.DIRECTION.RIGHT]: new Animator(
                this.spritesheet,
                [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6] ],
                0.5,
                false,
                () => {
                    this.stateLock = false;
                    this.setState(this.states.IDLE);
                    this.facing = Character.DIRECTION.RIGHT;
                }
            ),
            [this.states.ATTACK + Character.DIRECTION.LEFT]: new Animator(
                this.spritesheet,
                [ [2, 13], [2, 12], [2, 11], [2, 10], [2, 9], [2, 8], [2, 7] ],
                0.5,
                false,
                () => {
                    this.stateLock = false;
                    this.setState(this.states.IDLE);
                    this.facing = Character.DIRECTION.LEFT;
                }
            ),
        };

        this.currentAnimation = this.animations[this.animationName()];
    }

    setupKeymap() {
        this.keymapper = new KeyMapper();

        this.keymapper.inputMap = {
            [KeyMapper.getName("KeyD", true)] : "move right",
            [KeyMapper.getName("KeyA", true)] : "move left",
            [KeyMapper.getName("KeyS", true)] : "attack",
            [KeyMapper.getName("KeyD", false)] : "stop",
            [KeyMapper.getName("KeyA", false)] : "stop",
        };

        this.keymapper.outputMap = {
            "move right" : () => this.move(5),
            "move left" : () => this.move(-5),
            "attack" : () => this.swing(),
            "stop" : () => this.stopMoving(),
        };
    }

    /**
     * Tells this character that a key event has occurred.
     * @param keyList the list of key event to process
     */
    acknowledge(keyList) {
        for (let key in keyList) this.keymapper.send(key);
    }

    move(dx) {
        if (!this.setState(this.states.MOVE)) {
            this.dx = dx;
            this.facing = dx < 0 ? Character.DIRECTION.LEFT : Character.DIRECTION.RIGHT;
        }
    }

    stopMoving() {
        this.setState(this.states.IDLE);
    }

    swing() {
        this.setState(this.states.ATTACK);
    }

    update() {
        for (let key in this.game.keys) this.keymapper.sendKeyEvent(this.game.keys[key]);

        ({
            [this.states.ATTACK] : () => {
                this.stateLock = true;
            },
            [this.states.MOVE] : () => {
                this.position.x += this.dx;
            }
        })[this.state]?.();
    }
}