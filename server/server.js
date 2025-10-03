import app from "./index.js";
import chalk from "chalk";

const port = 3000;

app.listen(port, () => {
  console.log(`                      `);
  console.log(
    chalk.white.bgRgb(0, 98, 15)(` Starting Express Server                 `)
  );
  console.log(
    chalk.white.bgRgb(0, 98, 15)(` Server Running at http://localhost:${port} `)
  );

  console.log(`                      `);
});
