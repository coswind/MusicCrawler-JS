/*
Created on Ocboter 16, 2012

@author: Yi
*/

;(function() {

/**
 * Module exports.
 *//**
 * Check if `obj` is an array.
 */
function isArray(obj){return"[object Array]"=={}.toString.call(obj)}function EventEmitter(){}EventEmitter.prototype.on=function(name,fn){return this.$events||(this.$events={}),this.$events[name]?isArray(this.$events[name])?this.$events[name].push(fn):this.$events[name]=[this.$events[name],fn]:this.$events[name]=fn,this},EventEmitter.prototype.addListener=EventEmitter.prototype.on,EventEmitter.prototype.once=function(name,fn){var self=this;function on(){self.removeListener(name,on),fn.apply(this,arguments)}return on.listener=fn,this.on(name,on),this},EventEmitter.prototype.removeListener=function(name,fn){if(this.$events&&this.$events[name]){var list=this.$events[name];if(isArray(list)){var pos=-1;for(var i=0,l=list.length;i<l;i++)if(list[i]===fn||list[i].listener&&list[i].listener===fn){pos=i;break}if(pos<0)return this;list.splice(pos,1),list.length||delete this.$events[name]}else(list===fn||list.listener&&list.listener===fn)&&delete this.$events[name]}return this},EventEmitter.prototype.removeAllListeners=function(name){return name===undefined?(this.$events={},this):(this.$events&&this.$events[name]&&(this.$events[name]=null),this)},EventEmitter.prototype.listeners=function(name){return this.$events||(this.$events={}),this.$events[name]||(this.$events[name]=[]),isArray(this.$events[name])||(this.$events[name]=[this.$events[name]]),this.$events[name]},EventEmitter.prototype.emit=function(name){if(!this.$events)return!1;var handler=this.$events[name];if(!handler)return!1;var args=[].slice.call(arguments,1);if("function"==typeof handler)handler.apply(this,args);else{if(!isArray(handler))return!1;var listeners=handler.slice();for(var i=0,l=listeners.length;i<l;i++)listeners[i].apply(this,args)}return!0},function(){var Emitter="undefined"==typeof exports?EventEmitter:require("emitter");function noop(){}function getXHR(){if(window.XMLHttpRequest&&("file:"!=window.location.protocol||!window.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}return!1}var trim="".trim?function(s){return s.trim()}:function(s){return s.replace(/(^\s*|\s*$)/g,"")};function isFunction(obj){return"function"==typeof obj}function isObject(obj){return null!=obj&&"object"==typeof obj}function serialize(obj){if(!isObject(obj))return obj;var pairs=[];for(var key in obj)pairs.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]));return pairs.join("&")}request.serializeObject=serialize;function parseString(str){var obj={},pairs=str.split("&"),parts,pair;for(var i=0,len=pairs.length;i<len;++i)pair=pairs[i],parts=pair.split("="),obj[decodeURIComponent(parts[0])]=decodeURIComponent(parts[1]);return obj}request.parseString=parseString,request.types={html:"text/html",json:"application/json",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},request.serialize={"application/x-www-form-urlencoded":serialize,"application/json":JSON.stringify},request.parse={"application/x-www-form-urlencoded":parseString,"application/json":JSON.parse};function parseHeader(str){var lines=str.split(/\r?\n/),fields={},index,line,field,val;lines.pop();for(var i=0,len=lines.length;i<len;++i)line=lines[i],index=line.indexOf(":"),field=line.slice(0,index).toLowerCase(),val=trim(line.slice(index+1)),fields[field]=val;return fields}function type(str){return str.split(/ *; */).shift()}function params(str){return str.split(/ *; */).reduce(function(obj,str){var parts=str.split(/ *= */),key=parts.shift(),val=parts.shift();return key&&val&&(obj[key]=val),obj},{})}function Response(xhr,options){options=options||{},this.xhr=xhr,this.text=xhr.responseText,this.setStatusProperties(xhr.status),this.header=parseHeader(xhr.getAllResponseHeaders()),this.setHeaderProperties(this.header),this.body=this.parseBody(this.text)}Response.prototype.setHeaderProperties=function(header){var ct=this.header["content-type"]||"";this.type=type(ct);var obj=params(ct);for(var key in obj)this[key]=obj[key]},Response.prototype.parseBody=function(str){var parse=request.parse[this.type];return parse?parse(str):null},Response.prototype.setStatusProperties=function(status){var type=status/100|0;this.status=status,this.statusType=type,this.info=1==type,this.ok=2==type,this.clientError=4==type,this.serverError=5==type,this.error=4==type||5==type,this.accepted=202==status,this.noContent=204==status||1223==status,this.badRequest=400==status,this.unauthorized=401==status,this.notAcceptable=406==status,this.notFound=404==status},request.Response=Response;function Request(method,url){var self=this;Emitter.call(this),this.method=method,this.url=url,this.header={},this.set("X-Requested-With","XMLHttpRequest"),this.on("end",function(){self.callback(new Response(self.xhr))})}Request.prototype=new Emitter,Request.prototype.constructor=Request,Request.prototype.set=function(field,val){if(isObject(field)){for(var key in field)this.set(key,field[key]);return this}return this.header[field.toLowerCase()]=val,this},Request.prototype.type=function(type){return this.set("Content-Type",request.types[type]||type),this},Request.prototype.query=function(obj){this._query=this._query||{};for(var key in obj)this._query[key]=obj[key];return this},Request.prototype.send=function(data){if("GET"==this.method)return this.query(data);var obj=isObject(data),type=this.header["content-type"];if(obj&&isObject(this._data))for(var key in data)this._data[key]=data[key];else"string"==typeof data?(type||this.type("form"),type=this.header["content-type"],"application/x-www-form-urlencoded"==type?this._data=this._data?this._data+"&"+data:data:this._data=(this._data||"")+data):this._data=data;return obj?(type||this.type("json"),this):this},Request.prototype.end=function(fn){var self=this,xhr=this.xhr=getXHR(),query=this._query,data=this._data;this.callback=fn||noop,xhr.onreadystatechange=function(){4==xhr.readyState&&self.emit("end")},query&&(query=request.serializeObject(query),this.url+=~this.url.indexOf("?")?"&"+query:"?"+query),xhr.open(this.method,this.url,!0);if("GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof data){var serialize=request.serialize[this.header["content-type"]];serialize&&(data=serialize(data))}for(var field in this.header)xhr.setRequestHeader(field,this.header[field]);return xhr.send(data),this},request.Request=Request;function request(method,url){return"function"==typeof url?(new Request("GET",method)).end(url):1==arguments.length?new Request("GET",method):new Request(method,url)}request.get=function(url,data,fn){var req=request("GET",url);return isFunction(data)&&(fn=data,data=null),data&&req.send(data),fn&&req.end(fn),req},request.head=function(url,data,fn){var req=request("HEAD",url);return isFunction(data)&&(fn=data,data=null),data&&req.send(data),fn&&req.end(fn),req},request.del=function(url,fn){var req=request("DELETE",url);return fn&&req.end(fn),req},request.patch=function(url,data,fn){var req=request("PATCH",url);return data&&req.send(data),fn&&req.end(fn),req},request.post=function(url,data,fn){var req=request("POST",url);return data&&req.send(data),fn&&req.end(fn),req},request.put=function(url,data,fn){var req=request("PUT",url);return data&&req.send(data),fn&&req.end(fn),req},"undefined"==typeof exports?window.request=window.superagent=request:module.exports=request}();

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(o,q){var l={},m=l.lib={},n=m.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),j=m.WordArray=n.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=q?e:4*a.length},toString:function(a){return(a||r).stringify(this)},concat:function(a){var e=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)e[d+b>>>2]|=(c[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<c.length)for(b=0;b<a;b+=4)e[d+b>>>2]=c[b>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=o.ceil(e/4)},clone:function(){var a=
n.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*o.random()|0);return j.create(e,a)}}),k=l.enc={},r=k.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var b=e[d>>>2]>>>24-8*(d%4)&255;c.push((b>>>4).toString(16));c.push((b&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return j.create(c,b/2)}},p=k.Latin1={stringify:function(a){for(var b=
a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return j.create(c,b)}},h=k.Utf8={stringify:function(a){try{return decodeURIComponent(escape(p.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return p.parse(unescape(encodeURIComponent(a)))}},b=m.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=j.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,f=this.blockSize,i=d/(4*f),i=a?o.ceil(i):o.max((i|0)-this._minBufferSize,0),a=i*f,d=o.min(4*a,d);if(a){for(var h=0;h<a;h+=f)this._doProcessBlock(c,h);h=c.splice(0,a);b.sigBytes-=d}return j.create(h,d)},clone:function(){var a=n.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});m.Hasher=b.extend({init:function(){this.reset()},
reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return f.HMAC.create(a,c).finalize(b)}}});var f=l.algo={};return l}(Math);
(function(o){function q(b,f,a,e,c,d,g){b=b+(f&a|~f&e)+c+g;return(b<<d|b>>>32-d)+f}function l(b,f,a,e,c,d,g){b=b+(f&e|a&~e)+c+g;return(b<<d|b>>>32-d)+f}function m(b,f,a,e,c,d,g){b=b+(f^a^e)+c+g;return(b<<d|b>>>32-d)+f}function n(b,f,a,e,c,d,g){b=b+(a^(f|~e))+c+g;return(b<<d|b>>>32-d)+f}var j=CryptoJS,k=j.lib,r=k.WordArray,k=k.Hasher,p=j.algo,h=[];(function(){for(var b=0;64>b;b++)h[b]=4294967296*o.abs(o.sin(b+1))|0})();p=p.MD5=k.extend({_doReset:function(){this._hash=r.create([1732584193,4023233417,
2562383102,271733878])},_doProcessBlock:function(b,f){for(var a=0;16>a;a++){var e=f+a,c=b[e];b[e]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360}for(var e=this._hash.words,c=e[0],d=e[1],g=e[2],i=e[3],a=0;64>a;a+=4)16>a?(c=q(c,d,g,i,b[f+a],7,h[a]),i=q(i,c,d,g,b[f+a+1],12,h[a+1]),g=q(g,i,c,d,b[f+a+2],17,h[a+2]),d=q(d,g,i,c,b[f+a+3],22,h[a+3])):32>a?(c=l(c,d,g,i,b[f+(a+1)%16],5,h[a]),i=l(i,c,d,g,b[f+(a+6)%16],9,h[a+1]),g=l(g,i,c,d,b[f+(a+11)%16],14,h[a+2]),d=l(d,g,i,c,b[f+a%16],20,h[a+3])):48>a?(c=
m(c,d,g,i,b[f+(3*a+5)%16],4,h[a]),i=m(i,c,d,g,b[f+(3*a+8)%16],11,h[a+1]),g=m(g,i,c,d,b[f+(3*a+11)%16],16,h[a+2]),d=m(d,g,i,c,b[f+(3*a+14)%16],23,h[a+3])):(c=n(c,d,g,i,b[f+3*a%16],6,h[a]),i=n(i,c,d,g,b[f+(3*a+7)%16],10,h[a+1]),g=n(g,i,c,d,b[f+(3*a+14)%16],15,h[a+2]),d=n(d,g,i,c,b[f+(3*a+5)%16],21,h[a+3]));e[0]=e[0]+c|0;e[1]=e[1]+d|0;e[2]=e[2]+g|0;e[3]=e[3]+i|0},_doFinalize:function(){var b=this._data,f=b.words,a=8*this._nDataBytes,e=8*b.sigBytes;f[e>>>5]|=128<<24-e%32;f[(e+64>>>9<<4)+14]=(a<<8|a>>>
24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(f.length+1);this._process();b=this._hash.words;for(f=0;4>f;f++)a=b[f],b[f]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});j.MD5=k._createHelper(p);j.HmacMD5=k._createHmacHelper(p)})(Math);

var N = function() {};

function qq(source_id, callback) {
    var cookie = 'qqmusic_uin=12345678; qqmusic_key=12345678; qqmusic_fromtag=30';
    var headers = { "Cookie" : cookie };
    callback = callback || N;
    request
        .get('http://s.plcloud.music.qq.com/fcgi-bin/fcg_query_song_detail_info.fcg')
        .query({
            num: 1,
            type: 3,
            source_id: source_id
        }).end(function(res) {
            var text = res.text;
            var download_urls = [];
            try {
                var songData = text.match('songdata:\"([^"]*)\"')[1].split('|');
                var song_loc = +songData[8] + 10;
                var download_url = 'http://stream' + song_loc + '.qqmusic.qq.com/' + (source_id + 30000000) + '.mp3';
                download_urls.push(download_url);
            } catch(e) {}
            console.log(download_urls);
            callback(download_urls, headers);
        });
}

function parseBaiduDownloadUrl(urlnode) {
    var url, encodeText, decodeText, download_url;
    if (urlnode.length) {
        url = urlnode[0];
        try {
            encodeText = url.getElementsByTagName('encode')[0];
            decodeText = url.getElementsByTagName('decode')[0];

            encodeText = encodeText.textContent.match("(.+/)[^/]*$")[1];
            decodeText = decodeText.textContent;

            download_url = encodeText + decodeText;
        } catch(e) {
            download_url = '';
        }
    }

    return download_url;
}

function baidu(name, artist_name, callback) {
    callback = callback || N;
    request
        .get('http://box.zhangmen.baidu.com/x?op=12&count=1&mtype=1&title=' + (name + '$$' + artist_name + '$$$$'))
        .set('Content-Type', 'text/xml')
        .end(function(res) {
            var download_urls = [];
            var xml = res.xhr.responseXML;
            download_url_small = parseBaiduDownloadUrl(xml.getElementsByTagName('url'));
            download_url = parseBaiduDownloadUrl(xml.getElementsByTagName('durl'));
            download_urls.push(download_url);
            download_urls.push(download_url_small);
            console.log(download_urls);
            callback(download_urls);
        });
}

function baiduTing(source_id, callback) {
    callback = callback || N;
    request
        .get('http://tingapi.ting.baidu.com/v1/restserver/ting')
        .query({
            method: 'baidu.ting.song.getInfo',
            format: 'json',
            songid: source_id
        }).end(function(res) {
            var text = res.text;
            var urls = [];
            try {
                var jsonData = JSON.parse(text);
                urls = jsonData.songurl.url.sort(function(a, b) {
                    return a['file_size'] > b['file_size'] ? 1 : -1;
                }).map(function(value) {
                    return value.file_link;
                });
                alert(urls);
            } catch(e) {}
            console.log(urls);
            callback(urls);
        });
}

// 递归的方式，串行的,可以替换成更好的并行方式
function get_easou_download_url(index, urls, callback) {
    if (index >= urls.length) return callback(urls);
    var url = urls[index];
    request.get(url).end(function(res) {
        download_url = res.text.match(/meta\s+http-equiv=\"refresh\"\s+content=\"[^=]*=([^"]*)\"/)[1];
        urls[index] = download_url;
        get_easou_download_url(++index, urls, callback);
    });
}

function get_sources(text) {
    var sources;
    var regs = text.match(/href=\"(\/dl.e[^"]*)\">([^<]*)</g);
    if (regs && regs.length) {
        sources = {}
        regs.forEach(function(value) {
            try {
                var a = value.match('href=\"(\/dl.e[^"]*)\">([^<]*)<');
                var b = a[2].match(/(.+)\[([0-9\.]+[KMG])-([0-9:]+)\]/);
                var quality = b[1]
                // var size = b[2]
                // var duration = b[3]
                sources[quality] = 'http://mp3.easou.com' + a[1];
            } catch(e) {}
        });
    }

    return sources;
}

function easou(source_id, callback) {
    callback = callback || N;
    request
        .get('http://mp3.easou.com/v.e?id=' + source_id)
        .end(function(res) {
            var text = res.text;
            var download_url_small, download_url;
            var results = [];
            var sources = get_sources(text);

            if (!sources) return;

            var lowToHigh = ['压缩', '普通', '高质', '保真' ];
            for (var i = 0, len = lowToHigh.length; i < len; i++) {
                download_url_small = sources[lowToHigh[i]] || '';
                if (download_url_small) break;
            };
            var hiheToLow = ['保真', '高质', '普通', '压缩'];
            for (var i = 0, len = hiheToLow.length; i < len; i++) {
                download_url = sources[hiheToLow[i]] || '';
                if (download_url) break;
            };

            /*
            *   并行方式
            */
            var finishStatus = 0;
            [download_url, download_url_small].forEach(function(value, index) {
                finishStatus++;
                request.get(value).end(function(res) {
                    finishStatus--;
                    try {
                        var url = res.text.match(/meta\s+http-equiv=\"refresh\"\s+content=\"[^=]*=([^"]*)\"/)[1];
                        results[index] = url;
                    } catch(e) {}
                    if (finishStatus == 0) {
                        console.log(results);
                        callback(results);
                    }
                });
            });

            /*
            *   串行方式
            */
            // get_easou_download_url(0, [download_url_small, download_url], function(result) {
            //     console.log(result);
            // });
        });
}

/*
*   无法获取song的playlist_id
*/
function douban(playlist_id, source_id, callback) {
    callback = callback || N;
    request
        .get('http://music.douban.com/api/artist/songs?id=' + playlist_id + '&app_name=music_artist&version=50&cb=$.setp(1.0)&_=' + +new Date)
        .end(function(res) {
            var download_url;
            var jsonData;
            try {
                jsonData = JSON.parse(res.text.match(/\$\.setp\(1\.0\)\((.*)\)/)[1]);
                jsonData.songs.forEach(function(value) {
                    if (value.id == source_id) {
                        download_url = value.src;
                        console.log(download_url);
                    }
                });
            } catch(e) {}
            callback(download_url);
        });
}

function doubanfm(channel_id, source_id, callback) {
    callback = callback || N;
    request
        .get('http://douban.fm/j/mine/playlist')
        .query({
            'type' : 's',
            'channel' : channel_id,
            'sid' : 0
        })
        .end(function(res) {
            var download_url, jsonData;
            try {
                jsonData = JSON.parse(res.text).song;
                jsonData.forEach(function(value) {
                    if (value.sid == source_id) {
                        download_url = value.url;
                    }
                });
            } catch(e) {}
            console.log(download_url);
            callback(download_url);
        });
}

function kugou(hash, callback) {
    callback = callback || N;
    var key = CryptoJS.MD5(hash + 'kgcloud');
    request
        .get('http://trackercdn.kugou.com/i/?cmd=3&key=' + key + '&hash=' + hash + '&acceptMp3=1&pid=6')
        .end(function(res) {
            var download_url, jsonData;
            try {
                jsonData = JSON.parse(res.text);
                if (jsonData.status == '1') {
                    download_url = jsonData.url;
                    console.log(download_url);
                }
            } catch(e) {}
            callback(download_url);
        });
}

function get_sinawei_url(url, callback) {
    request
        .get(url)
        .end(function(res) {
            var download_url;
            try {
                download_url = res.text.match(/iask_music_song_url=\"([^"]*)/)[1];
            } catch(e) {
                download_url = '';
            }
            callback(download_url);
        });
}

/*
*   无法设置Referer, ToDO
*/
function sinawei(source_id, callback) {
    callback = callback || N;
    request
        .get('http://ting.weibo.com/t/port/radio/ajax_get_radio_detail.php?type=songids&id=' + source_id)
        .set('Referer', 'http://ting.weibo.com/?songids=' + source_id)
        .end(function(res) {
            var url;
            try {
                url = JSON.parse(res.text).content[0].mp3_url;
            } catch(e) {
                callback();
                return
            }
            get_sinawei_url(url, function(download_url) {
                console.log(download_url);
                callback(download_url);
            });
        });
}


function kuwo_real_url(mp3path, callback) {
    request
        .get('http://player.kuwo.cn/webmusic/getfdl?purl=' + mp3path)
        .end(function(res) {
            var realpath = res.text;
            callback(realpath);
        });
}

function kuwo(source_id, callback) {
    callback = callback || N;
    request
        .get('http://player.kuwo.cn/webmusic/st/getNewMuiseByRid?rid=MUSIC_' + source_id)
        .end(function(res) {
            var download_url;
            var results = [];
            try {
                var mp3path = res.text.match(/<mp3path>([^<]*)/)[1];
                var mp3dl = res.text.match(/<mp3dl>([^<]*)/)[1];
                results.push({ path: mp3path, dl: mp3dl});
            } catch(e) {}
            try {
                var aacpath = res.text.match(/<aacpath>([^<]*)/)[1];
                var aacdl = res.text.match(/<aacdl>([^<]*)/)[1];
                results.push({ path: aacpath, dl: aacdl});
            } catch(e) {}
            var finishStatus = 0;
            results.forEach(function(value, index) {
                finishStatus++;
                kuwo_real_url(value.path, function(realpath) {
                    results[index] = 'http://' + value.dl + '/' + realpath;
                    finishStatus--;
                    if (finishStatus == 0) {
                        console.log(results);
                        callback(results);
                    }
                });
            });
        });
}

function yiting(source_id, callback) {
    callback = callback || N;
    request
        .get('http://www.1ting.com/player/00/player_' + source_id + '.html')
        .end(function(res) {
            var text = res.text;
            var download_url;
            try {
                download_url = 'http://nonie.1ting.com:9092' + JSON.parse(text.match(/YP.create\(([^)]*)/)[1])[0][7];
            } catch(e) {
                download_url = '';
            }
            console.log(download_url);
            callback(download_url);
        });
}

function getLocation(param1) {
    var _loc_10 = undefined;
    var _loc_2 = Number(param1.charAt(0));
    var _loc_3 = param1.substring(1);
    var _loc_4 = Math.floor(_loc_3.length / _loc_2);
    var _loc_5 = _loc_3.length % _loc_2;
    var _loc_6 = new Array();
    var _loc_7 = 0;
    while (_loc_7 < _loc_5) {

        if (_loc_6[_loc_7] == undefined)
        {
            _loc_6[_loc_7] = "";
        }
        _loc_6[_loc_7] = _loc_3.substr((_loc_4 + 1) * _loc_7, (_loc_4 + 1));
        _loc_7 = _loc_7 + 1;
    }
    _loc_7 = _loc_5;
    while (_loc_7 < _loc_2) {

        _loc_6[_loc_7] = _loc_3.substr(_loc_4 * (_loc_7 - _loc_5) + (_loc_4 + 1) * _loc_5, _loc_4);
        _loc_7 = _loc_7 + 1;
    }
    var _loc_8 = "";
    _loc_7 = 0;
    while (_loc_7 < _loc_6[0].length) {

        _loc_10 = 0;
        while (_loc_10 < _loc_6.length)
        {

            _loc_8 = _loc_8 + _loc_6[_loc_10].charAt(_loc_7);
            _loc_10 = _loc_10 + 1;
        }
        _loc_7 = _loc_7 + 1;
    }
    _loc_8 = unescape(_loc_8);
    var _loc_9 = "";
    _loc_7 = 0;
    while (_loc_7 < _loc_8.length) {

        if (_loc_8.charAt(_loc_7) == "^")
        {
            _loc_9 = _loc_9 + "0";
        }
        else
        {
            _loc_9 = _loc_9 + _loc_8.charAt(_loc_7);
        }
        _loc_7 = _loc_7 + 1;
    }
    _loc_9 = _loc_9.replace("+", " ");
    return _loc_9;
}

function xiami(source_id, callback) {
    callback = callback || N;
    request
        .get('http://www.xiami.com//song/playlist/id/' + source_id + '/object_name/default/object_id/0')
        .set('Content-Type', 'text/xml')
        .end(function(res) {
            var download_url;
            var xml = res.xhr.responseXML;
            try {
                var location = xml.getElementsByTagName('location')[0].textContent;
                download_url = getLocation(location);
            } catch(e) {
                download_url = '';
            }
            console.log(download_url);
            callback(download_url);
        });
}

/*

parameters:

-   source
-   source_id

-   hash (kugou)
-   playlist_id (douban)
-   song_name (baidu)
-   artist_name (baidu)

callback(download_urls = [], headers = {})

-   download_urls  音质从高到低
-   headers

*/
function download_urls(meta, callback) {

}

/*
qq = 1
myspace = 2
midomi = 3
douban = 4
doubanfm = 5
easou = 6
baidu = 7
sinawei = 8
kugou = 9
kuwo = 10
yiting = 11
xiami = 12
sogou = 13
baidump3 = 14
manual = 15
*/

var SOURCE = {
    1: 'qq',
    2: 'myspace',
    3: 'midomi',
    4: 'douban',
    5: 'doubanfm',
    6: 'easou',
    7: 'baidu',
    8: 'sinawei',
    9: 'kugou',
    10: 'kuwo',
    11: 'yiting',
    12: 'xiami',
    13: 'sogou',
    14: 'baidump3',
    15: 'manual'
};

/*
    Finished
*/
// qq(1);
// baidu('花又开好了', 'S.H.E');
// baiduTing(7278887);
// easou(4405189);
// kuwo(505175);
// yiting(171090);
// xiami(1);
// sinawei(100026292);
// kugou('e45e2eb674253acaeb0fd7a0a65cf4ff');
// douban(10812934, 292461);
// doubanfm(8, 137516);

/*
var i = 20;
while(i--) {
    qq(i);
}
*/

/*[28832683, 23162310, 28831519, 28807306, 28775614].forEach(function(value) {
    baiduTing(value);
});*/

/*[326, 973, 1016, 1023, 1111, 1145, 1341, 1343, 1474, 1475].forEach(function(value) {
    easou(value);
});*/

/*[54352, 54394, 54737, 54743, 54749, 55131, 55241, 55514, 55920, 57527].forEach(function(value) {
    kuwo(value);
});*/

/*[1449, 1456, 1463, 41567, 42509, 43133, 43476, 53000, 56713, 57357].forEach(function(value) {
    yiting(value);
});*/

/*[417, 1015, 1019, 7310, 8671, 20526, 35340, 45808, 46715, 53855].forEach(function(value) {
    xiami(value);
});*/

/*[100026292, 100026293, 100026294, 100026297, 100026345, 100026360, 100026383, 100026385, 100026387, 100026389].forEach(function(value) {
    sinawei(value);
});*/

function baiduHack(songid, callback) {
    callback = callback || N;
    request
        .get('http://music.baidu.com/song/' + songid + '/download')
        .end(function(res) {
            var text = res.text;
            window.text = text;
            var download_url = '';
            try {
                download_url = text.match(/file\?link=([^"']*)/)[1];
            } catch(e) {}
            console.log(download_url);
            callback(download_url);
        });
}

window.baiduHack = baiduHack;

})();

function relocation(songList) {
    urlJson = {
        'download_url': songList || '',
        'headers': {
            'Cookie': 'BAIDUID=5E514123879AAAF2309269742CC59630:FG=1;BAIDU_WISE_UID=668038A5F6F26CD89AD13AA9BB9684F6',
            'Referer': '',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
        }
    };
    url = 'mh://' + encodeURIComponent(JSON.stringify(urlJson));
    window.location = url;
}

if (window.$) {
    $(".download-hook").off('singleTap');
    $(".list-song").off('singleTap');
    $(".list-song").bind('singleTap', function() {
        var songInfoUrl = "/data/webapp/song/download";
        var data = {};
        self = $(this);
        var param = self.attr("data-songid");
        if (T.lang.isNumber(param)) {
            data.song_id = param
        } else {
            if (param.indexOf("$$") >= 0) {
                data.title = param
            }
        }
        $.post(songInfoUrl, data, function (success) {
            var download_url;
            try {
                download_url = match(/href=['"]([^'"]*)/)[1];
            } catch(e){}
            relocation(download_url);
        })
    });
}
