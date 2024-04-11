import app from "./app"
import RouteRegister from "./routes/authRoutes"

const PORT=process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}` )
})