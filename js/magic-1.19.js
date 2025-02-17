/**
 *
 * Javascript / jQuery functions
 *
 *
 */

$(document).ready(function () {

/* @general functions */

/*loading spinner functions */
function showSpinner() { $('div.loading').show(); }
function hideSpinner() { $('div.loading').fadeOut('fast'); }


/* this functions opens popup */
/* -------------------------- */
function open_popup (popup_class, target_script, post_data) {
	// show spinner
	showSpinner();
	// post
    $.post(target_script, post_data, function(data) {
        $('div.popup_w'+popup_class).html(data);
        showPopup('popup_w'+popup_class);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText+"<br>Status: "+textStatus+"<br>Error: "+errorThrown); });
    // prevent reload
    return false;
}

/* this functions saves popup result */
/* --------------------------------- */
function submit_popup_data (result_div, target_script, post_data, reload) {
	// show spinner
	showSpinner();
	// set reload
	reload = typeof reload !== 'undefined' ? reload : true;
	// post
    $.post(target_script, post_data, function(data) {
        $('div'+result_div).html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        if(reload) {
	        if(data.search("alert-danger")==-1 && data.search("error")==-1 && data.search("alert-warning") == -1 )     { setTimeout(function (){window.location.reload();}, 1500); }
	        else                               		  										{ hideSpinner(); }
        }
        else {
	        hideSpinner();
        }
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    // prevent reload
    return false;
}

/* reload window function for ajax error checking */
function reload_window (data) {
	if(	data.search("alert-danger")==-1 &&
		data.search("error")==-1 &&
		data.search("alert-warning") == -1 )    { setTimeout(function (){window.location.reload();}, 1500); }
	else                               		  	{ hideSpinner(); }
}

/* hide error div if jquery loads ok
*********************************************/
$('div.jqueryError').hide();

/* Show / hide JS error */
function showError(errorText) {
	$('div.jqueryError').fadeIn('fast');
	if(errorText.length>0)  { $('.jqueryErrorText').html(errorText).show(); }
	hideSpinner();
}
function hideError() {
	$('.jqueryErrorText').html();
	$('div.jqueryError').fadeOut('fast');
}
//hide error popup
$(document).on("click", "#hideError", function() {
	hideError();
	return false;
});
//disabled links
$('.disabled a').click(function() {
	return false;
});

/* tooltip hiding fix */
function hideTooltips() { $('.tooltip').hide(); }

/* popups */
function showPopup(pClass) {
    $('#popupOverlay').fadeIn('fast');
    $('.'+pClass).fadeIn('fast');
    $('body').addClass('stop-scrolling');        //disable page scrolling on bottom
}
function hidePopup(pClass) {
    $('.'+pClass).fadeOut('fast');
}
function hidePopups() {
    $('#popupOverlay').fadeOut('fast');
    $('.popup').fadeOut('fast');
    $('body').removeClass('stop-scrolling');        //enable scrolling back
    $('.popup_w700').css("z-index", "100");        //set popup back
    hideSpinner();
}
function hidePopup2() {
    $('.popup_w400').fadeOut('fast');
    $('.popup_w500').fadeOut('fast');
    $('.popup_w700').css("z-index", "100");        //set popup back
    hideSpinner();
}
function hidePopupMasks() {
    $('.popup_wmasks').fadeOut('fast');
    hideSpinner();
}
$(document).on("click", "#popupOverlay, .hidePopups", function() { hidePopups(); });
$(document).on("click", "button.hidePopup2", function() { hidePopup2(); });
$(document).on("click", ".hidePopupMasks", function() { hidePopupMasks(); });
$(document).on("click", ".hidePopupsReload", function() { window.location.reload(); });

//prevent loading for disabled buttons
$('a.disabled, button.disabled').click(function() { return false; });

//fix for menus on ipad
$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

/*    generate random password */
function randomPass() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var pass = "";
    var x;
    var i;
    for(x=0; x<10; x++) {
        i = Math.floor(Math.random() * 62);
        pass += chars.charAt(i);
    }
    return pass;
}

/* remove self on click */
$(document).on("click", ".selfDestruct", function() {
	$(this).parent('div').fadeOut('fast');
});


/* @cookies */
function createCookie(name,value,days) {
    var date;
    var expires;

    if (typeof days === 'undefined') {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else {
	    var expires = "";
    }

    document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/* draggeable elements */
$(function() {
	$(".popup").draggable({ handle: ".pHeader" });
});




/* @dashboard widgets ----------  */

//if dashboard show widgets
if($('#dashboard').length>0) {
	//get all boxes
	$('div[id^="w-"]').each(function(){
		var w = $(this).attr('id');
		//remove w-
		w = w.replace("w-", "");
		$.post('app/dashboard/widgets/'+w+'.php', function(data) {
			$("#w-"+w+' .hContent').html(data);
		}).fail(function(xhr, textStatus, errorThrown) {
			$("#w-"+w+' .hContent').html('<blockquote style="margin-top:20px;margin-left:20px;">File not found!</blockquote>');
		});
	});
}
//show add widget pupup
$(document).on('click','.add-new-widget',function() {
    showSpinner();

    $.post('app/dashboard/widget-popup.php', function(data) {
	    $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });

	return false;
});
//remove item
$(document).on('click', "i.remove-widget", function() {
	$(this).parent().parent().fadeOut('fast').remove();
});
//add new widget form popup
$(document).on('click', '#sortablePopup li a.widget-add', function() {
	var wid   = $(this).attr('id');
	var wsize = $(this).attr('data-size');
	var wtitle= $(this).attr('data-htitle');
	//create
	var data = '<div class="row-fluid"><div class="span'+wsize+' widget-dash" id="'+wid+'"><div class="inner movable"><h4>'+wtitle+'</h4><div class="hContent"></div></div></div></div>';
	$('#dashboard').append(data);
	//load
	w = wid.replace("w-", "");
	$.post('app/dashboard/widgets/'+w+'.php', function(data) {
		$("#"+wid+' .hContent').html(data);
	}).fail(function(xhr, textStatus, errorThrown) {
		$("#"+wid+' .hContent').html('<blockquote style="margin-top:20px;margin-left:20px;">File not found!</blockquote>');
	});
	//remove item
	$(this).parent().fadeOut('fast');

	return false;
});









/* @subnets list ----------  */

/* leftmenu toggle submenus */
// default hide
$('ul.submenu.submenu-close').hide();
// left menu folder delay tooltip
$('.icon-folder-close,.icon-folder-show, .icon-search').tooltip( {
    delay: {show:2000, hide:0},
    placement:"bottom"
});
// show submenus
$('ul#subnets').on("click", ".fa-folder-close-o", function() {
    //change icon
    $(this).removeClass('fa-folder-close-o').addClass('fa-folder-open-o');
    //find next submenu and hide it
    $(this).nextAll('.submenu').slideDown('fast');
	//save cookie
    update_subnet_structure_cookie ("add", $(this).attr("data-str_id"));
});
$('ul#subnets').on("click", ".fa-folder", function() {
    //change icon
    $(this).removeClass('fa-folder').addClass('fa-folder-open');
    //find next submenu and hide it
    $(this).nextAll('.submenu').slideDown('fast');
	//save cookie
    update_subnet_structure_cookie ("add", $(this).attr("data-str_id"));
});
// hide submenus
$('ul#subnets').on("click", ".fa-folder-open-o", function() {
    //change icon
    $(this).removeClass('fa-folder-open-o').addClass('fa-folder-close-o');
    //find next submenu and hide it
    $(this).nextAll('.submenu').slideUp('fast');
	//save cookie
    update_subnet_structure_cookie ("remove", $(this).attr("data-str_id"));
});
$('ul#subnets').on("click", ".fa-folder-open", function() {
    //change icon
    $(this).removeClass('fa-folder-open').addClass('fa-folder');
    //find next submenu and hide it
    $(this).nextAll('.submenu').slideUp('fast');
	//save cookie
    update_subnet_structure_cookie ("remove", $(this).attr("data-str_id"));
});


/* Function to save subnets structure left menu to cookie */
function update_subnet_structure_cookie (action, cid) {
	// read old cookie
	var s_cookie = readCookie("sstr");
	// defualt - if empty
 	if(typeof s_cookie === 'undefined' || s_cookie==null || s_cookie.length===0)	s_cookie = "|";
	// add or replace
	if (action == "add") {
		// split to array and check if it already exists
		var arr = s_cookie.split('|');
		var exists = false;
		for(var i=0;i < arr.length;i++) {
        	if(arr[i]==cid) {
	     		exists = true;
        }	}
        // new
        if(exists==false)	s_cookie += cid+"|";
	}
	else if (action == "remove")	{
		s_cookie = s_cookie.replace("|"+cid+"|", "|");
	}
	// save cookie
	createCookie("sstr",s_cookie, 365);
}




//hide subnets list
$('#hideSubnets').click(function() {
    $('#leftMenu').hide('fast');
    //expand content
    $('#content').css("width","97.9147%");
    return false;
});

//expand/contract all
$('#expandfolders').click(function() {
    // get action
    var action = $(this).attr('data-action');
    //open
    if(action == 'close') {
        $('.subnets ul#subnets li.folder > i').removeClass('fa-folder-close-o').addClass('fa-folder-open-o');
        $('.subnets ul#subnets li.folderF > i').removeClass('fa-folder').addClass('fa-folder-open');
        $('.subnets ul#subnets ul.submenu').removeClass('submenu-close').addClass('submenu-open').slideDown('fast');
        $(this).attr('data-action','open');
        createCookie('expandfolders','1','365');
        $(this).removeClass('fa-expand').addClass('fa-compress');
    }
    else {
        $('.subnets ul#subnets li.folder > i').addClass('fa-folder-close-o').removeClass('fa-folder-open-o');
        $('.subnets ul#subnets li.folderF > i').addClass('fa-folder').removeClass('fa-folder-open');
        $('.subnets ul#subnets ul.submenu').addClass('submenu-close').removeClass('submenu-open').slideUp('fast');
        $(this).attr('data-action','close');
        createCookie('expandfolders','0','365');
        $(this).removeClass('fa-compress').addClass('fa-expand');
    }
});










/* @ipaddress list ---------- */


/*    add / edit / delete IP address
****************************************/
//show form
$(document).on("click", ".modIPaddr", function() {
    showSpinner();
    var action    = $(this).attr('data-action');
    var id        = $(this).attr('data-id');
    var subnetId  = $(this).attr('data-subnetId');
    var stopIP    = $(this).attr('data-stopIP');
    //format posted values
    var postdata = "action="+action+"&id="+id+"&subnetId="+subnetId+"&stopIP="+stopIP;
    $.post('app/subnets/addresses/address-modify.php', postdata, function(data) {
        $('div.popup_w400').html(data);
        showPopup('popup_w400');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//move orphaned IP address
$(document).on("click", "a.moveIPaddr", function() {
    showSpinner();
    var action      = $(this).attr('data-action');
    var id        = $(this).attr('data-id');
    var subnetId  = $(this).attr('data-subnetId');
    //format posted values
    var postdata = "action="+action+"&id="+id+"&subnetId="+subnetId;
    $.post('app/subnets/addresses/move-address.php', postdata, function(data) {
        $('div.popup_w400').html(data);
        showPopup('popup_w400');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//resolve DNS name
$(document).on("click", "#refreshHostname", function() {
    showSpinner();
    var ipaddress = $('input.ip_addr').val();
    $.post('app/subnets/addresses/address-resolve.php', {ipaddress:ipaddress}, function(data) {
        if(data.length !== 0) {
            $('input[name=dns_name]').val(data);
        }
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//submit ip address change
$(document).on("click", "button#editIPAddressSubmit, .editIPSubmitDelete", function() {
    //show spinner
    showSpinner();
    var postdata = $('form.editipaddress').serialize();

    //append deleteconfirm
	if($(this).attr('id') == "editIPSubmitDelete") { postdata += "&deleteconfirm=yes&action=delete"; }
    //replace delete if from visual
    if($(this).attr('data-action') == "all-delete" ) { postdata += '&action-visual=delete';}

    $.post('app/subnets/addresses/address-modify-check.php', postdata, function(data) {
        $('div.addnew_check').html(data);
        $('div.addnew_check').slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//ping check
$(document).on("click", ".ping_ipaddress", function() {
	showSpinner();
	var id       = $(this).attr('data-id');
	var subnetId = $(this).attr('data-subnetId');
	//check
	$.post('app/subnets/addresses/ping-address.php', {id:id, subnetId:subnetId}, function(data) {
        $('div.popup_w400').html(data);
        showPopup('popup_w400');
		hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});


/*    send notification mail
********************************/
//show form
$(document).on("click", "a.mail_ipaddress", function() {
    //get IP address id
    var IPid = $(this).attr('data-id');
    $.post('app/subnets/addresses/mail-notify.php', { id:IPid }, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//send mail with IP details!
$(document).on("click", "#mailIPAddressSubmit", function() {
    showSpinner();
    var mailData = $('form#mailNotify').serialize();
    //post to check script
    $.post('app/subnets/addresses/mail-notify-check.php', mailData, function(data) {
        $('div.sendmail_check').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});




/*    sort IP address list
*********************************************************/
$(document).on("click", "table.ipaddresses th a.sort", function() {
    showSpinner();

    $(this).tooltip('hide');                            //hide tooltips fix for ajax-load

    var direction = $(this).attr('data-id');            //sort direction
    var subnetId  = $(this).attr('data-subnetId');        //id of the subnet

    $.post('app/subnets/addresses/print-address-table.php', {direction:direction, subnetId:subnetId}, function(data) {
        $('div.ipaddresses_overlay').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    scan subnet
*************************/
//open popup
$('a.scan_subnet').click(function() {
	showSpinner();
	var subnetId = $(this).attr('data-subnetId');
	$.post('app/subnets/scan/subnet-scan.php', {subnetId:subnetId}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
		hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//show telnet port
$(document).on('change', "select#type", function() {
	var pingType = $('select[name=type]').find(":selected").val();
	if(pingType=="scan-telnet") { $('tbody#telnetPorts').show(); }
	else 						{ $('tbody#telnetPorts').hide(); }
});

//start scanning
$(document).on('click','#subnetScanSubmit', function() {
	showSpinner();
	var subnetId = $(this).attr('data-subnetId');
	var type 	 = $('select[name=type]').find(":selected").val();
	if($('input[name=debug]').is(':checked'))	{ var debug = 1; }
	else										{ var debug = 0; }
	var port     = $('input[name=telnetports]').val();
	$('#alert-scan').slideUp('fast');
	$.post('app/subnets/scan/subnet-scan-execute.php', {subnetId:subnetId, type:type, debug:debug, port:port}, function(data) {
        $('#subnetScanResult').html(data);
		hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//remove result
$(document).on('click', '.resultRemove', function() {
	var target = $(this).attr('data-target');
	$('tr.'+target).remove();
	return false;
});
//submit scanning result
$(document).on('click', 'a#saveScanResults', function() {
	showSpinner();
	var script   = $(this).attr('data-script');
	var subnetId = $(this).attr('data-subnetId');
	var postData = $('form.'+script+"-form").serialize();
	var postData = postData+"&subnetId="+subnetId;
	$.post('app/subnets/scan/subnet-'+script+"-result.php", postData, function(data) {
        $('#subnetScanAddResult').html(data);
        //hide if success!
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});



/*    import IP addresses
*************************/
//load CSV import form
$('a.csvImport').click(function () {
    showSpinner();
    var subnetId = $(this).attr('data-subnetId');
    $.post('app/subnets/import-subnet/index.php', {subnetId:subnetId}, function(data) {
        $('div.popup_max').html(data);
        showPopup('popup_max');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//display uploaded file
$(document).on("click", "input#csvimportcheck", function() {
    showSpinner();
    //get filetype
    var filetype = $('span.fname').html();
    $.post('app/subnets/import-subnet/print-file.php', { filetype : filetype }, function(data) {
        $('div.csvimportverify').html(data).slideDown('fast');
        hideSpinner();
        // add reload class
        $('.importFooter').removeClass("hidePopups").addClass("hidePopupsReload");
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//import file script
$(document).on("click", "input#csvImportNo", function() {
    $('div.csvimportverify').hide('fast');
});
$(document).on("click", "input#csvImportYes", function() {
    showSpinner();
    //get filetype
    var filetype = $('span.fname').html();
    // get active subnet ID
    var xlsSubnetId  = $('a.csvImport').attr('data-subnetId');
    var postData = "subnetId=" + xlsSubnetId + "&filetype=" + filetype;

    $.post('app/subnets/import-subnet/import-file.php', postData, function(data) {
        $('div.csvImportResult').html(data).slideDown('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//donwload template
$(document).on("click", "#csvtemplate", function() {
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/subnets/import-subnet/import-template.php'></iframe></div>");


	return false;
});


/*    export IP addresses
*************************/
//show fields
$('a.csvExport').click(function() {
    showSpinner();
    var subnetId = $(this).attr('data-subnetId');
    //show select fields
    $.post('app/subnets/addresses/export-field-select.php', {subnetId:subnetId}, function(data) {
	    $('div.popup_w400').html(data);
        showPopup('popup_w400');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//export
$(document).on("click", "button#exportSubnet", function() {
    var subnetId = $('a.csvExport').attr('data-subnetId');
    //get selected fields
    var exportFields = $('form#selectExportFields').serialize();
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/subnets/addresses/export-subnet.php?subnetId=" + subnetId + "&" + exportFields + "'></iframe></div>");
    return false;
});


/*	add / remove favourite subnet
*********************************/
$(document).on('click', 'a.editFavourite', function() {
	var subnetId = $(this).attr('data-subnetId');
	var action   = $(this).attr('data-action');
	var from     = $(this).attr('data-from');
	var item     = $(this);

	//remove
	$.post('app/tools/favourites/favourite-edit.php', {subnetId:subnetId, action:action, from:from}, function(data) {
		//success - widget - remove item
		if(data=='success' && from=='widget') 	{
			$('tr.favSubnet-'+subnetId).addClass('error');
			$('tr.favSubnet-'+subnetId).delay(200).fadeOut();
		}
		//success - subnet - toggle star-empty
		else if (data=='success') 				{
			$(this).toggleClass('btn-info');
			$('a.favourite-'+subnetId+" i").toggleClass('fa-star-o');
			$(item).toggleClass('btn-info');
			//remove
			if(action=="remove") {
				$('a.favourite-'+subnetId).attr('data-original-title','Click to add to favourites');
				$(item).attr('data-action','add');
			}
			//add
			else {
				$('a.favourite-'+subnetId).attr('data-original-title','Click to remove from favourites');
				$(item).attr('data-action','remove');
			}
		}
		//fail
		else {
	        $('div.popup_w500').html(data);
	        showPopup('popup_w500');
	        hideSpinner();
		}
	}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});


/*    request IP address for non-admins if locked or viewer
*********************************************************/
//show request form
$('a.request_ipaddress').click(function () {
    showSpinner();
    var subnetId  = $(this).attr('data-subnetId');
    $.post('app/tools/request-ip/index.php', {subnetId:subnetId}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//auto-suggest first available IP in selected subnet
$(document).on("click", "select#subnetId", function() {
    showSpinner();
    var subnetId = $('select#subnetId option:selected').attr('value');
    //post it via json to request_ip_first_free.php
    $.post('app/login/request_ip_first_free.php', { subnetId:subnetId}, function(data) {
        $('input.ip_addr').val(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});

//submit request
$(document).on("click", "button#requestIPAddressSubmit", function() {
    showSpinner();
    var request = $('form#requestIP').serialize();
    $.post('app/login/request_ip_result.php', request, function(data) {
        $('div#requestIPresult').html(data).slideDown('fast');
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});








/* @tools ----------- */


/* ipCalc */
//submit form
$('form#ipCalc').submit(function () {
    showSpinner();
    var ipCalcData = $(this).serialize();
    $.post('app/tools/ip-calculator/result.php', ipCalcData, function(data) {
        $('div.ipCalcResult').html(data).fadeIn('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//reset input
$('form#ipCalc input.reset').click(function () {
    $('form#ipCalc input[type="text"]').val('');
    $('div.ipCalcResult').fadeOut('fast');
});

/* search */
//submit form - topmenu
$('.searchSubmit').click(function () {
    showSpinner();
    var ip = $('.searchInput').val();
    ip = ip.replace(/\//g, "%252F");
    if($('#searchSelect input[name=addresses]').is(":checked"))	{ var addresses = "on"; }
    else														{ var addresses = "off"; }
    if($('#searchSelect input[name=subnets]').is(":checked"))	{ var subnets = "on"; }
    else														{ var subnets = "off"; }
    if($('#searchSelect input[name=vlans]').is(":checked"))		{ var vlans = "on"; }
    else														{ var vlans = "off"; }
    //lets try to detect IEto set location
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    //IE
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) 	{ var base = $('.iebase').html(); }
    else 																{ var base = ""; }
    //go to search page
    var prettyLinks = $('#prettyLinks').html();
	if(prettyLinks=="Yes")	{ window.location = base + "tools/search/"+addresses+"/"+subnets+"/"+vlans+"/"+ip; }
	else					{ window.location = base + "?page=tools&section=search&addresses="+addresses+"&subnets="+subnets+"&vlans="+vlans+"&ip="+ip; }
    return false;
});
//submit form - topmenu
$('form#userMenuSearch').submit(function () {
    showSpinner();
    var ip = $('.searchInput').val();
	ip = ip.replace(/\//g, "%252F");
    if($('#searchSelect input[name=addresses]').is(":checked"))	{ var addresses = "on"; }
    else														{ var addresses = "off"; }
    if($('#searchSelect input[name=addresses]').is(":checked"))	{ var subnets = "on"; }
    else														{ var subnets = "off"; }
    if($('#searchSelect input[name=addresses]').is(":checked"))	{ var vlans = "on"; }
    else														{ var vlans = "off"; }

    //lets try to detect IEto set location
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    //IE
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) 	{ var base = $('.iebase').html(); }
    else 																{ var base = ""; }
    //go to search page
    var prettyLinks = $('#prettyLinks').html();
	if(prettyLinks=="Yes")	{ window.location = base + "tools/search/"+addresses+"/"+subnets+"/"+vlans+"/"+ip; }
	else					{ window.location = base + "?page=tools&section=search&addresses="+addresses+"&subnets="+subnets+"&vlans="+vlans+"&ip="+ip; }
    return false;

});
//show/hide search select fields
$(document).on("mouseenter", "#userMenuSearch", function(event){
    var object1 = $("#searchSelect");
    object1.slideDown('fast');
});
$(document).on("mouseleave", '#user_menu', function(event){
	$(this).stop();
    var object1 = $("#searchSelect");
    object1.slideUp();
});
//submit form
$('form#search').submit(function () {
    showSpinner();
    var ip 		 = $('form#search .search').val();
	var postData = $(this).serialize();

	//update search page
	$.post('app/tools/search/search-results.php', postData, function(data) {
		$('div.searchResult').html(data).fadeIn('fast');
		hideSpinner();
	}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });

    return false;
});
//search export
$(document).on("click", "#exportSearch", function(event){
    var searchTerm = $(this).attr('data-post');
    $("div.dl").remove();                                                //remove old innerDiv
    $('div.exportDIVSearch').append("<div style='display:none' class='dl'><iframe src='app/tools/search/search-results-export.php?" + searchTerm + "'></iframe></div>");
    return false;
});

/* hosts */
$('#hosts').submit(function() {
    showSpinner();
    var hostname = $('input.hostsFilter').val();

    var prettyLinks = $('#prettyLinks').html();
	if(prettyLinks=="Yes")	{ window.location = base + "tools/hosts/" + hostname; }
	else					{ window.location = base + "?page=tools&section=hosts&ip=" + hostname; }
    return false;
});


/* user menu selfchange */
$('form#userModSelf').submit(function () {
    var selfdata = $(this).serialize();
    $('div.userModSelfResult').hide();

    $.post('app/tools/user-menu/user-edit.php', selfdata, function(data) {
        $('div.userModSelfResult').html(data).fadeIn('fast').delay(2000).fadeOut('slow');
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//    Generate random pass
$(document).on("click", "#randomPassSelf", function() {
    var password = randomPass();
    $('input.userPass').val(password);
    $('#userRandomPass').html( password );
    return false;
});

/* changelog */
//submit form
$('form#cform').submit(function () {
    showSpinner();
    var limit = $('form#cform .climit').val();
    var filter = $('form#cform .cfilter').val();
    //update search page
    var prettyLinks = $('#prettyLinks').html();
	if(prettyLinks=="Yes")	{ window.location = "tools/changelog/"+filter+"/"+limit+"/"; }
	else					{ window.location = "?page=tools&section=changelog&subnetId="+filter+"&sPage="+limit; }
    return false;
});

/* changePassRequired */
$('form#changePassRequiredForm').submit(function() {
	showSpinner();

    //get username
    var ipampassword1 = $('#ipampassword1', this).val();
    var ipampassword2 = $('#ipampassword2', this).val();
    //get login data
    var postData = "ipampassword1="+ipampassword1+"&ipampassword2="+ipampassword2;

    $.post('app/tools/pass-change/result.php', postData, function(data) {
        $('div#changePassRequiredResult').html(data).fadeIn('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    sort device address list
*********************************************************/
$(document).on("click", "table#switchManagement th a.sort", function() {
    showSpinner();

    $(this).tooltip('hide');                            //hide tooltips fix for ajax-load

    var direction = $(this).attr('data-id');            //sort direction

    $.post('app/tools/devices/devices-print.php', {direction:direction}, function(data) {
        $('div.devicePrintHolder').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
/* device filter */
$(document).on('submit', "#deviceFilter", function() {
	var searchData = $(this).serialize();
    $.post('app/tools/devices/devices-print.php', searchData, function(data) {
        $('div.devicePrintHolder').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });

    return false;
});

// show subnet masks popup
$(document).on("click", '.show-masks', function() {
	open_popup("masks", "app/tools/subnet-masks/popup.php", {closeClass:$(this).attr('data-closeClass')});
	return false;
});






/* @administration ---------- */

/* save server settings */
$('#settings').submit(function() {
    showSpinner();
    var settings = $(this).serialize();
    //load submit results
    $.post('app/admin/settings/settings-save.php', settings, function(data) {
        $('div.settingsEdit').html(data).slideDown('fast');
        //reload after 1 second if all is ok!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});

/* save mail settings */
$('#mailsettings').submit(function() {
    showSpinner();
    var settings = $(this).serialize();
    //load submit results
    $.post('app/admin/mail/edit.php', settings, function(data) {
        $('div.settingsMailEdit').html(data).slideDown('fast');
        //reload after 1 second if all is ok!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});

/* show/hide smtp body */
$('select#mtype').change(function() {
	var type = $(this).find(":selected").val();
	//if localhost hide, otherwise show
	if(type === "localhost") 	{ $('#mailsettingstbl tbody#smtp').hide(); }
	else 						{ $('#mailsettingstbl tbody#smtp').show(); }
});

/* test mail */
$('.sendTestMail').click(function() {
    showSpinner();
    var settings = $('form#mailsettings').serialize();
   //send mail
    $.post('app/admin/mail/test-mail.php', settings, function(data) {
        $('div.settingsMailEdit').html(data).slideDown('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    Edit users
***************************/
//open form
$('.editUser').click(function () {
    showSpinner();
    var id     = $(this).attr('data-userid');
    var action = $(this).attr('data-action');

    $.post('app/admin/users/edit.php',{id:id, action:action}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//submit form
$(document).on("click", "#editUserSubmit", function() {
    showSpinner();
    var loginData = $('form#usersEdit').serialize();

    $.post('app/admin/users/edit-result.php', loginData, function(data) {
        $('div.usersEditResult').html(data).show();
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//disable pass if domain user
$(document).on("change", "form#usersEdit select[name=authMethod]", function() {
    //get details - we need Section, network and subnet bitmask
    var type = $("select[name=authMethod]").find(":selected").val();
    //we changed to domain
    if(type == "1") { $('tbody#user_password').show(); }
    else            { $('tbody#user_password').hide(); }
});
// generate random pass
$(document).on("click", "a#randomPass", function() {
    var password = randomPass();
    $('input.userPass').val(password);
    $(this).html( password );
    return false;
});
//search domain popup
$(document).on("click", ".adsearchuser", function() {
	$('div.popup_w500').load('app/admin/users/ad-search-form.php');

    showPopup('popup_w500');
    $('.popup_w700').css("z-index", "99");        //set behind popup
    hideSpinner();
});
//search domain user result
$(document).on("click", "#adsearchusersubmit", function() {
	showSpinner();
	var dname = $('#dusername').val();
	var server = $('#adserver').find(":selected").val();
	$.post('app/admin/users/ad-search-result.php', {dname:dname, server:server}, function(data) {
		$('div#adsearchuserresult').html(data)
		hideSpinner();
	});
});
//get user data from result
$(document).on("click", ".userselect", function() {
	var uname 	 	= $(this).attr('data-uname');
	var username 	= $(this).attr('data-username');
	var email 	 	= $(this).attr('data-email');
	var server 	 	= $(this).attr('data-server');
	var server_type = $(this).attr('data-server-type');

	//fill
	$('form#usersEdit input[name=real_name]').val(uname);
	$('form#usersEdit input[name=username]').val(username);
	$('form#usersEdit input[name=email]').val(email);
	$('form#usersEdit select[name=authMethod]').val(server);
	//hide password
	$('tbody#user_password').hide();
	//check server type and fetch group membership
	if (server_type=="AD" || server_type=="LDAP") {
		$.post('app/admin/users/ad-search-result-groups-membership.php', {server:server,username:username}, function(data) {
			//some data found
			if(data.length>0) {
				// to array and check
				var groups = data.replace(/\s/g, '');
				groups = groups.split(";");
				for (m = 0; m < groups.length; ++m) {
					$("input[name='group"+groups[m]+"']").attr('checked', "checked");
				}
			}
		});
	}

	hidePopup2();
	hidePopup('popup_w500');

	return false;
});



/*    Edit groups
***************************/
//search AD group popup
$(document).on("click", ".adLookup", function() {
	$('div.popup_w700').load('app/admin/groups/ad-search-group-form.php');

    showPopup('popup_w700');
    hideSpinner();
});
//search AD domain groups
$(document).on("click", "#adsearchgroupsubmit", function() {
	showSpinner();
	var dfilter = $('#dfilter').val();
	var server = $('#adserver').find(":selected").val();
	$.post('app/admin/groups/ad-search-group-result.php', {dfilter:dfilter, server:server}, function(data) {
		$('div#adsearchgroupresult').html(data)
		hideSpinner();
	});
});
//search domaingroup  add
$(document).on("click", ".groupselect", function() {
	showSpinner();
	var gname = $(this).attr("data-gname");
	var gdescription = $(this).attr("data-gdescription");
	var gmembers = $(this).attr("data-members");
	var gid = $(this).attr("data-gid");

	$.post('app/admin/groups/edit-group-result.php', {action:"add", g_name:gname, g_desc:gdescription, gmembers:gmembers}, function(data) {
		$('div.adgroup-'+gid).html(data)
		hideSpinner();
	});
	return false;
});
//open form
$('.editGroup').click(function () {
    showSpinner();
    var id     = $(this).attr('data-groupid');
    var action = $(this).attr('data-action');

    $.post('app/admin/groups/edit-group.php',{id:id, action:action}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//submit form
$(document).on("click", "#editGroupSubmit", function() {
    showSpinner();
    var loginData = $('form#groupEdit').serialize();

    $.post('app/admin/groups/edit-group-result.php', loginData, function(data) {
        $('div.groupEditResult').html(data).show();
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//add users to group - show form
$('.addToGroup').click(function() {
    showSpinner();
	var g_id = $(this).attr('data-groupid');

    $.post('app/admin/groups/add-users.php',{g_id:g_id}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//add users to group
$(document).on("click", "#groupAddUsersSubmit", function() {
	showSpinner();
	var users = $('#groupAddUsers').serialize();

    $.post('app/admin/groups/add-users-result.php', users, function(data) {
        $('div.groupAddUsersResult').html(data).show();
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//remove users frmo group - show form
$('.removeFromGroup').click(function() {
    showSpinner();
	var g_id = $(this).attr('data-groupid');

    $.post('app/admin/groups/remove-users.php',{g_id:g_id}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//add users to group
$(document).on("click", "#groupRemoveUsersSubmit", function() {
	showSpinner();
	var users = $('#groupRemoveUsers').serialize();

    $.post('app/admin/groups/remove-users-result.php', users, function(data) {
        $('div.groupRemoveUsersResult').html(data).show();
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});


/*    Edit auth method
***************************/
//open form
$('.editAuthMethod').click(function () {
    showSpinner();
    var id     = $(this).attr('data-id');
    var action = $(this).attr('data-action');
    var type   = $(this).attr('data-type');

    $.post('app/admin/authentication-methods/edit.php',{id:id, action:action, type:type}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//submit form
$(document).on("click", "#editAuthMethodSubmit", function() {
    showSpinner();
    var loginData = $('form#editAuthMethod').serialize();

    $.post('app/admin/authentication-methods/edit-result.php', loginData, function(data) {
        $('div.editAuthMethodResult').html(data).show();
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//check connection
$('.checkAuthMethod').click(function () {
    showSpinner();
    var id     = $(this).attr('data-id');
    $.post('app/admin/authentication-methods/check-connection.php',{id:id}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    instructions
***********************/
$('#instructionsForm').submit(function () {
	var instructions = CKEDITOR.instances.instructions.getData();
	$('div.instructionsPreview').hide('fast');

    showSpinner();
    $.post('app/admin/instructions/edit-result.php', {instructions:instructions}, function(data) {
        $('div.instructionsResult').html(data).fadeIn('fast');
        if(data.search("alert-danger")==-1 && data.search("error")==-1)     	{ $('div.instructionsResult').delay(2000).fadeOut('slow'); hideSpinner(); }
        else                             	{ hideSpinner(); }
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
$('#preview').click(function () {
    showSpinner();
    var instructions = CKEDITOR.instances.instructions.getData();

    $.post('app/admin/instructions/preview.php', {instructions:instructions}, function(data) {
        $('div.instructionsPreview').html(data).fadeIn('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    log files
************************/
//display log files - selection change
$('form#logs').change(function () {
    showSpinner();
    var logSelection = $('form#logs').serialize();
    $.post('app/tools/logs/show-logs.php', logSelection, function(data) {
        $('div.logs').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//log files show details
$(document).on("click", "a.openLogDetail", function() {
    var id = $(this).attr('data-logid');
    $.post('app/tools/logs/detail-popup.php', {id:id}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//log files page change
$('#logDirection button').click(function() {
    showSpinner();
    /* get severities */
    var logSelection = $('form#logs').serialize();
    /* get first or last id based on direction */
    var direction = $(this).attr('data-direction');
    /* get Id */
    var lastId;
    if (direction == "next")     { lastId = $('table#logs tr:last').attr('id'); }
    else                         { lastId = $('table#logs tr:nth-child(2)').attr('id'); }

    /* set complete post */
    var postData = logSelection + "&direction=" + direction + "&lastId=" + lastId;

    /* show logs */
    $.post('app/tools/logs/show-logs.php', postData, function(data1) {
        $('div.logs').html(data1);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//logs export
$('#downloadLogs').click(function() {
    showSpinner();
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/logs/export.php'></iframe></div>");
    hideSpinner();
    //show downloading
    $('div.logs').prepend("<div class='alert alert-info' id='logsInfo'><i class='icon-remove icon-gray selfDestruct'></i> Preparing download... </div>");
    return false;
});
//logs clear
$('#clearLogs').click(function() {
    showSpinner();
    $.post('app/admin/logs/clear-logs.php', function(data) {
    	$('div.logs').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});



/*    Sections
********************************/
//load edit form
$('button.editSection').click(function() {
    showSpinner();
    var sectionId   = $(this).attr('data-sectionid');
    var action         = $(this).attr('data-action');
    //load edit data
    $.post("app/admin/sections/edit.php", {sectionId:sectionId, action:action}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//edit section result
$(document).on("click", "#editSectionSubmit, .editSectionSubmitDelete", function() {
    showSpinner();
    var sectionData = $('form#sectionEdit').serialize();

	//append deleteconfirm
	if($(this).attr('id') == "editSectionSubmitDelete") { sectionData += "&deleteconfirm=yes"; };

    $.post('app/admin/sections/edit-result.php', sectionData, function(data) {
        $('div.sectionEditResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//section ordering
$('button.sectionOrder').click(function() {
    showSpinner();
    //load edit data
    $.post("app/admin/sections/edit-order.php", function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//section ordering save
$(document).on("click", "#sectionOrderSubmit", function() {
    showSpinner();
	//get all ids that are checked
	var m = 0;
	var lis = $('#sortableSec li').map(function(i,n) {
	var pindex = $(this).index() +1;
		return $(n).attr('id')+":"+pindex;
	}).get().join(';');

	//post
	$.post('app/admin/sections/edit-order-result.php', {position: lis}, function(data) {
		$('.sectionOrderResult').html(data).fadeIn('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);

    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});


/*    powerDNS
********************************/

/* powerdns db settings */
$('#pdns-settings').submit(function() {
    showSpinner();
    var settings = $(this).serialize();
    //load submit results
    $.post('app/admin/powerDNS/settings-save.php', settings, function(data) {
        $('div.settingsEdit').html(data).slideDown('fast');
        //reload after 1 second if all is ok!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
/* powerdns defaults */
$('#pdns-defaults').submit(function() {
    showSpinner();
    var settings = $(this).serialize();
    //load submit results
    $.post('app/admin/powerDNS/defaults-save.php', settings, function(data) {
        $('div.settingsEdit').html(data).slideDown('fast');
        //reload after 1 second if all is ok!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//load edit form
$(document).on("click", ".editDomain", function() {
	open_popup("700", "app/admin/powerDNS/domain-edit.php", {id:$(this).attr('data-id'), action:$(this).attr('data-action')} );
});
//hide defaults
$(document).on("click", ".hideDefaults", function () {
    if ($(this).is(':checked')) { $("tbody.defaults").hide(); }
    else						{ $("tbody.defaults").show(); }
});
//submit form
$(document).on("click", "#editDomainSubmit", function() {
    submit_popup_data (".domain-edit-result", "app/admin/powerDNS/domain-edit-result.php", $('form#domainEdit').serialize());
});

// refresh subnet PTR records
$('.refreshPTRsubnet').click(function() {
	open_popup("700", "app/admin/powerDNS/refresh-ptr-records.php", {subnetId:$(this).attr('data-subnetId')} );
	return false;
});
$(document).on("click", ".refreshPTRsubnetSubmit", function() {
	submit_popup_data (".refreshPTRsubnetResult", "app/admin/powerDNS/refresh-ptr-records-submit.php", {subnetId:$(this).attr('data-subnetId')} );
	return false;
});
//edit record
$(".editRecord").click(function() {
	open_popup("700", "app/admin/powerDNS/record-edit.php", {id:$(this).attr('data-id'),domain_id:$(this).attr('data-domain_id'), action:$(this).attr('data-action')} );
	returnfalse;
});
$(document).on("click", "#editRecordSubmit", function() {
    submit_popup_data (".record-edit-result", "app/admin/powerDNS/record-edit-result.php", $('form#recordEdit').serialize());
});


/*    Firewall zones
********************************/

// firewall zone settings
$('#firewallZoneSettings').submit(function() {
    showSpinner();
    var settings = $(this).serialize();
    //load submit results
    $.post('app/admin/firewall-zones/settings-save.php', settings, function(data) {
        $('div.settingsEdit').html(data).slideDown('fast');
        //reload after 1 second if all is ok!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});

// zone edit menu
// load edit form
$(document).on("click", ".editFirewallZone", function() {
    open_popup("700", "app/admin/firewall-zones/zones-edit.php", {id:$(this).attr('data-id'), action:$(this).attr('data-action')} );
});

//submit form
$(document).on("click", "#editZoneSubmit", function() {
    submit_popup_data (".zones-edit-result", "app/admin/firewall-zones/zones-edit-result.php", $('form#zoneEdit').serialize());
});


// zone edit menu - ajax request to fetch all subnets for a specific section id
$(document).on("change", ".firewallZoneSection",(function () {
    showSpinner();
    var sectionId = $(this).serialize();
    //load results
    $.post('app/admin/firewall-zones/ajax.php', sectionId, function(data) {
        $('div.sectionSubnets').html(data).slideDown('fast');

    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    hideSpinner();
    return false;
}));

// zone edit menu - ajax request to fetch all subnets for a specific section id
$(document).on("change", ".firewallZoneVlan",(function() {
    showSpinner();
    var vlanDomain = $(this).serialize();
    //load results
    $.post('app/admin/firewall-zones/ajax.php', vlanDomain, function(data) {
        $('div.domainVlans').html(data).slideDown('fast');

    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    hideSpinner();
    return false;
}));

// mapping edit menu
// load edit form
$(document).on("click", ".editMapping", function() {
    open_popup("700", "app/admin/firewall-zones/mapping-edit.php", {id:$(this).attr('data-id'), action:$(this).attr('data-action')} );
});

//submit form
$(document).on("click", "#editMappingSubmit", function() {
    submit_popup_data (".mapping-edit-result", "app/admin/firewall-zones/mapping-edit-result.php", $('form#mappingEdit').serialize());
});

// mapping edit menu - ajax request to fetch all zone informations for the selected zone
$(document).on("change", ".mappingZoneInformation",(function() {
    showSpinner();
    var zoneId = $(this).serialize();
    //load results
    $.post('app/admin/firewall-zones/ajax.php', zoneId, function(data) {
        $('div.zoneInformation').html(data).slideDown('fast');

    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    hideSpinner();
    return false;
}));


/*    Subnets
********************************/
//show subnets
$('table#manageSubnets button[id^="subnet-"]').click(function() {
    showSpinner();
    var swid = $(this).attr('id');                    //get id
    // change icon to down
    if( $('#content-'+swid).is(':visible') )     { $(this).children('i').removeClass('fa-angle-down').addClass('fa-angle-right'); }    //hide
    else                                         { $(this).children('i').removeClass('fa-angle-right').addClass('fa-angle-down'); }    //show
    //show content
    $('table#manageSubnets tbody#content-'+swid).slideToggle('fast');
    hideSpinner();
});
//toggle show all / none
$('#toggleAllSwitches').click(function() {
    showSpinner();
    // show
    if( $(this).children().hasClass('fa-compress') ) {
        $(this).children().removeClass('fa-compress').addClass('fa-expand');            //change icon
        $('table#manageSubnets i.fa-angle-down').removeClass('fa-angle-down').addClass('fa-angle-right');    //change section chevrons
        $('table#manageSubnets tbody[id^="content-subnet-"]').hide();                                //show content
        createCookie('showSubnets',0,30);                                                            //save cookie
    }
    //hide
    else {
        $(this).children().removeClass('fa-expand').addClass('fa-compress');
        $('table#manageSubnets tbody[id^="content-subnet-"]').show();
        $('table#manageSubnets i.fa-angle-right').removeClass('fa-angle-right').addClass('fa-angle-down');    //change section chevrons
        createCookie('showSubnets',1,30);                                                            //save cookie
    }
    hideSpinner();
});
//load edit form
$('button.editSubnet').click(function() {
    showSpinner();
    var sectionId   = $(this).attr('data-sectionid');
    var subnetId    = $(this).attr('data-subnetid');
    var action         = $(this).attr('data-action');
    //format posted values
    var postdata    = "sectionId=" + sectionId + "&subnetId=" + subnetId + "&action=" + action;

    //load edit data
    $.post("app/admin/subnets/edit.php", postdata, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
//resize / split subnet
$(document).on("click", "#resize, #split, #truncate", function() {
	showSpinner();
	var action = $(this).attr('id');
	var subnetId = $(this).attr('data-subnetId');
	//dimm and show popup2
    $.post("app/admin/subnets/"+action+".php", {action:action, subnetId:subnetId}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        $('.popup_w700').css("z-index", "99");        //set behind popup
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//resize save
$(document).on("click", "button#subnetResizeSubmit", function() {
	showSpinner();
	var resize = $('form#subnetResize').serialize();
	$.post("app/admin/subnets/resize-save.php", resize, function(data) {
		$('div.subnetResizeResult').html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//split save
$(document).on("click", "button#subnetSplitSubmit", function() {
	showSpinner();
	var split = $('form#subnetSplit').serialize();
	$.post("app/admin/subnets/split-save.php", split, function(data) {
		$('div.subnetSplitResult').html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//truncate save
$(document).on("click", "button#subnetTruncateSubmit", function() {
	showSpinner();
	var subnetId = $(this).attr('data-subnetId');
	$.post("app/admin/subnets/truncate-save.php", {subnetId:subnetId}, function(data) {
		$('div.subnetTruncateResult').html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
$(document).on("submit", "#editSubnetDetails", function() {
	return false;
});
//save edit subnet changes
$(document).on("click", ".editSubnetSubmit, .editSubnetSubmitDelete", function() {

    showSpinner();
    var subnetData = $('form#editSubnetDetails').serialize();

    //if ipaddress and delete then change action!
    if($(this).hasClass("editSubnetSubmitDelete")) {
        subnetData = subnetData.replace("action=edit", "action=delete");
    }
	//append deleteconfirm
	if($(this).attr('id') == "editSubnetSubmitDelete") { subnetData += "&deleteconfirm=yes"; };

    //load results
    $.post("app/admin/subnets/edit-result.php", subnetData, function(data) {
        $('div.manageSubnetEditResult').html(data).slideDown('fast');

        //reload after 2 seconds if all is ok!
        if(data.search("alert-danger")==-1 && data.search("error")==-1) {
            showSpinner();
            var sectionId;
            var subnetId;
            var parameter;
            //reload IP address list if request came from there
            if(subnetData.search("IPaddresses") != -1) {
                //from ipcalc - load ip list
                sectionId = $('form#editSubnetDetails input[name=sectionId]').val();
                subnetId  = $('form#editSubnetDetails input[name=subnetId]').val();
	            //check for .subnet_id_new if new subnet id present and set location
	            if($(".subnet_id_new").html()!=="undefined") {
		            var subnet_id_new = $(".subnet_id_new").html();
		            if (subnet_id_new % 1 === 0) {
			            // section
			            var section_id_new = $(".section_id_new").html();
						//lets try to detect IEto set location
					    var ua = window.navigator.userAgent;
					    var msie = ua.indexOf("MSIE ");
					    //IE
					    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) 	{ var base = $('.iebase').html(); }
					    else 																{ var base = ""; }
					    //go to search page
					    var prettyLinks = $('#prettyLinks').html();
						if(prettyLinks=="Yes")	{ setTimeout(function (){window.location = base + "subnets/"+section_id_new+"/"+subnet_id_new+"/";}, 1500); }
						else					{ setTimeout(function (){window.location = base + "?page=subnets&section="+section_id_new+"&subnetId="+subnet_id_new;}, 1500); }
		            }
		            else {
		            	setTimeout(function (){window.location.reload();}, 1500);
	            	}
	            }
	            else {
		             setTimeout(function (){window.location.reload();}, 1500);
	            }
            }
            //from free space
            else if(subnetData.search("freespace") != -1) {
	            setTimeout(function (){window.location.reload();}, 1500);
            }
            //from ipcalc - ignore
            else if (subnetData.search("ipcalc") != -1) {
            }
            //from admin
            else {
                //reload
                setTimeout(function (){window.location.reload();}, 1500);
            }
        }
        //hide spinner - error
        else {
            hideSpinner();
        }
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});

//get subnet info from ripe database
$(document).on("click", "#get-ripe", function() {
	showSpinner();
	var subnet = $('form#editSubnetDetails input[name=subnet]').val();

	$.getJSON("app/admin/subnets/ripe-query.php", {subnet: subnet}, function(data) {
		//fill fields
		dcnt = 0;
		$.each(data, function(key, val) {
			//error?
			if(key=="Error") {
		        $('div.popup_w500').html("<div class='pHeader'>Error</div><div class='pContent'><div class='alert alert-warning'>"+val+"</div></div><div class='pFooter'><button class='btn btn-sm btn-default hidePopup2'>Close</button></div>");
		        showPopup('popup_w500');
		        $('popup_w700').css("z-index","99");
				hideSpinner();

			} else {
				//check taht it exists
				if($('form#editSubnetDetails #field-'+key).length) {
					$('form#editSubnetDetails #field-'+key).val(val);
					dcnt++;
				}
			}
		});
		//if no hit print it!
		if(dcnt===0) {
			var ripenote = "<div class='pHeader'>Cannot find matched fileds!</div><div class='pContent'>";
			$.each(data, function(key, val) {
				ripenote += key+": "+val+"<br>";
			})
			ripenote += "</div><div class='pFooter'><button class='btn btn-sm btn-default hidePopup2'>Close</button></div>";

	        $('div.popup_w500').html(ripenote);
	        showPopup('popup_w500');
		}
		hideSpinner();
	}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//change subnet permissions
$('.showSubnetPerm').click(function() {
	showSpinner();
	var subnetId  = $(this).attr('data-subnetId');
	var sectionId = $(this).attr('data-sectionId');

	$.post("app/admin/subnets/permissions-show.php", {subnetId:subnetId, sectionId:sectionId}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
		hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//submit permission change
$(document).on("click", ".editSubnetPermissionsSubmit", function() {
	showSpinner();
	var perms = $('form#editSubnetPermissions').serialize();
	$.post('app/admin/subnets/permissions-submit.php', perms, function(data) {
		$('.editSubnetPermissionsResult').html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//auto-suggest possible slaves select
$(document).on("click", ".dropdown-subnets li a", function() {
	var subnet = $(this).attr('data-cidr');
	var inputfield = $('form#editSubnetDetails input[name=subnet]');
	// fill
	$(inputfield).val(subnet);
	// hide
	$('.dropdown-subnets').parent().removeClass("open");
	return false;
});


/*    Add subnet from IPCalc result
*********************************/
$(document).on("click", "#createSubnetFromCalc", function() {
    $('tr#selectSection').show();
});
$(document).on("change", "select#selectSectionfromIPCalc", function() {
    //get details - we need Section, network and subnet bitmask
    var sectionId = $(this).val();
    var subnet      = $('table.ipCalcResult td#sub2').html();
    var bitmask      = $('table.ipCalcResult td#sub4').html();
    // ipv6 override
    if ($("table.ipCalcResult td#sub0").html() == "IPv6") {
    	var postdata  = "sectionId=" + sectionId + "&subnet=" + $('table.ipCalcResult td#sub3').html() + "&bitmask=&action=add&location=ipcalc";
    } else {
	    var postdata  = "sectionId=" + sectionId + "&subnet=" + subnet + "&bitmask=" + bitmask + "&action=add&location=ipcalc";
    }
    //make section active
    $('table.newSections ul#sections li#' + sectionId ).addClass('active');
    //load add Subnet form / popup
    $.post('app/admin/subnets/edit.php', postdata , function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
});
$(document).on("click", ".createfromfree", function() {
    //get details - we need Section, network and subnet bitmask
    var sectionId = $(this).attr('data-sectionId');
    var cidr      = $(this).attr('data-cidr');
    var freespaceMSISD = $(this).attr('data-masterSubnetId');
    var cidrArr   = cidr.split('/');
    var subnet    = cidrArr[0];
    var bitmask   = cidrArr[1];
    var postdata  = "sectionId=" + sectionId + "&subnet=" + subnet + "&bitmask=" + bitmask + "&freespaceMSID=" + freespaceMSISD + "&action=add&location=ipcalc";
    //load add Subnet form / popup
    $.post('app/admin/subnets/edit.php', postdata , function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});

/*    Edit subnet from ip address list
************************************/
$(document).on("click", '.edit_subnet, button.edit_subnet, button#add_subnet', function() {
    var subnetId  = $(this).attr('data-subnetId');
    var sectionId = $(this).attr('data-sectionId');
    var action    = $(this).attr('data-action');

    //format posted values
    var postdata     = "sectionId="+sectionId+"&subnetId="+subnetId+"&action="+action+"&location=IPaddresses";
    //load add Subnet form / popup
    $.post('app/admin/subnets/edit.php', postdata , function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/* Show add new VLAN on subnet add/edit on-thy-fly
***************************************************/
$(document).on("change", "select[name=vlanId]", function() {
    var domain = $("select[name=vlanId] option:selected").attr('data-domain');
    if($(this).val() == 'Add') {
        showSpinner();
        $.post('app/admin/vlans/edit.php', {action:"add", fromSubnet:"true", domain:domain}, function(data) {
            $('div.popup_w400').html(data);
            showPopup('popup_w400');
            $('.popup_w700').css("z-index", "99");        //set behind popup
            hideSpinner();
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    }
    return false;
});
//Submit new VLAN on the fly
$(document).on("click", ".vlanManagementEditFromSubnetButton", function() {
    showSpinner();
    //get new vlan details
    var postData = $('form#vlanManagementEditFromSubnet').serialize();
	//add to save script
    $.post('app/admin/vlans/edit-result.php', postData, function(data) {
        $('div.vlanManagementEditFromSubnetResult').html(data).show();
        // ok
        if(data.search("alert-danger")==-1 && data.search("error")==-1) {
            var vlanId	  = $('#vlanidforonthefly').html();
            var sectionId = $('#editSubnetDetails input[name=sectionId]').val();
            $.post('app/admin/subnets/edit-vlan-dropdown.php', {vlanId:vlanId, sectionId:sectionId} , function(data) {
                $('.editSubnetDetails td#vlanDropdown').html(data);
                //bring to front
                $('.popup_w700').delay(1000).css("z-index", "101");        //bring to front
                hideSpinner();
			}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
            //hide popup after 1 second
            setTimeout(function (){hidePopup('popup_w400'); parameter = null;}, 1000);
        }
        else                      { hideSpinner(); }
    });
    return false;
});






/*	Folders
************************************/
//create new folder popup
$('#add_folder, .add_folder').click(function() {
	showSpinner();
    var subnetId  = $(this).attr('data-subnetId');
    var sectionId = $(this).attr('data-sectionId');
    var action    = $(this).attr('data-action');
    //format posted values
    var postdata     = "sectionId="+sectionId+"&subnetId="+subnetId+"&action="+action+"&location=IPaddresses";

    $.post('app/admin/subnets/edit-folder.php', postdata, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
	}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });

    return false;
});
//submit folder changes
$(document).on("click", ".editFolderSubmit", function() {
	showSpinner();
	var postData = $('form#editFolderDetails').serialize();
	$.post('app/admin/subnets/edit-folder-result.php', postData, function(data) {
		$('.manageFolderEditResult').html("").html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});
//delete folder
$(document).on("click", ".editFolderSubmitDelete", function() {
	showSpinner();
    var subnetId  = $(this).attr('data-subnetId');
    var description  = $('form#editFolderDetails #field-description').val();
    //format posted values
    var postData     = "subnetId="+subnetId+"&description="+description+"&action=delete";
	//append deleteconfirm
	if($(this).attr('id') == "editFolderSubmitDelete") { postData += "&deleteconfirm=yes"; };
	$.post('app/admin/subnets/edit-folder-result.php', postData, function(data) {
		$('.manageFolderEditResult').html(data);
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	return false;
});




/* ---- Devices ----- */
//load edit form
$(document).on("click", ".editSwitch", function() {
	open_popup("400", "app/admin/devices/edit.php", {switchId:$(this).attr('data-switchid'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#editSwitchsubmit", function() {
    submit_popup_data (".switchManagementEditResult", "app/admin/devices/edit-result.php", $('form#switchManagementEdit').serialize());
});


/* ---- Device types ----- */
//load edit form
$(document).on("click", ".editDevType", function() {
	open_popup("400", "app/admin/device-types/edit.php", {tid:$(this).attr('data-tid'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#editDevTypeSubmit", function() {
    submit_popup_data (".devTypeEditResult", "app/admin/device-types/edit-result.php", $('form#devTypeEdit').serialize());
});


/* ---- tags ----- */
//load edit form
$('.editType').click(function() {
	open_popup("400", "app/admin/tags/edit.php", {id:$(this).attr('data-id'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#editTypesubmit", function() {
    submit_popup_data (".editTypeResult", "app/admin/tags/edit-result.php", $('form#editType').serialize());
});


/* ---- VLANs ----- */
//load edit form
$(document).on("click", ".editVLAN", function() {
    vlanNum = $(this).attr("data-number") ? $(this).attr('data-number') : "";		//set number
	open_popup("400", "app/admin/vlans/edit.php", {vlanId:$(this).attr('data-vlanid'), action:$(this).attr('data-action'), vlanNum:vlanNum, domain:$(this).attr('data-domain')} );
});
//submit form
$(document).on("click", "#editVLANsubmit", function() {
    submit_popup_data (".vlanManagementEditResult", "app/admin/vlans/edit-result.php", $('form#vlanManagementEdit').serialize());
});
//move
$(".moveVLAN").click(function() {
	open_popup("400", "app/admin/vlans/move-vlan.php", {vlanId:$(this).attr('data-vlanid')} );
});
//submit form
$(document).on("click", "#moveVLANsubmit", function() {
    submit_popup_data (".moveVLANSubmitResult", "app/admin/vlans/move-vlan-result.php", $('form#moveVLAN').serialize());
});


/* ---- VLAN domains ----- */
//load edit form
$('.editVLANdomain').click(function() {
	open_popup("400", "app/admin/vlans/edit-domain.php", {id:$(this).attr('data-domainid'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#editVLANdomainsubmit", function() {
    submit_popup_data (".domainEditResult", "app/admin/vlans/edit-domain-result.php", $('form#editVLANdomain').serialize());
});


/* ---- VRF ----- */
//load edit form
$('.vrfManagement').click(function() {
	open_popup("400", "app/admin/vrfs/edit.php", {vrfId:$(this).attr('data-vrfid'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#editVRF", function() {
    submit_popup_data (".vrfManagementEditResult", "app/admin/vrfs/edit-result.php", $('form#vrfManagementEdit').serialize());
});

/* ---- Nameservers ----- */
//load edit form
$('.nameserverManagement').click(function() {
	open_popup("700", "app/admin/nameservers/edit.php", {nameserverId:$(this).attr('data-nameserverid'), action:$(this).attr('data-action')} );
});
// add new
$(document).on("click", "#add_nameserver", function() {
	showSpinner();
	//get old number
	var num = $(this).attr("data-id");
	// append
	$('table#nameserverManagementEdit2 tbody#nameservers').append("<tr id='namesrv-"+num+"'><td>Nameserver "+num+"</td><td><input type='text' class='rd form-control input-sm' name='namesrv-"+num+"'></input><td><button class='btn btn-sm btn-default' id='remove_nameserver' data-id='namesrv-"+num+"'><i class='fa fa-trash-o'></i></buttom></td></td></tr>");
	// add number
	num++;
	$(this).attr("data-id", num);

	hideSpinner();
	return false;
});
// remove
$(document).on("click", "#remove_nameserver", function() {
	showSpinner();
	//get old number
	var id = $(this).attr("data-id");
	// append
	var el = document.getElementById(id);
	el.parentNode.removeChild(el);

	hideSpinner();
	return false;
});
//submit form
$(document).on("click", "#editNameservers", function() {
    submit_popup_data (".nameserverManagementEditResult", "app/admin/nameservers/edit-result.php", $('form#nameserverManagementEdit').serialize());
});


/* ---- IP requests ----- */
//load edit form
$('table#requestedIPaddresses button').click(function() {
	open_popup("700", "app/admin/requests/edit.php", {requestId:$(this).attr('data-requestid')} );
});
//submit form
$(document).on("click", "button.manageRequest", function() {
    var postValues = $('form.manageRequestEdit').serialize();
    var action     = $(this).attr('data-action');
    var postData   = postValues+"&action="+action;
    // submit
    submit_popup_data (".manageRequestResult", "app/admin/requests/edit-result.php", postData);
});


/* ---- Share subnet ----- */
//load edit form
$('.shareTemp').click(function() {
	open_popup("700", "app/tools/temp-shares/edit.php", {type:$(this).attr('data-type'), id:$(this).attr('data-id')} );
	return false;
});
//submit form
$(document).on("click", "#shareTempSubmit", function() {
    submit_popup_data (".shareTempSubmitResult", "app/tools/temp-shares/edit-result.php", $('form#shareTempEdit').serialize());
});
//remove temp
$('.removeSharedTemp').click(function() {
	showPopup("popup_w400");
    submit_popup_data (".popup_w400", "app/tools/temp-shares/delete-result.php", {code:$(this).attr('data-code')});
    hideSpinner();
});



/*    Ripe AS import
****************************/
//get subnets form AS
$('form#ripeImport').submit(function() {
    showSpinner();
    var as = $(this).serialize();
    $.post('app/admin/ripe-import/ripe-telnet.php', as, function(data) {
        $('div.ripeImportTelnet').html(data).fadeIn('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
// remove as line
$(document).on("click", "table.asImport .removeSubnet", function() {
    $(this).parent('tr').remove();
    hideTooltips();
});
// add selected to db
$(document).on("submit", "form#asImport", function() {
    showSpinner();
    //get subnets to add
    var importData = $(this).serialize();
    $.post('app/admin/ripe-import/import-subnets.php', importData, function(data) {
        $('div.ripeImportResult').html(data).slideDown('fast');
        //hide after 2 seconds
        if(data.search("alert-danger")==-1 && data.search("error")==-1)     { $('table.asImport').delay(1000).fadeOut('fast'); hideSpinner(); }
        else                             { hideSpinner(); }
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*    set selected IP fields
********************************/
$('button#filterIPSave').click(function() {
    showSpinner();
    var addata = $('form#filterIP').serialize();
    $.post('app/admin/filter-fields/filter-result.php', addata, function(data) {
        $('div.filterIPResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        if(data.search("alert-danger")==-1 && data.search("error")==-1)     { $('div.filterIPResult').delay(2000).fadeOut('slow');    hideSpinner(); }
        else                             { hideSpinner(); }
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});




/*    custom fields - general
************************************/

//show edit form
$(document).on("click", ".edit-custom-field", function() {
    showSpinner();
    var action    = $(this).attr('data-action');
    var fieldName = $(this).attr('data-fieldname');
    var table	  = $(this).attr('data-table');
    $.post('app/admin/custom-fields/edit.php',  {action:action, fieldName:fieldName, table:table}, function(data) {
        $('div.popup_w400').html(data);
        showPopup('popup_w400');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//submit change
$(document).on("click", "#editcustomSubmit", function() {
    showSpinner();
    var field = $('form#editCustomFields').serialize();
    $.post('app/admin/custom-fields/edit-result.php', field, function(data) {
        $('div.customEditResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//field reordering
$('table.customIP button.down').click(function() {
    showSpinner();
    var current  = $(this).attr('data-fieldname');
    var next     = $(this).attr('data-nextfieldname');
    var table	 = $(this).attr('data-table');
    $.post('app/admin/custom-fields/order.php', {current:current, next:next, table:table}, function(data) {
        $('div.'+table+'-order-result').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//filter
$('.edit-custom-filter').click(function() {
	showSpinner();
	var table = $(this).attr('data-table');
    $.post('app/admin/custom-fields/filter.php',  {table:table}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
$(document).on("click", "#editcustomFilterSubmit", function() {
    showSpinner();
    var field = $('form#editCustomFieldsFilter').serialize();
    $.post('app/admin/custom-fields/filter-result.php', field, function(data) {
        $('div.customEditFilterResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});







/* Languages
*********/
//Load edit lang form
$('button.lang').click(function() {
    showSpinner();
    var langid    = $(this).attr('data-langid');
    var action   = $(this).attr('data-action');
    $.post('app/admin/languages/edit.php', {langid:langid, action:action}, function(data) {
        $('div.popup_w400').html(data);
        showPopup('popup_w400');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//Edit lang details
$(document).on("click", "#langEditSubmit", function() {
    showSpinner();
    var ldata = $('form#langEdit').serialize();
    $.post('app/admin/languages/edit-result.php', ldata, function(data) {
        $('div.langEditResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/* Widgets
*********/
//Load edit widget form
$('button.wedit').click(function() {
    showSpinner();
    var wid    = $(this).attr('data-wid');
    var action = $(this).attr('data-action');
    $.post('app/admin/widgets/edit.php', {wid:wid, action:action}, function(data) {
        $('div.popup_w500').html(data);
        showPopup('popup_w500');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//Edit widgets details
$(document).on("click", "#widgetEditSubmit", function() {
    showSpinner();
    var ldata = $('form#widgetEdit').serialize();
    $.post('app/admin/widgets/edit-result.php', ldata, function(data) {
        $('div.widgetEditResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});



/* API
*********/
//Load edit API form
$('button.editAPI').click(function() {
    showSpinner();
    var appid    = $(this).attr('data-appid');
    var action   = $(this).attr('data-action');
    $.post('app/admin/api/edit.php', {appid:appid, action:action}, function(data) {
        $('div.popup_w700').html(data);
        showPopup('popup_w700');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//Edit API details
$(document).on("click", "#apiEditSubmit", function() {
    showSpinner();
    var apidata = $('form#apiEdit').serialize();
    $.post('app/admin/api/edit-result.php', apidata, function(data) {
        $('div.apiEditResult').html(data).slideDown('fast');
        //reload after 2 seconds if succeeded!
        reload_window (data);
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});
//regenerate API key
$(document).on('click', "#regApiKey", function() {
	showSpinner();
    $.post('app/admin/api/generate-key.php', function(data) {
        $('input#appcode').val(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});




/* agents
*********/
//load edit form
$('.editAgent').click(function() {
	open_popup("700", "app/admin/scan-agents/edit.php", {id:$(this).attr('data-id'), action:$(this).attr('data-action')} );
});
//submit form
$(document).on("click", "#agentEditSubmit", function() {
    submit_popup_data (".agentEditResult", "app/admin/scan-agents/edit-result.php", $('form#agentEdit').serialize());
});
//regenerate agent key
$(document).on('click', "#regAgentKey", function() {
	showSpinner();
    $.post('app/admin/api/generate-key.php', function(data) {
        $('input[name=code]').val(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});





/*    Search and replace
************************/
$('button#searchReplaceSave').click(function() {
    showSpinner();
    var searchData = $('form#searchReplace').serialize();
    $.post('app/admin/replace-fields/result.php', searchData, function(data) {
        $('div.searchReplaceResult').html(data);
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*  Data Import / Export
*************************/
// XLS exports
$('button#XLSdump').click(function () {
    showSpinner();
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/generate-xls.php'></iframe></div>");
    hideSpinner();
});
// MySQL export
$('button#MySQLdump').click(function () {
    showSpinner();
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/generate-mysql.php'></iframe></div>");
    hideSpinner();
});
// Hostfile export
$('button#hostfileDump').click(function () {
    showSpinner();
    $("div.dl").remove();    //remove old innerDiv
    $('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/generate-hosts.php'></iframe></div>");
    hideSpinner();
});
//Export Section
$('button.dataExport').click(function () {
	var implemented = ["vrf","vlan","subnets"]; var popsize = {};
	popsize["subnets"] = "w700";
	var dataType = $('select[name=dataType]').find(":selected").val();
    //show popup window
	if (implemented.indexOf(dataType) > -1) {
		showSpinner();
		$.post('app/admin/import-export/export-' + dataType + '-field-select.php', function(data) {
		if (popsize[dataType] !== undefined) {
			$('div.popup_'+popsize[dataType]).html(data);
			showPopup('popup_'+popsize[dataType]);
		} else {
			$('div.popup_w400').html(data);
			showPopup('popup_w400');
		}
		hideSpinner();
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	} else {
		$.post('app/admin/import-export/not-implemented.php', function(data) {
		$('div.popup_w400').html(data);
		showPopup('popup_w400');
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	}
    return false;
});
//export buttons
$(document).on("click", "button#dataExportSubmit", function() {
    //get selected fields
	var dataType = $(this).attr('data-type');
    var exportFields = $('form#selectExportFields').serialize();
	//show popup window
	switch(dataType) {
		case 'vrf':
			$("div.dl").remove();    //remove old innerDiv
			$('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/export-vrf.php?" + exportFields + "'></iframe></div>");
			setTimeout(function (){hidePopups();}, 1500);
			break;
		case 'vlan':
			var exportDomains = $('form#selectExportDomains').serialize();
			$("div.dl").remove();    //remove old innerDiv
			$('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/export-vlan.php?" + exportDomains + "&" + exportFields + "'></iframe></div>");
			setTimeout(function (){hidePopups();}, 1500);
			break;
		case 'subnets':
			var exportSections = $('form#selectExportSections').serialize();
			$("div.dl").remove();    //remove old innerDiv
			$('div.exportDIV').append("<div style='display:none' class='dl'><iframe src='app/admin/import-export/export-subnets.php?" + exportSections + "&" + exportFields + "'></iframe></div>");
			setTimeout(function (){hidePopups();}, 1500);
			break;
	}
    return false;
});
// Check/uncheck all
$(document).on("click", "input#exportSelectAll", function() {
	if(this.checked) { // check select status
		$('input#exportCheck').each(function() { //loop through each checkbox
			this.checked = true;  //deselect all checkboxes with same class
		});
	}else{
		$('input#exportCheck').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with same class
		});
	}
});
// Check/uncheck all
$(document).on("click", "input#recomputeSectionSelectAll", function() {
	if(this.checked) { // check select status
		$('input#recomputeSectionCheck').each(function() { //loop through each checkbox
			this.checked = true;  //select all checkboxes with same class
		});
	}else{
		$('input#recomputeSectionCheck').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with same class
		});
	}
});
// Check/uncheck all
$(document).on("click", "input#recomputeIPv4SelectAll", function() {
	if(this.checked) { // check select status
		$('input#recomputeIPv4Check').each(function() { //loop through each checkbox
			this.checked = true;  //select all checkboxes with same class
		});
	}else{
		$('input#recomputeIPv4Check').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with same class
		});
	}
});
// Check/uncheck all
$(document).on("click", "input#recomputeIPv6SelectAll", function() {
	if(this.checked) { // check select status
		$('input#recomputeIPv6Check').each(function() { //loop through each checkbox
			this.checked = true;  //select all checkboxes with same class
		});
	}else{
		$('input#recomputeIPv6Check').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with same class
		});
	}
});
// Check/uncheck all
$(document).on("click", "input#recomputeCVRFSelectAll", function() {
	if(this.checked) { // check select status
		$('input#recomputeCVRFCheck').each(function() { //loop through each checkbox
			this.checked = true;  //select all checkboxes with same class
		});
	}else{
		$('input#recomputeCVRFCheck').each(function() { //loop through each checkbox
			this.checked = false; //deselect all checkboxes with same class
		});
	}
});
//Import Section
$('button.dataImport').click(function () {
	var implemented = ["vrf","vlan","subnets","recompute"]; var popsize = {};
	popsize["subnets"] = "max";
	var dataType = $('select[name=dataType]').find(":selected").val();
    //show popup window, if implemented
	if (implemented.indexOf(dataType) > -1) {
		showSpinner();
		$.post('app/admin/import-export/import-' + dataType + '-select.php', function(data) {
		if (popsize[dataType] !== undefined) {
			$('div.popup_'+popsize[dataType]).html(data);
			showPopup('popup_'+popsize[dataType]);
		} else {
			$('div.popup_w700').html(data);
			showPopup('popup_w700');
		}
		hideSpinner();
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	} else {
		$.post('app/admin/import-export/not-implemented.php', function(data) {
		$('div.popup_w400').html(data);
		showPopup('popup_w400');
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	}
    return false;
});
//import buttons
$(document).on("click", "button#dataImportPreview", function() {
    //get data from previous window
	var implemented = ["vrf","vlan","subnets","recompute"]; var popsize = {};
	popsize["subnets"] = "max"; popsize["recompute"] = "max";
	var dataType = $(this).attr('data-type');
    var importFields = $('form#selectImportFields').serialize();
    //show popup window, if implemented
	if (implemented.indexOf(dataType) > -1) {
		showSpinner();
		$.post('app/admin/import-export/import-' + dataType + '-preview.php?' + importFields, function(data) {
		if (popsize[dataType] !== undefined) {
			$('div.popup_'+popsize[dataType]).html(data);
			showPopup('popup_'+popsize[dataType]);
		} else {
			$('div.popup_w700').html(data);
			showPopup('popup_w700');
		}
		hideSpinner();
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	} else {
		$.post('app/admin/import-export/not-implemented.php', function(data) {
		$('div.popup_w400').html(data);
		showPopup('popup_w400');
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	}
    return false;
});
$(document).on("click", "button#dataImportSubmit", function() {
    //get data from previous window
	var implemented = ["vrf","vlan","subnets","recompute"]; var popsize = {};
	popsize["subnets"] = "max";	popsize["recompute"] = "max";
	var dataType = $(this).attr('data-type');
    var importFields = $('form#selectImportFields').serialize();
    //show popup window, if implemented
	if (implemented.indexOf(dataType) > -1) {
		showSpinner();
		$.post('app/admin/import-export/import-' + dataType + '.php?' + importFields, function(data) {
		if (popsize[dataType] !== undefined) {
			$('div.popup_'+popsize[dataType]).html(data);
			showPopup('popup_'+popsize[dataType]);
		} else {
			$('div.popup_w700').html(data);
			showPopup('popup_w700');
		}
		hideSpinner();
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	} else {
		$.post('app/admin/import-export/not-implemented.php', function(data) {
		$('div.popup_w400').html(data);
		showPopup('popup_w400');
		}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
	}
    return false;
});
// recompute button
$('button.dataRecompute').click(function () {
	showSpinner();
	$.post('app/admin/import-export/import-recompute-select.php', function(data) {
	$('div.popup_w700').html(data);
	showPopup('popup_w700');
	hideSpinner();
	}).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});


/*	Fix database
***********************/
$(document).on('click', '.btn-tablefix', function() {
	var tableid = $(this).attr('data-tableid');
	var fieldid = $(this).attr('data-fieldid');
	var type 	= $(this).attr('data-type');
    $.post('app/admin/verify-database/fix.php', {tableid:tableid, fieldid:fieldid, type:type}, function(data) {
        $('div#fix-result-'+tableid+fieldid).html(data).fadeIn('fast');
        hideSpinner();
    }).fail(function(jqxhr, textStatus, errorThrown) { showError(jqxhr.statusText + "<br>Status: " + textStatus + "<br>Error: "+errorThrown); });
    return false;
});



return false;
});
