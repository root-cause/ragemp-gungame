const EventEmitter = require("events");
const util = require("../util");

class Game extends EventEmitter {
    constructor() {
        super();

        this._secondsLeft = 0;
        this._weapons = null;
        this._map = null;
        this._mapProps = [];
        this._timer = null;
        this._started = false;
    }

    get secondsLeft() {
        return this._secondsLeft;
    }

    set secondsLeft(value) {
        if (!Number.isInteger(value)) {
            throw new TypeError(`secondsLeft: Number required. (value was ${typeof value})`);
        }

        if (value < 0) {
            throw new RangeError("secondsLeft: value cannot be less than 0.");
        }

        this._secondsLeft = value;
    }

    get weapons() {
        return this._weapons;
    }

    set weapons(value) {
        if (this._started) {
            throw new Error("weapons: Cannot change after the game started.");
        }

        if (!Array.isArray(value)) {
            throw new TypeError(`weapons: Array required. (value was ${typeof value})`);
        }

        if (value.length < 1) {
            throw new RangeError("weapons: Array has no items.");
        }

        const anyInvalidEntry = value.some((item) => {
            return util.isLoadoutItemInvalid(item);
        });

        if (anyInvalidEntry) {
            throw new SyntaxError("weapons: Invalid loadout data.");
        }

        this._weapons = value;
        console.info(`[${new Date().toLocaleString()}] [GAME] Weapons set to "${this._weapons.map(w => w.Name).join(" > ")}".`);
    }

    get map() {
        return this._map;
    }

    set map(value) {
        if (this._started) {
            throw new Error("map: Cannot change after the game started.");
        }

        if (util.isMapInvalid(value)) {
            throw new Error("map: Invalid map passed.");
        }

        this._map = value;

        if (this._map.hasOwnProperty("World")) {
            let hour = 12;
            let minute = 0;
            let second = 0;

            if (this._map.World.hasOwnProperty("time")) {
                hour = this._map.World.time.hour;
                if (!Number.isInteger(hour) || hour < 0 || hour > 23) hour = 12;

                minute = this._map.World.time.minute;
                if (!Number.isInteger(minute) || minute < 0 || minute > 59) minute = 0;

                second = this._map.World.time.second;
                if (!Number.isInteger(second) || second < 0 || second > 59) second = 0;
            }

            mp.world.time.set(hour, minute, second);
            mp.world.weather = this._map.World.hasOwnProperty("weather") ? this._map.World.weather : "CLEAR";
        } else {
            mp.world.time.set(12, 0, 0);
            mp.world.weather = "CLEAR";
        }

        this._mapProps.forEach(prop => prop.destroy());
        this._mapProps = [];

        if (this._map.hasOwnProperty("Props")) {
            for (const prop of this._map.Props) {
                this._mapProps.push(mp.objects.new(mp.joaat(prop.model), prop.position, { rotation: prop.rotation }));
            }
        }

        console.info(`[${new Date().toLocaleString()}] [GAME] Map set to "${this._map.name}".`);
    }

    get isRunning() {
        return this._started;
    }

    start() {
        if (!this._started) {
            if (this._secondsLeft < 1) {
                throw new Error("Cannot start the game because secondsLeft is not set.");
            }

            if (this._weapons == null) {
                throw new Error("Cannot start the game because weapons is not set.");
            }

            if (this._map == null) {
                throw new Error("Cannot start the game because map is not set.");
            }

            this._started = true;
            this._timer = setInterval(() => {
                this._secondsLeft--;
                mp.players.call("updateGameTime", [this._secondsLeft]);

                if (this._secondsLeft < 1) this.stop();
            }, 1000);

            this.emit("start");
            console.info(`[${new Date().toLocaleString()}] [GAME] Game started.`);
        }
    }

    stop() {
        if (this._started) {
            this.emit("end");

            clearInterval(this._timer);
            this._timer = null;
            this._started = false;
            console.info(`[${new Date().toLocaleString()}] [GAME] Game ended.`);
        }
    }
};

module.exports = new Game();