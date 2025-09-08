import app from "./app";
import config from "./config";

const port = config.port;
app.listen(port, () => logger.info(`Server listening on port ${port}`));