var pageArray = [];
var pagePosition = [];
var pageCurrent = 0;
var pageWidth = 0;

var uploadedString = 0;

var canScrollMore = 1;

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
    let a = textArray[index1];
    textArray[index1] = textArray[index2];
    textArray[index2] = a;
    //textArray[index1] = textArray.splice(index2, 1, textArray[index1])[0];
};

const sortAlphabeticallyParallel = function (text, indexes, size) { //this sorts an array of indexes in the way that all the elements in char array are sorted alphabetically
    let i = 1;
    while (i !== size) {
        if (text[i] > text[i + 1]) {
            swapElementsArray(text, i, i + 1);
            swapElementsArray(indexes, i, i + 1);
            --i;
        }
        else if (text[i] === text[i + 1]) {
            if (text[indexes[i]] > text[indexes[i + 1]]) {
                swapElementsArray(text, i, i + 1);
                swapElementsArray(indexes, i, i + 1);
            }
        }
        else
            ++i;
    }
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

const sortWithIndeces = function (toSort) {
    for (var i = 0; i < toSort.length; i++) {
        toSort[i] = [toSort[i], i];
    }
    toSort.sort(function(left, right) {
        return left[0] < right[0] ? -1 : 1;
    });
    toSort.sortIndices = [];
    for (var j = 0; j < toSort.length; j++) {
        toSort.sortIndices.push(toSort[j][1]);
        toSort[j] = toSort[j][0];
    }
    return toSort;
};

const compressBWT = function (text, indexOriginal) {
    let size = text.length;
    text = text.split('');
    let indexes = new Array(size).fill(0);

    //get all indexes
    for (let i = 0; i < size; i++) {
        indexes[i] = i;
    }

    //sort lexically
    let sortedText = text.slice().sort(function (x, y) {
        let strlenght = size;
        let strtext = text;
        while (strtext[x] === strtext[y])
        {
            if (++x === strlenght)
                x = 0;
            if (++y === strlenght)
                y = 0;
            if (!--strlenght)
                return 0;
        }
        if (strtext[x] > strtext[y])
            return 1;
        else
            return -1;
    });

    console.log(sortedText)
    //find the string 'sorted text - 1'
    let finalText = [];
    for (let i = 0; i < size; i++) {
        finalText[i] = text[(sortedText['sortIndices'][i] - 1 + size) % size];
    }

    //find index in sorted text that starts original text in sorted indexes
    for (let i = 0; i < size; i++) {
        if (sortedText['sortIndices'][i] === 0 ) {
            indexOriginal.value = i;
            break;
        }
    }

    console.log(finalText.join(''))
    return finalText.join('');
};

/*
const compressBWT = function (text, indexOriginal) {
    let size = text.length;
    let indexes = new Array(size).fill(0);

    //get all indexes
    for (let i = 0; i < size; i++) {
        indexes[i] = i;
    }

    text = text.split('');
    sortedText = text.slice();
    sortedIndexes = indexes.slice();

    //sort both text and indexes alphabetically
    sortAlphabeticallyParallel(sortedText, sortedIndexes, size);

    //find the string 'sorted text - 1'
    let finalText = [];
    for (let i = 0; i < size; i++) {
        console.log(sortedText)
        finalText[i] = text[(sortedIndexes[i] - 1 + size) % size];
    }

    //find index in sorted text that starts original text in sorted indexes
    for (let i = 0; i < size; i++) {
        if (sortedIndexes[i] === 0 ) {
            indexOriginal.value = i;
            break;
        }
    }

    console.log(finalText.join(''))
    return finalText.join('');
};
*/

const decompressBWT = function (compressedText, originalIndex) {
    let size = compressedText.length;
    compressedText = compressedText.split('');
    let bucket = new Array(256).fill(0);
    let F = [];
    let indices = new Array(size);
    let finalText = new Array(size).fill(0);

    for (let i = 0; i < size; i++)
        bucket[compressedText[i].charCodeAt(0)]++;

    for (let i = 0; i < 256; i++)
        for (let j = 0; j < bucket[i]; ++j) {
            F.push(i);
        }
    console.log(F);

    for (let i = 0, j = 0; i < 256; ++i) {
        while (i >= F[j] && j < size)
            ++j;

        bucket[i] = j;

    }
    console.log(bucket);

    for(let i = 0; i < size; ++i) {
        console.log(bucket[compressedText[i].charCodeAt(0)])
        indices[bucket[compressedText[i].charCodeAt(0)]++] = i;
    }

    console.log(indices);

    let j = originalIndex;
    for(let i = 0; i < size; ++i) {
        finalText[i] = compressedText[j];
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

$().ready(function() {
    //Initialize pages
    buttonsInit();
    countdownInit();

    //Make settings and upload buttons work
    uploadClick();
    settingsClick();

    //make scroll work
    $(window).bind('mousewheel', function(e) {
        if (canScrollMore === 1) {
            if (e.originalEvent.wheelDelta >= 0) {
                console.log('Scroll up pageCurrent - 1 on click');
                let moved = 0;
                $('.href').each(function (i, obj) {

                    if (i === pageCurrent - 1 && moved === 0) {
                        moved = 1;
                        $(this).click();
                    }
                });
            }
            else {
                console.log('Scroll down pageCurrent + 1 on click');
                let moved = 0;
                $('.href').each(function (i, obj) {
                    if (i === pageCurrent + 1 && moved === 0) {
                        moved = 1;
                        $(this).click();
                    }
                });
            }
            canScrollMore = 0;
            setTimeout(function(){ canScrollMore = 1; }, 250);
        }
    });


    /*
        LambadziaraxD
        MemeMaterial
        Hej, co u CIebie?
        Hejdwd
     */
    let theString = 'Polska Wikipedia'.trim();
    let indexOriginal = { value: 0 };

    let compTXT = compressBWT(theString, indexOriginal);

    //console.log(decompressBWT(compTXT, indexOriginal.value));
    //console.log(theString + ' ORIGINAL');
    //console.log(indexOriginal);

    $('.submit_button').on("click", function(){
        console.log('clicked');
        if( uploadedString === 0) {
            console.log('error');
        }

        console.log(compressBWT(uploadedString, indexOriginal));

    });
});

