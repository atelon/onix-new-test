const Main = require("./lib/Main");
const Logger = require("./lib/Logger");

Main.main().catch((err) => Logger.error(err));
