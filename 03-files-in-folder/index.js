const fs = require('fs');
const path = require('path')

fs.readdir(path.join(__dirname, 'secret-folder'), function(err, items) {

    for (var i = 0; i < items.length; i++) {
        let nameprocessor = items[i].split('.');
        let extention = nameprocessor.pop();
        let filename = nameprocessor.join('.')

        let fileSize = new Promise((resolve, reject) => {
            fs.stat(path.join(__dirname, 'secret-folder', items[i]),
                function(err, stats) {
                    if (stats.isFile()) {

                        var result = stats.size;
                        resolve(result);
                    } else {
                        reject();
                    }
                })
        });

        fileSize.then(result => {
                console.log(filename + ' - ' + extention + ' - ' + result + ' b');
            },
            error => {}
        );
    }
});