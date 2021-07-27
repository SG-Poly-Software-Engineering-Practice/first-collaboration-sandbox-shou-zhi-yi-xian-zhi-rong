document.write('\
<script>\
    document.addEventListener("DOMContentLoaded", function(){\
        var currentUrl = new URL(window.location.href);\
        var errMsg = currentUrl.searchParams.get("errMsg");\
        var goodMsg = currentUrl.searchParams.get("goodMsg");\
        if(errMsg != null && errMsg != "") {\
            document.getElementById("errDiv").innerHTML = errMsg;\
            document.getElementById("errDiv").setAttribute("style", "display:block;");\
        }\
        else if(goodMsg != null && goodMsg != "") {\
            document.getElementById("goodDiv").innerHTML = goodMsg;\
            document.getElementById("goodDiv").setAttribute("style", "display:block;");\
        }\
    }, false);\
</script>\
<div class="row">\
    <div class="col-lg-6">\
        <div class="alert alert-danger" id="errDiv" style="display:none;"></div>\
        <div class="alert alert-success" id="goodDiv" style="display:none;"></div>\
    </div>\
</div>');