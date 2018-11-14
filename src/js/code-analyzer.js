import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    let parsed = esprima.parseScript(codeToParse,{loc: true});
    return parsed ;} ;//throw it
/*   function parsedToModel(parsed) {
        parsed.body
        return undefined;
    }

    function parseExprStatement(expr) {
        return undefined;
    }

    function parseReturn(retExpr) {
        let arg=retExpr.argument;
        let res =arg.type === 'Identifier'?  arg.name :
        return undefined;
    }

    function parseBlock(body) {
        let parseBodyExpr = (expr)=>
            expr.type === 'VariableDeclaration' ? parseVarDecl(expr):
                expr.type === 'ExpressionStatement' ? parseExprStatement(expr):
                    expr.type === 'WhileStatement' ? parseWhile(expr):
                        expr.type === 'IfStatement' ? parseIfExp(expr):
                            expr.type === 'ReturnStatement' ? parseReturn(expr):
                                Error('unrecognized expression: '+expr.type);

        return body.reduce(parseBodyExpr,[]);
    }
    function parseVarDecl(varDec) {
        return undefined;
    }
    function parseAssignment(assignment) {
        return undefined;
    }
    function parseWhile(whileExp) {
        return undefined;
    }
    function parseIfExp(Exp) {
        return undefined;
    }
   return /*parsedToModel (parsed);
};*/

export {parseCode};
