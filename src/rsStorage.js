//     rsStorage.js 0.0.1
//     https://unadlib.github.io
//     (c) 2016 unadlib, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function (global, doc, factory) {

    'use strict';
    //support AMD/CMD
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

    /**
     *
     * @param setting type object rsStorage configuration
     * @param before type function before each synchronization
     * @param after type function after each synchronization
     */

    rsStorage = function (setting, before, after) {

        try {
            //the site's Synchronization URL of slave source must be set
            typeof setting.url === "string";

        } catch (e) {

            return console.error("The config of rsStorage has not been set or its setting is invalid.");

        }

        var getIsEffectArray = function (d) {

                return Object.prototype.toString.call(d) === "[object Array]" && d.length > 0

            },

            frame = doc.createElement('iframe'),

            setting = setting || {},

            getOrigin = function () {

                var url = setting.url,

                    urls = [],

                    getData = function (url) {

                        var a = document.createElement('a');

                        a.href = url;

                        return a.origin;
                    }

                if (getIsEffectArray(url)) {

                    for (var i = 0, j = url.length; i < j; i++) {

                        urls.push(getData(url[i]));

                    }

                    return urls;

                }

                return getData(url);
            },

            config = {
                //the site's Synchronization URL of slave source
                url: setting.url,
                //Sync field, not set to all sync
                sync: setting.sync,
                //Synchronization delay
                delay: ( setting.delay !== void 0 && setting.delay !== null ) || setting.delay === false ? setting.delay : 0,
                //Whether bidirectional synchronization
                mutual: setting.mutual !== void 0 && setting.mutual !== null ? true : false,
                //Synchronous slave source
                origin: getOrigin(),
                //Synchronous master source
                source: global.location.origin,

            },

            lS = window.localStorage,

            isLimitKey = getIsEffectArray(config.sync),

            frameScript = function (config) {

                var subDoc = document,

                    lS = window.localStorage,

                    isMultiple = Object.prototype.toString.call(config.url) === "[object Array]" && config.url.length > 0,

                    //syncTimer,

                    postMessage = function (w, lS, config, removeKey) {

                        before && before();

                        var data = {},

                            transmit = function () {
                                //postMessage to otherSite
                                w.postMessage({

                                    localStorage: data,

                                    sync: config.sync,

                                    removeKey: removeKey,

                                    origin: config.source,

                                    mutual: config.mutual

                                }, config.origin);

                                return after && after();

                            };

                        for (var i in lS) {

                            if (typeof lS[i] === "string") data[i] = lS[i];

                        }


                        if (config.delay === false) {

                            transmit();

                        } else {

                            setTimeout(transmit, config.delay);

                        }

                    },

                    sendLocalStorage = function (lS, removeKey) {
                        //Function throttling but removeItem key will be
                        //syncTimer && clearTimeout(syncTimer);
                        //
                        //syncTimer = setTimeout(function(){
                        //
                        //    postMessage(subDoc.getElementById('receiveLocalStorage').contentWindow, lS);
                        //
                        //},0);

                        if (isMultiple) {

                            return mapUrls(config, function (conf, i) {

                                postMessage(subDoc.getElementById('receiveLocalStorage' + i).contentWindow, lS, conf, removeKey);

                            });

                        }

                        postMessage(subDoc.getElementById('receiveLocalStorage').contentWindow, lS, config, removeKey);


                    },

                    mapUrls = function (config, fn) {

                        for (var i = 0, url = config.url, j = url.length; i < j; i++) {

                            var conf = JSON.parse(JSON.stringify(config));

                            conf.url = url[i];

                            conf.origin = config.origin[i];

                            fn(conf, i);

                        }

                    }

                    callParent = function (data) {

                        window.parent.postMessage({lS: data, type: 'changeLocalStorage'}, '*');

                    },

                    receive = function (config) {

                        window.addEventListener('message', function (e) {

                            if (e.origin !== config.origin) return;

                            if (config.delay === false) {

                                callParent(e.data);

                            } else {

                                setTimeout(function () {

                                    callParent(e.data);

                                }, config.delay);

                            }


                        })

                    },

                    init = function (lS, config) {

                        var addSub = function (lS, config, i) {

                            var receiveLocalStorage = subDoc.createElement('iframe');

                            receiveLocalStorage.id = 'receiveLocalStorage' + i || '';

                            receiveLocalStorage.src = config.url;

                            receiveLocalStorage.onload = function () {

                                postMessage(receiveLocalStorage.contentWindow, lS, config);
                                //receive slave site data
                                receive(config);


                            };
                            //Wait for blank page rendering to complete
                            setTimeout(function () {

                                subDoc.body.appendChild(receiveLocalStorage);

                            }, 0);

                        };


                        if (isMultiple) {

                            return mapUrls(config, function (conf, i) {

                                addSub(lS, conf, i);

                            });

                        }

                        addSub(lS, config);

                    };
                //Monitor changes
                window.addEventListener('storage', function (e) {

                    sendLocalStorage(lS, e.newValue === null ? e.key : void 0);


                });

                init(lS, config);

            },

            Listener = function () {

                window.addEventListener('message', function (e) {

                    if (e.origin !== global.location.origin || e.data && e.data.type !== 'changeLocalStorage') return;

                    changeLocalStorage(e.data.lS);

                })

            },

            changeLocalStorage = function (data) {

                for (var i in data) {

                    if (isLimitKey && config.sync.indexOf(i) === -1) continue;

                    if (data[i] === null) {

                        lS.removeItem(i)

                    } else {

                        lS[i] = data[i]

                    }

                }

            };

        frame.style.display = 'none';

        frame.src = 'about:blank';

        doc.body.appendChild(frame);

        var dom = frame.contentDocument;

        dom.write(['<script>var after =', after, ',before =', before, ';(', frameScript.toString(), ')(', JSON.stringify(config), ');</script>'].join(''));

        dom.close();

        config.mutual && Listener();

    };

    return rsStorage;

});