$(document).on('click',function(e) {
	if($(e.target).closest('.notifications').length) {
		return;
	}else{
		$('#notifications-menu').removeClass('in');
	}
});