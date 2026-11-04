const Movie = require("../models/movie")
const Showtime = require("../models/showtime")
const Room = require("../models/room")
exports.getMovieById = async(req,res) =>{
    try{
         const movieId = req.params.id
    const movies = await Movie.findById(id)
    const show = movies.map(movie => {
    const showtime =  Showtime.findByMovieId(movie._id)
    const room = Movie.findById(showtime.roomId)
    return{
        title: movie.title,
        duration: movie.duration,
        description: movie.description,
        showtimes: [{
            roomName: room.roomName,
            startTime:showtime.startTime,
            price: showtime.price
        }]
    }
    })   
    return ti
    }
    catch(err){

    }
}