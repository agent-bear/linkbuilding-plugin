var linkList = document.getElementById("linkList");

//event listener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("addCurrentLink").addEventListener("click", addCurrentLink);
    document.getElementById("addLink").addEventListener("click", addLink);
});

function createList(){
    //checks for saved data in chrome cloud and saves contents to local array
    chrome.storage.sync.get(['key'], function(result){
        if(result.key.constructor == Array){
            LinkArray = result.key;
            //alert("saved data retrieved");
            drawList();
        }
    });
}

function updateList() {
    //saves the current list in the cloud
    chrome.storage.sync.set({key: LinkArray}, function() {
        //alert("data saved!");
        drawList();
    });   
}

function drawList() {
    linkList.innerHTML = "";
    for (let i=0; i < LinkArray.length; i++) {
        linkList.innerHTML += "<a target='_blank' href=" + LinkArray[i].url + ">" + LinkArray[i].url + "</a>";

        if(LinkArray[i].state == true){
            linkList.innerHTML += "<button class='stateButton buttonTrue' data-linkid=" + i + " id="+ "button" + i + ">" + i +"</button>";
        } else{
            linkList.innerHTML += "<button class='stateButton buttonFalse' data-linkid=" + i + " id=" + "button" + i + ">" + i +"</button>";
        }

        linkList.innerHTML += "<button class='deleteButton' data-linkid=" + i + " id=" + "delete " + i + ">Delete</button>";
        
        linkList.innerHTML += "<br>";
        linkList.innerHTML += "<br>";

    }
    const stateButtons = document.querySelectorAll(".stateButton");
    stateButtons.forEach(stateButtons => {
        stateButtons.addEventListener('click', function(){
            var num = this.getAttribute("data-linkid");
            if(LinkArray[num].state == false){
                LinkArray[num].state = true;
            }else{
                LinkArray[num].state = false;
            }
            updateList(); 
        });
    });

    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach(deleteButtons => {
        deleteButtons.addEventListener('click', function(){
            var num = this.getAttribute("data-linkid");
            LinkArray.splice(num, 1);
            updateList(); 
        });
    });
}

function addCurrentLink() {
    //let newLink = prompt("please enter a URL","https://");
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let newLink = tabs[0].url;
        LinkArray.push({ "url" : newLink, "state" : false});
        updateList();
    });
}

function addLink() {
    let newLink = prompt("please enter a URL","https://");
    LinkArray.push({ "url" : newLink, "state" : false});
    updateList();
}

createList();