(function($){
    $.fn.bootstrapCarousel2 = function( options ) {
        
        var mainWidth=0,
        viewPortWidth,
        t=0,
        curSlide=0,
        $childz,
        childzNumber,
        anim;
        
        $(this).each(function()
        {
            var settings = $.extend({
                delay:3000,
                speed:600,
                loop:false,
                animation:'slideRight',
                navigation: true,
                pagination: true,
                backgroundPosition: 'top center',
                htmlContent:false
            }, options );
            var $elm = $(this);
            buildCarousel($elm,settings);
        });
        
        function resetCarouselAnim($elm,settings)
        {
            curSlide=0;
            if(anim==='fadeInOut')
            {
                $elm.find('.item').removeClass('active');
                $elm.find('.item').eq(0).addClass('active').fadeIn(settings.speed);
            }
            if(anim==='slideRight') $('.carousel',$elm).animate({'left':'0px'},settings.speed).css('left','0px').outerWidth(mainWidth*childzNumber);
        }
        function runCarouselAuto($elm,settings,action)
        {
            var delay=Math.abs(settings.delay+settings.speed);
            t=clearTimeout(t);
            t=setTimeout(function(){
                carouselAnim($elm,settings,action);
            }, delay);
            return false;
        }
        function loopAnim($elm,settings,action='right')
        {
            var delay=Math.abs(settings.delay+settings.speed);
            t=clearInterval(t);
            t=setInterval(function(){
                carouselAnim($elm,settings,action);
            }, delay);
        }
        function carouselAnim($elm,settings,action)
        {
            clearTimeout(t);
            var toOffset=mainWidth;
            if(anim==='fadeInOut')
            {
                //review this asap
                
                if(action=='right'){
                    if(curSlide===childzNumber-1)resetCarouselAnim($elm,settings);
                    else
                    {
                        curSlide++;
                        var $active=$elm.find('.item.active');
                        var $next_active=$active.next('.item');
                        $active.fadeOut(settings.speed).removeClass('active');
                        if($next_active.length!==0)$next_active.fadeIn(settings.speed).addClass('active');
                        else resetCarouselAnim($elm,settings);
                    }
                }
                if(action=='left'){
                    if(curSlide===0)resetCarouselAnim($elm,settings);
                    else{
                        curSlide--;
                        var $active=$elm.find('.item.active');
                        var $prev_active=$active.prev('.item');
                        $active.fadeOut(settings.speed).removeClass('active');
                        if($prev_active.length!==0)$prev_active.fadeIn(settings.speed).addClass('active');
                        else resetCarouselAnim($elm,settings);
                    }
                }
                
            }
            if(anim==='slideRight')
            {
                if(action=='right'){
                    if(curSlide===childzNumber-1)resetCarouselAnim($elm,settings);
                    else
                    {
                        curSlide++;
                        $('.carousel',$elm).stop().animate({'left':'-='+toOffset+'px'},settings.speed);
                    }
                }
                if(action=='left'){
                    if(curSlide===0)resetCarouselAnim($elm,settings);
                    else{
                        curSlide--;
                        $('.carousel',$elm).stop().animate({'left':'+='+toOffset+'px'},settings.speed);
                    }
                }
            }
            
            $('.carousel-holder .carousel .item.active',$elm).removeClass('active');
            $('.carousel-holder .carousel .item',$elm).eq(curSlide).addClass('active');
            if(settings.pagination===true){
                $('.carousel-holder .carousel-pagination ul.pagination-nav li',$elm).removeClass('active');
                $('.carousel-holder .carousel-pagination ul.pagination-nav li',$elm).eq(curSlide).addClass('active');
            }
            
            loopAnim($elm,settings,'right');
        }
        
        function buildCarouselControls($elm,settings)
        {
            $('.carousel-holder',$elm).append('<div class="carousel-navigation"><a href="#" class="arrow left"><i class="fa fa-2x fa-angle-left"></i></a><a href="#" class="arrow right"><i class="fa fa-2x fa-angle-right"></i></a></div>');
            $('.carousel-navigation .left',$elm).off('click').on('click', function(e){
                e.preventDefault();
                carouselAnim($elm,settings,'left');
            });
            $('.carousel-navigation .right',$elm).off('click').on('click', function(e){
                e.preventDefault();
                carouselAnim($elm,settings,'right');
            }); 
            if(settings.navigation===true)$('.carousel-holder .carousel-navigation',$elm).css('opacity','1');
            
            
            if(settings.pagination===true){
                $('.carousel-holder',$elm).append('<div class="carousel-pagination"><ul class="pagination-nav"></ul></div>');
                
                $.each($childz,function(i){
                    $('.carousel-holder .carousel-pagination ul.pagination-nav',$elm).append('<li><span class="pagination-bullet">&bullet;</span></li>');
                
                    if(i==0)$('.carousel-holder .carousel-pagination ul.pagination-nav li',$elm).eq(0).addClass('active');
                });
            
                $('.carousel-holder .carousel-pagination',$elm).css('opacity','1');
                $('.carousel-pagination li',$elm).off('click').on('click', function(e){
                    e.preventDefault();
                    var slide=$(this).index();
                    var prevSlide=curSlide;
                    $('.carousel-holder .carousel-pagination ul.pagination-nav li',$elm).removeClass('active');
                    $(this).addClass('active');
                    var dir=(prevSlide<slide)?'right':'left';
                    var toOffset=-mainWidth*slide;
                    curSlide=slide;
                    t=clearInterval(t);
                    $('.carousel',$elm).stop().animate({'left':toOffset+'px'},200);
                    runCarouselAuto($elm,settings,'right');
                });
            }
        }
        
        function buildCarousel($elm,settings)
        {
            anim=settings.animation;
            $elm.addClass('bootstrap-carousel2').addClass(settings.animation);
            
            $childz=$elm.find('div.slide');
            mainWidth=window.outerWidth;
            viewPortWidth=$elm.parent().width();
            childzNumber=$childz.length;
            $(window).resize(function(){
                mainWidth=window.outerWidth;
                viewPortWidth=$elm.parent().width();
                resetCarouselAnim($elm,settings);
                $('.carousel-holder .carousel',$elm).outerWidth(mainWidth*childzNumber);
                $('.carousel-holder .carousel .item',$elm).outerWidth(mainWidth);
                $('.carousel-content-container, .carousel-content',$elm).css('width',viewPortWidth+'px');
            });
            $elm.html('<div class="carousel-holder"><div class="carousel"></div></div>');
            $.each($childz,function(i,o){
                if(settings.htmlContent==true) var imgContent=($(o).find('.content').length!=0)?$(o).find('.content').html():'';
                else imgContent=($(o).find('img.content-image').length!=0)?$(o).find('img.content-image').attr('title'):'';
                var imgBG=($(o).find('img.content-image').length!=0)?$(o).find('img.content-image').attr('src'):'';
                $('.carousel-holder .carousel',$elm).append('<div class="item" style="background-position:'+settings.backgroundPosition+' center;background-image:url('+imgBG+')"><div class="carousel-content-container" style="width:'+viewPortWidth+'px"><div class="carousel-content" style="width:'+viewPortWidth+'px">'+imgContent+'</div></div></div>');
                if(settings.animation==='fadeInOut')
                {
                    $('.carousel-holder .carousel .item',$elm).eq(i).css('zIndex',childzNumber--);
                }
            });
            
            $('.carousel-holder').fadeIn(400);
            $('.carousel-holder .carousel',$elm).outerWidth(((settings.animation!=='fadeInOut')?mainWidth*childzNumber:mainWidth));
            $('.carousel-holder .carousel .item',$elm).outerWidth(mainWidth);
            $('.carousel-holder .carousel .item',$elm).eq(0).addClass('active');

            buildCarouselControls($elm,settings);
            runCarouselAuto($elm,settings,'right');
        }
    };
}( jQuery ));