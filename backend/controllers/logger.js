const warn=(warning,timestamp=true,format="dd/mm/yy h:m:s")=>{
    if(timestamp){
        const date = new Date()
        let formats = ["dd","mm","yy","h","m","s"]
        let events = [null,date.getMonth(),date.getFullYear(),date.getHours(),date.getMinutes(),date.getSeconds()]
        format = format.replace("dd",date.getDate())
        format=formats.reduce((prev,curr,i,arr)=>{
            format = format.replace(curr,events[i])
            return format
        })
        warning = format.concat(" : ",warning)
    }
    console.log("\x1b[31m",warning,"\x1b[0m")
}

export default warn