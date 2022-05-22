// statistics table tab
// When tab button is clicked, all tabs will be reset to invisible then only the tab click will be visible
function openStat(event, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active","");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

// Sorting table by date
// TODO: Not working :(
// document.getElementById("sort-date").addEventListener("click", sortByDate);

// function convertDate(d) {
//     var p = d.split("/");
//     return +(p[2]+p[1]+p[0]);
// }

// function sortByDate() {
//     var tbody = document.querySelector("#results tbody");
//     var rows = [].slice.call(tbody.querySelectorAll("tr"));

//     rows.sort(function(a,b) {
//         return convertDate(a.cells[0].innerHTML) - convertDate(b.cells[0].innerHTML);
//     });

//     rows.forEach(function(v) {
//         tbody.appendChild(v);
//     });
// }


// function convertDate(d) {
//     var p = d.split("/");
//     return +(p[2]+p[1]+p[0]);
//   }
  
//   function sortByDate() {
//     var tbody = document.querySelector("#results tbody");
//     // get trs as array for ease of use
//     var rows = [].slice.call(tbody.querySelectorAll("tr"));
    
//     rows.sort(function(a,b) {
//       return convertDate(a.cells[0].innerHTML) - convertDate(b.cells[0].innerHTML);
//     });
    
//     rows.forEach(function(v) {
//       tbody.appendChild(v); // note that .appendChild() *moves* elements
//     });
//   }
  
//   document.querySelector("button").addEventListener("click", sortByDate);

