class HashMap {
    constructor(initialCapacity=8) {
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
        this._deleted = 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._hashTable[index] === undefined) {
            throw new Error('Key error');
        }
        return this._hashTable[index].value;
    }

    set(key, value){
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap.SIZE_RATIO);
        }
        //Find the slot where this key should be in
        const index = this._findSlot(key);

        if(!this._hashTable[index]){
            this.length++;
        }
        this._hashTable[index] = {
            key,
            value,
            DELETED: false
        }; 
    }

    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }

    _findSlot(key) {
        const hash = HashMap._hashString(key);
        const start = hash % this._capacity;

        for (let i=start; i<start + this._capacity; i++) {
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            }
        }
    }

    _resize(size) {
        const oldSlots = this._hashTable;
        this._capacity = size;
        // Reset the length - it will get rebuilt as you add the items back
        this.length = 0;
        this._deleted = 0;
        this._hashTable = [];

        for (const slot of oldSlots) {
            if (slot !== undefined && !slot.DELETED) {
                this.set(slot.key, slot.value);
            }
        }
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            //Bitwise left shift with 5 0s - this would be similar to
            //hash*31, 31 being the decent prime number
            //but bit shifting is a faster way to do this
            //tradeoff is understandability
            hash = (hash << 5) + hash + string.charCodeAt(i);
            //converting hash to a 32 bit integer
            hash = hash & hash;
        }
        //making sure hash is unsigned - meaning non-negtive number. 
        return hash >>> 0;
    }
}

module.exports = HashMap;


// 1. Create HashMap class:
const HashMap = require('./hashmaps');

// const main = () => {
//     HashMap.MAX_SIZE_RATIO = 0.5;
//     HashMap.SIZE_RATIO = 3;
//     let lor = new HashMap();

//     lor.set("Hobbit", "Bilbo");
//     lor.set("Hobbit", "Frodo");
//     lor.set("Wizard", "Gandolf");
//     lor.set("Human", "Aragorn");
//     lor.set("Elf", "Legolas");
//     lor.set("Maiar", "The Necromancer");
//     lor.set("Maiar", "Sauron");
//     lor.set("RingBearer", "Gollum");
//     lor.set("LadyOfLight", "Galadriel");
//     lor.set("halfElven", "Arwen");
//     lor.set("Ent", "Treebeard");

//     console.log(lor.get('Hobbit'));
//     console.log(lor.get('Maiar'));
//     // prints only Frodo and Sauron, first values are colliding?

//     console.log(lor);
//     // capacity seems to be 8, printed at 8
// }
// main();

// const WhatDoesThisDo = function(){
//     let str1 = 'Hello World.';
//     let str2 = 'Hello World.';
//     let map1 = new HashMap();
//     map1.set(str1,10);
//     map1.set(str2,20);
//     let map2 = new HashMap();
//     let str3 = str1;
//     let str4 = str2;
//     map2.set(str3,20);
//     map2.set(str4,10);

//     console.log(map1.get(str1));
//     console.log(map2.get(str3));
// }
// WhatDoesThisDo();
// what does this do? 
// output is 20, 10
// overall poorly written, sets keys and values as numbers...
// set str 1 to 10, str 2 to 20, then set str 3 to 10, and str 4 to 20

// 3. Understanding of Hash maps:
/*
hashmap length = 11;
hash function k mod m (???)
k is the key
Hashmap via Open Addressing
00 01 02 03 04 05 06 07 08 09 10
********************************
22 88 -- -- 04 15 28 17 59 31 10
*/

/*
hashmap length = 9;
Hashmap via Separate Chaining
00 01 02 03 04 05 06 07 08
**************************
-- 28 20 12 -- 05 15 -- 17
   19             33
   01
*/

// 4. Remove Duplicates:
// const removeDuplicates = (phrase) => {
//     let phraseArray = phrase.split('');
//     let phraseMap = new HashMap();
//     let word = '';

//     phraseArray.forEach((element) => {
//         try {
//             phraseMap.get(element);
//         }
//         catch {
//             phraseMap.set(element, element);
//             word += element;
//         }
//     });

//     console.log(word);
// }
// removeDuplicates('google all that you can think of');

// const removeDuplicates2 = (phrase) => {
//   let phraseArray = phrase.split('')
//   let word = ''
//   let tempWords = []

//   phraseArray.forEach(letter => {
//     if(!tempWords.includes(letter)) {
//       tempWords.push(letter)
//       word += letter
//     }
//   })
//   console.log(word)
// }
// removeDuplicates2('google')

// 5. Permutation a palindrome
// given a string acecarr - should return true
// acecarr can be rearranged to racecar - a palindrome
// given string north, the string should return false
// do this in hash map somehow
