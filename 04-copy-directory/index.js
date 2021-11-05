const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');
// import { copyFile } from 'fs/promises';

let newFolder = new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, 'files-copy'), function(err) {});
    resolve();

});


newFolder.then(result => {

        fs.readdir(path.join(__dirname, 'files-copy'), function(err, itemsCopy) {

            let items = new Promise((resolve, reject) => {
                fs.readdir(path.join(__dirname, 'files'), function(err, items) {

                    copyFiles(items);
                    resolve(items);
                });
            })

            items.then(items => {
                deliteFiles(items, itemsCopy);
            });
        });
    },
    error => {}
);

function copyFiles(items) {
    for (var i = 0; i < items.length; i++) {
        let FiletoCopy = path.join(__dirname, 'files', items[i]);

        try {
            promises.copyFile(FiletoCopy, path.join(__dirname, 'files-copy', items[i]));

        } catch (e) {
            console.log(e.name + ":" + e.message + "\n" + e.stack);

        }
    }
}

function deliteFiles(items, itemsCopy) {
    for (var i = 0; i < itemsCopy.length; i++) {
        let Filetodelete = path.join(__dirname, 'files-copy', itemsCopy[i]);
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