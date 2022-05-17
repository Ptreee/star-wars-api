"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const connect_1 = __importDefault(require("./db/connect"));
// [extra security]
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// [imports] utils
const getAllCharacters_1 = require("./utils/getAllCharacters");
const getMovies_1 = require("./utils/getMovies");
const createConnections_1 = require("./utils/createConnections");
// [imports] routes
const films_routes_1 = __importDefault(require("./routes/films.routes"));
const favorites_routes_1 = __importDefault(require("./routes/favorites.routes"));
// [imports] middleware
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
// [docs]
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load('./swagger.yaml');
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.set('trust proxy', 1);
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
// [routes] utility
app.get('/', (req, res) => {
    res.send('<h1>StarWars API v.1.0</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// [routes] API
app.use('/api/v1/films', films_routes_1.default);
app.use('/api/v1/favorites', favorites_routes_1.default);
// [middleware] 404 & error
app.use(not_found_1.default);
app.use(error_handler_1.default);
const port = Number(process.env.APP_PORT) || 8000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connect_1.default.sync({ alter: true });
        yield (0, getAllCharacters_1.getAllCharacters)();
        yield (0, getMovies_1.getAllMovies)();
        yield (0, createConnections_1.createConnections)();
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    }
    catch (error) {
        console.log(error);
    }
});
start();
