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

        try{
            //the site's Synchronization URL of receive source must be set
            typeof setting.url === "string";

        }catch(e){

            return console.error("The config of rsStorage has not been set or its setting is invalid.");

        }

        var frame = doc.createElement('iframe'),

            setting = setting || {},

            getOrigin = function(){
                var a = document.createElement('a');
                a.href = setting.url;
                return a.origin;
            },

            config = {
                //the site's Synchronization URL of receive source
                url: setting.url,
                //Sync field, not set to all sync
                sync: setting.sync,
                //Synchronization delay
                delay: setting.delay !== void 0 &&  setting.delay !== null ? setting.delay : 0,
                //Synchronous reception source
                origin: getOrigin(),
                //Synchronous send source
                source: global.location.origin,

            },

            frameScript = function (config) {

                var subDoc = document,

                    syncTimer,

                    postMessage = function (w, lS, removeKey) {

                        before && before();

                        var data = {},

                            transmit = function(){
                                //postMessage to otherSite
                                w.postMessage({localStorage:data,sync:config.sync,removeKey:removeKey,origin:config.source}, config.origin);

                                return after && after();

                            };

                        for (var i in lS) {

                            if (typeof lS[i] === "string") data[i] = lS[i];

                        }


                        if(config.delay === false){

                            transmit();

                        }else{

                            setTimeout(transmit, config.delay);

                        }

                    },

                    sendLocalStorage = function (lS,removeKey) {
                        //Function throttling but removeItem key will be
                        //syncTimer && clearTimeout(syncTimer);
                        //
                        //syncTimer = setTimeout(function(){
                        //
                        //    postMessage(subDoc.getElementById('receiveLocalStorage').contentWindow, lS);
                        //
                        //},0);
                        postMessage(subDoc.getElementById('receiveLocalStorage').contentWindow, lS,removeKey);


                    },

                    init = function(lS){

                        var receiveLocalStorage = subDoc.createElement('iframe');

                        receiveLocalStorage.id = 'receiveLocalStorage';

                        receiveLocalStorage.src = config.url;

                        receiveLocalStorage.onload = function () {

                            postMessage(receiveLocalStorage.contentWindow, lS);


                        };
                        //Wait for blank page rendering to complete
                        setTimeout(function(){

                            subDoc.body.appendChild(receiveLocalStorage);

                        },0);

                    };

                window.addEventListener('storage', function (e) {

                    sendLocalStorage(window.localStorage,e.newValue===null?e.key:void 0);


                });

                init(window.localStorage);

            };

        frame.style.display = 'none';

        frame.src = 'about:blank';

        doc.body.appendChild(frame);

        var dom = frame.contentDocument;

        dom.write(['<script>var after =',after,',before =',before,';(',frameScript.toString(),')(',JSON.stringify(config),');</script>'].join(''));

        dom.close();

    };

    return rsStorage;

});