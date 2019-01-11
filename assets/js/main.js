var pageArray = [];
var pagePosition = [];
var pageCurrent = 0;
var pageWidth = 0;

const updatePages = function () {
    $('.page').each(function(i, obj) {
        $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');
    });
}

const buttonsInit = function () {

    //count pages and transform them
    $('.page').each(function(i, obj) {

        $('#pages-wrapper').css('width', 100*(i+1) + '%');
        pageWidth = 100/(i+1);
    });
    $('.page').each(function(i, obj) {

        pageArray[i] = '#page' + i;
        pagePosition[i] = 100 * i;
        $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');

        $(pageArray[i]).css('width', pageWidth + '%');
    });

    //Make first one already highlighted on start
    $('.href').each(function(i, obj) {

        if(i === 0)
            $(this).children('p').addClass('underline').fadeIn();

        else
            $(this).children('p').addClass('underline').fadeOut();
    });

    //Make every button clickable
    $('.href').each(function(i, obj) {

        $(this).on("click", function(){

            $('.href').children('p').fadeOut();
            $(this).children('p').fadeIn();

            while(pageCurrent != i) {
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

const countdownInit = function (cssClass) {

    let countdownID = $(cssClass);
    let countdownContent = countdownID.text().toString();

    countdownContent = parseInt(countdownContent, 2);
    countdownContent = (countdownContent - 1).toString(2);

    //reset when countdown ends
    if(countdownContent < 0){
        countdownID.text("1111111111111111111");
        return;
    }

    //add leading zeros
    while(countdownContent.length <= 19) {
        countdownContent = "0" + countdownContent;
    }

    countdownID.text(countdownContent);
};

$(document).ready(function() {
    buttonsInit();
    setInterval(countdownInit, 1, '#countdown');
});