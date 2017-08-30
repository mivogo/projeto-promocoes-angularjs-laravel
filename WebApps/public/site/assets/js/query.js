$(document).on('click',function(e) {
	console.log($(e.target).closest('.notifications').length);
	if($(e.target).closest('.notifications').length) {
		return;
	}else{
		$('#notifications-menu').removeClass('in');
	}
});