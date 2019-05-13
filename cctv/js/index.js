var imgSwitch=false;
var arr=[];
for(var i=0;i<5;i++){
    arr.push(`img/${i+1}.jpg`);
}

function page_four(parent){
    message(parent,'请上传(视频或文本)和照片');
    var isTxt=false;
    var isImg=false;
    $('.upload input').each(function(i,elem){
        elem.index=i; 
    });
    $('.upload input').on('change',function(){  
       
       
        var type=this.files[0].type.split('/')[0];
        
        if(this.index==0){
            if(type=='vedio'||type=='text'){
                isTxt=true;
            }else{
                message(parent,'请上传视频或文本',true);
            }
        }else{
            if(type=='image'){
                isImg=true;
            }else{
                message(parent,'请上传图片',true);
            }
        }

        if(isTxt&&isImg){
            showPage_five(parent);
        } 
    });
    
   
   
}

function page_two(){
   
    $('.listBox .list li').each(function(i){
        $(this).append(`<img src=${arr[i]}>`);
    });

    ImgMove( $('.listBox .list') );

    starShining( $('.gradeContent li') );

    showPage_three($('.page_two'));

    icoSkip();
    
    if( $('.content').height()<$('.scroll-list').height()){
        mScroll({
            el:$('.content')[0],
        });
    }
    
}


function page_one(){

    
    for(var i=0;i<arr.length;i++){
        var img=new Image();
        img.src=arr[i];
        img.onload=function(){
            imgSwitch=true;  
        }
    }

    var TimeSwitch=false;
    var time=new Date().getTime();

    $('.page_one').on('transitionend',function(){
        $(this).css('display','none');
    });

    

    var timer=setInterval(()=>{
        if(new Date().getTime()-time>=10){
            TimeSwitch=true;   
        }
        if(imgSwitch&&TimeSwitch){
            clearInterval(timer);
            $('.page_one').css('opacity',0);
            $('.page_two').css('display','block');
            page_two();
        }
    },3000);
}



function starShining(box){
    var star=$(box).find('a');
    star.on('touchstart',function(){
        $(this).parent().find('a').removeClass('shining');
        for(var i=0;i<=$(this).index();i++){
            $(this).parent().find('a').eq(i).addClass('shining');
        } 
        $(this).closest('li').find('input').val($(this).index()+1);
    });
}

function ImgMove(moveElem){

    var startPoint=0;

    var startPointer=0;

    var iNow=0;

    moveElem.on('touchstart',function(ev){
        clearInterval(timer);
        
        startPoint=ev.changedTouches[0].pageX-$(this).offset().left;   
    
        startPointer=ev.changedTouches[0].pageX;

        $(this).css({'transition':'none'});
    });

    moveElem.on('touchmove',function(ev){
        
        var nowPoint=ev.changedTouches[0].pageX-startPoint; 
        $(this).css('transform','translateX('+nowPoint+'px)');
        
    });

    moveElem.on('touchend',function(ev){
        var nowPointer=ev.changedTouches[0].pageX;
        if(nowPointer<startPointer){
            if(iNow<arr.length-1){
                iNow++;
            } 
        }else{
            if(iNow>0){
                iNow--;
            }    
        }
        $('.listBox nav').find('span').removeClass('active');
        $('.listBox nav').find('span').eq(iNow).addClass('active');
        $(this).css({
            'transition':'.5s',
            'transform':'translateX('+(-iNow*$(this).find('li').width())+'px)',
        });
        timer=setInterval(autoMove,3000);
    });    
  
    function autoMove(){ 
        iNow++; 
        if(iNow>=5){
            iNow=0;
        }  
        $(moveElem).css({
            'transition':'.5s',
            'transform':'translateX('+(-iNow*$(moveElem).find('li').width())+'px)',
        });
        $('.listBox nav').find('span').removeClass('active');
        $('.listBox nav').find('span').eq(iNow).addClass('active');
    }
    var timer=setInterval(autoMove,3000);
}

function showPage_three(parent){

  
    parent.find('.btnbox .btn').on('click',function(){
        $('.page_three .btnbox').css({'display':'none'});
        if( isStar()&&raChecked() ){   
            $('.page_three').css({'zIndex':10,'opacity':1});
            parent.css('filter','blur(5px)');

            setTimeout(function(){
                parent.css({'display':'none','filter':'blur(0px)'});
                $('.page_three').css({'opacity':0,'zIndex':8});
                $('.page_four').css('display','block');
                setTimeout(function(){
                    $('.page_three').css('display','none');    
                },700);    
            },3000);
        }else if(isStar()==false){
            message( $('.page_two'),'给景区评分',true );
        }else if(raChecked()==false){
            message( $('.page_two'),'给景区加标签' ,true);
        } 
    });


    function raChecked(){
        var raArr=$.makeArray($('.labelBox').find('input'));
        var isCheacked=raArr.some(item=>{
            return item.checked;
        });
        return isCheacked;
    }
    function isStar(){
        var isStar=true;
        $('.grade').find('input').each(function(i,elem){
            if(elem.value==0){
                isStar=false;
            }
        });
        return isStar;
    }
}

function message(parent,value,off_on){
    
    var message=parent.find('.message');

    message.css({'opacity':1,'transform':'scale(1)'});

    message.html(value);

    off_on&&setTimeout(()=>{
        message.css({'opacity':0,'transform':'scale(0)'});
    },1500);
}

function icoSkip(){

    $('.listBox .ico').on('touchstart',function(){
        $('.page_two').css('display','none');
        $('.page_four').css('display','block');
        $('.page_three').css('display','none');
    });
}

function showPage_five(parent){
    parent.find('.btn').addClass('submit');
    message(parent,'',true);
    $('.page_three .btnbox').css({'display':'block'});
    parent.find('.btn').on('touchstart',function(){
        parent.css({'filter':'blur(5px)',});
        $('.page_three').css({'display':'flex'});
        setTimeout(()=>{
            $('.page_three').css({'zIndex':10,'opacity':1,});

            $('.page_three .btn').on('touchstart',function(){

                $('.page_two').css('display','block');
                $('.page_three').css({'zIndex':8,'opacity':0,});
                parent.css({'filter':'blur(0px)','display':'none'});
            });
        },10);  
    });  
}