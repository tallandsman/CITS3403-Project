// Navigation bar
// When the button is clicked, toggle between hiding and showing the down menus
// function menuDown() {
//     document.getElementById("myMenuDown").classList.toggle("show");
// }

// Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//     if (!event.target.matches('.menu_btn')) {
//         console.log("clicked outside of dropdown");
//         var dropdowns = document.getElementById("myMenuDown");
//         if (dropdowns.classList.contains('show')) {
//             dropdowns.classList.remove('show');
//         }
//     }
// }


window.onclick = function(event) {
    console.log(event.target.matches('.menu_btn, .menu_btn *'))
    if (!event.target.matches('.menu_btn, .menu_btn *')) {
        
        var dropdowns = document.getElementsByClassName("down_menu");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function menuDown() {
    var dropdown = document.getElementById("myMenuDown");
    dropdown.classList.toggle("show");
}

// function popupFunction() {
//     var popup = document.getElementById("myPopup");
//     popup.classList.toggle("show_popup");
// }

// window.onclick = function(event) {
//     if(document.getElementById("myMenuDown").style.display == "block") {
//         console.log("display is block")
//         if(!event.target.matches(".menu_btn")) {
//             console.log("click not a menu button")
//             // if(!event.target.matches("#myMenuDown")) {
//             //     console.log("click not ul menu")
//             //     document.getElementById("myMenuDown").style.display = "none";
//             // }
//         }
//     }
// }

// onclick on the button to open down menu
// function menuDown() {
//     document.getElementById("myMenuDown").style.display = "block";
// }

// window.onclick = function(event) {
//     if(document.getElementById("myPopup").style.visibility == "visible") {
//         console.log("It's visible now")
//         if (!event.target.matches(".down_item")) {
//             console.log("click not down-item")
//             if (!event.target.matches(".box_howtoplay")) {
//                 console.log("click not box howtoplay")
//                 document.getElementById("myPopup").style.visibility = "hidden";
//             }
//         }
//     }
// }
// onclick on How to play menu will show the pop up to change style visibility property hidden to visible 
function popupShow() {
    document.getElementById("myPopup").style.visibility = "visible";
}
// onclick on 'x' button to close pop up
function popupClose() {
    document.getElementById("myPopup").style.visibility = "hidden";
}


