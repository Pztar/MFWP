import Sequelize from "sequelize";
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
import User from "./user";
import Post from "./post";
import Hashtag from "./hashtag";
import Comment from "./comment";
import Auction from "./auction";
import Product from "./product";
import Report from "./report";

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Hashtag = Hashtag;
db.Auction = Auction;
db.Product = Product;
db.Report = Report;

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Hashtag.init(sequelize);
Auction.init(sequelize);
Product.init(sequelize);
Report.init(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
Hashtag.associate(db);
Auction.associate(db);
Product.associate(db);
Report.associate(db);

export default db;
