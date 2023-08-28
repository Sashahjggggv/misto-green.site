jQuery(function($) {

    "use strict";

    var ajax_url = '/wp-admin/admin-ajax.php';
    $(document).on('submit', '.request-form', function (e) {
        var form = $(this);
        $.post(ajax_url, {
                'action': 'send_request',
                'type':form.find('.request-type').val(),
                'name': form.find('.name').val(),
                'email': form.find('.email').val(),
                'tel': form.find('.tel').val(),
                'message': form.find('.message').val(),
                'section': form.find('.section-index-popup').text(),
                'floor': form.find('.floor-index-popup').text(),
                'flat': form.find('.flat-index-popup').text(),
                'parking': form.find('.parking-index-popup').text()
            })
            .done(function (data) {
                if (data == '1') {
                    _functions.textPopup('Дякуємо за Ваше повідомлення!', 'Наші представники зв`яжуться з вами за першої нагоди.');
                }
                else {
                    _functions.textPopup('Помилка при надсиланні листа');
                    console.log(data);
                }
            })
            .fail(function (request, status, error) {
                _functions.textPopup(request.responseText);
                console.log(request.responseText);
            });


        return false;
    });

    var wpcf7Elm = document.querySelector('.wpcf7');
    if (wpcf7Elm) {
        wpcf7Elm.addEventListener('wpcf7mailsent', function (event) {
            _functions.textPopup('Дякуємо за Ваше повідомлення!','Наші представники зв`яжуться з вами за першої нагоди.');
        }, false);
        wpcf7Elm.addEventListener('wpcf7mailfailed', function (event) {
            _functions.textPopup('Помилка при відправки листа');
        }, false);
    }

    $(document).on('click','map area.sold, a.sold, a[href=""],map area[href=""]',function(e){
        e.preventDefault();
        return false;
    });

   /* $(document).on('click', '.map-slide-content-wrapper .swiper-button-prev.single', function(e){
        e.preventDefault();
        if($('.floor-link.active').next().hasClass('floor-link')) location.href = $('.floor-link.active').next().attr('href');
        else location.href = $('.floor-link:first').attr('href');
    });

    $(document).on('click', '.map-slide-content-wrapper .swiper-button-next.single', function(e){
        e.preventDefault();
        if($('.floor-link.active').prev().hasClass('floor-link')) location.href = $('.floor-link.active').prev().attr('href');
        else location.href = $('.floor-link:last').attr('href');
    });*/


});