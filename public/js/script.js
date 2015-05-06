$(document).ready(function () {

    //Open menu
    $("#menu").click(function(){
        $(".menu").animate({left: 0}, 'slow');
    });

    //Close menu
    $("#close-menu").click(function(){
        $(".menu").animate({left: -300}, 'slow');
    });

});