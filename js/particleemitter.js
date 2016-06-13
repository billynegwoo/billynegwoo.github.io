/**
 * Init
 */
$.ParticleEmitter = function (opt) {
    for ( var k in opt){
        this[k] = opt[k];
    }
    this.particles = [];
    for(var  i =0 ; i < this.count;i++ ){
        var radius = Math.sqrt(Math.random()) * this.spawnRange,
            angle = Math.random() * $.twopi,
            x = this.x + Math.cos(angle) * radius,
            y = this.y + Math.sin(angle) * radius;
        this.particles.push(new  $.Particle({
            parent : this.particles,
            x:x,
            y:y,
            speed:$.util.rand(this.minSpeed , this.maxSpeed),
            friction : this.friction,
            direction: $.util.rand(this.minDirection, this.maxDirection),
            lineWidth: $.util.rand(0.5,1.5),
            hue : this.hue,
            saturation: this.saturation
        }))
    }
};

/**
 *Update
 */
$.ParticleEmitter.prototype.update = function (i) {
    var j = this.particles.length;
    while (j--){
        this.particles[j].update(j)
    }
    if(this.particles.length <= 0){
        $.particleEmitters.splice(i,1);
    }
};
/**
 *Render
 */
$.ParticleEmitter.prototype.render = function () {
  var i = this.particles.length;
    while (i--){
        this.particles[i].render(i)
    }
};