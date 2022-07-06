var socket = io()

function ignition(){
    socket.emit("ignition")
    socket.emit("next-stage")
    document.getElementById("ignition-btn").disabled = true
    document.getElementById("next-stage-btn").disabled = false
}

function next_stage(){
    socket.emit("next-stage")
}
