var authToken = sessionStorage.getItem('token');
if (authToken == null || authToken == "") {
    window.location.href = '/A1/staffLogin.html';
}
fetch(new Request('/api/checkToken',
{
    method: 'GET',
    headers: {
        Authorization: 'Bearer ' + authToken
    }
})).then(function (response) {
    return response.json();
}).then(function (data) {
    if(!data.success) {
        window.location.href = '/A1/staffLogin.html';
    }
}).catch(function (error) {
    console.log(error);
});

var staff = JSON.parse(sessionStorage.getItem('staff'));
document.addEventListener('DOMContentLoaded', function(){
    fetch(new Request('/api/getStaffRoles/' + staff.id,
    {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + authToken
        }
    })).then(function (response) {
        return response.json();
    }).then(function (result) {
        if(result.role != null && result.role != "") {
            var role = result.role;
            var htmlTxt = '\
            <a style="color: #C5C5C5;" href="#" class="dropdown-toggle" data-toggle="dropdown">\
                <i class="icon icon-group"></i> ' + role.name + ' ' + result.accessRight + '\
                <b class="caret"></b>\
            </a>\
            <ul class="dropdown-menu" style="min-width: 300px">\
                <li>\
                    <a href="#"><i class="icon icon-user"></i> ' + role.name + ' ' + result.accessRight + '</a>\
                </li>\
            </ul>';
            document.getElementById('rolesLi').innerHTML = htmlTxt;
            
            var ulTxt = '';
            var approvedRolesID = null;
            var roleCanView;
            var roleCanView2;
            var roleCanView3;
            var roleCanView4;
            var roleCanView5;

            approvedRolesID = [1, 2, 11];
            roleCanView = false;
            for (i = 0; i < approvedRolesID.length; i++) {
                if (role.id == approvedRolesID[i]) {
                    roleCanView = true;
                    break;
                }
            }
            if (roleCanView) {
                ulTxt += '\
                <li>\
                    <a href="javascript:;" data-toggle="collapse" data-target="#commonInfrastructure" style="color: #C5C5C5;">\
                        <i class="icon icon-user"></i> Common Infrastructure <i class="icon icon-caret-down"></i>\
                    </a>\
                    <ul id="commonInfrastructure" class="collapse">\
                        <li>\
                            <a href="#">Account Management</a>\
                        </li>\
                    </ul>\
                </li>'
            }

            approvedRolesID = [1, 2, 3, 4, 7, 8, 11];
            roleCanView = false;
            roleCanView2 = true;
            roleCanView3 = true;
            roleCanView4 = true;
            roleCanView5 = true;

            for (i = 0; i < approvedRolesID.length; i++) {
                if (role.id == approvedRolesID[i]) {
                    roleCanView = true;
                }
                if (role.id == 8) {//Manufacturing Facility Manager
                    roleCanView2 = false;
                }
                if (role.id == 3) {//Manufacturing Facility Manager
                    roleCanView3 = false;
                }
                if (role.id == 4) {//Manufacturing Facility Manager
                    roleCanView4 = false;
                }
                if (role.id == 7) {//Manufacturing Facility Manager
                    roleCanView5 = false;
                }
            }
            if (roleCanView) {
                ulTxt +='\
                <li>\
                    <a href="javascript:;" data-toggle="collapse" data-target="#SCM" style="color: #C5C5C5;">\
                        <i class="icon icon-home"></i> SCM <i class="icon icon-caret-down"></i>\
                    </a>\
                    <ul id="SCM" class="collapse" style="color: #C5C5C5;">\
                        <li>\
                            <a href="/A3/purchaseOrderManagement.html">Retail Products and Raw Materials Purchasing</a>\
                        </li>';
                if ((roleCanView3) && (roleCanView2) && (roleCanView4)) {
                    ulTxt +='\
                    <li>\
                        <a href="#">Supplier Management</a>\
                    </li>';
                }
                if (roleCanView5) {
                    ulTxt +='\
                    <li>\
                        <a href="/A3/shippingOrderManagement.html">Inbound and Outbound Logistics</a>\
                    </li>';
                }
                if ((roleCanView4) && (roleCanView5)) {
                    ulTxt +='\
                    <li>\
                         <a href="#">Manufacturing\'s Warehouse Management</a>\
                    </li>';
                }
                ulTxt += '\
                    </ul>\
                </li>';
            }

            approvedRolesID = [1, 2, 3, 4, 11];
            roleCanView = false;
            for (i = 0; i < approvedRolesID.length; i++) {
                if (role.id == approvedRolesID[i]) {
                    roleCanView = true;
                }
            }
            if (roleCanView) {
                ulTxt += '\
                <li>\
                    <a href="javascript:;" data-toggle="collapse" data-target="#store" style="color: #C5C5C5;">\
                        <i class="icon icon-home"></i> Store Inventory <i class="icon icon-caret-down"></i>\
                    </a>\
                    <ul id="store" class="collapse">\
                        <li>\
                            <a href="#">Store\'s Inventory Management</a>\
                        </li>\
                    </ul>\
                </li>';
            }

            approvedRolesID = [1,2,4,5,11,10];
            roleCanView = false;
            roleCanView2 = true;
            roleCanView3 = true;
            roleCanView4 = true;
            roleCanView5 = true;
            for (i = 0; i < approvedRolesID.length; i++) {
                if (role.id == approvedRolesID[i]) {
                    roleCanView = true;
                    break;
                }
                if (role.id == 5) {//Marketing Director 
                    roleCanView2 = false;
                }
                if (role.id == 4) {
                    roleCanView3 = false;
                }
                if (role.id == 2) {
                    roleCanView4 = false;
                }
                if (role.id == 10) {//Receptionist
                    roleCanView2 = false;
                    roleCanView3 = false;
                    roleCanView5 = false;
                }
            }
            if (roleCanView) {
                ulTxt += '\
                <li>\
                    <a href="javascript:;" data-toggle="collapse" data-target="#operationalCRM" style="color: #C5C5C5;">\
                        <i class="icon icon-cogs"></i> Operational CRM <i class="icon icon-caret-down"></i>\
                    </a>\
                    <ul id="operationalCRM" class="collapse">';
                if ((roleCanView3) && (roleCanView4)) {
                    ulTxt += '\
                    <li>\
                        <a href="#">Loyalty & Rewards</a>\
                    </li>';
                }
                ulTxt += '\
                <li>\
                    <a href="#">Loyalty Card Management</a>\
                </li>';
                if (roleCanView2) {
                    ulTxt += '\
                    <li>\
                        <a href="#">Customer Service</a>\
                    </li>';
                }
                if (roleCanView5) {
                    ulTxt += '\
                    <li>\
                        <a href="#">Promotional Sales</a>\
                    </li>';
                }
                ulTxt += '\
                    </ul>\
                </li>';
            }

            approvedRolesID = [1,6,11];
            roleCanView = false;
            roleCanView2 = true;
            for (i = 0; i < approvedRolesID.length; i++) {
                if (role.id == approvedRolesID[i]) {
                    roleCanView = true;
                    break;
                }
            }
            if (role.id == 6) {//Marketing Director 
                roleCanView2 = false;
            }
            if (roleCanView) {
                ulTxt += '\
                <li>\
                    <a href="javascript:;" data-toggle="collapse" data-target="#corporateCRM" style="color: #C5C5C5;">\
                        <i class="icon icon-briefcase"></i> Corporate Management <i class="icon icon-caret-down"></i>\
                    </a>\
                    <ul id="corporateCRM" class="collapse">';
                if (roleCanView2) {
                    ulTxt += '\
                    <li>\
                        <a href="#">Facility Management</a>\
                    </li>';
                }
                ulTxt += '\
                        <li>\
                            <a href="/A6/itemManagement.html">Item Management</a>\
                        </li>\
                        <li>\
                            <a href="#">Restaurant Management</a>\
                        </li>\
                    </ul>\
                </li>';
            }

            document.getElementById('roleUl').innerHTML = ulTxt
        }
    }).catch(function (error) {
        console.log(error);
    });
}, false);

function logout() {
    sessionStorage.clear();
    window.location.href = "/A1/staffLogin.html?goodMsg=Logout Successfully.";
}

document.write('\
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation" >\
    <div class="navbar-header">\
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">\
            <span class="sr-only">Toggle navigation</span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
        </button>\
        <a class="navbar-brand" href="/A1/workspace.html" style="color: #C5C5C5;">Island Furniture - Staff Portal</a>\
    </div>\
    <ul class="nav navbar-right top-nav">\
        <li class="dropdown">\
            <a style="color: #C5C5C5;" href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon icon-envelope"> Inbox</i> <b class="caret"></b></a>\
            <ul class="dropdown-menu message-dropdown">\
                <li class="message-footer">\
                    <a href="#">No Message</a>\
                </li>\
            </ul>\
        </li>\
        <li id="rolesLi"></li>\
        <li class="dropdown">\
            <a style="color: #C5C5C5;" href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="icon icon-user"></i> ' + staff.name + '<b class="caret"></b></a>\
            <ul class="dropdown-menu">\
                <li>\
                    <a href="/A1/staffProfile.html"><i class="icon icon-user"></i> Profile</a>\
                </li>\
                <li>\
                    <a href="#"><i class="icon icon-envelope"></i> Inbox</a>\
                </li>  \
                <li class="divider"></li>\
                <li>\
                    <a href="#" onclick="logout()"><i class="icon icon-power-off"></i> Log Out</a>\
                </li>\
            </ul>\
        </li>\
    </ul>\
    <div class="collapse navbar-collapse navbar-ex1-collapse">\
        <ul class="nav navbar-nav side-nav" id="roleUl"></ul>\
    </div>\
</nav>');