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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models"));
// import cors from 'cors';
const routes_1 = __importDefault(require("./routes"));
// import productsRoutes from './routes/products';
// import checkoutRoutes from './routes/checkout';
// import authRoutes from './routes/auth';
// import usersRoutes from './routes/users';
// import healthRoutes from './routes/health';
// import sequelize from './model';
// import authentication from './middleware/authentication';
// import cookieParser from 'cookie-parser';
// import { csrfProtection } from './middleware/csrf';
const PORT = process.env.PORT || 4001;
const app = (0, express_1.default)();
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));
app.use(express_1.default.json());
// app.use(cookieParser());
// app.use(authentication);
// app.use(csrfProtection);
// app.use('/api/health', healthRoutes);
app.use('/api/v2', routes_1.default);
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield models_1.default.authenticate();
            console.log('Connected to database');
            if (process.env.NODE_ENV === 'development') {
                yield models_1.default.sync();
                // await sequelize.sync({ alter: true });
                // use if error occurs WARNING: this will delete all data
                // await sequelize.sync({ force: true })
                console.log('All models were synchronized successfully');
            }
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
            process.on('exit', () => {
                models_1.default.close()
                    .then(() => console.log('Closed the database connection successfully'))
                    .catch((err) => console.error('Error closing the database connection', err));
            });
        }
        catch (err) {
            console.error('An error occurred while starting the application', err);
        }
    });
})();
