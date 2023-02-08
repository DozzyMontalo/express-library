const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//virtual for author's fullname

AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case

  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name && !this.family_name) {
    fullname = "";
  }
  return fullname;
});

//virtual for author's url

AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

//Formatted author's life span with interval of dates of birth and death.
AuthorSchema.virtual("lifespan").get(function () {
  let birth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
  let death = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";

  return `${birth} - ${death}`;
});

// Formatted in yyyy_mm_dd for data entry on form
AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

// Formatted in yyyy_mm_dd for data entry on form
AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

//Export model

module.exports = mongoose.model("Author", AuthorSchema);

// let date = new Date().toISODate();
let date = DateTime.fromJSDate(new Date()).toISODate();
console.log(date);
