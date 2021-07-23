export function _getContrastYIQ(hexcolor) {
    if (hexcolor.includes('#')) {
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    } else if (hexcolor.includes('rgb')) {
        if (hexcolor.split(',').length > 3) {
            if (parseFloat(hexcolor.split(',')[3].replace(/[rgba() ]/g, '')) > .3) {
                return 'white';
            } else {
                return 'black';
            }
        }
        let rgb = [];
        rgb.push(hexcolor.split(',')[0].replace(/[^\d]/g, ''))
        rgb.push(hexcolor.split(',')[1].replace(/[^\d]/g, ''))
        rgb.push(hexcolor.split(',')[2].replace(/[^\d]/g, ''))
        const brightness = Math.round(((parseInt(rgb[0]) * 299) +
            (parseInt(rgb[1]) * 587) +
            (parseInt(rgb[2]) * 114)) / 1000);
        const textColour = (brightness > 125) ? 'black' : 'white';
        return textColour;
    } else {
        return '#fff'
    }
}