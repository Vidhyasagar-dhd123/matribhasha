const warn = (warning, timestamp = true, format = "dd/mm/yy h:m:s") => {
    if (timestamp) {
        const date = new Date();
        const formats = ["dd", "mm", "yy", "h", "m", "s"];
        const events = [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear().toString().slice(-2),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ];

        formats.forEach((token, i) => {
            format = format.replace(token, events[i].toString().padStart(2, '0'));
        });

        warning = `${format} : ${warning}`;
    }
    console.log("\x1b[31m%s\x1b[0m", warning);
};



const logTable = (data,pad=2)=>{
    const splits = data.split('\n')
    const maxLen = Math.max(...splits.map(line =>{
        return line.length
    }))
    let tabularData = "";
    tabularData += "+"+"=".repeat(maxLen+(pad*2))+"+\n"
    for(let line of splits){
        tabularData += `|${line.trim().padStart(pad+maxLen," ").padEnd(maxLen+(pad*2)," ")}|\n`
    }
    tabularData += "+"+"=".repeat(maxLen+(pad*2))+"+"
    console.log(tabularData)
    return tabularData
}

export {warn,logTable}
