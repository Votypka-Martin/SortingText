class Character{
    constructor(char, value, container) {
        this.div = document.createElement("div");
        this.div.className = "moveable_div";
        this.div.innerText = char;
        this.div.style.setProperty("--x", value);
        this.value = value;
        this.container = container;
        container.appendChild(this.div);
    }

    setValue(value, text) {
        this.div.innerText = text;
        this.value = value;
    }

    setPos(pos) {
        this.div.style.setProperty("--x", pos);
    }

    setColor(color) {
        this.div.style.color = color;
    }
}

class AnimatedSort {
    constructor(characters, sleepTime) {
        this.sleepTime = sleepTime;
        this.characters = characters;
    }

    async _setValue(index, value, text) {
        this.characters[index].setValue(value, text);
        await this._sleep(this.sleepTime / 2);
    }

    async _swap(i, j){
        [this.characters[i], this.characters[j]] = [this.characters[j], this.characters[i]]
        this.characters[i].setPos(i);
        this.characters[j].setPos(j);
        await this._sleep(this.sleepTime);
    }

    _setCompareColor(index) {
        this.characters[index].setColor("rgb(190, 102, 0)");
    }

    _setDefaultColor(index) {
        this.characters[index].setColor("rgb(84, 59, 159)");
    }

    _setSortedColor(index) {
        this.characters[index].setColor("rgb(43, 43, 43)");
    }

    _setSelectedColor(index) {
        this.characters[index].setColor("purple");
    }

    _copyArray(array) {
        let copy = new Array(array.length);
        for (let i = 0; i < array.length; i++) {
            copy[i] = array[i];  
        }
        return copy;
    }

    _sleep(time) {
        return new Promise((resolve) => {
            setTimeout(()=>{
                resolve();
            }, time);
        })
    }

    async _shuffle() {
        for (let c = 0; c < 3; c++) {
            let indexes = new Array(this.characters.length);
            for (let i = 0; i < ((this.characters.length >> 1) << 1); i++) {
                indexes[i] = i;
            }
            let couples = [];
            while(indexes.length != 0) {
                let index = Math.floor(Math.random() * indexes.length)
                let i1 = indexes[index];
                indexes.splice(index, 1);
                index = Math.floor(Math.random() * indexes.length)
                let i2 = indexes[index];
                indexes.splice(index, 1);
                couples.push({i: i1, j: i2});
            }
            for (let i = 0; i < couples.length; i++) {
                this._setDefaultColor(couples[i].i);
                this._setDefaultColor(couples[i].j);
                await this._swap(couples[i].i, couples[i].j);
            }
        }
    }
}

class AnimatedQuickSort extends AnimatedSort{
    constructor(characters, sleepTime) {
        super(characters, sleepTime);
        this.low = 0;
        this.high = this.characters.length - 1;
    }

    async sort(type) {
        if (type) await this.sortArray(this.low, this.high, this.lomuto.bind(this));
        else await this.sortArray(this.low, this.high, this.hoare.bind(this));
    }

    async sortArray(low, high, partFunc) {
        if (low < high) {
            let pivotIndex = await partFunc(low, high);
            this._setSortedColor(pivotIndex);
            await this.sortArray(low, pivotIndex - 1, partFunc);
            await this.sortArray(pivotIndex + 1, high, partFunc);
        }
        else if (low === high) {
            this._setSortedColor(low);
        }
    }

    async lomuto(low, high) {
        let pivot = this.characters[high];
        let pivotIndex = low - 1;
        this._setCompareColor(high);
        for (let i = low; i < high; i++) {
            this._setCompareColor(i);
            let dI = i;
            if (this.characters[i].value < pivot.value) {
                pivotIndex++;
                await this._swap(i, pivotIndex);  
                dI = pivotIndex;    
            }
            await this._sleep(this.sleepTime);
            this._setDefaultColor(i);
            this._setDefaultColor(dI);
        }
        pivotIndex++;    
        await this._swap(high, pivotIndex);
        return pivotIndex;
    }

    async hoare(low, high) {
        let pivot = this.characters[high];
        this._setCompareColor(high);
        let i = low - 1;
        let j = high;
        while(true){
            do{
                i++;
                this._setCompareColor(i);
                await this._sleep(this.sleepTime);  
                this._setDefaultColor(i);     
            } while(this.characters[i].value < pivot.value);
            if (i < j) do{
                j--;
                this._setCompareColor(j);
                if (j > i) await this._sleep(this.sleepTime);   
                this._setDefaultColor(j);
            } while(this.characters[j].value > pivot.value && j > i);
            if (i >= j) break;
            await this._swap(i, j);
        }
        await this._swap(i, high);
        return i;
    }
}

class AnimatedBubbleSort extends AnimatedSort{
    constructor(characters, sleepTime) {
        super(characters, sleepTime);
    }

    async sort() {
        for (let i = 0; i < this.characters.length; i++) {
            let bound = this.characters.length - i;
            let swap = false;
            for (let j = 1; j < bound; j++) {
                this._setCompareColor(j - 1);
                this._setCompareColor(j);
                await this._sleep(this.sleepTime);
                if (this.characters[j - 1].value > this.characters[j].value) {
                    await this._swap(j-1,j);
                    swap = true;
                    await this._sleep(this.sleepTime);
                }
                this._setDefaultColor(j - 1);
                this._setDefaultColor(j);     
            }
            this._setSortedColor(bound - 1);    
            if (!swap) {
                for (let i = 0; i < bound - 1; i++) {
                    this._setSortedColor(i);
                }
                return;
            }
            await this._sleep(this.sleepTime);
        }
    }
}

class AnimatedInsertionSort extends AnimatedSort{
    constructor(characters, sleepTime) {
        super(characters, sleepTime);
    }

    async sort() {
        for (let i = 1; i < this.characters.length; i++) {
            let j = i - 1;
            this._setCompareColor(i);
            this._setCompareColor(j);
            await this._sleep(this.sleepTime);
            while(j >= 0 && this.characters[j + 1].value < this.characters[j].value) {
                this._setCompareColor(j);
                await this._swap(j + 1, j);
                this._setDefaultColor(j + 1);
                j--;
                await this._sleep(this.sleepTime);   
            }
            if (j >= 0) {
                this._setDefaultColor(j);
            }
            this._setDefaultColor(j + 1);
        }
        for (let i = 0; i < this.characters.length; i++) {
            this._setSortedColor(i);
        }
    }
}

let textToSort = "PROGRAMOVÁNÍ";
let container = document.getElementById("sort-container");
let characters = new Array(textToSort.length);
for (let i = 0; i < characters.length; i++) {
    characters[i] = new Character(textToSort[i], i, container);
}
let sortingAlgorithms = [AnimatedBubbleSort, AnimatedInsertionSort, AnimatedQuickSort];

loop();

async function loop() {
    while(true) {
        for (let i = 0; i < sortingAlgorithms.length; i++) {
            let animSort = new sortingAlgorithms[i](characters, 500);
            await animSort._sleep(7000);
            await animSort._shuffle();
            await animSort._sleep(3000);
            await animSort.sort();  
        }
    } 
}