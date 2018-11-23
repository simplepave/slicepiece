/* Бургер меню*/
$(function(){
 $('.menu-btn').on('click', function() {
 	$(this).toggleClass('menu-btn_active');
  $('.open-menu').slideToggle(300, function(){
   if( $(this).css('display') === "none"){
       $(this).removeAttr('style');
   }
  });
 });
});

 $(function(){
   $("input[type='number']").prop('min',0);
   $("input[type='number']").prop('max',120000);
});

/* Сортировка товаров */
$(function(){
 $('.price-down').on('click', function() {
  $(this).toggleClass('active');
  $('.price-up').removeClass('active');
  $('.sorting-new').removeClass('active');
  $('.sorting-popularity').removeClass('active');
 });
});

$(function(){
 $('.price-up').on('click', function() {
  $(this).toggleClass('active');
  $('.price-down').removeClass('active');
  $('.sorting-new').removeClass('active');
  $('.sorting-popularity').removeClass('active');
 });
});

$(function(){
 $('.sorting-popularity').on('click', function() {
  $(this).toggleClass('active');
  $('.price-down').removeClass('active');
  $('.price-up').removeClass('active');
  $('.sorting-new').removeClass('active');
  $('.sorting-price').removeClass('active');
 });
});

$(function(){
 $('.sorting-new').on('click', function() {
  $(this).toggleClass('active');
  $('.price-down').removeClass('active');
  $('.price-up').removeClass('active');
  $('.sorting-popularity').removeClass('active');
  $('.sorting-price').removeClass('active');
 });
});


$(function(){
 $('.list-view').on('click', function() {
  $('.sorting-view').removeClass('active');
  $(this).toggleClass('active');
  $('.product-list .popular-goods_product').addClass('product-view-list');
  $('.product-list .product-specifications').css({"display":"block"});
 });
});

$(function(){
 $('.grid-view').on('click', function() {
  $('.sorting-view').removeClass('active');
  $(this).toggleClass('active');
  $('.product-list .popular-goods_product').removeClass('product-view-list');
  $('.product-list .product-specifications').css({"display":"none"});
 });
});


/* Выбор цвета */
$(function(){
 $('.color-product').on('click', function() {
  $('.color-product.active').removeClass('active');
  $(this).toggleClass('active');
 });
});


$(document).ready(function() {
	var owl = $('.popular-goods-slider');
    	owl.owlCarousel({
		margin:10,
		nav: true,
    dots: true,
		loop: true,
		responsive:{
			0:{
            items:1
         	},
			768 :{
          		items:2
        	},
			 992:{
          		items:3
        	},
			1200:{
          		items:4
        	}

		}
	})
})

$(document).ready(function() {
  var owl = $('.other-news-slider');
      owl.owlCarousel({
    margin:20,
    nav: true,
    loop: true,
    dots: true,
    responsive:{

      0:{
            items:1
          },
      1200:{
            items:2
          }
    }
  })
})

$(document).ready(function() {
  $('.popup').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#call',

    callbacks: {
      beforeOpen: function() {
        if($(window).width() < 700) {
          this.st.focus = false;
        } else {
          this.st.focus = '#call';
        }
      }
    }
  });
});

$(document).ready(function() {
$('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  asNavFor: '.slider-nav'

});
$('.slider-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '.slider-for',
  dots: true,
  centerMode: true,
  focusOnSelect: true
});
});


// $(function () {
//     $("#priceSlider").ionRangeSlider({
//     type: "double",
//     min: 0,
//     max: 120000,
//     from: 0,
//     to: 120000,
// });
// });