
/* Page related things */

$().ready(function() {
    //Initialize pages
    buttonsInit();
    countdownInit();

    //Make buttons work
    uploadClick();
    compressClick();
    settingsClick();

    //Work out the scrolling and arrows
    triggerPageRotation();
});

var pageArray = [];
var pagePosition = [];
var pageCurrent = 0;
var pageWidth = 0;

var canScrollMore = 1;

const triggerPageRotation = function () {

    $(window).bind('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta >= 0) {
            forceScroll(1);
        }
        else {
            forceScroll(-1);
        }
    });

    $(document).keydown(function(e) {
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
    });
};

const forceScroll = function (upordown) {
    let moved = 0;
    if (canScrollMore === 1) {
        canScrollMore = 0;
        $('.href').each(function (i) {

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
        $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');
    });
};

const buttonsInit = function () {

    //count pages and transform them
    $('.page').each(function(i) {

        $('#pages-wrapper').css('width', 100*(i+1) + '%');
        pageWidth = 100/(i+1);
    });

    $('.page').each(function(i) {

        pageArray[i] = '#page' + i;
        pagePosition[i] = 100 * i;
        $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');

        $(pageArray[i]).css('width', pageWidth + '%');
    });

    //Make first one already highlighted on start
    $('.href').each(function(i) {

        if(i === 0)
            $(this).children('p').addClass('underline').fadeIn();

        else
            $(this).children('p').addClass('underline').fadeOut();
    });

    //Make every button clickable
    $('.href').each(function(i) {

        $(this).on("click", function(){

            if( pageCurrent !== i) {
                $('.href').children('p').fadeOut();
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
        $('#joke').css('animation', 'fade-in 0.5s ease-out forwards');
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
        countdownID.text("1111111111111111111");
        return;
    }

    //add leading zeros
    while(countdownContent.length < 19) {
        countdownContent = "0" + countdownContent;
    }

    countdownID.text(countdownContent);
};

const showOptions = function () {
    $('#leftmainpage').addClass('leftmainpage_anim');
    $('#rightmainpage').addClass('rightmainpage_anim');
};

const uploadClick = function () {

    $('#myfile').change(function (e) {
        let file = e.target.files[0];

        if(file) {
            $('#myfile + label > p').fadeOut('', function() {
                $('#myfile + label > p').addClass('underline_yellow').fadeIn();
            });
            showOptions();
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            let codes = new Uint8Array(e.target.result);
            let encoding = Encoding.detect(codes);
            let unicodeString = Encoding.convert(codes, {
                to: 'unicode',
                from: encoding,
                type: 'string'
            });

            $('#file_encoding').text('Encoding: ' + encoding);
            $('#file_name').text('File Name: ' + file.name);
            $('#file_size').text('Size: ' + file.size + ' bytes');
            $('#text').text(unicodeString.substring(0, ($(window).width() + $(window).height())) + '...');
            //uploadedString = unicodeString;
        };

        reader.readAsArrayBuffer(file);
    });
};

const compressClick = function () {

    $('.submit_button').on("click", function(){
        console.log('clicked');
    });
};

const settingsClick = function () {
    let checkboxNames = ['BS', 'MTF', 'HA'];

    checkboxNames.forEach(function (value) {
        $('#' + value).change(function() {
            if($(this).is(":checked")) {
                $('#' + value + 'c').text('1').css('color', '');
                return;
            }
            $('#' + value + 'c').text('0').css('color', '#FEFCFF');
        });
    });
};

const downloadFile = function (filename, content) {
    let e = document.createElement('a');
    e.setAttribute('href', 'data:octet/stream,' + encodeURIComponent(content));
    e.setAttribute('download', filename);

    e.style.display = 'none';
    document.body.appendChild(e);

    e.click();

    document.body.removeChild(e);
};

const saveByteArray = function (data, name) {
    var a = document.createElement("a");
    a.style.display = 'none';
    document.body.appendChild(a);

    var blob = new Blob([data], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
};
