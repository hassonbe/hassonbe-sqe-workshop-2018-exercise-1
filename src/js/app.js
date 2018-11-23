import $ from 'jquery';
import {parseCode} from './code-analyzer';

function createTableRow(entry) {
    return '<tr><td>'+entry.line+'</td><td>'+entry.type+'</td><td>'+entry.name+'</td><td>'+entry.condition+'</td><td>'+entry.value+'</td></tr>';
}

function parsedTotable(parsedCode) {
    return (parsedCode.map(createTableRow)).join('\n');
}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').find('tbody').append(parsedTotable(parsedCode));
    });
});
