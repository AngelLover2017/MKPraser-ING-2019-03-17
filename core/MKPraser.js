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
                    case '\n' : 
                        emitToken('NEWLINE',char);
                        token = [];
                        return Start;
                    case '\r' : 
                        emitToken('ENTER',char);
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
        if(/[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]/.test(char)){
            return Text;
        }else if(char == ']'){
            return AltlinkCenter;
        }
        else if(char == '>'){
            let value = token.join('');
            if(/^\<(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\>$/.test(value)){
                emitToken('LINKLEFT',token[0]);
                emitToken('URL',token.slice(1,token.length-1).join(''));
                emitToken('LINKRIGHT',token[token.length-1]);
                token = [];
                return Start;
            }
        }else if(char == ')'){
            let value = token.join('');
            if(/^\!\[[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]+\]\((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\)$/.test(value)){
                emitToken('IMGBEGIN','!');
                emitToken('ALTLINKLEFT','[');
                emitToken('TEXT',token.slice(2,token.indexOf(']')).join(''));
                emitToken('ALTLINKCENTER','](');
                emitToken('URL',token.slice(token.indexOf('('),token.length-1));
                emitToken('ALTLINKRIGHT',')');
                token = [];
                return Start;
            }
            if(/^\[[^\#\>0-9\+\_\*\-\`\<\[\]\(\)\!\n\r\&\\]+\]\((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\)$/.test(value)){
                emitToken('ALTLINKLEFT','[');
                emitToken('TEXT',token.slice(1,token.indexOf(']')).join(''));
                emitToken('ALTLINKCENTER','](');
                emitToken('URL',token.slice(token.indexOf('('),token.length-1));
                emitToken('ALTLINKRIGHT',')');
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
                    emitToken('QUOTE',token.join(''));
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
                    emitToken('OLIST',token.join(''));
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
                    emitToken('ULIST',token.join(''));
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
                    emitToken('STRONG',token.join(''));
                    token = [];
                    return Start;
                default : 
                    token.pop();
                    emitToken('EM',token.join(''));
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
                default : 
                    token.pop();
                    let value = token.join('');
                    if(/^\* $/.test(value)){
                        emitToken('ULIST',value);
                    }else if(/\*( \*){2,}/.test(char) || /\*{3,}/.test(char)){
                        emitToken('DIVIDELINE',value);
                    }else if(/^\* *$/.test(char)){
                        emitToken('EM',value);
                    }else if(/^\*\* *$/.test(char)){
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
                        emitToken('ULIST',value);
                    }else if(/-( -){2,}/.test(char) || /-{3,}/.test(char)){
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
                    emitToken('BLOCKCODE',token.join(''));
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
                    emitToken('INLINECODE',token.join(''));
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
}
module.exports = {
    MKPraser
}