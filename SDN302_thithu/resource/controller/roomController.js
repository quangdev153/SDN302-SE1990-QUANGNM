const Room = require('../models/room')

exports.getRooms=async (req,res) =>{
    try{
        const rooms = await Room.find().sort({roomName:-1})
        const result = rooms.map(room =>{
            const seats = room.seats || [];
            const vipCount= seats.filter(seat => seat.type==="VIP").length
            return {
                id: room._id,
                name: room.roomName,
                totalSeats: seats.length,
                vipCount: vipCount
            }
        })
        return res.status(200).json(result)
        // .json({
        //     "id": rooms._id,
        //     "name": rooms.roomName,
        //     // "totalSeats": rooms.seats.length,
        //     // "vipCount": vipCounts
        // })
    }
    catch(e){
        return res.status(400).json(e)
    }
}