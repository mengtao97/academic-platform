function promisify(fn) {
        const callback = (resolve, reject, err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        };
        return (...args) => {
            return new Promise((resolve, reject) => {
                const boundedCallback = callback.bind(null, resolve, reject);
                fn(...args, boundedCallback);
            });
        };
    }
    
const promisifiedUserSearch = await promisify(User.search);

module.exports = {
    Query: {
        async getUsers() {
            try {
                
                const results = promisifiedUserSearch( { query_string: { query: "mengta4" } });
                let res = [];
                for (const result of results.hits.hits) {
                    const thisResult = await User.findById(result._id);
                    res.push(thisResult);
                }
                return res;
            } catch (err) {
                console.error(err);
            }
        },
    }
}