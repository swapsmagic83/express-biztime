const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

router.get('/', async(req,res,next) =>{
    try{
        const results = await db.query(`select * from companies`);
        return res.json({companies: results.rows})
    }
    catch(e){
        return next(e)
    }
})

router.get('/:code',async(req,res,next) =>{
    try{
        let {code} = req.params
        const companyResult = await db.query(`select * from companies where code=$1`,[code])
        const invoiceResult = await db.query(`select id,amt from invoices join companies on companies.code=invoices.comp_code where comp_code=$1`,[code])
        if(companyResult.rows.length == 0){
            throw new ExpressError("Wrong company",404)
        }
        const company=companyResult.rows[0]
        const invoices=invoiceResult.rows
        company.invoices=invoices.map(i =>i.id)
        return res.json({company: company})
        
    }
    catch(e){
        return next(e)
    }
})

router.post('/',async(req,res,next) =>{
    try{
        const { code,name,description } =req.body;
        const result = await db.query(`insert into companies (code,name,description) values ($1,$2,$3) returning code,name,description`,[code,name,description]);
        return res.json(result.rows[0])

    }
    catch(e){
        return next(e)
    }
})

router.put('/:code', async(req,res,next) =>{
    try{
        const { code }= req.params
        const { name, description } = req.body
        const result = await db.query(`update companies set name=$2, description=$3 where code=$1 returning code,name,description`,[code,name,description]);
        if(result.rows.length == 0){
            throw new ExpressError("Wrong company",404)
        }
        return res.json(result.rows[0])
        
    }
    catch(e){
        return next(e)
    }
})

router.delete('/:code',async(req,res,next) =>{
    try{
        const { code } = req.params
        const results = db.query(`delete from companies where code=$1`,[code]);
        if(results.rows.length == 0){
            throw new ExpressError("Wrong company",404)
        }
        return res.send({msg:"Comapany Deleted"})
    }
    catch(e){
        return next(e)
    }
})
module.exports = router;