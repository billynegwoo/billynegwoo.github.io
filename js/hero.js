/**
 * Init
 */
$.Hero = function () {
    this.x = $.ww / 2;
    this.y = $.wh / 2;
    this.vx = 0;
    this.vy = 0;
    this.vmax = 4;
    this.direction = 0;
    this.accel = 0.5;
    this.radius = 10;
    this.life = 1;
    this.takingDamage = 0;
    this.weapon = {
        fireRate: 5,
        fireRateTick: 5,
        spread: 0.3,
        count: 1,
        bullet: {
            size: 15,
            lineWidth: 2,
            damage: 1,
            speed: 1,
            piercing: 0,
            strokeStyle: '#fff'
        },
        fireFlag: 0
    }

};

/**
 * Update
 */

$.Hero.prototype.update = function () {
    if (this.life > 0) {
        /**
         * Apply Forces
         */

        if ($.keys.state.up) {
            this.vy -= this.accel * $.dt;
            if (this.vy < -this.vmax) {
                this.vy = -this.vmax
            }
        } else if ($.keys.state.down) {
            this.vy += this.accel * $.dt;
            if (this.vy < this.vmax) {
                this.vy = this.vmax
            }
        }
        if ($.keys.state.left) {
            this.vx -= this.accel * $.dt;
            if (this.vx < -this.vmax) {
                this.vx = -this.vmax
            }
        } else if ($.keys.state.right) {
            this.vx += this.accel * $.dt;
            if (this.vx > this.vmax) {
                this.vx = this.vmax
            }
        }
        this.vy *= 0.9;
        this.vx *= 0.9;

        this.x += this.vx * $.dt;
        this.y += this.vy * $.dt;

        /**
         * Lock Bounds
         */
        if (this.x >= $.ww - this.radius) {
            this.x = $.ww - this.radius
        }
        if (this.x <= this.radius) {
            this.x = this.radius
        }
        if (this.y >= $.wh - this.radius) {
            this.y = $.wh - this.radius
        }
        if (this.y <= this.radius) {
            this.y = this.radius
        }
        /**
         * Update Direction
         */
        this.direction = Math.atan2($.mouse.y - this.y, $.mouse.x - this.x);
        /**
         * Fire Weapon
         */
        if (this.weapon.fireRateTick < this.weapon.fireRate) {
            this.weapon.fireRateTick += $.dt
        } else {
            if ($.autofire || (!$.autofire && $.mouse.down)) {
                $.audio.play('shoot');
                if ($.powerupTimers[2] > 0 || $.powerupTimers[3] > 0 || $.powerupTimers[4] > 0) {
                    $.audio.play('shootAlt')
                }
                this.weapon.fireRateTick = this.weapon.fireRateTick - this.weapon.fireRate;
                this.weapon.fireFlag = 6;

                if (this.weapon.count > 1) {
                    var spreadStart = -this.weapon.spread / 2;
                    var spreadStep = this.weapon.spread / (this.weapon.count - 1);
                } else {
                    var spreadStart = 0;
                    var spreadStep = 0;
                }
                var gunX = this.x + Math.cos(this.direction) * (this.radius + this.weapon.bullet.size);
                var gunY = this.y + Math.sin(this.direction) * (this.radius + this.weapon.bullet.size);
                for (var i = 0; i < this.weapon.count; i++) {
                    $.bulletsFired++;
                    var color = this.weapon.bullet.strokeStyle;
                    if ($.powerupTimers[2] > 0 || $.powerupTimers[3] > 0 || $.powerupTimers[4] > 0) {
                        var colors = [];
                        if ($.powerupTimers[2] > 0) {
                            colors.push('hsl(' + $.definitions.powerups[2].hue + ',' + $.definitions.powerups[2].saturation + ',' + $.definitions.powerups[2].lightness + '%)');
                        }
                        if ($.powerupTimers[3] > 0) {
                            colors.push('hsl(' + $.definitions.powerups[3].hue + ',' + $.definitions.powerups[3].saturation + ',' + $.definitions.powerups[3].lightness + '%)');
                        }
                        if ($.powerupTimers[4] > 0) {
                            colors.push('hsl(' + $.definitions.powerups[4].hue + ',' + $.definitions.powerups[4].saturation + ',' + $.definitions.powerups[4].lightness + '%)');
                        }
                        color = colors[Math.floor($.util.rand(0, colors.length))];
                    }

                    $.bullets.push(new $.Bullet({
                        x: gunX,
                        y: gunY,
                        speed: this.weapon.bullet.speed,
                        direction: this.direction + spreadStart + i * spreadStep,
                        damage: this.weapon.bullet.damage,
                        size: this.weapon.bullet.size,
                        lineWidth: this.weapon.bullet.lineWidth,
                        strokeStyle: color,
                        piercing: this.weapon.bullet.piercing
                    }))

                }
            }
        }
        this.takingDamage = 0;
        var ei = $.enemies.length;
        while (ei--) {
            var enemy = $.enemies[ei];
            if (enemy.inView && $.util.distance(this.x, this.y, enemy.x, enemy.y) <= this.radius + enemy.radius) {
                $.particleEmitters.push(new $.ParticleEmitter({
                    x: this.x,
                    y: this.y,
                    count: 2,
                    spawnRange: 0,
                    friction: 0.85,
                    minSpeed: 2,
                    maxSpeed: 15,
                    minDirection: 0,
                    maxDirection: $.twopi,
                    hue: 0,
                    saturation: 0
                }));
                this.takingDamage = 1;
                this.life -= 0.0075;
                $.rumble.level = 3;
                if (Math.floor($.tick) % 5 == 0) {
                    $.audio.play('takingDamage');
                }
            }
        }
    }
};
/**
 * render
 */
$.Hero.prototype.render = function () {
    var fillStyle;
    if (this.life > 0) {
        if (this.takingDamage) {
            fillStyle = 'hsla(0, 0%, ' + $.util.rand(0, 100) + '%, 1)';
            $.ctxmg.fillStyle = 'hsla(0, 0%, ' + $.util.rand(0, 100) + '%, ' + $.util.rand(0.01, 0.15) + ')';
            $.ctxmg.fillRect(-$.screen.x, -$.screen.y, $.cw, $.ch);
        } else {
            fillStyle = this.fillStyle;
        }
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius, this.fillStyle);
        $.util.strokeCircle($.ctxmg, this.x, this.y, this.radius - 0.5, this.strokeStyle, 1);
        $.ctxmg.strokeStyle = this.strokeStyle;
        $.ctxmg.lineWidth = 4;
        $.ctxmg.stroke();
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius - 3, fillStyle);
    }
};