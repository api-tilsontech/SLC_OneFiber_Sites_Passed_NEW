var sidebar = L.control.sidebar("sidebar", {
    closeButton: false,
    position: "left",
    autoPan: false
}).addTo(map);

// GIS SITES INFO SIDEBAR

$("#gisSitesClose-sidebarBTN").click(function(){
  sidebar.close();
});