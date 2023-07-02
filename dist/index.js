"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routes/posts-router");
const blogs_router_1 = require("./routes/blogs-router");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/posts', posts_router_1.postsRouter);
app.use('/blogs', blogs_router_1.blogsRouter);
/*app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogs.splice(-1, 0);
  posts.splice(-1, 0);
  res.sendStatus(204)
})
*/
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
