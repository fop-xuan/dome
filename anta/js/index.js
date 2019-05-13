(function(){
    setRe();
    beforeLoad();
   
   
})();
document.addEventListener('touchmove',function(ev){
    ev.preventDefault();
},{passive:false});

/* 动态设置看到的元素的大小 保持所以屏幕都看到相同数量的元素*/
function setRe(){
    setPre()
    window.addEventListener('resize',setPre);
    //动态设置景深
    function setPre(){
        var Box=document.querySelector('.Box');
        var sss=document.querySelector('.sss');
        var deg=52.5;//视野与屏幕的夹角
        var h=document.documentElement.clientHeight;//屏幕高度

        var per=Math.round(Math.tan(deg/180*Math.PI)*h*.5);
        Box.style.perspective=per+'px';//设置景深
        cssStyle(sss,'translateZ',per);//设置画面的box的位置和景深位置相同 现在什么都无法看到
    }
}

/*图片预先加载 */
function beforeLoad(){
    var logoProgress=document.querySelector('.logoProgress');
    var arr=[];
    for(var attr in imgData){
        arr = arr.concat(imgData[attr]);
    }
    var iNow=0;
    for(var i=0;i<arr.length;i++){
        var img=new Image();
        img.src=arr[i];
        img.onload=function(){
            iNow++;
            logoProgress.innerHTML=`已加载${Math.round(iNow/arr.length*100)}%`;
            if(iNow==arr.length){
                anmt();  
            }
        }
    }
}
/*图标入场动画 */
function anmt(){
    var Box=document.querySelector('.Box');
    var logo1=document.querySelector('#logo1');
    var logo2=document.createElement('div');
    var logo3=document.createElement('div');
    var img1=new Image();
    var img2=new Image();
    img1.src=imgData.logo[0];
    img2.src=imgData.logo[1];
    logo2.id='logo2';
    logo3.id='logo3';
    logo2.className=logo3.className='logoImg';
    cssStyle(logo2,'opacity',0);
    cssStyle(logo2,'translateZ',-800)
    cssStyle(logo3,'opacity',0);
    cssStyle(logo3,'translateZ',-800)
    logo2.append(img1);
    logo3.append(img2);

    Move(logo1,{
        opacity:0,
    },{
        times:800,     //800
        callBack:function(){
            Box.removeChild(logo1);
            Box.append(logo2);
            Box.append(logo3);
            Move(logo2,{
                translateZ:0,
                
                opacity:100
            },{
                times:340,//340
                fx:'easeInStrong',
                callBack:anmt1,
            });
        }
    });
    function anmt1(){    
        setTimeout(function(){
            Move(logo2,{
                translateZ:-800,
            },{
                times:1200,//1200
                callBack:function(){
                    anmt2();
                    Box.removeChild(logo2);

                }
            });
        },1500);//2000
    }
    function anmt2(){
        Move(logo3,{
            translateZ:0,
            opacity:100
        },{
            times:340,//500
            fx:'easeInStrong',
            callBack: anmt3,  
        });
    }
    function anmt3(){
        setTimeout(function(){
            Move(logo3,{
                translateZ:-800,
            },{
                times:1200,//1200
                callBack:function(){
                    anmt4();
                    Box.removeChild(logo3);

                }
            });
        },1500);//2000
    }
    function anmt4(){//load的碎片动画
        var logo4=document.createElement('div');//总box
        logo4.id='logo4';
        cssStyle(logo4,"scale",1);
        var logo4_logoBox=document.createElement('div');//存放img的box
        logo4_logoBox.className='logoLastImg';
        var img=new Image();
        img.src=imgData.logo[2];
        logo4_logoBox.append(img);
        var debrisBox=document.createElement('div');//碎片的box
        debrisBox.className='debrisBox';
       
        for(var i=0;i<30;i++){ 
            var span=document.createElement('span');
            var xR=Math.round(Math.random()*300);//前后的位置的位置
            var xDeg=Math.round(Math.random()*360);//围绕前后屏幕旋转的位置
            var yR=-100+(Math.random()-.5)*400;//对Y方向设置位置
            var yDeg=Math.round(Math.random()*360);//上下屏幕的旋转位置 
            cssStyle(span,"rotateY",xDeg);//先位移 再旋转
            cssStyle(span,'translateZ',xR);
            cssStyle(span,"rotateX",yDeg);
            cssStyle(span,'translateY',yR);
            span.style.backgroundImage = `url(${imgData.logoIco[(i%9)]})`; 
            debrisBox.append(span);
        }
        logo4.append(logo4_logoBox);
        logo4.append(debrisBox);
        Box.append(logo4);
        
        Move(logo4,{//让整个logo4缩放
            scale:100,
        },{
            times:340,//340
            fx:'elasticOut',
            callBack:anmt5,
        })
    }
    function anmt5(){
        setTimeout(()=>{
            Move(logo4,{
                scale:0,
            },{
                times:600,//6000
                fx:'easeOutStrong',
                callBack:function(){

                    logo4.remove();
                
                    sectionShow();
                   
                },
            })
        },1500);//1500
    }
}

function sectionShow(){
    var fadeIn=document.querySelector('#section .fadeIn');
    cssStyle(fadeIn,'translateZ',-1000);
    
    Move(fadeIn,{
        translateZ:-200,
    },{
        times:3000,
        fx:'easeBoth'
    });
    cloud();
    bgRotate();
    createPano();
}
/*龙图加载旋转 */
function bgRotate(){
    var bigBg=section.querySelector('#section .bigBg');
    cssStyle(bigBg,'rotateX',0);//必须要设置 ！！！ 旋转要按照 rotate3D的顺序！！ X Y Z才能达到预期效果！！
    cssStyle(bigBg,'rotateY',-695);//转两圈
    
    var len=imgData.bg.length;
    var w=129;
    var deg=360/len;
    var r=parseInt(Math.tan((180-deg)/2*Math.PI/180)*w/2)-1;//为了和原效果保持一致 所以减去1
    
     var firstDeg=180;
    for(var i=0;i<len;i++){
        var span=document.createElement('span');
        span.style.backgroundImage=`url(${imgData.bg[i]})`;
        cssStyle(span,'rotateY',firstDeg);
        cssStyle(span,'translateZ',-r);
       span.style.display='none';
        firstDeg-=deg;
        bigBg.append(span);
    }
    var num=0;
    var timer=setInterval(()=>{//为了一个一个显示
        bigBg.children[num].style.display='block';
        num++;
        if(num==len){
            clearInterval(timer);
        }
    },50)
    
    Move(bigBg,{//旋转整个图
        rotateY:25,//转到25
    },{
        times:3000,
        fx:'linear',
        callBack:function(){
            setDrag();//旋转后加入拖拽
            loadBg();//大图旋转完毕 背景加入
            setTimeout(setGyro,100);
        }
    });
    
}
/* 龙图拖拽*/
function setDrag(){
    var bigBg=section.querySelector('#section .bigBg');
    var fadeIn=document.querySelector('#section .fadeIn');
    var startFadeZ=cssStyle(fadeIn,'translateZ');//保存原位置的值
    var pano = document.querySelector('.panoBox');
   
    var scaleX=129/18;//拖拽比例 每次走1px时旋转7度
    var scaleY=1172/90;
    var startPoint={x:0,y:0};
    var startDeg={x:0,y:0};
    var lastTarget={x:0,y:0};
    var DvalueTarget={x:0,y:0};

    document.addEventListener('touchstart',function(ev){
        startPoint.x=ev.changedTouches[0].pageX;
        startPoint.y=ev.changedTouches[0].pageY;
        startDeg.y=cssStyle(bigBg,'rotateX'); 
        startDeg.x=cssStyle(bigBg,'rotateY');
   
        lastTarget.x=startDeg.x;
        DvalueTarget.x=0;
       
    });

    document.addEventListener('touchmove',function(ev){
        var Deg={};
        Deg.x=ev.changedTouches[0].pageX-startPoint.x;
        Deg.y=ev.changedTouches[0].pageY-startPoint.y;

       
       
        var scaleDeg={};
        scaleDeg.x=-Deg.x/scaleX;
        scaleDeg.y=Deg.y/scaleY;
        var x=scaleDeg.x+startDeg.x;
        var y=scaleDeg.y+startDeg.y;
        if(y>45){
            y=45;
        }else if(y<-45){
            y=-45;
        }
       
        cssStyle(bigBg,'rotateX',y);
        cssStyle(bigBg,'rotateY',x); 
        cssStyle(pano,'rotateX',y);
        cssStyle(pano,'rotateY',x);    
             
        DvalueTarget.x=x-lastTarget.x;
        lastTarget.x=x;
        var fadeInTarget=startFadeZ-Math.abs(Deg.x);
       
        if(fadeInTarget<=-300){//限制页面前面移动最大值
            fadeInTarget=-300;
        }
       cssStyle( fadeIn,'translateZ',fadeInTarget )//当移动的时候 设置页面位置的值 
        
    });

    document.addEventListener('touchend',function(){
        var nowDeg=cssStyle(bigBg,'rotateY');
        var moveTargetX=DvalueTarget.x*10;
    
        Move(fadeIn,{
            translateZ:startFadeZ,//控制页面回到原位置
        },{
            times:800,
            fx:'easeOut',
        });
        
        Move(bigBg,{//拖拽缓冲
            rotateY:nowDeg+moveTargetX,
        },{
            times:800,
            fx:'easeOut'
        });
        Move(pano,{//拖拽缓冲镶嵌的图
            rotateY:nowDeg+moveTargetX,
        },{
            times:800,
            fx:'easeOut'
        });
       
        
    });
}
/*陀螺仪旋转 */
function setGyro(){
    var bigBg=section.querySelector('#section .bigBg');
    var pano = document.querySelector('.panoBox');

    var last={x:0,y:0};
    var start={};
    var of=false;
    var startEl={};
    window.addEventListener('deviceorientation',function(e){
        var x=e.beta;
        var y=e.gamma;

        if(Math.abs(x-last.x)>1||Math.abs(y-last.y)>1){

            if(of){
                //相当于move             
                var now={};
                now.x=x;
                now.y=y;
                var dis={};
                dis.x=now.x-start.x;
                dis.y=now.y-start.y;
                var degX=dis.x+startEl.x;
                if(degX>40){
                    degX=40;
                }else if(degX<-40){
                    degX=-40;
                }
                cssStyle(bigBg,'rotateX',degX);
                cssStyle(bigBg,'rotateY',dis.y+startEl.y);
                cssStyle(pano,'rotateX',degX);
                cssStyle(pano,'rotateY',dis.y+startEl.y);

                start.x=now.x;//每次执行完对开始的值重新赋值  因为我定义的start只能在第一次执行或者当我晃动小于1才会重新执行 所以我要重新赋值
                start.y=now.y;
                startEl.x=cssStyle(bigBg,'rotateX');
                startEl.y=cssStyle(bigBg,'rotateY');
            }else{ 
                //相当于start 
                start.x=x;
                start.y=y;
                startEl.x=cssStyle(bigBg,'rotateX');
                startEl.y=cssStyle(bigBg,'rotateY');
                of=true;
            }
            last.x=x;
            last.y=y;
        }else{
             //相当于end
             of=false;

        }
    });
}

/*云朵加载入场 */
function cloud(){
    var cloud=document.querySelector('.cloud');
    for(var i=0;i<10;i++){
        var span=document.createElement('span');
        span.style.backgroundImage=`url(${imgData.clound[i%3]})`;

        var r=300;//随机一个半径
        var deg=Math.random()*360;//随机一个现在运动处于的角度
        var x=Math.sin(deg*Math.PI/180)*r;//设置左右的位置
        var y=Math.cos(deg*Math.PI/180)*r;//设置前后的位置
        var lT=(Math.random()-.5)*200;//设置上下的位置
        cssStyle(span,'translateX',x);
        cssStyle(span,'translateY',lT);
        cssStyle(span,'translateZ',y);
        span.style.display='none';
        cloud.append(span);
    }
    var num=0;
    var timer=setInterval(()=>{
        cloud.children[num].style.display='block';
        num++;
        if(num==cloud.children.length){
            clearInterval(timer);
        }
    },100);

    Move(cloud,{
        rotateY:720
    },{
        times:3000,
        fn:function(){
           var deg=-cssStyle(cloud,'rotateY');
            for(var i=0;i<cloud.children.length;i++){
                cssStyle(cloud.children[i],'rotateY',deg);
                //旋转运动过程中 让云朵的旋转运动方向与父级旋转方向相反 就可以让云朵一直是正面朝上 
                //这样就是父级向左 而云朵以同样的速度向右 云朵随着父级运动的同时 自身在转动过程中与父级运动方向相反 产生视觉上的一直处于正面朝上
            }  
        },
        callBack:function(){
            cloud.remove();//运动完后删除云朵
        }
    });
    
}
/*最后面的背景加载 */
function loadBg(){
    var bg=document.createElement('div');
    bg.className='bg';
    document.body.insertBefore(bg,document.body.firstChild);
    cssStyle(bg,'opacity',0);
    Move(bg,{
        opacity:100,
    },{
        fx:'linear',
        times:1000,
    });
}
/*人物景物图加载入场 */
function createPano(){
    var pano = document.querySelector('.panoBox');
	var deg = 18;
	var R = 406;
    var nub = 0;
	var startDeg = 180;
	cssStyle(pano,"rotateX",0);
	cssStyle(pano,"rotateY",-180);
    cssStyle(pano,"scale",0);
	var pano1 = document.createElement("div");
	pano1.className = "pano";
	cssStyle(pano1,"translateX",1.564);
	cssStyle(pano1,"translateZ",-9.877);
	for(var i = 0; i < 2; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:344px;margin-top:-172px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		cssStyle(span,"translateY",-163);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano1.appendChild(span)
	}
    pano.appendChild(pano1);

    var pano2 = document.createElement("div");
	pano2.className = "pano";
	cssStyle(pano2,"translateX",20.225);
	cssStyle(pano2,"translateZ",-14.695);
	for(var i = 0; i < 3; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:326px;margin-top:-163px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		cssStyle(span,"translateY",278);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano2.appendChild(span)
	}
    pano.appendChild(pano2);

    var pano3 = document.createElement("div");
	pano3.className = "pano";
	cssStyle(pano3,"translateX",22.175);
	cssStyle(pano3,"translateZ",-11.35);
	for(var i = 0; i <4; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:195px;margin-top:-97.5px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		cssStyle(span,"translateY",192.5);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano3.appendChild(span)
	}
    pano.appendChild(pano3);
    
    var pano4 = document.createElement("div");
    pano4.className = "pano";
    startDeg = 90;
	cssStyle(pano4,"translateX",20.225);
	cssStyle(pano4,"translateZ",14.695);
	for(var i = 0; i <5; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:468px;margin-top:-234px;";
        span.style.background = "url("+imgData["pano"][nub]+")";
        cssStyle(span,"translateY",129);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano4.appendChild(span)
	}
    pano.appendChild(pano4);

    var pano5 = document.createElement("div");
    pano5.className = "pano";
    startDeg = 18;
	cssStyle(pano5,"translateX",-11.35);
	cssStyle(pano5,"translateZ",22.275);
	for(var i = 0; i <6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:468px;margin-top:-234px;";
        span.style.background = "url("+imgData["pano"][nub]+")";
        
        cssStyle(span,"translateY",150);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano5.appendChild(span)
	}
    pano.appendChild(pano5);


    var pano6 = document.createElement("div");
    pano6.className = "pano";
    startDeg = 18;
	cssStyle(pano6,"translateX",-4.54);
	cssStyle(pano6,"translateZ",9.91);
	for(var i = 0; i <6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:468px;margin-top:-234px;";
        span.style.background = "url("+imgData["pano"][nub]+")";
        
        cssStyle(span,"translateY",-13);
		cssStyle(span,"rotateY",startDeg);
		cssStyle(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano6.appendChild(span)
	}
    pano.appendChild(pano6);

    setTimeout(function(){
		Move(pano,{
                rotateY: 25,
                scale:100	
		    },{
                times:800,
                fx:'elasticOut'
            });
	},2800);
  
}