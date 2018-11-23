/**
 * @SimplePAVE
 * https://t.me/SimplePAVE
 * info@simplepave.ru
 */

jQuery(document).ready(function($){

    /**
     * More
     */

    $('#more-button').click(function(e) {
        e.preventDefault();
        let t = $(this);
        let nextUrl = t.attr('data-next');

        if (!nextUrl.length) return;
        t.attr('data-next', '');

        $.get(nextUrl, function(data) {
            data = $(data);
            let more = data.find('#more-block');
            let next = data.find('#more-button');

            $('#more-block').append(more.html());

            if (next.length)
                t.attr('data-next', next.attr('data-next'))
            else
                $('#more-button').remove();
        });
    });

    /**
     * Data Value
     */

    function dataValue(t) {
        let name = t.attr('name');

        if (name == 'password' || name == 'confirm')
            t.attr('type', 'password');

        t.val(t.attr('data-value')).removeAttr('data-value');
    }

    /**
     * Register
     */

    $('#form-register').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        t.find('input[data-value]').each(function() {
            dataValue($(this));
        });

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=register',
            url: 'index.php?route=account/register',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error') {
                    $.each(json.message, function(index, value) {
                        let item = t.find('input[name="' + index + '"]');

                        if (item.length) {
                            let message = '';

                            for (let obj in value) {
                                let i = Object.keys(value).indexOf(obj);

                                if (i === 0) {
                                    message = value[obj];
                                    break;
                                }
                            }

                            item.attr('data-value', item.val().trim()).val(message);

                            if (index == 'password' || index == 'confirm')
                                item.attr('type', 'text');
                        }
                    });
                }

                else {
                    t.prev().css('color', 'green').text(json.message);
                    t.remove();

                    if (json.redirect) location = json.redirect;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $('#form-register').on('focus', 'input[data-value]', function() {
        dataValue($(this));
    });

    /**
     * Login
     */

    $('#form-login-entrance').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=login',
            url: 'index.php?route=account/login',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error')
                    t.prev().css('color', 'red').text(json.message);

                else {
                    t.prev().css('color', 'green').text(json.message);
                    t.remove();

                    if (json.redirect) location = json.redirect;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    /**
     * Forgotten
     */

    $('#form-forgotten').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=forgotten',
            url: 'index.php?route=account/forgotten',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error')
                    t.prev().css('color', 'red').text(json.message);

                else {
                    t.prev().css('color', 'green').text(json.message);
                    t.remove();

                    if (json.open) {
                        setTimeout(function () {
                            $.magnificPopup.open({
                                removalDelay: 300,
                                items: {src: json.open},
                                type: 'inline'
                            });
                        }, 3000);
                    }

                    if (json.redirect) location = json.redirect;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    /**
     * Buy one click
     */

    $('body').on('click', 'a[data-product]', function(e){
        e.preventDefault();
        let t = $(this);
        let productID = t.attr('data-product');
        let input = $('#form-buy-one-click').find('input[name="product_id"]');

        $('#form-buy-one-click').show();
        $('#form-fastBuy').find('.form-message').remove();

        if (productID.length) input.val(productID);
        else input.val('');
    });

    $('#form-buy-one-click').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        t.find('input[data-value]').each(function() {
            dataValue($(this));
        });

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=buy_one_click',
            url: 'index.php?route=mail/buy_one_click',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error') {
                    $.each(json.message, function(index, value) {
                        let item = t.find('input[name="' + index + '"]');

                        if (item.length) {
                            let message = '';

                            for (let obj in value) {
                                let i = Object.keys(value).indexOf(obj);

                                if (i === 0) {
                                    message = value[obj];
                                    break;
                                }
                            }

                            item.attr('data-value', item.val().trim()).val(message);
                        }
                    });
                }

                else {
                    t.before('<span class="form-message" style="color: green">' + json.message + '</span>').hide();

                    if (json.redirect) location = json.redirect;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $('#form-buy-one-click').on('focus', 'input[data-value]', function() {
        dataValue($(this));
    });

    /**
     * Phone
     */

    let phonemask = $('.phone-mask');

    if (phonemask.length)
        phonemask.inputmask({
            mask: '+9 (999) 999-99-99',
            clearMaskOnLostFocus: true,
            clearIncomplete: true
        });

    /**
     * Callback
     */

    $('#form-callback').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        t.find('input[data-value]').each(function() {
            dataValue($(this));
        });

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=callback',
            url: 'index.php?route=mail/callback',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error') {
                    $.each(json.message, function(index, value) {
                        let item = t.find('input[name="' + index + '"]');

                        if (item.length) {
                            let message = '';

                            for (let obj in value) {
                                let i = Object.keys(value).indexOf(obj);

                                if (i === 0) {
                                    message = value[obj];
                                    break;
                                }
                            }

                            item.attr('data-value', item.val().trim()).val(message);
                        }
                    });
                }

                else {
                    t.before('<span class="form-message" style="color: green">' + json.message + '</span>').remove();

                    if (json.redirect) location = json.redirect;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $('#form-callback').on('focus', 'input[data-value]', function() {
        dataValue($(this));
    });

    /**
     * Subscription
     */

    $('#form-subscription').on('submit', function(e){
        e.preventDefault();
        let t = $(this);
        let btn = t.find('input[type="submit"]');

        if(btn.hasClass('working')) return;

        t.find('input[data-value]').each(function() {
            dataValue($(this));
        });

        $.ajax({
            type: 'post',
            data: t.serialize() + '&action=subscription',
            url: 'index.php?route=common/subscription',
            dataType: 'json',
            beforeSend: function() {
                btn.addClass('working')
                .css({'filter': 'grayscale(100%) contrast(90%)'});
            },
            complete: function() {
                btn.removeClass('working')
                .css({'filter': 'none'});
            },
            success: function(json) {
                if (json.status == 'error') {
                    $.each(json.message, function(index, value) {
                        let item = t.find('input[name="' + index + '"]');

                        if (item.length) {
                            let message = '';

                            for (let obj in value) {
                                let i = Object.keys(value).indexOf(obj);

                                if (i === 0) {
                                    message = value[obj];
                                    break;
                                }
                            }

                            item.attr('data-value', item.val().trim()).val(message);
                        }
                    });
                }

                else {
                    t.before('<span class="form-message" style="color: green">' + json.message + '</span>').remove();

                    if (json.redirect) {
                        setTimeout(function () {
                            location = json.redirect;
                        }, 3000);
                    }
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    });

    $('#form-subscription').on('focus', 'input[data-value]', function() {
        dataValue($(this));
    });

});