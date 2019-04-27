class MKPraser{
    /*
    * input 输入的字符串
    */
    constructor(input){
        /*
         * data 输入的字符序列
         * tokens 输出的token流
        */
        this.data = input+'\r\n';
        this.tokens = [];
    }
    getTokens(){
        return this.tokens;
    }
    /*
     * lexicalAnalysis 词法分析过程
    */
   lexicalAnalysis(){
        let token = [];
        //提交正确识别的token
        const emitToken = (type , token)=>{
            this.tokens.push({
                type ,
                token
            })
        }
        /* Start */
        const Start = function(char){
            token.push(char);
            if(/[0-9]/.test(char)){
                return Olist1;
            }else{
                switch(char){
                    case '#' : 
                        return Head;
                    case '>' : 
                        return Quote;
                    case '+' : 
                        return Ulist;
                    case '_' : 
                        return Em;
                    case '*' : 
                        return EmUlistDivideline;
                    case '-' : 
                        return UlistDivideline;
                    case '`' : 
                        return Code1;
                    case '<' : 
                        return LinkLeft;
                    case '[' : 
                        return AltlinkLeft;
                    case '!' : 
                        return ImgBegin;
                    case '\t':
                        emitToken('\t',char);
                        token = [];
                        return Start;
                    case '\n' : 
                        emitToken('\n',char);
                        token = [];
                        return Start;
                    case '\r' : 
                        emitToken('\r',char);
                        token = [];
                        return Start; 
                    case '&' : 
                        emitToken('&amp;',char);
                        token = [];
                        return Start;                        
                    case '\\' :
                        return Esc;
                    default : 
                        return Text;
                }
           }
       }
       /* Text */
       const Text = function(char){
        token.push(char);
        if(/[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\t\&\\]/.test(char)){
            return Text;
        }else if(char == ']'){
            return AltlinkCenter;
        }
        else if(char == '>'){
            let value = token.join('');
            if(/^\<(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\>$/.test(value)){
                emitToken('<',token[0]);
                emitToken('URL',token.slice(1,token.length-1).join(''));
                emitToken('>',token[token.length-1]);
                token = [];
                return Start;
            }
        }else if(char == ')'){
            let value = token.join('');
            if(/^\!\[[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]+\]\((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\)$/.test(value)){
                emitToken('!','!');
                emitToken('[','[');
                emitToken('TEXT',token.slice(2,token.indexOf(']')).join(''));
                emitToken('](','](');
                emitToken('URL',token.slice(token.indexOf('(')+1,token.length-1).join(''));
                emitToken(')',')');
                token = [];
                return Start;
            }
            if(/^\[[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\t\&\\]+\]\((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\)$/.test(value)){
                emitToken('[','[');
                emitToken('TEXT',token.slice(1,token.indexOf(']')).join(''));
                emitToken('](','](');
                emitToken('URL',token.slice(token.indexOf('(')+1,token.length-1).join(''));
                emitToken(')',')');
                token = [];
                return Start;
            }
        }
        token.pop();
        emitToken('TEXT',token.join(''));
        token = [];
        return Start(char);
        
    }
        /* Head */
        //Head1-Head6简化为一个函数
        const Head = function(char){
            token.push(char);
            if(/^#{1,5}$/.test(token.slice(0,token.length-1).join(''))){
                switch(char){
                    case '#' :
                        return Head;
                    default : 
                        token.pop();
                        emitToken('H'+token.length,token.join(''));
                        token = [];
                        return Start(char);
                }
            }else{
                token.pop();
                emitToken('H'+token.length,token.join(''));
                token = [];
                return Start(char);
            }
        }
        /* Quote */
        const Quote = function(char){
            token.push(char);
            switch(char){
                case ' ' :
                    emitToken('>>',token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* Olist */
        const Olist2 = function(char){
            token.push(char);
            switch(char){
                case ' ' :
                    emitToken('OL',token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        const Olist1 = function(char){
            token.push(char);
            switch(char){
                case '.' :
                    return Olist2; 
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* Ulist */
        const Ulist = function(char){
            token.push(char);
            switch(char){
                case ' ' :
                    emitToken('UL',token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* Em */
        const Em = function(char){
            token.push(char);
            switch(char){
                case '_' :
                    return EmStrong;
                default : 
                    token.pop();
                    emitToken('EM',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* EmStrong */
        const EmStrong = function(char){
            token.push(char);
            switch(char){
                case '_' : 
                    emitToken('EMSTRONG' , token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('STRONG',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* EmUlistDivideline */
        const EmUlistDivideline = function(char){
            token.push(char);
            switch(char){
                case ' ' : 
                    return EmUlistDivideline;
                case '-' : 
                    return EmUlistDivideline;
                case '*' : 
                    return EmUlistDivideline;
                default : 
                    token.pop();
                    let value = token.join('');
                    if(/^\* $/.test(value)){
                        emitToken('UL',value);
                    }else if(/\*( \*){2,}/.test(value) || /\*{3,}/.test(value)){
                        emitToken('DIVIDELINE',value);
                    }else if(/^\* *$/.test(value)){
                        emitToken('EM',value);
                    }else if(/^\*\* *$/.test(value)){
                        emitToken('STRONG',value);
                    }else{
                        emitToken('TEXT',value);
                    }
                    token = [];
                    return Start(char);
            }
        }
        /* UlistDivideline */
        const UlistDivideline = function(char){
            token.push(char);
            switch(char){
                case ' ' : 
                    return UlistDivideline;
                case '-' : 
                    return UlistDivideline;
                default : 
                    token.pop();
                    let value = token.join('');
                    if(/^- $/.test(value)){
                        emitToken('UL',value);
                    }else if(/-( -){2,}/.test(value) || /-{3,}/.test(value)){
                        emitToken('DIVIDELINE',value);
                    }else{
                        emitToken('TEXT',value);
                    }
                    token = [];
                    return Start(char);
            }
        }
        /* Code */
        const Code2 = function(char){
            token.push(char);
            switch(char){
                case '`' :
                    emitToken('```',token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        const Code1 = function(char){
            token.push(char);
            switch(char){
                case '`' :
                    return Code2; 
                default : 
                    token.pop();
                    emitToken('`',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* LinkLeft */
        const LinkLeft = function(char){
            token.push(char);
            if(/[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]/.test(char)){
                return Text;
            }else{
                token.pop();
                emitToken('TEXT',token.join(''));
                token = [];
                return Start(char);
            }
        }
        /* AltlinkLeft */
        const AltlinkLeft = function(char){
            token.push(char);
            if(/[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]/.test(char)){
                return Text;
            }else{
                token.pop();
                emitToken('TEXT',token.join(''));
                token = [];
                return Start(char);
            }
        }
         /* ImgBegin */
         const ImgBegin = function(char){
            token.push(char);
            switch(char){
                case '[' :
                    return AltlinkLeft; 
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* AltlinkCenter */
        const AltlinkCenter = function(char){
            token.push(char);
            switch(char){
                case '(' :
                    return Text; 
                default : 
                    token.pop();
                    emitToken('TEXT',token.join(''));
                    token = [];
                    return Start(char);
            }
        }
        /* Esc */
        const Esc = function(char){
            token.push(char);
            if(/[\\`\*_\[\]\(\)#\+-\.!\<\>]/.test(char)){
                emitToken('ESC',token.join(''));
                token = [];
                return Start;
            }else{
                token.pop();
                emitToken('TEXT',token.join(''));
                token = [];
                return Start(char);
            }
        }
        //主控程序
       let state = Start;
       let input = this.data.split('');
       for(let char of input){
            state = state(char);
            console.log('proceeding...')
       }
   }
   /* 
    * Token流序列优化处理
    */
   optimizeToken(){
        let tokens = [];
        let cache = [];
        let storeCache = function(word){
            cache.push(word);
        }
        let emitToken = function(type , token){
            tokens.push({
                type : type,
                token : token
            })
        }
        // let replaceTokens = function(type,value){
        //     let val = '';
        //     cache.forEach((word)=>{
        //         val+=word.token
        //     })
        //     tokens.splice(cache.shift().index, cache.length , {
        //         type : type,
        //         token : val
        //     })
        // }
        //开始扫描token流序列
        let start = function(word){
            storeCache(word);
            switch(word.type){
                case 'TEXT' :
                    return mergeText;
                case '\r' :
                    return newLine;
                case '```' : 
                    tokens.push(word);
                    cache = [];
                    return code;
                default : 
                    cache = [];
                    tokens.push(word);
                    return start;
            }
        }
        //rule1 [mergeText] : 多个TEXT文本类型可以合并为一个TEXT合并
        let mergeText = function(word){
            storeCache(word);
            switch(word.type){
                case 'TEXT' : 
                    return mergeText;
                default : 
                    cache.pop();
                    //合并
                    let val = '';
                    for(let word of cache){
                        val += word.token;
                    }
                    emitToken('TEXT',val);
                    cache = [];
                    return start(word);
            }
        }
        // rule2 [newLine] :  \r\n可以合并为一个分隔不同行的标识 “ NEWLINE”
        let newLine = function(word ,index){
            storeCache(word);
            switch(word.type){
                case '\n' : 
                    let val = '';
                    cache.forEach((word)=>{
                        val+=word.token
                    })
                    emitToken('NEWLINE',val);
                    cache = [];
                    return start; 
                default :
                    tokens.push(cache.shift());
                    cache = [];
                    return start(word);
            }
        }
        // rule3 [code] : 遇到```标识时，将第一个TEXT标识为编程语言“LAG”,将前后“NEWLINE”之间的TEXT标识为“CODE”，之后单独封装函数对参数”LAG””CODE”做语法解析
        let code = function(word){
            // storeCache(word);
            // switch(word.type){
            //     case 'TEXT' :

            // }
        }
        let reduce = 0;
        let opt = start;
        for(let i=0,word;word=this.tokens[i];i++){
            opt = opt(word);
        }
        console.log(tokens);
   }
}
module.exports = {
    MKPraser
}