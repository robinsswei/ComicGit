var fs=require('fs');

this.create = function(response,argv){
    console.log("about to create the page index");
    response.writeHead(200,{"Content-Type":"text/html"});
    var path ="view/index.html";
    fs.stat(path, function(err, stat){
	if(err) {
	    response.writeHead(404, {'Content-Type': 'text/plain'});
	    response.end(""+err);
	} else {
	    response.writeHead(200, {
		'Content-Type': 'text/html'});
	    var stream = fs.createReadStream(path);
	    console.log('pipe stream view/index.html');
	    stream.pipe(response);
	    console.log("end stream");
	    //response.end();
	}
    });
    
}


this.allstoryflow=function(response){
    allstoryflows(function(err,all){
	if(err){
	    response.writeHead(404,{"Content-Type":"text/plain"});
	    response.end(err);
	}
	else{
	    response.writeHead(200,{"Content-Type":"application/json"});
	    console.log("all : "+JSON.stringify(all));
	    response.write(JSON.stringify(all));
	    response.end();
	}
    });
}


var allstoryflows=function(cb){
    var storyflow=__dirname+"/../storyflow/";
    var all={arr:[]}
    fs.readdir(storyflow,function(err,files){
	if(err){
	    cb(err,null);
	}else{
	    files.forEach(function(file){
		console.log("file "+file);
		all.arr.push({name:file});
	    });
	    cb(null,all);
	}
    });
}
