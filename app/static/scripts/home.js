const ROW = 10;
const COL = 10;

function init() {
    let grid = document.getElementById("boardTable");

    // Creating 10 rows
    for (let i=0; i<ROW; i++) {
        let row = document.createElement("tr");
        row.classList.add("boardRow");

        // Creating 10 cells in each row
        for (let i=0; i<COL; i++) {
            let cell = document.createElement("td");
            let div = document.createElement("div");
            cell.classList.add("boardCell");
            div.classList.add("cellDiv");
            div.classList.add("unidentified");

            cell.appendChild(div);
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }
    console.log(grid);
}

// Navigation bar
// When the button is clicked, toggle between hiding and showing the down menus
function menuDown() {
    document.getElementById("myMenuDown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.menu_btn')) {
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
