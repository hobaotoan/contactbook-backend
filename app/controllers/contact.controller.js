const { BadRequestError } = require("../errors")
const handlePromise = require("../helpers/promise.helper")
const Contact = require("../models/contact.models")

// Create and Save a new Contact
exports.create = async (req, res, next) => {

    // validate request
    if(!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    // Create a contact
    const contact = new Contact ({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: String(req.body.favorite).toLowerCase() === "true",
    });

    //Save contact in the database
    const [error, document] = await handlePromise(contact.save());

    if(error) {
        return next(new BadRequestError(500,
            "An error occurred while creating the contact"));
    }

    return res.send(document);
};

exports.findAll = async (req, res, next) => {
    const condition = { };
    const name = req.query.name;
    if(name) {
        condition.name = { $regex: new RegExp(name), $option: "i" };
    }

    const [error, documents] = await handlePromise(Contact.find(condition));

    if(error) {
        return next( new BadRequestError(500,
            "An error occurred while retrieving contacts"));
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    const condition = {
        _id: req.params.id,
    };

    const [error, document] = await handlePromise(Contact.findOne(condition));

    if(error) {
        return next(new BadRequestError(500,
            `Error retrieving contact with id = ${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404,
           "Contact not found"));
    }

    return res.send(document);
};

exports.update = async (req, res, next) => {
    if(!req.body) {
        return next(new BadRequestError(400,
            "Data to update can not be empty"));
    }

    const condition = {
        _id: req.params.id,
    };

    const [error,document] = await handlePromise(
        Contact.findOneAndUpdate(condition, req.body, {
            new: true,
        })
    );

    if(error) {
        return next(new BadRequestError(500,
            `Error updating contact with id = ${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404,
            "Contact not found"));
    }

    return res.send({message: "Contact was update successfully"}, );

};

exports.delete = async (req, res, next) => {
    const condition = {
        _id: req.params.id,
    };

    const [error, document] = await handlePromise(
        Contact.findOneAndDelete(condition)
    );

    if(error) {
        return next(new BadRequestError(500,
            `Could not delete contact with id = ${req.params.id}`));
    }

    if(!document) {
        return next(new BadRequestError(404,
            "Contact not found"));
    }

    return res.send({message: "Contact was deleted successfully", });
};

exports.findAllFavorite = async (req, res, next) => {
    const [error, documents] = await handlePromise (
        Contact.find({favorite: true, })
    );

    if(error) {
        return next (new BadRequestError(500,
            "An error occurred while retrieving favorite contacts"));
    }

    return res.send(documents);
};

exports.deleteAll = async (req, res, next) => {
    const [error, data] = await handlePromise(
        Contact.deleteMany({ })
    );

    if(error) {
        return next(new BadRequestError(500,
            "An error occurred while retrieving favorite contacts"));
    }

    return res.send({
        message: `${data.deletedCount} contacts were deleted successfully`,
    });
};