const readline = require('readline');
const fileopt = require('./core/FileOPt.js');
const mkpraser = require('./core/MKPraser.js');
const FileOPt = fileopt.FileOpt;
const MKPraser = mkpraser.MKPraser;

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : 'input your md file address here\n>'

})
rl.prompt();
rl.on('line',(input)=>{
    let mk = new FileOPt(input);
    mk.readAll();
    let data = mk.getData();
    if(data != ''){
        rl.close();
    }
    let mkp = new MKPraser(data);
    mkp.lexicalAnalysis();
    // console.log(mkp.getTokens());
    mkp.optimizeToken().then(function(){
        console.log(mkp.getTokens());
    }).then(function(){
        mkp.syntaxAnalysis();
        console.log(JSON.stringify(mkp.getTnode()));
    });
    
})

