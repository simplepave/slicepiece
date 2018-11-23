/**
 * getURLVar
 */

function getURLVar(key) {
    var value = [];

    var query = String(document.location).split('?');

    if (query[1]) {
        var part = query[1].split('&');

        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');

            if (data[0] && data[1]) {
                value[data[0]] = data[1];
            }
        }

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    } else {            // Изменения для seo_url от Русской сборки OpenCart 2x
        var query = String(document.location.pathname).split('/');
        if (query[query.length - 1] == 'cart') value['route'] = 'checkout/cart';
        if (query[query.length - 1] == 'checkout') value['route'] = 'checkout/checkout';

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    }
}

/**
 * Search
 */

$('#form-search .submit-search_popup').on('click', function() {
    var url = $('base').attr('href') + 'index.php?route=product/search';

    var value = $('#form-search input[name=\'search\']').val();

    if (value.length) {
        url += '&search=' + encodeURIComponent(value);
        location = url;
    }
});

$('#form-search input[name=\'search\']').on('keydown', function(e) {
    if (e.keyCode == 13) {
        $('#form-search .submit-search_popup').trigger('click');
    }
});

/**
 * In Cart
 */

$(document).ready(function() {
        $.post('index.php?route=checkout/cart/in_cart', function(json) {
            if (json.count > 0) {
                $('.header-in-cart').html(json['count']).show();

                // if(!$('#checkout-simplecheckout').length)
                if (getURLVar('route') != 'checkout/cart' && getURLVar('route') != 'checkout/checkout')
                    setTimeout(function () {
                        $('#cart-total').html(json['total']);
                        $('.basket_wrapp').css({'bottom' : '0'});
                    }, 100);
            }
       },'json');
});

/**
 * Cart
 */

var cart = {
    'add': function(product_id, quantity) {

        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                // $('#cart > button').button('loading');
            },
            complete: function() {
                // $('#cart > button').button('reset');
            },
            success: function(json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {

                    setTimeout(function () {
                        $('.header-in-cart').html(json['count']).show();
                        $('#cart-total').html(json['total']);
                        $('.basket_wrapp').css({'bottom' : '0'});
                    }, 100);

                    // $('html, body').animate({ scrollTop: 0 }, 'slow');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'update': function(key, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/edit',
            type: 'post',
            data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function(key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
};

/**
 * Wishlist
 */

var wishlist = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=account/wishlist/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    alert(json['jweb_success']);
                    // $('#content').parent().before('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                }

                if (json['formreg']) {
                    $.magnificPopup.open({
                        removalDelay: 300,
                        items: {src: '#form-entrance'},
                        type: 'inline'
                    });
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}