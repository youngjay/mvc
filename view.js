var bindingProvider = require('./binding-provider');
var slice = [].slice;

var View = function(controller, container) {
    EventEmitter.call(this);

    var self = this;

    ['init', 'update', 'backfill', 'dispose'].forEach(function(name) {
        var methodName = 'on' + name.charAt(0).toUpperCase() + name.slice(1);
        if (self[methodName]) {
            self.subscribe(name, function() {
                self[methodName](controller, container);
            });
        }
    });

    this.subscribe('dispose', function() {
        container.innerHTML = '';
    });

    container.innerHTML = this.html;
    this.init();
};

inherit(View, EventEmitter);

_.extend(View.prototype, {

    html: '',

    init: function() {
        this.notify('init');
    },

    update: function() {
        this.notify('update');
    },

    backfill: function() {
        this.notify('backfill');
    },

    bind: function(container, configs) {
        var self = this;

        var subscribeUpdate = function(fn) {
            self.subscribe('update', fn);
        };

        var subscribeBackfill = function(fn) {
            self.subscribe('backfill', fn);
        };

        var subscribeDispose = function(fn) {
            self.subscribe('dispose', fn);
        };

        Object.keys(configs).forEach(function(selector) {
            var config = configs[selector];
            slice.call(container.querySelectorAll(selector)).forEach(function(element) {
                Object.keys(config).forEach(function(value, name) {
                    bindingProvider.bind(name, element, value, subscribeUpdate, subscribeBackfill, subscribeDispose);
                }
            });
        });
    },

    dispose: function() {
        this.notify('dispose');
        EventEmitter.prototype.dispose.call(this);
    }
});



module.exports = View;