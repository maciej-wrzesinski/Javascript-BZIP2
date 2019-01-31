
/* Page related things */

var pageArray = [];
var pagePosition = [];
var pageCurrent = 0;
var pageWidth = 0;

var canScrollMore = 1;

var isMobile = 0;

$(window)
    .load(function() {
        setTimeout(
            function() {
                $('#js-loader').fadeOut();
            }, 2000);
    })
    .on('resize', function(){
        setMobile();
        buttonsInit();
    });

$().ready(function() {
    //Pagination on mobile
    setMobile();

    //Initialize pages
    buttonsInit();

    //Little counter on footer
    countdownInit();

    //Work out the scrolling and arrows
    triggerPageRotation();

    //turn off all animations after x seconds so the resize works fine

    //BZIP2 work work work
    let bzip2 = new BZIP2();
    triggerCompression(bzip2);


    //test


    $('#burger').on('click', function () {
        $('#mobile-menu').toggleClass('visable');
        $('.mobile-overlay').fadeToggle();
    });
    $('.mobile-overlay').on('click', function () {
        $('#mobile-menu').toggleClass('visable');
        $('.mobile-overlay').fadeToggle();
    });

});

const setMobile = function () {
    if ($(window).width() <= 991) {
        isMobile = 1;
    }
    else {
        isMobile = 0;
    }

    //set the mobile page height to just right
    $('.page').css('height', $(window).height()-$('footer').height()-$('nav').height());
}

const triggerPageRotation = function () {

    var canScroll = 1;

    $('#inputarea')
        .mouseover(function(){
            canScroll = 0;
        })
        .mouseout(function(){
            canScroll = 1;
        });

    $('#outputarea')
        .mouseover(function(){
            canScroll = 0;
        })
        .mouseout(function(){
            canScroll = 1;
        });

    $(window).bind('mousewheel', function(e) {
        if (canScroll === 1) {
            if (e.originalEvent.wheelDelta >= 0) {
                forceScroll(1);
            }
            else {
                forceScroll(-1);
            }
        }
    });

    $(document).keydown(function(e) {
        if ($('#inputarea').prop('selectionStart') === 0 && $('#outputarea').prop('selectionStart') === 0) {
            switch(e.which) {
                case 37: // left
                    forceScroll(1);
                    break;

                case 38: // up
                    forceScroll(1);
                    break;

                case 39: // right
                    forceScroll(-1);
                    break;

                case 40: // down
                    forceScroll(-1);
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        }
    });
};

const forceScroll = function (upordown) {
    let moved = 0;
    if (canScrollMore === 1) {
        canScrollMore = 0;
        $('.js-href').each(function (i) {

            if (i === pageCurrent - upordown && moved === 0) {
                $(this).click();
                moved = 1;
            }
        });
        setTimeout(function () {
            canScrollMore = 1;
        }, 250);
    }
};

const updatePages = function () {
    $('.page').each(function(i) {
        if (isMobile === 0)
            $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');
        else
            $(pageArray[i]).css('transform', '');
    });
};

const buttonsInit = function () {
    //reset the scroll so the pagination works always when resized
    pageCurrent = 0;

    $('.page')
    //count pages
        .each(function(i) {

            if (isMobile === 0) {
                $('#pages-wrapper').css('width', 100 * (i + 1) + '%');
                pageWidth = 100 / (i + 1);
            }
            else {
                $('#pages-wrapper').css('width', '');
            }
        })
    //and transform them
        .each(function(i) {

            pageArray[i] = '#page' + i;
            pagePosition[i] = 100 * i;

            if (isMobile === 0) {
                $(pageArray[i])
                    .css('transform', 'translateX(' + pagePosition[i] + '%)')
                    .css('width', pageWidth + '%')
                    .css('float', 'left');
            }
            else {
                $(pageArray[i])
                    .css('transform', '')
                    .css('width', '')
                    .css('float', '');
            }
        });

    $('.js-href')
    //Make first one already highlighted on start
        .each(function(i) {

            if(i === 0)
                $(this).children('p').addClass('underline').fadeIn();

            else
                $(this).children('p').addClass('underline').fadeOut();
        })
    //Make every button clickable
        .each(function(i) {

            $(this).on('click', function(){

                if( pageCurrent !== i) {
                    $('.js-href').children('p').fadeOut();
                    $(this).children('p').fadeIn();
                }

                while(pageCurrent !== i) {
                    if(pageCurrent > i) {//odejmujemy
                        $('.page').each(function (i, obj) {
                            pagePosition[i] += 200;
                        });
                        updatePages();
                        pageCurrent--;
                    }
                    else if(pageCurrent < i) {//dodajemy
                        $('.page').each(function (i, obj) {
                            pagePosition[i] -= 200;
                        });
                        updatePages();
                        pageCurrent++;
                    }
                }


            });
        });
};

const countdownInit = function () {

    $('footer').hover(function () {
        $('#js-joke').css('animation', 'fade-in 0.5s ease-out forwards');
    });
    setInterval(countdownWork, 1, '#countdown');
};

const countdownWork = function (cssClass) {

    let countdownID = $(cssClass);
    let countdownContent = countdownID.text().toString();

    countdownContent = parseInt(countdownContent, 2);
    countdownContent = (countdownContent - 1).toString(2);

    //reset when countdown ends
    if(countdownContent < 0){
        countdownID.text('1111111111111111111');
        return;
    }

    //add leading zeros for prettiness
    while(countdownContent.length < 19) {
        countdownContent = '0' + countdownContent;
    }

    countdownID.text(countdownContent);
};

const triggerCompression = function (bzip2) {

    $('#compress').on('click', function(){
        var text = $.trim($('#inputarea').val());
        if (text !== '') {

            $('#outputarea').val(bzip2.compress(text));

        }
    });

    $('#decompress').on('click', function(){
        var text = $.trim($('#inputarea').val());
        if (text !== '') {

            $('#outputarea').val(bzip2.decompress(text));

        }
    });
};
