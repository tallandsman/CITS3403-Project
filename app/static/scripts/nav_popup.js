// Navigation bar
// Colose the dropdown menu if the user clicks not the menu button
window.onclick = function(event) {
    // console.log(event.target.matches('.menu_btn, .menu_btn *'))
    if (!event.target.matches('.menu_btn, .menu_btn *')) {
        var openDropdown = document.getElementById("myMenuDown");
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}
// When the menu button is clicked, toggle class named show and it shows and hides the down menus
function menuDown() {
    var dropdown = document.getElementById("myMenuDown");
    dropdown.classList.toggle("show");
}
// Pop up 'how to play'

// Not working at the moment, if it's activated nav onclick function doesn't work 
// Exits by 'X' button doesn't look too bad
// Colose the dropdown menu if the user clicks not the menu button
// window.onclick = function(event) {
//     if (!event.target.matches('.box_howtoplay, .down_item')) {
//         var popup = document.getElementById("myPopup");
//         if (popup.classList.contains('show_popup')) {
//             popup.classList.remove('show_popup');
//         }
//     }
// }

// When the how to play menu is clicked, how to play pop up will be shown
function popupShow() {
    var showpopup = document.getElementById("myPopup");
    showpopup.classList.toggle("show_popup");
}
// onclick on 'x' button to close pop up
function popupClose() {
    var popup = document.getElementById("myPopup");
    if (popup.classList.contains('show_popup')) {
        popup.classList.remove('show_popup');
    }
}
