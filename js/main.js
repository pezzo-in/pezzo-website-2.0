var classicLayout = false;
var portfolioKeyword;
var $container, $blog_container;
(function ($) {
    $(function () {
        FastClick.attach(document.body);
        NProgress.start();
        var rotate_words = $('.rotate-words');
        if (rotate_words.length && Modernizr.csstransforms) {
            rotate_words.find('span').eq(0).addClass('active');
            setInterval(function () {
                next_word_index = rotate_words.find('.active').next().length ? rotate_words.find('.active').next().index() : 0;
                rotate_words.find('.active').addClass('rotate-out').removeClass('rotate-in active');
                rotate_words.find('span').eq(next_word_index).addClass('rotate-in active').removeClass('rotate-out');
            }, 3000);
        }
        var latest_tweets = $('#latest-tweets');
        if (latest_tweets.length) {
            twitterFetcher.fetch(latest_tweets.attr("data-twitterId"), '', latest_tweets.attr("data-tweet-count"), true, false, true, '', false, handleTweets);
        }
        function handleTweets(tweets) {
            var x = tweets.length;
            var n = 0;
            var html = '<ul>';
            while (n < x) {
                html += '<li>' + tweets[n] + '</li>';
                n++;
            }
            html += '</ul>';
            latest_tweets.html(html);
        }

        $('.search-link').click(function () {
            $(this).toggleClass('active');
            $('.header-search').slideToggle();
        });
        if ($('html').hasClass('one-page-layout')) {
            portfolioKeyword = $('section.portfolio').attr('id');
            initialize();
            var detailUrl = giveDetailUrl();
            var pagesCount = $('.wrapper > section').length;
            var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
            classicLayout = $('html').attr('data-classic-layout') === 'true';
            classicLayout = classicLayout || ($('html').attr('data-mobile-only-classic-layout') === 'true' && $(window).width() < 768);
            classicLayout = classicLayout || !Modernizr.csstransforms3d || pagesCount < 3 || isIE11;
            if (classicLayout) {
                $('html').addClass('classic-layout');
                setActivePage();
                setTimeout(function () {
                    setMasonry();
                }, 600);
                setTimeout(function () {
                    setBlogMasonry();
                }, 600);
                $.address.change(function () {
                    setActivePage();
                    initializeMap();
                    setTimeout(function () {
                        setMasonry();
                    }, 100);
                    setTimeout(function () {
                        setBlogMasonry();
                    }, 100);
                });
            }
            $.initTripleLayout();
            $.address.change(function () {
                var detailUrl = giveDetailUrl();
                if (detailUrl != -1) {
                    showProjectDetails(detailUrl);
                } else {
                    if ($.address.path().indexOf("/" + portfolioKeyword) != -1) {
                        hideProjectDetails(true, false);
                    }
                }
            });
        }
        $container = $('.portfolio-items');
        if ($container.length) {
            $container.imagesLoaded(function () {
                $container.isotope({itemSelector: '.hentry', layoutMode: $(this).attr('data-layout')});
                setMasonry();
                $(window).resize(function () {
                    setMasonry();
                    setTimeout(function () {
                        setMasonry();
                    }, 400);
                });
                $('#filters a').click(function () {
                    var selector = $(this).attr('data-filter');
                    setMasonry();
                    $container.isotope({filter: selector});
                    $(this).parent().addClass('current').siblings().removeClass('current');
                    return false;
                });
            });
        }
        $blog_container = $('.latest-posts');
        if ($blog_container.length) {
            $blog_container.imagesLoaded(function () {
                $blog_container.isotope({itemSelector: '.hentry', layoutMode: $(this).attr('data-layout')});
                setBlogMasonry();
                $(window).resize(function () {
                    setTimeout(function () {
                        setBlogMasonry();
                    }, 600);
                });
            });
        }
        setup();
        $(".one-page-layout a.ajax").live('click', function () {
            var returnVal;
            var url = $(this).attr('href');
            var baseUrl = $.address.baseURL();
            if (url.indexOf(baseUrl) != -1) {
                var total = url.length;
                detailUrl = url.slice(baseUrl.length + 1, total);
            } else {
                detailUrl = url;
            }
            $.address.path(portfolioKeyword + '/' + detailUrl);
            return false;
        });
        $('#commentform').addClass('validate-form');
        $('#commentform').find('input,textarea').each(function (index, element) {
            if ($(this).attr('aria-required') == "true") {
                $(this).addClass('required');
            }
            if ($(this).attr('name') == "email") {
                $(this).addClass('email');
            }
        });
        if ($('.validate-form').length) {
            $('.validate-form').each(function () {
                $(this).validate();
            });
        }
        fillBars();
        $('.tooltip').each(function (index, element) {
            $(this).tooltipster({
                position: $(this).attr('data-tooltip-pos'),
                fixedWidth: 300,
                offsetX: 8,
                animation: "grow",
                delay: 50
            });
        });
        function initialize() {
            var bangalore = new google.maps.LatLng(12.915633, 77.546665);
            var hyderabad = new google.maps.LatLng(17.385044, 78.486671);
            var center = new google.maps.LatLng(15.434487, 77.942505);
            var pezzo = '../images/site/marker.png';
            var mapOptions = {
                zoom: 6,
                center: center
            }
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var marker_bangalroe = new google.maps.Marker({
                position: bangalore,
                map: map,
                title: 'Hello World!',
                icon: pezzo
            });
            var marker_hyderabad = new google.maps.Marker({
                position: hyderabad,
                map: map,
                title: 'Hello World!',
                icon: pezzo
            });
        }

        google.maps.event.addDomListener(window, 'load', initializeMap);
    });
    window.onload = function () {
        NProgress.done();
    };
    var inAnimation, outAnimation;

    function initialize() {
        inAnimation = $('html').attr('data-inAnimation');
        outAnimation = $('html').attr('data-outAnimation');
    }

    function setup() {
        setupLigtbox();
        if ($('.prettyprint').length) {
            window.prettyPrint && prettyPrint();
        }
        $('.tabs').each(function () {
            if (!$(this).find('.tab-titles li a.active').length) {
                $(this).find('.tab-titles li:first-child a').addClass('active');
                $(this).find('.tab-content > div:first-child').show();
            } else {
                $(this).find('.tab-content > div').eq($(this).find('.tab-titles li a.active').parent().index()).show();
            }
        });
        $('.tabs .tab-titles li a').click(function () {
            if ($(this).hasClass('active')) {
                return;
            }
            $(this).parent().siblings().find('a').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.tabs').find('.tab-content > div').hide().eq($(this).parent().index()).show();
            return false;
        });
        var toggleSpeed = 300;
        $('.toggle h4.active + .toggle-content').show();
        $('.toggle h4').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).next('.toggle-content').stop(true, true).slideUp(toggleSpeed);
            } else {
                $(this).addClass('active');
                $(this).next('.toggle-content').stop(true, true).slideDown(toggleSpeed);
                if ($(this).parents('.toggle-group').hasClass('accordion')) {
                    $(this).parent().siblings().find('h4').removeClass('active');
                    $(this).parent().siblings().find('.toggle-content').stop(true, true).slideUp(toggleSpeed);
                }
            }
            return false;
        });
        if ($('.media-wrap, .portfolio-single').length) {
            $(".media-wrap, .portfolio-single").fitVids();
        }
        $("select:not([multiple]), input:checkbox, input:radio, input:file").uniform();
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        if (isAndroid) {
            $('html').addClass('android');
        }
        var $flexslider = $('.flexslider');
        if ($flexslider.length) {
            $flexslider.each(function () {
                $(this).imagesLoaded(function () {
                    $(this).find('.loading').remove();
                    $(this).flexslider({
                        smoothHeight: true,
                        slideshow: $(this).attr('data-autoplay') != "false",
                        slideshowSpeed: $(this).attr('data-interval'),
                        animationSpeed: $(this).attr('data-animationSpeed'),
                        animation: $(this).attr('data-animation'),
                        direction: $(this).attr('data-direction'),
                        directionNav: $(this).attr('data-directionNav') != "false",
                        controlNav: $(this).attr('data-controlNav') != "false",
                        randomize: $(this).attr('data-randomize') == "true",
                        startAt: $(this).attr('data-startAt') != null ? parseInt($(this).attr('data-startAt')) : 0,
                        animationLoop: $(this).attr('data-animationLoop') != "false",
                        pauseOnHover: $(this).attr('data-pauseOnHover') != "false",
                        reverse: $(this).attr('data-reverse') == "true",
                        prevText: "",
                        nextText: "",
                        start: function (slider) {
                            $('.slides li img').click(function (event) {
                                event.preventDefault();
                                slider.flexAnimate(slider.getTarget("next"));
                            });
                        }
                    });
                });
            });
        }
        if ($('video,audio').length) {
            $('video,audio').mediaelementplayer({audioHeight: 50});
        }
    }

    function setActivePage() {
        $('.page').removeClass('active').hide();
        var path = $.address.path();
        path = path.slice(1, path.length);
        path = giveDetailUrl() != -1 ? portfolioKeyword : path;
        if (path == "") {
            var firstPage = $('.vs-nav li').first().find('a').attr('href');
            path = firstPage.slice(2, firstPage.length);
            $.address.path(path);
            return false;
        }
        $('#' + path).fadeIn();
        $('.page.active').hide();
        $('#' + path).addClass('active');
        setCurrentMenuItem();
        if (path.indexOf(portfolioKeyword) != -1) {
            setTimeout(function () {
                setMasonry();
            }, 100);
        }
        $("body").scrollTop(0);
    }

    function setMasonry() {
        var itemPerRow = 4;
        var containerW = $container.width();
        var items = $container.children('.hentry');
        var columns, columnWidth;
        var viewports = [{width: 1300, columns: itemPerRow}, {width: 900, columns: itemPerRow - 1}, {
            width: 480,
            columns: itemPerRow - 2
        }, {width: 0, columns: itemPerRow - 3}];
        for (var i = 0, len = viewports.length; i < len; ++i) {
            var viewport = viewports[i];
            if (containerW > viewport.width) {
                columns = viewport.columns;
                break;
            }
        }
        items.each(function (index, element) {
            var multiplier = $(this).hasClass('x2') && columns > 1 ? 2 : 1;
            var itemWidth = (Math.floor(containerW / columns) * 100 / containerW) * multiplier;
            $(this).css('width', itemWidth + '%');
        });
        columnWidth = Math.floor(containerW / columns);
        $container.isotope('reLayout').isotope('option', {masonry: {columnWidth: columnWidth}});
    }

    function setBlogMasonry() {
        var itemPerRow = 4;
        var containerW = $blog_container.width();
        var items = $blog_container.children('.hentry');
        var columns, columnWidth;
        var viewports = [{width: 1300, columns: itemPerRow}, {width: 900, columns: itemPerRow - 1}, {
            width: 480,
            columns: itemPerRow - 2
        }, {width: 0, columns: itemPerRow - 3}];
        for (var i = 0, len = viewports.length; i < len; ++i) {
            var viewport = viewports[i];
            if (containerW > viewport.width) {
                columns = viewport.columns;
                break;
            }
        }
        items.each(function (index, element) {
            var multiplier = $(this).hasClass('x2') && columns > 1 ? 2 : 1;
            var itemWidth = (Math.floor(containerW / columns) * 100 / containerW) * multiplier;
            $(this).css('width', itemWidth + '%');
        });
        columnWidth = Math.floor(containerW / columns);
        $blog_container.isotope('reLayout').isotope('option', {masonry: {columnWidth: columnWidth}});
    }

    function fillBars() {
        $('.bar').each(function () {
            var bar = $(this);
            bar.find('.progress').css('width', bar.attr('data-percent') + '%');
        });
    }

    function setupLigtbox() {
        $('.lightbox').each(function (index, element) {
            $(this).attr('rel', $(this).attr('data-lightbox-gallery'));
        });
        if ($("a[rel^='fancybox']").length) {
            $("a[rel^='fancybox']").fancybox({
                centerOnScroll: true,
                padding: 10,
                margin: 44,
                width: 640,
                height: 360,
                transitionOut: 'none',
                overlayColor: '#BEBD97',
                overlayOpacity: '.6',
                onStart: function () {
                    NProgress.start();
                    $('body').addClass('lightbox-active');
                },
                onClosed: function () {
                    $('body').removeClass('lightbox-active');
                },
                onComplete: function () {
                    NProgress.done();
                    if ($(this).attr('href').indexOf("soundcloud.com") >= 0) {
                        $('#fancybox-content').height(166);
                    }
                }
            });
        }
    }

    function setCurrentMenuItem() {
        var activePageId = $('.page.active').attr('id');
        $('.vs-nav a[href$=' + activePageId + ']').parent().addClass('current_page_item').siblings().removeClass('current_page_item');
    }

    var pActive;

    function showProjectDetails(url) {
        showLoader();
        var p = $('.p-overlay:not(.active)').first();
        pActive = $('.p-overlay.active');
        if (pActive.length) {
            hideProjectDetails();
        }
        p.empty().load(url + ' .portfolio-single', function () {
            NProgress.set(0.5);
            p.imagesLoaded(function () {
                hideLoader();
                $('html').addClass('p-overlay-on');
                $("body").scrollTop(0);
                setup();
                if (Modernizr.csstransforms && Modernizr.csstransforms3d) {
                    p.removeClass('animated ' + outAnimation + " " + inAnimation).addClass('animated ' + inAnimation).show();
                } else {
                    p.fadeIn();
                }
                p.addClass('active');
            });
        });
    }

    function hideProjectDetails(forever, safeClose) {
        $("body").scrollTop(0);
        if (forever) {
            pActive = $('.p-overlay.active');
            $('html').removeClass('p-overlay-on');
            if (!safeClose) {
                $.address.path(portfolioKeyword);
            }
        }
        pActive.removeClass('active');
        if (Modernizr.csstransforms && Modernizr.csstransforms3d) {
            pActive.removeClass('animated ' + inAnimation).addClass('animated ' + outAnimation);
            setTimeout(function () {
                pActive.hide().removeClass(outAnimation).empty();
            }, 1010)
        } else {
            pActive.fadeOut().empty();
        }
    }

    function giveDetailUrl() {
        var address = $.address.value();
        var detailUrl;
        if (address.indexOf("/" + portfolioKeyword + "/") != -1 && address.length > portfolioKeyword.length + 2) {
            var total = address.length;
            detailUrl = address.slice(portfolioKeyword.length + 2, total);
        } else {
            detailUrl = -1;
        }
        return detailUrl;
    }

    function showLoader() {
        NProgress.start();
    }

    function hideLoader() {
        NProgress.done();
    }
})(jQuery);