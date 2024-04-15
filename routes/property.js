const express = require('express')
const db = require('../db')
const utils = require('../utils')

const router = express.Router()

// get all properties
router.get("/all", (request, response)=>{
    const query = `select * from property`;
    db.pool.execute(query, (error, properties)=>{
        response.send(utils.createResult(error, properties))
    })
})

// add property
router.post('/add', (request, response) => {
    const {
      categoryId,
      title,
      details,
      address,
      contactNo,
      ownerName,
      isLakeView,
      isTV,
      isAC,
      isWifi,
      isMiniBar,
      isBreakfast,
      isParking,
      guests,
      bedrooms,
      beds,
      bathrooms,
      rent,
    } = request.body
  
    const query = `insert into property (categoryId,title,details,address,contactNo,ownerName,isLakeView,isTV,isAC,isWifi,isMiniBar,isBreakfast,isParking,guests,bedrooms,beds,bathrooms,rent) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`
    db.pool.execute(
      query,
      [
        categoryId,
        title,
        details,
        address,
        contactNo,
        ownerName,
        isLakeView,
        isTV,
        isAC,
        isWifi,
        isMiniBar,
        isBreakfast,
        isParking,
        guests,
        bedrooms,
        beds,
        bathrooms,
        rent,
      ],
      (error, result) => {
        response.send(utils.createResult(error, result))
      }
    )
  })

module.exports = router



// "categoryId":,
// "title":,
// "details":,
// "address":,
// "contactNo":,
// "ownerName":,
// "isLakeView":,
// "isTV":,
// "isAC":,
// "isWifi":,
// "isMiniBar":,
// "isBreakfast":,
// "isParking":,
// "guests":,
// "bedrooms":,
// "beds":,
// "bathrooms":,
// "rent":