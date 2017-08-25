var fs = require("fs");
var Promise = require("promise");
var path = require('path');
var filePromises = [];

function readerPromise(fileName, encType){
    
    function callBack(resolve, reject){
        
        fs.readFile(fileName, encType, function(err, data){
            if(err) reject(err);
        
            else resolve(JSON.parse(data))
        })
        
    }
    
    return new Promise(callBack)
}

function getNames(arr){
    var names = [];
    
    for(var i = 0; i < arr.length; i++){
        var element = arr[i];
        if(Array.isArray(element)){
            names = getNames(arr[i]).concat(names).sort();
        }else{
            names.push(element);
        }
    }
    return names;
}

fs.readdir('.',function(err, files){
    
    if(err) throw err;
    
    
    files.forEach(function(fileName){
        
        if(fileName !== path.basename(__filename)){
            filePromises.push(readerPromise(fileName,"utf-8"));
        }
        
    })
    
    Promise.all(filePromises)
    .then(function(data){
        console.log('this is the result of getNames', getNames(data));
    })
    
    
})



