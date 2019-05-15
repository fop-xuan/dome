

window.onload=function(){

    function init(){
        skillContent.init();
        caseContent.init();
        scrollContent.init();
    }

   


    let skillContent=(function(){//技能展示
        let skill_list=document.querySelector('#skill_list');
        let skill_li=skill_list.querySelectorAll('li');
        let arrs=[63,85,60,30,10,20,17,29,92,46];

        function init(){
            listW();
        }

        function listW(){
            Array.from(arrs).map((val,i)=>{
                let innerLeft=skill_li[i].children[0];
                innerLeft.innerHTML=val+'%';
                let innerRight=skill_li[i].children[1].children[1];
                innerRight.style.width=val+"%";
            });  
        }

        return {
            init,
        }
    })();

    let caseContent=(function(){//案例分析
        let caseMenu=document.querySelectorAll('.case_content h2');
        let case_content_demo_li=document.querySelectorAll('.case_content_demo li');
        let len=case_content_demo_li.length;
        let case_content_demo_meun_li=document.querySelectorAll('.case_content_demo_meun li');
        let case_content_demo_list=document.querySelector('.case_content_demo_list');
        let ico=document.querySelector('.case_content_demo_list .nav a');
        
       
        
        function init(){
            bind();   
        }


        function scroll(){
            let startPoint=0;
            let startEl=0;
            let elTmnstale=0;
            let maxHeight=parseInt(getComputedStyle(case_content_demo_list).height)- document.documentElement.clientHeight;
            case_content_demo_list.addEventListener('touchstart',function(e){
                maxHeight=parseInt(getComputedStyle(case_content_demo_list).height)- document.documentElement.clientHeight;
                startPoint=e.changedTouches[0].pageY;
                startEl=elTmnstale;
            });
            case_content_demo_list.addEventListener('touchmove',function(e){
                e.preventDefault();
                let newPoint=e.changedTouches[0].pageY;
                let move=newPoint-startPoint;
                elTmnstale=move+startEl;
                if(elTmnstale>0){
                    elTmnstale=0;
                }else if(elTmnstale<-maxHeight){
                    elTmnstale=-maxHeight;
                }
                this.style.transition='none';
                this.style.transform=`translateY(${elTmnstale}px)`;
               
            });  
        }

        function shareToQq(title,url,picurl){
            let shareqqzonestring='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+title+'&url='+url+'&pics='+picurl;
            window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100');
        }


        function bind(){

            for(var i=0;i<len;i++){
                let shareIco=case_content_demo_meun_li[i].querySelectorAll('a');
                shareIco[1].onclick=function(){
                    shareToQq('轮播');
                }
            }


            for(var i=0;i<caseMenu.length;i++){
                caseMenu[i].of=false;
                caseMenu[0].of=true;
                caseMenu[i].onclick=function(){
                    if(this.nextElementSibling){
                        if(this.of){
                            this.nextElementSibling.style.display='none';
                            this.className='';
                        }else{
                            this.nextElementSibling.style.display='block';
                            this.className='active';
                        }
                        this.of=!this.of;   
                    } 
                }
            }

            for(var i=0;i<len;i++){
                (function(i){
                    case_content_demo_li[i].onclick=function(){
                        for(var j=0;j<len;j++){
                            case_content_demo_li[j].className='';
                            case_content_demo_meun_li[j].style.display='none';
                        }
                        this.className='checked';
                        case_content_demo_meun_li[i].style.display='block';
                        if(getSize()){
                            scroll();
                            case_content_demo_list.style.transition='transform .5s';
                            case_content_demo_list.style.transform='translateX(0)';
                        }
                    }
                })(i);
            } 
            
            ico.onclick=function(){
                case_content_demo_list.style.transition='transform .5s';
                case_content_demo_list.style.transform='translateX(100vw)';
            }
        }

        function getSize(){
            var size=document.documentElement.clientWidth; 
            return size<960? true :false;
        }

        return {
            init
        }
    })();

    let scrollContent=(function(){
        let backTop_bar=document.querySelector('#backTop_bar');
        let timer=null;
        let isScroll=true;

        function init(){
            bind();
        }

        function bind(){
            backTop_bar.onclick=function(e){
                isScroll=true;
                clearInterval(timer);
                timer=setInterval(scroll,1000/60); 
                document.documentElement.onclick=function(){
                    isScroll=false;
                }
                e.stopPropagation();
            }

            window.onscroll=function(){
                backTop_bar.style.display= this.pageYOffset>400?'block':'none';
            }   
        }

        function scroll(){
            let srcoll=window.pageYOffset;
            if(srcoll>0){
                isScroll==true? window.scrollTo(0,srcoll-40):clearInterval(timer); 
            }else{
                clearInterval(timer);
            } 
        }

        return {
            init
        }
    })();
    
    init();

}

