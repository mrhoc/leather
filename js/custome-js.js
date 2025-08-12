$(document).ready(function () {
    $('.mb-menu').html($('#menu-desktop').html());
    $('.btn-menu-mb').on('click', function () {
        $('#wandave-theme').toggleClass('menu-active');
        $(this).toggleClass('active');
    });
    $('#wanda-close-handle').on('click', function () {
        $('#wandave-theme').removeClass('menu-active');
        
    });
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