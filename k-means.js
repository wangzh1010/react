function distance(arr0, arr1) {
    let sum = arr0.reduce((s, v, i) => { return s += Math.pow(v - arr1[i], 2); }, 0);
    return Math.sqrt(sum).toFixed(2);
}

function average(data) {
    let sum = data.reduce((s, v) => { return s += v; }, 0);
    return (sum / data.length).toFixed(2);
}

function sum(dest, source) {
    return dest.map((v, i) => { return v += source[i] });
}

function distribute(dest, arr, data) {
    let min = Math.min(...arr);
    let index = arr.findIndex(v => v == min);
    dest[index].push(data);
    return dest;
}

class KMeans {
    constructor(dataList, centerList) {
        this.centerList = centerList;
        this.nextCenterList = JSON.parse(JSON.stringify(this.centerList));
        this.k = this.centerList.length;
        this.dataList = dataList;
        this.cluster = new Array(this.k).fill(0).map(() => new Array());
    }
    run(maxDistance, maxNum) {
        for (let i = 0; i < maxNum; i++) {
            console.log('第' + (i + 1) + '次');
            var distances = this.calcDistance();
            this.cluster = this.reclassify(distances);
            console.log(this.cluster)
            this.nextCenterList = this.resetCenter();
            var cohesion = this.calCohesion();
            console.log(cohesion)
            let dis = Math.max(...cohesion)
            if (dis < maxDistance) {
                console.log('finish')
                break;
            }
            this.centerList = JSON.parse(JSON.stringify(this.nextCenterList));
        }
        return this.cluster;
    }
    calcDistance() {
        return this.dataList.map(arr0 => { return this.centerList.map(arr1 => { return distance(arr0, arr1); }); });
    }
    reclassify(distances) {
        console.log(distances);
        return distances.reduce((dest, arr, i) => { return distribute(dest, arr, this.dataList[i]); }, new Array(this.k).fill(0).map(() => new Array()))
    }
    resetCenter() {
        return this.cluster.map(arr0 => { return arr0.reduce((dest, arr1) => { return sum(dest, arr1); }, new Array(this.k).fill(0)).map(v => (v / arr0.length).toFixed(2)); });
    }
    calCohesion() {
        return this.centerList.map((arr0, i) => { return distance(arr0, this.nextCenterList[i]); });
    }
}

let centerList = [[1, 1], [1, 2] ];
let dataList = [[1, 1], [2, 1], [1, 2], [2, 2], [4, 3], [5, 3], [4, 4], [5, 4] ];
let kmeans = new KMeans(dataList, centerList);
console.log(kmeans.run(1, 100))
