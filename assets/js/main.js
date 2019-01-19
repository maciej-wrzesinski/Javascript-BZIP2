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
            uploadedString = unicodeString;
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
    let compressedText = bzip2.compress('disa sisa hi');
    let decompressedText = bzip2.decompress('aassi hsdii ');
    console.log('disa sisa hi');
    console.log(compressedText);
    console.log(decompressedText);
});

/* BZIP2 algorithm */

function BZIP2() {
    var that = this;
    this.originalStartingIndex = 0;

    /* usable methods */
    this.compress = function(dataString) {
        return doHuffmans(doMoveToFront(doBurrowsWheelerTransform(dataString)));
    }

    this.decompress = function(dataString) {
        return undoBurrowsWheelerTransform(undoMoveToFront(undoHuffmans(dataString)));
    }

    /* private methods that private methods below use */
    let sortWithIndeces = function (originalArray) {
        let toSort = originalArray.slice();
        let size = toSort.length;

        //add indeces
        for (let i = 0; i < toSort.length; i++) {
            toSort[i] = [toSort[i], i];
        }

        //sort them out
        toSort.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });

        //sort the same chars by next chars in the string
        let i = 0;
        let debug = 0
        while (i < size - 1) {
            if (toSort[i][0] == toSort[i+1][0]) {

                let j = 1;
                let checked = 0;
                //this loop checks every following char, stop on the end of the string
                while (checked === 0 && j+i < size - 1 && debug < 1000 ) {
                    debug++;

                    if (toSort[i][1] + j === size || toSort[i + 1][1] + j === size) { //if it got to the end of string, then end the loop it does not have to swap :)
                        checked = 1;
                        continue;
                    }
                    let firstIndex = (toSort[i][1] + j);
                    let secondIndex = (toSort[i + 1][1] + j);

                    //this only checks one letter after the thing MAKE IT TO CHECK ALL OF THEM
                    if (originalArray[firstIndex] > originalArray[secondIndex]) {
                        let x = toSort[i][0], y = toSort[i][1];
                        toSort[i][0] = toSort[i + 1][0];
                        toSort[i][1] = toSort[i + 1][1];
                        toSort[i + 1][0] = x;
                        toSort[i + 1][1] = y;

                        //go back 2 (actually 1) step back to check the letter before
                        i = 0;
                        checked = 1;
                    }
                    //if the following chars are still the same, check next ones
                    else if (originalArray[firstIndex] === originalArray[secondIndex]) {
                        j++;
                    }
                    else {
                        checked = 1;
                    }
                }
            }
            i++;
        }

        toSort.sortIndices = [];
        for (let j = 0; j < toSort.length; j++) {
            toSort.sortIndices.push(toSort[j][1]);
            toSort[j] = toSort[j][0];
        }
        return toSort;
    };

    /* private methods */
    let doBurrowsWheelerTransform = function(dataString) {

        let size = dataString.length;
        dataString = dataString.split('');
        let transformedString;

        transformedString = sortWithIndeces(dataString.slice());

        console.log(transformedString)
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
        return dataString;
    }

    let undoMoveToFront = function(dataString) {
        return dataString;
    }

    let doHuffmans = function(dataString) {
        return dataString;
    }

    let undoHuffmans = function(dataString) {
        return dataString;
    }
}

var uploadedString = 0;

var transformedText;

const swapElementsArray = function (textArray, index1, index2) { //this swaps elements in array
    let a = textArray[index1];
    textArray[index1] = textArray[index2];
    textArray[index2] = a;
    //textArray[index1] = textArray.splice(index2, 1, textArray[index1])[0];
};

const sortAlphabetically2DArray = function (array, size, sortedArrayNumber) {
    let i = 0;
    while (i !== size) {
        if (array[sortedArrayNumber][i] > array[sortedArrayNumber][i + 1]) {
            //console.log(array[sortedArrayNumber][i] + ":" + array[sortedArrayNumber][i].charCodeAt(0) + " > " + array[sortedArrayNumber][i+1] + ":" + array[sortedArrayNumber][i+1].charCodeAt(0))
            for (let j = 0; j <= sortedArrayNumber; j++) {
                if (array[j][i]) {
                    swapElementsArray(array[j], i, i + 1);
                }
            }
            --i;
        }
        else
            ++i;
    }
    return array;
};

const decompressBWT = function (compressedText, originalIndex) {
    let size = dataString.length;
    dataString = dataString.split('');
    let bucket = new Array(256).fill(0);
    let F = [];
    let indices = new Array(size);
    let finalText = new Array(size).fill(0);

    //fill the bucket with count of each char
    for (let i = 0; i < size; i++)
        bucket[dataString[i].charCodeAt(0)]++;

    //F now has chars in increasing order
    for (let i = 0; i < 256; i++)
        for (let j = 0; j < bucket[i]; ++j)
            F.push(i);

    for (let i = 0, j = 0; i < 256; i++) {
        while (i >= F[j] && j < size)
            ++j;

        bucket[i] = j;
    }

    ///this does somethig fucky
    for(let i = 0; i < size; i++) {
        console.log("W " + dataString[i].charCodeAt(0) + " jest " + bucket[dataString[i].charCodeAt(0)] + " ma byc " + i)

        indices[bucket[dataString[i].charCodeAt(0)]++] = i;
    }

    console.log(indices);

    let j = that.originalStartingIndex;
    for(let i = 0; i < size; ++i) {
        console.log(dataString[j]);
        finalText[i] = dataString[j];
        j=indices[j];
    }

    return finalText.join('');
};

const decompressBWT2 = function (compressedText, originalIndex) {
    let size = compressedText.length;
    compressedText = compressedText.split('');
    let theArray = new Array(size).fill('');



    theArray[0] = compressedText.slice();
    theArray = sortAlphabetically2DArray(theArray.slice(), size, 0);
    for (let i = 1; i < size; i++) {
        theArray[i] = new Array(size);
    }
    console.log(theArray.slice());

    theArray[1] = compressedText.slice();
    theArray = sortAlphabetically2DArray(theArray.slice(), size, 1);
    console.log(theArray.slice());

    theArray[2] = compressedText.slice();
    theArray = sortAlphabetically2DArray(theArray.slice(), size, 2);

    console.log(theArray.slice());
    /*for (let i = 1; i < 3; i++) {
        theArray[i] = compressedText.slice();
        theArray = sortAlphabetically2DArray(theArray.slice(), size, i);
        console.log(theArray.slice());
    }*/

    let finalText = new Array(size).fill('');
    for (let i = 0, j = size; i < size; i++, j--) {
        finalText[j] = theArray[i][originalIndex];
    }

    return finalText.join('');
};


