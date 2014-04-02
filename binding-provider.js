var bindingProvider = {
    bind: function(name, element, value, onUpdate, onBackfill) {
        var handler = this['@' + name];
        if (!handler) {
            throw new Error('TODO');
        }
        handler(element, value, onUpdate, onBackfill))
    },

    '@value': function(element, value, onUpdate, onBackfill) {
        var target = value[0], property = value[1];
        
        onUpdate(function() {
            element.value = target[property];
        });

        onBackfill(function() {
            target[property] = element.value;
        });
    },

    '@event': function(element, value, onUpdate, onBackfill, onDispose) {
        Object.keys(value).forEach(function(event) {
            element.addEventLister(event, value[event]);
            onDispose(function() {
                element.removeEventLister(event, value[event]);
            });
        });
    },
};

module.exports = bindingProvider;