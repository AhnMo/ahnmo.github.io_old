var ascii85 = {
	encode: function (bytes) {
		this.assertOrBadInput(!(/[^\x00-\xFF]/.test(bytes)), 'Input contains out-of-range characters.'); // disallow two-byte chars
		var padding = '\x00\x00\x00\x00'.slice((bytes.length % 4) || 4);
		bytes += padding; // pad with null bytes
		var out_array = [];
		for (var i=0, n=bytes.length; i < n; i+=4) {
			var newchars = (
				(bytes.charCodeAt(i)	 << 030) +
				(bytes.charCodeAt(i+1) << 020) +
				(bytes.charCodeAt(i+2) << 010) +
				(bytes.charCodeAt(i+3)));
			if (newchars === 0) {
				out_array.push(0x7a); // special case: 4 null bytes -> 'z'
				continue;
			};
			var char1, char2, char3, char4, char5;
			char5 = newchars % 85; newchars = (newchars - char5) / 85;
			char4 = newchars % 85; newchars = (newchars - char4) / 85;
			char3 = newchars % 85; newchars = (newchars - char3) / 85;
			char2 = newchars % 85; newchars = (newchars - char2) / 85;
			char1 = newchars % 85;
			out_array.push(char1 + 0x21, char2 + 0x21, char3 + 0x21,
										 char4 + 0x21, char5 + 0x21);
		};
		this.shorten(out_array, padding.length);
		return '<~' + String.fromCharCode.apply(String, out_array) + '~>'
	},
	decode: function (a85text) {
		this.assertOrBadInput ((a85text.slice(0,2) === '<~') && (a85text.slice(-2) === '~>'), 'Invalid initial/final ascii85 characters');
		a85text = a85text.slice(2,-2).replace(/\s/g, '').replace('z', '!!!!!');
		this.assertOrBadInput(!(/[^\x21-\x75]/.test(a85text)), 'Input contains out-of-range characters.');
		var padding = '\x75\x75\x75\x75\x75'.slice((a85text.length % 5) || 5);
		a85text += padding; // pad with 'u'
		var newchars, out_array = [];
		var pow1 = 85, pow2 = 85*85, pow3 = 85*85*85, pow4 = 85*85*85*85;
		for (var i=0, n=a85text.length; i < n; i+=5) {
			newchars = (
				((a85text.charCodeAt(i)	 - 0x21) * pow4) +
				((a85text.charCodeAt(i+1) - 0x21) * pow3) +
				((a85text.charCodeAt(i+2) - 0x21) * pow2) +
				((a85text.charCodeAt(i+3) - 0x21) * pow1) +
				((a85text.charCodeAt(i+4) - 0x21)));
			out_array.push(
				(newchars >> 030) & 0xFF,
				(newchars >> 020) & 0xFF,
				(newchars >> 010) & 0xFF,
				(newchars)				& 0xFF);
		};
		this.shorten(out_array, padding.length);
		return String.fromCharCode.apply(String, out_array);
	},
	assertOrBadInput: function (expression, message) {
		if (!expression) { throw new this.Ascii85CodecError(message) };
	},
	Ascii85CodecError: function (message) { this.message = message; },
	shorten: function (array, number) {
		for (var i = number; i > 0; i--) { array.pop(); };
	}
};