var ControllerBase = require('./controller');
var ViewBase = require('./view');

var Controller = function(container) {
    this.view = View.create(this, container);
    ControllerBase.call(this);
};

inherit(Controller, ControllerBase);

_.extend(Controller.prototype, {
    onInit: function() {
        var self = this;
        this.model = registry.model.get('deal');

        this.model.subscribe('update', function(from) {
            if (from !== self) {
                self.view.update();
            }
        });
    },

    submit: function() {
        this.view.backfill();
        this.model.put();
    }
});

var View = function() {
    ViewBase.call(this);    
};

inherit(View, ViewBase);

_.extend(View.prototype, {
    onInit: function(controller, container) {
        var model = controller.model;

        this.bind(container, {
            'form': {
                event: {
                    submit: function() {
                        controller.submit();
                    }
                }
            },

            'input[name=name]': {
                value: [model, 'name']
            },

            'input[name=password]': {
                value: [model, 'password']
            }
        });
    },

    html: '<form><input name="name"/><input name="password"/><button type="submit">submit</button></form>'
});

module.exports = Controller;