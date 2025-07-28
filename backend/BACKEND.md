# Routes
 ## Folder structure
 - backend/
    - controllers/
        - logger.js
    - Docs/
    - models/
    - routes/
    - BACKEND.md
    - index.js
    - package-lock.json
    - package.json

## Installation
> `npm install` to install dependencies  
> `npm run dev` for development server

## Docs
> Add ***`issue.md`*** after each contribution to your issue

<pre>
// Use this function to create comments
const logTable = (data,pad=2)=>{
    const splits = data.split('\n')
    const maxLen = Math.max(...splits.map(line =>{
        return line.length
    }))
    let tabularData = "";
    tabularData += "+"+"=".repeat(maxLen+(pad*2))+"+\n"
    for(let line of splits){
        tabularData += `|${" ".repeat(pad)+line.trim().replaceAll('-',' ').padEnd(maxLen+pad," ")}|\n`
    }
    tabularData += "+"+"=".repeat(maxLen+(pad*2))+"+"
    console.log(tabularData)
    return tabularData
}
</pre>