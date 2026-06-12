import { Router } from "express";
import { Database } from "../database/database.js";
import { personCreateBodySchema, personIdSchema, patchPersonBodySchema } from "../schemas/person.schema.js";
import { validate } from "../middleware/zod.js";

export const personRoutes = Router();

personRoutes.get("/", (req, res, next) => {
  try {
    const persons = Database.Persons.getAllPersons()
    res.status(200).json(persons)
  } catch (err) {
    next(err)
  }
});

personRoutes.post("/", validate({ body: personCreateBodySchema }), (req, res, next) => {
  try {
    const personParams = {
      name: req.body.name,
      photo_id: req.body.photo_id
    }
    const person = Database.Persons.addPerson(personParams)
    res.status(201).json(person)
  } catch (err) {
    next(err)
  }
});

personRoutes.get("/:id", validate({ params: personIdSchema }), (req, res, next) => {
  try {
    const person = Database.Persons.getPerson(req.params.id)
    if (!person) return next({ status: 404, message: "Person with this id was not found" })

    res.status(200).json(person)
  } catch (err) {
    next(err)
  }
});

personRoutes.patch("/:id", validate({ params: personIdSchema, body: patchPersonBodySchema }), (req, res, next) => {
  try {
    const existingPerson = Database.Persons.getPerson(req.params.id)
    if (!existingPerson) return next({ status: 404, message: "Person with this id was not found" })

    Database.Persons.updatePerson(req.params.id, req.body)
    const person = Database.Persons.getPerson(req.params.id)

    res.status(200).json(person)
  } catch (err) {
    next(err)
  }
});

personRoutes.delete("/:id", validate({ params: personIdSchema }), (req, res, next) => {
  try {
    const existingPerson = Database.Persons.getPerson(req.params.id)
    if (!existingPerson) return next({ status: 404, message: "Person with this id was not found" })

    Database.Persons.removePerson(req.params.id)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
});
