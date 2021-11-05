const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');

fs.readdir(path.join(__dirname, 'styles'), function(err, items) {



    const outputFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    for (var i = 0; i < items.length; i++) {
        let namefile = items[i];

        if (path.extname(namefile.toString()) == '.css') {

            let isFile = new Promise((resolve, reject) => {
                fs.stat(path.join(__dirname, 'styles', items[i]),
                    function(err, stats) {

                        if (stats.isFile()) {
                            let result = stats;

                            resolve(result);
                        } else {
                            reject();
                        }
                    })
            });

            isFile.then(result => {

                    const readableStream = fs.createReadStream(
                        path.join(__dirname, 'styles', namefile),
                        'utf-8'
                    );
                    let data = '';

                    readableStream.on('data', chunk => data += chunk);
                    readableStream.on('end', () => outputFile.write(data + '\n'));
                    readableStream.on('error', error => console.log('Error', error.message));

                },
                error => {}
            );

        }
    }

});