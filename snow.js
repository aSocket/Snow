'use strict';

/**
 * @name snow
 * @desc Create a snow effect on the web.
 * 
 * Last Updated: 12/17/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// ------------------------------

// aSocket Scope
const aSocketSnow = {}

/**
 * Snowflake layer configuration.
 * @typedef {Object} CONFIG
 * @property {number} LIMIT - The maximum number of snowflakes to create.
 * @property {number} BLUR - The filter blur value.
 * @property {number} FALL_RATE - The rate at which snowflakes fall.
 * @property {number} SWAY_RATE - The rate at which snowflakes sway.
 */

/**
 * @name CONFIG
 * @desc Snowflake layer configuration.
 * @type {CONFIG}
 */
aSocketSnow.CONFIG = [
    {
        'LIMIT': 20,
        'BLUR': 1,
        'FALL_RATE': 5,
        'SWAY_RATE': 1,
    },
    {
        'LIMIT': 25,
        'BLUR': 4,
        'FALL_RATE': 3.5,
        'SWAY_RATE': 0.25, 
    },

    {
        'LIMIT': 25,
        'BLUR': 4,
        'FALL_RATE': 3.0,
        'SWAY_RATE': 0.25, 
    },
];

/**
 * @name injectCSS
 * @desc Inject required CSS. (Enables one file requirement)
 * @returns {void}
 */
aSocketSnow.injectCSS = function() {
    document.head.appendChild(document.createElement('style')).innerHTML = `
        .snow-container {
            position: fixed;
            overflow: hidden;
            z-index: 100;
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        
        .snowflake {
            position: absolute;
            height: 10px;
            width: 10px;
            background-color: #ffffff;
            border-radius: 50%;
            filter: blur(4px);
        }
    `;
}

/**
 * @name createContainer
 * @desc Creates main container for snow effect.
 * @returns {HTMLElement} The main container element.
 */
 aSocketSnow.createContainer = function() {
    const body = document.createElement('div');
    body.id = 'asocket-snow-container';
    body.classList = 'snow-container';
    document.body.prepend(body);
    return body;
}

/**
 * @name command
 * @desc The method command name to execute on all controller classes.
 * @param {string} cmd - The command to execute.
 * @returns {void}
 */
 aSocketSnow.command = function(cmd) {
    if (!aSocketSnow.controllers[0][cmd]) { return; }
    for (const controller of aSocketSnow.controllers) { controller[cmd](); }
}

/**
 * @name getSine
 * @desc Get a modified sine value.
 * @param {number} amplitude - The amplitude of the sine wave.
 * @param {number} frequency - The frequency of the sine wave.
 * @param {number} verticalShift - The vertical shift of the sine wave.
 * @returns {number} The modified sine value.
 */
aSocketSnow.getSine = function(amplitude, frequency, verticalShift) {
    return amplitude * Math.sin(Date.now() * frequency) + verticalShift;
}

/**
 * @name main
 * @desc The main snow effect function.
 * @returns {void}
 */
aSocketSnow.main = function() {

    // Inject required CSS.
    aSocketSnow.injectCSS();

    // Create body element.
    const body = aSocketSnow.createContainer();

    // Create snow "controllers" array.
    aSocketSnow.controllers = [];

    // Loop through each configuration layer.
    for (const layer of aSocketSnow.CONFIG) {

        // Create new snowflakes controller.
        aSocketSnow.controllers.push(new Controller(body, layer));
    }

    // Create 'resize' listener.
    window.addEventListener('resize', () => {
        for (const controller of aSocketSnow.controllers) {
            controller.resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
        }
    });
}

/**
 * @name Controller
 * @desc The snowflake controller class.
 */
class Controller {

    /**
     * @param {HTMLElement} body - The main container element.
     * @param {CONFIG} config - The snowflake layer configuration.
     */
    constructor(body, config) {

        /**
         * @property {HTMLElement} body - The main container element.
         */
        this.body = body;

        /**
         * @property {CONFIG} config - The snowflake layer configuration.
         */
        this.config = config;

        /**
         * @property {Array.<Snowflake>} snowflakes - The snowflake array.
         */
        this.snowflakes = [];

        /**
         * @property {Object} document - The document object.
         * @property {number} document.width - The document width.
         * @property {number} document.height - The document height.
         */
        this.document = {
            'width': document.documentElement.clientWidth,
            'height': document.documentElement.clientHeight,
        }
        
        this.start();
    }

    /**
     * @name start
     * @desc Start the snowflake controller animation/creation flow.
     * @returns {void}
     */
    start() {
        if (this.active) { return; }
        this.active = true;
        this.generate();
        this.interval = setInterval(() => { this.animate(); }, 17);
    }

    /**
     * @name spawn
     * @desc Spawn a new snowflake.
     * @returns {void}
     */
     spawn() {
        this.snowflakes.push(new Snowflake(Math.random() * this.document.width, 0, this.body, this.config.BLUR));
    }

    /**
     * @name generate
     * @desc Initially generate snowflakes at randomly delayed intervals.
     * @returns {void}
     */
     async generate() {
        for (let i = this.snowflakes.length; i < this.config.LIMIT; i++) {
            await new Promise((resolve) => {setTimeout(() => {resolve()}, Math.random() * 400)});
            if (!this.active) { return; }
            this.spawn();
        }
    }

    /**
     * @name animate
     * @desc Animate all existing snowflakes.
     * @returns {void}
     */
     animate() {
        for (const snowflake of this.snowflakes) {
            // Animate snowflake.
            snowflake.left = aSocketSnow.getSine(1.0, 0.005, snowflake.left + this.config.SWAY_RATE);
            snowflake.top = snowflake.top + this.config.FALL_RATE;
            
            // Verify snowflake lifecycle.
            const bounds = snowflake.bounds;
            if (bounds.x > (this.document.width + bounds.width) || bounds.y > (this.document.height + bounds.height)) {
                this.remove(snowflake);
                this.spawn();
            }
        }
    }

    /**
     * @name remove
     * @desc Remove a snowflake from the DOM and controller.
     * @param {Snowflake} snowflake 
     * @returns {void}
     */
     remove(snowflake) {
        this.snowflakes.splice(this.snowflakes.indexOf(snowflake), 1);
        snowflake.element.remove();
    }

    /**
     * @name clear
     * @desc Clear all snowflakes from the DOM and controller.
     * @returns {void}
     */
    clear() {
        // Due to the nature of splice, we can not simply call this.remove(), as it would upset the count. 
        // Alternatively, we will simply remove all elements, then reset the array.
        for (const snowflake of this.snowflakes) { snowflake.element.remove(); } 
        this.snowflakes = [];
    }

    /**
     * @name stop
     * @desc Stop the snowflake controller animation/creation flow.
     * @returns {void}
     */
     stop() {
        this.active = false;
        clearInterval(this.interval);
        this.interval = null;
    }

    /**
     * @name resize
     * @desc Resize the snowflake container / update snowflake positions.
     * @param {number} width - The new document width.
     * @param {number} height - The new document height.
     * @returns {void}
     */
     resize(width, height) {
        for (const snowflake of this.snowflakes) {
            snowflake.left = snowflake.left + (width - this.document.width);
            snowflake.top = snowflake.top + (height - this.document.height);
        }

        this.document.width = width;
        this.document.height = height;
    }
}

/**
 * @name Snowflake
 * @desc The snowflake class.
 */
class Snowflake {

    /**
     * 
     * @param {number} x - The x position the snowflake should be spawned at.
     * @param {number} y - The y position the snowflake should be spawned at.
     * @param {HTMLElement} container - The container element.
     * @param {number} blur - The blur value.
     */
    constructor(x, y, container, blur) {
        this.element = document.createElement('div');
        this.element.className = 'snowflake';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.filter = `blur(${blur}px)`; // drop-shadow(5px 5px 5px #000)
        container.appendChild(this.element);
    }

    /**
     * Retrieves the snowflake's top position.
     * @type {number}
     */
    get top() {
        return Number(this.element.style.top.replace('px', ''));
    }

    /**
     * Sets the snowflake's top position.
     * @param {number} value - The new top position.
     */
    set top(value) {
        this.element.style.top = value + 'px';
    }

    /**
     * Retrieves the snowflake's left position.
     * @type {number}
     */
    get left() {
        return Number(this.element.style.left.replace('px', ''));
    }

    /**
     * Sets the snowflake's left position.
     * @param {number} value - The new left position.
     */
    set left(value) {
        this.element.style.left = value + 'px';
    }

    /**
     * Retrieves the snowflake's bounds.
     * @type {Object}
     */
    get bounds() {
        return this.element.getBoundingClientRect();
    }
}

// On window load, call aSocketSnow main.
window.addEventListener("load", aSocketSnow.main);
