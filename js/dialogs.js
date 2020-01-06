function vue() {
	$('[data-value-target]').each(function () {
		let $this = $(this);
		let target = $(this).data('value-target');
		$(target).on('click mousemove change paste', function () {
			$this.text($(this).val())
		});
	});
}
vue();

var dial_fontSize_content = '\
<!--<div class="list no-hairlines no-hairlines-between no-margin">-->\
  <!--<ul>-->\
    <!--<li>-->\
		<!-- range slider, enable labels -->\
		<!--<div class="item-inner">-->\
        	<div class="range-slider range-slider-inits color-orange margin-top" id="editorFontSizee" data-label="true">\
          		<input type="range" min="0" max="52" step="2" id="editorFontSize" class="set">\
			</div>\
		<!--</div>-->\
    <!--</li>-->\
  <!--</ul>-->\
<!--</div>-->\
';

var dial_fontSize = app.dialog.create({
	title: 'Tamanho da fonte',
	content: dial_fontSize_content,
	buttons: [
		{ text: 'Cancelar' },
		{
			text: 'OK',
			onClick: function(){update()}
		}
	],
	on: {
		open: function () {
			$('#editorFontSize').val(set_editorFontSize)
			app.range.create({ el: '#editorFontSizee' });
		}
	}
});