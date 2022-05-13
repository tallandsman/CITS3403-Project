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

function menuDown() {
    var dropdown = document.getElementById("myMenuDown");
    dropdown.classList.toggle("show");
}

function popupFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show_popup");
}
