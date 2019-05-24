$(function(){
    showScroll();
    function showScroll(){
        $(window).scroll( function() {
            var scrollTopValue=$(window).scrollTop();
            var scrollBotValue=$('#container').height()-scrollTopValue;
            console.log = scrollBotValue;

            scrollTopValue > 10 ? $('#scrollTopButton').fadeIn():$('#scrollTopButton').fadeOut();
            scrollBotValue > 450 ? $('#scrollBotButton').fadeIn():$('#scrollBotButton').fadeOut();
        } );
        $('#scrollTopButton').click(function(){
            $("html,body").animate({scrollTop:0},200);
        });

        $('#scrollBotButton').click(function(){
            $("html,body").animate({scrollTop:$('#container').height()-550},200);
        });
    }
})