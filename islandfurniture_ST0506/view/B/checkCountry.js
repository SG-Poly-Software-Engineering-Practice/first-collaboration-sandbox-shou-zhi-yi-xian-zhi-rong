var locationOfUser = localStorage.getItem("selectedCountry");
if(locationOfUser == null || locationOfUser == '') {
    window.location.href = "/B/selectCountry.html";
}