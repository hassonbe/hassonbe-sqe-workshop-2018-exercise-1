import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            JSON.stringify([{line:1,type:'variable declaration',name:'a',condition:'',value: 1}])
        );
    });

    it('is line of code displayed correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('\n\n\nlet a = 1;')),
            JSON.stringify([{line:4,type:'variable declaration',name:'a',condition:'',value: 1}])
        );
    });

    it('is parsing a simple function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function fun(X, V){\n' +
                '   let a = 1;\n' +
                '}')),
            JSON.stringify([{line:1,type:'function declaration',name:'fun',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'X',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'V',condition:'',value: ''},
                {line:2,type:'variable declaration',name:'a',condition:'',value: 1}])
        );
    });

    it('parsing max function with if and return', () => {
        assert.equal(
            JSON.stringify(parseCode('function max(A, b){\n' +
                '        if ( A > b){\n' +
                '            return A;\n' +
                '        }\n' +
                '        return b;\n' +
                '}')),
            JSON.stringify([{line:1,type:'function declaration',name:'max',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'A',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'b',condition:'',value: ''},
                {line:2,type:'if statement',name:'',condition:'A > b',value: ''},
                {line:3,type:'return statement',name:'',condition:'',value: 'A'},
                {line:5,type:'return statement',name:'',condition:'',value: 'b'}])

        );
    });

    it('parsing max function  in one line and returning a string', () => {
        assert.equal(
            JSON.stringify(parseCode('function max(A, b){' +
                '        if ( A > b){' +
                '            return \'A is bigger\';' +
                '        }' +
                '        return \'b is bigger\';' +
                '}')),
            JSON.stringify([{line:1,type:'function declaration',name:'max',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'A',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'b',condition:'',value: ''},
                {line:1,type:'if statement',name:'',condition:'A > b',value: ''},
                {line:1,type:'return statement',name:'',condition:'',value: 'A is bigger'},
                {line:1,type:'return statement',name:'',condition:'',value: 'b is bigger'}])

        );
    });

    it('check for unsupported expression type', () => {
        assert.equal(
            JSON.stringify(parseCode('let a =  5 > 6 ? 7 : 0;')),
            JSON.stringify([{line:1,type:'variable declaration',name:'a',condition:'',value: {}}])
        );
    });

    it('parsing binary search as shown in the assignment example  ', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            JSON.stringify([{line:1,type:'function declaration',name:'binarySearch',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'X',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'V',condition:'',value: ''},
                {line:1,type:'variable declaration',name:'n',condition:'',value: ''},
                {line:2,type:'variable declaration',name:'low',condition:'',value: ''},
                {line:2,type:'variable declaration',name:'high',condition:'',value: ''},
                {line:2,type:'variable declaration',name:'mid',condition:'',value: ''},
                {line:3,type:'assignment expression',name:'low',condition:'',value: 0},
                {line:4,type:'assignment expression',name:'high',condition:'',value: 'n - 1'},
                {line:5,type:'while statement',name:'',condition:'low <= high',value: ''},
                {line:6,type:'assignment expression',name:'mid',condition:'',value: 'low + high / 2'},
                {line:7,type:'if statement',name:'',condition:'X < V[mid]',value: ''},
                {line:8,type:'assignment expression',name:'high',condition:'',value: 'mid - 1'},
                {line:9,type:'else if statement',name:'',condition:'X > V[mid]',value: ''},
                {line:10,type:'assignment expression',name:'low',condition:'',value: 'mid + 1'},
                {line:11,type:'else statement',name:'',condition:'',value: ''},
                {line:12,type:'return statement',name:'',condition:'',value: 'mid'},
                {line:14,type:'return statement',name:'',condition:'',value: '-1'}])

        );
    });
    it('is parsing a for loop correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(I=0 ; I < 5; I++){\n' +
                'I++;\n' +
                'if (5  < 6)\n' +
                '   b =  b % I;\n' +
                '}')),
            JSON.stringify([{line:1,type:'for statement',name:'',condition:'I < 5',value: ''},
                {line:1,type:'assignment expression',name:'I',condition:'',value: 0},
                {line:1,type:'update expression',name:'I',condition:'',value: 'I++'},
                {line:2,type:'update expression',name:'I',condition:'',value: 'I++'},
                {line:3,type:'if statement',name:'',condition:'5 < 6',value: ''},
                {line:4,type:'assignment expression',name:'b',condition:'',value: 'b % I'}])
        );
    });

    it('parsing function with nested loop', () => {
        assert.equal(
            JSON.stringify(parseCode('function multiplicationTable (){\n' +
                '     for(I = 1 ; I <= 10 ;I++){\n' +
                '       for(J = 1 ; J <= 10 ; J++)\n' +
                '           A[I][J]= I * J ;\n' +
                '}\n' +
                'return A;\n' +
                '}')),
            JSON.stringify([{line:1,type:'function declaration',name:'multiplicationTable',condition:'',value: ''},
                {line:2,type:'for statement',name:'',condition:'I <= 10',value: ''},
                {line:2,type:'assignment expression',name:'I',condition:'',value: 1},
                {line:2,type:'update expression',name:'I',condition:'',value: 'I++'},
                {line:3,type:'for statement',name:'',condition:'J <= 10',value: ''},
                {line:3,type:'assignment expression',name:'J',condition:'',value: 1},
                {line:3,type:'update expression',name:'J',condition:'',value: 'J++'},
                {line:4,type:'assignment expression',name:'A[I][J]',condition:'',value: 'I * J'},
                {line:6,type:'return statement',name:'',condition:'',value: 'A'}])

        );
    });
});
