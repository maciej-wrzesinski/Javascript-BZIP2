var pageArray = [];
var pagePosition = [];
var pageCurrent = 0;
var pageWidth = 0;

var uploadedString = 0;

const updatePages = function () {
    $('.page').each(function(i, obj) {
        $(pageArray[i]).css('transform', 'translateX(' + pagePosition[i] + '%)');
    });
};

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
            uploadedString = unicodeString;
        };

        reader.readAsArrayBuffer(file);
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
    e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    e.setAttribute('download', filename);

    e.style.display = 'none';
    document.body.appendChild(e);

    e.click();

    document.body.removeChild(e);
};

const swapElementsArray = function (textArray, index1, index2) { //this swaps elements in array
    textArray[index1] = textArray.splice(index2, 1, textArray[index1])[0];
    return textArray;
};

const sortAlphabetically = function (text, indexes, size) { //this sorts an array of indexes in the way that all the elements in char array are sorted alphabetically
    let sorted = []

    let i = 0;
    while (i !== size) {
        if (text[i] > text[i + 1]) {
            swapElementsArray(text, i, i + 1);
            swapElementsArray(indexes, i, i + 1);
            --i;
        }
        else
            ++i;
    }

    return indexes;
};

const compressBWT = function (text, indexOriginal) {
    let size = text.length;
    let indexes = [];

    //get all indexes
    for (let i = 0; i < size; i++) {
        indexes[i] = i;
    }

    text = text.split('');
    sortedText = text.slice();
    sortedIndexes = indexes.slice();

    //sort both text and indexes alphabetically
    sortAlphabetically(sortedText, sortedIndexes, size);

    //find the string 'sorted text - 1'
    let finalText = [];
    for (let i = 0; i < size; i++) {
        finalText[i] = text[(sortedIndexes[i] - 1 + size) % size];
    }

    //find index in sorted text that starts original text in sorted indexes
    for (let i = 0; i < size; i++) {
        if (sortedIndexes[i] === 0 ) {
            indexOriginal.value = i;
            break;
        }
    }

    return finalText.join('');
};

const decompressBWT = function (compressedText, originalIndex) {
    let size = text.length;

    return 0;
};

$().ready(function() {
    //Initialize pages
    buttonsInit();
    countdownInit();

    //Make settings and upload buttons work
    uploadClick();
    settingsClick();

    //Prepare and start the countdown



    let indexOriginal = { value: 0 };
    let compressedText = compressBWT('ehhh workworkwork', indexOriginal);

    console.log(decompressBWT(compressedText, indexOriginal.value));

    $('.submit_button').on("click", function(){
        console.log('clicked');
        if( uploadedString === 0) {
            console.log('error');
        }

        console.log(compressBWT(uploadedString, indexOriginal));

    });
});

