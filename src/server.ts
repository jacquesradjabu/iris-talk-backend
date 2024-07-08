/**
 * @license
 * Copyright 2024 Birusha Ndegeya, sofia and Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import express from 'express';
import cors from 'cors';
import notFound from './controllers/notfound';
import * as loginRouter from './api/login.router';
import * as registerRouter from './api/register.router';
import * as messageRouter from './api/message.router';
import * as userRouter from './api/users.router';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', userRouter.router);
app.use('/api/v1/messages', messageRouter.router);
app.use('/login', loginRouter.router);
app.use('/register', registerRouter.router);
app.use('*', notFound);
export default app;