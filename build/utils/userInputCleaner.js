"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieIdCleaner = exports.listNameCleaner = void 0;
function listNameCleaner(listName) {
    return listName.replace(/[^A-Za-z0-9]/g, '_').trim();
}
exports.listNameCleaner = listNameCleaner;
function movieIdCleaner(str) {
    const numArr = str.split(',').map(Number).sort();
    const result = [
        ...new Set(numArr.filter((x) => {
            return typeof x === 'number' && x < 7 && x > 0;
        })),
    ];
    return result;
}
exports.movieIdCleaner = movieIdCleaner;
