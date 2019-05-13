function mScroll(init){
    if(!init.el){
        return;
    }

    var section=init.el;
    var inner=section.children[0];
    var back=section.offsetHeight/8;//上下到底顶部最大的超出高度

    inner.style.minHeight='100%';
    cssStyle(inner,'translateZ',0.01);//触发3D硬件加速

    var MaxMoveTarget=section.offsetHeight-inner.offsetHeight;//最大滑动目标点


    if(init.offBar){
        var ScrollBar=document.createElement('div');
        ScrollBar.id='ScrollBar';
        section.appendChild(ScrollBar);
        var scale=section.offsetHeight/inner.offsetHeight; //比例   可视区高/内容总高  得到可视的一个比例
       
        ScrollBar.style.cssText=`width:3px;background: rgba(197, 195, 195, 1);position: absolute;top: 0px;right: 0px;border-radius: 20px;transition: 1s opacity;`;

        section.appendChild(ScrollBar);
    }

    
    var startPoint=0;//保存触摸时候的位置
    var startEl=0;//每次滑动开始的位置
    var lastTarget=0;//计算上一次的目标点
    var DvalueTarget=0;//上一次和这次的差值
    var lastTime=0;//上一次时间
    var DvalueTime=0;//上一次和这次的时间差值

    inner.addEventListener('touchstart',function(e){

        MaxMoveTarget=section.offsetHeight-inner.offsetHeight;//每次触摸成重新获取最大距离!!!!!!  重新设置滚动条的长度 ！

        if(init.offBar){
            if(MaxMoveTarget>=0){//当最大移动距离为0 或者大于零(因为向下移动是负数)就隐藏滚动条
                ScrollBar.style.display='none';
            }else{
                ScrollBar.style.display='block';
            }
            scale=section.offsetHeight/inner.offsetHeight; //比例   可视区高/内容总高  得到可视的一个比例  在触摸时重新获取比例 因为可能高度变化
            ScrollBar.style.height=scale*section.offsetHeight+'px';

            ScrollBar.style.opacity=1;
        }
       
        
        clearInterval(this.timer);
       
        startPoint=e.changedTouches[0].pageY;
        startEl=cssStyle(this,'translateY');

        lastTarget=startEl;
        DvalueTarget=0;

        lastTime=new Date().getTime();//上一次时间
        DvalueTime=0;//（每次重新触摸一开始的时候）时间差为0 

        (init.start)&&init.start(e);

    });
   

    inner.addEventListener('touchmove',function(e){
        var movePoint=e.changedTouches[0].pageY;

        var newMove=movePoint-startPoint+startEl;


        
        if(newMove<=MaxMoveTarget-back){
            newMove=MaxMoveTarget-back;
        }else if(newMove>=back){
            newMove=back;
        }

        cssStyle(this,'translateY',newMove);
        
        

        DvalueTarget=newMove-lastTarget;
        lastTarget=newMove;

        DvalueTime=new Date().getTime()-lastTime;//时间差
        lastTime=new Date().getTime();//让上一次等于这一次

        (init.offBar)&&cssStyle(ScrollBar,'translateY',-scale*newMove);  //比例乘以内容滚动的高度就是 滚动条滚动的高度

        (init.move)&&init.move(e);

        
        
    });

    inner.addEventListener('touchend',function(e){
        var type = "easeOut";

        var speed=Math.round(DvalueTarget/DvalueTime*10);//速度为距离除以时间
        //在按下抬起时 未发生move DvalueTime和DvalueTarget都为0 的时候就会出现 NaN 因为0/0NaN  
        //Math.round(1/0) 时候 得到infinity 也会出错  但是不出现位移1时间0的时候
        speed=DvalueTime<=0? 0:speed;//当时间为《0时 让speed等于0 要不然没有move时时间距离都为0相除得到结果为NaN
       
        var ElemTarget=speed*30+cssStyle(this,'translateY');//缓存的距离   

        if(ElemTarget>=0){
            ElemTarget=0;
            type = "easeOut";
        }else if(ElemTarget<MaxMoveTarget){
            ElemTarget=MaxMoveTarget;
            type = "easeOut";
        }              
        Move(this,{
            translateY:ElemTarget,
        },{
            times:Math.max(1,Math.abs(ElemTarget - cssStyle(inner,"translateY"))*1.1),
            fx:type,
            callBack:function(){
                (init.offBar)&&(ScrollBar.style.opacity=0);
                (init.over)&&init.over();
            },
            fn:function(){
                (init.offBar)&&cssStyle(ScrollBar,'translateY',cssStyle(inner,"translateY")*-scale);  //在移动过程中让滚动条的位置等于内容的位置乘以比例
                (init.move)&&init.move();
            }
        });  

        (init.end)&&init.end(e);
        
        
    });              
}