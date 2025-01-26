// Adapted from https://github.com/combatwombat/Lunicode.js/blob/master/lunicode.js
// Source has the MIT license.

export class CreepifyText {
    public static sharedInstance = new CreepifyText();

    private diacriticsTop: string[] = [];
    private diacriticsMiddle: string[] = [];
    private diacriticsBottom: string[] = [];

    private options = {
        top: true,
        middle: false,
        bottom: true,
        maxHeight: 1, // How many diacritic marks shall we put on top/bottom?
        randomization: 100, // 0-100%. maxHeight 100 and randomization 20%: the height goes from 80 to 100. randomization 70%, height goes from 30 to 100.
    };

    constructor() {
        // Sort diacritics in top, bottom or middle

        for (var i = 768; i <= 789; i++) {
            this.diacriticsTop.push(String.fromCharCode(i));
        }

        for (var i = 790; i <= 819; i++) {
            if (i != 794 && i != 795) {
                this.diacriticsBottom.push(String.fromCharCode(i));
            }
        }
        this.diacriticsTop.push(String.fromCharCode(794));
        this.diacriticsTop.push(String.fromCharCode(795));

        for (var i = 820; i <= 824; i++) {
            this.diacriticsMiddle.push(String.fromCharCode(i));
        }

        for (var i = 825; i <= 828; i++) {
            this.diacriticsBottom.push(String.fromCharCode(i));
        }

        for (var i = 829; i <= 836; i++) {
            this.diacriticsTop.push(String.fromCharCode(i));
        }
        this.diacriticsTop.push(String.fromCharCode(836));
        this.diacriticsBottom.push(String.fromCharCode(837));
        this.diacriticsTop.push(String.fromCharCode(838));
        this.diacriticsBottom.push(String.fromCharCode(839));
        this.diacriticsBottom.push(String.fromCharCode(840));
        this.diacriticsBottom.push(String.fromCharCode(841));
        this.diacriticsTop.push(String.fromCharCode(842));
        this.diacriticsTop.push(String.fromCharCode(843));
        this.diacriticsTop.push(String.fromCharCode(844));
        this.diacriticsBottom.push(String.fromCharCode(845));
        this.diacriticsBottom.push(String.fromCharCode(846));
        // 847 (U+034F) is invisible http://en.wikipedia.org/wiki/Combining_grapheme_joiner
        this.diacriticsTop.push(String.fromCharCode(848));
        this.diacriticsTop.push(String.fromCharCode(849));
        this.diacriticsTop.push(String.fromCharCode(850));
        this.diacriticsBottom.push(String.fromCharCode(851));
        this.diacriticsBottom.push(String.fromCharCode(852));
        this.diacriticsBottom.push(String.fromCharCode(853));
        this.diacriticsBottom.push(String.fromCharCode(854));
        this.diacriticsTop.push(String.fromCharCode(855));
        this.diacriticsTop.push(String.fromCharCode(856));
        this.diacriticsBottom.push(String.fromCharCode(857));
        this.diacriticsBottom.push(String.fromCharCode(858));
        this.diacriticsTop.push(String.fromCharCode(859));
        this.diacriticsBottom.push(String.fromCharCode(860));
        this.diacriticsTop.push(String.fromCharCode(861));
        this.diacriticsTop.push(String.fromCharCode(861));
        this.diacriticsBottom.push(String.fromCharCode(863));
        this.diacriticsTop.push(String.fromCharCode(864));
        this.diacriticsTop.push(String.fromCharCode(865));
    }

    public encode(text: string) {
        var newText = "",
            newChar;
        for (const i in text.split("")) {
            newChar = text[i];

            // Middle
            // Put just one of the middle characters there, or it gets crowded
            if (this.options.middle) {
                newChar +=
                    this.diacriticsMiddle[
                        Math.floor(Math.random() * this.diacriticsMiddle.length)
                    ];
            }

            // Top
            if (this.options.top) {
                // Put up to this.options.maxHeight random diacritics on top.
                // optionally fluctuate the number via the randomization value (0-100%)
                // randomization 100%: 0 to maxHeight
                //                30%: 70% of maxHeight to maxHeight
                //                 x%: 100-x% of maxHeight to maxHeight
                var diacriticsTopLength = this.diacriticsTop.length - 1;
                for (
                    var count = 0,
                        len =
                            this.options.maxHeight -
                            Math.random() *
                                ((this.options.randomization / 100) *
                                    this.options.maxHeight);
                    count < len;
                    count++
                ) {
                    newChar +=
                        this.diacriticsTop[
                            Math.floor(Math.random() * diacriticsTopLength)
                        ];
                }
            }

            // Bottom
            if (this.options.bottom) {
                var diacriticsBottomLength = this.diacriticsBottom.length - 1;
                for (
                    var count = 0,
                        len =
                            this.options.maxHeight -
                            Math.random() *
                                ((this.options.randomization / 100) *
                                    this.options.maxHeight);
                    count < len;
                    count++
                ) {
                    newChar +=
                        this.diacriticsBottom[
                            Math.floor(Math.random() * diacriticsBottomLength)
                        ];
                }
            }

            newText += newChar;
        }
        return newText;
    }

    public decode(text: string) {
        var newText = "",
            charCode;

        for (const i in text.split("")) {
            charCode = text[i].charCodeAt(0);
            if (charCode < 768 || charCode > 865) {
                newText += text[i];
            }
        }
        return newText;
    }
}
