/**** Configuration ****/

class Clock {
    constructor(canvas=null, time=0) {
        if (canvas !== null) {
            this.cnv = canvas;
            this.ctx = canvas[0].getContext('2d');
        }
        else {
            // disable drawing since we have no canvas
            this.draw_clock = () => { throw new Error('Initialized without canvas'); };
        }
        // call the function because it handles numbers and strings
        this.setTime(time);

        this.init();
    }

    init() {
        /*** Sets many defaults, mostly for drawing ***/

        // Tiles
        this.width = 6;
        this.height = 4;

        /* pwidth/pheight = pixel width/height
         * buff = pixels of buffer on each side of a tile
         */
        this.pwidth = 150;
        this.pheight = 40;
        this.buff = 5;

        // Testing colors
        //const on_color = '#FF0000';
        //const off_color = '#0000FF';
        //const bg_color = '#000000';
        this.on_color = '#0A0862';
        this.off_color = '#03001D';
        this.bg_color = '#040023';
        this.text_color = '#39BEE5';
        this.font = '100px Courier';
    }

    int_to_binary_string(value) {
        let binary = value.toString(2); // holy shit JS, why does this exist?
        return binary.padStart(24, '0');
    }

    parseTime(str_time) {
        let validator = /(\d:)?(\d{2}:)?(\d{2})(\.\d)?/;

        let match = validator.exec(str_time);

        if ( match === null ) {
            $("#error").text("Enter values in the format H:MM:SS.S . You may omit hours or deciseconds.");
            return;
        }

        /* if there was a match, our units are broken into capture groups
         * Sample: 1:23:45.6
         * match[1] == "1:" (hours)
         * match[2] == "23:" (minutes)
         * match[3] == "45" (second)
         * match[4] == ".6" (deciseconds)
         * if any groups are missing, their index will be undefined
        */

        let deciseconds = 0;
        if (match[4] !== undefined) {
            deciseconds += parseInt(match[4].replace(".", ""));
        }
        if (match[3] !== undefined) {
            // seconds
            let raw = parseInt(match[3]);
            if (raw > 59) {
                throw new Error("Seconds must be < 60");
            }
            raw *= 10;
            deciseconds += raw;
        }
        if (match[2] !== undefined) {
            // minutes
            let raw = parseInt(match[2].replace(":", ""))
            if (raw > 59) {
                throw new Error("Minutes must be < 60");
            }
            raw *= 60 * 10;
            deciseconds += raw;
        }
        if (match[1] !== undefined) {
            // hours
            // hours and deciseconds are only one digit so they can't be out of range
            deciseconds += parseInt(match[1].replace(":", "")) * 60 * 60 * 10;
        }
        return deciseconds;

    }

    timeToStr(time) {
        // time arrives in deciseconds

        // we lob chunks of larger units off it until we have our display time
        let hours = Math.floor(time/(60 * 60 * 10)); // Math.floor simulates integer division
        time -= hours * 60 * 60 * 10;

        let minutes = Math.floor(time/(60 * 10));
        time -= minutes * 60 * 10;

        let seconds = Math.floor(time/10);
        time -= seconds * 10;

        let deciseconds = time;

        // then combine into a string
        return hours + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "." + deciseconds
    }

    setTime(time) {
        /*** time = integer time in deciseconds or string time ***/
        if (typeof(time) == "number") {
            this.time = time;
        }
        else if(typeof(time) == "string") {
            this.time = this.parseTime(time);
        }
        else {
            throw new Error("Unrecognized time format");
        }
    }

    draw_clock() {
        // clear away the old cruft
        this.ctx.clearRect(0, 0, this.cnv.width(), this.cnv.height());

        // fill with background color
        this.ctx.fillStyle = this.bg_color;
        this.ctx.fillRect(0, 0, this.cnv.width(), this.cnv.height());

        // draw each tile
        let bin_time = this.int_to_binary_string(this.time);
        let bit_position = 0;
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                // a tile at position (col, row)
                // (0, 0) = most significant bit
                //          value of binary time string at position [0]
                // (5, 3) = least sig bit
                //          value of binary time string at position [length-1]
                // ctx.FillRect(left, top, right, bottom)
                let left = this.buff + col * (this.pwidth + this.buff)
                let top = this.buff + row * (this.pheight + this.buff)
                if (bin_time[bit_position] == "0") {
                    this.ctx.fillStyle = this.off_color;
                }
                else {
                    this.ctx.fillStyle = this.on_color;
                }
                this.ctx.fillRect(left, top, this.pwidth, this.pheight);
                bit_position += 1;
            }
        }

        // draw text representation over it
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.text_color;
        // fillText(text, left, bottom)
        // dunno why it's the bottom, but meh
        this.ctx.fillText(this.timeToStr(this.time), Math.floor(this.pwidth * 1.25 + this.buff * 4), (this.pheight + this.buff)*(this.height - 1));

        // TODO: toggleable in interface?
    }
}
