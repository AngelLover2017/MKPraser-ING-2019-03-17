const fs = require('fs');
class FileOpt{
    constructor(address){
        this.address = address;
        this.data = '';
    }
    readAll(){
        try{
            let data = fs.readFileSync(this.address, 'utf8');
            this.data = data;
        }catch(error){
            console.log('read file failed');
        }
        
    }
    getData(){
        return this.data;
    }
}
module.exports = {
    FileOpt
}