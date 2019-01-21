/* Page related things */
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
    e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    e.setAttribute('download', filename);

    e.style.display = 'none';
    document.body.appendChild(e);

    e.click();

    document.body.removeChild(e);
};

$().ready(function() {
    //Initialize pages
    buttonsInit();
    countdownInit();

    //Make buttons work
    uploadClick();
    compressClick();
    settingsClick();

    //Work out the scrolling
    triggerPageRotation();

    const bzip2 = new BZIP2();
    let text = 'this is a very nice conversation <>?::"{}][;/., !@#$%^&*())_+  +_)(*&^%$#@! 1234567890-= =-0987654321 Z!x2C#v4B%n6M&pomoc7557 Hello :)  ';
    let compressedText = bzip2.compress(text);
    let decompressedText = bzip2.decompress(compressedText);
    console.log('-------------------------')
    console.log(compressedText);
    console.log(decompressedText);

    console.log(text == decompressedText)
});

/* BZIP2 algorithm */

function BZIP2() {
    var that = this;
    this.originalStartingIndex = 0;
    this.maxChar = 0;

    /* usable methods */

    this.compress = function(dataString) {
        //get max char so we can limit char buckets
        for (let i = 0; i < dataString.length; i++)
            if (dataString[i].charCodeAt(0) > this.maxChar)
                this.maxChar = dataString[i].charCodeAt(0);
        this.maxChar++;

        return doHuffmans(doMoveToFront(doBurrowsWheelerTransform(dataString)));
    }

    this.decompress = function(dataString) {
        return undoBurrowsWheelerTransform(undoMoveToFront(undoHuffmans(dataString)));
    }

    /* private methods that private methods below use */

    let sortWithIndeces = function (originalArray) {
        let size = originalArray.length;
        let toSort = new Array(size);

        //add indeces and arrange it this way so .sort() can work with this properly
        for (let i = 0; i < originalArray.length; i++) {
            toSort[i] = [originalArray.slice().splice(i, originalArray.length).join('') + originalArray.join(''), i];
        }

        //sort them out
        toSort.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });

        toSort.sortIndices = [];
        for (let j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            toSort[j] = toSort[j][0];
        }

        return toSort;
    };

    let sortAlphabetically2DArray = function (array, size, sortedArrayNumber) {
        let i = 0;
        while (i !== size) {
            if (array[sortedArrayNumber][i] > array[sortedArrayNumber][i + 1]) {
                for (let j = 0; j <= sortedArrayNumber; j++) {
                    if (array[j][i]) {
                        //swap elements in array
                        array[j][i] = array[j].splice(i + 1, 1, array[j][i])[0];
                    }
                }
                --i;
            }
            else
                ++i;
        }
        return array;
    };

    /* private methods */

    let doBurrowsWheelerTransform = function(dataString) {

        let size = dataString.length;
        dataString = dataString.split('');
        let transformedString;

        transformedString = sortWithIndeces(dataString.slice());

        //find the string 'sorted text - 1'
        let finalText = [];
        for (let i = 0; i < size; i++) {
            finalText[i] = dataString[(transformedString['sortIndices'][i] - 1 + size) % size];
        }

        //find index in sorted text that contains char that starts original text
        for (let i = 0; i < size; i++) {
            if (transformedString['sortIndices'][i] === 0 ) {
                that.originalStartingIndex = i;
                break;
            }
        }

        return finalText.join('');
    }

    let undoBurrowsWheelerTransform = function(dataString) {
        let size = dataString.length;
        dataString = dataString.split('');
        let theArray = new Array(size).fill('');

        //create size x size array with first row as compressed text and sort it
        theArray[0] = dataString.slice();
        theArray = sortAlphabetically2DArray(theArray.slice(), size, 0);
        for (let i = 1; i < size; i++) {
            theArray[i] = new Array(size);
        }

        //add compressed text to next row and sor it 'size' times
        for (let i = 1; i < size; i++) {
            theArray[i] = dataString.slice();
            theArray = sortAlphabetically2DArray(theArray.slice(), size, i);
        }

        let finalText = new Array(size).fill('');
        for (let i = 0, j = size; i < size; i++, j--) {
            finalText[j] = theArray[i][that.originalStartingIndex];
        }

        return finalText.join('');
        return dataString;
    }

    let doMoveToFront = function(dataString) {
        let size = dataString.length;
        dataString = dataString.split('');
        finalString = new Array(size);
        let charsArray = new Array(that.maxChar);

        for (let i = 0; i < that.maxChar; i++) {
            charsArray[i] = i;
        }

        for (let i = 0; i < size; i++) {

            let chosenIndex = 0;
            for (let j = 0; j < that.maxChar; j++) {
                if (dataString[i].charCodeAt(0) == charsArray[j]) {
                    chosenIndex = j;
                    break;
                }
            }
            finalString[i] = chosenIndex;

            charsArray.unshift(parseInt(charsArray.splice(chosenIndex, 1).join()));
        }
        return finalString;
    }

    let undoMoveToFront = function(dataString) {
        let size = dataString.length;
        finalString = new Array(size);
        let charsArray = new Array(that.maxChar);

        for (let i = 0; i < that.maxChar; i++) {
            charsArray[i] = i;
        }

        for (let i = 0; i < size; i++) {

            finalString[i] = charsArray[dataString[i]];
            let tmp = charsArray[dataString[i]];

            for (let j = dataString[i]; j > 0 ; j--) {
                charsArray[j] = charsArray[j-1];
            }

            charsArray[0] = tmp;
        }

        //convert back to string
        for (let i = 0; i < size; i++) {
            finalString[i] = String.fromCharCode(finalString[i]);
        }

        return finalString.join('');
    }

    let doHuffmans = function(dataString) {
        return dataString;
    }

    let undoHuffmans = function(dataString) {
        return dataString;
    }
}
