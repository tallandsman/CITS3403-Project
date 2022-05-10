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