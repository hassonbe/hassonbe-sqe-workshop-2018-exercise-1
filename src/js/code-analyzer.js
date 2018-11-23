import * as esprima from 'esprima';

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function parseBinaryExpression(expr) {
    let right = typeof parseExpr(expr.right) ==='string' ? parseExpr(expr.right) :JSON.stringify (parseExpr(expr.right));
    let left =   typeof parseExpr(expr.left) ==='string' ? parseExpr(expr.left) :JSON.stringify (parseExpr(expr.left));
    let operator =  expr.operator;
    return left.concat(' ',operator,' ',right);
}
function parseParams (expr){
    return{line:parseLoc(expr.loc),type:'variable declaration',name:expr.name,condition:'',value:''};
}
function parseFunction(parsed) {
    let params = parsed.params.map(parseParams);
    let body =parseExpr(parsed.body);
    return [{line:parseLoc(parsed.loc),type:'function declaration',name:parseExpr(parsed.id),condition:'',value:''}].concat(params,body);
}

function parseLoc(loc){
    return (loc.start.line);
}
function parseUnaryExpression(expr){
    return expr.operator+parseExpr(expr.argument);
}
function parseReturn(retExpr) {
    return{line:parseLoc(retExpr.loc),type:'return statement',name:'',condition:'',value:parseExpr(retExpr.argument)};
}

function parseMember(expr) {
    return parseExpr(expr.object)+'['+parseExpr(expr.property)+']';
}

function parseIdentifier(expr) {
    return expr.name;
}

function parseLiteral(expr) {
    return expr.value;
}

function parseExprStatement(expr) {
    return parseExpr(expr.expression);
}
function parseVarDeclarator(expr) {
    let value = expr.init == null||undefined ?'': parseExpr(expr.init);
    return {line:parseLoc(expr.loc),type:'variable declaration',name:parseExpr(expr.id),condition:'',value:value};
}
function parseBlock(expr) {
    return expr.body.map(parseExpr);
}

function parseFor(expr) {
    let body = parseExpr(expr.body);
    let test =parseExpr(expr.test);
    let init = parseExpr(expr.init);
    let update = parseExpr(expr.update);
    return [{line:parseLoc(expr.loc),type:'for statement',name:'',condition:test,value:''}].concat(init,update,body);
}

function parseUpdate(expr) {
    let name = parseExpr(expr.argument);
    let line =parseLoc( (expr.argument.loc));
    return {line:line,type:'update expression',name:name,condition:'',value:(name+expr.operator)};
}
function cont3(expr) {
    return expr.type === 'BlockStatement' ? parseBlock(expr):
        expr.type === 'ForStatement' ? parseFor(expr):
            expr.type ==='UpdateExpression' ? parseUpdate(expr):
                Error('unrecognized expression: '+expr.type);
}

function parseExpr(expr) {
    let cont2 = (expr)=>
        expr.type === 'Literal' ? parseLiteral(expr):
            expr.type === 'MemberExpression' ? parseMember(expr):
                expr.type === 'AssignmentExpression' ? parseAssignment(expr):
                    expr.type === 'FunctionDeclaration' ? parseFunction(expr) :
                        cont3(expr);
    let cont1 = (expr)=>
        expr.type === 'ReturnStatement' ? parseReturn(expr):
            expr.type === 'BinaryExpression' ? parseBinaryExpression(expr):
                expr.type === 'UnaryExpression' ?parseUnaryExpression(expr):
                    expr.type === 'Identifier' ? parseIdentifier(expr):
                        cont2(expr);
    return expr.type === 'VariableDeclaration' ? parseVarDecl(expr) :
        expr.type === 'ExpressionStatement' ? parseExprStatement(expr) :
            expr.type === 'WhileStatement' ? parseWhile(expr) :
                expr.type === 'IfStatement' ? parseIfExp(expr,'null') :
                    cont1(expr);
}
function parseVarDecl(varDec) {
    return varDec.declarations.map(parseVarDeclarator);
}
function parseAssignment(expr) {
    return {line:parseLoc(expr.loc),type:'assignment expression',name:parseExpr(expr.left),condition:'',value:parseExpr(expr.right)};
}
function parseWhile(expr) {
    let body = parseExpr(expr.body);
    return [{line:parseLoc(expr.loc),type:'while statement',name:'',condition:parseExpr(expr.test),value:''}].concat(body);
}
function parseIfExp(expr,isAlternate) {
    let consequent = parseExpr(expr.consequent);
    let test =parseExpr(expr.test);
    let alternate = expr.alternate===null ? []:expr.alternate.type ==='IfStatement' ? parseIfExp(expr.alternate,'elseIf'):[{line:parseLoc(expr.alternate.loc)-1,type:'else statement',name:'',condition:'',value:''} ,parseExpr(expr.alternate)] ;
    let type = isAlternate === 'elseIf' ? 'else if statement' :  'if statement';
    return [{line:parseLoc(expr.loc),type:type,name:'',condition:test,value:''}].concat(consequent,alternate);
}

const parseCode = (codeToParse) => {
    let parsed = esprima.parseScript(codeToParse,{loc: true});
    return flatten(parsed.body.map(parseExpr));
};

export {parseCode};

