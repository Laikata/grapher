const express = require("express")
const morgan = require("morgan")
const path = require("path")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server);

app.set("port", process.env.PORT || 80)
app.set("views", "views/")
app.set("view engine", "ejs")

app.use(morgan("dev"))
app.use("/public", express.static(path.join(__dirname, "public/")))

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/admin", (req, res) => {
    res.render("admin")
})

io.on("connection", (socket) => {
    console.log("Client connected to socket")
    socket.on("ignition", () => {
        console.log("Ignition!")
        socket.broadcast.emit("ignition")
    })
    socket.on("next-stage", () => {
        console.log("Next stage")
        socket.broadcast.emit("next-stage")
    })
})

server.listen(app.get("port"), () => {
    console.log(`Web server running on port ${app.get("port")}`)
})
