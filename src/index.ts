import { app } from "./app"
import { runDbMongoose } from "./db/db-mongoos"


const port = 3001



const startApp = async () => {
  await runDbMongoose()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp()