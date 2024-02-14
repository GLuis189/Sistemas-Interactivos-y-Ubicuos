let arr1 = [1, 2, 3];
let arr2 = [4, 5];

function nonMutatingPush(arr, items){
    return arr.concat(items);
}


console.log(nonMutatingPush(arr1, arr2));
console.log(arr1);
