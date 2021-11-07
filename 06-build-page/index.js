const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');


// read template file
function readFile(filename) {
    return new Promise((resolve, reject) => {
        const readableStream = fs.createReadStream(
            path.join(__dirname, filename),
            'utf-8'
        );
        let data = '';
        let nameofMyFile = path.basename(filename).replace('.html', '');

        readableStream.on('data', chunk => data += chunk);
        readableStream.on('end', () => {
            resolve([nameofMyFile, data]);
        });
        readableStream.on('error', error => {
            console.log('Error', error.message);
            reject()
        });


    });
}

const folderCreate = new Promise((resolve, reject) => {
    fs.exists(path.join(__dirname, 'project-dist'), (err) => {
        if (err) {
            resolve();
            return;
        }

        fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
});

function template(str, obj) {
    let result = str;

    Object.keys(obj).forEach(key => {
        result = result.replace(`{{${key}}}`, obj[key]);
    });

    return result;
}


function copyFiles(folder, items) {
    for (let i = 0; i < items.length; i++) {
        let FiletoCopy = path.join(__dirname, 'assets', folder, items[i]);

        try {
            promises.copyFile(FiletoCopy, path.join(__dirname, 'project-dist', 'assets', folder, items[i]));

        } catch (e) {
            console.log(e.name + ":" + e.message + "\n" + e.stack);

        }
    }
}

function deliteFiles(items, itemsCopy, folder) {
    for (let i = 0; i < itemsCopy.length; i++) {
        let Filetodelete = path.join(__dirname, 'project-dist', 'assets', folder, itemsCopy[i]);
        try {
            if (!items.includes(itemsCopy[i])) {

                fs.unlink(Filetodelete, function(err) {
                    if (err) return console.log(err);

                });

            };

        } catch (e) {
            console.log(e.name + ":" + e.message + "\n" + e.stack);

        }
    }
}
var tepmlatesList = {};
const allTemplates = new Promise((resolve, reject) => {

    fs.readdir(path.join(__dirname, 'components'), function(err, items) {
        if (err) { console.log(err) };
        let promissFuckingList = [];
        for (let i = 0; i < items.length; i++) {
            let component = items[i];

            if (path.extname(component.toString()) == '.html') {
                let filedata = readFile(path.join('components', component.toString()));
                promissFuckingList.push(filedata);

            }
        }


        Promise.all(promissFuckingList).then(result => {
            for (let i = 0; i < result.length; i++) {
                let filename = result[i][0];

                let keyname = filename;

                tepmlatesList[keyname] = result[i][1];
            }

            resolve(tepmlatesList);
        })


    })
});

const readTemplate = readFile('template.html');

Promise.all([readTemplate, allTemplates, folderCreate]).then(
    ([templateData, tepmlatesList]) => {

        return template(templateData[1], tepmlatesList);
    },
    error => { console.log(error) })

.then(result => new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), result, (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
}));


//make slyle file

folderCreate.then(result => new Promise((resolve, reject) => {


    fs.readdir(path.join(__dirname, 'styles'), function(err, items) {

        const outputFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
        for (let i = 0; i < items.length; i++) {
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

    })
}))


// copy assets
// create assets
folderCreate.then(result => {
        let newFolder = new Promise((resolve, reject) => {
            fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), function(err) {});
            resolve();
            reject();

        });

        // read assets and copy
        newFolder.then(result => {
            fs.readdir(path.join(__dirname, 'assets'), function(err, folders) {
                if (err) throw err;

                for (let i = 0; i < folders.length; i++) {
                    let currentFolder = folders[i].toString();

                    // create folder in assets
                    let newAssetFolder = new Promise((resolve, reject) => {

                        fs.mkdir(path.join(__dirname, 'project-dist', 'assets', currentFolder), function(err) {});
                        resolve();

                    });
                    // read items in assets in folder
                    newAssetFolder.then(result => new Promise((resolve, reject) => {
                            fs.readdir(path.join(__dirname, 'assets', currentFolder), function(err, items) {
                                if (err) throw err;
                                copyFiles(currentFolder, items);
                                resolve(items);
                            })

                        })).then(items => new Promise((resolve, reject) => {
                            fs.readdir(path.join(__dirname, 'project-dist', 'assets', currentFolder), function(err, itemsCopy) {
                                if (err) throw err;
                                resolve([items, itemsCopy]);
                            })


                        }))
                        .then(([items, itemsCopy]) => {
                            deliteFiles(items, itemsCopy, currentFolder);
                        });
                }
            })
        })
    },
    error => {}
);