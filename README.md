# realtime-sync-storage

## Supported
* IE(8+)
## Install
#### [Bower](http://bower.io/search/?q=rsstorage)
```
bower install rsstorage
```

#### [npm](https://www.npmjs.com/package/rsstorage)
```
npm install rsstorage --save
```
Usage
=====

### Require ngStorage and Inject the Services

```javascript

rsStorage(
    {
        //the site's Synchronization URL of receive source
        url:"http://othersite.com/src/otherSite/syncStorage.html",
        //Synchronization delay
        delay:1000,
        //Sync field, not set to all sync
        sync:['testA']
    },function(){
        //do something before each synchronization.
    },function(){
        //do something after each synchronization.
    }
);

```
## License
This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).