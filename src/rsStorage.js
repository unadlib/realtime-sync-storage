//     rsStorage.js 1.0.0
//     https://unadlib.github.io
//     (c) 2016 unadlib, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function (global, doc, factory) {

    factory = factory(global, doc);

    if (typeof global.define === 'function' && (define.amd || define.cmd)) {

        define(function () {

            return factory

        })

    } else {

        global.rsStorage = global.rsStorage || factory
    }

})(window || this, document, function (global, doc) {

    'use strict';

    var rsStorage;

    rsStorage = function (setting,before,after) {

        var frame = doc.createElement('iframe'),

            setting = setting || {},

            config = {

                interval: setting.interval || 0,

                orgin: setting.orgin || global.location.host || '*',

                cross: setting.cross || '*'

            },

            frameScript = function () {

                var sendLocalStorage = function (lS) {

                    var data = {},

                        subDoc = document,

                        receiveLocalStorage = subDoc.createElement('iframe'),

                        oldDom = subDoc.getElementById('receiveLocalStorage');

                    for (var i in lS) {

                        if (typeof lS[i] === "string") data[i] = lS[i];

                    }
                    if (oldDom){

                         oldDom.contentWindow.postMessage(data, '*');

                        return after && after();

                    };

                    receiveLocalStorage.id = 'receiveLocalStorage';

                    receiveLocalStorage.src = url;

                    receiveLocalStorage.onload = function () {

                        receiveLocalStorage.contentWindow.postMessage(data, '*');

                        return after && after();

                    };

                    subDoc.body.appendChild(receiveLocalStorage);

                };

                window.addEventListener('storage', function (e) {

                    before && before(e);

                    sendLocalStorage(window.localStorage);

                });
            };

        frame.style.display = 'none';

        frame.src = 'about:blank';

        doc.body.appendChild(frame);

        var dom = frame.contentDocument;

        dom.write("<script>var url='" + syncUrl + "';(" + frameScript.toString() + ")();</script>");

        dom.close();
    };

    return rsStorage;

});