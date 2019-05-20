class MKPraser{
    /*
    * input 输入的字符串
    */
    constructor(input){
        /*
         * data 输入的字符序列
         * tokens 输出的token流
         * tnode 抽象语法树 
        */
        this.data = input+'\r\n';
        this.tokens = [];
        this.tnode = {
            tree : null
        };
    }
    getTokens(){
        return this.tokens;
    }
    getTnode(){
        return this.tnode;
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
    * Token流序列优化处理-1
    */
   optimizeToken1(){
        let tokens = [];
        let cache = [];
        const storeCache = function(word){
            cache.push(word);
        }
        const emitToken = function(type , token){
            tokens.push({
                type : type,
                token : token
            })
        }
        //开始扫描token流序列
        const start = function(word){
            storeCache(word);
            switch(word.type){
                case 'TEXT' :
                    return mergeText;
                case '\r' :
                    return newLine;
                case 'DIVIDELINE' : 
                    return divideline;
                case 'NEWLINE' :  
                    return split;
                default : 
                    cache = [];
                    tokens.push(word);
                    return start;
            }
        }
        //rule1 [mergeText] : 多个TEXT文本类型可以合并为一个TEXT合并
        const mergeText = function(word){
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
        const newLine = function(word ,index){
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
        //rule3 [divideline] : 相邻DIVIDELINE合并为一个DIVIDELINE
        const divideline = function(word){
            storeCache(word);
            switch(word.type){
                case 'DIVIDELINE' : 
                    return divideline;
                default : 
                    cache.pop();
                    //合并
                    let val = '';
                    for(let word of cache){
                        val += word.token;
                    }
                    emitToken('DIVIDELINE',val);
                    cache = [];
                    return start(word);
            }
        }
        let reduce = 0;
        let opt = start;
        for(let i=0,word;word=this.tokens[i];i++){
            opt = opt(word);
        }
        //结尾的换行符作为文件结束符
        tokens[tokens.length-1]= {
            type : 'END',
            token : '\r\n'
        };
        this.tokens = tokens;
   }    
   /* 
   * Token流序列优化处理-2
   * 优化标题，标记出标题的换行
   */
  optimizeToken2(){    
       let tokens = this.tokens;
       tokens.forEach((ele,index)=>{
            if(['H1','H2','H3','H4','H5','H6'].some(v=>{
                return v == ele.type
            })){
                let i = index+1;
                while(tokens[i].type != 'NEWLINE')i++;
                tokens[i] = {
                    type : 'SPLIT',
                    token : '\r\n\r\n'
                }
            }
       })
       this.tokens = tokens;
  }

    /* 
    * Token流序列优化处理-3
    * 优化段落的分隔符，去掉不必要的换行
    */
   optimizeToken3(){    
        let tokens = [];
        let cache = [];
        const storeCache = function(word){
            cache.push(word);
        }
        const emitToken = function(type , token){
            tokens.push({
                type : type,
                token : token
            })
        }
        //开始扫描token流序列
        const start = function(word){
            storeCache(word);
            switch(word.type){
                case 'NEWLINE' :  
                    return split;
                default : 
                    cache = [];
                    tokens.push(word);
                    return start;
            }
        }
        //rule4 [split] : 段落分隔符，连着2个以上的NEWLINE合并为SPLIT,用来分隔段落；单独一个NEWLINE删除
        const split = function(word){
            storeCache(word);
            switch(word.type){
                case 'NEWLINE' : 
                    return split;
                default : 
                    cache.pop();
                    if(cache.length >= 2){
                        //两个或两个NEWLINE以上，则加入，否则忽略
                         emitToken('SPLIT','\r\n\r\n');
                    }
                    cache = [];
                    return start(word);
            }
        }
        let reduce = 0;
        let opt = start;
        for(let i=0,word;word=this.tokens[i];i++){
            opt = opt(word);
        }
        this.tokens = tokens;
   }
   /**
    * Token流序列优化处理-
    */
   optimizeToken(){
       //异步变同步
       let that = this;
       return new Promise(function(resolve,reject){
           that.optimizeToken1();
           resolve();
       }).then(function(){
           that.optimizeToken2();
       }).then(function(){
           that.optimizeToken3();
       });
   }
   /* 
    * syntaxAnalysis 语法分析过程
    * 递归下降分析
   */
   syntaxAnalysis(){
       let tokens = this.tokens;
       let index = 0;
       const match = (tokenExpected)=>{
           //匹配到预期token，指针向前移动一位
           let val = tokens[index];
           if( val.type == tokenExpected){
               index += 1;
               return val.token;
           }else{
               console.log('[error:tokenUnExpected '+tokenExpected+']:what expected is '+tokens[index].type);
               return 0;
           }
       }
       /* article 文章 */
       const article = ()=>{
           let article = {
               nodeType : 'article',
               child : []
           };
           let i = 0;
           //未到文件结尾
           while(tokens[index].type != 'END'){
                article.child[i] = section();
                i++;
           }
           match('END');
           return article;
       }
       /* section 章节 */
       const section = ()=>{
           let section = {
               nodeType : 'section',
               child : []
           };
           //如果当前token是标题
           if(['H1','H2','H3','H4','H5','H6'].some(val=>{
               return val == tokens[index].type;
           })){
               section.child[0] = head();
           }
           //只要不是标题或文件结尾，都可以一直匹配
            while(['H1','H2','H3','H4','H5','H6','END'].every(val=>{
                return val!=tokens[index].type;
            })){
                section.child[1] = paragraph();
            }
            return section;
       }
       /* head 标题 */
       const head = ()=>{
           let head = {
               nodeType : 'head',
               level : null,
               child : null
           }
           head.level = match(tokens[index].type);
           head.child = sentence();
           //识别SPLIT
           if(tokens[index].type == 'SPLIT'){
               match('SPLIT');
           }
           return head;
       }
       /* paragraph 段落 */
       const paragraph = ()=>{
            let paragraph = {
                nodeType : 'paragraph',
                child : []
            };
            let i = 0; //标记位置
            let paragraph_First = [
                'EM','STRONG','EMSTRONG','`',
                'TEXT','```','!','[','<','>>',
                'OL','UL','DIVIDELINE'
            ];
            //在paragraph的first集合中
            while(paragraph_First.some(val=>{
                return val == tokens[index].type
            })){
                let res = null;
                switch(tokens[index].type){
                    case 'EM' : 
                        res = sentence(); 
                        break;
                    case 'STRONG' : 
                        res = sentence();
                        break;
                    case 'EMSTRONG' : 
                        res = sentence();
                        break;
                    case '`' : 
                        res = sentence();
                        break;
                    case 'TEXT' :
                        res = sentence();
                        break;
                    case '```' : 
                        res = blockcode();
                        break;
                    case '!' : 
                        res = img();
                        break;
                    case '[' : 
                        res = altlink();
                        break;
                    case '<' :
                        res = simlink();
                        break;
                    case '>>' :
                        res = quote();
                        break;
                    case 'OL' : 
                        res = olist();
                        break;
                    case 'UL' :
                        res = ulist();
                        break;
                    case 'DIVIDELINE' :
                        res = {};
                        res.nodeType = 'DIVIDELINE';
                        res.text = match('DIVIDELINE');
                        break;
                }
                paragraph.child[i] = res;
                i++;
            }
            //一个paragraph识别一个SPLIT
            if(tokens[index].type == 'SPLIT'){
                match('SPLIT');
            }
            return paragraph;
       }
       /* sentence */
       const sentence = ()=>{
            let sentence = {
                nodeType : 'sentence',
                child : []
            };
            let i = 0;
            let sentence_first = [
                'EM','STRONG','EMSTRONG',
                'TEXT','`'
            ];
            while(sentence_first.some(val=>{
                return val == tokens[index].type;
            })){
                let res = null;
                switch(tokens[index].type){
                    case 'EM' :
                        res = style();
                        break;
                    case 'STRONG' :
                        res = style();
                        break;
                    case 'EMSTRONG' :
                        res = style();
                        break;
                    case 'TEXT' : 
                        res = {};
                        res.nodeType = 'text';
                        res.text = match('TEXT');
                        break;
                    case '`' : 
                        res = inlinecode();
                        break;
                }
                sentence.child[i] = res;
                i++;
            }
            return sentence;
       }
       /* inlinecode */
       const inlinecode = ()=>{
           let inlinecode = {
               nodeType : 'inlinecode',
               text : null
           };
           match('`');
           inlinecode.text = match('TEXT');
           match('`');
           return inlinecode;
       }
       /* style */
       const style = ()=>{
           let style = {
               nodeType : 'style',
               sign : null,
               text : null
           }
           let style_first = [
               'EM','STRONG','EMSTRONG'
           ];
           if(style_first.some(val=>{
               return val == tokens[index].type
           })){
               style.sign = match(tokens[index].type);
           }
           style.text = match('TEXT');
           if(style_first.some(val=>{
            return val == tokens[index].type
            })){
                match(tokens[index].type);
            }
            return style;
       }
       /* blockcode */
       const blockcode = ()=>{
           let blockcode = {
               nodeType : 'blockcode',
               lag : null,
               code : null
           }
           match('```');
           //语言类型可有可无
           if(tokens[index].type == 'TEXT'){
                blockcode.lag = match('TEXT');
           }
           //SPLIT也是可有可无
           if(tokens[index].type == 'SPLIT'){
                match('SPLIT');
           }
           blockcode.code = match('TEXT');
           //SPLIT也是可有可无
           if(tokens[index].type == 'SPLIT'){
                match('SPLIT');
           }
           match('```');
           return blockcode;
        }
       /* img */
       const img = ()=>{
           let img = {
               nodeType : 'img',
               text : null,
               url : null
           }
           match('!');
           match('[');
           img.text = match('TEXT');
           match(']');
           match('(');
           img.url = match('URL');
           match(')');
           return img;
       }
       /* altlink */
       const altlink = ()=>{
           let altlink = {
               nodeType : 'altlink',
               text : null,
               url : null
           }
           match('[');
           altlink.text = match('TEXT');
           match(']');
           match('(');
           altlink.url = match('URL');
           match(')');
           return altlink;
       }
       /* simlink */
       const simlink = ()=>{
           let simlink = {
               nodeType : 'simlink',
               url : null
           }
           match('<');
           simlink.url = match('URL');
           match('>');
           return simlink;
       }
       /* quote */
       const quote = ()=>{
           let quote = {
                nodeType : 'quote',
                child : null
           }
           match('>>');
           quote.child = sentence();
           return quote;
       }
       /* olist */
       const olist = ()=>{
           let olist = {
                nodeType : 'olist',
                child : null
           }
           match('OL');
           olist.child = sentence();
           return olist;
       }
       /* ulist */
       const ulist = ()=>{
           let ulist = {
                nodeType : 'ulist',
                child : null
           }
           match('UL');
           ulist.child = sentence();
           return ulist;
       }

       //主控程序:执行递归下降分析
       this.tnode.tree = article();
   }
}
module.exports = {
    MKPraser
}