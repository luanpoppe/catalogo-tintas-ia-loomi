import { app } from "./app";
import { env } from "./env";

app.listen(
  {
    port: env.PORT,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error({ err });
      throw new Error(err.message);
    }
    console.log(`Server running on port ${env.PORT}`);
  }
);
