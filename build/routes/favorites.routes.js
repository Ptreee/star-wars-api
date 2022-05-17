"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favorites_1 = require("../controllers/favorites");
const router = express_1.default.Router();
router.get('/', favorites_1.getAllFavorites);
router.post('/', favorites_1.createFavorites);
router.get('/:id', favorites_1.getSingleFavorite);
router.get('/:id/file', favorites_1.getSingleFavoriteFile);
exports.default = router;
