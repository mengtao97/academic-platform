export function GetRecommendedPaperFromUserID(
    user_ID, call_back
) {
    if (user_ID == null) {
        user_ID = 'null'
    }

    const paper_history_path = '../log/paper/'
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const file_path = paper_history_path + user_ID + '.' + year + '-' + month + '.log'

    var fs = require('fs');
    if (!fs.existsSync(file_path)) {
        return [
            ['big data', 1],
            ['cloud computing', 1],
            ['co']
        ]
    }
    var readline = require('readline');
    var file_reader = fs.createReadStream(file_path);
    var line_reader = readline.createInterface({
        input: file_reader,
    });

    var keyReg = new RegExp("ab+c");
    var keywords = []
    line_reader.on('line', (line) => {
        console.log(index, line);
        var key = keyReg.exec(line)
        console.log('key = ', key)
    });

    line_reader.on('close', () => {
        return keywords
    })
}