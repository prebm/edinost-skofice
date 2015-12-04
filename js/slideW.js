/**
 * http://www.harrymaugans.com/2007/03/06/how-to-create-an-animated-sliding-collapsible-div-with-javascript-and-css/
 */
var timerlen = 5;
var slideAniLen = 50;

var timerID = new Array();
var startTime = new Array();
var obj = new Array();
var endHeight = new Array();
var moving = new Array();
var dir = new Array();

function slidedownW(objname){
        if(moving[objname])
                return;

        if(document.getElementById(objname).style.display != "none")
                return; // cannot slide down something that is already visible

        moving[objname] = true;
        dir[objname] = "down";
        startslideW(objname);
}

function slideupW(objname){
        if(moving[objname])
                return;

        if(document.getElementById(objname).style.display == "none")
                return; // cannot slide up something that is already hidden

        moving[objname] = true;
        dir[objname] = "up";
        startslideW(objname);
}

function startslideW(objname){
        obj[objname] = document.getElementById(objname);

        endHeight[objname] = parseInt(obj[objname].style.width);
        startTime[objname] = (new Date()).getTime();

        if(dir[objname] == "down"){
                obj[objname].style.width = "1px";
        }

        obj[objname].style.display = "block";

        timerID[objname] = setInterval('slidetickW(\'' + objname + '\');',timerlen);
}

function slidetickW(objname){
        var elapsed = (new Date()).getTime() - startTime[objname];

        if (elapsed > slideAniLen)
                endSlideW(objname)
        else {
                var d =Math.round(elapsed / slideAniLen * endHeight[objname]);
                if(dir[objname] == "up")
                        d = endHeight[objname] - d;

                obj[objname].style.width = d + "px";
        }

        return;
}

function endSlideW(objname){
        clearInterval(timerID[objname]);

        if(dir[objname] == "up")
                obj[objname].style.display = "none";

        obj[objname].style.width = endHeight[objname] + "px";

        delete(moving[objname]);
        delete(timerID[objname]);
        delete(startTime[objname]);
        delete(endHeight[objname]);
        delete(obj[objname]);
        delete(dir[objname]);

        return;
}

function toggleSlideW(objname){
  if(document.getElementById(objname).style.display == "none"){
    // div is hidden, so let's slide down
    slidedownW(objname);
  }else{
    // div is not hidden, so slide up
    slideupW(objname);
  }
}