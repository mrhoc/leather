$(document).ready(function () {
    $('.mb-menu').html($('#menu-desktop').html());
    $('.btn-menu-mb').on('click', function () {
        $('#wandave-theme').toggleClass('menu-active');
        $(this).toggleClass('active');
    });
    $('#wanda-close-handle').on('click', function () {
        $('#wandave-theme').removeClass('menu-active');
        
    });
    if($(window).width() < 992) {
        $('.mb-menu li > a').on('click', function (e) {
            e.preventDefault();
            $(this).parent().toggleClass('active');
            $(this).closest('li').find('.sub_menu_dropdown').slideToggle('fast');
        })
    }
})

// $(document).on('click', '.menu-active #site-overlay,#wanda-close-handle', function (event) {
//     $("#wandave-theme").removeClass('menu-active');
// });
// $("body").on("click", ".btn-menu-mb", function () {
//     $("body").toggleClass('menu-active');
// })
// $('body').on('click', '.cl-open', function (event) {
//     $(this).next().slideToggle('fast')
//     $(this).toggleClass('minus-menu');
// });