# realtime-sync-storage
Cross-origin local storage realtime synchronizing.
## Supported
* IE(8+)
* multi-site

## Install
#### [Bower](http://bower.io/search/?q=realtime-sync-storage)
```
bower install realtime-sync-storage --save
```

#### [npm](https://www.npmjs.com/package/realtime-sync-storage)
```
npm install realtime-sync-storage --save
```
Usage
=====

* master source use

```javascript

rsStorage(
    {
        //Single site is string, multi-site is array,the site's Synchronization URL of slave source(type String or Array)
        url:"http://othersite.com/src/otherSite/syncStorage.html",
        //Synchronization delay(type Number or Boolean),default:false
        delay:1000,
        //Whether bidirectional synchronization,default:false
        mutual:true,
        //Sync field, not set to all sync
        sync:['testA']
    },function(){
        //do something before each synchronization.
    },function(){
        //do something after each synchronization.
    }
);

```
* slave source add 'src/otherSite/syncStorage.html' file.

## License
This project is licensed under the [MIT license](http://opensource.org/licenses/MIT).