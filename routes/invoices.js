const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

router.get('/',async(req,res,next) =>{
    try{
        const results =await db.query(`select * from invoices`);
        return res.json({invoices: results.rows})
    }
    catch(e){
        return next(e)
    }
})

router.get('/:id', async(req,res,next) =>{
    try{
        const { id } =req.params
        const result = await db.query(`select * from invoices join companies on companies.code=invoices.comp_code where id=$1`,[id])
        if(result.rows.length == 0){
            throw new ExpressError("Invoice cannot be found",404)
        }
        const data= result.rows[0]
        const invoice ={id:data.id,amt: data.amt,paid: data.paid,add_date: data.add_date,paid_date: data.paid_date,
                        company:{code:data.comp_code,name: data.name,description: data.description}}
        return res.json({"invoice": invoice})
        
    }
    catch(e){
        return next(e)
    }
})

router.post('/',async(req,res,next) =>{
    try{
        const { comp_code,amt,paid, paid_date }= req.body
        const result = await db.query(`insert into invoices (comp_code,amt) values ($1,$2) returning id,comp_code,amt`,[comp_code,amt])
        return res.json({invoice:result.rows[0]})
    }
    catch(e){
        return next(e)
    }
})

router.put('/:id',async(req,res,next) =>{
    try{
        const { id }= req.params
        const { amt, paid, paid_date }= req.body
        const result = await db.query(`update invoices set amt=$1, paid=$2 ,paid_date=$3 where id=$4 returning id,comp_code,amt,paid,add_date,paid_date`,[amt,paid,paid_date,id])
        if(result.rows.length == 0){
            throw new ExpressError("Invoice cannot be found",404)
        }
        return res.json({invoice:result.rows[0]})
    }
    catch(e){
        return next(e)
    }
})

router.delete('/:id',async(req,res,next) =>{
    try{
        const {id}=req.params
        const results=await db.query(`delete from invoices where id=$1`,[id])
        if(results.rows.length == 0){
            throw new ExpressError("Invoice cannot be found",404)
        }
        return res.send({msg:"Invoice deleted"})
    }
    catch(e){
        return next(e)
    }
})

router.get('/')
module.exports =router;