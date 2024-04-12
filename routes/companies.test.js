process.env.NODE_ENV === "test";

const request = require('supertest');
const app = require('../app');
const db = require('../db');
// const { beforeEach, describe } = require('node:test');

let testCompany;
beforeEach(async() =>{
    const result = await db.query(`insert into companies (code,name,description) values ('hp', 'hp', 'But Mc is better') returning code,name,description`);
    testCompany = result.rows[0]
})
// afterEach(async () => {
//     await db.query(`delete from companies`)
//   })
// afterAll(async()=>{
//     await db.end()
// })
describe("GET/companies",()=>{
    test("get a list with one company",async()=>{
        const res= await request(app).get('/companies')
        // console.log(testCompany)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({companies:[testCompany]})
    })
})

describe("GET/companies/:code",()=>{
    test("gets single company",async()=>{
        const res = await request(app).get(`/companies/${testCompany.code}`)
        expect(res.statusCode).toBe(200);
        // const result = await db.query(`insert into companies (code,name,description) values ('hp', 'HP my first', 'But Mc is better') returning code,name,description`);
        // testCompany = result.rows[0]
        // console.log(testCompany)
        // expect(res.body.company.code).toContain({testCompany.code});
    })
    test("Responds with 404 if can't find company", async function() {
        const res = await request(app).get(`/companies/0`);
        expect(res.statusCode).toEqual(404);
      });
    
})

describe("POST/companies",()=>{
    test("create new company",async()=>{
        const response = await request(app)
        .post(`/companies`)
        .send({code:"nikon",name:"nikon",description:"my first camera"})
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({code:"nikon",name:"nikon",description:"my first camera"})
    })
})

describe("DELETE/companies/:code",()=>{
    test("delete single company",async()=>{
        const code = testCompany.code
        const response = await request(app).delete(`/companies/${code}`)
        // expect(response.statusCode).toBe(200)
        
    // expect(response.body).toEqual({msg: "Company Deleted" });
    })
})
afterEach(async () => {
    await db.query(`delete from companies`)
  })
afterAll(async()=>{
    await db.end()
})