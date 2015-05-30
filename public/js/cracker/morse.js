var morse = 
{
	MCarr: new Array("*", "|", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----."),
	ABC012arr: "*|ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",

	Decrypt: function (x) {
		mess = ""
		apos = 0
		bpos = 0
		while(bpos < x.length) {
			bpos = x.indexOf(" ", apos)
			if(bpos < 0)
				bpos = x.length
			dits = x.substring(apos, bpos)
			apos = bpos + 1
			let = ""
			for(j = 0; j < this.MCarr.length; j++)
				if(dits == this.MCarr[j])
					let = this.ABC012arr.charAt(j)
			if(let == "")
				let = "*"
			mess += let
		}
		return mess
	},

	Encrypt: function (x) {
		mess = ""
		for(i = 0; i < x.length; i++) {
			let = x.charAt(i).toUpperCase()
			for(j = 0; j < this.MCarr.length; j++)
				if(let == this.ABC012arr.charAt(j))
					mess += this.MCarr[j]
			mess += " "
		}
		mess = mess.substring(0, mess.length - 1)
		return mess
	}
}