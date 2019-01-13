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
            $('#text').text(unicodeString.substring(0, 2500) + '...');

        };

        reader.readAsArrayBuffer(file);
    });
};

$().ready(function() {
    buttonsInit();
    setInterval(countdownInit, 1, '#countdown');
    uploadClick();

    $('footer').hover(function () {
        $('#joke').css('animation', 'fade-in 0.5s ease-out forwards');
    });

    $('#BS').change(function() {
        if($(this).is(":checked")) {
            $('#BSc').text('1').css('color', '');
            return;
        }
        $('#BSc').text('0').css('color', '#FEFCFF');
    });

    $('#MTF').change(function() {
        if($(this).is(":checked")) {
            $('#MTFc').text('1').css('color', '');
            return;
        }
        $('#MTFc').text('0').css('color', '#FEFCFF');
    });

    $('#HA').change(function() {
        if($(this).is(":checked")) {
            $('#HAc').text('1').css('color', '');
            return;
        }
        $('#HAc').text('0').css('color', '#FEFCFF');
    });

});

