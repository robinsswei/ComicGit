/**
 * @file server
 * @author Sylvain Ribstein, 915615732
 * @date 20 May 15
 * @description the part that ask to listen to a certain port, and redirect the request to the router
 */
 
 var http = require("http");
/*server listening on port 8888
 *route is the function which will route the request reveived 
 *
 *
 *This is the actual server of the project, this function will receive all the request and call the router to find te response
 *It also receive the data send by post by the client
 */
function start(route) {
    function onRequest(request, response) {
	var postData="";
	request.addListener('data',function(postDataChunk){
	    //request.addListener listen to the request to see if the client/request send some post data (form,....)
	    postData+=postDataChunk;
	    console.log("received POST data chunk '"+postDataChunk+"'.'");
	});
	request.addListener("end",function(){
	    //when postData received everything route the request with the data
	    route(request,response,postData);
	});
	
    }
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}
exports.start = start;
