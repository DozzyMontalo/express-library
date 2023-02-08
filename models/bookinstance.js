const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

//formating due_back with luxon as a virtual
BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

//formatting due_back in yyyy_mm_dd for input data entry
BookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate();
});

// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);

//The BookInstance represents a specific copy of a book that someone might borrow and includes
//information about whether the copy is available, on what date it is expected back, and "imprint" (or version) details.

//enum: This allows us to set the allowed values of a string. In this case, we use it to specify
//the availability status of our books (using an enum means that we can prevent mis-spellings and arbitrary values for our status).

//default: We use default to set the default status for newly created bookinstances to maintenance
//and the default due_back date to now (note how you can call the Date function when setting the date!).
