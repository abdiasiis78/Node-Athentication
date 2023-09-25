import server from './api/index.js'
const port = 4000

// server.listen(port, () =>{
//     console.log(`server is runing at port ${port}`);
// } )
server.listen(port, console.log(`server is runing port ${port}`))