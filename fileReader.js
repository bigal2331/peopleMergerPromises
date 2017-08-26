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
            names = getNames(arr[i]).concat(names).sort(function(a, b){
                var A = a.toUpperCase();
                var B = b.toUpperCase();
                if( A < B ){
                    return -1;
                }
                if(A > B){
                    return 1;
                }

                return 0;
            });
        }else{
            names.push(element);
        }
    }
    return names;
}

fs.readdir('./',function(err, files){
    
    if(err) throw err;
    
    
    files.forEach(function(fileName){

        if(fileName !== path.basename(__filename) && fileName !== '.git'){

            filePromises.push(readerPromise(fileName,"utf-8"));
        }
        
    })
    
    
    Promise.all(filePromises)
    .then(function(data){
        fs.writeFile('./mergedNames.txt', getNames(data),"utf-8",function(err){
            if(err) throw err;
            console.log("file was written")
        })
    })
    
    
})
