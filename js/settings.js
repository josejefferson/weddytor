// var set_darkTheme = conv($.cookie('darkTheme')) == undefined ? $('#darkTheme').prop('checked') : conv($.cookie('darkTheme'));
// var set_editorFontSize = conv($.cookie('editorFontSize')) == undefined ? 14 : conv($.cookie('editorFontSize'));
// var set_autoSave = conv($.cookie('autoSave')) == undefined ? $('#autoSave').prop('checked') : conv($.cookie('autoSave'));
// var set_exitAutoSave = conv($.cookie('exitAutoSave')) == undefined ? $('#exitAutoSave').prop('checked') : conv($.cookie('exitAutoSave'));
// var set_defaultHTML = conv($.cookie('defaultHTML')) == undefined ? $('#defaultHTML').val() : conv($.cookie('defaultHTML'));
// var set_defaultCSS = conv($.cookie('defaultCSS')) == undefined ? $('#defaultCSS').val() : conv($.cookie('defaultCSS'));
// var set_defaultJS = conv($.cookie('defaultJS')) == undefined ? $('#defaultJS').val() : conv($.cookie('defaultJS'));
// var set_quickCodes = conv($.cookie('quickCodes')) == undefined ? $('#quickCodes').val() : conv($.cookie('quickCodes'));

// function setCookies() {
// 	$.cookie('darkTheme', set_darkTheme);
// 	$.cookie('editorFontSize', set_editorFontSize);
// 	$.cookie('autoSave', set_autoSave);
// 	$.cookie('exitAutoSave', set_exitAutoSave);
// 	$.cookie('defaultHTML', set_defaultHTML);
// 	$.cookie('defaultCSS', set_defaultCSS);
// 	$.cookie('defaultJS', set_defaultJS);
// 	$.cookie('quickCodes', set_quickCodes);
// }
// setCookies();

// $('#darkTheme').prop('checked', set_darkTheme);
// // $('#editorFontSize').prop('checked', set_editorFontSize);
// $('#autoSave').prop('checked', set_autoSave);
// $('#exitAutoSave').prop('checked', set_exitAutoSave);
// // $('#defaultHTML').prop('checked', set_defaultHTML);
// // $('#defaultCSS').prop('checked', set_defaultCSS);
// // $('#defaultJS').prop('checked', set_defaultJS);
// // $('#quickCodes').prop('checked', set_quickCodes);

// function update() {
// 	set_darkTheme = $('#darkTheme').prop('checked');
// 	set_editorFontSize = $('#editorFontSize').val();
// 	set_autoSave = $('#autoSave').prop('checked');
// 	set_exitAutoSave = $('#exitAutoSave').prop('checked');
// 	// set_defaultHTML = $('#defaultHTML').prop('checked');
// 	// set_defaultCSS = $('#defaultCSS').prop('checked');
// 	// set_defaultJS = $('#defaultJS').prop('checked');
// 	// set_quickCodes = $('#quickCodes').prop('checked');
// 	setCookies();
// 	updateContent();
// }

// function updateContent() {
// 	set_darkTheme ? $('body').addClass('theme-dark') : $('body').removeClass('theme-dark');
// 	editorHTML.setOption('fontSize', set_editorFontSize);
// 	editorCSS.setOption('fontSize', set_editorFontSize);
// 	editorJS.setOption('fontSize', set_editorFontSize);
// }
// updateContent();

// $('.set').live('click keydown keyup change mousemove', () => {
// 	update();
// });

// function reset() {
// 	let cookies = $.cookie();
// 	for (let cookie in cookies) {
// 		$.removeCookie(cookie);
// 	}
// }