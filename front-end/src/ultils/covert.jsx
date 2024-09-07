export function numFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'N' : Math.sign(num)*Math.abs(num)
}