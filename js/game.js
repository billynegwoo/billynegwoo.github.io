/**
 * init
 */
$.init = function () {
    $.w = window;
    $.d = document;
    $.e = $.d.documentElement;
    $.g = $.d.getElementsByTagName('body')[0];
    $.x = $.w.innerWidth || $.e.clientWidth || $.g.clientWidth;
    $.y = $.w.innerHeight|| $.e.clientHeight|| $.g.clientHeight;
    $.setupStorage();
    $.wrap = document.getElementById('wrap');
    $.wrapInner = document.getElementById('wrap-inner');
    $.cbg1 = document.getElementById('cbg1');
    $.cbg2 = document.getElementById('cbg2');

    $.cmg = document.getElementById('cmg');
    $.cfg = document.getElementById('cfg');
    $.ctxbg1 = $.cbg1.getContext('2d');
    $.ctxbg2 = $.cbg2.getContext('2d');

    $.ctxmg = $.cmg.getContext('2d');
    $.ctxfg = $.cfg.getContext('2d');
    $.cw = $.cmg.width = $.cfg.width = $.x - 20;
    $.ch = $.cmg.height = $.cfg.height = $.y - 20;
    $.wrap.style.width = $.wrapInner.style.width = $.cw + 'px';
    $.wrap.style.height = $.wrapInner.style.height = $.ch + 'px';
    $.wrap.style.marginLeft = ( -$.cw / 2 ) - 10 + 'px';
    $.wrap.style.marginTop = ( -$.ch / 2 ) - 10 + 'px';
    $.ww = Math.floor($.cw * 2);
    $.wh = Math.floor($.ch * 2);
    $.cbg1.width = Math.floor($.cw * 1.1);
    $.cbg1.height = Math.floor($.ch * 1.1);
    $.cbg2.width = Math.floor($.cw * 1.15);
    $.cbg2.height = Math.floor($.ch * 1.15);

    $.screen = {
        x: ( $.ww - $.cw ) / -2,
        y: ( $.wh - $.ch ) / -2
    };
    $.rumble = {
        x: 0,
        y: 0,
        level: 0,
        decay: 0.4
    };
    $.levelCount = $.definitions.levels.length;
    $.mute = $.storage['mute'];
    $.autofire = $.storage['autofire'];
    $.slowEnemyDivider = 3;
    $.powerupTimers = [];
    $.bullets = [];
    $.particleEmitters = [];
    $.explosions = [];
    $.enemies = [];
    $.powerups = [];
    $.textPops = [];
    $.levelPops = [];
    $.buttons = [];
    $.okeys = {};
    $.powerupTimers = [];
    $.states = {};
    $.state = '';
    $.mouse = {
        x: $.ww / 2,
        y: $.wh / 2,
        sx: 0,
        sy: 0,
        ax: window.innerWidth / 2,
        ay: 0,
        down: 0
    };
    $.keys = {
        state: {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            f: 0,
            m: 0,
            p: 0
        },
        pressed: {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            f: 0,
            m: 0,
            p: 0
        }
    };
    $.resizecb();
    $.bindEvents();
    $.setupStates();
    $.renderBackground();
    $.setState('menu');
    $.loop();
};
$.renderBackground = function () {
    var i = 2000;
    while (i--) {
        $.util.fillCircle($.ctxbg1, $.util.rand(0, $.cbg1.width), $.util.rand(0, $.cbg1.height), $.util.rand(0.2, 0.5), 'hsla(0, 0%, 100%, ' + $.util.rand(0.05, 0.2) + ')');
    }

    var j = 800;
    while (j--) {
        $.util.fillCircle($.ctxbg1, $.util.rand(0, $.cbg1.width), $.util.rand(0, $.cbg1.height), $.util.rand(0.1, 0.8), 'hsla(0, 0%, 100%, ' + $.util.rand(0.05, 0.5) + ')');
    }
};
/**
 * Event
 */
$.mousemovecb = function (e) {
    e.preventDefault();
    $.mouse.ax = e.pageX;
    $.mouse.ay = e.pageY;
    $.mousescreen();
};

$.mousescreen = function () {
    $.mouse.sx = $.mouse.ax - $.cOffset.left;
    $.mouse.sy = $.mouse.ay - $.cOffset.top;
    $.mouse.x = $.mouse.sx - $.screen.x;
    $.mouse.y = $.mouse.sy - $.screen.y;
};

$.mousedowncb = function (e) {
    e.preventDefault();
    $.mouse.down = 1;
};

$.mouseupcb = function (e) {
    e.preventDefault();
    $.mouse.down = 0;
};

$.keydowncb = function (e) {
    var k = ( e.keyCode ? e.keyCode : e.which );
    if (k === 38 || k === 90) {
        $.keys.state.up = 1;
    }
    if (k === 39 || k === 68) {
        $.keys.state.right = 1;
    }
    if (k === 40 || k === 83) {
        $.keys.state.down = 1;
    }
    if (k === 37 || k === 81) {
        $.keys.state.left = 1;
    }
    if (k === 70) {
        $.keys.state.f = 1;
    }
    if (k === 77) {
        $.keys.state.m = 1;
    }
    if (k === 80) {
        $.keys.state.p = 1;
    }
};

$.keyupcb = function (e) {
    var k = ( e.keyCode ? e.keyCode : e.which );
    if (k === 38 || k === 90) {
        $.keys.state.up = 0;
    }
    if (k === 39 || k === 68) {
        $.keys.state.right = 0;
    }
    if (k === 40 || k === 83) {
        $.keys.state.down = 0;
    }
    if (k === 37 || k === 81) {
        $.keys.state.left = 0;
    }
    if (k === 70) {
        $.keys.state.f = 0;
    }
    if (k === 77) {
        $.keys.state.m = 0;
    }
    if (k === 80) {
        $.keys.state.p = 0;
    }
};

$.resizecb = function (e) {
    var rect = $.cmg.getBoundingClientRect();
    $.cOffset = {
        left: rect.left,
        top: rect.top
    }
};

$.blurcb = function () {
    if ($.state == 'play') {
        $.setState('pause');
    }
};

$.bindEvents = function () {
    window.addEventListener('mousemove', $.mousemovecb);
    window.addEventListener('mousedown', $.mousedowncb);
    window.addEventListener('mouseup', $.mouseupcb);
    window.addEventListener('keydown', $.keydowncb);
    window.addEventListener('keyup', $.keyupcb);
    window.addEventListener('resize', $.resizecb);
    window.addEventListener('blur', $.blurcb);
};
/**
 * UI
 */
$.renderInterface = function () {

    /**
     * Power UP
     */
    for (var i = 0; i < $.definitions.powerups.length; i++) {
        var powerup = $.definitions.powerups[i],
            powerupOn = ( $.powerupTimers[i] > 0 );
        $.ctxmg.beginPath();
        var powerupText = $.text({
            ctx: $.ctxmg,
            x: 90,
            y: $.ch + ( i * 12 ) - 70,
            text: powerup.title,
            hspacing: 1,
            vspacing: 1,
            halign: 'right',
            valign: 'bottom',
            scale: 1,
            snap: 1,
            render: 1
        });
        if (powerupOn) {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, ' + ( 0.25 + ( ( $.powerupTimers[i] / 300 ) * 0.75 ) ) + ')';
        } else {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.25)';
        }
        $.ctxmg.fill();
        if (powerupOn) {
            var powerupBar = {
                x: powerupText.ex + 5,
                y: powerupText.sy,
                width: 110,
                height: 5
            };
            $.ctxmg.fillStyle = 'hsl(' + powerup.hue + ', ' + powerup.saturation + '%, ' + powerup.lightness + '%)';
            $.ctxmg.fillRect(powerupBar.x, powerupBar.y, ( $.powerupTimers[i] / 300 ) * powerupBar.width, powerupBar.height);
        }
    }
    /**
     * instructions
     */
    if ($.instructionTick < $.instructionTickMax) {
        $.instructionTick += $.dt;
        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 - 10,
            y: $.ch - 20,
            text: 'MOVE\nAIM/FIRE\nAUTOFIRE\nPAUSE\nMUTE',
            hspacing: 1,
            vspacing: 17,
            halign: 'right',
            valign: 'bottom',
            scale: 2,
            snap: 1,
            render: 1
        });
        if ($.instructionTick < $.instructionTickMax * 0.25) {
            var alpha = ( $.instructionTick / ( $.instructionTickMax * 0.25 ) ) * 0.5;
        } else if ($.instructionTick > $.instructionTickMax - $.instructionTickMax * 0.25) {
            var alpha = ( ( $.instructionTickMax - $.instructionTick ) / ( $.instructionTickMax * 0.25 ) ) * 0.5;
        } else {
            var alpha = 0.5;
        }
        alpha = Math.min(1, Math.max(0, alpha));

        $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, ' + alpha + ')';
        $.ctxmg.fill();

        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 + 10,
            y: $.ch - 20,
            text: 'ZQSD/ARROWS\nMOUSE\nF\nP\nM',
            hspacing: 1,
            vspacing: 17,
            halign: 'left',
            valign: 'bottom',
            scale: 2,
            snap: 1,
            render: 1
        });
        if ($.instructionTick < $.instructionTickMax * 0.25) {
            var alpha = ( $.instructionTick / ( $.instructionTickMax * 0.25 ) ) * 1;
        } else if ($.instructionTick > $.instructionTickMax - $.instructionTickMax * 0.25) {
            var alpha = ( ( $.instructionTickMax - $.instructionTick ) / ( $.instructionTickMax * 0.25 ) ) * 1;
        } else {
            var alpha = 1;
        }
        alpha = Math.min(1, Math.max(0, alpha));

        $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, ' + alpha + ')';
        $.ctxmg.fill();
    }
    if ($.powerupTimers[1] > 0) {
        $.ctxmg.fillStyle = 'hsla(200, 100%, 20%, 0.05)';
        $.ctxmg.fillRect(0, 0, $.cw, $.ch);
    }

    /**
     * Health
     */
    $.ctxmg.beginPath();
    var healthText = $.text({
        ctx: $.ctxmg,
        x: 20,
        y: 20,
        text: 'HEALTH',
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
    $.ctxmg.fill();
    var healthBar = {
        x: healthText.ex + 10,
        y: healthText.sy,
        width: 110,
        height: 10
    };
    $.ctxmg.fillStyle = 'hsla(0, 0%, 20%, 1)';
    $.ctxmg.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height);
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.25)';
    $.ctxmg.fillRect(healthBar.x, healthBar.y, healthBar.width, healthBar.height / 2);
    $.ctxmg.fillStyle = 'hsla(' + $.hero.life * 120 + ', 100%, 40%, 1)';
    $.ctxmg.fillRect(healthBar.x, healthBar.y, $.hero.life * healthBar.width, healthBar.height);
    $.ctxmg.fillStyle = 'hsla(' + $.hero.life * 120 + ', 100%, 75%, 1)';
    $.ctxmg.fillRect(healthBar.x, healthBar.y, $.hero.life * healthBar.width, healthBar.height / 2);

    if ($.hero.takingDamage && $.hero.life > 0.01) {
        $.particleEmitters.push(new $.ParticleEmitter({
            x: -$.screen.x + healthBar.x + $.hero.life * healthBar.width,
            y: -$.screen.y + healthBar.y + healthBar.height / 2,
            count: 1,
            spawnRange: 2,
            friction: 0.85,
            minSpeed: 2,
            maxSpeed: 20,
            minDirection: $.pi / 2 - 0.2,
            maxDirection: $.pi / 2 + 0.2,
            hue: $.hero.life * 120,
            saturation: 100
        }));
    }
    /**
     * Progress
     */
    $.ctxmg.beginPath();
    var progressText = $.text({
        ctx: $.ctxmg,
        x: healthBar.x + healthBar.width + 40,
        y: 20,
        text: 'PROGRESS',
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
    $.ctxmg.fill();
    var progressBar = {
        x: progressText.ex + 10,
        y: progressText.sy,
        width: healthBar.width,
        height: healthBar.height
    };
    $.ctxmg.fillStyle = 'hsla(0, 0%, 20%, 1)';
    $.ctxmg.fillRect(progressBar.x, progressBar.y, progressBar.width, progressBar.height);
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.25)';
    $.ctxmg.fillRect(progressBar.x, progressBar.y, progressBar.width, progressBar.height / 2);
    $.ctxmg.fillStyle = 'hsla(0, 0%, 50%, 1)';
    $.ctxmg.fillRect(progressBar.x, progressBar.y, ( $.level.kills / $.level.killsToLevel ) * progressBar.width, progressBar.height);
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 1)';
    $.ctxmg.fillRect(progressBar.x, progressBar.y, ( $.level.kills / $.level.killsToLevel ) * progressBar.width, progressBar.height / 2);

    if ($.level.kills == $.level.killsToLevel) {
        $.particleEmitters.push(new $.ParticleEmitter({
            x: -$.screen.x + progressBar.x + progressBar.width,
            y: -$.screen.y + progressBar.y + progressBar.height / 2,
            count: 30,
            spawnRange: 5,
            friction: 0.95,
            minSpeed: 2,
            maxSpeed: 25,
            minDirection: $.pi / 2 - $.pi / 4,
            maxDirection: $.pi / 2 + $.pi / 4,
            hue: 0,
            saturation: 0
        }));
    }
    /**
     * Progress
     */
    $.ctxmg.beginPath();
    var scoreLabel = $.text({
        ctx: $.ctxmg,
        x: progressBar.x + progressBar.width + 40,
        y: 20,
        text: 'SCORE',
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    var scoreText = $.text({
        ctx: $.ctxmg,
        x: scoreLabel.ex + 10,
        y: 20,
        text: $.util.pad($.score, 6),
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 1)';
    $.ctxmg.fill();
    /**
     * Best score
     */
    $.ctxmg.beginPath();
    var bestLabel = $.text({
        ctx: $.ctxmg,
        x: scoreText.ex + 40,
        y: 20,
        text: 'BEST',
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
    $.ctxmg.fill();

    $.ctxmg.beginPath();
    $.text({
        ctx: $.ctxmg,
        x: bestLabel.ex + 10,
        y: 20,
        text: $.util.pad(Math.max($.storage['score'], $.score), 6),
        hspacing: 1,
        vspacing: 1,
        halign: 'top',
        valign: 'left',
        scale: 2,
        snap: 1,
        render: 1
    });
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 1)';
    $.ctxmg.fill();
};
/**
 * Loop
 */
$.loop = function () {
    requestAnimFrame($.loop);
    /**
     * setup pressed keys
     */
    for (var k in $.keys.state) {
        if ($.keys.state[k] && !$.okeys[k]) {
            $.keys.pressed[k] = 1;
        } else {
            $.keys.pressed[k] = 0;
        }
    }
    $.states[$.state]();

    if ($.keys.pressed.m) {
        $.mute = ~~!$.mute;
        var i = $.audio.references.length;
        while (i--) {
            $.audio.references[i].volume = ~~!$.mute;
        }
        $.storage['mute'] = $.mute;
        $.updateStorage();
    }
    $.okeys = {};
    for (var k in $.keys.state) {
        $.okeys[k] = $.keys.state[k];
    }
};

/**
 * Spawn Enemies
 */
$.getSpawnCoordinates = function (radius) {
    var quadrant = Math.floor($.util.rand(0, 4)),
        x,
        y,
        start;

    if (quadrant === 0) {
        x = $.util.rand(0, $.ww);
        y = -radius;
        start = 'top';
    } else if (quadrant === 1) {
        x = $.ww + radius;
        y = $.util.rand(0, $.wh);
        start = 'right';
    } else if (quadrant === 2) {
        x = $.util.rand(0, $.ww);
        y = $.wh + radius;
        start = 'bottom';
    } else {
        x = -radius;
        y = $.util.rand(0, $.wh);
        start = 'left';
    }

    return {x: x, y: y, start: start};
};

$.spawnEnemy = function (type) {
    var params = $.definitions.enemies[type],
        coordinates = $.getSpawnCoordinates(params.radius);
    params.x = coordinates.x;
    params.y = coordinates.y;
    params.start = coordinates.start;
    params.type = type;
    return new $.Enemy(params);
};

$.spawnEnemies = function () {
    var floorTick = Math.floor($.tick);
    for (var i = 0; i < $.level.distributionCount; i++) {
        var timeCheck = $.level.distribution[i];
        if ($.levelDiffOffset > 0) {
            timeCheck = Math.max(1, timeCheck - ( $.levelDiffOffset * 2));
        }
        if (floorTick % timeCheck === 0) {
            $.enemies.push($.spawnEnemy(i));
        }
    }
};
/**
 * Reset
 */

$.reset = function () {
    $.indexGlobal = 0;
    $.dt = 1;
    $.lt = 0;
    $.elapsed = 0;
    $.tick = 0;

    $.gameoverTick = 0;
    $.gameoverTickMax = 200;
    $.gameoverExplosion = 0;

    $.instructionTick = 0;
    $.instructionTickMax = 400;

    $.levelDiffOffset = 0;
    $.enemyOffsetMod = 0;
    $.slow = 0;

    $.screen = {
        x: ( $.ww - $.cw ) / -2,
        y: ( $.wh - $.ch ) / -2
    };
    $.rumble = {
        x: 0,
        y: 0,
        level: 0,
        decay: 0.4
    };

    $.mouse.down = 0;

    $.level = {
        current: 0,
        kills: 0,
        killsToLevel: $.definitions.levels[0].killsToLevel,
        distribution: $.definitions.levels[0].distribution,
        distributionCount: $.definitions.levels[0].distribution.length
    };

    $.enemies.length = 0;
    $.bullets.length = 0;
    $.explosions.length = 0;
    $.powerups.length = 0;
    $.particleEmitters.length = 0;
    $.textPops.length = 0;
    $.levelPops.length = 0;
    $.powerupTimers.length = 0;

    for (var i = 0; i < $.definitions.powerups.length; i++) {
        $.powerupTimers.push(0);
    }

    $.kills = 0;
    $.bulletsFired = 0;
    $.powerupsCollected = 0;
    $.score = 0;

    $.hero = new $.Hero();

    $.levelPops.push(new $.LevelPop({
        level: 1
    }));
};
/**
 * Miscellaneous
 */
$.clearScreen = function () {
    $.ctxmg.clearRect(0, 0, $.cw, $.ch);
};
$.updateScreen = function () {
    var xSnap,
        xModify,
        ySnap,
        yModify;

    if ($.hero.x < $.cw / 2) {
        xModify = $.hero.x / $.cw;
    } else if ($.hero.x > $.ww - $.cw / 2) {
        xModify = 1 - ( $.ww - $.hero.x ) / $.cw;
    } else {
        xModify = 0.5;
    }

    if ($.hero.y < $.ch / 2) {
        yModify = $.hero.y / $.ch;
    } else if ($.hero.y > $.wh - $.ch / 2) {
        yModify = 1 - ( $.wh - $.hero.y ) / $.ch;
    } else {
        yModify = 0.5;
    }

    xSnap = ( ( $.cw * xModify - $.hero.x ) - $.screen.x ) / 30;
    ySnap = ( ( $.ch * yModify - $.hero.y ) - $.screen.y ) / 30;

    $.screen.x += xSnap * $.dt;
    $.screen.y += ySnap * $.dt;

    if ($.rumble.level > 0) {
        $.rumble.level -= $.rumble.decay;
        $.rumble.level = ( $.rumble.level < 0 ) ? 0 : $.rumble.level;
        $.rumble.x = $.util.rand(-$.rumble.level, $.rumble.level);
        $.rumble.y = $.util.rand(-$.rumble.level, $.rumble.level);
    } else {
        $.rumble.x = 0;
        $.rumble.y = 0;
    }

    $.cbg1.style.marginLeft =
        -( ( $.cbg1.width - $.cw ) / 2 )
        - ( ( $.cbg1.width - $.cw ) / 2 )
        * ( ( -$.screen.x - ( $.ww - $.cw ) / 2 ) / ( ( $.ww - $.cw ) / 2) )
        - $.rumble.x + 'px';
    $.cbg1.style.marginTop =
        -( ( $.cbg1.height - $.ch ) / 2 )
        - ( ( $.cbg1.height - $.ch ) / 2 )
        * ( ( -$.screen.y - ( $.wh - $.ch ) / 2 ) / ( ( $.wh - $.ch ) / 2) )
        - $.rumble.y + 'px';
    $.cbg2.style.marginLeft =
        -( ( $.cbg2.width - $.cw ) / 2 )
        - ( ( $.cbg2.width - $.cw ) / 2 )
        * ( ( -$.screen.x - ( $.ww - $.cw ) / 2 ) / ( ( $.ww - $.cw ) / 2) )
        - $.rumble.x + 'px';
    $.cbg2.style.marginTop =
        -( ( $.cbg2.height - $.ch ) / 2 )
        - ( ( $.cbg2.height - $.ch ) / 2 )
        * ( ( -$.screen.y - ( $.wh - $.ch ) / 2 ) / ( ( $.wh - $.ch ) / 2) )
        - $.rumble.y + 'px';

    $.mousescreen();
};
$.updatePowerupTimers = function () {
    if ($.powerupTimers[0] > 0) {
        if ($.hero.life < 1) {
            $.hero.life += 0.001;
        }
        if ($.hero.life > 1) {
            $.hero.life = 1;
        }
        $.powerupTimers[0] -= $.dt;
    }
    if ($.powerupTimers[1] > 0) {
        $.slow = 1;
        $.powerupTimers[1] -= $.dt;
    } else {
        $.slow = 0;
    }
    if ($.powerupTimers[2] > 0) {
        $.hero.weapon.fireRate = 2;
        $.hero.weapon.bullet.speed = 14;
        $.powerupTimers[2] -= $.dt;
    } else {
        $.hero.weapon.fireRate = 5;
        $.hero.weapon.bullet.speed = 10;
    }
    if ($.powerupTimers[3] > 0) {
        $.hero.weapon.count = 3;
        $.powerupTimers[3] -= $.dt;
    } else {
        $.hero.weapon.count = 1;
    }
    if ($.powerupTimers[4] > 0) {
        $.hero.weapon.bullet.piercing = 1;
        $.powerupTimers[4] -= $.dt;
    } else {
        $.hero.weapon.bullet.piercing = 0;
    }
};

$.updateLevel = function () {
    if ($.level.kills >= $.level.killsToLevel) {
        if ($.level.current + 1 < $.levelCount) {
            $.level.current++;
            $.level.kills = 0;
            $.level.killsToLevel = $.definitions.levels[$.level.current].killsToLevel;
            $.level.distribution = $.definitions.levels[$.level.current].distribution;
            $.level.distributionCount = $.level.distribution.length;
        } else {
            $.level.current++;
            $.level.kills = 0;
        }
        $.levelDiffOffset = $.level.current + 1 - $.levelCount;
        $.levelPops.push(new $.LevelPop({
            level: $.level.current + 1
        }));
    }
};
$.updateDelta = function () {
    var now = Date.now();
    $.dt = (now - $.lt) / (1000 / 60);
    $.dt = ( $.dt < 0 ) ? 0.001 : $.dt;
    $.dt = ( $.dt > 10 ) ? 10 : $.dt;
    $.lt = now;
    $.elapsed += $.dt;
};
$.spawnPowerUp = function (x, y) {
    if (Math.random() < 0.1) {
        var min = ($.hero.life < 0.9) ? 0 : 1,
            type = Math.floor(($.util.rand(min, $.definitions.powerups.length))),
            params = $.definitions.powerups[type];
        params.type = type;
        params.x = x;
        params.y = y;
        $.powerups.push(new $.Powerup(params))
    }
};
/**
 * states
 */
$.setState = function (state) {
    var menuButton,
        playButton,
        clearButton,
        statsButton;
    $.buttons.length = 0;
    /**
     * MEnu
     */
    if (state == 'menu') {
        $.mouse.down = 0;
        $.mouse.ax = 0;
        $.mouse.ay = 0;

        $.reset();

        playButton = new $.Button({
            x: $.cw / 2 + 1,
            y: $.ch / 2 - 24,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'PLAY',
            action: function () {
                $.reset();
                $.audio.play('levelup');
                $.setState('play');
            }
        });
        $.buttons.push(playButton);

        statsButton = new $.Button({
            x: $.cw / 2 + 1,
            y: playButton.ey + 25,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'STATS',
            action: function () {
                $.setState('stats');
            }
        });
        $.buttons.push(statsButton);
    }
    /**
     * Stats
     */
    if (state == 'stats') {
        $.mouse.down = 0;

        clearButton = new $.Button({
            x: $.cw / 2 + 1,
            y: 426,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'CLEAR DATA',
            action: function () {
                $.mouse.down = 0;
                if (window.confirm('Are you sure you want to clear all locally stored game data? This cannot be undone.')) {
                    $.clearStorage();
                    $.mouse.down = 0;
                }
            }
        });
        $.buttons.push(clearButton);

        menuButton = new $.Button({
            x: $.cw / 2 + 1,
            y: clearButton.ey + 25,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'MENU',
            action: function () {
                $.setState('menu');
            }
        });
        $.buttons.push(menuButton);
    }
    /**
     * Pause
     */
    if (state == 'pause') {
        $.mouse.down = 0;
        $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
        resumeButton = new $.Button({
            x: $.cw / 2 + 1,
            y: $.ch / 2 + 26,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'RESUME',
            action: function () {
                $.lt = Date.now() + 1000;
                $.setState('play');
            }
        });
        $.buttons.push(resumeButton);

        menuButton = new $.Button({
            x: $.cw / 2 + 1,
            y: resumeButton.ey + 25,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'MENU',
            action: function () {
                $.mouse.down = 0;
                if (window.confirm('Are you sure you want to end this game and return to the menu?')) {
                    $.mousescreen();
                    $.setState('menu');
                }
            }
        });
        $.buttons.push(menuButton);
    }
    /**
     * Game Over
     */
    if (state == 'gameover') {
        $.mouse.down = 0;

        $.screenshot = $.ctxmg.getImageData(0, 0, $.cw, $.ch);
        var resumeButton = new $.Button({
            x: $.cw / 2 + 1,
            y: 426,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'PLAY AGAIN',
            action: function () {
                $.reset();
                $.audio.play('levelup');
                $.setState('play');
            }
        });
        $.buttons.push(resumeButton);

        menuButton = new $.Button({
            x: $.cw / 2 + 1,
            y: resumeButton.ey + 25,
            lockedWidth: 299,
            lockedHeight: 49,
            scale: 3,
            title: 'MENU',
            action: function () {
                $.setState('menu');
            }
        });
        $.buttons.push(menuButton);

        $.storage['score'] = Math.max($.storage['score'], $.score);
        $.storage['level'] = Math.max($.storage['level'], $.level.current);
        $.storage['rounds'] += 1;
        $.storage['kills'] += $.kills;
        $.storage['bullets'] += $.bulletsFired;
        $.storage['powerups'] += $.powerupsCollected;
        $.storage['time'] += Math.floor($.elapsed);
        $.updateStorage();
    }

    $.state = state;
};

$.setupStates = function () {
    /**
     * Menu
     */
    $.states['menu'] = function () {
        $.clearScreen();
        $.updateScreen();

        var i = $.buttons.length;
        while (i--) {
            $.buttons[i].update(i)
        }
        i = $.buttons.length;
        while (i--) {
            $.buttons[i].render(i)
        }
    };
    /**
     * Stats
     */
    $.states['stats'] = function () {
        $.clearScreen();

        $.ctxmg.beginPath();
        var statsTitle = $.text({
            ctx: $.ctxmg,
            x: $.cw / 2,
            y: 150,
            text: 'STATS',
            hspacing: 3,
            vspacing: 1,
            halign: 'center',
            valign: 'bottom',
            scale: 10,
            snap: 1,
            render: 1
        });
        var gradient = $.ctxmg.createLinearGradient(statsTitle.sx, statsTitle.sy, statsTitle.sx, statsTitle.ey);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#999');
        $.ctxmg.fillStyle = gradient;
        $.ctxmg.fill();

        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 - 10,
            y: statsTitle.ey + 39,
            text: 'BEST SCORE\nBEST LEVEL\nROUNDS PLAYED\nENEMIES KILLED\nBULLETS FIRED\nPOWERUPS COLLECTED\nTIME ELAPSED',
            hspacing: 1,
            vspacing: 17,
            halign: 'right',
            valign: 'top',
            scale: 2,
            snap: 1,
            render: 1
        });
        $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
        $.ctxmg.fill();

        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 + 10,
            y: statsTitle.ey + 39,
            text: $.util.commas($.storage['score']) + '\n' +
            ( $.storage['level'] + 1 ) + '\n' +
            $.util.commas($.storage['rounds']) + '\n' +
            $.util.commas($.storage['kills']) + '\n' +
            $.util.commas($.storage['bullets']) + '\n' +
            $.util.commas($.storage['powerups']) + '\n' +
            $.util.convertTime(( $.storage['time'] * ( 1000 / 60 ) ) / 1000)
            ,
            hspacing: 1,
            vspacing: 17,
            halign: 'left',
            valign: 'top',
            scale: 2,
            snap: 1,
            render: 1
        });
        $.ctxmg.fillStyle = '#fff';
        $.ctxmg.fill();

        var i = $.buttons.length;
        while (i--) {
            $.buttons[i].render(i)
        }
        i = $.buttons.length;
        while (i--) {
            $.buttons[i].update(i)
        }
    };
    /**
     * Play
     */
    $.states['play'] = function () {
        $.updateDelta();
        $.updateScreen();
        $.updateLevel();
        $.updatePowerupTimers();
        $.spawnEnemies();
        $.enemyOffsetMod += ( $.slow ) ? $.dt / 3 : $.dt;

        var i = $.enemies.length;
        while (i--) {
            $.enemies[i].update(i)
        }
        i = $.explosions.length;
        while (i--) {
            $.explosions[i].update(i)
        }
        i = $.powerups.length;
        while (i--) {
            $.powerups[i].update(i)
        }
        i = $.particleEmitters.length;
        while (i--) {
            $.particleEmitters[i].update(i)
        }
        i = $.textPops.length;
        while (i--) {
            $.textPops[i].update(i)
        }
        i = $.levelPops.length;
        while (i--) {
            $.levelPops[i].update(i)
        }
        i = $.bullets.length;
        while (i--) {
            $.bullets[i].update(i)
        }
        $.hero.update();

        // render entities
        $.clearScreen();
        $.ctxmg.save();
        $.ctxmg.translate($.screen.x - $.rumble.x, $.screen.y - $.rumble.y);
        i = $.enemies.length;
        while (i--) {
            $.enemies[i].render(i)
        }
        i = $.explosions.length;
        while (i--) {
            $.explosions[i].render(i)
        }
        i = $.powerups.length;
        while (i--) {
            $.powerups[i].render(i)
        }
        i = $.particleEmitters.length;
        while (i--) {
            $.particleEmitters[i].render(i)
        }
        i = $.textPops.length;
        while (i--) {
            $.textPops[i].render(i)
        }
        i = $.bullets.length;
        while (i--) {
            $.bullets[i].render(i)
        }
        $.hero.render();
        $.ctxmg.restore();
        i = $.levelPops.length;
        while (i--) {
            $.levelPops[i].render(i)
        }
        $.renderInterface();

        if ($.hero.life <= 0) {
            var alpha = ( ( $.gameoverTick / $.gameoverTickMax ) * 0.8 );
            alpha = Math.min(1, Math.max(0, alpha));
            $.ctxmg.fillStyle = 'hsla(0, 100%, 0%, ' + alpha + ')';
            $.ctxmg.fillRect(0, 0, $.cw, $.ch);
            if ($.gameoverTick < $.gameoverTickMax) {
                $.gameoverTick += $.dt;
            } else {
                $.setState('gameover');
            }

            if (!$.gameoverExplosion) {
                $.audio.play('death');
                $.rumble.level = 25;
                $.explosions.push(new $.Explosion({
                    x: $.hero.x + $.util.rand(-10, 10),
                    y: $.hero.y + $.util.rand(-10, 10),
                    radius: 50,
                    hue: 0,
                    saturation: 0
                }));
                $.particleEmitters.push(new $.ParticleEmitter({
                    x: $.hero.x,
                    y: $.hero.y,
                    count: 45,
                    spawnRange: 10,
                    friction: 0.95,
                    minSpeed: 2,
                    maxSpeed: 20,
                    minDirection: 0,
                    maxDirection: $.twopi,
                    hue: 0,
                    saturation: 0
                }));
                for (var i = 0; i < $.powerupTimers.length; i++) {
                    $.powerupTimers[i] = 0;
                }
                $.gameoverExplosion = 1;
            }
        }
        $.tick += $.dt;
        if ($.keys.pressed.p) {
            $.setState('pause');
        }
        if ($.keys.pressed.f) {
            $.autofire = !$.autofire;
            $.storage['autofire'] = $.autofire;
            $.updateStorage();
        }
    };
    /**
     * Pause
     */
    $.states['pause'] = function () {
        $.clearScreen();
        $.ctxmg.putImageData($.screenshot, 0, 0);

        $.ctxmg.fillStyle = 'hsla(0, 0%, 0%, 0.4)';
        $.ctxmg.fillRect(0, 0, $.cw, $.ch);

        $.ctxmg.beginPath();
        var pauseText = $.text({
            ctx: $.ctxmg,
            x: $.cw / 2,
            y: $.ch / 2 - 50,
            text: 'PAUSED',
            hspacing: 3,
            vspacing: 1,
            halign: 'center',
            valign: 'bottom',
            scale: 10,
            snap: 1,
            render: 1
        });
        var gradient = $.ctxmg.createLinearGradient(pauseText.sx, pauseText.sy, pauseText.sx, pauseText.ey);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#999');
        $.ctxmg.fillStyle = gradient;
        $.ctxmg.fill();

        var i = $.buttons.length;
        while (i--) {
            $.buttons[i].render(i)
        }
        i = $.buttons.length;
        while (i--) {
            $.buttons[i].update(i)
        }

        if ($.keys.pressed.p) {
            $.setState('play');
        }
    };
    /**
     * Game Over
     */

    $.states['gameover'] = function () {
        $.clearScreen();
        $.ctxmg.putImageData($.screenshot, 0, 0);

        var i = $.buttons.length;
        while (i--) {
            $.buttons[i].update(i)
        }
        i = $.buttons.length;
        while (i--) {
            $.buttons[i].render(i)
        }

        $.ctxmg.beginPath();
        var gameoverTitle = $.text({
            ctx: $.ctxmg,
            x: $.cw / 2,
            y: 150,
            text: 'GAME OVER',
            hspacing: 3,
            vspacing: 1,
            halign: 'center',
            valign: 'bottom',
            scale: 10,
            snap: 1,
            render: 1
        });
        var gradient = $.ctxmg.createLinearGradient(gameoverTitle.sx, gameoverTitle.sy, gameoverTitle.sx, gameoverTitle.ey);
        gradient.addColorStop(0, '#f22');
        gradient.addColorStop(1, '#b00');
        $.ctxmg.fillStyle = gradient;
        $.ctxmg.fill();

        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 - 10,
            y: gameoverTitle.ey + 51,
            text: 'SCORE\nLEVEL\nKILLS\nBULLETS\nPOWERUPS\nTIME',
            hspacing: 1,
            vspacing: 17,
            halign: 'right',
            valign: 'top',
            scale: 2,
            snap: 1,
            render: 1
        });
        $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
        $.ctxmg.fill();

        $.ctxmg.beginPath();
        $.text({
            ctx: $.ctxmg,
            x: $.cw / 2 + 10,
            y: gameoverTitle.ey + 51,
            text: $.util.commas($.score) + '\n' +
            ( $.level.current + 1 ) + '\n' +
            $.util.commas($.kills) + '\n' +
            $.util.commas($.bulletsFired) + '\n' +
            $.util.commas($.powerupsCollected) + '\n' +
            $.util.convertTime(( $.elapsed * ( 1000 / 60 ) ) / 1000)
            ,
            hspacing: 1,
            vspacing: 17,
            halign: 'left',
            valign: 'top',
            scale: 2,
            snap: 1,
            render: 1
        });
        $.ctxmg.fillStyle = '#fff';
        $.ctxmg.fill();
    };
};

/**
 * Start game on load
 */
window.addEventListener('load', function () {
    document.documentElement.className += ' loaded';
    $.init();
});