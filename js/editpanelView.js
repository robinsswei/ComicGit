/**
 * @file editpanelView.js
 * @author Sisi Wei, 915565877
 * @date 23 May 15
 * @description A javascript for the editpanelView
 */
$(document).ready(function(){
    var u=$(location).attr('href').split('/');
    if(u[u.length-1]===""){
        u=u.slice(0,u.length-1);
    }
    var last;
    var sf;
    var newsf=false;
    if(u[u.length-1]==="editpanel"){
        newsf=true;
        $("#storyflowdiv").append('name storyflow <input id="storyflow" for="save-to-server">');
    }
    else{
        sf=u[u.length-2];
        last=u[u.length-1];
        $("#storyflowdiv").append('<p id="storyflow" for="save-to-server">storyflow : '+sf+'</p>');
        $("#parentpaneldiv").append('<p id="parentpanel" for="save-to-server">previous panel : '+last+'</p>');
        $("#paneldiv").append('name panel <input id="panel" type="text" for="save-to-server">');
    }
    
    $('#backstoryflow')[0].href="/storyflow/"+sf;
    // initialize the canvas and canvas-container
    var canvas = new fabric.Canvas('canvas', {
        backgroundColor: 'grey',
        hoverCursor: 'pointer',
    });
    var canvasContainer = document.getElementById('canvas-container');

    // clear canvas
    var clearCanvas = $('#clear-canvas')[0];
    clearCanvas.onclick = function() {
        canvas.clear(); 
    };

    window.myCanvas = canvas;
    
    // add a rectangle on the canvas
    canvas.add(new fabric.Rect({
        left: 100,
        top: 100,
        width: 75,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 3,
        padding: 10
    }));

    // add a circle on the canvas
    canvas.add(new fabric.Circle({
        left: 200,
        top: 200,
        radius: 30,
        fill: 'gray',
        stroke: 'black',
        strokeWidth: 3
    }));

    // free drawing mode         
    var freeDrawing=$('#draw')[0];
    draw.onclick = function(){
        if(canvas.isDrawingMode){
            canvas.isDrawingMode=false;
            draw.innerHTML = "Start";
        }else{
            canvas.isDrawingMode=true;
            draw.innerHTML = "Stop";
            canvas.freeDrawingBrush.width =10;
        }
    };

    // Add text into canvas
    var createText=$('#create-text-obj')[0];
    createText.onclick = function(){
        var text = $('#text-input').val();
        create_text_obj(text);
    };


    /**
     * Create the text object by the text
     * @param text the user's input
     */
    function create_text_obj(text) {
        var text_obj = new fabric.Text(text, {
            fontFamily: 'Delicious_500',
            left: 40,
            top: 20,
            fontSize: 80,
            textAlign: "left",
	    fill:canvas.freeDrawingBrush.color
        });

        canvas.add(text_obj);
    };
    
    /**
     * Handle start dragging an image into canvas
     * @param e window's event
     */
    function handleDragStart(e) {
        [].forEach.call(images, function (img) {
            img.classList.remove('img_dragging');
        });
        this.classList.add('img_dragging');
    }

    /**
     * Handle drag over an image
     * @param e window's event
     */
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'copy'; 
        return false;
    }

    /**
     * Handle drag an image into canvas
     * @param e window's event
     */
    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        this.classList.add('over');
    }

    /**
     * Handle leave an image into canvas
     * @param e window's event
     */
    function handleDragLeave(e) {
        this.classList.remove('over'); // this / e.target is previous target element.
    }

    /**
     * Handle drop an image into canvas
     * @param e window's event
     */
    function handleDrop(e) {
        // this / e.target is current target element.

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        
        var img = document.querySelector('#images img.img_dragging');

        console.log('event: ', e);

        var newImage = new fabric.Image(img, {
            width: img.width,
            height: img.height,
            // Set the center of the new object based on the event coordinates relative
            // to the canvas container.
            left: e.layerX,
            top: e.layerY
        });
        canvas.add(newImage);

        return false;
    }

    /**
     * Handle end dragging an image into canvas
     * @param e window's event
     */
    function handleDragEnd(e) {
        // this/e.target is the source node.
        [].forEach.call(images, function (img) {
            img.classList.remove('img_dragging');
        });
    }

    if (Modernizr.draganddrop) {
        // Browser supports HTML5 DnD.

        // Bind the event listeners for the image elements
        var images = document.querySelectorAll('#images img');
        [].forEach.call(images, function (img) {
            img.addEventListener('dragstart', handleDragStart, false);
            img.addEventListener('dragend', handleDragEnd, false);
        });
        // Bind the event listeners for the canvas
        canvasContainer.addEventListener('dragenter', handleDragEnter, false);
        canvasContainer.addEventListener('dragover', handleDragOver, false);
        canvasContainer.addEventListener('dragleave', handleDragLeave, false);
        canvasContainer.addEventListener('drop', handleDrop, false);
    } else {
        // Replace with a fallback to a library solution.
        alert("This browser doesn't support the HTML5 Drag and Drop API.");
    }

    // change the line width
    var drawingLine=$('#drawing-line-width')[0];
    drawingLine.onchange=function(){
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    }

    // change the line color
    var drawingLineColor = $('#drawing-line-color')[0];
    drawingLineColor.onchange = function() {
        canvas.freeDrawingBrush.color = this.value;
	
    };

    // remove the object
    // 1. select an object first, then click remove button in the Drawings/Settings Menu
    // 2. Shortcut: select an object first, then press Delete on the keyboard
    var removeObj = $('#remove-object')[0];
    removeObj.onclick = function() {
        removeObject();
    };

    document.onkeydown = function(event) {
        var key = window.event ? window.event.keyCode : event.keyCode;
        // keyboard shortcut to remove an object
        if(key==46){
            console.log("Your keycode is: "+key);
            removeObject();
        }
    }

    function removeObject(){
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
            canvas.discardActiveGroup().renderAll();
        } else {
            canvas.remove(canvas.getActiveObject());
        }
    }

    // save the canvas to local disk
    var saveLocal=$('#save-to-local')[0];
    saveLocal.onclick=function(){
        // make the link. set the href and download. emulate dom click
        $('<a>').attr({href:canvas.toDataURL(),download: sf + ".png"})[0].click();
    };

    // save the canvas to server
    var saveServer=$('#save-to-server')[0];
    saveServer.onclick = function(){
        var panel;
        if(newsf){
            sf=$('#storyflow')[0].value;
            last=sf;
            panel=sf;
        }
        else{
            panel=$('#panel')[0].value;
        }
	$('#backstoryflow')[0].href="/storyflow/"+sf;
        var urlPost="/editpanel/savepanel/"+sf+"/"+last+"/"+panel;
	

	var data=[canvas,$('#meta-data').val()];
	console.log(data);
        $.post(urlPost,
               JSON.stringify(data),
               function(data,status){
                   //console.log(data+' '+status);
               }
              );
    };

    // upload an image into canvas
    var ImageInput=$('#image-input')[0];
    ImageInput.onchange=function(){
    	console.log("change of background");
    	var reader=new FileReader();
    	reader.onload=function(e){
    	    console.log("load img background");
    	    var dataURL=reader.result;
    	    var imgObj=new Image();
    	    imgObj.src=reader.result;

            window.imgObj = imgObj;

    	    imgObj.onload=function(){

    		console.log("load img background in canvas");
            var imgRatio = imgObj.width/imgObj.height;
            var canvasRatio = canvas.width/canvas.height;

            if(imgRatio > canvasRatio){
                imgObj.width = canvas.width;
                imgObj.height = Math.min(canvas.width/imgRatio, 550);
            }else{
                imgObj.width = Math.min(imgRatio * canvas.height, 700);
                imgObj.height = canvas.height;
            }

    		var newImage = new fabric.Image(imgObj, {
    		    width: imgObj.width,
    		    height: imgObj.height,
    		    // Set the center of the new object based on the event coordinates relative
    		    // to the canvas container.
                left: 0,
    		    top: 0
    		});

    		canvas.centerObject(newImage);
    		canvas.add(newImage);
    		canvas.renderAll();
    	    };
    	}
    	console.log(this.files);
    	reader.readAsDataURL(this.files[0]);
    }

    // change the layer for the selected objects
    var backLayer=$('#back-layer')[0];
    var frontLayer=$('#front-layer')[0];
    backLayer.onclick=function(){
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(o){ canvas.sendBackwards(o) });
            canvas.discardActiveGroup().renderAll();
        } else {
            canvas.sendBackwards(canvas.getActiveObject());
        }	
    }
    frontLayer.onclick=function(){
        if(canvas.getActiveGroup()){
            canvas.getActiveGroup().forEachObject(function(o){ canvas.bringForward(o) });
            canvas.discardActiveGroup().renderAll();
        } else {
            canvas.bringForward(canvas.getActiveObject());
        }	
    }
    
});
