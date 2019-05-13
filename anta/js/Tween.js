function cssStyle(elem,attr,val){
    if(!elem.sp){
        elem.sp={};
    }
    var transformStyle=/scale+|rotate+|translate+|skew+/;
    if(typeof val=='undefined'){
        if(transformStyle.test(attr)){
            if(!elem.sp[attr]){
                switch(attr){
                case "scale":
                case "scaleX":
                case "scaleY":
                case "scaleZ":
                    elem.sp[attr] = 100;
                    break;
                default:
                    elem.sp[attr] = 0;	
                }
            }  
        }else{
            function getStyle(elem,attr){
                return elem.currentStyle? 
                elem.currentStyle[attr]:getComputedStyle(elem)[attr];
            }
            if(attr=='opacity'){
                elem.sp[attr]=Math.round(getStyle(elem,attr)*100); 
            }else{
                elem.sp[attr]=parseFloat(getStyle(elem,attr));
            }         
        }
        return elem.sp[attr];
    }else{
        elem.sp[attr]=parseInt(val);
        var arr=[];
        for(var attr in elem.sp){
            if(attr=='opacity'){
                elem.style[attr]=elem.sp[attr]/100;
                elem.style.filter='Alpha(opacity ='+elem.sp[attr]+')';
            }else if(transformStyle.test(attr)){
                switch(attr){
                    case "rotate":
                    case "rotateX":
                    case "rotateY":
                    case "rotateZ":
                    case "skewX":
                    case "skewY":
                        arr.push(attr+'('+elem.sp[attr]+'deg)');   
                        break;
                    case "scale":
                    case "scaleX":
                    case "scaleY":
                    case "scaleZ":
                        arr.push(attr+'('+elem.sp[attr]/100+')');
                        break;
                    default:
                        arr.push(attr+'('+elem.sp[attr]+'px)');
                }
                elem.style.WebkitTransform=elem.style.transform=arr.join(' ');   
            }else{
                elem.style[attr]=elem.sp[attr]+'px';
            }
        }                 
    }
}
function Move(obj,json,opt){
    var sp={};
    var setting={
        times:400,
        fx:'linear',
        callBack:function(){},
        fn:function(){},
    };
    Object.assign(setting,opt);
    for(var attr in json){
        sp[attr]=0;
        var aIE=navigator.userAgent;
        var re=/NET/g;//兼容ie 我服了 
        if(re.test(aIE)){
            if(cssStyle(obj,attr)=='auto'){
                sp[attr]=0;
            }
        }else{
            sp[attr]=parseFloat(cssStyle(obj,attr));
        }		    
    }
    var oldTime=now();
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        var newTime=now();
        var t=newTime-oldTime;
        if(t>setting.times){  
            t=setting.times;
        } 
        for(var attr in json){
            var value=Tween[setting.fx](t,sp[attr],json[attr]-sp[attr],setting.times);
            cssStyle(obj,attr,value);	
            setting.fn.call(obj);
        }
        if(t==setting.times){
            clearInterval(obj.timer);
            setting.callBack.call(obj);
        }
    },1000/60);
}
function now(){
    return new Date().getTime();
}
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) { 
            return b; 
        }
        if ( (t /= d) == 1 ) {
            return b+c; 
        }
        if (!p) {
            p=d*0.3; 
        }
        if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },    
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
        s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }, 
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },       
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },      
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}