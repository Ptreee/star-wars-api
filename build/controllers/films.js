"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilms = void 0;
const http_status_codes_1 = require("http-status-codes");
const index_1 = require("../models/index");
const getAllFilms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield index_1.Movie.findAll({
            raw: true,
            attributes: { exclude: ['charactersInMovie'] },
        });
        res.status(http_status_codes_1.StatusCodes.OK).json({ movies: data });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: error });
    }
});
exports.getAllFilms = getAllFilms;
