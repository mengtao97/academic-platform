module.exports = function GetRecommendedPaperFromUserID(
    user_ID, call_back
) {
    if (user_ID == null) {
        user_ID = 'null'
    }

    const paper_history_path = './log/paper/'
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const file_path = paper_history_path + user_ID + '.' + year + '-' + month + '.log'

    var fs = require('fs');
    if (!fs.existsSync(file_path)) {
        call_back(null, [
            ['big data', 1],
            ['cloud computing', 1],
            ['computer science', 1]
        ])
        return
    }

    readline = require('readline');
    var file_reader = fs.createReadStream(file_path);
    var line_reader = readline.createInterface({
        input: file_reader,
    });

    var keyReg = new RegExp("(?<=\").*(?=\")");
    var keywords = {}
    line_reader.on('line', (line) => {
        var key = keyReg.exec(line)[0]
        if (!(key in keywords)) {
            keywords[key] = 0
        }
        keywords[key] += 1
    });

    line_reader.on('close', () => {
        keywords = Object.keys(keywords).map(key => [key, keywords[key]])
        keywords = keywords.sort((a, b) => b[1] - a[1]).slice(0, 5)
        call_back(null, keywords)
    })
}