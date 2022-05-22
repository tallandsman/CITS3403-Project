// Navigation bar
// Close the dropdown menu when a user clicks not the menu button
// Close the pop up 'how to play' when a user click not the pop up space
window.onclick = function(event) {
    if (!event.target.matches('.menu_btn, .menu_btn *')) {
        var openDropdown = document.getElementById("myMenuDown");
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
    if (!event.target.matches('.box_howtoplay, .down_item')) {
        var openDropdown = document.getElementById("myPopup");
        if (openDropdown.classList.contains('show_popup')) {
            openDropdown.classList.remove('show_popup');
        }
    }
}
// When the menu button is clicked, toggle class named show and it shows and hides the down menus
function menuDown() {
    var dropdown = document.getElementById("myMenuDown");
    dropdown.classList.toggle("show");
}
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
