
/* BZIP2 algorithm */

$().ready(function() {
    //let bzip2 = new BZIP2();
    //bzip2.decompress(bzip2.compress('hehexd'));
});

function BZIP2() {
    var debugLog = true;
    var debugBits = false;
    var debugTime = true;
    var that = this;
    this.originalStartingIndex = 0;
    this.maxChar = 0;
    this.huffmanCharToBinary = [];

    /* usable methods */

    this.compress = function(dataString) {
        //get max char so we can limit char buckets
        for (let i = 0; i < dataString.length; i++)
            if (dataString[i].charCodeAt(0) > this.maxChar)
                this.maxChar = dataString[i].charCodeAt(0);
        this.maxChar++;

        this.huffmanCharToBinary = [];

        if (debugLog) {
            console.log('---------------------- THIS IS ORIGINAL');
            console.log(dataString);

            if (debugBits) {
                console.log('---------------------- ORIGINAL TO BITS');
                console.log(countNumberOfBits(dataString));
            }

            console.log('----------------------');
            console.log('');
            console.log('');
        }

        return doShortenAndBase64(doHuffmans(doMoveToFront(doBurrowsWheelerTransform(dataString))));
    };

    this.decompress = function(dataString) {
        return undoBurrowsWheelerTransform(undoMoveToFront(undoHuffmans(undoShortenAndBase64(dataString))));
    };

    /* private methods that private methods below use */

    let countNumberOfBits = function (dataString) {
        let finalString = [];
        for (let i = 0; i < dataString.length; i++) {
            finalString[i] = dataString[i].charCodeAt(0).toString(2);
        }

        return finalString.join(' ');
    };

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

    let treeTraversal = function (tree, binarycode) {
        if(Array.isArray(tree) && tree.length === 3) { //if this is a sub-root
            treeTraversal(tree[1], binarycode + "0"); //left traversal
            treeTraversal(tree[2], binarycode + "1"); //right traversal
        }
        else if(Array.isArray(tree) && tree.length === 2) { //if this is a leaf
            that.huffmanCharToBinary.push([binarycode, tree[1]]); // create char to binary table
        }
    };

    /* private methods */

    let doBurrowsWheelerTransform = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

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

        finalText = finalText.join('');

        if (debugLog) {
            console.log('---------------------- THIS IS BURROWS');
            console.log(finalText);

            if (debugBits) {
                console.log('---------------------- BURROWS TO BITS');
                console.log(countNumberOfBits(finalText));
            }

            console.log('----------------------');
        }
        if (debugTime) {
            console.log('BURROWS TIME ' + (performance.now() - time1) + ' MS');
        }

        return finalText;
    };

    let undoBurrowsWheelerTransform = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

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

        if (debugLog) {
            console.log('---------------------- THIS IS UNDO BURROWS');
            console.log(finalText.join('').slice());
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('UNDO BURROWS TIME ' + (performance.now() - time1) + ' MS');
        }

        return finalText.join('');
    };

    let doMoveToFront = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

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
                if (dataString[i].charCodeAt(0) === charsArray[j]) {
                    chosenIndex = j;
                    break;
                }
            }
            finalString[i] = chosenIndex;

            charsArray.unshift(parseInt(charsArray.splice(chosenIndex, 1).join()));
        }

        //this is just god forbids method to show logs in console, will undo this in undoMTF
        let textString = new Array(size);
        for (let i = 0; i < size; i++)
            textString[i] = String.fromCharCode(finalString[i]);
        textString = textString.join('');

        if (debugLog) {
            console.log('---------------------- THIS IS FRONT');
            console.log(textString);

            if (debugBits) {
                console.log('---------------------- FRONT TO BITS');
                console.log(countNumberOfBits(textString));
            }

            console.log('----------------------');
        }
        if (debugTime) {
            console.log('FRONT TIME ' + (performance.now() - time1) + ' MS');
        }

        return textString;
    };

    let undoMoveToFront = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

        let size = dataString.length;
        finalString = new Array(size);
        if (that.maxChar < 50) that.maxChar = 1024; //THIS IS AN ABOMINATION AND SHOULD BE
        let charsArray = new Array(that.maxChar);

        //undoing int to char, that was the most stupid thing i coded
        tempString = [];
        for (let i = 0; i < size; i++) {
            tempString.push(dataString[i].charCodeAt(0));
        }
        dataString = tempString;
        //

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

        if (debugLog) {
            console.log('---------------------- THIS IS UNDO FRONT');
            console.log(finalString.join('').slice());
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('UNDO FRONT TIME ' + (performance.now() - time1) + ' MS');
        }

        return finalString.join('');
    };

    let doHuffmans = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

        let size = dataString.length;
        let bucket = [];

        for (let i = 0; i < that.maxChar; i++) {
            bucket[i] = new Array(2).fill(-1);
        }

        let transformedString = new Array(size);
        for (let i = 0; i < size; i++) { //make it int
            transformedString[i] = dataString.charCodeAt(i);
        }

        let minus = 0;
        for (let i = 0; i < size; i++) {
            if(bucket[transformedString[i]][0] === -1)
                minus++;
            bucket[transformedString[i]][0]++;
            bucket[transformedString[i]][1] = transformedString[i];
        }

        //sort by count
        bucket.sort(function(left, right) {
            return left[0] < right[0] ? -1 : 1;
        });

        //delete empty part
        bucket = bucket.slice(that.maxChar-minus, that.maxChar);

        let uniqueChars = bucket.slice();

        //+1 to every value because we initialized it with -1
        for (let i = 0; i < bucket.length; i++) {
            bucket[i][0]++;
        }

        //create tree onto the bucket
        while (bucket.length > 1) {
            let tempNode = [bucket[1][0]+bucket[0][0], bucket[0], bucket[1]];

            bucket = bucket.slice(2);

            bucket.unshift(tempNode);

            bucket.sort(function(left, right) {
                return left[0] < right[0] ? -1 : 1;
            });
        }

        //make the tree starting from 2 nodes and a sum of their weights insted of just one node containing the main root
        bucket = bucket[0];

        //now search the tree and make an array with char-to-binary values
        treeTraversal(bucket, '');

        that.huffmanCharToBinary.sort(function(left, right) {
                return left[0].length < right[0].length ? -1 : 1;
            });

        //now while we have the original array with the chars and a char-to-binary table we can convert the original to binary
        for (let i = 0; i < size; i++)
            for (let j = 0; j < that.huffmanCharToBinary.length; j++)
                if (that.huffmanCharToBinary[j][1] === transformedString[i]) {
                    transformedString[i] = that.huffmanCharToBinary[j][0];
                    j = that.huffmanCharToBinary.length;
                }

        transformedString = transformedString.join(''); // so THIS is the FINAL binary string

        for (let i = 0; i < that.huffmanCharToBinary.length; i++) //swap every 0 and 1 to some chars :|
            if (String.fromCharCode(that.huffmanCharToBinary[i][1]) === '1')
                that.huffmanCharToBinary[i][1] = -1;
            else if (String.fromCharCode(that.huffmanCharToBinary[i][1]) === '0')
                that.huffmanCharToBinary[i][1] = -2;

        let huffmanTreeString = '';
        for (let i = 0; i < that.huffmanCharToBinary.length; i++)
            huffmanTreeString = huffmanTreeString + that.huffmanCharToBinary[i][0] + String.fromCharCode(that.huffmanCharToBinary[i][1]);

        if (debugLog) {
            console.log('---------------------- THIS IS HUFFMAN');
            console.log(huffmanTreeString.slice() + ' ' + transformedString.slice());
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('HUFFMAN TIME ' + (performance.now() - time1) + ' MS');
        }

        return huffmanTreeString + ' ' + transformedString;
    };

    let undoHuffmans = function(dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

        //split the tree and data
        let huffmanTreeArray;
        let finalString = '';
        for (let i = dataString.length; i > 0; i--)
            if (dataString[i] === ' ') {
                huffmanTreeArray = dataString.slice(0, i);
                dataString = dataString.slice(i+1, dataString.length);
                break;
            }

        //code below translates dataString into original with the huffman tree
        let searchedBinary = '';
        dataString = dataString + 'X'; //so the loop below works
        while (dataString.length) {
            //if there is no such thing in there AND if they found a full string from 'char' to 'char' (this means that binary string found is a perfect full
            if (
                huffmanTreeArray.includes(searchedBinary) &&
                huffmanTreeArray[huffmanTreeArray.indexOf(searchedBinary)-1] !== '0' &&
                huffmanTreeArray[huffmanTreeArray.indexOf(searchedBinary)-1] !== '1' &&
                huffmanTreeArray[huffmanTreeArray.indexOf(searchedBinary)+searchedBinary.length] !== '0' &&
                huffmanTreeArray[huffmanTreeArray.indexOf(searchedBinary)+searchedBinary.length] !== '1'
            ) {

                let newAddition = huffmanTreeArray[huffmanTreeArray.indexOf(searchedBinary)+searchedBinary.length];
                //Inverse 'swap every 0 and 1 to some chars :|'
                if (newAddition === String.fromCharCode(-1))
                    newAddition = '1';
                else if (newAddition === String.fromCharCode(-2))
                    newAddition = '0';

                //add to the final string a 'translated' data
                finalString = finalString + newAddition;
                //reset the searched binary string
                searchedBinary = '';
            }
            searchedBinary = searchedBinary + dataString.slice(0, 1);
            dataString = dataString.slice(1, dataString.length);
            //console.log(searchedBinary + ' ' + dataString)
        }

        if (debugLog) {
            console.log('---------------------- THIS IS UNDO HUFFMAN');
            console.log(huffmanTreeArray.slice());
            console.log(finalString.slice());
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('UNDO HUFFMAN TIME ' + (performance.now() - time1) + ' MS');
        }

        return finalString;
    };

    let doShortenAndBase64 = function (dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

        //WE CANNOT USE THIS BECAUSE BINARY STRINGS CAN START WITH LEADING ZEROS THAT ARE IMPORTANT !!!
        //AND WE CANNOT RECOVER IT THIS WAY
        /*
        //split the tree and data
        let huffmanTreeArray;
        for (let i = dataString.length; i > 0; i--)
            if (dataString[i] === ' ') {
                huffmanTreeArray = dataString.slice(0, i);
                dataString = dataString.slice(i+1, dataString.length);
                break;
            }

        //change data from 8 bit binary to chars!
        let charDataString = '';
        while (dataString.length) {
            charDataString = charDataString + String.fromCharCode(parseInt(dataString.slice(0, 8), 2));
            dataString = dataString.slice(8, dataString.length);
        }

        //(since there are some 0 and 1 as data in the tree) change huffman tree from bit binary to chars!
        //then we can easily revert this change by changing chars (index_of_char/2) to bit strings
        let newHuffmanTreeArray = '';
        let tempBinaryString = '';

        for (let i = 0; i < huffmanTreeArray.length; i++) {
            if (huffmanTreeArray[i] !== '1' && huffmanTreeArray[i] !== '0') {
                newHuffmanTreeArray = newHuffmanTreeArray + String.fromCharCode(parseInt(tempBinaryString, 2));
                tempBinaryString = '';

                newHuffmanTreeArray = newHuffmanTreeArray + huffmanTreeArray[i];
            }
            else {
                tempBinaryString = tempBinaryString + huffmanTreeArray[i];
            }
        }

        dataString = newHuffmanTreeArray + ' ' + charDataString;

        if (debugLog) {
            console.log('---------------------- THIS IS BEFORE BASE64');
            console.log(dataString);
            console.log('----------------------');
        }
        */

        dataString = Base64.encode(dataString);

        if (debugLog) {
            console.log('---------------------- THIS IS BASE64');
            console.log(dataString);
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('BASE64 TIME ' + (performance.now() - time1) + ' MS');
        }

        return dataString;
    };

    let undoShortenAndBase64 = function (dataString) {
        let time1;
        if (debugTime) {
            time1 = performance.now();
        }

        dataString = Base64.decode(dataString);

        //WE CANNOT USE THIS BECAUSE BINARY STRINGS CAN START WITH LEADING ZEROS THAT ARE IMPORTANT !!!
        //AND WE CANNOT RECOVER IT THIS WAY
        /*
        if (debugLog) {
            console.log('---------------------- THIS IS BEFORE UNDO BASE64');
            console.log(dataString);
            console.log('----------------------');
        }

        //split the tree and data
        let huffmanTreeArray;
        for (let i = dataString.length; i > 0; i--)
            if (dataString[i] === ' ') {
                huffmanTreeArray = dataString.slice(0, i);
                dataString = dataString.slice(i+1, dataString.length);
                break;
            }

        //chars to 8 bit binary!
        let newHuffmanTreeString = '';
        for (let i = 0; i < huffmanTreeArray.length; i += 2) {
            newHuffmanTreeString = newHuffmanTreeString + huffmanTreeArray[i].charCodeAt(0).toString(2) + huffmanTreeArray[i + 1];
        }
        let newCharString = '';
        for (let i = 0; i < dataString.length; i++) {
            newCharString = newCharString + dataString[i].charCodeAt(0).toString(2);
        }

        dataString = newHuffmanTreeString + ' ' + newCharString;
        */

        if (debugLog) {
            console.log('---------------------- THIS IS UNDO BASE64');
            console.log(dataString);
            console.log('----------------------');
        }
        if (debugTime) {
            console.log('UNDO BASE64 TIME ' + (performance.now() - time1) + ' MS');;
        }

        return dataString;
    };
}
