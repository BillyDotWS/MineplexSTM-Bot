const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
module.exports = async (igt, fp, hfp, weeklyR, weeklyQ, sotw, observation, total, igtscore, fpscore, hfpscore, srscore, date) => {
    const width = 1366
    const height = 706

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    loadImage('./background.png').then(image => {
        context.drawImage(image, 0, 0, width, height)

        // Rounded Rectangle || Title
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 533, 15, 300, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(date, 683, 52)

        // LEFT COLUMN START

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 105, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Goal`, 283, 142)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 190, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`IGT: 5+ hours`, 283, 227)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 250, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Total Forum Posts: 3+`, 283, 287)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 310, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Total Forum Help Posts: 1+`, 283, 347)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 370, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`SRs 10+ | Total/Insufficient`, 283, 407)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 430, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Questions of the Day`, 283, 467)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 490, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Situation of the Week`, 283, 527)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 68, 550, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Observation`, 283, 587)


        // RIGHT COLUMN START

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#f8f8ff"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 105, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#696969' //gray: #696969 //white: #f8f8ff
        context.fillText(`Achieved`, 1085, 142)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let igtcolor; if (igt >= 5) { igtcolor = '#5eba7d' } else { igtcolor = '#ff6961' }
        context.fillStyle = igtcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 190, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`IGT: ${igt} hours (${Math.round(igtscore)}%)`, 1085, 227)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let fpcolor; if (fp >= 3) { fpcolor = '#5eba7d' } else { fpcolor = '#ff6961' }
        context.fillStyle = fpcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 250, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`Forum Posts: ${fp} (${Math.round(fpscore)}%)`, 1085, 287)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let hfpcolor; if (hfp >= 1) { hfpcolor = '#5eba7d' } else { hfpcolor = '#ff6961' }
        context.fillStyle = hfpcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 310, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`Forum Help Posts: ${hfp} (${Math.round(hfpscore)}%)`, 1085, 347)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let srcolor; if (weeklyR[1] >= 10) { srcolor = '#5eba7d' } else { srcolor = '#ff6961' }
        context.fillStyle = srcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 370, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`SRs: ${weeklyR[1]} (${Math.round(srscore)}%)`, 1085, 407)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let qotdcolor; if (weeklyQ[1] >= 7) { qotdcolor = '#5eba7d' } else { qotdcolor = '#ff6961' }
        context.fillStyle = qotdcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 430, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`QOTD: ${weeklyQ[1]}/7`, 1085, 467)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let sotwcolor; if (sotw >= 10) { sotwcolor = '#5eba7d' } else { sotwcolor = '#ff6961' }
        context.fillStyle = sotwcolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 490, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`SOTW: ${sotw}/10`, 1085, 527)

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        let ocolor; if (observation >= 10) { ocolor = '#5eba7d' } else { ocolor = '#ff6961' }
        context.fillStyle = ocolor; //white: #f8f8ff //red: #ff6961 //green: #5eba7d
        roundRect(context, 870, 550, 430, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`Observation: ${observation}/10`, 1085, 587)

        /*
        // WEEK STUFF

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#728bd4"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d // blue: #728bd4
        roundRect(context, 611, 105, 140, 50, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`Week X`, 683, 142)
        */
        // TOTAL STUFF

        // Rounded Rectangle
        context.strokeStyle = "#808080";
        context.fillStyle = "#728bd4"; //white: #f8f8ff //red: #ff6961 //green: #5eba7d // blue: #728bd4
        roundRect(context, 531, 610, 300, 80, 10, true);

        // Add Text
        context.font = '23pt Sans'
        context.textAlign = 'center'
        context.fillStyle = '#f8f8ff' //gray: #696969 //white: #f8f8ff
        context.fillText(`Total: ${total}%`, 683, 662)

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync('./report.png', buffer)
    })

    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }
    return
}