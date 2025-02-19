const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3030;
const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser")
const morgan = require("morgan");


dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(morgan("dev"))

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogcategory', blogCatRouter);
app.use('/api/brand', brandRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
