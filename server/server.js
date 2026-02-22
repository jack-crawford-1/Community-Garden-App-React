// import app from "./index.js";
// import chalk from "chalk";

// const port = 3000;

// app.listen(port, () => {
//   console.log(`                      `);
//   console.log(
//     chalk.white.bgRgb(0, 98, 15)(` Starting Express Server                 `)
//   );
//   console.log(
//     chalk.white.bgRgb(0, 98, 15)(` Server Running at http://localhost:${port} `)
//   );

//   console.log(`                      `);
// });

import app from "./index.js";
import chalk from "chalk";
import { connectDB } from "./db/mongodbConnection.js"; // ✅ import it

const port = process.env.PORT || 3000;

// connect before starting server
connectDB(process.env.URI)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`                      `);
      console.log(
        chalk.white.bgRgb(
          0,
          98,
          15,
        )(` Starting Express Server                 `),
      );
      console.log(
        chalk.white.bgRgb(
          0,
          98,
          15,
        )(` Server Running at http://localhost:${port} `),
      );
      console.log(`                      `);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
