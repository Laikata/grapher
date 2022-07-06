var socket = io()

function t_minus(ignition_time){
    time_diff = (Date.now() - ignition_time) / 1000
    mins = ("0" + Math.floor(time_diff / 60)).slice(-2);
    secs = ("0" + Math.floor(time_diff % 60)).slice(-2);
    return `T+${mins}:${secs}`
}

socket.on("ignition", () => {
    ignition_time = Date.now()
    setInterval(() => {
        document.querySelector(".upper-banner .time-est").textContent = t_minus(ignition_time);
    }, 1000)
})

{
    var current_stage = 0
    var stage_should_wait = 0

    socket.on("next-stage", () => {
        if(current_stage+1 < stages.length){
            current_stage++
            stage_should_wait = stages[current_stage].wait
        }
    })

    stages = [
        { wait: 0, name: "Ignición"},
        { wait: 10, name: "Desplegue CanSat"},
        { wait: 5, name: "Paracaídas"},
        { wait: 6, name: "Aterrizaje"},
        { wait: 0, name: ""}, // Dummy stage
    ]

    var canvas = document.querySelector(".progress canvas")
    var ctx = canvas.getContext("2d")

    setInterval(() => {
        canvas.width = window.innerWidth
        canvas.height = 50

        ctx.strokeStyle = "#44475a"
        ctx.beginPath()
        ctx.moveTo(0, 15)
        ctx.lineTo(canvas.width, 15)
        ctx.stroke()
        ctx.strokeStyle = "#f8f8f2"
        ctx.beginPath()
        ctx.moveTo(0, 15)
        ctx.lineTo(canvas.width/2, 15)
        ctx.stroke()

        for(var i = 0; i < stages.length; i++){
            console.log(stage_should_wait)

            if(current_stage > i) ctx.strokeStyle = "#f8f8f2"
            else ctx.strokeStyle = "#44475a"
            ctx.fillStyle = "#f8f8f2"

            var x = canvas.width/2 + stage_should_wait*25
            if(i > current_stage){
                for(var j = 1; j <= i - current_stage; j++){
                    x += stages[current_stage+j].wait*25
                }
            }
            else if(i < current_stage){
                for(var j = 0; j > i - current_stage; j--){
                    x -= stages[current_stage+j].wait*25
                }
            }

            ctx.beginPath()
            ctx.moveTo(x, 5)
            ctx.lineTo(x, 25)
            ctx.stroke()
            
            ctx.font = "14px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(stages[i].name, x, 40)
        }

        if(stage_should_wait > 0) stage_should_wait -= 1/20
    }, 50)
}
